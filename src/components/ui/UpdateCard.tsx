'use client';

import Link from 'next/link';
import { Update } from '@/lib/updates';
import { Icon } from './Icon';

interface UpdateCardProps {
    update: Update;
}

export function UpdateCard({ update }: UpdateCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const isNearExpiry = (expiresAt?: string) => {
        if (!expiresAt) return false;
        const expiryDate = new Date(expiresAt);
        const now = new Date();
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / 86400000);
        return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
    };

    const formatExpiryDate = (expiresAt: string) => {
        const expiryDate = new Date(expiresAt);
        const now = new Date();
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / 86400000);

        if (daysUntilExpiry === 0) return 'today';
        if (daysUntilExpiry === 1) return 'tomorrow';
        if (daysUntilExpiry < 7) return `in ${daysUntilExpiry} days`;
        return expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

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

    // Strip HTML and get first 200 chars
    const getExcerpt = () => {
        if (update.excerpt) return update.excerpt;
        const text = update.htmlContent.replace(/<[^>]*>/g, '');
        return text.length > 200 ? text.substring(0, 200) + '...' : text;
    };

    return (
        <Link href={`/updates/${update.id}`} className="update-card-link">
            <article className="update-card">
                <div className="update-card-badges">
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

                {isNearExpiry(update.expiresAt) && (
                    <div className="update-expiry-notice">
                        <Icon icon="clock" size={14} />
                        <span>Expires {formatExpiryDate(update.expiresAt!)}</span>
                    </div>
                )}

                <div className="update-card-header">
                    <h3 className="update-card-title">{update.title}</h3>
                </div>

                <p className="update-card-excerpt">{getExcerpt()}</p>

                <div className="update-card-meta">
                    {update.author.profile?.photo ? (
                        <img
                            src={update.author.profile.photo}
                            alt={update.author.fullName}
                            className="update-card-avatar"
                        />
                    ) : (
                        <div className="update-card-avatar update-card-avatar--placeholder">
                            {update.author.fullName.charAt(0)}
                        </div>
                    )}
                    <div className="update-card-author-info">
                        <span className="update-card-author">{update.author.fullName}</span>
                        <div className="update-card-meta-details">
                            <span className="update-card-space">{update.space.title}</span>
                            <span className="update-card-separator">•</span>
                            <span className="update-card-date">{formatDate(update.createdAt)}</span>
                        </div>
                    </div>
                </div>

                <div className="update-card-footer">
                    <span className="update-card-stat">
                        <Icon icon={update.isLiked ? 'heartFilled' : 'heart'} size={16} />
                        {update.likesCount}
                    </span>
                    <span className="update-card-stat">
                        <Icon icon="comment" size={16} />
                        {update.commentsCount}
                    </span>
                </div>
            </article>
        </Link>
    );
}
