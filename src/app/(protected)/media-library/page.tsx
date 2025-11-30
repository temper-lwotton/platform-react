'use client';

import { useState, useMemo, useEffect } from 'react';
import { MediaItem, MediaType, MediaOrientation } from '@/types/media';
import { getMediaList, updateMediaItem } from '@/lib/media-api';
import type { MediaItem as APIMediaItem } from '@/lib/media-api';
import MediaCard from '@/components/ui/MediaCard';
import AltTextGenerator from '@/components/ui/AltTextGenerator';
import SmartCropEditor from '@/components/ui/SmartCropEditor';
import MediaUpload, { UploadFile } from '@/components/ui/MediaUpload';
import { Button } from '@/components/ui/primitives/Button';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/primitives/Badge';
import { Input } from '@/components/ui/primitives/Input';
import { RadioGroup } from '@/components/ui/primitives/Radio';
import { ToggleGroup } from '@/components/ui/primitives/ToggleGroup';
import { Separator } from '@/components/ui/primitives/Separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/primitives/Dialog';
import styles from './page.module.scss';

/**
 * Convert API MediaItem to local MediaItem format
 */
function convertAPIMediaItem(apiItem: APIMediaItem): MediaItem {
  return {
    id: String(apiItem.id),
    url: apiItem.url,
    thumbnailUrl: apiItem.thumbnailUrl || apiItem.url,
    filename: apiItem.filename,
    type: 'image' as MediaType,
    orientation: apiItem.orientation || 'landscape',
    width: apiItem.width || 0,
    height: apiItem.height || 0,
    size: apiItem.size,
    uploadedAt: new Date(apiItem.uploadedAt),
    uploadedBy: {
      id: String(apiItem.uploadedBy.id),
      name: apiItem.uploadedBy.name,
      avatar: apiItem.uploadedBy.avatar || undefined,
    },
    altText: apiItem.altText || undefined,
    aiAnalysis: {
      tags: apiItem.aiAnalysis?.tags || [],
      peopleCount: apiItem.aiAnalysis?.peopleCount || 0,
      dominantColors: apiItem.aiAnalysis?.dominantColors || [],
      suggestedAltTexts: apiItem.aiAnalysis?.suggestedAltTexts || [],
      faces: apiItem.aiAnalysis?.faces,
    },
    smartCrops: [],
    tags: apiItem.userTags || [],
  };
}

export default function MediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [selectedOrientation, setSelectedOrientation] = useState<MediaOrientation | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [peopleCountFilter, setPeopleCountFilter] = useState<'any' | 'none' | 'one' | 'multiple'>('any');

  // Dialog states
  const [altTextMedia, setAltTextMedia] = useState<MediaItem | null>(null);
  const [smartCropMedia, setSmartCropMedia] = useState<MediaItem | null>(null);
  const [editMedia, setEditMedia] = useState<MediaItem | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Load media items from API
  useEffect(() => {
    loadMediaItems();
  }, []);

  const loadMediaItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await getMediaList({ sortOrder: 'desc' });
      setMediaItems(items.map(convertAPIMediaItem));
    } catch (err) {
      console.error('Failed to load media:', err);
      setError(err instanceof Error ? err.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  // Get all unique AI tags
  const allAITags = useMemo(() => {
    const tags = new Set<string>();
    mediaItems.forEach((item) => {
      item.aiAnalysis.tags.forEach((tag) => {
        tags.add(tag.label);
      });
    });
    return Array.from(tags).sort();
  }, [mediaItems]);

  // Get all unique colors
  const allColors = useMemo(() => {
    const colors = new Set<string>();
    mediaItems.forEach((item) => {
      item.aiAnalysis.dominantColors.forEach((color) => {
        colors.add(color);
      });
    });
    return Array.from(colors);
  }, [mediaItems]);

  // Filter media items
  const filteredMedia = useMemo(() => {
    return mediaItems.filter((item) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesFilename = item.filename.toLowerCase().includes(query);
        const matchesTags = item.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesAITags = item.aiAnalysis.tags.some((tag) =>
          tag.label.toLowerCase().includes(query)
        );
        const matchesAltText = item.altText?.toLowerCase().includes(query);

        if (!matchesFilename && !matchesTags && !matchesAITags && !matchesAltText) {
          return false;
        }
      }

      // Type filter
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }

      // Orientation filter
      if (selectedOrientation !== 'all' && item.orientation !== selectedOrientation) {
        return false;
      }

      // AI tags filter
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every((tag) =>
          item.aiAnalysis.tags.some((aiTag) => aiTag.label === tag)
        );
        if (!hasAllTags) return false;
      }

      // Colors filter
      if (selectedColors.length > 0) {
        const hasAnyColor = selectedColors.some((color) =>
          item.aiAnalysis.dominantColors.includes(color)
        );
        if (!hasAnyColor) return false;
      }

      // People count filter
      if (peopleCountFilter !== 'any') {
        if (peopleCountFilter === 'none' && item.aiAnalysis.peopleCount > 0) {
          return false;
        }
        if (peopleCountFilter === 'one' && item.aiAnalysis.peopleCount !== 1) {
          return false;
        }
        if (peopleCountFilter === 'multiple' && item.aiAnalysis.peopleCount <= 1) {
          return false;
        }
      }

      return true;
    });
  }, [
    mediaItems,
    searchQuery,
    selectedType,
    selectedOrientation,
    selectedTags,
    selectedColors,
    peopleCountFilter,
  ]);

  const handleSaveAltText = async (mediaId: string, altText: string) => {
    try {
      // Update via API
      await updateMediaItem(Number(mediaId), { altText });

      // Update local state
      setMediaItems((items) =>
        items.map((item) =>
          item.id === mediaId ? { ...item, altText } : item
        )
      );
    } catch (err) {
      console.error('Failed to update alt text:', err);
      alert('Failed to update alt text. Please try again.');
    }
  };

  const handleSaveSmartCrop = (
    mediaId: string,
    aspectRatio: any,
    useGenerativeFill: boolean
  ) => {
    console.log('Smart crop saved:', { mediaId, aspectRatio, useGenerativeFill });
    // In a real app, this would trigger the AI cropping process
  };

  const handleUploadComplete = async (files: UploadFile[]) => {
    console.log('Upload complete:', files);

    // Refresh the media library to show newly uploaded items
    await loadMediaItems();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedOrientation('all');
    setSelectedTags([]);
    setSelectedColors([]);
    setPeopleCountFilter('any');
  };

  const activeFiltersCount = [
    selectedType !== 'all' ? 1 : 0,
    selectedOrientation !== 'all' ? 1 : 0,
    selectedTags.length,
    selectedColors.length,
    peopleCountFilter !== 'any' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Media Library</h1>
          <p className={styles.subtitle}>
            AI-powered media management with smart tagging and cropping
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowUploadDialog(true)}>
          <Icon icon="upload" size={16} />
          Upload Media
        </Button>
      </div>

      <div className={styles.content}>
        {/* Filters Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Filters</h2>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear ({activeFiltersCount})
              </Button>
            )}
          </div>

          {/* Search */}
          <div className={styles.filterSection}>
            <Input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Icon icon="search" size={16} />}
              rightIcon={
                searchQuery ? (
                  <button
                    className={styles.clearSearch}
                    onClick={() => setSearchQuery('')}
                    type="button"
                  >
                    <Icon icon="x" size={14} />
                  </button>
                ) : undefined
              }
              fullWidth
            />
          </div>

          <Separator />

          {/* Type Filter */}
          <div className={styles.filterSection}>
            <RadioGroup
              label="Type"
              value={selectedType}
              onValueChange={(value) => setSelectedType(value as MediaType | 'all')}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'image', label: 'Images' },
              ]}
              orientation="vertical"
            />
          </div>

          <Separator />

          {/* Orientation Filter */}
          <div className={styles.filterSection}>
            <RadioGroup
              label="Orientation"
              value={selectedOrientation}
              onValueChange={(value) => setSelectedOrientation(value as MediaOrientation | 'all')}
              options={[
                { value: 'all', label: 'All' },
                { value: 'portrait', label: 'Portrait' },
                { value: 'landscape', label: 'Landscape' },
                { value: 'square', label: 'Square' },
              ]}
              orientation="vertical"
            />
          </div>

          <Separator />

          {/* People Count Filter */}
          <div className={styles.filterSection}>
            <RadioGroup
              label="People"
              value={peopleCountFilter}
              onValueChange={(value) => setPeopleCountFilter(value as 'any' | 'none' | 'one' | 'multiple')}
              options={[
                { value: 'any', label: 'Any' },
                { value: 'none', label: 'No People' },
                { value: 'one', label: 'One Person' },
                { value: 'multiple', label: 'Multiple People' },
              ]}
              orientation="vertical"
            />
          </div>

          <Separator />

          {/* AI Tags Filter */}
          <div className={styles.filterSection}>
            <ToggleGroup
              label="AI-Detected Tags"
              type="multiple"
              value={selectedTags}
              onValueChange={setSelectedTags}
              options={allAITags.slice(0, 20).map((tag) => ({
                value: tag,
                label: tag,
              }))}
              orientation="vertical"
              size="sm"
            />
          </div>

          <Separator />

          {/* Colors Filter */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Dominant Colors</h3>
            <div className={styles.colorsList}>
              {allColors.map((color) => (
                <button
                  key={color}
                  className={`${styles.colorButton} ${
                    selectedColors.includes(color) ? styles.selected : ''
                  }`}
                  onClick={() => toggleColor(color)}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {selectedColors.includes(color) && (
                    <Icon icon="check" size={14} className={styles.colorCheck} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Media Grid */}
        <main className={styles.main}>
          {loading ? (
            <div className={styles.loadingState}>
              <Icon icon="loader-2" size={48} className={styles.spinner} />
              <h3>Loading media library...</h3>
              <p>Please wait while we fetch your images</p>
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <Icon icon="alertCircle" size={48} />
              <h3>Failed to load media</h3>
              <p>{error}</p>
              <Button variant="primary" onClick={loadMediaItems}>
                <Icon icon="refresh-cw" size={16} />
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className={styles.resultsHeader}>
                <p className={styles.resultsCount}>
                  {filteredMedia.length} {filteredMedia.length === 1 ? 'item' : 'items'}
                </p>
                {activeFiltersCount > 0 && (
                  <div className={styles.activeFilters}>
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="primary" size="sm">
                        {tag}
                        <button
                          className={styles.removeBadge}
                          onClick={() => toggleTag(tag)}
                        >
                          <Icon icon="x" size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {filteredMedia.length === 0 ? (
                <div className={styles.emptyState}>
                  <Icon icon="image-off" size={48} />
                  <h3>No media found</h3>
                  <p>
                    {mediaItems.length === 0
                      ? 'Upload your first image to get started'
                      : 'Try adjusting your filters or uploading new media'}
                  </p>
                  {mediaItems.length === 0 ? (
                    <Button variant="primary" onClick={() => setShowUploadDialog(true)}>
                      <Icon icon="upload" size={16} />
                      Upload Media
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className={styles.grid}>
                  {filteredMedia.map((media) => (
                    <MediaCard
                      key={media.id}
                      media={media}
                      onEdit={setEditMedia}
                      onGenerateAltText={setAltTextMedia}
                      onSmartCrop={setSmartCropMedia}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Dialogs */}
      <AltTextGenerator
        media={altTextMedia}
        isOpen={!!altTextMedia}
        onClose={() => setAltTextMedia(null)}
        onSave={handleSaveAltText}
      />

      <SmartCropEditor
        media={smartCropMedia}
        isOpen={!!smartCropMedia}
        onClose={() => setSmartCropMedia(null)}
        onSave={handleSaveSmartCrop}
      />

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent size="xl">
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
            <DialogDescription>
              Upload images to your media library. Files will be automatically analyzed with AI for tags, colors, and content detection.
            </DialogDescription>
          </DialogHeader>

          <MediaUpload onUploadComplete={handleUploadComplete} />

          <div className={styles.uploadDialogFooter}>
            <Button
              variant="primary"
              onClick={() => setShowUploadDialog(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
