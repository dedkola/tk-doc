# Copilot Instructions for TK Doc

TK Doc is a content-driven documentation site built with Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, and MDX.

## Commands

```bash
pnpm install
pnpm dev
pnpm build        # production build; Next.js also runs type-checking here
pnpm start
pnpm lint
pnpm lint app/layout.tsx   # lint a specific file or directory
npx tsc --noEmit           # standalone type-check
```

There is no test runner or test suite configured in this repository right now, so there is no single-test command.

## High-level architecture

### Content is the shared data source

- `content/**/*.mdx` is the source of truth for docs pages, sidebar groups, homepage stats, related articles, sitemap entries, and the RSS feed.
- `lib/mdx-utils.ts` is the central server-only content loader. It recursively scans `content/`, parses frontmatter with `gray-matter`, normalizes tags/keywords, and exposes helpers like `groupByFolder()`, `getRecentArticles()`, and `getTopTags()`.
- `app/docs/[...slug]/page.tsx` reads the matching MDX file, renders it with `MDXRemote`, extracts h2-h4 headings, builds page metadata and JSON-LD, and uses `generateStaticParams()` plus `dynamicParams = false` to pre-render every docs route at build time.
- `app/page.tsx`, `app/sitemap.ts`, and `app/feed.xml/route.ts` all reuse the same MDX data layer instead of maintaining separate indexes.

### Layout and search are split across server and client

- `app/layout.tsx` builds the app shell on the server: it loads all MDX files once, groups them, and passes that shared dataset into `LayoutClient`, `SideNav`, and the header/search UI.
- `app/ui/interface/search-context.tsx` is the client state boundary. It owns `searchQuery`, `selectedTag`, and mobile sidebar state, and syncs `search` / `tag` query params back to the URL with a 300ms debounce.
- `app/ui/interface/layout-client.tsx` decides whether to show normal page content or global search results. Search is rendered inside the shared layout, not as its own route.
- `app/ui/interface/search-results.tsx` uses `lib/search-utils.ts`, which applies multi-word AND matching plus weighted scoring across title, tags, keywords, description, folder, and content.
- `app/ui/search.tsx` wires the global `Cmd+K` / `Ctrl+K` shortcut to focus search, and `components/KeyboardShortcutsHelp.tsx` exposes the `?` shortcut help dialog.

### Configuration and deployment have multiple modes

- `config/site.ts` builds `siteConfig` by merging `config/config.base.ts` -> `config/config.private.ts` -> optional `config/config.local.ts`.
- Treat `config/config.base.ts` as template defaults. Site-specific committed changes belong in `config/config.private.ts`; local-only overrides belong in `config/config.local.ts`.
- `next.config.mjs` switches output mode by environment: default Next.js app locally, `standalone` when `DOCKER_BUILD=true`, and static `export` when `CF_PAGES=1`.
- `Dockerfile` sets `DOCKER_BUILD=true` and copies the standalone build plus `content/` into the final image. For Cloudflare Pages, security headers move to `public/_headers` because `headers()` cannot run in static export mode.

## Key conventions

- Global MDX components live in `lib/mdx-page-components.tsx`, not `mdx-components.tsx`. If a component should be usable directly inside MDX, register it there. `content/component-examples.mdx` is the reference page.
- `lib/mdx-utils.ts` is server-only by design; do not import it into client components.
- URLs and sidebar structure come directly from MDX file paths. Example: `content/Docker/install.mdx` becomes `/docs/Docker/install` and appears under the `Docker` section automatically.
- Frontmatter is part of the content contract. `title` and `description` are expected; `tags` and `keywords` accept arrays or comma-separated strings; `publishedAt` and `updatedAt` drive metadata, RSS ordering, and recency displays.
- Search behavior is cross-file behavior. If you change search state, filtering, or rendering, update `search-context.tsx`, `layout-client.tsx`, and `search-results.tsx` together so URL syncing and layout switching stay aligned.
- UI components in `components/ui/` use PascalCase filenames and the normal pattern is Radix primitive + `class-variance-authority` + `cn()` from `lib/utils.ts`.
- Prefer `siteConfig` from `config/site.ts` for metadata, social links, analytics, and SEO values instead of importing individual config layers in app code.

## Existing repo guidance

- For framework and library questions in this repo (Next.js App Router, Radix UI, Tailwind CSS, MDX, Docker), use Context7 before changing code or configuration.
- Repo-local MCP server entries live in `.ai/mcp/mcp.json`. Use Playwright MCP there when a change needs real browser interaction, rendered UI checks, or screenshot-based debugging.
