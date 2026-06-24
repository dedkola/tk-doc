import { MetadataRoute } from "next";
export const dynamic = "force-static";
import { getAllMDXFiles } from "@/lib/mdx-utils";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  try {
    const baseUrl = siteConfig.url;
    const allMDXFiles = getAllMDXFiles();

    const docs = allMDXFiles.map((file) => ({
      url: `${baseUrl}/docs/${file.slug.map((s) => encodeURIComponent(s)).join("/")}`,
      lastModified: file.lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseUrl}/docs`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      ...docs,
    ];
  } catch (e) {
    console.error("[sitemap] Error generating sitemap:", e);
    return [{ url: siteConfig.url, lastModified: new Date() }];
  }
}
