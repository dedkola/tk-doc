"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { MDXFile } from "@/lib/mdx-utils";
import { useSearch } from "./search-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Folder, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SearchResultsProps {
  groupedFiles: Record<string, MDXFile[]>;
}

export default function SearchResults({ groupedFiles }: SearchResultsProps) {
  const { searchQuery, setSearchQuery, selectedTag, setSelectedTag } =
    useSearch();

  type ResultType = {
    folder: string;
    file: MDXFile;
    excerpt?: string;
    matchType: string;
  };

  const searchResults = useMemo(() => {
    // Tag filtering
    if (selectedTag) {
      const results: ResultType[] = [];

      Object.entries(groupedFiles).forEach(([folderName, files]) => {
        files.forEach((file) => {
          if (
            file.tags?.some(
              (tag) => tag.toLowerCase() === selectedTag.toLowerCase(),
            )
          ) {
            results.push({ folder: folderName, file, matchType: "tag" });
          }
        });
      });

      return results;
    }

    // Search query
    if (!searchQuery.trim()) {
      return null;
    }

    const query = searchQuery.toLowerCase();
    const results: ResultType[] = [];

    Object.entries(groupedFiles).forEach(([folderName, files]) => {
      files.forEach((file) => {
        let matchType = "";
        let excerpt = "";

        // Search in title
        if (file.title.toLowerCase().includes(query)) {
          matchType = "title";
          results.push({ folder: folderName, file, matchType });
          return;
        }

        // Search in folder name
        if (folderName.toLowerCase().includes(query)) {
          matchType = "folder";
          results.push({ folder: folderName, file, matchType });
          return;
        }

        // Search in description
        if (file.description?.toLowerCase().includes(query)) {
          matchType = "description";
          results.push({ folder: folderName, file, matchType });
          return;
        }

        // Search in tags
        if (file.tags?.some((tag) => tag.toLowerCase().includes(query))) {
          matchType = "tag";
          results.push({ folder: folderName, file, matchType });
          return;
        }

        // Search in content
        if (file.content?.toLowerCase().includes(query)) {
          matchType = "content";

          // Extract excerpt around the match
          const contentLower = file.content.toLowerCase();
          const matchIndex = contentLower.indexOf(query);
          const start = Math.max(0, matchIndex - 100);
          const end = Math.min(
            file.content.length,
            matchIndex + query.length + 100,
          );
          excerpt = "..." + file.content.substring(start, end).trim() + "...";

          results.push({ folder: folderName, file, excerpt, matchType });
        }
      });
    });

    return results;
  }, [groupedFiles, searchQuery, selectedTag]);

  if (!searchQuery.trim() && !selectedTag) {
    return null;
  }

  const displayQuery = selectedTag || searchQuery;
  const isTagFilter = !!selectedTag;

  // Helper to highlight text
  const HighlightText = ({
    text,
    highlight,
  }: {
    text: string;
    highlight: string;
  }) => {
    if (!highlight || !text) return <>{text}</>;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span
              key={i}
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 font-medium px-0.5 rounded"
            >
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  return (
    <div className="w-full max-w-[calc(100vw-2rem)] sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {isTagFilter ? "Tagged Posts" : "Search Results"}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <span>
              Found {searchResults?.length || 0} result
              {searchResults?.length !== 1 ? "s" : ""}
              {isTagFilter ? " for tag" : " for"}
            </span>
            {isTagFilter ? (
              <Button
                onClick={() => setSelectedTag(null)}
                variant="secondary"
                size="sm"
                className="h-6 px-2 gap-1 text-xs font-medium"
              >
                #{displayQuery}
                <X className="w-3 h-3" />
              </Button>
            ) : (
              <span className="font-medium text-foreground">
                &quot;{displayQuery}&quot;
              </span>
            )}
          </div>
        </div>
      </div>

      {searchResults && searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map(({ folder, file, excerpt, matchType }) => (
            <Link
              key={file.slug.join("/")}
              href={`/docs/${file.slug.join("/")}`}
              className="group block h-full"
            >
              <Card className="h-full flex flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
                      <Folder className="w-3 h-3" />
                      <span>{folder}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-2 py-0.5 h-5 font-normal uppercase tracking-wider opacity-70"
                    >
                      {matchType} match
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                    <HighlightText text={file.title} highlight={searchQuery} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  {(excerpt || file.description) && (
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      <HighlightText
                        text={excerpt || file.description || ""}
                        highlight={searchQuery}
                      />
                    </p>
                  )}

                  {file.tags && file.tags.length > 0 && (
                    <div className="mt-auto pt-2 flex flex-wrap gap-1.5">
                      {file.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={`${tag}-${index}`}
                          variant="secondary"
                          className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border-transparent font-medium"
                        >
                          #{tag}
                        </Badge>
                      ))}
                      {file.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                          +{file.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No results found
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            We couldn&apos;t find anything matching &quot;{displayQuery}&quot;.
            Try searching for different keywords or browse the categories.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedTag(null);
              const searchInput = document.getElementById(
                "search",
              ) as HTMLInputElement;
              if (searchInput) {
                searchInput.focus();
              }
            }}
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
}
