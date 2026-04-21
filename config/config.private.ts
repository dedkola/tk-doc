import type { BaseSiteConfig } from "./config.base";

export const privateConfig: Partial<BaseSiteConfig> = {
  name: "TK Doc",
  title: "TK Doc",
  description: "A modern, high-performance documentation platform.",
  url: "https://doc.tkweb.site",
  og: {
    image: "/opengraph-image.png",
    imageWidth: 1200,
    imageHeight: 630,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@KolaSokolov",
  },
  analytics: {
    googleAnalyticsId: "G-35JQN469E9",
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
    companyName: "TK Doc",
    copyright: `© ${new Date().getFullYear()} All rights reserved.`,
  },
};
