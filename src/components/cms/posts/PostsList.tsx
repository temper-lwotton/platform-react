'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Eye,
} from 'lucide-react';
import { usePosts, useDeletePost, useDuplicatePost } from '@/hooks/cms';
import { usePostTypes } from '@/hooks/cms';
import { Post, PostStatus } from '@/types/cms';
import { format } from 'date-fns';
import styles from './PostsList.module.scss';

export function PostsList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedPostType, setSelectedPostType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<PostStatus | ''>('');
  const [page, setPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);

  // Fetch posts with filters
  const { data: postsData, isLoading, error } = usePosts({
    search: search || undefined,
    postType: selectedPostType || undefined,
    status: selectedStatus || undefined,
    page,
    limit: 20,
  });

  // Fetch post types for filter dropdown
  const { data: postTypesData } = usePostTypes({ active: true });

  const deletePost = useDeletePost();
  const duplicatePost = useDuplicatePost();

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost.mutateAsync({ id, permanent: false });
    }
  };

  const handleDuplicate = async (id: number) => {
    await duplicatePost.mutateAsync(id);
  };

  const handleBulkDelete = async () => {
    if (confirm(`Delete ${selectedPosts.length} posts?`)) {
      for (const id of selectedPosts) {
        await deletePost.mutateAsync({ id, permanent: false });
      }
      setSelectedPosts([]);
    }
  };

  const togglePostSelection = (id: number) => {
    setSelectedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleAllPosts = () => {
    if (selectedPosts.length === postsData?.data.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(postsData?.data.map((p) => p.id) || []);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Posts</h1>
          <p className={styles.subtitle}>Manage all your content</p>
        </div>
        <Link href="/admin/posts/new" className={styles.createButton}>
          <Plus className={styles.buttonIcon} />
          Add New Post
        </Link>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={selectedPostType}
          onChange={(e) => setSelectedPostType(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Post Types</option>
          {postTypesData?.data.map((type) => (
            <option key={type.id} value={type.name}>
              {type.pluralLabel}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as PostStatus | '')}
          className={styles.filterSelect}
        >
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="has_changes">Has Unpublished Changes</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className={styles.bulkActions}>
          <span className={styles.bulkCount}>{selectedPosts.length} selected</span>
          <button onClick={handleBulkDelete} className={styles.bulkDeleteButton}>
            <Trash2 className={styles.buttonIcon} />
            Delete Selected
          </button>
        </div>
      )}

      {/* Posts Table */}
      {isLoading ? (
        <div className={styles.loading}>Loading posts...</div>
      ) : error ? (
        <div className={styles.error}>Error loading posts</div>
      ) : postsData?.data.length === 0 ? (
        <div className={styles.empty}>
          <FileText className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No posts found</h3>
          <p className={styles.emptyText}>Create your first post to get started</p>
          <Link href="/admin/posts/new" className={styles.emptyButton}>
            <Plus className={styles.buttonIcon} />
            Create Post
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkboxCell}>
                    <input
                      type="checkbox"
                      checked={selectedPosts.length === postsData?.data.length}
                      onChange={toggleAllPosts}
                      className={styles.checkbox}
                    />
                  </th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Last Modified</th>
                  <th className={styles.actionsCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {postsData?.data.map((post) => (
                  <tr key={post.id} className={styles.tableRow}>
                    <td className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => togglePostSelection(post.id)}
                        className={styles.checkbox}
                      />
                    </td>
                    <td>
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className={styles.postTitle}
                      >
                        {post.title || '(No title)'}
                      </Link>
                    </td>
                    <td>
                      <span className={styles.postType}>
                        {post.postType.singularLabel}
                      </span>
                    </td>
                    <td className={styles.author}>{post.author.name}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          post.isPublished
                            ? styles.published
                            : post.isDraft
                            ? styles.draft
                            : styles.changes
                        }`}
                      >
                        {post.isPublished && post.hasUnpublishedChanges
                          ? 'Has Changes'
                          : post.isPublished
                          ? 'Published'
                          : 'Draft'}
                      </span>
                    </td>
                    <td className={styles.date}>
                      {format(new Date(post.lastModifiedAt), 'MMM d, yyyy')}
                    </td>
                    <td className={styles.actionsCell}>
                      <div className={styles.actions}>
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className={styles.actionButton}
                          title="Edit"
                        >
                          <Edit className={styles.actionIcon} />
                        </Link>
                        {post.isPublished && (
                          <a
                            href={`/posts/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.actionButton}
                            title="View"
                          >
                            <Eye className={styles.actionIcon} />
                          </a>
                        )}
                        <button
                          onClick={() => handleDuplicate(post.id)}
                          className={styles.actionButton}
                          title="Duplicate"
                        >
                          <Copy className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className={`${styles.actionButton} ${styles.danger}`}
                          title="Delete"
                        >
                          <Trash2 className={styles.actionIcon} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {postsData && postsData.meta.pages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              <span className={styles.paginationInfo}>
                Page {page} of {postsData.meta.pages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= postsData.meta.pages}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
