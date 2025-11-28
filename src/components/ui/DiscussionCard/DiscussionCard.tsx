'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Discussion } from '@/lib/discussions';
import { Icon } from '../Icon';
import { useToast } from '../ToastProvider';
import { Avatar } from '../primitives';
import styles from './DiscussionCard.module.scss';

interface DiscussionCardProps {
    discussion: Discussion;
    spaceId: string;
}

export function DiscussionCard({ discussion, spaceId }: DiscussionCardProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const { showToast } = useToast();

    const authorName = discussion.author?.profile?.fullName
        || `${discussion.author?.profile?.firstName || ''} ${discussion.author?.profile?.lastName || ''}`.trim()
        || 'Unknown';

    const initials = authorName
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const formattedDate = new Date(discussion.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    // Get space name from discussion
    const spaceName = typeof discussion.space === 'object'
        ? discussion.space?.title
        : undefined;

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const newBookmarkState = !isBookmarked;
        setIsBookmarked(newBookmarkState);

        if (newBookmarkState) {
            showToast(`Bookmarked "${discussion.title}" - you can find it later in your bookmarks`);
        } else {
            showToast(`Removed "${discussion.title}" from bookmarks`);
        }
    };

    return (
        <article className={styles.card}>
            {spaceName && (
                <div className={styles.space}>
                    <Link href={`/spaces/${spaceId}`} className={styles.spaceLink}>
                        <Icon icon="folder" size={14} />
                        {spaceName}
                    </Link>
                </div>
            )}

            <div className={styles.header}>
                <Avatar
                    src={discussion.author?.profile?.photo}
                    alt={authorName}
                    fallback={initials}
                    size="sm"
                />
                <div className={styles.meta}>
                    <span className={styles.author}>{authorName}</span>
                    <span className={styles.date}>{formattedDate}</span>
                </div>
            </div>

            <Link href={`/spaces/${spaceId}/discussions/${discussion.id}`} className={styles.titleLink}>
                <h3 className={styles.title}>{discussion.title}</h3>
            </Link>

            {discussion.excerpt && (
                <p className={styles.preview}>
                    {discussion.excerpt.length > 150
                        ? `${discussion.excerpt.slice(0, 150)}...`
                        : discussion.excerpt}
                </p>
            )}

            <div className={styles.footer}>
                <div className={styles.stats}>
                    <span className={styles.stat}>
                        <Icon icon="heart" size={16} />
                        {discussion.likesCount ?? 0}
                    </span>
                    <span className={styles.stat}>
                        <Icon icon="comment" size={16} />
                        {discussion.commentsCount ?? 0}
                    </span>
                </div>
                <button
                    onClick={handleBookmark}
                    className={styles.bookmark}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                    <Icon
                        icon="bookmark"
                        size={18}
                        className={styles.bookmarkIcon}
                    />
                </button>
            </div>
        </article>
    );
}
