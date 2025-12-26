/**
 * Site Configuration
 *
 * Edit this file to customize your documentation site.
 * All values are centralized here for easy configuration.
 */

export const siteConfig = {
  // Site Identity
  name: "TK Docs",
  title: "TK Docs",
  description: "A modern, high-performance documentation platform.",
  url: "https://doc.tkweb.site",

  // Open Graph / Social Sharing
  og: {
    image: "",
    imageWidth: 1200,
    imageHeight: 630,
  },

  // Twitter / X Configuration
  twitter: {
    card: "summary_large_image",
    creator: "@yourtwitterhandle",
  },

  // Analytics
  analytics: {
    googleAnalyticsId: "", // e.g. G-XXXXXXXXXX
  },

  // Debug / Error Handling (no environment variables)
  debug: {
    // Log errors caught by the global error boundary to console
    logErrors: false,
    // Show detailed error messages in the error UI
    showErrorDetails: false,
  },

  // Social Media Links (set to null or empty string to hide)
  social: {
    github: "https://github.com/dedkola",
    twitter: "https://twitter.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
  },

  // Footer
  footer: {
    companyName: "TK Docs",
    copyright: `© ${new Date().getFullYear()} All rights reserved.`,
  },
} as const;

export type SiteConfig = typeof siteConfig;
