"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSearch } from "./search-context";
import type { MDXFile } from "@/lib/mdx-utils";
import SearchResults from "./search-results";

interface LayoutClientProps {
  children: ReactNode;
  sideNav: ReactNode;
  groupedFiles: Record<string, MDXFile[]>;
  footer: ReactNode;
}

export default function LayoutClient({
  children,
  sideNav,
  groupedFiles,
  footer,
}: LayoutClientProps) {
  const {
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    sidebarOpen,
    setSidebarOpen,
  } = useSearch();
  const pathname = usePathname();

  // Close sidebar on mobile by default when first loading the home page
  useEffect(() => {
    // Check if we're on mobile (< 1024px which is lg breakpoint)
    const isMobile = window.innerWidth < 1024;

    if (isMobile && pathname === "/") {
      setSidebarOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Close sidebar when viewport shrinks below the lg breakpoint
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setSidebarOpen(false);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [setSidebarOpen]);

  // Clear search when navigating to a blog post
  useEffect(() => {
    if (pathname.startsWith("/docs/")) {
      setSearchQuery("");
      setSelectedTag(null);
      setSidebarOpen(false); // Close sidebar on mobile when navigating
    }
  }, [pathname, setSearchQuery, setSelectedTag, setSidebarOpen]);
  return (
    <div className="flex flex-1 container mx-auto px-4">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:sticky lg:top-16 lg:max-h-[calc(100vh-4rem)] inset-y-0 left-0 z-50 lg:z-30 w-64 shrink-0 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sideNav}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1">
          {searchQuery.trim() || selectedTag ? (
            <SearchResults groupedFiles={groupedFiles} />
          ) : (
            children
          )}
        </div>
        {footer}
      </div>
    </div>
  );
}
