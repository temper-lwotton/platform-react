'use client';

import { Icon } from '../Icon';
import { Badge } from '../primitives/Badge';
import { Button } from '../primitives/Button';
import { UploadFile } from './MediaUpload';
import styles from './UploadProgress.module.scss';

interface UploadProgressProps {
  uploadFile: UploadFile;
  onRemove: () => void;
}

export default function UploadProgress({
  uploadFile,
  onRemove,
}: UploadProgressProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusLabel = () => {
    switch (uploadFile.status) {
      case 'pending':
        return 'Pending...';
      case 'uploading':
        return `Uploading... ${uploadFile.progress}%`;
      case 'processing':
        return 'Processing image...';
      case 'analyzing':
        return 'Analyzing with AI...';
      case 'complete':
        return 'Complete';
      case 'error':
        return 'Failed';
      default:
        return '';
    }
  };

  const getStatusIcon = () => {
    switch (uploadFile.status) {
      case 'pending':
        return <Icon icon="clock" size={16} className={styles.iconPending} />;
      case 'uploading':
      case 'processing':
      case 'analyzing':
        return <Icon icon="loader-2" size={16} className={styles.iconSpinner} />;
      case 'complete':
        return <Icon icon="check-circle-2" size={16} className={styles.iconSuccess} />;
      case 'error':
        return <Icon icon="alertCircle" size={16} className={styles.iconError} />;
    }
  };

  const isProcessing =
    uploadFile.status === 'uploading' ||
    uploadFile.status === 'processing' ||
    uploadFile.status === 'analyzing';

  return (
    <div className={`${styles.card} ${styles[`status-${uploadFile.status}`]}`}>
      {/* Preview Image */}
      <div className={styles.preview}>
        <img
          src={uploadFile.preview}
          alt={uploadFile.file.name}
          className={styles.previewImage}
        />
        {isProcessing && (
          <div className={styles.processingOverlay}>
            <div className={styles.processingContent}>
              <Icon icon="loader-2" size={24} className={styles.processingSpinner} />
            </div>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className={styles.info}>
        <div className={styles.header}>
          <h4 className={styles.filename}>
            {uploadFile.status === 'complete' && uploadFile.mediaItem?.seoFilename
              ? uploadFile.mediaItem.seoFilename
              : uploadFile.file.name}
          </h4>
          <div className={styles.actions}>
            {uploadFile.status === 'complete' && (
              <Icon icon="check-circle-2" size={16} className={styles.successIcon} />
            )}
            {uploadFile.status === 'error' && (
              <Icon icon="alertCircle" size={16} className={styles.errorIcon} />
            )}
            {!isProcessing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className={styles.removeButton}
              >
                <Icon icon="x" size={14} />
              </Button>
            )}
          </div>
        </div>

        <div className={styles.meta}>
          <span className={styles.fileSize}>{formatFileSize(uploadFile.file.size)}</span>
          <span className={styles.separator}>•</span>
          <span className={styles.fileType}>{uploadFile.file.type.split('/')[1].toUpperCase()}</span>
        </div>

        {/* SEO Filename Info */}
        {uploadFile.status === 'complete' && uploadFile.mediaItem?.seoFilename && (
          <div className={styles.seoFilename}>
            <Icon icon="fileText" size={14} />
            <span className={styles.seoLabel}>Original:</span>
            <span className={styles.originalFilename}>{uploadFile.file.name}</span>
          </div>
        )}

        {/* Status */}
        <div className={styles.status}>
          {getStatusIcon()}
          <span className={styles.statusLabel}>{getStatusLabel()}</span>
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${uploadFile.progress}%` }}
            />
          </div>
        )}

        {/* Error Message */}
        {uploadFile.error && (
          <div className={styles.error}>
            <Icon icon="alertCircle" size={14} />
            <span>{uploadFile.error}</span>
          </div>
        )}

        {/* AI Analysis Results */}
        {uploadFile.status === 'complete' && uploadFile.mediaItem?.aiAnalysis && (
          <div className={styles.analysis}>
            {/* Show tags if available */}
            {uploadFile.mediaItem.aiAnalysis.tags && uploadFile.mediaItem.aiAnalysis.tags.length > 0 ? (
              <div className={styles.analysisSection}>
                <Icon icon="sparkles" size={14} />
                <div className={styles.tags}>
                  {uploadFile.mediaItem.aiAnalysis.tags.slice(0, 5).map((tag) => (
                    <Badge key={tag.id} variant="outline" size="sm">
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.analysisSection}>
                <Icon icon="alertCircle" size={14} />
                <span className={styles.analysisWarning}>
                  No AI tags detected - backend AI may not be fully configured
                </span>
              </div>
            )}

            {/* Show people count if detected */}
            {uploadFile.mediaItem.aiAnalysis.peopleCount > 0 && (
              <div className={styles.analysisSection}>
                <Icon icon="users" size={14} />
                <span className={styles.analysisText}>
                  {uploadFile.mediaItem.aiAnalysis.peopleCount}{' '}
                  {uploadFile.mediaItem.aiAnalysis.peopleCount === 1 ? 'person' : 'people'} detected
                </span>
              </div>
            )}

            {/* Show colors if available */}
            {uploadFile.mediaItem.aiAnalysis.dominantColors && uploadFile.mediaItem.aiAnalysis.dominantColors.length > 0 && (
              <div className={styles.analysisSection}>
                <Icon icon="image" size={14} />
                <div className={styles.colors}>
                  {uploadFile.mediaItem.aiAnalysis.dominantColors.map((color, index) => (
                    <div
                      key={index}
                      className={styles.colorSwatch}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
