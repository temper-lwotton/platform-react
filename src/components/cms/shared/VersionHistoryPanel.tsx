'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  History,
  Clock,
  User,
  RotateCcw,
  Eye,
  CheckCircle,
  AlertCircle,
  Copy,
  Trash2,
} from 'lucide-react';
import {
  useVersions,
  useRestoreVersion,
  usePublishVersion,
  useDuplicateVersion,
  useDeleteVersion,
} from '@/hooks/cms';
import { PostVersionListItem } from '@/types/cms';
import styles from './VersionHistoryPanel.module.scss';

interface VersionHistoryPanelProps {
  postId: number;
  onViewVersion?: (versionId: number) => void;
  onCompareVersions?: (v1: number, v2: number) => void;
}

export function VersionHistoryPanel({
  postId,
  onViewVersion,
  onCompareVersions,
}: VersionHistoryPanelProps) {
  const [selectedVersions, setSelectedVersions] = useState<number[]>([]);
  const [expandedPanel, setExpandedPanel] = useState(true);
  const [showAutosaves, setShowAutosaves] = useState(false);

  const { data: versionsData, isLoading } = useVersions(postId);
  const restoreVersion = useRestoreVersion();
  const publishVersion = usePublishVersion();
  const duplicateVersion = useDuplicateVersion();
  const deleteVersion = useDeleteVersion();

  const allVersions = versionsData?.data || [];
  const versions = showAutosaves
    ? allVersions
    : allVersions.filter((v) => !v.isAutosave);

  const handleVersionClick = (versionId: number) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter((id) => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    } else {
      // Replace the first selected version
      setSelectedVersions([selectedVersions[1], versionId]);
    }
  };

  const handleRestore = async (versionId: number, versionNumber: number) => {
    if (
      confirm(
        `Are you sure you want to restore version ${versionNumber}? This will create a new version with the content from version ${versionNumber}.`
      )
    ) {
      try {
        await restoreVersion.mutateAsync({ postId, versionId });
        setSelectedVersions([]);
      } catch (error) {
        alert('Failed to restore version');
      }
    }
  };

  const handlePublish = async (versionId: number, versionNumber: number) => {
    if (
      confirm(
        `Are you sure you want to publish version ${versionNumber}? This will make it visible to the public.`
      )
    ) {
      try {
        await publishVersion.mutateAsync({ postId, versionId });
      } catch (error) {
        alert('Failed to publish version');
      }
    }
  };

  const handleDuplicate = async (versionId: number) => {
    try {
      await duplicateVersion.mutateAsync({ postId, versionId });
    } catch (error) {
      alert('Failed to duplicate version');
    }
  };

  const handleDelete = async (versionId: number, versionNumber: number) => {
    if (
      confirm(
        `Are you sure you want to delete version ${versionNumber}? This cannot be undone.`
      )
    ) {
      try {
        await deleteVersion.mutateAsync({ postId, versionId });
      } catch (error) {
        alert('Failed to delete version');
      }
    }
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2 && onCompareVersions) {
      onCompareVersions(selectedVersions[0], selectedVersions[1]);
    }
  };

  return (
    <div className={styles.panel}>
      <button
        className={styles.header}
        onClick={() => setExpandedPanel(!expandedPanel)}
      >
        <History className={styles.headerIcon} />
        <span className={styles.headerTitle}>Version History</span>
        <span className={styles.versionCount}>{versions.length}</span>
      </button>

      {expandedPanel && (
        <div className={styles.content}>
          {/* Filter Controls */}
          <div className={styles.filters}>
            <label className={styles.filterCheckbox}>
              <input
                type="checkbox"
                checked={showAutosaves}
                onChange={(e) => setShowAutosaves(e.target.checked)}
              />
              <span>Show autosaves</span>
            </label>
          </div>

          {selectedVersions.length === 2 && (
            <button className={styles.compareButton} onClick={handleCompare}>
              Compare Selected Versions
            </button>
          )}

          {isLoading ? (
            <div className={styles.loading}>Loading versions...</div>
          ) : versions.length === 0 ? (
            <div className={styles.empty}>
              <Clock className={styles.emptyIcon} />
              <p className={styles.emptyText}>
                {showAutosaves ? 'No versions yet' : 'No manual versions yet'}
              </p>
            </div>
          ) : (
            <div className={styles.timeline}>
              {versions.map((version) => (
                <VersionItem
                  key={version.id}
                  version={version}
                  isSelected={selectedVersions.includes(version.id)}
                  onSelect={() => handleVersionClick(version.id)}
                  onRestore={() => handleRestore(version.id, version.versionNumber)}
                  onPublish={() => handlePublish(version.id, version.versionNumber)}
                  onDuplicate={() => handleDuplicate(version.id)}
                  onDelete={() => handleDelete(version.id, version.versionNumber)}
                  onView={() => onViewVersion?.(version.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface VersionItemProps {
  version: PostVersionListItem;
  isSelected: boolean;
  onSelect: () => void;
  onRestore: () => void;
  onPublish: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onView: () => void;
}

function VersionItem({
  version,
  isSelected,
  onSelect,
  onRestore,
  onPublish,
  onDuplicate,
  onDelete,
  onView,
}: VersionItemProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={`${styles.versionItem} ${isSelected ? styles.selected : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className={styles.checkbox}
      />

      <div className={styles.versionContent}>
        <div className={styles.versionHeader}>
          <span className={styles.versionNumber}>v{version.versionNumber}</span>
          {version.isPublished && (
            <span className={styles.publishedBadge}>
              <CheckCircle className={styles.badgeIcon} />
              Published
            </span>
          )}
          {version.isAutosave && (
            <span className={styles.autosaveBadge}>
              <AlertCircle className={styles.badgeIcon} />
              Autosave
            </span>
          )}
          {version.isLatest && !version.isPublished && (
            <span className={styles.latestBadge}>Latest</span>
          )}
        </div>

        <h4 className={styles.versionTitle}>{version.title}</h4>

        {version.changeDescription && (
          <p className={styles.changeDescription}>{version.changeDescription}</p>
        )}

        <div className={styles.versionMeta}>
          <span className={styles.metaItem}>
            <User className={styles.metaIcon} />
            {version.author.name}
          </span>
          <span className={styles.metaItem}>
            <Clock className={styles.metaIcon} />
            {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
          </span>
        </div>

        {showActions && (
          <div className={styles.actions}>
            <button
              className={styles.actionButton}
              onClick={onView}
              title="View"
            >
              <Eye className={styles.actionIcon} />
            </button>
            {!version.isLatest && (
              <button
                className={styles.actionButton}
                onClick={onRestore}
                title="Restore"
              >
                <RotateCcw className={styles.actionIcon} />
              </button>
            )}
            {!version.isPublished && (
              <button
                className={styles.actionButton}
                onClick={onPublish}
                title="Publish"
              >
                <CheckCircle className={styles.actionIcon} />
              </button>
            )}
            <button
              className={styles.actionButton}
              onClick={onDuplicate}
              title="Duplicate"
            >
              <Copy className={styles.actionIcon} />
            </button>
            {!version.isPublished && !version.isLatest && (
              <button
                className={`${styles.actionButton} ${styles.danger}`}
                onClick={onDelete}
                title="Delete"
              >
                <Trash2 className={styles.actionIcon} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
