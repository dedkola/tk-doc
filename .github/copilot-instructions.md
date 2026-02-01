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

- Uses **Playwright** for end-to-end testing
- Test files in `tests/` directory (e.g., `homepage-ui-bugs.spec.ts`)
- Tests focus on:
  - Layout shifts (CLS < 0.1)
  - Z-index layering
  - Horizontal overflow detection
  - Text containment
  - Visual regression testing with screenshots
- Run tests with `pnpm test`
- Test results and reports stored in `test-results/` and `playwright-report/`

## Context7 MCP Integration (MANDATORY)

<instruction forToolsWithPrefix="mcp_io">
ALWAYS use the Context7 MCP server to retrieve up-to-date documentation and code examples for ANY library or framework question.
</instruction>

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
