'use client';

import Link from 'next/link';
import { Showcase } from '@/lib/showcases';
import { Icon } from './Icon';
import { Avatar, Badge } from './primitives';

interface ShowcaseCardProps {
    showcase: Showcase;
}

export function ShowcaseCard({ showcase }: ShowcaseCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getProjectDuration = () => {
        if (!showcase.projectStart || !showcase.projectEnd) return null;
        const start = new Date(showcase.projectStart);
        const end = new Date(showcase.projectEnd);
        const diffMs = end.getTime() - start.getTime();
        const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));

        if (diffMonths < 1) return '< 1 month';
        if (diffMonths === 1) return '1 month';
        return `${diffMonths} months`;
    };

    // Strip HTML and get first 200 chars
    const getExcerpt = () => {
        if (showcase.excerpt) return showcase.excerpt;
        const text = showcase.htmlContent.replace(/<[^>]*>/g, '');
        return text.length > 200 ? text.substring(0, 200) + '...' : text;
    };

    const duration = getProjectDuration();

    return (
        <Link href={`/showcases/${showcase.id}`} className="showcase-card-link">
            <article className="showcase-card">
                {showcase.media && showcase.media.length > 0 && (
                    <div className="showcase-card-image-wrapper">
                        <img
                            src={showcase.media[0].url}
                            alt={showcase.media[0].caption || showcase.title}
                            className="showcase-card-image"
                        />
                        {showcase.media.length > 1 && (
                            <span className="showcase-card-image-count">
                                <Icon icon="eye" size={14} />
                                {showcase.media.length}
                            </span>
                        )}
                    </div>
                )}

                <div className="showcase-card-content">
                    <div className="showcase-card-header">
                        {showcase.isPinned && (
                            <Badge variant="warning" size="sm" className="pinned-badge">
                                <Icon icon="pin" size={14} />
                                Featured
                            </Badge>
                        )}
                    </div>

                    <h3 className="showcase-card-title">{showcase.title}</h3>

                    <p className="showcase-card-excerpt">{getExcerpt()}</p>

                    {showcase.impactMetrics && showcase.impactMetrics.length > 0 && (
                        <div className="showcase-card-metrics">
                            {showcase.impactMetrics.slice(0, 3).map((metric, index) => (
                                <div key={index} className="showcase-card-metric">
                                    <span className="showcase-card-metric-value">{metric.value}</span>
                                    <span className="showcase-card-metric-label">{metric.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {showcase.teamMembers && showcase.teamMembers.length > 0 && (
                        <div className="showcase-card-team">
                            <span className="showcase-card-team-label">Team:</span>
                            <div className="showcase-card-team-avatars">
                                {showcase.teamMembers.slice(0, 4).map((member) => (
                                    <Avatar
                                        key={member.id}
                                        src={member.photo}
                                        alt={member.fullName}
                                        fallback={member.fullName.charAt(0).toUpperCase()}
                                        size="xs"
                                        className="showcase-card-team-avatar"
                                    />
                                ))}
                                {showcase.teamMembers.length > 4 && (
                                    <Badge variant="default" size="sm" className="showcase-card-team-more">
                                        +{showcase.teamMembers.length - 4}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="showcase-card-meta">
                        <Avatar
                            src={showcase.author.profile?.photo}
                            alt={showcase.author.fullName}
                            fallback={showcase.author.fullName.charAt(0).toUpperCase()}
                            size="sm"
                            className="showcase-card-avatar"
                        />
                        <div className="showcase-card-author-info">
                            <span className="showcase-card-author">{showcase.author.fullName}</span>
                            {duration && (
                                <span className="showcase-card-duration">
                                    <Icon icon="clock" size={14} />
                                    {duration}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="showcase-card-footer">
                        <span className="showcase-card-stat">
                            <Icon icon="heart" size={16} />
                            {showcase.likesCount}
                        </span>
                        <span className="showcase-card-stat">
                            <Icon icon="comment" size={16} />
                            {showcase.commentsCount}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
