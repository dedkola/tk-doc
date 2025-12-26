import type { BaseSiteConfig } from "./site.base";

export const localConfig: Partial<BaseSiteConfig> = {
  name: "TK Docs",
  title: "TK Docs",
  description: "A modern, high-performance documentation platform.",
  url: "https://doc.tkweb.site",
  og: {
    image: "",
    imageWidth: 1200,
    imageHeight: 630,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@yourtwitterhandle",
  },
  analytics: {
    googleAnalyticsId: "G-5555555555",
  },
  debug: {
    logErrors: false,
    showErrorDetails: false,
  },
  social: {
    github: "https://github.com/dedkola",
    twitter: "https://x.com/KolaSokolov",
    linkedin: "https://www.linkedin.com/in/nikolay-sokolovskiy-it/",
  },
  footer: {
    companyName: "TK Docs",
    copyright: `© ${new Date().getFullYear()} All rights reserved.`,
  },
};
