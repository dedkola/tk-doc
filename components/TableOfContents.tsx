"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { ShareButtons } from "./ShareButtons";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TOCProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TOCProps) {
  const [activeId, setActiveId] = useState<string>("");
  const activeItemRef = useRef<HTMLAnchorElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll the TOC container to keep active item visible (debounced)
  useEffect(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      if (activeId && activeItemRef.current) {
        activeItemRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 100);

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [activeId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          // Find all intersecting entries (visible in viewport)
          const intersectingEntries = entries.filter((entry) => entry.isIntersecting);
          
          if (intersectingEntries.length > 0) {
            // Sort by position from top of viewport
            // Headings closer to or past the top (including negative values) should be active
            // This ensures the heading currently being read is highlighted
            intersectingEntries.sort((a, b) => {
              return a.boundingClientRect.top - b.boundingClientRect.top;
            });
            
            setActiveId(intersectingEntries[0].target.id);
          }
        },
        {
          // Use top rootMargin to trigger when heading reaches near the top
          // and bottom rootMargin to include more of the page
          rootMargin: "-80px 0px -40% 0px",
          threshold: 0,
        },
    );

    const headingElements = headings
        .map(({ id }) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

    headingElements.forEach((el) => observer.observe(el));

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
      <nav className="hidden xl:block max-h-[calc(100vh-8rem)] overflow-auto">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-semibold mb-3 text-foreground">
            On This Page
          </h2>
          <ul className="space-y-2 text-sm">
            {headings.map((heading) => (
                <li
                    key={heading.id}
                    style={{ paddingLeft: `${(heading.level - 2) * 0.75}rem` }}
                >
                  <a
                      ref={activeId === heading.id ? activeItemRef : null}
                      href={`#${heading.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(heading.id)?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}
                      className={cn(
                          "block py-1 text-muted-foreground hover:text-foreground transition-colors border-l-2 pl-3",
                          activeId === heading.id
                              ? "border-primary text-primary font-medium"
                              : "border-transparent",
                      )}
                  >
                    {heading.text}
                  </a>
                </li>
            ))}
          </ul>
          <ShareButtons />
        </div>
      </nav>
  );
}
