'use client';

import { useState, useMemo } from 'react';
import { mockMediaItems } from '@/lib/mockMediaData';
import { MediaItem, MediaType, MediaOrientation } from '@/types/media';
import MediaCard from '@/components/ui/MediaCard';
import AltTextGenerator from '@/components/ui/AltTextGenerator';
import SmartCropEditor from '@/components/ui/SmartCropEditor';
import { Button } from '@/components/ui/primitives/Button';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/primitives/Badge';
import styles from './page.module.scss';

export default function MediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(mockMediaItems);
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

  const handleSaveAltText = (mediaId: string, altText: string) => {
    setMediaItems((items) =>
      items.map((item) =>
        item.id === mediaId ? { ...item, altText } : item
      )
    );
  };

  const handleSaveSmartCrop = (
    mediaId: string,
    aspectRatio: any,
    useGenerativeFill: boolean
  ) => {
    console.log('Smart crop saved:', { mediaId, aspectRatio, useGenerativeFill });
    // In a real app, this would trigger the AI cropping process
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
        <Button variant="primary" size="md">
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
            <div className={styles.searchBox}>
              <Icon icon="search" size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  className={styles.clearSearch}
                  onClick={() => setSearchQuery('')}
                >
                  <Icon icon="x" size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Type Filter */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Type</h3>
            <div className={styles.filterOptions}>
              <button
                className={`${styles.filterOption} ${
                  selectedType === 'all' ? styles.active : ''
                }`}
                onClick={() => setSelectedType('all')}
              >
                <Icon icon="layers" size={16} />
                All Types
              </button>
              <button
                className={`${styles.filterOption} ${
                  selectedType === 'image' ? styles.active : ''
                }`}
                onClick={() => setSelectedType('image')}
              >
                <Icon icon="image" size={16} />
                Images
              </button>
            </div>
          </div>

          {/* Orientation Filter */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Orientation</h3>
            <div className={styles.filterOptions}>
              {(['all', 'portrait', 'landscape', 'square'] as const).map((orientation) => (
                <button
                  key={orientation}
                  className={`${styles.filterOption} ${
                    selectedOrientation === orientation ? styles.active : ''
                  }`}
                  onClick={() => setSelectedOrientation(orientation)}
                >
                  {orientation === 'all' && <Icon icon="grid-3x3" size={16} />}
                  {orientation === 'portrait' && <Icon icon="rectangle-vertical" size={16} />}
                  {orientation === 'landscape' && <Icon icon="rectangle-horizontal" size={16} />}
                  {orientation === 'square' && <Icon icon="square" size={16} />}
                  {orientation.charAt(0).toUpperCase() + orientation.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* People Count Filter */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>People</h3>
            <div className={styles.filterOptions}>
              {(['any', 'none', 'one', 'multiple'] as const).map((count) => (
                <button
                  key={count}
                  className={`${styles.filterOption} ${
                    peopleCountFilter === count ? styles.active : ''
                  }`}
                  onClick={() => setPeopleCountFilter(count)}
                >
                  <Icon icon="users" size={16} />
                  {count === 'any' && 'Any'}
                  {count === 'none' && 'No People'}
                  {count === 'one' && 'One Person'}
                  {count === 'multiple' && 'Multiple People'}
                </button>
              ))}
            </div>
          </div>

          {/* AI Tags Filter */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>AI-Detected Tags</h3>
            <div className={styles.tagsList}>
              {allAITags.slice(0, 20).map((tag) => (
                <button
                  key={tag}
                  className={`${styles.tagButton} ${
                    selectedTags.includes(tag) ? styles.active : ''
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && <Icon icon="x" size={12} />}
                </button>
              ))}
            </div>
          </div>

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
              <p>Try adjusting your filters or uploading new media</p>
              <Button variant="primary" onClick={clearFilters}>
                Clear Filters
              </Button>
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
    </div>
  );
}
