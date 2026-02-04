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

## Architecture

### Content System

- MDX documentation files live in `content/` organized by category (Docker, Kubernetes, Ubuntu, etc.)
- Dynamic routing via `app/docs/[...slug]/page.tsx` serves MDX content
- `lib/mdx-utils.ts` handles MDX file discovery, parsing, and frontmatter extraction
- `lib/extract-headings.ts` generates table of contents from markdown headings
- Custom MDX components are mapped in `mdx-components.tsx`

### Configuration (Three-Layer System)

- `config/config.base.ts` - Template defaults (BaseSiteConfig interface)
- `config/config.private.ts` - Production overrides (domain, analytics, socials)
- `config/config.local.ts` - Local dev overrides (gitignored, copy from config.local.example.ts)
- `config/site.ts` - Aggregator that merges Base → Private → Local

### UI Components

- 30+ Radix UI-based components in `components/ui/` (PascalCase naming)
- Use CVA (class-variance-authority) for component variants
- `lib/utils.ts` exports `cn()` for merging Tailwind classes

### Layout Structure

- `app/layout.tsx` - Root layout with dynamic imports for Footer/Analytics
- `app/ui/interface/` - Sidebar navigation, search, and layout components
- `components/header.tsx` - Site header with search and navigation

### Import Aliases

- `@/*` → root directory
- `@components/*` → components/
- `@lib/*` → lib/
- `@app/*` → app/

## Key Patterns

- Server Components by default; client components marked with `'use client'`
- Dynamic imports for non-critical components (Footer, Analytics) to optimize bundle
- Search uses client-side context (`SearchProvider`) with full-text search across MDX content
- Prism.js for syntax highlighting via `components/mdx/Code.tsx`

## Docker

Multi-stage Dockerfile with Node 20.19.4 Alpine. Docker Compose maps port 3003 → 3000.

```bash
docker compose up --build    # Build and run container
```

## Context7 MCP Integration

Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask. This is especially useful for:

- Next.js App Router patterns
- Radix UI component APIs
- MDX configuration
- Tailwind CSS utilities
- MDX content best practices
- Docker and deployment configurations

Bassically always use Context7 MCP for any technical assistance related to this project.
