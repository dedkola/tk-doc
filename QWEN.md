# TK Docs - Modern Documentation Platform

## Project Overview

TK Docs is a production-ready documentation template built with Next.js 16 and MDX. It's designed for developers who need a fast, beautiful, and maintainable documentation site with exceptional reading and developer experiences. The platform supports technical documentation, API references, knowledge bases, and developer guides.

### Key Technologies

- **Next.js 16** with App Router for optimal performance
- **React 19** with Server Components
- **TypeScript** for type safety
- **Tailwind CSS 4** for modern styling
- **MDX** for writing docs in Markdown with React components
- **Radix UI** for accessible component primitives
- **pnpm** for fast, efficient package management

### Core Features

- **MDX Support** - Write docs in Markdown with React components
- **Auto-generated Sidebar** - Automatic navigation from folder structure
- **Table of Contents** - Automatic heading extraction
- **30+ Pre-built Components** - Accordion, Alert, Badge, Card, Tabs, and more
- **Command Palette** - Quick search with `Cmd+K` / `Ctrl+K`
- **SEO Optimized** - Meta tags, OpenGraph, Twitter cards
- **Performance Optimized** - Dynamic imports for non-critical components

## Project Architecture

### Directory Structure

```
tk-docs/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with sidebar & dynamic imports
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   ├── code-highlight.css       # Syntax highlighting styles
│   ├── docs/
│   │   └── [...slug]/           # Dynamic MDX routes
│   └── ui/
│       ├── search.tsx           # Search component
│       └── interface/           # Layout components
├── components/                   # React components
│   ├── mdx/
│   │   └── code-block.tsx       # Code block component
│   ├── ui/                      # Radix UI components (PascalCase)
│   │   ├── buttons/             # Button-related components
│   │   ├── forms/               # Form-related components
│   │   ├── modals/              # Modal & dialog components
│   │   ├── Accordion.tsx
│   │   ├── Alert.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Tabs.tsx
│   │   ├── README.md            # Component documentation
│   │   └── ... (30+ components)
│   ├── analytics.tsx            # Analytics (dynamically loaded)
│   ├── header.tsx               # Site header
│   ├── footer.tsx               # Site footer (dynamically loaded)
│   ├── TableOfContents.tsx      # TOC component
│   └── ShareButtons.tsx         # Social sharing
├── config/                       # Configuration files
│   ├── config.base.ts           # Base configuration (template defaults)
│   ├── config.private.ts        # Production overrides (committed)
│   ├── config.local.example.ts  # Example dev overrides (copy to config.local.ts)
│   └── site.ts                  # Aggregator that merges all configs
├── content/                      # MDX documentation files
│   └── component-examples.mdx   # Component showcase (reference)
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
├── lib/                          # Utility functions
│   ├── mdx-utils.ts             # MDX parsing utilities
│   ├── extract-headings.ts      # TOC extraction
│   └── utils.ts                 # General utilities
├── public/                       # Static assets
│   ├── robots.txt
│   └── assets/
├── types/                        # TypeScript definitions
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies & scripts
```

### Content Organization

The `content/` directory contains all documentation files in MDX format. The sidebar navigation is auto-generated from the folder structure. Each folder becomes a section in the sidebar, and files within become pages. For example:

```
content/
├── component-examples.mdx    # Component showcase & reference
├── getting-started/
│   ├── installation.mdx
│   └── quick-start.mdx
├── guides/
│   ├── authentication.mdx
│   └── deployment.mdx
└── api/
    └── reference.mdx
```

## Building and Running

### Prerequisites

- **Node.js** 18.17 or higher
- **pnpm** (recommended) or npm/yarn

### Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

### Docker Deployment

The project includes Docker support with a multi-stage build process:

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build the image directly
docker build -t tk-docs .
docker run -p 3000:3000 tk-docs
```

The Dockerfile creates a standalone Next.js output optimized for production deployment.

## Development Conventions

### Configuration System

The project uses a three-layer configuration approach:

- **`config/config.base.ts`** – Template defaults (do not modify)
- **`config/config.private.ts`** – Committed, production overrides (domain, analytics, socials)
- **`config/config.local.ts`** – Gitignored, dev-only overrides (optional)

### Component Naming

All UI components use PascalCase naming convention:

```tsx
// ✅ Correct
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

// ❌ Incorrect
import { Button } from "@/components/ui/button";
```

### Performance Optimization

- Dynamic imports for non-critical components (`Footer`, `Analytics`)
- Server Components by default for better performance
- Lazy loading of components to reduce initial bundle size

### Content Guidelines

- Store all documentation in the `content/` folder
- Use frontmatter for metadata (title, description, tags)
- Organize content by topic in subfolders
- Keep MDX files focused and modular

## Customization

### Quick Configuration

Edit `config/config.private.ts` for production settings (domain, analytics, social links) and `config/config.local.ts` for dev-only overrides.

### Styling

- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Code highlighting: `app/code-highlight.css`

### Adding New Components

1. Place components in `components/ui/` with **PascalCase filenames**
2. Use **Radix UI** as the foundation for accessible components
3. Style with **Tailwind CSS**
4. Export from the component file and import with PascalCase naming
5. Consider organizing in subfolders based on functionality

## Deployment Notes

The application is configured with security headers including:

- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
- Permissions-Policy: geolocation=(), microphone=(), camera=()

The Docker setup uses a multi-stage build process with a standalone Next.js output for optimal production performance.

## Context7 MCP Integration

Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask. This is especially useful for:

- Next.js App Router patterns
- Radix UI component APIs
- MDX configuration
- Tailwind CSS utilities
- MDX content best practices
- Docker and deployment configurations

Bassically always use Context7 MCP for any technical assistance related to this project.
