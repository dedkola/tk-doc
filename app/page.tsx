import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/logo";
import { siteConfig } from "@/config/site";
import {
  getAllMDXFiles,
  groupByFolder,
  getRecentArticles,
  getTopTags,
  getContentStats,
} from "@/lib/mdx-utils";
import { formatRelativeTime } from "@/lib/utils";
import { FileText, FolderOpen, Tags, ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Home | ${siteConfig.name}`,
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function Home() {
  const allFiles = getAllMDXFiles();
  const grouped = groupByFolder(allFiles);
  const recent = getRecentArticles(allFiles, 6);
  const topTags = getTopTags(allFiles, 20);
  const stats = getContentStats(allFiles, grouped);

  return (
    <div className="bg-background">
      <main className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* ── Hero ── */}
        <section className="text-center space-y-4 pt-4">
          <div className="flex justify-center">
            <Logo />
          </div>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {siteConfig.description}
          </p>
          <div className="flex items-center justify-center pt-2">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              Browse Docs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="grid grid-cols-3 gap-4">
          {[
            {
              icon: FileText,
              label: "Articles",
              value: stats.totalArticles,
            },
            {
              icon: FolderOpen,
              label: "Categories",
              value: stats.totalCategories,
            },
            { icon: Tags, label: "Tags", value: stats.totalTags },
          ].map(({ icon: Icon, label, value }) => (
            <Card key={label} className="text-center py-6">
              <div className="flex flex-col items-center gap-1">
                <Icon className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-2xl font-bold text-foreground">
                  {value}
                </span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            </Card>
          ))}
        </section>

        {/* ── Recently Updated ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Recently Updated
            </h2>
            <Link
              href="/docs"
              className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((file) => (
              <Link
                key={file.slug.join("/")}
                href={`/docs/${file.slug.join("/")}`}
                className="group block rounded-lg border border-border p-4 hover:border-blue-500/50 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  {file.folder && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    >
                      {file.folder}
                    </Badge>
                  )}
                  <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(file.lastModified)}
                  </span>
                </div>
                <h3 className="font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {file.title}
                </h3>
                {file.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {file.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Categories ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Browse by Category
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(grouped).map(([folder, files]) => (
              <Card key={folder} className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{folder}</CardTitle>
                    <Badge variant="secondary">{files.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {files.slice(0, 3).map((file) => (
                      <li key={file.slug.join("/")}>
                        <Link
                          href={`/docs/${file.slug.join("/")}`}
                          className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block"
                        >
                          {file.title}
                        </Link>
                      </li>
                    ))}
                    {files.length > 3 && (
                      <li className="text-xs text-muted-foreground pt-1">
                        +{files.length - 3} more
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Popular Tags ── */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Popular Topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {topTags.map(({ tag, count }) => (
              <Link key={tag} href={`/docs?tag=${encodeURIComponent(tag)}`}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-200 transition-colors"
                >
                  {tag}
                  <span className="ml-1 text-xs opacity-60">{count}</span>
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
