'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUpdate, likeUpdate, unlikeUpdate } from '@/lib/updates';
import { getCurrentUserId } from '@/lib/auth';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { LikesDisplay } from '@/components/ui/LikesDisplay';
import { RichContent } from '@/components/ui/RichContent';

export default function UpdateDetailPage() {
    const params = useParams();
    const updateId = params.id as string;
    const currentUserId = getCurrentUserId();
    const queryClient = useQueryClient();

    const { data: update, isLoading, error } = useQuery({
        queryKey: ['update', updateId],
        queryFn: () => getUpdate(updateId),
        enabled: !!updateId,
    });

    const likeMutation = useMutation({
        mutationFn: () => {
            if (update?.isLiked) {
                return unlikeUpdate(updateId);
            } else {
                return likeUpdate(updateId);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['update', updateId] });
        },
    });

    if (isLoading) {
        return (
            <div className="update-detail">
                <p className="update-loading">Loading update...</p>
            </div>
        );
    }

    if (error || !update) {
        return (
            <div className="update-detail">
                <p className="update-error">Error loading update.</p>
                <Link href="/feed" className="update-back-link">
                    Back to feed
                </Link>
            </div>
        );
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'priority-urgent';
            case 'high': return 'priority-high';
            case 'normal': return 'priority-normal';
            case 'low': return 'priority-low';
            default: return 'priority-normal';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'news': return 'bell';
            case 'milestone': return 'star';
            case 'policy': return 'document';
            case 'announcement': return 'megaphone';
            default: return 'info';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const authorName = update.author.profile?.fullName || update.author.fullName || 'Unknown';
    const authorPhoto = update.author.profile?.photo;
    const initials = authorName
        .split(' ')
        .map((part: string) => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="update-detail">
            <Link href="/feed" className="update-back-link">
                <Icon icon="arrowLeft" size={16} />
                Back to feed
            </Link>

            <article className="update-article">
                <div className="update-article-badges">
                    <span className={`update-priority-badge ${getPriorityColor(update.priority)}`}>
                        {update.priority}
                    </span>
                    <span className="update-category-badge">
                        <Icon icon={getCategoryIcon(update.category)} size={14} />
                        <span>{update.category}</span>
                    </span>
                    {update.isPinned && (
                        <span className="pinned-badge">
                            <Icon icon="pin" size={14} />
                            <span>Pinned</span>
                        </span>
                    )}
                </div>

                <header className="update-article-header">
                    <h1 className="update-article-title">{update.title}</h1>
                    <div className="update-article-meta">
                        {authorPhoto ? (
                            <img
                                src={authorPhoto}
                                alt={authorName}
                                className="update-article-avatar"
                            />
                        ) : (
                            <div className="update-article-avatar update-article-avatar--placeholder">
                                {initials}
                            </div>
                        )}
                        <div className="update-article-author-info">
                            <span className="update-article-author">{authorName}</span>
                            <div className="update-article-meta-details">
                                <span className="update-article-space">{update.space.title}</span>
                                <span className="update-article-separator">•</span>
                                <span className="update-article-date">{formatDate(update.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {update.expiresAt && (
                    <div className="update-expiry-notice">
                        <Icon icon="clock" size={16} />
                        <span>
                            This update expires on {new Date(update.expiresAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                    </div>
                )}

                <RichContent
                    content={update.htmlContent}
                    className="update-article-content"
                />

                {update.tags && update.tags.length > 0 && (
                    <div className="update-article-tags">
                        {update.tags.map((tag) => (
                            <span key={tag.id} className="update-tag">
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                )}

                <footer className="update-article-footer">
                    <LikesDisplay
                        likesCount={update.likesCount ?? 0}
                        isLiked={update.isLiked ?? false}
                        likedBy={[]}
                        onLikeToggle={() => likeMutation.mutate()}
                    />
                </footer>
            </article>

            <section className="update-comments">
                <h2 className="update-comments-title">
                    Comments ({update.commentsCount ?? 0})
                </h2>
                <p className="update-comments-placeholder">
                    Comments functionality will be added in a future update.
                </p>
            </section>
        </div>
    );
}
