/**
 * FUENTE UNICA DE SEO: CMS (MongoDB)
 */

export interface PageSeoConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  ogImageAlt?: string;
  twitterCard?: string;
  canonical?: string;
}

export interface SeoConfigMap {
  [key: string]: PageSeoConfig;
}

/** Config vacia - el CMS es la unica fuente. */
export const DEFAULT_SEO_CONFIG: SeoConfigMap = {};

export const getHardcodedSeo = (_pageName: string): PageSeoConfig | undefined => undefined;

export const hasHardcodedSeo = (_pageName: string): boolean => false;

export const getConfiguredPages = (): string[] => [];
