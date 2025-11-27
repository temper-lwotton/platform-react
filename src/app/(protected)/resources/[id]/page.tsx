'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getResource, likeResource, unlikeResource, markResourceHelpful, trackResourceView, trackResourceDownload } from '@/lib/resources';
import { getCurrentUserId } from '@/lib/auth';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { LikesDisplay } from '@/components/ui/LikesDisplay';
import { RichContent } from '@/components/ui/RichContent';

export default function ResourceDetailPage() {
    const params = useParams();
    const resourceId = params.id as string;
    const currentUserId = getCurrentUserId();
    const queryClient = useQueryClient();
    const [hasTrackedView, setHasTrackedView] = useState(false);

    const { data: resource, isLoading, error } = useQuery({
        queryKey: ['resource', resourceId],
        queryFn: () => getResource(resourceId),
        enabled: !!resourceId,
    });

    // Track view on mount
    useEffect(() => {
        if (resource && !hasTrackedView) {
            trackResourceView(resourceId);
            setHasTrackedView(true);
        }
    }, [resource, resourceId, hasTrackedView]);

    const likeMutation = useMutation({
        mutationFn: () => {
            if (resource?.isLiked) {
                return unlikeResource(resourceId);
            } else {
                return likeResource(resourceId);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resource', resourceId] });
        },
    });

    const helpfulMutation = useMutation({
        mutationFn: () => markResourceHelpful(resourceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resource', resourceId] });
        },
    });

    const handleDownload = (url: string, filename: string) => {
        trackResourceDownload(resourceId);
        // In real implementation, this would trigger actual download
        window.open(url, '_blank');
    };

    if (isLoading) {
        return (
            <div className="resource-detail">
                <p className="resource-loading">Loading resource...</p>
            </div>
        );
    }

    if (error || !resource) {
        return (
            <div className="resource-detail">
                <p className="resource-error">Error loading resource.</p>
                <Link href="/feed" className="resource-back-link">
                    Back to feed
                </Link>
            </div>
        );
    }

    const getResourceTypeIcon = (type: string) => {
        switch (type) {
            case 'guide': return 'book';
            case 'template': return 'document';
            case 'documentation': return 'file';
            case 'best-practice': return 'star';
            case 'tool': return 'settings';
            default: return 'file';
        }
    };

    const getResourceTypeLabel = (type: string) => {
        switch (type) {
            case 'guide': return 'Guide';
            case 'template': return 'Template';
            case 'documentation': return 'Documentation';
            case 'best-practice': return 'Best Practice';
            case 'tool': return 'Tool';
            default: return type;
        }
    };

    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty) {
            case 'beginner': return 'difficulty-beginner';
            case 'intermediate': return 'difficulty-intermediate';
            case 'advanced': return 'difficulty-advanced';
            default: return '';
        }
    };

    const formatTime = (minutes?: number) => {
        if (!minutes) return null;
        if (minutes < 60) return `${minutes} minutes`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (mins === 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
        return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minutes`;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const authorName = resource.author.profile?.fullName || resource.author.fullName || 'Unknown';
    const authorPhoto = resource.author.profile?.photo;
    const initials = authorName
        .split(' ')
        .map((part: string) => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const estimatedTime = formatTime(resource.estimatedTime);

    return (
        <div className="resource-detail">
            <Link href="/feed" className="resource-back-link">
                <Icon icon="arrowLeft" size={16} />
                Back to feed
            </Link>

            <article className="resource-article">
                <div className="resource-article-main">
                    <div className="resource-article-badges">
                        <span className="resource-type-badge">
                            <Icon icon={getResourceTypeIcon(resource.resourceType)} size={14} />
                            <span>{getResourceTypeLabel(resource.resourceType)}</span>
                        </span>
                        {resource.difficulty && (
                            <span className={`difficulty-badge ${getDifficultyColor(resource.difficulty)}`}>
                                {resource.difficulty}
                            </span>
                        )}
                        {resource.isPinned && (
                            <span className="pinned-badge">
                                <Icon icon="pin" size={14} />
                                <span>Pinned</span>
                            </span>
                        )}
                    </div>

                    <header className="resource-article-header">
                        <h1 className="resource-article-title">{resource.title}</h1>
                        <div className="resource-article-meta">
                            {authorPhoto ? (
                                <img
                                    src={authorPhoto}
                                    alt={authorName}
                                    className="resource-article-avatar"
                                />
                            ) : (
                                <div className="resource-article-avatar resource-article-avatar--placeholder">
                                    {initials}
                                </div>
                            )}
                            <div className="resource-article-author-info">
                                <span className="resource-article-author">{authorName}</span>
                                <div className="resource-article-meta-details">
                                    <span className="resource-article-space">{resource.space.title}</span>
                                    <span className="resource-article-separator">•</span>
                                    <span className="resource-article-date">Updated {formatDate(resource.updatedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    <RichContent
                        content={resource.htmlContent}
                        className="resource-article-content"
                    />

                    {resource.attachments && resource.attachments.length > 0 && (
                        <div className="resource-article-attachments">
                            <h2 className="resource-article-section-title">Downloads</h2>
                            <div className="resource-attachments-list">
                                {resource.attachments.map((attachment, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleDownload(attachment.url, attachment.name)}
                                        className="resource-attachment-item"
                                    >
                                        <Icon icon="download" size={20} />
                                        <div className="resource-attachment-info">
                                            <div className="resource-attachment-name">{attachment.name}</div>
                                            <div className="resource-attachment-meta">
                                                {formatFileSize(attachment.size)}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {resource.tags && resource.tags.length > 0 && (
                        <div className="resource-article-tags">
                            {resource.tags.map((tag) => (
                                <span key={tag.id} className="resource-tag">
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <footer className="resource-article-footer">
                        <div className="resource-article-actions">
                            <button
                                onClick={() => helpfulMutation.mutate()}
                                className={`resource-helpful-btn ${resource.isHelpful ? 'resource-helpful-btn--active' : ''}`}
                                disabled={helpfulMutation.isPending}
                            >
                                <Icon icon={resource.isHelpful ? 'thumbsUpFilled' : 'thumbsUp'} size={18} />
                                {resource.isHelpful ? 'Marked as helpful' : 'Was this helpful?'}
                            </button>
                            <LikesDisplay
                                likesCount={resource.likesCount ?? 0}
                                isLiked={resource.isLiked ?? false}
                                likedBy={[]}
                                onLikeToggle={() => likeMutation.mutate()}
                            />
                        </div>
                    </footer>
                </div>

                <div className="resource-article-sidebar">
                    <div className="resource-info-card">
                        <h3 className="resource-info-title">Resource Info</h3>
                        <div className="resource-info-items">
                            {estimatedTime && (
                                <div className="resource-info-item">
                                    <Icon icon="clock" size={16} />
                                    <div>
                                        <div className="resource-info-label">Est. Time</div>
                                        <div className="resource-info-value">{estimatedTime}</div>
                                    </div>
                                </div>
                            )}
                            {resource.version && (
                                <div className="resource-info-item">
                                    <Icon icon="tag" size={16} />
                                    <div>
                                        <div className="resource-info-label">Version</div>
                                        <div className="resource-info-value">{resource.version}</div>
                                    </div>
                                </div>
                            )}
                            {resource.lastReviewed && (
                                <div className="resource-info-item">
                                    <Icon icon="check" size={16} />
                                    <div>
                                        <div className="resource-info-label">Last Reviewed</div>
                                        <div className="resource-info-value">{formatDate(resource.lastReviewed)}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="resource-stats-card">
                        <div className="resource-stat-item">
                            <Icon icon="eye" size={20} />
                            <div>
                                <div className="resource-stat-value">{resource.viewCount}</div>
                                <div className="resource-stat-label">Views</div>
                            </div>
                        </div>
                        <div className="resource-stat-item">
                            <Icon icon="download" size={20} />
                            <div>
                                <div className="resource-stat-value">{resource.downloadCount}</div>
                                <div className="resource-stat-label">Downloads</div>
                            </div>
                        </div>
                        <div className="resource-stat-item">
                            <Icon icon="thumbsUp" size={20} />
                            <div>
                                <div className="resource-stat-value">{resource.helpfulCount}</div>
                                <div className="resource-stat-label">Helpful</div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            <section className="resource-comments">
                <h2 className="resource-comments-title">
                    Comments ({resource.commentsCount ?? 0})
                </h2>
                <p className="resource-comments-placeholder">
                    Comments functionality will be added in a future update.
                </p>
            </section>
        </div>
    );
}
