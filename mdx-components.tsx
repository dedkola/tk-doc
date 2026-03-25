import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
// Lazy load the Code component to reduce initial bundle size
const Code = dynamic(
  () => import("./components/Code").then((mod) => mod.Code),
  {
    loading: () => (
      <div className="my-6 rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-400">
        Loading code...
      </div>
    ),
  },
);

/** Extract plain text from React children to generate heading IDs.
 *  Must match the algorithm in lib/extract-headings.ts exactly. */
function getTextContent(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (node && typeof node === "object" && "props" in node) {
    return getTextContent(
      (node as { props: { children?: ReactNode } }).props.children,
    );
  }
  return "";
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-8 text-4xl font-bold">{children}</h1>
  ),
  h2: ({ children }) => {
    const id = slugify(getTextContent(children));
    return (
      <h2 id={id} className="mb-3 mt-6 text-3xl font-light scroll-mt-20">
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const id = slugify(getTextContent(children));
    return (
      <h3 id={id} className="mb-2 mt-5 text-2xl font-semibold scroll-mt-20">
        {children}
      </h3>
    );
  },
  h4: ({ children }) => {
    const id = slugify(getTextContent(children));
    return (
      <h4 id={id} className="mb-2 mt-4 text-xl font-semibold scroll-mt-20">
        {children}
      </h4>
    );
  },
  p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">
          {children}
        </code>
      );
    }
    return <Code className={className}>{children}</Code>;
  },
  pre: ({ children }) => <>{children}</>,
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-4 border-border pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-border">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="bg-muted px-4 py-2 text-left font-semibold text-foreground">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-t border-border px-4 py-2 text-foreground">
      {children}
    </td>
  ),
  hr: () => <hr className="my-8 border-border" />,
  img: (props) => {
    // If width and height are provided, use them. Otherwise, use fill or a default aspect ratio hack.
    // For MDX, often we don't know the size.
    // We'll assume standard markdown images might not have dimensions.
    // If it's a relative path (local image), Next.js requires import or dimensions.
    // If it's an external URL, we need dimensions.

    // Simplest robust approach for MDX without rehype-img-size:
    // Use a wrapper div and 'fill' or 'responsive' if possible, but 'width' and 'height' are best.
    // If props are missing, we fallback to a standard img to avoid breaking the build,
    // but we try to use Next/Image where possible.

    if (
      props.src &&
      (props.src.startsWith("/") || props.src.startsWith("http"))
    ) {
      return (
        <span className="block relative my-8 w-full h-auto aspect-video rounded-lg overflow-hidden bg-slate-100">
          <Image
            src={props.src}
            alt={props.alt || ""}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
          />
        </span>
      );
    }
    // Fallback for weird cases
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        alt={props.alt || ""}
        className="rounded-lg my-8 max-w-full h-auto"
      />
    );
  },
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tab: TabsContent, // Alias for easier MDX usage
};

export function useMDXComponents(): MDXComponents {
  return components;
}
