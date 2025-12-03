'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FolderOpen,
  Plus,
  Edit,
  Trash2,
  Search,
  Archive,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { usePostTypes, useDeletePostType } from '@/hooks/cms';
import styles from './PostTypesList.module.scss';

export function PostTypesList() {
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  // Fetch post types
  const { data: postTypesData, isLoading, error } = usePostTypes({
    active: showInactive ? undefined : true,
  });

  const deletePostType = useDeletePostType();

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete the "${name}" post type? This cannot be undone if posts exist.`)) {
      try {
        await deletePostType.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete post type. Posts may exist with this type.');
      }
    }
  };

  // Filter post types by search
  const filteredPostTypes = postTypesData?.data.filter((postType) =>
    postType.name.toLowerCase().includes(search.toLowerCase()) ||
    postType.singularLabel.toLowerCase().includes(search.toLowerCase()) ||
    postType.pluralLabel.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Post Types</h1>
          <p className={styles.subtitle}>Manage content types for your CMS</p>
        </div>
        <Link href="/admin/post-types/new" className={styles.createButton}>
          <Plus className={styles.buttonIcon} />
          Add New Post Type
        </Link>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search post types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className={styles.checkbox}
          />
          Show inactive
        </label>
      </div>

      {/* Post Types Grid */}
      {isLoading ? (
        <div className={styles.loading}>Loading post types...</div>
      ) : error ? (
        <div className={styles.error}>Error loading post types</div>
      ) : filteredPostTypes.length === 0 ? (
        <div className={styles.empty}>
          <FolderOpen className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No post types found</h3>
          <p className={styles.emptyText}>Create your first post type to get started</p>
          <Link href="/admin/post-types/new" className={styles.emptyButton}>
            <Plus className={styles.buttonIcon} />
            Create Post Type
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredPostTypes.map((postType) => (
            <div key={postType.id} className={styles.card}>
              {/* Header */}
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <FolderOpen className={styles.cardIconSvg} />
                </div>
                <div className={styles.cardActions}>
                  <Link
                    href={`/admin/post-types/${postType.id}/edit`}
                    className={styles.actionButton}
                    title="Edit"
                  >
                    <Edit className={styles.actionIcon} />
                  </Link>
                  <button
                    onClick={() => handleDelete(postType.id, postType.name)}
                    className={`${styles.actionButton} ${styles.danger}`}
                    title="Delete"
                  >
                    <Trash2 className={styles.actionIcon} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{postType.singularLabel}</h3>
                <p className={styles.cardSubtitle}>{postType.pluralLabel}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.metaItem}>
                    <strong>Name:</strong> {postType.name}
                  </span>
                  <span className={styles.metaItem}>
                    <strong>Slug:</strong> {postType.slug}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className={styles.cardFooter}>
                <div className={styles.badges}>
                  {postType.isActive ? (
                    <span className={`${styles.badge} ${styles.active}`}>
                      <CheckCircle className={styles.badgeIcon} />
                      Active
                    </span>
                  ) : (
                    <span className={`${styles.badge} ${styles.inactive}`}>
                      <XCircle className={styles.badgeIcon} />
                      Inactive
                    </span>
                  )}
                  {postType.public && (
                    <span className={`${styles.badge} ${styles.public}`}>
                      Public
                    </span>
                  )}
                  {postType.hierarchical && (
                    <span className={`${styles.badge} ${styles.hierarchical}`}>
                      Hierarchical
                    </span>
                  )}
                </div>
                <div className={styles.supports}>
                  <span className={styles.supportsLabel}>Supports:</span>
                  <span className={styles.supportsValue}>
                    {postType.supports.slice(0, 3).join(', ')}
                    {postType.supports.length > 3 && ` +${postType.supports.length - 3}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
