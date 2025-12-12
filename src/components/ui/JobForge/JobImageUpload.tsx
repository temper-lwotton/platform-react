'use client';

import { useState, useCallback, useRef } from 'react';
import { Icon } from '../Icon';
import styles from './JobImageUpload.module.scss';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
  url?: string;
}

interface JobImageUploadProps {
  onUploadComplete?: (images: UploadedImage[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
  jobId?: string;
}

export function JobImageUpload({
  onUploadComplete,
  maxFiles = 10,
  maxFileSize = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  jobId,
}: JobImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file type. Accepted formats: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return `File too large. Maximum size: ${maxFileSize}MB`;
    }

    return null;
  };

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      // Check max files limit
      if (images.length + fileArray.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate and create image objects
      const newImages: UploadedImage[] = [];

      for (const file of fileArray) {
        const error = validateFile(file);

        if (error) {
          // Add with error state
          newImages.push({
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview: '',
            progress: 0,
            status: 'error',
            error,
          });
        } else {
          // Create preview
          const preview = URL.createObjectURL(file);

          newImages.push({
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview,
            progress: 0,
            status: 'pending',
          });
        }
      }

      setImages((prev) => [...prev, ...newImages]);

      // Start uploading valid files
      for (const image of newImages) {
        if (image.status === 'pending') {
          uploadImage(image);
        }
      }
    },
    [images, maxFiles]
  );

  const uploadImage = async (image: UploadedImage) => {
    // Update status to uploading
    setImages((prev) =>
      prev.map((img) =>
        img.id === image.id ? { ...img, status: 'uploading', progress: 0 } : img
      )
    );

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, progress } : img
          )
        );
      }

      // Simulate processing
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? { ...img, status: 'processing', progress: 100 }
            : img
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Complete
      const uploadedUrl = `/uploads/${image.file.name}`; // Replace with actual upload logic

      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? { ...img, status: 'complete', progress: 100, url: uploadedUrl }
            : img
        )
      );
    } catch (error) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? {
                ...img,
                status: 'error',
                error: 'Upload failed. Please try again.',
              }
            : img
        )
      );
    }
  };

  const removeImage = (imageId: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== imageId);
      // Revoke object URL to free memory
      const image = prev.find((img) => img.id === imageId);
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }
      return updated;
    });
  };

  const retryUpload = (imageId: string) => {
    const image = images.find((img) => img.id === imageId);
    if (image) {
      uploadImage(image);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const completedImages = images.filter((img) => img.status === 'complete');
  const uploadingImages = images.filter((img) =>
    img.status === 'uploading' || img.status === 'processing'
  );

  return (
    <div className={styles.container}>
      {/* Drop Zone */}
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ''} ${
          images.length > 0 ? styles.hasImages : ''
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          multiple
          onChange={handleFileSelect}
          className={styles.fileInput}
        />

        <div className={styles.dropzoneContent}>
          <Icon icon="upload" size={48} />
          <h3 className={styles.dropzoneTitle}>
            {isDragging ? 'Drop images here' : 'Drag & drop images'}
          </h3>
          <p className={styles.dropzoneDescription}>
            or click to browse
          </p>
          <p className={styles.dropzoneHint}>
            {acceptedFormats.map((f) => f.split('/')[1].toUpperCase()).join(', ')} • Max {maxFileSize}MB per file • Up to {maxFiles} files
          </p>
        </div>
      </div>

      {/* Upload Stats */}
      {images.length > 0 && (
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <Icon icon="image" size={16} />
            <span>{images.length} total</span>
          </div>
          {uploadingImages.length > 0 && (
            <div className={styles.statItem}>
              <div className={styles.spinner} />
              <span>{uploadingImages.length} uploading</span>
            </div>
          )}
          {completedImages.length > 0 && (
            <div className={styles.statItem}>
              <Icon icon="check" size={16} />
              <span>{completedImages.length} complete</span>
            </div>
          )}
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className={styles.imageGrid}>
          {images.map((image) => (
            <div
              key={image.id}
              className={`${styles.imageCard} ${styles[image.status]}`}
            >
              {/* Preview */}
              <div className={styles.imagePreview}>
                {image.preview && (
                  <img src={image.preview} alt={image.file.name} />
                )}
                {image.status === 'error' && (
                  <div className={styles.errorOverlay}>
                    <Icon icon="x" size={24} />
                  </div>
                )}
                {(image.status === 'uploading' || image.status === 'processing') && (
                  <div className={styles.uploadOverlay}>
                    <div className={styles.progressCircle}>
                      <svg viewBox="0 0 36 36" className={styles.progressRing}>
                        <path
                          className={styles.progressRingBg}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={styles.progressRingFill}
                          strokeDasharray={`${image.progress}, 100`}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className={styles.progressText}>
                        {image.status === 'processing' ? (
                          <Icon icon="refresh" size={16} />
                        ) : (
                          `${image.progress}%`
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {image.status === 'complete' && (
                  <div className={styles.completeOverlay}>
                    <Icon icon="check" size={20} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className={styles.imageInfo}>
                <div className={styles.imageName}>{image.file.name}</div>
                <div className={styles.imageSize}>
                  {(image.file.size / (1024 * 1024)).toFixed(2)} MB
                </div>
                {image.error && (
                  <div className={styles.imageError}>{image.error}</div>
                )}
              </div>

              {/* Actions */}
              <div className={styles.imageActions}>
                {image.status === 'error' && (
                  <button
                    onClick={() => retryUpload(image.id)}
                    className={styles.retryButton}
                    title="Retry upload"
                  >
                    <Icon icon="refresh" size={16} />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                  className={styles.removeButton}
                  title="Remove image"
                >
                  <Icon icon="trash" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complete Button */}
      {completedImages.length > 0 && (
        <div className={styles.actions}>
          <button
            onClick={() => onUploadComplete?.(completedImages)}
            className={styles.completeButton}
            disabled={uploadingImages.length > 0}
          >
            {uploadingImages.length > 0 ? (
              <>
                <div className={styles.spinner} />
                Uploading {uploadingImages.length} images...
              </>
            ) : (
              <>
                <Icon icon="check" size={18} />
                Upload Complete ({completedImages.length} images)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
