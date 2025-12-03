'use client';

import { X, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useVersion } from '@/hooks/cms';
import styles from './VersionComparisonModal.module.scss';

interface VersionComparisonModalProps {
  postId: number;
  v1: number;
  v2: number;
  onClose: () => void;
}

export function VersionComparisonModal({
  postId,
  v1,
  v2,
  onClose,
}: VersionComparisonModalProps) {
  const { data: version1Data, isLoading: isLoading1 } = useVersion(postId, v1);
  const { data: version2Data, isLoading: isLoading2 } = useVersion(postId, v2);

  const version1 = version1Data?.data;
  const version2 = version2Data?.data;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Compare Versions</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X className={styles.closeIcon} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {isLoading1 || isLoading2 ? (
            <div className={styles.loading}>Loading versions...</div>
          ) : (
            <div className={styles.comparison}>
              {/* Version 1 */}
              <div className={styles.versionPanel}>
                <div className={styles.versionHeader}>
                  <h3 className={styles.versionTitle}>
                    Version {version1?.versionNumber}
                  </h3>
                  <div className={styles.versionMeta}>
                    <span className={styles.metaItem}>
                      <User className={styles.metaIcon} />
                      {version1?.author.name}
                    </span>
                    <span className={styles.metaItem}>
                      <Clock className={styles.metaIcon} />
                      {version1 &&
                        formatDistanceToNow(new Date(version1.createdAt), {
                          addSuffix: true,
                        })}
                    </span>
                  </div>
                </div>

                <div className={styles.versionContent}>
                  <div className={styles.contentSection}>
                    <h4 className={styles.sectionTitle}>Title</h4>
                    <p className={styles.sectionValue}>{version1?.title}</p>
                  </div>

                  {version1?.excerpt && (
                    <div className={styles.contentSection}>
                      <h4 className={styles.sectionTitle}>Excerpt</h4>
                      <p className={styles.sectionValue}>{version1.excerpt}</p>
                    </div>
                  )}

                  <div className={styles.contentSection}>
                    <h4 className={styles.sectionTitle}>Content</h4>
                    <div
                      className={styles.htmlContent}
                      dangerouslySetInnerHTML={{
                        __html: version1?.contentHtml || '',
                      }}
                    />
                  </div>

                  {version1?.featuredImage && (
                    <div className={styles.contentSection}>
                      <h4 className={styles.sectionTitle}>Featured Image</h4>
                      <img
                        src={version1.featuredImage}
                        alt="Featured"
                        className={styles.featuredImage}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className={styles.divider} />

              {/* Version 2 */}
              <div className={styles.versionPanel}>
                <div className={styles.versionHeader}>
                  <h3 className={styles.versionTitle}>
                    Version {version2?.versionNumber}
                  </h3>
                  <div className={styles.versionMeta}>
                    <span className={styles.metaItem}>
                      <User className={styles.metaIcon} />
                      {version2?.author.name}
                    </span>
                    <span className={styles.metaItem}>
                      <Clock className={styles.metaIcon} />
                      {version2 &&
                        formatDistanceToNow(new Date(version2.createdAt), {
                          addSuffix: true,
                        })}
                    </span>
                  </div>
                </div>

                <div className={styles.versionContent}>
                  <div className={styles.contentSection}>
                    <h4 className={styles.sectionTitle}>Title</h4>
                    <p className={styles.sectionValue}>{version2?.title}</p>
                  </div>

                  {version2?.excerpt && (
                    <div className={styles.contentSection}>
                      <h4 className={styles.sectionTitle}>Excerpt</h4>
                      <p className={styles.sectionValue}>{version2.excerpt}</p>
                    </div>
                  )}

                  <div className={styles.contentSection}>
                    <h4 className={styles.sectionTitle}>Content</h4>
                    <div
                      className={styles.htmlContent}
                      dangerouslySetInnerHTML={{
                        __html: version2?.contentHtml || '',
                      }}
                    />
                  </div>

                  {version2?.featuredImage && (
                    <div className={styles.contentSection}>
                      <h4 className={styles.sectionTitle}>Featured Image</h4>
                      <img
                        src={version2.featuredImage}
                        alt="Featured"
                        className={styles.featuredImage}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
