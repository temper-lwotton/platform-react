/**
 * SEO API Service
 * Handles SEO metadata, analysis, and sitemap generation
 */

import type {
  SEOMetadata,
  SEOAnalysis,
  SEOIssue,
  SEOSuggestion,
  KeywordAnalysis,
  ReadabilityScore,
  SitemapEntry,
  PermalinkConfig,
} from '../types/seo';

const STORAGE_KEY_SEO = 'cms_seo_metadata';

/**
 * Get SEO metadata for a post
 */
export async function getPostSEO(
  postId: number
): Promise<{ data: SEOMetadata; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 50));

  if (typeof window === 'undefined') {
    return { success: true, data: {} };
  }

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_SEO}_${postId}`);
    if (stored) {
      return {
        success: true,
        data: JSON.parse(stored),
      };
    }
  } catch (error) {
    console.error('Failed to load SEO metadata:', error);
  }

  return {
    success: true,
    data: {},
  };
}

/**
 * Update SEO metadata for a post
 */
export async function updatePostSEO(
  postId: number,
  metadata: SEOMetadata
): Promise<{ data: SEOMetadata; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 100));

  if (typeof window === 'undefined') {
    return { success: true, data: metadata };
  }

  try {
    localStorage.setItem(`${STORAGE_KEY_SEO}_${postId}`, JSON.stringify(metadata));
  } catch (error) {
    console.error('Failed to save SEO metadata:', error);
  }

  return {
    success: true,
    data: metadata,
  };
}

/**
 * Analyze content for SEO
 */
export async function analyzeSEO(content: {
  title: string;
  content: string;
  focusKeyword?: string;
  metaDescription?: string;
}): Promise<{ data: SEOAnalysis; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const issues: SEOIssue[] = [];
  const suggestions: SEOSuggestion[] = [];
  let score = 100;

  // Title analysis
  if (!content.title || content.title.length === 0) {
    issues.push({
      id: 'no_title',
      severity: 'error',
      message: 'Post has no title',
      field: 'metaTitle',
    });
    score -= 20;
  } else if (content.title.length < 30) {
    issues.push({
      id: 'title_too_short',
      severity: 'warning',
      message: 'Title is too short (recommended: 30-60 characters)',
      field: 'metaTitle',
    });
    score -= 10;
  } else if (content.title.length > 60) {
    issues.push({
      id: 'title_too_long',
      severity: 'warning',
      message: 'Title is too long (recommended: 30-60 characters)',
      field: 'metaTitle',
    });
    score -= 10;
  }

  // Meta description analysis
  if (!content.metaDescription) {
    issues.push({
      id: 'no_meta_description',
      severity: 'warning',
      message: 'No meta description set',
      field: 'metaDescription',
    });
    score -= 15;
  } else if (content.metaDescription.length < 120) {
    issues.push({
      id: 'meta_desc_too_short',
      severity: 'info',
      message: 'Meta description is short (recommended: 120-160 characters)',
      field: 'metaDescription',
    });
    score -= 5;
  } else if (content.metaDescription.length > 160) {
    issues.push({
      id: 'meta_desc_too_long',
      severity: 'warning',
      message: 'Meta description is too long (recommended: 120-160 characters)',
      field: 'metaDescription',
    });
    score -= 10;
  }

  // Content length analysis
  const wordCount = content.content.split(/\s+/).length;
  if (wordCount < 300) {
    suggestions.push({
      id: 'content_too_short',
      message: 'Content is short. Aim for at least 300 words for better SEO.',
      impact: 'medium',
    });
    score -= 10;
  }

  // Keyword analysis
  const keywordAnalysis = analyzeKeyword(content.content, content.focusKeyword);

  if (content.focusKeyword) {
    if (keywordAnalysis.count === 0) {
      issues.push({
        id: 'keyword_not_found',
        severity: 'error',
        message: 'Focus keyword not found in content',
        field: 'focusKeyword',
      });
      score -= 20;
    } else if (keywordAnalysis.distribution === 'keyword_stuffing') {
      issues.push({
        id: 'keyword_stuffing',
        severity: 'warning',
        message: 'Keyword density is too high (possible keyword stuffing)',
        field: 'focusKeyword',
      });
      score -= 15;
    } else if (keywordAnalysis.density < 0.5) {
      suggestions.push({
        id: 'low_keyword_density',
        message: 'Consider using the focus keyword more frequently (target: 0.5-2.5% density)',
        impact: 'medium',
      });
      score -= 5;
    }
  } else {
    suggestions.push({
      id: 'no_focus_keyword',
      message: 'Set a focus keyword to improve SEO targeting',
      impact: 'high',
    });
  }

  // Readability analysis
  const readability = analyzeReadability(content.content);

  // Suggestions
  if (score >= 80) {
    suggestions.push({
      id: 'good_seo',
      message: 'Great! Your content is well-optimized for SEO.',
      impact: 'high',
    });
  }

  return {
    success: true,
    data: {
      score: Math.max(0, Math.min(100, score)),
      issues,
      suggestions,
      keywords: keywordAnalysis,
      readability,
    },
  };
}

/**
 * Analyze keyword usage
 */
function analyzeKeyword(content: string, keyword?: string): KeywordAnalysis {
  if (!keyword) {
    return {
      density: 0,
      count: 0,
      prominence: 0,
      distribution: 'poor',
    };
  }

  const lowerContent = content.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const words = lowerContent.split(/\s+/);
  const totalWords = words.length;

  // Count occurrences
  const count = (lowerContent.match(new RegExp(lowerKeyword, 'g')) || []).length;

  // Calculate density
  const density = (count / totalWords) * 100;

  // Calculate prominence (how early keyword appears)
  const firstOccurrence = lowerContent.indexOf(lowerKeyword);
  const prominence = firstOccurrence === -1 ? 0 : (1 - firstOccurrence / lowerContent.length) * 100;

  // Determine distribution
  let distribution: 'good' | 'poor' | 'keyword_stuffing';
  if (density > 3) {
    distribution = 'keyword_stuffing';
  } else if (density >= 0.5 && density <= 2.5) {
    distribution = 'good';
  } else {
    distribution = 'poor';
  }

  return {
    density: Number(density.toFixed(2)),
    count,
    prominence: Number(prominence.toFixed(1)),
    distribution,
  };
}

/**
 * Analyze readability
 */
function analyzeReadability(content: string): ReadabilityScore {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);

  const avgSentenceLength = words.length / Math.max(1, sentences.length);
  const avgParagraphLength = sentences.length / Math.max(1, paragraphs.length);

  // Simple Flesch Reading Ease approximation
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / Math.max(1, words.length);
  const fleschReading = 206.835 - (1.015 * avgSentenceLength) - (84.6 * (avgWordLength / 5));

  // Determine sentence length quality
  let sentenceLength: 'good' | 'too_long' | 'too_short';
  if (avgSentenceLength < 10) {
    sentenceLength = 'too_short';
  } else if (avgSentenceLength > 25) {
    sentenceLength = 'too_long';
  } else {
    sentenceLength = 'good';
  }

  // Determine paragraph length quality
  let paragraphLength: 'good' | 'too_long' | 'too_short';
  if (avgParagraphLength < 2) {
    paragraphLength = 'too_short';
  } else if (avgParagraphLength > 7) {
    paragraphLength = 'too_long';
  } else {
    paragraphLength = 'good';
  }

  // Calculate overall readability score (0-100, higher is better)
  let score = Math.min(100, Math.max(0, fleschReading));

  return {
    score: Number(score.toFixed(1)),
    fleschReading: Number(fleschReading.toFixed(1)),
    sentenceLength,
    paragraphLength,
  };
}

/**
 * Generate sitemap entries
 */
export async function generateSitemap(): Promise<{ data: SitemapEntry[]; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 300));

  // In a real implementation, this would fetch all published posts
  const entries: SitemapEntry[] = [
    {
      url: 'https://example.com/',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://example.com/about',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  return {
    success: true,
    data: entries,
  };
}

/**
 * Get permalink configuration
 */
export async function getPermalinkConfig(): Promise<{ data: PermalinkConfig; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 50));

  if (typeof window === 'undefined') {
    return {
      success: true,
      data: {
        structure: 'post-name',
        categoryBase: 'category',
        tagBase: 'tag',
        trailingSlash: false,
      },
    };
  }

  try {
    const stored = localStorage.getItem('cms_permalink_config');
    if (stored) {
      return {
        success: true,
        data: JSON.parse(stored),
      };
    }
  } catch (error) {
    console.error('Failed to load permalink config:', error);
  }

  return {
    success: true,
    data: {
      structure: 'post-name',
      categoryBase: 'category',
      tagBase: 'tag',
      trailingSlash: false,
    },
  };
}

/**
 * Update permalink configuration
 */
export async function updatePermalinkConfig(
  config: PermalinkConfig
): Promise<{ data: PermalinkConfig; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 100));

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('cms_permalink_config', JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save permalink config:', error);
    }
  }

  return {
    success: true,
    data: config,
  };
}
