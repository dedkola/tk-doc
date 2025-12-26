import { baseConfig, type BaseSiteConfig } from "./config.base";
import { privateConfig } from "./config.private";

const mergeSection = <T extends Record<string, unknown>>(
  baseSection: T,
  override?: Partial<T>
): T => ({
  ...baseSection,
  ...(override ?? {}),
});

// Optional local config: use conditional import with fallback
// In production (no config.local.ts), this will use empty object
// In development (with config.local.ts), this will use local overrides
let localConfig: Partial<BaseSiteConfig> = {};

// Try to import local config; if it doesn't exist, use empty object
// This works because the file is optional and gitignored
if (process.env.NODE_ENV === "development") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("./config.local");
    localConfig = mod?.localConfig || {};
  } catch {
    // No local config in development; proceed with empty overrides
  }
}

export const siteConfig: BaseSiteConfig = {
  ...baseConfig,
  ...privateConfig,
  ...localConfig,
  og: mergeSection(
    mergeSection(baseConfig.og, privateConfig.og),
    localConfig.og
  ),
  twitter: mergeSection(
    mergeSection(baseConfig.twitter, privateConfig.twitter),
    localConfig.twitter
  ),
  analytics: mergeSection(
    mergeSection(baseConfig.analytics, privateConfig.analytics),
    localConfig.analytics
  ),
  debug: mergeSection(
    mergeSection(baseConfig.debug, privateConfig.debug),
    localConfig.debug
  ),
  social: mergeSection(
    mergeSection(baseConfig.social, privateConfig.social),
    localConfig.social
  ),
  footer: mergeSection(
    mergeSection(baseConfig.footer, privateConfig.footer),
    localConfig.footer
  ),
};

export type SiteConfig = typeof siteConfig;
