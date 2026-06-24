interface Heading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const headings: Heading[] = [];
  const usedIds = new Map<string, number>();
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    let id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    // Deduplicate IDs
    const count = usedIds.get(id) || 0;
    usedIds.set(id, count + 1);
    if (count > 0) {
      id = `${id}-${count}`;
    }

    headings.push({ id, text, level });
  }

  return headings;
}
