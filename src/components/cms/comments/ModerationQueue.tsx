'use client';

import { useState } from 'react';
import { MessageSquare, Check, X, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import {
  useComments,
  useCommentStats,
  useUpdateComment,
  useDeleteComment,
  useBulkUpdateComments,
} from '@/hooks/cms';
import type { CommentStatus } from '@/services/cms/types/comments';
import { formatDistanceToNow } from 'date-fns';
import styles from './ModerationQueue.module.scss';

type FilterTab = 'all' | 'pending' | 'approved' | 'spam' | 'trash';

export function ModerationQueue() {
  const [activeTab, setActiveTab] = useState<FilterTab>('pending');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: statsData } = useCommentStats();
  const { data: commentsData, isLoading } = useComments({
    status: activeTab === 'all' ? undefined : (activeTab as CommentStatus),
    sortBy: 'newest',
  });

  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();
  const bulkUpdate = useBulkUpdateComments();

  const stats = statsData?.data;
  const comments = commentsData?.data?.items || [];

  const handleStatusChange = async (commentId: number, status: CommentStatus) => {
    await updateComment.mutateAsync({ id: commentId, updates: { status } });
    setSelectedIds(prev => prev.filter(id => id !== commentId));
  };

  const handleDelete = async (commentId: number) => {
    if (confirm('Are you sure you want to permanently delete this comment?')) {
      await deleteComment.mutateAsync(commentId);
      setSelectedIds(prev => prev.filter(id => id !== commentId));
    }
  };

  const handleBulkAction = async (action: 'approve' | 'spam' | 'trash' | 'delete') => {
    if (selectedIds.length === 0) return;

    if (action === 'delete') {
      if (!confirm(`Permanently delete ${selectedIds.length} comments?`)) return;
    }

    await bulkUpdate.mutateAsync({ commentIds: selectedIds, action });
    setSelectedIds([]);
  };

  const toggleSelection = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === comments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(comments.map(c => c.id));
    }
  };

  const tabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: stats?.total },
    { key: 'pending', label: 'Pending', count: stats?.pending },
    { key: 'approved', label: 'Approved', count: stats?.approved },
    { key: 'spam', label: 'Spam', count: stats?.spam },
    { key: 'trash', label: 'Trash', count: stats?.trash },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <MessageSquare className={styles.titleIcon} />
          <div>
            <h2 className={styles.title}>Comment Moderation</h2>
            <p className={styles.subtitle}>
              Review and manage comments across all posts
            </p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Stats Summary */}
        {stats && (
          <div className={styles.statsBar}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total:</span>
              <span className={styles.statValue}>{stats.total}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Today:</span>
              <span className={styles.statValue}>{stats.todayCount}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Pending Review:</span>
              <span className={`${styles.statValue} ${styles.pending}`}>{stats.pending}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={styles.tabBadge}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className={styles.bulkActions}>
            <span className={styles.bulkLabel}>
              {selectedIds.length} selected
            </span>
            <div className={styles.bulkButtons}>
              <button
                onClick={() => handleBulkAction('approve')}
                className={styles.bulkButton}
                disabled={bulkUpdate.isPending}
              >
                <Check size={16} />
                Approve
              </button>
              <button
                onClick={() => handleBulkAction('spam')}
                className={styles.bulkButton}
                disabled={bulkUpdate.isPending}
              >
                <AlertTriangle size={16} />
                Spam
              </button>
              <button
                onClick={() => handleBulkAction('trash')}
                className={styles.bulkButton}
                disabled={bulkUpdate.isPending}
              >
                <Trash2 size={16} />
                Trash
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className={`${styles.bulkButton} ${styles.danger}`}
                disabled={bulkUpdate.isPending}
              >
                <X size={16} />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Comments List */}
        {isLoading ? (
          <div className={styles.loading}>
            <Loader2 className={styles.spinner} />
            <p>Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className={styles.empty}>
            <MessageSquare className={styles.emptyIcon} />
            <p className={styles.emptyText}>No comments to moderate</p>
          </div>
        ) : (
          <div className={styles.commentsList}>
            <div className={styles.selectAllRow}>
              <input
                type="checkbox"
                checked={selectedIds.length === comments.length && comments.length > 0}
                onChange={toggleSelectAll}
              />
              <span>Select All</span>
            </div>

            {comments.map(comment => (
              <div
                key={comment.id}
                className={`${styles.commentItem} ${
                  selectedIds.includes(comment.id) ? styles.selected : ''
                }`}
              >
                <div className={styles.commentCheckbox}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(comment.id)}
                    onChange={() => toggleSelection(comment.id)}
                  />
                </div>

                <div className={styles.commentContent}>
                  <div className={styles.commentHeader}>
                    <div className={styles.authorInfo}>
                      <span className={styles.authorName}>{comment.author.name}</span>
                      <span className={styles.authorEmail}>{comment.author.email}</span>
                    </div>
                    <div className={styles.commentMeta}>
                      <span className={styles.postId}>Post #{comment.postId}</span>
                      <span className={styles.date}>
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  <p className={styles.commentText}>{comment.content}</p>

                  <div className={styles.commentActions}>
                    {comment.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(comment.id, 'approved')}
                        className={styles.actionButton}
                        disabled={updateComment.isPending}
                      >
                        <Check size={14} />
                        Approve
                      </button>
                    )}
                    {comment.status !== 'spam' && (
                      <button
                        onClick={() => handleStatusChange(comment.id, 'spam')}
                        className={styles.actionButton}
                        disabled={updateComment.isPending}
                      >
                        <AlertTriangle size={14} />
                        Spam
                      </button>
                    )}
                    {comment.status !== 'trash' && (
                      <button
                        onClick={() => handleStatusChange(comment.id, 'trash')}
                        className={styles.actionButton}
                        disabled={updateComment.isPending}
                      >
                        <Trash2 size={14} />
                        Trash
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className={`${styles.actionButton} ${styles.danger}`}
                      disabled={deleteComment.isPending}
                    >
                      <X size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
