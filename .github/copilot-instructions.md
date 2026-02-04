# GitHub Copilot Instructions for TK Docs

## Project Overview

TK Docs is a production-ready documentation platform template built with Next.js 16, React 19, TypeScript, and MDX. It uses Tailwind CSS 4 for styling and Radix UI for accessible components.

## Commands

```bash
pnpm install      # Install dependencies
pnpm dev          # Start development server (port 3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm test         # Run Playwright tests (if configured)
```

### Docker

```bash
docker compose up --build    # Build and run container (port 3003 → 3000)
```

**Important**: Always use `pnpm` as the package manager. The project uses `pnpm-lock.yaml`.

### Development Environment Setup

**Prerequisites:**
1. **Node.js 18.17+** - Required for Next.js 16
2. **pnpm** - Must be installed globally: `npm install -g pnpm`
3. **Internet access** - Required for Google Fonts during build (see Known Issues below)

**First-time setup:**
```bash
# 1. Install pnpm if not already installed
npm install -g pnpm

# 2. Install dependencies
pnpm install

# 3. Copy example local config (optional, for dev overrides)
cp config/config.local.example.ts config/config.local.ts

# 4. Start dev server
pnpm dev
```

## Architecture

### Content System

MDX-based documentation with automatic routing and navigation:

- **Content files**: `content/` directory organized by category (e.g., `content/guides/`, `content/api/`)
- **Dynamic routing**: `app/docs/[...slug]/page.tsx` serves all MDX content
- **MDX utilities**: `lib/mdx-utils.ts` handles file discovery, parsing, and frontmatter extraction
  - Uses `gray-matter` for frontmatter parsing
  - `getMDXFiles()` recursively scans content directory
  - `groupByFolder()` organizes files by first-level folder
  - **Server-side only**: Throws error if used in browser context
- **TOC generation**: `lib/extract-headings.ts` generates table of contents from markdown headings
- **Component mapping**: `mdx-components.tsx` maps custom React components for use in MDX files
  - Code component is **lazy-loaded** with `dynamic()` for performance
  - Includes custom styled HTML elements (h1-h6, p, ul, ol, a, etc.)

The sidebar navigation is auto-generated from the folder structure. Each folder becomes a section, and files within become pages.

### Configuration (Three-Layer System)

Site configuration uses a merge strategy across three files:

1. `config/config.base.ts` - Template defaults (BaseSiteConfig interface) - **DO NOT MODIFY**
2. `config/config.private.ts` - Production overrides (domain, analytics, socials) - **Committed to git**
3. `config/config.local.ts` - Local dev overrides (copy from `config.local.example.ts`) - **Gitignored**
4. `config/site.ts` - Aggregator that merges Base → Private → Local

**When modifying site config:**

- Edit `config/config.private.ts` for production changes
- Edit `config/config.local.ts` for local dev overrides
- Never modify `config/config.base.ts` (preserves template updates)
- Restart dev server after config changes

### UI Components

- **Location**: `components/ui/` with **PascalCase filenames** (e.g., `Button.tsx`, `Card.tsx`)
- **Subfolders**: Organized by category (`buttons/`, `forms/`, `modals/`)
- **Foundation**: Built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with CVA (class-variance-authority) for variants
- **Utilities**: `lib/utils.ts` exports `cn()` for merging Tailwind classes

### Layout Structure

- `app/layout.tsx` - Root layout with sidebar, dynamic imports for Footer/Analytics
- `app/ui/interface/` - Sidebar navigation, search, and layout components
- `components/header.tsx` - Site header with search and navigation
- `components/footer.tsx` - Site footer (dynamically imported)
- `components/analytics.tsx` - Analytics tracking (dynamically imported)

### Import Aliases

```typescript
@/*           → root directory
@components/* → components/
@lib/*        → lib/
@app/*        → app/
```

## Key Conventions

### Component Naming

**Always use PascalCase for UI component imports:**

```typescript
// ✅ Correct
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

// ❌ Incorrect (old convention)
import { Button } from "@/components/ui/button";
```

### React Patterns

- **Server Components by default** - Only add `'use client'` when necessary (state, effects, browser APIs)
- **Dynamic imports for non-critical components** - Use for Footer, Analytics, and other non-essential components
- **Example dynamic import pattern:**

```typescript
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/footer"), {
  ssr: true,
});
```

### MDX Content

- Store all documentation in `content/` directory
- Use frontmatter for metadata:

```mdx
---
title: Page Title
description: Page description for SEO
tags: [guide, tutorial]
---
```

- All UI components are automatically available in MDX files
- Organize content in subfolders to create sidebar sections

### Code Highlighting

- Uses Prism.js via `components/mdx/Code.tsx`
- Styles in `app/code-highlight.css`
- Supports syntax highlighting for major languages

### Search Implementation

- Client-side search context via `SearchProvider` in `app/ui/interface/search-context.tsx`
- Full-text search across all MDX content using client-side filtering
- Accessible with `Cmd+K` / `Ctrl+K` command palette
- Search state managed with React Context and shared across:
  - `layout-client.tsx` - Keyboard shortcut handler
  - `sidenav-client.tsx` - Sidebar integration
  - `search-results.tsx` - Results display
- Uses `useSearchParams` from Next.js for URL query parameters

## Creating New Components

When adding new UI components:

1. **Place in `components/ui/`** with PascalCase filename
2. **Use Radix UI** as the foundation for accessibility
3. **Style with Tailwind CSS** using the `cn()` utility
4. **Use CVA** for component variants
5. **Consider organizing** in subfolders (`buttons/`, `forms/`, `modals/`)
6. **Export properly** for both named and default imports

Example component structure:

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "px-4 py-2 rounded font-medium transition-colors",
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "secondary" && "bg-gray-200 text-gray-800 hover:bg-gray-300",
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
export { Button };
```

## Performance Optimization

The application implements several performance patterns:

- **Dynamic imports** for Footer and Analytics components in `app/layout.tsx`
- **Server Components** by default (layout and pages)
- **Lazy loading** to reduce initial bundle size
- **Standalone output** in Docker for optimized production builds
- **Code component lazy-loaded** in `mdx-components.tsx` with `ssr: false` (syntax highlighting is client-heavy)
- **Vercel Speed Insights** integrated in root layout

## Testing

- **No test infrastructure currently exists** in the repository
- The `pnpm test` script is defined in package.json but Playwright is not configured
- Test directory does not exist
- If adding tests:
  - Install Playwright: `pnpm add -D @playwright/test`
  - Create `tests/` directory
  - Add `playwright.config.ts`
  - Follow existing Next.js/React testing patterns
  - Focus on critical user flows and component interactions

## Context7 MCP Integration (MANDATORY)

<instruction forToolsWithPrefix="mcp_io">
ALWAYS use the Context7 MCP server to retrieve up-to-date documentation and code examples for ANY library or framework question.
</instruction>

**MCP Configuration**: Located in `.ai/mcp/mcp.json` with Context7 API key configured.

**CRITICAL**: You MUST use the `mcp_io_github_ups_resolve-library-id` and `mcp_io_github_ups_get-library-docs` tools for:

- Next.js App Router patterns
- Radix UI component APIs
- MDX configuration
- Tailwind CSS utilities
- React patterns and hooks
- Docker and deployment configurations
- Any library/framework documentation lookups

**Do NOT answer technical questions about libraries without first consulting Context7 MCP.** This applies to code generation, configuration help, setup steps, and API usage questions.

Call `resolve-library-id` first to get the library ID, then `get-library-docs` to fetch documentation.

## Common Patterns & Troubleshooting

### Adding New Pages

1. Create `.mdx` file in `content/` (or subfolder)
2. Add frontmatter with `title`, `description`, and optional `tags`
3. Use any UI components directly in MDX - they're automatically available
4. Restart dev server if sidebar doesn't update

### Component Development

- Start with Radix UI primitive for accessibility
- Use `cn()` utility from `@/lib/utils` to merge Tailwind classes
- Follow PascalCase file naming convention
- Export with `forwardRef` for ref forwarding
- Set `displayName` for better debugging

### Config Changes

- Production changes: Edit `config/config.private.ts`
- Local overrides: Edit `config/config.local.ts` (create from example)
- Never edit `config/config.base.ts` (preserves template updates)
- Always restart dev server after config changes

### MDX Content Best Practices

- Use frontmatter for metadata (`title`, `description`, `tags`)
- Organize by folder to create sidebar sections
- All UI components available without imports
- Code blocks automatically syntax-highlighted
- External links open in new tab automatically

## Known Issues & Workarounds

### Build Issues

#### 1. Google Fonts Network Error (CRITICAL)

**Error:**
```
Failed to fetch `Inter` from Google Fonts.
Failed to fetch `JetBrains Mono` from Google Fonts.
```

**Cause**: The build process requires internet access to fetch Google Fonts. In restricted network environments (CI/CD, containers, air-gapped systems), this causes build failures.

**Affected File**: `app/layout.tsx` (lines 71-81)

**Workarounds**:

1. **Option A: Skip font optimization (Quick Fix)**
   - Set env variable: `NEXT_DISABLE_GOOGLE_FONTS=true`
   - Fonts will fallback to system defaults
   - Not recommended for production

2. **Option B: Use local fonts (Recommended)**
   - Download font files to `public/fonts/`
   - Use `next/font/local` instead of `next/font/google`
   - Example:
   ```typescript
   import localFont from 'next/font/local'
   
   const inter = localFont({
     src: '../public/fonts/Inter-Variable.woff2',
     variable: '--font-inter',
     display: 'swap',
   })
   ```

3. **Option C: Pre-cache fonts (CI/CD)**
   - Add caching step to download fonts before build
   - Store in Next.js cache directory
   - Requires CI/CD configuration

**Current Status**: Known issue, not fixed. Build will fail in environments without Google Fonts access.

### Lint Issues

Run `pnpm lint` to see current issues:

#### 1. TypeScript Error (ERROR)
- **File**: `types/config.local.d.ts`
- **Issue**: Uses `any` type instead of proper typing
- **Fix**: Replace `any` with `Partial<BaseSiteConfig>`

#### 2. Unused Variables (WARNINGS)
- **File**: `components/Code.tsx` - Variable `prismLoaded` assigned but never used
- **File**: `components/TableOfContents.tsx` - Import `useCallback` defined but never used
- **Fix**: Remove unused imports/variables or mark with underscore prefix

#### 3. Image Optimization (WARNING)
- **File**: `mdx-components.tsx` (line 118)
- **Issue**: Using `<img>` instead of Next.js `<Image />`
- **Impact**: Slower LCP, higher bandwidth
- **Note**: May be intentional for MDX content flexibility

**Fixing Lint Issues:**
```bash
# Some issues auto-fixable
pnpm lint --fix

# Manual fixes required for TypeScript errors
```

### Missing Features

1. **No test infrastructure** - Playwright mentioned in docs but not configured
2. **No CI/CD workflows** - Only Dependabot configured in `.github/`
3. **No pre-commit hooks** - No Husky or lint-staged setup

## Troubleshooting Guide

### Build Failures

**Symptom**: Build fails with font fetch errors
- **Solution**: See "Google Fonts Network Error" above

**Symptom**: TypeScript compilation errors
- **Check**: Run `pnpm lint` to identify issues
- **Solution**: Fix type errors before building

**Symptom**: Module not found errors
- **Solution**: Run `pnpm install` to ensure all dependencies installed
- **Check**: Verify `pnpm-lock.yaml` is committed

### Development Issues

**Symptom**: Dev server won't start
- **Check**: Ensure port 3000 is available
- **Solution**: Kill process using port or set custom port: `PORT=3001 pnpm dev`

**Symptom**: Config changes not applied
- **Solution**: Restart dev server after changing any file in `config/` directory

**Symptom**: New MDX file not appearing in sidebar
- **Solution**: Restart dev server (sidebar generated at build time)

### Docker Issues

**Symptom**: Docker build fails with font errors
- **Solution**: Build with network access or implement local fonts workaround
- **Note**: `next.config.mjs` uses `standalone` output only when `DOCKER_BUILD=true`

**Symptom**: Port 3003 already in use
- **Solution**: Change port mapping in `compose.yaml`

## Important Files to Know

### Configuration Files (Do Not Break!)

- `config/config.base.ts` - **NEVER MODIFY** (template defaults)
- `config/config.private.ts` - Production overrides (committed)
- `config/config.local.ts` - Local dev overrides (gitignored)
- `config/site.ts` - Aggregator (do not modify merge logic)

### Core System Files

- `lib/mdx-utils.ts` - MDX file discovery and parsing (server-side only)
- `lib/extract-headings.ts` - TOC generation
- `mdx-components.tsx` - Component mapping for MDX files
- `app/layout.tsx` - Root layout (contains font configuration)
- `app/docs/[...slug]/page.tsx` - Dynamic MDX routing

### Type Definitions

- `types/config.local.d.ts` - Local config types (has lint error)
- `types/*.d.ts` - Additional type definitions

## Code Quality Standards

### Before Committing

1. **Run linter**: `pnpm lint` (should have no errors, warnings acceptable if justified)
2. **Test build**: `pnpm build` (may fail due to Google Fonts - document workaround)
3. **Check types**: TypeScript strict mode is enabled
4. **Review changes**: Ensure no accidental config.base.ts modifications

### Code Style

- **TypeScript**: Strict mode enabled, avoid `any` types
- **React**: Server Components by default, `'use client'` only when necessary
- **Imports**: Use path aliases (`@/`, `@components/`, `@lib/`, `@app/`)
- **Components**: PascalCase filenames, export with `forwardRef` and `displayName`
- **CSS**: Tailwind utilities only, use `cn()` for conditional classes

## Package Management

**CRITICAL**: Only use `pnpm`. Do not use `npm` or `yarn`.

- **Lockfile**: `pnpm-lock.yaml` must be committed
- **Node version**: 18.17+ required
- **Adding dependencies**: `pnpm add <package>`
- **Dev dependencies**: `pnpm add -D <package>`

**Warning**: Build scripts for `sharp@0.34.5` and `unrs-resolver@1.11.1` are ignored by default. Run `pnpm approve-builds` if needed.

## Deployment Considerations

### Vercel (Recommended)

- Analytics and Speed Insights pre-configured
- Auto-detects Next.js configuration
- No additional setup needed

### Docker

- Multi-stage build configured in `Dockerfile`
- Uses standalone output for optimized image size
- Port mapping: 3003 (host) → 3000 (container)
- **Issue**: Will fail without Google Fonts workaround

### Self-Hosted

- Run `pnpm build` then `pnpm start`
- Requires Node.js 18.17+ runtime
- Set `NODE_ENV=production`
- **Issue**: Build will fail without internet access for fonts

## Security

### Headers Configured

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN`
- `Permissions-Policy` for geolocation, microphone, camera
- `Strict-Transport-Security` (HSTS) for HTTPS

### Configuration in

- `next.config.mjs` - Security headers
- All headers apply to `/:path*`

## Git Workflow

### Branch Strategy

- Main branch: Development work
- Feature branches: Use descriptive names
- Dependabot: Auto-creates PRs for dependency updates (assigned to `dedkola`)

### .gitignore Highlights

- `node_modules/` - Dependencies (never commit)
- `.next/` - Build output
- `config/config.local.ts` - Local dev overrides
- Standard Next.js ignores applied

## Quick Reference

### Component Count
- 28+ UI components in `components/ui/`
- All built on Radix UI primitives
- Organized by category (buttons, forms, modals)

### Content Organization
- Start with `content/component-examples.mdx`
- Create folders for sections (guides, api, tutorials)
- Automatic sidebar generation from folder structure

### Performance
- Dynamic imports for Footer and Analytics
- Server Components by default
- Lazy-loaded Code component for syntax highlighting
- Standalone Docker builds for size optimization
