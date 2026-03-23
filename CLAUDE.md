# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TK Docs is a documentation platform template built with Next.js 16, React 19, TypeScript, and MDX. It uses Tailwind CSS 4 for styling and Radix UI for accessible components.

## Commands

```bash
pnpm install      # Install dependencies
pnpm dev          # Start development server (port 3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

No test framework is configured — quality control is ESLint only.

## Architecture

### Content System

- MDX documentation files live in `content/` organized by category subdirectory (Docker, Kubernetes, Ubuntu, etc.)
- Dynamic routing via `app/docs/[...slug]/page.tsx` serves MDX content; `generateStaticParams()` pre-renders all pages at build
- `lib/mdx-utils.ts` handles MDX file discovery, frontmatter parsing, and slug generation — **server-only** (uses `eval('require')` guard to block browser execution)
- `lib/extract-headings.ts` generates table of contents from h2–h4 headings, producing deduplicated URL-safe IDs
- Custom MDX components are mapped in `mdx-components.tsx`; all 30+ Radix UI components are available in MDX files

**MDX frontmatter format:**
```yaml
---
title: "Page Title"
description: "Short description"
tags: [tag1, tag2]       # or CSV string: "tag1, tag2"
keywords: "optional, keywords"
publishedAt: "2024-01-01"
updatedAt: "2024-03-01"
---
```

Slug is derived from file path: `content/Docker/install.mdx` → slug `['Docker', 'install']` → URL `/docs/Docker/install`.

### Configuration (Three-Layer System)

- `config/config.base.ts` — Template defaults (`BaseSiteConfig` interface)
- `config/config.private.ts` — Production overrides (domain, analytics, socials)
- `config/config.local.ts` — Local dev overrides (gitignored; copy from `config.local.example.ts`)
- `config/site.ts` — Merges Base → Private → Local using deep `mergeSection()` helper; exports `siteConfig`

### UI Components

- 30+ Radix UI-based components in `components/ui/` (PascalCase naming)
- Use CVA (class-variance-authority) for component variants
- `lib/utils.ts` exports `cn()` for merging Tailwind classes (clsx + twMerge)

### Layout Structure

- `app/layout.tsx` — Root layout with dynamic imports for Footer/Analytics
- `app/ui/interface/` — Sidebar, search, and layout components
  - `sidenav.tsx` / `sidenav-client.tsx` — Server/client sidebar variants
  - `search-context.tsx` — Client context (`SearchProvider`) that syncs search query to URL params with 300ms debounce
  - `accordion-menu.tsx` — Collapsible category navigation
- `components/header.tsx` — Site header with search and navigation
- `components/Code.tsx` — Prism.js syntax highlighting, **dynamically imported with SSR disabled** in `mdx-components.tsx`

### Import Aliases

- `@/*` → root directory
- `@components/*` → components/
- `@lib/*` → lib/
- `@app/*` → app/

## Key Patterns

- Server Components by default; client components marked with `'use client'`
- Dynamic imports for non-critical components (Footer, Analytics, Code) to optimize bundle
- Search uses client-side `SearchProvider` for full-text search across MDX content; tag filtering via query params
- SEO: per-page metadata, OpenGraph, Twitter card, JSON-LD `TechArticle` + `BreadcrumbList` structured data, dynamic sitemap at `app/sitemap.ts`

## Docker

Multi-stage Dockerfile with Node 20.19.4 Alpine. Docker Compose maps port 3003 → 3000.

```bash
docker compose up --build    # Build and run container
```

Kubernetes manifests are in `k8s/`.

## Context7 MCP Integration

Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask. This is especially useful for:

- Next.js App Router patterns
- Radix UI component APIs
- MDX configuration
- Tailwind CSS utilities
- MDX content best practices
- Docker and deployment configurations

Basically always use Context7 MCP for any technical assistance related to this project.
