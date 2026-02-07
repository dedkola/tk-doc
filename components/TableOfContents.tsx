"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
    });

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [activeId]);

  useEffect(() => {
    // Determine active heading on mount or when headings change
    const determineActiveHeading = () => {
      let currentActiveId = "";
      // Loop through all headings to find the one that is currently active
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the element is above the 100px mark, it's a candidate for being the active section
          if (rect.top <= 100) {
            currentActiveId = heading.id;
          } else {
            // Once we find an element below the mark, we stop because subsequent headings
            // are definitely below it (assuming sequential order)
            break;
          }
        }
      }

      // If we found a candidate, set it. Otherwise if currentActiveId is empty
      // but we have headings, it means we are at the top, so maybe set valid first one?
      // Actually, if we are at top (rect.top > 100), no H2/H3 has passed yet.
      // So empty string is correct OR first one if it's close.
      // Let's stick to "last one that passed the threshold".
      if (currentActiveId) {
        setActiveId(currentActiveId);
      }
    };

    determineActiveHeading();
    // Run again after a short delay to handle browser scroll restoration
    const timer = setTimeout(determineActiveHeading, 150);

    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        {
          rootMargin: "-100px 0px -80% 0px",
        },
    );

    const headingElements = headings
        .map(({ id }) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

    headingElements.forEach((el) => observer.observe(el));

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
      clearTimeout(timer);
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
