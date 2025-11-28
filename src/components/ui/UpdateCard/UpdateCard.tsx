'use client';

import Link from 'next/link';
import { Update } from '@/lib/updates';
import { Icon } from '../Icon';
import { Avatar, Badge } from '../primitives';
import styles from './UpdateCard.module.scss';

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

    const getPriorityVariant = (priority: string): 'danger' | 'warning' | 'primary' | 'default' => {
        switch (priority) {
            case 'urgent': return 'danger';
            case 'high': return 'warning';
            case 'normal': return 'primary';
            case 'low': return 'default';
            default: return 'primary';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'news': return 'bell';
            case 'milestone': return 'star';
            case 'policy': return 'fileText';
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
        <Link href={`/updates/${update.id}`} className={styles.link}>
            <article className={styles.card}>
                <div className={styles.badges}>
                    <Badge variant={getPriorityVariant(update.priority)} size="sm">
                        {update.priority}
                    </Badge>
                    <Badge variant="outline" size="sm">
                        <Icon icon={getCategoryIcon(update.category)} size={14} />
                        {update.category}
                    </Badge>
                    {update.isPinned && (
                        <Badge variant="warning" size="sm">
                            <Icon icon="pin" size={14} />
                            Pinned
                        </Badge>
                    )}
                </div>

                {isNearExpiry(update.expiresAt) && (
                    <div className={styles.expiryNotice}>
                        <Icon icon="clock" size={14} />
                        <span>Expires {formatExpiryDate(update.expiresAt!)}</span>
                    </div>
                )}

                <div className={styles.header}>
                    <h3 className={styles.title}>{update.title}</h3>
                </div>

                <p className={styles.excerpt}>{getExcerpt()}</p>

                <div className={styles.meta}>
                    <Avatar
                        src={update.author.profile?.photo}
                        alt={update.author.fullName}
                        fallback={update.author.fullName.charAt(0).toUpperCase()}
                        size="sm"
                    />
                    <div className={styles.authorInfo}>
                        <span className={styles.author}>{update.author.fullName}</span>
                        <div className={styles.metaDetails}>
                            <span className={styles.space}>{update.space.title}</span>
                            <span className={styles.separator}>•</span>
                            <span className={styles.date}>{formatDate(update.createdAt)}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <span className={styles.stat}>
                        <Icon icon="heart" size={16} />
                        {update.likesCount}
                    </span>
                    <span className={styles.stat}>
                        <Icon icon="comment" size={16} />
                        {update.commentsCount}
                    </span>
                </div>
            </article>
        </Link>
    );
}
