import { baseConfig, type BaseSiteConfig } from "./site.base";
import { localConfig } from "./site.local";

const mergeSection = <T extends Record<string, unknown>>(
  baseSection: T,
  localSection?: Partial<T>
): T => ({
  ...baseSection,
  ...(localSection ?? {}),
});

export const siteConfig: BaseSiteConfig = {
  ...baseConfig,
  ...localConfig,
  og: mergeSection(baseConfig.og, localConfig.og),
  twitter: mergeSection(baseConfig.twitter, localConfig.twitter),
  analytics: mergeSection(baseConfig.analytics, localConfig.analytics),
  debug: mergeSection(baseConfig.debug, localConfig.debug),
  social: mergeSection(baseConfig.social, localConfig.social),
  footer: mergeSection(baseConfig.footer, localConfig.footer),
};

export type SiteConfig = typeof siteConfig;
