declare module "./config.local" {
  import type { BaseSiteConfig } from "../config/config.base";
  // Optional local overrides for development; shape matches Partial<BaseSiteConfig>
  export const localConfig: Partial<BaseSiteConfig>;
}
