"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Search from "@/app/ui/search";
import { Button } from "@/components/ui/Button";
import { Search as SearchIcon, Menu, X } from "lucide-react";
import { GithubIcon, TwitterXIcon } from "@/components/SocialIcons";
import { useSearch } from "@/app/ui/interface/search-context";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { siteConfig } from "@/config/site";
export default function Header() {
  const {
    sidebarOpen,
    setSidebarOpen,
    setSearchQuery,
    searchQuery,
    setSelectedTag,
  } = useSearch();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const pathname = usePathname();

  // Ensure clicking the logo or Home link always takes user to a clean homepage
  const handleGoHome = () => {
    setSearchQuery("");
    setSelectedTag(null);
    setSidebarOpen(false);
    setIsMobileSearchOpen(false);
  };
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-700/80 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-600 dark:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <Link
            href="/"
            onClick={handleGoHome}
            className="flex items-center gap-2 group"
          >
            <Logo />
          </Link>
        </div>
        {/* Center: Search Bar (Desktop) */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <Search
              placeholder="Search documentation..."
              onSearch={setSearchQuery}
              value={searchQuery}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-slate-400 text-xs border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5">
                ⌘K
              </span>
            </div>
          </div>
        </div>
        {/* Right: Links & Mobile Search */}
        <div className="flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
          <Link
            href="/"
            onClick={handleGoHome}
            className={`hidden sm:block transition-colors ${
              pathname === "/"
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            Home
          </Link>
          <Link
            href="/docs"
            className={`hidden sm:block transition-colors ${
              pathname.startsWith("/docs")
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            Docs
          </Link>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
          {/* Mobile Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            aria-label="Toggle search"
          >
            <SearchIcon size={20} />
          </Button>
          <ThemeToggle />
          <div className="flex items-center gap-2">
            {siteConfig.social.github && (
              <Link
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                aria-label="GitHub"
              >
                <GithubIcon size={20} />
              </Link>
            )}
            {siteConfig.social.twitter && (
              <Link
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-50 rounded-full transition-all"
                aria-label="Twitter"
              >
                <TwitterXIcon size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Search Bar Dropdown */}
      {isMobileSearchOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <Search
              placeholder="Search..."
              onSearch={setSearchQuery}
              value={searchQuery}
            />
          </div>
        </div>
      )}
    </header>
  );
}
