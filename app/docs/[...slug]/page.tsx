import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { MDXComponents } from "mdx/types";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { Separator } from "@/components/ui/Separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/Table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/Select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/Command";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "@/components/ui/DropdownMenu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/NavigationMenu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/Popover";
import { ScrollArea } from "@/components/ui/ScrollArea";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/Sheet";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/Tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/Sidebar";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/Toast";
import { Kbd } from "@/components/ui/Kbd";
import { Code } from "@/components/Code";
import { TableOfContents } from "@/components/TableOfContents";
import { extractHeadings } from "@/lib/extract-headings";

// Define MDX components using design system
const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
      <h1 className="text-4xl font-bold tracking-tight mb-4 mt-8 text-foreground">
        {children}
      </h1>
  ),
  h2: ({ children }) => {
    const id = String(children)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
    return (
        <h2
            id={id}
            className="text-3xl font-semibold tracking-tight mb-3 mt-8 pb-2 border-b border-border text-foreground scroll-mt-24"
        >
          {children}
        </h2>
    );
  },
  h3: ({ children }) => {
    const id = String(children)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
    return (
        <h3
            id={id}
            className="text-2xl font-semibold tracking-tight mb-2 mt-6 text-foreground scroll-mt-24"
        >
          {children}
        </h3>
    );
  },
  h4: ({ children }) => {
    const id = String(children)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
    return (
        <h4
            id={id}
            className="text-xl font-semibold mb-2 mt-4 text-foreground scroll-mt-24"
        >
          {children}
        </h4>
    );
  },
  p: ({ children }) => (
      <p className="leading-7 mb-4 text-foreground">{children}</p>
  ),
  ul: ({ children }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
  ),
  li: ({ children }) => <li className="mb-2 leading-7">{children}</li>,
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
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
            {children}
          </code>
      );
    }
    return <Code className={className}>{children}</Code>;
  },
  pre: ({ children }) => <>{children}</>,
  blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-border pl-4 italic my-4 text-muted-foreground">
        {children}
      </blockquote>
  ),
  // Markdown table elements (from remark-gfm)
  table: ({ children }) => (
      <div className="my-6 w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          {children}
        </table>
      </div>
  ),
  thead: ({ children }) => (
      <thead className="border-b bg-muted/50">{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
      <tr className="border-b transition-colors hover:bg-muted/50">{children}</tr>
  ),
  th: ({ children }) => (
      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
        {children}
      </th>
  ),
  td: ({ children }) => (
      <td className="p-4 align-middle text-foreground">{children}</td>
  ),
  // UI Components - Cards
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  // UI Components - Forms
  Checkbox,
  Label,
  Button,
  Input,
  Textarea,
  Switch,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  // UI Components - Layout
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  // UI Components - Data Display
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  Kbd,
  // UI Components - Navigation
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  // UI Components - Overlays
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  // UI Components - Menus
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  // UI Components - Utilities
  ScrollArea,
  Skeleton,
  Spinner,
  // UI Components - Sidebar
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  // UI Components - Toast/Notifications
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
};

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
    },
    twitter: {
      card: siteConfig.twitter.card as
          | "summary"
          | "summary_large_image"
          | "app"
          | "player",
      title: `${title} | ${siteConfig.name}`,
      description: description,
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
function getMDXFiles(dir: string, baseDir: string = dir): string[][] {
  const files: string[][] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      files.push(...getMDXFiles(fullPath, baseDir));
    } else if (item.name.endsWith(".mdx")) {
      const relativePath = path.relative(baseDir, fullPath);
      const slug = relativePath.replace(/\.mdx$/, "").split(path.sep);
      files.push(slug);
    }
  }

  return files;
}

export function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content");
  const mdxFiles = getMDXFiles(contentDir);

  return mdxFiles.map((slug) => ({ slug }));
}

export const dynamicParams = true;
