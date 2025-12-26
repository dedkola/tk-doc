import type { BaseSiteConfig } from "./config.base";

// Example local dev-only overrides. Copy to config.local.ts to use.
export const localConfig: Partial<BaseSiteConfig> = {
  // Override domain for local development
  url: "http://localhost:3000",

  // Enable verbose debugging locally
  debug: {
    logErrors: true,
    showErrorDetails: true,
  },

  // Disable analytics locally
  analytics: {
    googleAnalyticsId: "",
  },
};
