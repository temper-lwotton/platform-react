'use client';

import { useState } from 'react';
import { X, Search, Upload, Image as ImageIcon } from 'lucide-react';
import { useMediaItems, useUploadMedia } from '@/hooks/cms';
import { MediaItem } from '@/lib/media-api';
import { formatDistanceToNow } from 'date-fns';
import styles from './MediaPicker.module.scss';

interface MediaPickerProps {
  onSelect: (media: MediaItem | MediaItem[]) => void;
  onClose: () => void;
  mode?: 'single' | 'multiple';
  allowUpload?: boolean;
}

export function MediaPicker({
  onSelect,
  onClose,
  mode = 'single',
  allowUpload = true,
}: MediaPickerProps) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const { data: mediaData, isLoading } = useMediaItems({
    search: search || undefined,
    limit: 20,
    page,
  });

  const uploadMedia = useUploadMedia();

  const mediaItems = mediaData?.data?.items || [];
  const total = mediaData?.data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  const handleSelect = (item: MediaItem) => {
    if (mode === 'single') {
      onSelect(item);
      onClose();
    } else {
      const newSelectedIds = selectedIds.includes(item.id)
        ? selectedIds.filter(id => id !== item.id)
        : [...selectedIds, item.id];
      setSelectedIds(newSelectedIds);
    }
  };

  const handleConfirmMultiple = () => {
    const selected = mediaItems.filter(item => selectedIds.includes(item.id));
    onSelect(selected);
    onClose();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      // Upload first file for now
      const file = files[0];
      const result = await uploadMedia.mutateAsync({ file });

      if (result.data && mode === 'single') {
        onSelect(result.data);
        onClose();
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <ImageIcon className={styles.headerIcon} />
            <h2 className={styles.title}>Select Media</h2>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X className={styles.closeIcon} />
          </button>
        </div>

        {/* Search & Upload */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
          </div>

          {allowUpload && (
            <label className={styles.uploadButton}>
              <Upload className={styles.uploadIcon} />
              Upload New
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className={styles.fileInput}
              />
            </label>
          )}
        </div>

        {/* Content */}
        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>Loading media...</div>
          ) : mediaItems.length === 0 ? (
            <div className={styles.empty}>
              <ImageIcon className={styles.emptyIcon} />
              <p className={styles.emptyText}>
                {search ? 'No media matches your search' : 'No media available'}
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {mediaItems.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.mediaItem} ${
                    selectedIds.includes(item.id) ? styles.selected : ''
                  }`}
                  onClick={() => handleSelect(item)}
                >
                  <div className={styles.imageWrapper}>
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.altText || item.filename}
                      className={styles.image}
                    />
                    {mode === 'multiple' && (
                      <div className={styles.checkbox}>
                        {selectedIds.includes(item.id) && (
                          <div className={styles.checkmark}>✓</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <p className={styles.filename}>{item.seoFilename || item.filename}</p>
                    <p className={styles.meta}>
                      {formatDistanceToNow(new Date(item.uploadedAt), { addSuffix: true })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Pagination */}
        {totalPages > 1 && (
          <div className={styles.footer}>
            <div className={styles.pagination}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={styles.pageButton}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={styles.pageButton}
              >
                Next
              </button>
            </div>

            {mode === 'multiple' && selectedIds.length > 0 && (
              <button className={styles.confirmButton} onClick={handleConfirmMultiple}>
                Select {selectedIds.length} {selectedIds.length === 1 ? 'Item' : 'Items'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
