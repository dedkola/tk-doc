"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
  placeholder: string;
  onSearch: (query: string) => void;
  value?: string;
}

export default function Search({ placeholder, onSearch, value }: SearchProps) {
  const isControlled = value !== undefined;
  const [uncontrolledQuery, setUncontrolledQuery] = useState(value ?? "");
  const query = isControlled ? (value as string) : uncontrolledQuery;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSearch(term: string) {
    if (!isControlled) {
      setUncontrolledQuery(term);
    }
    onSearch(term);
  }

  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        id="search"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        className="pl-10 pr-12 py-2 border border-border rounded-lg leading-5 bg-secondary/50 text-foreground placeholder:text-muted-foreground focus-visible:bg-background text-sm shadow-xs"
      />
    </div>
  );
}
