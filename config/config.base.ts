export interface BaseSiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  og: {
    image: string;
    imageWidth: number;
    imageHeight: number;
  };
  twitter: {
    card: "summary_large_image" | "summary";
    creator: string;
  };
  analytics: {
    googleAnalyticsId: string;
  };
  debug: {
    logErrors: boolean;
    showErrorDetails: boolean;
  };
  social: {
    github: string;
    twitter: string;
    linkedin: string;
  };
  footer: {
    companyName: string;
    copyright: string;
  };
}

export const baseConfig: BaseSiteConfig = {
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
};
