export interface MDXFile {
  slug: string[];
  title: string;
  description?: string;
  tags?: string[];
  keywords?: string[];
  folder?: string;
  content?: string;
  /** ISO date string from frontmatter or file mtime */
  publishedAt?: string;
  /** ISO date string from frontmatter or file mtime */
  updatedAt?: string;
  /** File system last modified date */
  lastModified: Date;
}

import { cache } from "react";
import matter from "gray-matter";

function getServerModules() {
  if (typeof window !== "undefined") {
    throw new Error("`lib/mdx-utils.ts` must only be used on the server");
  }
  const req = eval("require") as NodeRequire;
  return {
    fs: req("fs") as typeof import("fs"),
    path: req("path") as typeof import("path"),
  };
}

export function getMDXFiles(dir: string, baseDir: string = dir): MDXFile[] {
  const { fs, path } = getServerModules();
  const files: MDXFile[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      files.push(...getMDXFiles(fullPath, baseDir));
    } else if (item.name.endsWith(".mdx")) {
      const relativePath = path.relative(baseDir, fullPath);
      const slug = relativePath.replace(/\.mdx$/, "").split(path.sep);

      const content = fs.readFileSync(fullPath, "utf-8");

      // Parse frontmatter using gray-matter for robustness
      const parsed = matter(content);
      const data = parsed.data as Record<string, unknown> | undefined;

      const title =
        data && data.title
          ? String(data.title).replace(/^['"]|['"]$/g, "")
          : item.name.replace(".mdx", "");

      // Warn about missing frontmatter fields during build
      if (!data?.title) {
        console.warn(
          `[mdx-utils] Missing "title" in frontmatter: ${relativePath}`,
        );
      }

      const description =
        data && data.description
          ? String(data.description).replace(/^['"]|['"]$/g, "")
          : undefined;

      const tags =
        data && data.tags
          ? Array.isArray(data.tags)
            ? [...new Set(data.tags.map(String).map((t) => t.trim()))]
            : [
                ...new Set(
                  String(data.tags)
                    .split(",")
                    .map((t) => t.trim()),
                ),
              ]
          : undefined;

      const folder = slug.length > 1 ? slug[0] : undefined;

      // Extract content without frontmatter for searching
      const contentWithoutFrontmatter = parsed.content.trim();

      // Get file modification time
      const stats = fs.statSync(fullPath);
      const lastModified = stats.mtime;

      // Parse keywords from frontmatter
      const keywords =
        data && data.keywords
          ? Array.isArray(data.keywords)
            ? [...new Set(data.keywords.map(String).map((k) => k.trim()))]
            : [
                ...new Set(
                  String(data.keywords)
                    .split(",")
                    .map((k) => k.trim()),
                ),
              ]
          : undefined;

      // Parse dates from frontmatter (fallback to file mtime)
      const publishedAt =
        data && data.publishedAt
          ? new Date(String(data.publishedAt)).toISOString()
          : undefined;

      const updatedAt =
        data && data.updatedAt
          ? new Date(String(data.updatedAt)).toISOString()
          : lastModified.toISOString();

      files.push({
        slug,
        title,
        description,
        tags,
        keywords,
        folder,
        content: contentWithoutFrontmatter,
        publishedAt,
        updatedAt,
        lastModified,
      });
    }
  }

  return files;
}

export function groupByFolder(files: MDXFile[]) {
  const grouped: Record<string, MDXFile[]> = {};

  files.forEach((file) => {
    const key = file.folder || "Root";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(file);
  });

  return grouped;
}

export const getAllMDXFiles = cache((): MDXFile[] => {
  const { path } = getServerModules();
  const contentDir = path.join(process.cwd(), "content");
  return getMDXFiles(contentDir);
});

export function getRecentArticles(files: MDXFile[], count: number): MDXFile[] {
  return [...files]
    .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
    .slice(0, count);
}

export function getTopTags(
  files: MDXFile[],
  count: number,
): { tag: string; count: number }[] {
  const tagCounts = new Map<string, number>();
  for (const file of files) {
    for (const tag of file.tags ?? []) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }
  return [...tagCounts.entries()]
    .map(([tag, c]) => ({ tag, count: c }))
    .sort((a, b) => b.count - a.count)
    .slice(0, count);
}

export function getContentStats(
  files: MDXFile[],
  grouped: Record<string, MDXFile[]>,
) {
  const allTags = new Set<string>();
  for (const file of files) {
    for (const tag of file.tags ?? []) allTags.add(tag);
  }
  return {
    totalArticles: files.length,
    totalCategories: Object.keys(grouped).length,
    totalTags: allTags.size,
  };
}
