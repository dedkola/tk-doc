# Copilot Instructions for TK Docs

TK Docs is a documentation platform template built with Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS 4, and MDX. No test framework is configured — quality control is ESLint only.

## Commands

```bash
pnpm dev          # Start dev server with Turbopack (port 3000)
pnpm build        # Production build (also runs type checking)
pnpm lint         # ESLint (flat config format via eslint.config.mjs)
npx tsc --noEmit  # Type check without building
```

## Architecture

### Content → URL Pipeline

MDX files in `content/` map directly to `/docs/` routes by file path:
- `content/Docker/install.mdx` → `/docs/Docker/install`

`lib/mdx-utils.ts` handles file discovery and frontmatter parsing (**server-only** — uses `eval('require')` guard). `app/docs/[...slug]/page.tsx` uses `generateStaticParams()` to pre-render all pages at build time. Components available in MDX are registered in `lib/mdx-page-components.tsx` (not `mdx-components.tsx`).

**MDX frontmatter:**
```yaml
---
title: "Page Title"
description: "Short description"
tags: [tag1, tag2]       # also accepts CSV string
keywords: "optional, keywords"
publishedAt: "2024-01-01"
updatedAt: "2024-03-01"
---
```

### Three-Layer Configuration System

**Never modify `config/config.base.ts`.** Merge order: base → private → local.

| File | Purpose | Git |
|------|---------|-----|
| `config/config.base.ts` | Template defaults | committed (read-only) |
| `config/config.private.ts` | Production values (URL, analytics, social) | committed |
| `config/config.local.ts` | Local dev overrides | gitignored |

`config/site.ts` exports `siteConfig` by merging all three layers with `mergeSection()`. Import `siteConfig` wherever site metadata is needed.

### Search Architecture

Client-side full-text search, no external service:

1. `lib/mdx-utils.ts` — `getAllMDXFiles()` (server, `cache()`-wrapped) scans `content/` and returns parsed MDX with frontmatter
2. `app/ui/interface/search-context.tsx` — `SearchProvider` client context; syncs `searchQuery` and `selectedTag` to URL params with 300ms debounce
3. `app/ui/interface/search-results.tsx` — filters across title, description, tags, folder, and content; extracts 200-char excerpts; highlights matches

Search is triggered with **Cmd+K / Ctrl+K**.

### Server vs Client Components

Server Components by default. Key client components:
- `app/ui/interface/search-context.tsx` — `SearchProvider`, `useSearch` hook
- `app/ui/interface/layout-client.tsx` — main layout wrapper
- `app/ui/interface/sidenav-client.tsx` — interactive sidebar
- `components/header.tsx`, `components/TableOfContents.tsx`, `components/ThemeToggle.tsx`

Dynamic imports for non-critical components:
```tsx
// SSR disabled (Prism runs client-side)
const Code = dynamic(() => import("./components/Code"), { ssr: false });

// SSR enabled but deferred
const Footer = dynamic(() => import("@/components/footer"), { ssr: true });
```

### Sidebar Navigation

`app/ui/interface/sidenav.tsx` (server) loads all MDX files, groups them by folder via `groupByFolder()`, and extracts top 10 tags. It passes this data as props to `sidenav-client.tsx` (client) which renders collapsible accordions. Navigation auto-generates from `content/` folder structure — no manual registration needed.

## Key Conventions

### Component Pattern (Radix UI + CVA)

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const variants = cva("base-classes", {
  variants: { variant: { default: "...", outline: "..." } },
  defaultVariants: { variant: "default" },
});

export function Component({
  className, variant, asChild = false, ...props
}: React.ComponentProps<"button"> & VariantProps<typeof variants>) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(variants({ variant }), className)} {...props} />;
}
```

- Components: PascalCase files in `components/ui/`
- Utilities/hooks: kebab-case
- MDX content files: kebab-case

### Path Aliases

```tsx
import { cn } from "@/lib/utils";           // @/* → root
import { Button } from "@components/ui/Button"; // @components/* → components/
import { siteConfig } from "@/config/site";
// Also available: @lib/*, @app/*
```

### MDX Components

All components in `lib/mdx-page-components.tsx` are available in MDX without imports. To add a new component for MDX use, register it there. See `content/component-examples.mdx` for live usage examples of all available components.

Headings (h2–h4) auto-generate deduplicated URL-safe IDs for anchor links. Inline code (no `className`) renders as `<InlineCode>`; fenced code blocks render via the dynamically-imported `<Code>` component (Prism).

### SEO Pattern

`app/docs/[...slug]/page.tsx` generates per-page metadata including OpenGraph, Twitter card, and two JSON-LD schemas (`TechArticle` + `BreadcrumbList`) injected via `<script type="application/ld+json">`.

## Docker

`DOCKER_BUILD=true` env var enables Next.js standalone output in `next.config.mjs` (disabled locally to avoid symlink issues on Windows). Docker Compose maps host port **3000 → container 3000**.

```bash
docker compose up --build
```
