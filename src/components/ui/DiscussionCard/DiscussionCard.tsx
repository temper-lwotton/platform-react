'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Discussion } from '@/lib/discussions';
import { Icon } from '../Icon';
import { useToast } from '../ToastProvider';
import { Avatar } from '../primitives';
import { useIsAdmin } from '@/hooks/cms/usePermissions';
import { generateDiscussionBroadcast } from '@/lib/broadcasts/templates';
import { InlineModerationControls } from '@/components/cms/moderation/InlineModerationControls';
import styles from './DiscussionCard.module.scss';

interface DiscussionCardProps {
    discussion: Discussion;
    spaceId: string;
}

export function DiscussionCard({ discussion, spaceId }: DiscussionCardProps) {
    const router = useRouter();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
    const { showToast } = useToast();
    const isAdmin = useIsAdmin();

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

    const handleBroadcast = () => {
        // Generate broadcast template
        const template = generateDiscussionBroadcast(discussion, spaceId);

        // Store template in localStorage for the broadcast editor to pick up
        localStorage.setItem('broadcast_template', JSON.stringify(template));

        // Navigate to broadcast creation page
        router.push('/admin/broadcasts/new?source=discussion');

        showToast('Creating broadcast for discussion...');
        setIsAdminMenuOpen(false);
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
                <div className={styles.actions}>
                    {isAdmin && (
                        <DropdownMenu.Root open={isAdminMenuOpen} onOpenChange={setIsAdminMenuOpen}>
                            <DropdownMenu.Trigger asChild>
                                <button
                                    className={styles.adminMenuButton}
                                    onClick={(e) => e.stopPropagation()}
                                    title="Admin options"
                                >
                                    <Icon icon="moreVertical" size={18} />
                                </button>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    className={styles.adminMenu}
                                    align="end"
                                    sideOffset={4}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <DropdownMenu.Item
                                        className={styles.adminMenuItem}
                                        onSelect={handleBroadcast}
                                    >
                                        <Icon icon="send" size={16} className={styles.adminMenuIcon} />
                                        <div className={styles.adminMenuText}>
                                            <div className={styles.adminMenuLabel}>Broadcast This</div>
                                            <div className={styles.adminMenuDesc}>
                                                Create an email campaign for this discussion
                                            </div>
                                        </div>
                                    </DropdownMenu.Item>

                                    <DropdownMenu.Separator className={styles.adminMenuSeparator} />

                                    <DropdownMenu.Item
                                        className={styles.adminMenuItem}
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        <div className={styles.moderationSection}>
                                            <InlineModerationControls
                                                contentId={discussion.id}
                                                contentType="post"
                                                isAdmin={isAdmin}
                                                compact={true}
                                                onAction={(action) => {
                                                    showToast(`Moderation action: ${action}`);
                                                    setIsAdminMenuOpen(false);
                                                }}
                                            />
                                        </div>
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    )}
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
            </div>
        </article>
    );
}
