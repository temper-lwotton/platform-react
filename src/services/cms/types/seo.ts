/**
 * SEO and Metadata Type Definitions
 */

// SEO metadata for a post/page
export interface SEOMetadata {
  // Basic SEO
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;

  // Robots
  noIndex?: boolean;
  noFollow?: boolean;

  // Open Graph (Facebook, LinkedIn, etc.)
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: 'website' | 'article' | 'blog' | 'profile';
  ogLocale?: string;

  // Twitter Cards
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
  twitterCreator?: string;
  twitterSite?: string;

  // Advanced
  schema?: Record<string, any>; // JSON-LD structured data
}

// SEO analysis result
export interface SEOAnalysis {
  score: number; // 0-100
  issues: SEOIssue[];
  suggestions: SEOSuggestion[];
  keywords: KeywordAnalysis;
  readability: ReadabilityScore;
}

export interface SEOIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  field?: keyof SEOMetadata;
}

export interface SEOSuggestion {
  id: string;
  message: string;
  impact: 'high' | 'medium' | 'low';
}

export interface KeywordAnalysis {
  density: number; // Percentage
  count: number;
  prominence: number; // How early keyword appears
  distribution: 'good' | 'poor' | 'keyword_stuffing';
}

export interface ReadabilityScore {
  score: number; // 0-100
  fleschReading: number;
  sentenceLength: 'good' | 'too_long' | 'too_short';
  paragraphLength: 'good' | 'too_long' | 'too_short';
}

// Sitemap entry
export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number; // 0.0 - 1.0
}

// Robots.txt rules
export interface RobotsRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
  crawlDelay?: number;
}

export interface RobotsTxt {
  rules: RobotsRule[];
  sitemaps: string[];
}

// Permalink structure options
export type PermalinkStructure =
  | 'plain'           // /?p=123
  | 'day-name'        // /2024/03/15/post-name
  | 'month-name'      // /2024/03/post-name
  | 'numeric'         // /archives/123
  | 'post-name'       // /post-name
  | 'custom';         // Custom structure

export interface PermalinkConfig {
  structure: PermalinkStructure;
  customStructure?: string;
  categoryBase: string;
  tagBase: string;
  trailingSlash: boolean;
}

// Schema.org types for structured data
export type SchemaType =
  | 'Article'
  | 'BlogPosting'
  | 'NewsArticle'
  | 'Person'
  | 'Organization'
  | 'WebPage'
  | 'WebSite'
  | 'BreadcrumbList'
  | 'FAQPage'
  | 'HowTo'
  | 'Product'
  | 'Event';

export interface SchemaOrgArticle {
  '@context': 'https://schema.org';
  '@type': 'Article' | 'BlogPosting' | 'NewsArticle';
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  publisher?: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage?: {
    '@type': 'WebPage';
    '@id': string;
  };
}

// SEO template variables
export interface SEOTemplate {
  title: string;
  description: string;
  variables: {
    siteName: string;
    separator: string;
    postTitle?: string;
    categoryName?: string;
    tagName?: string;
    authorName?: string;
    currentYear?: number;
    currentMonth?: string;
  };
}

// API response types
export interface SEOMetadataResponse {
  success: boolean;
  data?: SEOMetadata;
  error?: {
    code: string;
    message: string;
  };
}

export interface SEOAnalysisResponse {
  success: boolean;
  data?: SEOAnalysis;
  error?: {
    code: string;
    message: string;
  };
}

export interface SitemapResponse {
  success: boolean;
  data?: SitemapEntry[];
  error?: {
    code: string;
    message: string;
  };
}
