import { getAllMDXFiles } from "@/lib/mdx-utils";
import { siteConfig } from "@/config/site";

export async function GET() {
  const allFiles = getAllMDXFiles();
  const baseUrl = siteConfig.url;

  const items = allFiles
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.lastModified).getTime() -
        new Date(a.updatedAt || a.lastModified).getTime(),
    )
    .map((file) => {
      const url = `${baseUrl}/docs/${file.slug.map((s) => encodeURIComponent(s)).join("/")}`;
      const pubDate =
        file.publishedAt || file.updatedAt || file.lastModified.toISOString();
      // Escape XML special characters
      const escapeXml = (s: string) =>
        s
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      return `    <item>
      <title>${escapeXml(file.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(pubDate).toUTCString()}</pubDate>
      ${file.description ? `<description>${escapeXml(file.description)}</description>` : ""}
      ${file.tags ? file.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ") : ""}
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${baseUrl}</link>
    <description>${siteConfig.description}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
