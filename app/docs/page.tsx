import Link from "next/link";
import { getAllMDXFiles, groupByFolder } from "@/lib/mdx-utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Documentation | ${siteConfig.name}`,
  description: `Browse all documentation topics on ${siteConfig.name}.`,
  alternates: {
    canonical: `${siteConfig.url}/docs`,
  },
};

export default function BlogIndexPage() {
  const allMDXFiles = getAllMDXFiles();
  const groupedFiles = groupByFolder(allMDXFiles);

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-5xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Documentation
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our documentation by topic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(groupedFiles).map(([folder, files]) => (
          <Card
            key={folder}
            className="h-full hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl">{folder}</CardTitle>
                <Badge variant="secondary">{files.length} articles</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {files.slice(0, 5).map((file) => (
                  <li key={file.slug.join("/")}>
                    <Link
                      href={`/docs/${file.slug.join("/")}`}
                      className="text-muted-foreground hover:text-primary transition-colors block truncate"
                    >
                      {file.title}
                    </Link>
                  </li>
                ))}
                {files.length > 5 && (
                  <li className="text-sm text-muted-foreground pt-2">
                    And {files.length - 5} more...
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
