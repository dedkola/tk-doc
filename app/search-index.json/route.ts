import { createSearchIndex, getAllMDXFiles } from "@/lib/mdx-utils";

export const dynamic = "force-static";

export function GET() {
  return Response.json(createSearchIndex(getAllMDXFiles()));
}
