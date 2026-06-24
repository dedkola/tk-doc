"use client";

import type { MDXFile } from "@/lib/mdx-utils";
import AccordionMenu from "./accordion-menu";
import { useSearch } from "./search-context";
import { Badge } from "@/components/ui/Badge";

interface SideNavClientProps {
  groupedFiles: Record<string, MDXFile[]>;
  topTags: [string, number][];
}

export default function SideNavClient({
  groupedFiles,
  topTags,
}: SideNavClientProps) {
  const { setSearchQuery, setSidebarOpen } = useSearch();

  return (
    <div className="h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="flex-1 overflow-y-auto break-words whitespace-normal">
        <AccordionMenu groupedFiles={groupedFiles} />
      </div>

      {/* Top Tags Section */}
      {topTags.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700">
          <div className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Top Tags
          </div>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  setSidebarOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="p-0 border-none bg-transparent cursor-pointer"
              >
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                >
                  {tag}{" "}
                  <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
                    ({count})
                  </span>
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
