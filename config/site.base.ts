export const baseConfig = {
  name: "Template Docs",
  title: "Template Docs",
  description: "Base configuration for the TK Docs template.",
  url: "http://localhost:3000",
  og: {
    image: "",
    imageWidth: 1200,
    imageHeight: 630,
  },
  twitter: {
    card: "summary_large_image",
    creator: "",
  },
  analytics: {
    googleAnalyticsId: "",
  },
  debug: {
    logErrors: false,
    showErrorDetails: false,
  },
  social: {
    github: "",
    twitter: "",
    linkedin: "",
  },
  footer: {
    companyName: "Template Docs",
    copyright: `© ${new Date().getFullYear()} All rights reserved.`,
  },
} as const;

export type BaseSiteConfig = typeof baseConfig;
