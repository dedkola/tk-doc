"use client";
import { useState } from "react";
import Link from "next/link";
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

  // Ensure clicking the logo always takes user to a clean homepage
  const handleGoHome = () => {
    setSearchQuery("");
    setSelectedTag(null);
    setSidebarOpen(false);
    setIsMobileSearchOpen(false);
  };
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden -ml-2 text-muted-foreground"
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
              <SearchIcon className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Search
              placeholder="Search documentation..."
              onSearch={setSearchQuery}
              value={searchQuery}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-muted-foreground text-xs border border-border rounded px-1.5 py-0.5">
                ⌘K
              </span>
            </div>
          </div>
        </div>
        {/* Right: Mobile Search */}
        <div className="flex items-center gap-1 sm:gap-2 text-sm font-medium text-muted-foreground">
          {/* Mobile Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            aria-label="Toggle search"
          >
            <SearchIcon size={20} />
          </Button>
          <ThemeToggle />
          <div className="flex items-center">
            {siteConfig.social.github && (
              <Link
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors"
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
                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
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
        <div className="md:hidden border-t border-border bg-background px-4 py-3 shadow-sm">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
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
