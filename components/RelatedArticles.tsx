import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { MDXFile } from "@/lib/mdx-utils";

interface RelatedArticlesProps {
  currentSlug: string[];
  currentTags: string[];
  allFiles: MDXFile[];
  maxItems?: number;
}

export function RelatedArticles({
  currentSlug,
  currentTags,
  allFiles,
  maxItems = 3,
}: RelatedArticlesProps) {
  const currentPath = currentSlug.join("/");

  const scored = allFiles
    .filter((file) => file.slug.join("/") !== currentPath)
    .map((file) => {
      let score = 0;
      // Same folder gets a small bonus
      if (file.folder && currentSlug[0] === file.folder) score += 1;
      // Shared tags are the primary signal
      const fileTags = file.tags || [];
      for (const tag of fileTags) {
        if (currentTags.includes(tag)) score += 2;
      }
      return { file, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems);

  if (scored.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Related Articles
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scored.map(({ file }) => (
          <Link
            key={file.slug.join("/")}
            href={`/docs/${file.slug.join("/")}`}
            className="group block rounded-lg border border-border p-4 hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {file.title}
            </h3>
            {file.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {file.description}
              </p>
            )}
            {file.tags && file.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {file.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
