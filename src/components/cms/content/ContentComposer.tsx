'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Send,
  Calendar,
  Eye,
  Sparkles,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag,
  Folder,
  User,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Zap,
  Clock,
} from 'lucide-react';
import styles from './ContentComposer.module.scss';

interface AIsuggestion {
  type: 'grammar' | 'style' | 'seo' | 'engagement';
  title: string;
  description: string;
  before?: string;
  after?: string;
}

export function ContentComposer() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'edit' | 'preview'>('edit');
  const [showScheduler, setShowScheduler] = useState(false);

  const [postData, setPostData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[],
    featuredImage: '',
    excerpt: '',
    author: 'Current User',
    publishedAt: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      focusKeyword: '',
    },
  });

  const [currentTag, setCurrentTag] = useState('');

  // AI Suggestions
  const aiSuggestions: AIsuggestion[] = [
    {
      type: 'seo',
      title: 'Add Focus Keyword',
      description: 'Adding a focus keyword will help optimize this post for search engines',
    },
    {
      type: 'engagement',
      title: 'Add a Call-to-Action',
      description: 'Posts with clear CTAs get 2.5x more engagement',
    },
    {
      type: 'style',
      title: 'Break Up Long Paragraphs',
      description: 'Consider breaking paragraphs longer than 150 words for better readability',
    },
  ];

  // SEO Score calculation
  const calculateSEOScore = () => {
    let score = 0;
    if (postData.seo.metaTitle) score += 25;
    if (postData.seo.metaDescription) score += 25;
    if (postData.seo.focusKeyword) score += 25;
    if (postData.title.length > 30 && postData.title.length < 60) score += 15;
    if (postData.excerpt) score += 10;
    return score;
  };

  const seoScore = calculateSEOScore();

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return styles.scoreGood;
    if (score >= 50) return styles.scoreOkay;
    return styles.scorePoor;
  };

  const handleAddTag = () => {
    if (currentTag && !postData.tags.includes(currentTag)) {
      setPostData({ ...postData, tags: [...postData.tags, currentTag] });
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPostData({
      ...postData,
      tags: postData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSaveDraft = () => {
    console.log('Saving draft...', postData);
    // Save draft logic
  };

  const handleSchedule = (date: string) => {
    console.log('Scheduling for:', date);
    setPostData({ ...postData, publishedAt: date });
    setShowScheduler(false);
    // Schedule logic
  };

  const handlePublish = () => {
    console.log('Publishing...', postData);
    // Publish logic
  };

  const categories = [
    'Announcements',
    'Guides',
    'Tips',
    'Updates',
    'General',
    'Community',
    'Events',
  ];

  return (
    <div className={styles.composer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={() => router.back()} className={styles.backButton}>
            <ArrowLeft />
          </button>
          <div>
            <h1>Create New Post</h1>
            <p>Share content with your community</p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.viewToggle}>
            <button
              className={currentView === 'edit' ? styles.active : ''}
              onClick={() => setCurrentView('edit')}
            >
              Edit
            </button>
            <button
              className={currentView === 'preview' ? styles.active : ''}
              onClick={() => setCurrentView('preview')}
            >
              <Eye />
              Preview
            </button>
          </div>

          <button onClick={handleSaveDraft} className={styles.secondaryButton}>
            <Save />
            Save Draft
          </button>

          <button onClick={() => setShowScheduler(!showScheduler)} className={styles.secondaryButton}>
            <Calendar />
            Schedule
          </button>

          <button onClick={handlePublish} className={styles.primaryButton}>
            <Send />
            Publish Now
          </button>
        </div>
      </div>

      <div className={styles.composerLayout}>
        {/* Main Editor */}
        <div className={styles.editorColumn}>
          {currentView === 'edit' ? (
            <>
              {/* Title */}
              <div className={styles.titleSection}>
                <input
                  type="text"
                  placeholder="Enter your post title..."
                  value={postData.title}
                  onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                  className={styles.titleInput}
                />
                <div className={styles.titleMeta}>
                  <span>{postData.title.length} characters</span>
                  {postData.title.length > 0 && postData.title.length < 30 && (
                    <span className={styles.warning}>Title is too short</span>
                  )}
                  {postData.title.length > 60 && (
                    <span className={styles.warning}>Title is too long</span>
                  )}
                </div>
              </div>

              {/* Content Editor */}
              <div className={styles.contentSection}>
                <div className={styles.editorToolbar}>
                  <button title="Add image">
                    <ImageIcon />
                  </button>
                  <button title="Add link">
                    <LinkIcon />
                  </button>
                </div>

                <textarea
                  placeholder="Write your content here..."
                  value={postData.content}
                  onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                  className={styles.contentEditor}
                  rows={20}
                />

                <div className={styles.editorFooter}>
                  <span>{postData.content.split(' ').filter((w) => w).length} words</span>
                  <span>{postData.content.length} characters</span>
                </div>
              </div>

              {/* Excerpt */}
              <div className={styles.excerptSection}>
                <label>
                  <div className={styles.labelHeader}>
                    <span>Excerpt</span>
                    <span className={styles.optional}>Optional</span>
                  </div>
                  <textarea
                    placeholder="Write a brief summary..."
                    value={postData.excerpt}
                    onChange={(e) => setPostData({ ...postData, excerpt: e.target.value })}
                    className={styles.excerptInput}
                    rows={3}
                  />
                </label>
              </div>
            </>
          ) : (
            <div className={styles.preview}>
              <div className={styles.previewHeader}>
                <h2>Preview</h2>
                <p>This is how your post will appear to members</p>
              </div>

              <div className={styles.previewContent}>
                {postData.featuredImage && (
                  <img
                    src={postData.featuredImage}
                    alt={postData.title}
                    className={styles.previewImage}
                  />
                )}

                <div className={styles.previewMeta}>
                  <span className={styles.previewCategory}>{postData.category || 'Uncategorized'}</span>
                  <span>•</span>
                  <span>{postData.author}</span>
                  <span>•</span>
                  <span>
                    {postData.content.split(' ').filter((w) => w).length} min read
                  </span>
                </div>

                <h1 className={styles.previewTitle}>{postData.title || 'Untitled Post'}</h1>

                {postData.excerpt && <p className={styles.previewExcerpt}>{postData.excerpt}</p>}

                <div className={styles.previewBody}>
                  {postData.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {postData.tags.length > 0 && (
                  <div className={styles.previewTags}>
                    {postData.tags.map((tag, index) => (
                      <span key={index} className={styles.previewTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* SEO Score */}
          <div className={styles.sidebarCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <Target />
                <h3>SEO Score</h3>
              </div>
            </div>

            <div className={styles.seoScore}>
              <div className={`${styles.scoreCircle} ${getSEOScoreColor(seoScore)}`}>
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" className={styles.scoreBackground} />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className={styles.scoreProgress}
                    style={{
                      strokeDasharray: `${seoScore * 2.827} 283`,
                    }}
                  />
                </svg>
                <div className={styles.scoreValue}>{seoScore}</div>
              </div>
              <div className={styles.scoreLabel}>
                {seoScore >= 80 && 'Excellent!'}
                {seoScore >= 50 && seoScore < 80 && 'Good'}
                {seoScore < 50 && 'Needs Improvement'}
              </div>
            </div>

            <div className={styles.seoFields}>
              <label>
                <span>Meta Title</span>
                <input
                  type="text"
                  placeholder="SEO-friendly title..."
                  value={postData.seo.metaTitle}
                  onChange={(e) =>
                    setPostData({
                      ...postData,
                      seo: { ...postData.seo, metaTitle: e.target.value },
                    })
                  }
                />
                <span className={styles.fieldHint}>{postData.seo.metaTitle.length}/60</span>
              </label>

              <label>
                <span>Meta Description</span>
                <textarea
                  placeholder="Brief description..."
                  value={postData.seo.metaDescription}
                  onChange={(e) =>
                    setPostData({
                      ...postData,
                      seo: { ...postData.seo, metaDescription: e.target.value },
                    })
                  }
                  rows={3}
                />
                <span className={styles.fieldHint}>{postData.seo.metaDescription.length}/160</span>
              </label>

              <label>
                <span>Focus Keyword</span>
                <input
                  type="text"
                  placeholder="Primary keyword..."
                  value={postData.seo.focusKeyword}
                  onChange={(e) =>
                    setPostData({
                      ...postData,
                      seo: { ...postData.seo, focusKeyword: e.target.value },
                    })
                  }
                />
              </label>
            </div>
          </div>

          {/* Category */}
          <div className={styles.sidebarCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <Folder />
                <h3>Category</h3>
              </div>
            </div>

            <select
              value={postData.category}
              onChange={(e) => setPostData({ ...postData, category: e.target.value })}
              className={styles.select}
            >
              <option value="">Select a category...</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className={styles.sidebarCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <Tag />
                <h3>Tags</h3>
              </div>
            </div>

            <div className={styles.tagInput}>
              <input
                type="text"
                placeholder="Add a tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <button onClick={handleAddTag}>Add</button>
            </div>

            {postData.tags.length > 0 && (
              <div className={styles.tagsList}>
                {postData.tags.map((tag) => (
                  <div key={tag} className={styles.tagItem}>
                    <span>{tag}</span>
                    <button onClick={() => handleRemoveTag(tag)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div className={styles.sidebarCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <ImageIcon />
                <h3>Featured Image</h3>
              </div>
            </div>

            <div className={styles.imageUpload}>
              {postData.featuredImage ? (
                <div className={styles.imagePreview}>
                  <img src={postData.featuredImage} alt="Featured" />
                  <button
                    onClick={() => setPostData({ ...postData, featuredImage: '' })}
                    className={styles.removeImage}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className={styles.imagePlaceholder}>
                  <ImageIcon />
                  <p>Click to upload</p>
                  <input
                    type="text"
                    placeholder="Or paste image URL..."
                    onChange={(e) => setPostData({ ...postData, featuredImage: e.target.value })}
                    className={styles.imageUrlInput}
                  />
                </div>
              )}
            </div>
          </div>

          {/* AI Suggestions */}
          <div className={`${styles.sidebarCard} ${styles.aiCard}`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <Sparkles />
                <h3>AI Suggestions</h3>
              </div>
            </div>

            <div className={styles.aiSuggestions}>
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className={styles.suggestion}>
                  <div className={styles.suggestionHeader}>
                    <span className={styles.suggestionType}>{suggestion.type}</span>
                  </div>
                  <h4>{suggestion.title}</h4>
                  <p>{suggestion.description}</p>
                  <button className={styles.applySuggestion}>Apply</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scheduler Modal */}
      {showScheduler && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Schedule Publication</h3>
              <button onClick={() => setShowScheduler(false)}>×</button>
            </div>

            <div className={styles.modalBody}>
              <label>
                <span>Publish Date & Time</span>
                <input
                  type="datetime-local"
                  value={postData.publishedAt}
                  onChange={(e) => setPostData({ ...postData, publishedAt: e.target.value })}
                />
              </label>

              <div className={styles.suggestedTimes}>
                <h4>
                  <Zap />
                  Suggested Times
                </h4>
                <p>Based on your community's peak activity</p>

                <div className={styles.timeSlots}>
                  <button className={styles.timeSlot}>
                    <Clock />
                    <div>
                      <strong>Tomorrow at 10:00 AM</strong>
                      <span>Peak engagement time</span>
                    </div>
                  </button>
                  <button className={styles.timeSlot}>
                    <Clock />
                    <div>
                      <strong>Wednesday at 2:00 PM</strong>
                      <span>Highest historical engagement</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setShowScheduler(false)} className={styles.secondaryButton}>
                Cancel
              </button>
              <button
                onClick={() => handleSchedule(postData.publishedAt)}
                className={styles.primaryButton}
              >
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
