import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/Badge";
import { TableOfContents } from "@/components/TableOfContents";
import { extractHeadings } from "@/lib/extract-headings";
import { mdxComponents } from "@/lib/mdx-page-components";
import { getAllMDXFiles } from "@/lib/mdx-utils";

// Generate metadata for each page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const decodedSlug = slug.map((s) => decodeURIComponent(s));
  const filePath = decodedSlug.join("/");
  const fullPath = path.join(process.cwd(), "content", `${filePath}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  const fileContent = fs.readFileSync(fullPath, "utf-8");
  const { data: frontmatter } = matter(fileContent);

  const title = frontmatter.title || "Documentation";
  const description =
    frontmatter.description || `${siteConfig.name} - Documentation`;

  return {
    title: `${title} | ${siteConfig.name}`,
    description: description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description: description,
      url: `${siteConfig.url}/docs/${filePath}`,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "article",
      images: siteConfig.og.image
        ? [{ url: siteConfig.og.image, width: siteConfig.og.imageWidth, height: siteConfig.og.imageHeight, alt: siteConfig.title }]
        : undefined,
    },
    twitter: {
      card: siteConfig.twitter.card as
        | "summary"
        | "summary_large_image"
        | "app"
        | "player",
      title: `${title} | ${siteConfig.name}`,
      description: description,
      images: siteConfig.og.image ? [siteConfig.og.image] : undefined,
    },
    alternates: {
      canonical: `${siteConfig.url}/docs/${filePath}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const decodedSlug = slug.map((s) => decodeURIComponent(s));
  const filePath = decodedSlug.join("/");

  // Read and parse MDX file with frontmatter
  const fullPath = path.join(process.cwd(), "content", `${filePath}.mdx`);

  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(fullPath, "utf-8");
  const stats = fs.statSync(fullPath);

  // Parse frontmatter and content
  const { data: frontmatter, content } = matter(fileContent);

  const title = frontmatter.title || "";
  const description = frontmatter.description || "";
  const tags = frontmatter.tags || [];
  // Handle keywords as either string or array
  const rawKeywords = frontmatter.keywords;
  const keywords: string[] = rawKeywords
    ? Array.isArray(rawKeywords)
      ? rawKeywords
      : String(rawKeywords).split(",").map((k: string) => k.trim())
    : [];
  const headings = extractHeadings(content);

  // Date handling for structured data
  const publishedAt = frontmatter.publishedAt
    ? new Date(frontmatter.publishedAt).toISOString()
    : undefined;
  const updatedAt = frontmatter.updatedAt
    ? new Date(frontmatter.updatedAt).toISOString()
    : stats.mtime.toISOString();

  // Build breadcrumb items
  const breadcrumbItems = [
    { name: "Home", url: siteConfig.url },
    { name: "Docs", url: `${siteConfig.url}/docs` },
  ];
  if (decodedSlug.length > 1) {
    // Add category
    const category = decodedSlug[0].charAt(0).toUpperCase() + decodedSlug[0].slice(1);
    breadcrumbItems.push({
      name: category,
      url: `${siteConfig.url}/docs/${encodeURIComponent(decodedSlug[0])}`,
    });
  }
  breadcrumbItems.push({
    name: title,
    url: `${siteConfig.url}/docs/${filePath}`,
  });

  // JSON-LD Structured Data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description: description,
    url: `${siteConfig.url}/docs/${filePath}`,
    ...(publishedAt && { datePublished: publishedAt }),
    dateModified: updatedAt,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/docs/${filePath}`,
    },
    ...(keywords.length > 0 && { keywords: keywords.join(", ") }),
    ...(tags.length > 0 && { about: tags }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <div className="flex flex-col xl:flex-row xl:items-start gap-8">
        <div className="w-full max-w-3xl flex-1 min-w-0 overflow-hidden">
          <h1 className="mb-4 text-3xl sm:text-4xl font-bold text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mb-4 text-base sm:text-lg text-muted-foreground">
              {description}
            </p>
          )}
          {tags.length > 0 && (
            <div className="mb-6 sm:mb-8 flex flex-wrap gap-2">
              {tags.map((tag: string, index: number) => (
                <Link
                  key={`${tag}-${index}`}
                  href={`/?tag=${encodeURIComponent(tag)}`}
                >
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
          <article className="prose prose-foreground w-full max-w-none">
            <MDXRemote
              source={content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          </article>
        </div>
        <aside className="w-full xl:w-64 xl:sticky xl:top-28 shrink-0">
          <TableOfContents headings={headings} />
        </aside>
      </div>
    </div>
  );
}
export function generateStaticParams() {
  const allFiles = getAllMDXFiles();
  return allFiles.map((file) => ({ slug: file.slug }));
}

export const dynamicParams = false;
