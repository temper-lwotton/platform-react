'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, Globe, Twitter, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSEOAnalysis } from '@/hooks/cms';
import type { SEOMetadata } from '@/services/cms/types/seo';
import styles from './SEOPanel.module.scss';

interface SEOPanelProps {
  postTitle: string;
  postContent: string;
  seoData: SEOMetadata;
  onChange: (seo: SEOMetadata) => void;
}

export function SEOPanel({ postTitle, postContent, seoData, onChange }: SEOPanelProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'social'>('basic');
  const [localData, setLocalData] = useState<SEOMetadata>(seoData);

  // Sync with parent when seoData changes
  useEffect(() => {
    setLocalData(seoData);
  }, [seoData]);

  // Use post title as fallback for meta title
  const effectiveTitle = localData.metaTitle || postTitle;
  const effectiveDescription = localData.metaDescription || '';

  // Run SEO analysis
  const { data: analysisData } = useSEOAnalysis({
    title: effectiveTitle,
    content: postContent,
    focusKeyword: localData.focusKeyword,
    metaDescription: effectiveDescription,
  });

  const analysis = analysisData?.data;

  const handleChange = (field: keyof SEOMetadata, value: any) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>SEO & Social Media</h3>

      {/* SEO Score */}
      {analysis && (
        <div className={styles.scoreCard}>
          <div className={styles.scoreCircle} style={{ borderColor: getScoreColor(analysis.score) }}>
            <span className={styles.scoreValue} style={{ color: getScoreColor(analysis.score) }}>
              {analysis.score}
            </span>
            <span className={styles.scoreLabel}>SEO Score</span>
          </div>
          <div className={styles.scoreDetails}>
            <div className={styles.scoreItem}>
              <span className={styles.scoreItemLabel}>Keyword Density:</span>
              <span className={styles.scoreItemValue}>{analysis.keywords.density}%</span>
            </div>
            <div className={styles.scoreItem}>
              <span className={styles.scoreItemLabel}>Readability:</span>
              <span className={styles.scoreItemValue}>{analysis.readability.score.toFixed(0)}/100</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab('basic')}
          className={`${styles.tab} ${activeTab === 'basic' ? styles.active : ''}`}
        >
          <Search size={16} />
          Basic SEO
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`${styles.tab} ${activeTab === 'social' ? styles.active : ''}`}
        >
          <Globe size={16} />
          Social Media
        </button>
      </div>

      {/* Basic SEO Tab */}
      {activeTab === 'basic' && (
        <div className={styles.tabContent}>
          <div className={styles.field}>
            <label htmlFor="metaTitle" className={styles.label}>
              Meta Title
              <span className={styles.charCount}>
                {(localData.metaTitle || postTitle).length}/60
              </span>
            </label>
            <input
              id="metaTitle"
              type="text"
              value={localData.metaTitle || ''}
              onChange={(e) => handleChange('metaTitle', e.target.value)}
              placeholder={postTitle}
              className={styles.input}
              maxLength={60}
            />
            <p className={styles.hint}>
              Leave empty to use post title. Recommended: 30-60 characters
            </p>
          </div>

          <div className={styles.field}>
            <label htmlFor="metaDescription" className={styles.label}>
              Meta Description
              <span className={styles.charCount}>
                {(localData.metaDescription || '').length}/160
              </span>
            </label>
            <textarea
              id="metaDescription"
              value={localData.metaDescription || ''}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
              placeholder="Brief description for search engines..."
              className={styles.textarea}
              rows={3}
              maxLength={160}
            />
            <p className={styles.hint}>
              Recommended: 120-160 characters
            </p>
          </div>

          <div className={styles.field}>
            <label htmlFor="focusKeyword" className={styles.label}>
              Focus Keyword
            </label>
            <input
              id="focusKeyword"
              type="text"
              value={localData.focusKeyword || ''}
              onChange={(e) => handleChange('focusKeyword', e.target.value)}
              placeholder="Target keyword or phrase..."
              className={styles.input}
            />
            <p className={styles.hint}>
              Main keyword you want this post to rank for
            </p>
          </div>

          <div className={styles.field}>
            <label htmlFor="canonicalUrl" className={styles.label}>
              Canonical URL
            </label>
            <input
              id="canonicalUrl"
              type="url"
              value={localData.canonicalUrl || ''}
              onChange={(e) => handleChange('canonicalUrl', e.target.value)}
              placeholder="https://example.com/canonical-url"
              className={styles.input}
            />
            <p className={styles.hint}>
              Set if this content appears elsewhere (prevents duplicate content issues)
            </p>
          </div>

          <div className={styles.checkboxes}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={localData.noIndex || false}
                onChange={(e) => handleChange('noIndex', e.target.checked)}
              />
              <span>No Index (hide from search engines)</span>
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={localData.noFollow || false}
                onChange={(e) => handleChange('noFollow', e.target.checked)}
              />
              <span>No Follow (don't follow links)</span>
            </label>
          </div>
        </div>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <div className={styles.tabContent}>
          <div className={styles.socialSection}>
            <h4 className={styles.socialTitle}>
              <Globe size={18} />
              Open Graph (Facebook, LinkedIn)
            </h4>

            <div className={styles.field}>
              <label htmlFor="ogTitle" className={styles.label}>
                OG Title
              </label>
              <input
                id="ogTitle"
                type="text"
                value={localData.ogTitle || ''}
                onChange={(e) => handleChange('ogTitle', e.target.value)}
                placeholder={effectiveTitle}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="ogDescription" className={styles.label}>
                OG Description
              </label>
              <textarea
                id="ogDescription"
                value={localData.ogDescription || ''}
                onChange={(e) => handleChange('ogDescription', e.target.value)}
                placeholder={effectiveDescription}
                className={styles.textarea}
                rows={2}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="ogImage" className={styles.label}>
                OG Image URL
              </label>
              <input
                id="ogImage"
                type="url"
                value={localData.ogImage || ''}
                onChange={(e) => handleChange('ogImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={styles.input}
              />
              <p className={styles.hint}>Recommended: 1200x630px</p>
            </div>
          </div>

          <div className={styles.socialSection}>
            <h4 className={styles.socialTitle}>
              <Twitter size={18} />
              Twitter Card
            </h4>

            <div className={styles.field}>
              <label htmlFor="twitterCard" className={styles.label}>
                Card Type
              </label>
              <select
                id="twitterCard"
                value={localData.twitterCard || 'summary'}
                onChange={(e) => handleChange('twitterCard', e.target.value as any)}
                className={styles.select}
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary Large Image</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="twitterTitle" className={styles.label}>
                Twitter Title
              </label>
              <input
                id="twitterTitle"
                type="text"
                value={localData.twitterTitle || ''}
                onChange={(e) => handleChange('twitterTitle', e.target.value)}
                placeholder={effectiveTitle}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="twitterDescription" className={styles.label}>
                Twitter Description
              </label>
              <textarea
                id="twitterDescription"
                value={localData.twitterDescription || ''}
                onChange={(e) => handleChange('twitterDescription', e.target.value)}
                placeholder={effectiveDescription}
                className={styles.textarea}
                rows={2}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="twitterImage" className={styles.label}>
                Twitter Image URL
              </label>
              <input
                id="twitterImage"
                type="url"
                value={localData.twitterImage || ''}
                onChange={(e) => handleChange('twitterImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={styles.input}
              />
            </div>
          </div>
        </div>
      )}

      {/* SEO Issues */}
      {analysis && analysis.issues.length > 0 && (
        <div className={styles.issues}>
          <h4 className={styles.issuesTitle}>
            <AlertCircle size={16} />
            SEO Issues
          </h4>
          <ul className={styles.issuesList}>
            {analysis.issues.map((issue) => (
              <li key={issue.id} className={`${styles.issue} ${styles[issue.severity]}`}>
                <span className={styles.issueMessage}>{issue.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {analysis && analysis.suggestions.length > 0 && (
        <div className={styles.suggestions}>
          <h4 className={styles.suggestionsTitle}>
            <CheckCircle2 size={16} />
            Suggestions
          </h4>
          <ul className={styles.suggestionsList}>
            {analysis.suggestions.map((suggestion) => (
              <li key={suggestion.id} className={styles.suggestion}>
                <span className={styles.suggestionMessage}>{suggestion.message}</span>
                <span className={`${styles.impact} ${styles[suggestion.impact]}`}>
                  {suggestion.impact} impact
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
