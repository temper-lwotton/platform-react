'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LexicalEditor } from '@/components/ui/Lexical';
import { PublishPanel } from '../shared/PublishPanel';
import { FeaturedImagePanel } from '../shared/FeaturedImagePanel';
import { CategoriesPanel } from '../shared/CategoriesPanel';
import { MetaFieldsPanel } from '../shared/MetaFieldsPanel';
import { VersionHistoryPanel } from '../shared/VersionHistoryPanel';
import { VersionComparisonModal } from '../shared/VersionComparisonModal';
import { BlockTemplatePicker } from '../blocks/BlockTemplatePicker';
import { SEOPanel } from '../shared/SEOPanel';
import {
  useCreatePost,
  useUpdatePost,
  usePost,
  useCreateVersion,
  useAutosaveVersion,
} from '@/hooks/cms';
import { usePostTypes } from '@/hooks/cms';
import { Post, LexicalEditorState } from '@/types/cms';
import type { SEOMetadata } from '@/services/cms/types/seo';
import styles from './PostEditor.module.scss';

interface PostEditorProps {
  postId?: number;
}

export function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter();
  const isEditMode = !!postId;

  // State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [selectedPostType, setSelectedPostType] = useState<number | null>(null);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [selectedTerms, setSelectedTerms] = useState<number[]>([]);
  const [metaFields, setMetaFields] = useState<Record<string, any>>({});
  const [seoData, setSeoData] = useState<SEOMetadata>({});
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [comparisonVersions, setComparisonVersions] = useState<{
    v1: number;
    v2: number;
  } | null>(null);
  const [showBlockPicker, setShowBlockPicker] = useState(false);

  // Queries & Mutations
  const { data: postData } = usePost(postId!, { includeVersions: true });
  const { data: postTypesData } = usePostTypes({ active: true });
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const createVersion = useCreateVersion();
  const autosave = useAutosaveVersion();

  // Load existing post data
  useEffect(() => {
    if (postData?.data) {
      const post = postData.data;
      setTitle(post.title);
      setSlug(post.slug);
      setSelectedPostType(post.postType.id);
      setFeaturedImage(post.featuredImage || '');
      setSelectedTerms(post.terms.map((t) => t.id));

      // Load latest version content
      if (post.latestVersion) {
        // We'll need to fetch the full version to get contentJson
        // For now, we'll handle this in a separate effect
      }
    }
  }, [postData]);

  // Auto-select first post type if creating new post
  useEffect(() => {
    if (!isEditMode && postTypesData?.data && postTypesData.data.length > 0 && !selectedPostType) {
      setSelectedPostType(postTypesData.data[0].id);
    }
  }, [postTypesData, isEditMode, selectedPostType]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditMode && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generatedSlug);
    }
  }, [title, isEditMode]);

  // Mark as dirty when content changes
  useEffect(() => {
    if (isEditMode && postData?.data) {
      setIsDirty(true);
    }
  }, [title, slug, content, selectedPostType, featuredImage, selectedTerms, metaFields, seoData]);

  // Autosave every 30 seconds
  useEffect(() => {
    if (!isDirty || !isEditMode || !postId) return;

    const interval = setInterval(async () => {
      await handleAutosave();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isDirty, isEditMode, postId, title, content]);

  const handleContentChange = useCallback((text: string, html: string) => {
    setContent(text);
    setContentHtml(html);
  }, []);

  const handleAutosave = async () => {
    if (!postId) return;

    try {
      const contentJson: LexicalEditorState = {
        root: {
          children: [],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      };

      await autosave.mutateAsync({
        postId,
        data: {
          title,
          contentJson,
          featuredImage: featuredImage || undefined,
        },
      });

      setLastSaved(new Date());
    } catch (error) {
      console.error('Autosave failed:', error);
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedPostType) {
      alert('Please select a post type');
      return;
    }

    try {
      const contentJson: LexicalEditorState = {
        root: {
          children: [],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      };

      if (isEditMode && postId) {
        // Create new version - backend will automatically clean up autosaves
        await createVersion.mutateAsync({
          postId,
          data: {
            title,
            contentJson,
            featuredImage: featuredImage || undefined,
            changeDescription: 'Draft update',
          },
        });
      } else {
        // Create new post
        const result = await createPost.mutateAsync({
          postType: selectedPostType,
          title,
          slug,
          contentJson,
          featuredImage: featuredImage || undefined,
          terms: selectedTerms,
          meta: metaFields,
        });

        // Redirect to edit page
        router.push(`/admin/posts/${result.data.id}/edit`);
      }

      setIsDirty(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save post');
    }
  };

  const handlePublish = async () => {
    // This will be handled by PublishPanel
    await handleSaveDraft();
  };

  const handleInsertBlock = (blockJson: string) => {
    // TODO: Insert the blockJson into the Lexical editor
    // This would require getting a reference to the Lexical editor instance
    // and programmatically inserting the content
    console.log('Insert block:', blockJson);
    // For now, we just close the picker
  };

  return (
    <div className={styles.editor}>
      {/* Main Editor Area */}
      <div className={styles.mainArea}>
        {/* Post Type Selector (only for new posts) */}
        {!isEditMode && (
          <div className={styles.postTypeSelector}>
            <label className={styles.label}>Post Type</label>
            <select
              value={selectedPostType || ''}
              onChange={(e) => setSelectedPostType(Number(e.target.value))}
              className={styles.select}
            >
              <option value="">Select a post type</option>
              {postTypesData?.data.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.singularLabel}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add title"
          className={styles.titleInput}
        />

        {/* Slug Input */}
        <div className={styles.slugWrapper}>
          <label className={styles.slugLabel}>
            <span className={styles.slugLabelText}>Slug:</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="post-slug"
              className={styles.slugInput}
            />
          </label>
          {slug && (
            <div className={styles.slugPreview}>
              <span className={styles.slugPreviewLabel}>URL:</span>
              <span className={styles.slugPreviewUrl}>
                {window.location.origin}/posts/{slug}
              </span>
            </div>
          )}
        </div>

        {/* Lexical Editor */}
        <div className={styles.editorWrapper}>
          <div className={styles.editorToolbar}>
            <button
              type="button"
              onClick={() => setShowBlockPicker(true)}
              className={styles.insertBlockButton}
              title="Insert Block Template"
            >
              + Insert Block Template
            </button>
          </div>
          <LexicalEditor
            value={content}
            onChange={handleContentChange}
            mode="standard"
            placeholder="Start writing your content..."
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className={styles.sidebar}>
        <PublishPanel
          post={postData?.data}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          isDirty={isDirty}
          isSaving={createPost.isPending || updatePost.isPending || createVersion.isPending}
          lastSaved={lastSaved}
        />

        {isEditMode && postId && (
          <VersionHistoryPanel
            postId={postId}
            onViewVersion={(versionId) => {
              // TODO: Implement single version viewer (could load into editor)
              console.log('View version:', versionId);
            }}
            onCompareVersions={(v1, v2) => {
              setComparisonVersions({ v1, v2 });
            }}
          />
        )}

        <FeaturedImagePanel
          imageUrl={featuredImage}
          onChange={setFeaturedImage}
        />

        <CategoriesPanel
          selectedTerms={selectedTerms}
          onChange={setSelectedTerms}
        />

        <MetaFieldsPanel
          fields={metaFields}
          onChange={setMetaFields}
        />

        <SEOPanel
          postTitle={title}
          postContent={contentHtml || content}
          seoData={seoData}
          onChange={setSeoData}
        />
      </div>

      {/* Version Comparison Modal */}
      {comparisonVersions && postId && (
        <VersionComparisonModal
          postId={postId}
          v1={comparisonVersions.v1}
          v2={comparisonVersions.v2}
          onClose={() => setComparisonVersions(null)}
        />
      )}

      {/* Block Template Picker Modal */}
      {showBlockPicker && (
        <BlockTemplatePicker
          onSelect={handleInsertBlock}
          onClose={() => setShowBlockPicker(false)}
        />
      )}
    </div>
  );
}
