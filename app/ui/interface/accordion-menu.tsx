"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MDXFile } from "@/lib/mdx-utils";
import {
  ChevronDown,
  Box,
  Layers,
  Server,
  Grid3x3,
  Network,
  Circle,
  HardDrive,
  FileText,
  Terminal,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/ScrollArea";

interface AccordionMenuProps {
  groupedFiles: Record<string, MDXFile[]>;
}

// Map folder names to icons
const getIconForFolder = (folderName: string) => {
  const lowerName = folderName.toLowerCase();
  if (lowerName === "root") return <Terminal size={16} />;
  if (lowerName.includes("docker")) return <Box size={16} />;
  if (lowerName.includes("fedora")) return <Layers size={16} />;
  if (lowerName.includes("kubernetes") || lowerName.includes("k8s"))
    return <Server size={16} />;
  if (lowerName.includes("misc")) return <Grid3x3 size={16} />;
  if (lowerName.includes("network")) return <Network size={16} />;
  if (lowerName.includes("ubuntu")) return <Circle size={16} />;
  if (lowerName.includes("vm")) return <HardDrive size={16} />;
  if (lowerName.includes("wordpress")) return <FileText size={16} />;
  return <Grid3x3 size={16} />; // Default icon for any other categories
};

export default function AccordionMenu({ groupedFiles }: AccordionMenuProps) {
  const pathname = usePathname();
  const [userToggledFolders, setUserToggledFolders] =
      useState<Set<string> | null>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);

  // Scroll the sidebar to keep active link visible on mount and navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeLinkRef.current) {
        activeLinkRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  const activeFolderFromPath = useMemo(() => {
    // Decode the pathname to handle encoded characters like %20 for spaces
    const decodedPathname = decodeURIComponent(pathname || "");
    const activeEntry = Object.entries(groupedFiles).find(([, files]) =>
        files.some((file) => `/docs/${file.slug.join("/")}` === decodedPathname),
    );
    return activeEntry ? new Set([activeEntry[0]]) : new Set<string>();
  }, [pathname, groupedFiles]);

  // When the path changes, reset any manual toggles
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserToggledFolders(null);
  }, [pathname]);

  const openFolders = userToggledFolders ?? activeFolderFromPath;

  const toggleFolder = (folderName: string) => {
    setUserToggledFolders((prev) => {
      // If nothing was manually toggled, start from the active-from-path state
      const currentOpen = prev ?? activeFolderFromPath;
      const next = new Set(currentOpen);

      if (next.has(folderName)) {
        next.delete(folderName);
      } else {
        // Our accordion logic is to only have one open at a time
        next.clear();
        next.add(folderName);
      }
      return next;
    });
  };

  return (
      <ScrollArea className="flex-1">
        <nav className="px-4 pt-4 pb-16 space-y-1">
          {Object.entries(groupedFiles).map(([folderName, files]) => {
            const isOpen = openFolders.has(folderName);
            const decodedPathname = decodeURIComponent(pathname || "");
            const hasActivePage = files.some(
                (file) => `/docs/${file.slug.join("/")}` === decodedPathname,
            );
            const Icon = getIconForFolder(folderName);

            return (
                <div key={folderName} className="mb-1">
                  <button
                      onClick={() => toggleFolder(folderName)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors group ${hasActivePage
                          ? "text-blue-600"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                  <span
                      className={`transition-colors ${hasActivePage
                          ? "text-blue-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                  >
                    {Icon}
                  </span>
                      {folderName}
                    </div>
                    <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-500 rounded-full border border-slate-200 group-hover:border-slate-300 transition-colors">
                    {files.length}
                  </span>
                      <ChevronDown
                          size={14}
                          className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"
                          }`}
                      />
                    </div>
                  </button>

                  {/* Submenu */}
                  <div
                      className={`transition-[max-height,opacity] duration-300 ease-in-out ${isOpen
                          ? "max-h-[60vh] opacity-100 overflow-y-auto"
                          : "max-h-0 opacity-0 overflow-hidden"
                      }`}
                  >
                    <div className="mt-1 space-y-0.5">
                      {files.map((file) => {
                        const href = `/docs/${file.slug.join("/")}`;
                        const isActive = decodeURIComponent(pathname || "") === href;

                        return (
                            <Link
                                key={file.slug.join("/")}
                                href={href}
                                ref={isActive ? activeLinkRef : null}
                                className={`block pl-4 pr-3 py-2 text-sm transition-colors border-l-2 ${isActive
                                    ? "text-blue-600 font-medium border-blue-600"
                                    : "text-slate-500 hover:text-slate-900 border-transparent"
                                }`}
                                title={file.title}
                            >
                              {file.title}
                            </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
            );
          })}
        </nav>

        {/* Bottom Gradient Fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
      </ScrollArea>
  );
}
