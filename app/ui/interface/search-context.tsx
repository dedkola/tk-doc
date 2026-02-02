"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Suspense,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}
const SearchContext = createContext<SearchContextType | undefined>(undefined);

function UrlSync({
                   searchQuery,
                   setSearchQuery,
                   setSelectedTag,
                 }: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tag = searchParams.get("tag");
  const query = searchParams.get("search");

  // Sync Tag from URL
  useEffect(() => {
    setSelectedTag(tag);
  }, [tag, setSelectedTag]);

  // Sync Search state from URL
  useEffect(() => {
    setSearchQuery(query || "");
  }, [query, setSearchQuery]);

  // Sync URL from Search state (Debounced)
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const currentQuery = params.get("search") || "";

      if (searchQuery !== currentQuery) {
        if (searchQuery) {
          params.set("search", searchQuery);
        } else {
          params.delete("search");
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, pathname, router, searchParams]);

  return null;
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
      <SearchContext.Provider
          value={{
            searchQuery,
            setSearchQuery,
            selectedTag,
            setSelectedTag,
            sidebarOpen,
            setSidebarOpen,
          }}
      >
        <Suspense fallback={null}>
          <UrlSync
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setSelectedTag={setSelectedTag}
          />
        </Suspense>
        {children}
      </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
