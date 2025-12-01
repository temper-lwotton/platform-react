'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '../primitives/Button';
import { Icon } from '../Icon';
import { Badge } from '../primitives/Badge';
import UploadProgress from './UploadProgress';
import { uploadMedia } from '@/lib/media-api';
import type { MediaItem as APIMediaItem } from '@/lib/media-api';
import styles from './MediaUpload.module.scss';

export interface UploadFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'processing' | 'analyzing' | 'complete' | 'error';
  progress: number;
  error?: string;
  mediaItem?: APIMediaItem;
  renameMode?: 'auto' | 'custom' | 'none';
  customFilename?: string;
}

interface MediaUploadProps {
  onUploadComplete?: (files: UploadFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
  spaceId?: number; // Optional space ID to associate uploads
}

export default function MediaUpload({
  onUploadComplete,
  maxFiles = 20,
  maxFileSize = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  spaceId,
}: MediaUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [renameMode, setRenameMode] = useState<'auto' | 'custom' | 'none'>('auto');
  const [customFilename, setCustomFilename] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!acceptedFormats.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Accepted formats: ${acceptedFormats.join(', ')}`,
      };
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return {
        valid: false,
        error: `File too large. Maximum size: ${maxFileSize}MB`,
      };
    }

    return { valid: true };
  };

  const processFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    if (uploadFiles.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newUploadFiles: UploadFile[] = [];

    for (const file of fileArray) {
      const validation = validateFile(file);
      const preview = await createFilePreview(file);

      const uploadFile: UploadFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview,
        status: validation.valid ? 'pending' : 'error',
        progress: 0,
        error: validation.error,
        renameMode,
        customFilename: renameMode === 'custom' ? customFilename : undefined,
      };

      newUploadFiles.push(uploadFile);
    }

    setUploadFiles((prev) => [...prev, ...newUploadFiles]);

    // Start upload process for valid files
    const validFiles = newUploadFiles.filter((f) => f.status === 'pending');
    if (validFiles.length > 0) {
      startUpload(validFiles);
    }
  };

  const startUpload = async (files: UploadFile[]) => {
    setIsUploading(true);

    for (const uploadFile of files) {
      await performUpload(uploadFile.id, uploadFile.file);
    }

    setIsUploading(false);

    const completedFiles = uploadFiles.filter(f => f.status === 'complete');
    onUploadComplete?.(completedFiles);
  };

  const performUpload = async (fileId: string, file: File) => {
    try {
      // Set uploading status
      updateFileStatus(fileId, 'uploading', 0);

      // Simulate progress for UI feedback (actual upload happens in one go)
      const progressInterval = setInterval(() => {
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === fileId && f.progress < 90
              ? { ...f, progress: f.progress + 10 }
              : f
          )
        );
      }, 200);

      // Get upload file to access rename mode
      const uploadFile = uploadFiles.find(f => f.id === fileId);

      // Build upload options based on rename mode
      const uploadOptions: any = { spaceId };

      if (uploadFile?.renameMode === 'auto') {
        uploadOptions.autoRename = true;
      } else if (uploadFile?.renameMode === 'custom' && uploadFile.customFilename) {
        uploadOptions.customFilename = uploadFile.customFilename;
      } else if (uploadFile?.renameMode === 'none') {
        uploadOptions.autoRename = false;
      }

      // Perform actual upload
      const mediaItem = await uploadMedia(file, uploadOptions);

      // Clear progress simulation
      clearInterval(progressInterval);

      // Set analyzing status
      updateFileStatus(fileId, 'analyzing', 100);

      // Small delay to show the analyzing state
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Complete with real API response
      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: 'complete', progress: 100, mediaItem }
            : f
        )
      );
    } catch (error) {
      console.error('Upload error:', error);
      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: 'error',
                error: error instanceof Error ? error.message : 'Upload failed',
              }
            : f
        )
      );
    }
  };

  const updateFileStatus = (
    fileId: string,
    status: UploadFile['status'],
    progress: number
  ) => {
    setUploadFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, status, progress } : f
      )
    );
  };

  const removeFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [uploadFiles.length]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const clearAll = () => {
    setUploadFiles([]);
  };

  const completedCount = uploadFiles.filter((f) => f.status === 'complete').length;
  const errorCount = uploadFiles.filter((f) => f.status === 'error').length;
  const processingCount = uploadFiles.filter(
    (f) => f.status === 'uploading' || f.status === 'processing' || f.status === 'analyzing'
  ).length;

  return (
    <div className={styles.container}>
      {/* SEO Filename Settings */}
      <div className={styles.seoSettings}>
        <h3 className={styles.seoTitle}>Filename SEO</h3>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="renameMode"
              value="auto"
              checked={renameMode === 'auto'}
              onChange={(e) => setRenameMode('auto')}
              disabled={isUploading}
            />
            <div className={styles.radioContent}>
              <strong>Auto-generate (Recommended)</strong>
              <p>AI analyzes images and creates SEO-friendly filenames</p>
            </div>
          </label>

          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="renameMode"
              value="custom"
              checked={renameMode === 'custom'}
              onChange={(e) => setRenameMode('custom')}
              disabled={isUploading}
            />
            <div className={styles.radioContent}>
              <strong>Custom filename</strong>
              <p>Provide your own SEO-friendly filename</p>
            </div>
          </label>

          {renameMode === 'custom' && (
            <input
              type="text"
              className={styles.customFilenameInput}
              placeholder="e.g., florida-keys-resort-2025"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              disabled={isUploading}
            />
          )}

          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="renameMode"
              value="none"
              checked={renameMode === 'none'}
              onChange={(e) => setRenameMode('none')}
              disabled={isUploading}
            />
            <div className={styles.radioContent}>
              <strong>Keep original</strong>
              <p>Use random hash (original behavior)</p>
            </div>
          </label>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''} ${
          uploadFiles.length > 0 ? styles.hasFiles : ''
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={styles.dropZoneContent}>
          <div className={styles.uploadIcon}>
            <Icon icon="upload" size={48} />
          </div>
          <h3 className={styles.dropZoneTitle}>
            Drag and drop your images here
          </h3>
          <p className={styles.dropZoneText}>
            or click the button below to browse
          </p>
          <Button variant="primary" size="lg" onClick={handleBrowseClick}>
            <Icon icon="folder" size={16} />
            Browse Files
          </Button>
          <p className={styles.dropZoneHint}>
            Supports: JPEG, PNG, WebP, GIF • Max {maxFileSize}MB per file • Up to{' '}
            {maxFiles} files
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={handleFileSelect}
          className={styles.fileInput}
        />
      </div>

      {/* Upload Stats */}
      {uploadFiles.length > 0 && (
        <div className={styles.stats}>
          <div className={styles.statsLeft}>
            <Badge variant="outline" size="md">
              {uploadFiles.length} {uploadFiles.length === 1 ? 'file' : 'files'}
            </Badge>
            {processingCount > 0 && (
              <Badge variant="primary" size="md">
                <Icon icon="loader-2" size={12} className={styles.spinner} />
                {processingCount} processing
              </Badge>
            )}
            {completedCount > 0 && (
              <Badge variant="success" size="md">
                <Icon icon="checkCircle" size={12} />
                {completedCount} complete
              </Badge>
            )}
            {errorCount > 0 && (
              <Badge variant="danger" size="md">
                <Icon icon="alertCircle" size={12} />
                {errorCount} failed
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      )}

      {/* Upload Progress List */}
      {uploadFiles.length > 0 && (
        <div className={styles.uploadList}>
          {uploadFiles.map((uploadFile) => (
            <UploadProgress
              key={uploadFile.id}
              uploadFile={uploadFile}
              onRemove={() => removeFile(uploadFile.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
