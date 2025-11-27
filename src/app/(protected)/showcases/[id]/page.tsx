'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getShowcase, likeShowcase, unlikeShowcase } from '@/lib/showcases';
import { getCurrentUserId } from '@/lib/auth';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { LikesDisplay } from '@/components/ui/LikesDisplay';
import { RichContent } from '@/components/ui/RichContent';

export default function ShowcaseDetailPage() {
    const params = useParams();
    const showcaseId = params.id as string;
    const currentUserId = getCurrentUserId();
    const queryClient = useQueryClient();

    const { data: showcase, isLoading, error } = useQuery({
        queryKey: ['showcase', showcaseId],
        queryFn: () => getShowcase(showcaseId),
        enabled: !!showcaseId,
    });

    const likeMutation = useMutation({
        mutationFn: () => {
            if (showcase?.isLiked) {
                return unlikeShowcase(showcaseId);
            } else {
                return likeShowcase(showcaseId);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['showcase', showcaseId] });
        },
    });

    if (isLoading) {
        return (
            <div className="showcase-detail">
                <p className="showcase-loading">Loading showcase...</p>
            </div>
        );
    }

    if (error || !showcase) {
        return (
            <div className="showcase-detail">
                <p className="showcase-error">Error loading showcase.</p>
                <Link href="/feed" className="showcase-back-link">
                    Back to feed
                </Link>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getProjectDuration = () => {
        if (!showcase.projectStart || !showcase.projectEnd) return null;
        const start = new Date(showcase.projectStart);
        const end = new Date(showcase.projectEnd);
        const diffMs = end.getTime() - start.getTime();
        const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
        return diffMonths;
    };

    const authorName = showcase.author.profile?.fullName || showcase.author.fullName || 'Unknown';
    const authorPhoto = showcase.author.profile?.photo;
    const initials = authorName
        .split(' ')
        .map((part: string) => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const duration = getProjectDuration();

    return (
        <div className="showcase-detail">
            <Link href="/feed" className="showcase-back-link">
                <Icon icon="arrowLeft" size={16} />
                Back to feed
            </Link>

            <article className="showcase-article">
                {showcase.media && showcase.media.length > 0 && (
                    <div className="showcase-article-hero">
                        <img
                            src={showcase.media[0].url}
                            alt={showcase.media[0].caption || showcase.title}
                            className="showcase-article-hero-image"
                        />
                        {showcase.media[0].caption && (
                            <p className="showcase-article-hero-caption">{showcase.media[0].caption}</p>
                        )}
                    </div>
                )}

                <header className="showcase-article-header">
                    <h1 className="showcase-article-title">{showcase.title}</h1>
                    <div className="showcase-article-meta">
                        {authorPhoto ? (
                            <img
                                src={authorPhoto}
                                alt={authorName}
                                className="showcase-article-avatar"
                            />
                        ) : (
                            <div className="showcase-article-avatar showcase-article-avatar--placeholder">
                                {initials}
                            </div>
                        )}
                        <div className="showcase-article-author-info">
                            <span className="showcase-article-author">{authorName}</span>
                            <div className="showcase-article-meta-details">
                                <span className="showcase-article-space">{showcase.space.title}</span>
                                <span className="showcase-article-separator">•</span>
                                <span className="showcase-article-date">{formatDate(showcase.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {showcase.projectStart && showcase.projectEnd && (
                    <div className="showcase-article-timeline">
                        <div className="showcase-timeline-item">
                            <Icon icon="calendar" size={16} />
                            <div>
                                <div className="showcase-timeline-label">Project Duration</div>
                                <div className="showcase-timeline-value">
                                    {formatDate(showcase.projectStart)} - {formatDate(showcase.projectEnd)}
                                    {duration && ` (${duration} month${duration !== 1 ? 's' : ''})`}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showcase.impactMetrics && showcase.impactMetrics.length > 0 && (
                    <div className="showcase-article-metrics">
                        <h2 className="showcase-article-section-title">Impact & Results</h2>
                        <div className="showcase-metrics-grid">
                            {showcase.impactMetrics.map((metric, index) => (
                                <div key={index} className="showcase-metric-card">
                                    <div className="showcase-metric-value">{metric.value}</div>
                                    <div className="showcase-metric-label">{metric.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <RichContent
                    content={showcase.htmlContent}
                    className="showcase-article-content"
                />

                {showcase.teamMembers && showcase.teamMembers.length > 0 && (
                    <div className="showcase-article-team">
                        <h2 className="showcase-article-section-title">Team</h2>
                        <div className="showcase-team-grid">
                            {showcase.teamMembers.map((member) => (
                                <div key={member.id} className="showcase-team-member">
                                    {member.photo ? (
                                        <img src={member.photo} alt={member.fullName} className="showcase-team-photo" />
                                    ) : (
                                        <div className="showcase-team-photo showcase-team-photo--placeholder">
                                            {member.fullName.charAt(0)}
                                        </div>
                                    )}
                                    <div className="showcase-team-info">
                                        <div className="showcase-team-name">{member.fullName}</div>
                                        {member.role && <div className="showcase-team-role">{member.role}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {showcase.media && showcase.media.length > 1 && (
                    <div className="showcase-article-gallery">
                        <h2 className="showcase-article-section-title">Gallery</h2>
                        <div className="showcase-gallery-grid">
                            {showcase.media.slice(1).map((item, index) => (
                                <div key={index} className="showcase-gallery-item">
                                    <img src={item.url} alt={item.caption || `Image ${index + 2}`} />
                                    {item.caption && <p className="showcase-gallery-caption">{item.caption}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {showcase.relatedLinks && showcase.relatedLinks.length > 0 && (
                    <div className="showcase-article-links">
                        <h2 className="showcase-article-section-title">Related Links</h2>
                        <div className="showcase-links-list">
                            {showcase.relatedLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    className="showcase-link-item"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Icon icon="external" size={16} />
                                    <span>{link.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {showcase.tags && showcase.tags.length > 0 && (
                    <div className="showcase-article-tags">
                        {showcase.tags.map((tag) => (
                            <span key={tag.id} className="showcase-tag">
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                )}

                <footer className="showcase-article-footer">
                    <div className="showcase-article-stats">
                        <LikesDisplay
                            likesCount={showcase.likesCount ?? 0}
                            isLiked={showcase.isLiked ?? false}
                            likedBy={[]}
                            onLikeToggle={() => likeMutation.mutate()}
                        />
                        <span className="showcase-article-stat">
                            <Icon icon="comment" size={18} className="showcase-article-stat-icon" />
                            {showcase.commentsCount ?? 0} comment{(showcase.commentsCount ?? 0) !== 1 ? 's' : ''}
                        </span>
                    </div>
                </footer>
            </article>

            <section className="showcase-comments">
                <h2 className="showcase-comments-title">
                    Comments ({showcase.commentsCount ?? 0})
                </h2>
                <p className="showcase-comments-placeholder">
                    Comments functionality will be added in a future update.
                </p>
            </section>
        </div>
    );
}
