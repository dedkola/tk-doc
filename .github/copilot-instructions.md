# Copilot Instructions for TK Docs

## Repository Overview

**TK Docs** is a production-ready documentation platform built with Next.js 16 and MDX. It's designed as a template for creating modern, high-performance documentation sites (API references, knowledge bases, guides). The project emphasizes exceptional reading experience combined with excellent developer experience.

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js (App Router) | 16.1.5 |
| Runtime | React | 19.2.0 |
| Language | TypeScript (strict mode) | 5.x |
| Styling | Tailwind CSS | 4.x |
| Content | MDX with Frontmatter | - |
| UI Components | Radix UI Primitives | Latest |
| Code Highlighting | Prism.js | 1.30.0 |
| Icons | Lucide React | 0.552.0 |
| Package Manager | pnpm (recommended) | - |
| Linting | ESLint | 9.x |
| Formatting | Prettier | 3.7.4 |

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Project Structure

```
tk-docs/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with dynamic imports
│   ├── page.tsx             # Homepage
│   ├── docs/[...slug]/      # Dynamic MDX routes
│   │   └── page.tsx         # Renders MDX files from content/
│   ├── ui/                  # App-specific UI (search, interface)
│   ├── globals.css          # Global styles + Tailwind
│   └── code-highlight.css   # Prism syntax highlighting
├── components/
│   ├── ui/                  # 30+ Radix-based components (PascalCase)
│   │   ├── buttons/
│   │   ├── forms/
│   │   ├── modals/
│   │   └── [component].tsx  # Individual components
│   ├── mdx/                 # MDX-specific components
│   ├── header.tsx           # Site header (dynamically imported)
│   ├── footer.tsx           # Site footer (dynamically imported)
│   ├── analytics.tsx        # Google Analytics (dynamically imported)
│   ├── TableOfContents.tsx  # Auto-generated from headings
│   └── ShareButtons.tsx     # Social sharing
├── config/                  # Three-layer configuration system
│   ├── config.base.ts       # Base defaults (DO NOT MODIFY)
│   ├── config.private.ts    # Production overrides (committed)
│   ├── config.local.ts      # Dev-only overrides (gitignored)
│   ├── config.local.example.ts
│   └── site.ts              # Config aggregator/merger
├── content/                 # MDX documentation files
│   └── component-examples.mdx
├── lib/                     # Utility functions
│   ├── mdx-utils.ts         # MDX file loading/parsing
│   ├── extract-headings.ts  # TOC generation
│   └── utils.ts             # General utilities (cn helper)
├── hooks/                   # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
├── public/                  # Static assets
├── types/                   # TypeScript definitions
├── next.config.mjs          # Security headers, standalone output
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript config with path aliases
└── Dockerfile               # Multi-stage Docker build
```

## Important Conventions

### File Naming

- **Components**: PascalCase (e.g., `Button.tsx`, `Accordion.tsx`)
- **Utilities**: kebab-case (e.g., `mdx-utils.ts`, `use-mobile.ts`)
- **Config files**: kebab-case (e.g., `config.base.ts`)
- **MDX content**: kebab-case (e.g., `getting-started.mdx`)

### Component Architecture

- All UI components use **Radix UI primitives** for accessibility
- Components follow **controlled/uncontrolled pattern**
- Use **class-variance-authority (cva)** for variant styling
- Use **cn()** utility from `@/lib/utils` to merge Tailwind classes
- Components support **asChild prop** via Radix Slot for composition

Example component structure:
```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const variants = cva("base-classes", {
  variants: { ... },
  defaultVariants: { ... }
});

export function Component({
  className,
  variant,
  ...props
}: React.ComponentProps<"element"> & VariantProps<typeof variants>) {
  return <element className={cn(variants({ variant }), className)} {...props} />;
}
```

### TypeScript Path Aliases

Use these aliases for imports:
- `@/*` - Root directory
- `@components/*` - Components directory
- `@lib/*` - Library directory
- `@app/*` - App directory

Example:
```tsx
import { cn } from "@/lib/utils";
import { Button } from "@components/ui/Button";
```

## Configuration System (Critical)

The project uses a **three-layer configuration system** for easy customization:

1. **config.base.ts** - Base defaults (DO NOT MODIFY)
2. **config.private.ts** - Production overrides (committed to git)
3. **config.local.ts** - Development overrides (gitignored, optional)

**Configuration Merge Order**: base → private → local (later overrides earlier)

### When to Edit Which Config

- **Adding new site metadata, branding, or production values**: Edit `config.private.ts`
- **Testing locally without committing**: Create `config.local.ts` (copy from `config.local.example.ts`)
- **Never modify**: `config.base.ts` (maintains template defaults)

### Config Structure

```typescript
{
  name: string;           // Site name
  title: string;          // Meta title
  description: string;    // Meta description
  url: string;            // Production URL
  og: { ... };           // OpenGraph settings
  twitter: { ... };      // Twitter card settings
  analytics: {
    googleAnalyticsId: string;  // GA tracking ID
  };
  debug: { ... };        // Error logging settings
  social: { ... };       // Social media links
  footer: { ... };       // Footer configuration
}
```

## MDX Content Creation

### File Location
All MDX files go in the `content/` directory. The file path becomes the URL:
- `content/getting-started.mdx` → `/docs/getting-started`
- `content/api/authentication.mdx` → `/docs/api/authentication`

### Frontmatter Format

All MDX files should include frontmatter:
```yaml
---
title: Page Title
description: Brief description for SEO
tags: [tag1, tag2, tag3]
---
```

### Available Components in MDX

The following components are automatically available in MDX files without imports:

**Layout Components**: Accordion, AccordionItem, AccordionTrigger, AccordionContent, Tabs, TabsList, TabsTrigger, TabsContent, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

**UI Elements**: Alert, AlertTitle, AlertDescription, Badge, Button, Separator, Kbd, Table, Spinner, Skeleton

**Form Elements**: Input, Label, Checkbox, Switch, Select, Textarea

**Modals**: Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, Sheet

**Navigation**: Breadcrumb, NavigationMenu, ScrollArea, Tooltip, Popover, DropdownMenu

**Reference**: See `content/component-examples.mdx` for usage examples of all components

### Code Blocks

Code blocks use Prism for syntax highlighting:

````markdown
```typescript
const example = "code here";
```
````

Supported languages: javascript, typescript, python, bash, json, yaml, css, html, and more.

## Development Workflow

### Starting Development

1. Install dependencies: `pnpm install`
2. Start dev server: `pnpm dev`
3. Open browser to `http://localhost:3000`
4. Changes auto-reload (hot reload enabled)

### Adding New Features

1. **New UI Component**:
   - Create in `components/ui/[ComponentName].tsx`
   - Use PascalCase naming
   - Follow existing component patterns (Radix UI + cva)
   - Export from component file

2. **New Page/Route**:
   - Add MDX file to `content/` directory
   - Include frontmatter (title, description, tags)
   - Use kebab-case for file names
   - Navigation sidebar auto-generates from folder structure

3. **New Utility Function**:
   - Add to appropriate file in `lib/`
   - Use TypeScript with proper types
   - Export named functions

### Linting and Type Checking

```bash
# Run ESLint
pnpm lint

# TypeScript type checking (no explicit script, runs during build)
pnpm build
```

**ESLint Configuration**: Uses Next.js recommended config (ESLint 9 flat config format)

## Important Patterns and Best Practices

### Server vs Client Components

- **Default**: Server Components (no "use client" directive)
- **Use "use client" when**:
  - Using React hooks (useState, useEffect, etc.)
  - Handling browser events (onClick, onChange, etc.)
  - Using browser APIs (window, document, etc.)
  - Dynamic imports are used for: Footer, Analytics (performance optimization)

### Dynamic Imports

Heavy components use dynamic imports with ssr: false:
```tsx
const Component = dynamic(() => import("@/components/Component"), { ssr: false });
```

### Styling Guidelines

- Use **Tailwind utility classes** (not custom CSS unless necessary)
- Use **cn()** utility to merge classes: `cn("base-classes", className)`
- Dark mode classes: `dark:bg-background dark:text-foreground`
- Responsive: `sm:`, `md:`, `lg:`, `xl:`, `2xl:` prefixes
- Custom CSS only in `app/globals.css` or `app/code-highlight.css`

### TypeScript

- **Strict mode enabled** (tsconfig.json)
- Always provide proper types (no `any` unless absolutely necessary)
- Use `React.ComponentProps<"element">` for HTML element props
- Use `VariantProps<typeof variants>` for cva variants

## Common Pitfalls and Gotchas

### 1. Configuration Confusion
**Problem**: Changing `config.base.ts` and seeing no effect  
**Solution**: Edit `config.private.ts` for production changes or `config.local.ts` for local testing. `config.base.ts` should never be modified.

### 2. MDX Component Not Found
**Problem**: Component works in TSX but not in MDX  
**Solution**: Ensure component is exported in `mdx-components.tsx` to make it available globally in MDX files.

### 3. Static Assets Not Loading
**Problem**: Images/files not loading in production  
**Solution**: Place all static assets in `public/` directory. Reference with `/filename.png` (no "public" in path).

### 4. TypeScript Path Alias Not Resolving
**Problem**: Import using `@/...` shows error  
**Solution**: Check `tsconfig.json` paths. May need to restart TypeScript server in IDE.

### 5. Hydration Errors
**Problem**: "Text content does not match server-rendered HTML"  
**Solution**: Ensure client components don't render different content on client vs server. Use `useEffect` for client-only content.

### 6. Build Fails in Docker but Works Locally
**Problem**: `pnpm build` succeeds locally but fails in Docker  
**Solution**: Check `next.config.mjs` - standalone output is only enabled in Docker (via `DOCKER_BUILD=true` env var). Ensure all dependencies are in `dependencies` not `devDependencies` if needed at runtime.

### 7. ESLint Errors Not Showing
**Problem**: ESLint not catching issues  
**Solution**: ESLint 9 uses flat config format (`eslint.config.mjs`). Ensure editor/IDE supports it. Run `pnpm lint` manually.

## Security Considerations

### Security Headers
Pre-configured in `next.config.mjs`:
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- X-Frame-Options: SAMEORIGIN
- Permissions-Policy: geolocation=(), microphone=(), camera=()
- Strict-Transport-Security (HSTS with preload)

**Important**: HSTS is configured with `includeSubDomains` and `preload`. Ensure this matches your deployment strategy.

### Environment Variables
- Never commit `.env` files (gitignored)
- Prefix public env vars with `NEXT_PUBLIC_`
- Keep sensitive data (API keys) server-side only
- Use `config.local.ts` for local development secrets (gitignored)

### Analytics
Google Analytics ID is configured in `config.private.ts` or `config.local.ts`. The analytics component is dynamically imported for performance.

## Docker Deployment

### Multi-Stage Build
The Dockerfile uses a multi-stage build for optimization:
1. **base**: Node.js Alpine + pnpm
2. **deps**: Production dependencies only
3. **build**: Full dependencies + build process
4. **final**: Minimal runtime with standalone output

### Key Environment Variables
- `DOCKER_BUILD=true` - Enables standalone output in `next.config.mjs`
- `NODE_ENV=production` - Set in final stage

### Build Commands
```bash
# Build Docker image
docker build -t tk-docs .

# Run container
docker run -p 3000:3000 tk-docs

# Using docker-compose
docker compose up
```

### Standalone Output
Next.js standalone output is used in Docker for minimal image size. This is controlled by the `DOCKER_BUILD` environment variable in `next.config.mjs`.

**Windows Note**: Standalone output is disabled on Windows (local builds) due to symlink issues. Only enabled in Docker (Linux).

## Testing Strategy

**Current State**: No testing infrastructure is set up.

**For Future Testing**:
- Consider adding Jest + React Testing Library
- Test utilities in `lib/`
- Test component rendering with Radix UI
- Test MDX parsing and rendering
- Integration tests for routing

## Performance Optimizations

1. **Dynamic Imports**: Footer, Analytics, heavy components
2. **Server Components**: Default for better performance
3. **Standalone Output**: Reduces Docker image size significantly
4. **Font Optimization**: Next.js automatic font optimization (Inter, JetBrains Mono)
5. **Image Optimization**: Use Next.js `<Image>` component for auto-optimization

## Troubleshooting Commands

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Type check entire project
npx tsc --noEmit

# Check for outdated dependencies
pnpm outdated

# Update dependencies (with caution)
pnpm update

# Docker build issues
docker build --no-cache -t tk-docs .
```

## Additional Resources

- **README.md**: Comprehensive project documentation
- **content/component-examples.mdx**: Live examples of all UI components
- **components/ui/README.md**: UI components documentation
- **Dockerfile**: Production deployment reference
- **config/config.local.example.ts**: Local configuration template

## Notes for AI Coding Agents

### When Making Changes

1. **Always check the configuration system** before modifying site metadata
2. **Respect the component architecture** - use existing patterns (Radix UI + cva)
3. **Test in both light and dark mode** - use `dark:` Tailwind classes
4. **Maintain TypeScript strict mode** - no `any` types
5. **Follow naming conventions** - PascalCase for components, kebab-case for files
6. **Use path aliases** - `@/lib/utils` instead of `../../lib/utils`
7. **Check MDX component availability** - ensure components are exported in `mdx-components.tsx`
8. **Consider performance** - use dynamic imports for heavy components

### Common Tasks

**Adding a new documentation page**:
1. Create MDX file in `content/` with frontmatter
2. Use existing UI components (no imports needed)
3. Test at `/docs/[filename]`

**Adding a new UI component**:
1. Create in `components/ui/` using PascalCase
2. Follow existing patterns (Radix UI + cva for variants)
3. Export component for external use
4. Add to `mdx-components.tsx` if needed in MDX

**Modifying site branding**:
1. Edit `config/config.private.ts` (NOT config.base.ts)
2. Update name, title, description, social links, etc.
3. Changes apply globally

**Debugging build issues**:
1. Check for TypeScript errors: `pnpm build`
2. Check for linting errors: `pnpm lint`
3. Clear `.next` cache if strange errors occur
4. Ensure all imports use correct path aliases

### Error Patterns to Watch For

1. **"Module not found"**: Check path aliases in tsconfig.json
2. **Hydration mismatch**: Ensure consistent server/client rendering
3. **"Component is not a function"**: Check named vs default exports
4. **Config not updating**: Check which config file you're editing (base vs private vs local)
5. **Docker build fails**: Check if dependencies are in correct section (dependencies vs devDependencies)

## Summary

This is a **well-architected, production-ready documentation template** with sensible defaults and conventions. The three-layer configuration system allows for easy customization without modifying template defaults. Follow existing patterns, respect the component architecture, and maintain TypeScript strict mode for the best results.

When in doubt, refer to `README.md` for detailed documentation or `content/component-examples.mdx` for component usage examples.
