import dynamic from "next/dynamic";
import SideNav from "@app/ui/interface/sidenav";
import LayoutClient from "@app/ui/interface/layout-client";
import { getAllMDXFiles, groupByFolder } from "@/lib/mdx-utils";
import Header from "@/components/header";
import { SearchProvider } from "@/app/ui/interface/search-context";
import { siteConfig } from "@/config/site";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import React from "react";
import { SpeedInsights } from '@vercel/speed-insights/next';
// Dynamic imports for non-critical components
const Footer = dynamic(() => import("@/components/footer"), {
  ssr: true,
});

const Analytics = dynamic(
  () =>
    import("@/components/analytics").then((mod) => ({
      default: mod.Analytics,
    })),
  {
    ssr: true,
  },
);

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: siteConfig.og.image
      ? [
          {
            url: siteConfig.og.image,
            width: siteConfig.og.imageWidth,
            height: siteConfig.og.imageHeight,
            alt: siteConfig.title,
          },
        ]
      : undefined,
  },
  twitter: {
    card: siteConfig.twitter.card as
      | "summary"
      | "summary_large_image"
      | "app"
      | "player",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.twitter.creator,
    images: siteConfig.og.image ? [siteConfig.og.image] : undefined,
  },
};

// Ensure proper mobile scaling and prevent desktop-width layout on phones
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allMDXFiles = getAllMDXFiles();
  const groupedFiles = groupByFolder(allMDXFiles);

  return (
    <html lang="en">
      <head />
      <body className="bg-white text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-700 flex min-h-screen flex-col">
        <Analytics />
        <SearchProvider>
          <Header />
          <LayoutClient
            sideNav={<SideNav />}
            groupedFiles={groupedFiles}
            footer={<Footer />}
          >
            {children}
            <Analytics />
          </LayoutClient>
        </SearchProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
