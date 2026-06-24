import { getAllMDXFiles, groupByFolder } from "@/lib/mdx-utils";
import SideNavClient from "./sidenav-client";

export default function SideNav() {
  const allMDXFiles = getAllMDXFiles();
  const groupedFiles = groupByFolder(allMDXFiles);

  // Collect all tags from groupedFiles
  const tagCount: Record<string, number> = {};
  Object.values(groupedFiles).forEach((files: unknown) => {
    (files as import("@/lib/mdx-utils").MDXFile[]).forEach((file) => {
      if (file.tags) {
        file.tags.forEach((tag: string) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      }
    });
  });

  // Get top 10 tags by frequency
  const topTags: [string, number][] = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return <SideNavClient groupedFiles={groupedFiles} topTags={topTags} />;
}
