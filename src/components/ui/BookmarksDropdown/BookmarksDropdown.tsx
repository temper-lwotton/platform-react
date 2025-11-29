'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Popover from '@radix-ui/react-popover';
import * as Tabs from '@radix-ui/react-tabs';
import { getCurrentUserId } from '@/lib/auth';
import { Icon } from '../Icon';
import styles from './BookmarksDropdown.module.scss';

// Placeholder types for bookmarked items
interface BookmarkedItem {
    id: string;
    title: string;
    excerpt?: string;
    type: 'post' | 'discussion' | 'event' | 'learning' | 'video' | 'message';
    createdAt: string;
    spaceName?: string;
    spaceId?: string;
}

export function BookmarksDropdown() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    // Placeholder bookmarks (will be replaced with API data later)
    const [bookmarks] = useState<BookmarkedItem[]>([]);

    useEffect(() => {
        setIsClient(true);
        setCurrentUserId(getCurrentUserId());
    }, []);

    const handleBookmarkClick = (bookmark: BookmarkedItem) => {
        setIsOpen(false);

        // Navigate based on type
        switch (bookmark.type) {
            case 'discussion':
                if (bookmark.spaceId) {
                    router.push(`/spaces/${bookmark.spaceId}/discussions/${bookmark.id}`);
                }
                break;
            case 'event':
                router.push(`/events/${bookmark.id}`);
                break;
            case 'message':
                router.push(`/messages/${bookmark.id}`);
                break;
            // Add other types as needed
            default:
                break;
        }
    };

    const getTimeAgo = (dateString: string): string => {
        const normalized = dateString.replace(' ', 'T');
        const date = new Date(normalized);
        if (isNaN(date.getTime())) return 'recently';

        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    if (!isClient || !currentUserId) return null;

    // Filter bookmarks by type
    const postBookmarks = bookmarks.filter(b => b.type === 'post');
    const discussionBookmarks = bookmarks.filter(b => b.type === 'discussion');
    const eventBookmarks = bookmarks.filter(b => b.type === 'event');
    const learningBookmarks = bookmarks.filter(b => b.type === 'learning');
    const videoBookmarks = bookmarks.filter(b => b.type === 'video');
    const messageBookmarks = bookmarks.filter(b => b.type === 'message');

    const renderBookmark = (bookmark: BookmarkedItem) => {
        return (
            <button
                key={bookmark.id}
                className={styles.item}
                onClick={() => handleBookmarkClick(bookmark)}
            >
                <div className={styles.itemIcon}>
                    <Icon icon="bookmarkFilled" size={16} />
                </div>

                <div className={styles.itemContent}>
                    <h4 className={styles.itemTitle}>
                        {bookmark.title}
                    </h4>

                    {bookmark.excerpt && (
                        <p className={styles.itemExcerpt}>
                            {bookmark.excerpt.length > 60
                                ? `${bookmark.excerpt.slice(0, 60)}...`
                                : bookmark.excerpt}
                        </p>
                    )}

                    <div className={styles.itemMeta}>
                        {bookmark.spaceName && (
                            <span className={styles.itemSpace}>
                                <Icon icon="folder" size={12} />
                                {bookmark.spaceName}
                            </span>
                        )}
                        <span className={styles.itemTime}>
                            {getTimeAgo(bookmark.createdAt)}
                        </span>
                    </div>
                </div>

                <button
                    className={styles.itemRemove}
                    onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Remove bookmark when API is available
                    }}
                    aria-label="Remove bookmark"
                >
                    <Icon icon="bookmark" size={14} />
                </button>
            </button>
        );
    };

    const renderEmptyState = (type: string) => (
        <div className={styles.empty}>
            <Icon icon="bookmark" size={24} className={styles.emptyIcon} />
            <p className={styles.emptyText}>No {type} bookmarked yet</p>
            <p className={styles.emptyHint}>
                Click the bookmark icon on any {type.toLowerCase()} to save it here
            </p>
        </div>
    );

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    className={styles.button}
                    aria-label="Bookmarks"
                >
                    <Icon icon="bookmark" size={20} className={styles.icon} />
                    {bookmarks.length > 0 && (
                        <span className={styles.badge}>
                            {bookmarks.length > 9 ? '9+' : bookmarks.length}
                        </span>
                    )}
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    className={styles.dropdownMenu}
                    align="end"
                    sideOffset={8}
                >
                    <div className={styles.dropdownHeader}>
                        <span className={styles.dropdownTitle}>Bookmarks</span>
                    </div>

                    <Tabs.Root defaultValue="discussions" className={styles.tabs}>
                        <Tabs.List className={styles.tabsList}>
                            <Tabs.Trigger value="posts" className={styles.tabTrigger}>
                                Posts
                                {postBookmarks.length > 0 && (
                                    <span className={styles.tabBadge}>
                                        {postBookmarks.length}
                                    </span>
                                )}
                            </Tabs.Trigger>
                            <Tabs.Trigger value="discussions" className={styles.tabTrigger}>
                                Discussions
                                {discussionBookmarks.length > 0 && (
                                    <span className={styles.tabBadge}>
                                        {discussionBookmarks.length}
                                    </span>
                                )}
                            </Tabs.Trigger>
                            <Tabs.Trigger value="events" className={styles.tabTrigger}>
                                Events
                                {eventBookmarks.length > 0 && (
                                    <span className={styles.tabBadge}>
                                        {eventBookmarks.length}
                                    </span>
                                )}
                            </Tabs.Trigger>
                            <Tabs.Trigger value="learning" className={styles.tabTrigger}>
                                Learning
                                {learningBookmarks.length > 0 && (
                                    <span className={styles.tabBadge}>
                                        {learningBookmarks.length}
                                    </span>
                                )}
                            </Tabs.Trigger>
                            <Tabs.Trigger value="videos" className={styles.tabTrigger}>
                                Videos
                                {videoBookmarks.length > 0 && (
                                    <span className={styles.tabBadge}>
                                        {videoBookmarks.length}
                                    </span>
                                )}
                            </Tabs.Trigger>
                            <Tabs.Trigger value="messages" className={styles.tabTrigger}>
                                Messages
                                {messageBookmarks.length > 0 && (
                                    <span className={styles.tabBadge}>
                                        {messageBookmarks.length}
                                    </span>
                                )}
                            </Tabs.Trigger>
                        </Tabs.List>

                        <Tabs.Content value="posts" className={styles.tabContent}>
                            <div className={styles.list}>
                                {postBookmarks.length === 0
                                    ? renderEmptyState('posts')
                                    : postBookmarks.slice(0, 5).map(renderBookmark)}
                            </div>
                        </Tabs.Content>

                        <Tabs.Content value="discussions" className={styles.tabContent}>
                            <div className={styles.list}>
                                {discussionBookmarks.length === 0
                                    ? renderEmptyState('discussions')
                                    : discussionBookmarks.slice(0, 5).map(renderBookmark)}
                            </div>
                        </Tabs.Content>

                        <Tabs.Content value="events" className={styles.tabContent}>
                            <div className={styles.list}>
                                {eventBookmarks.length === 0
                                    ? renderEmptyState('events')
                                    : eventBookmarks.slice(0, 5).map(renderBookmark)}
                            </div>
                        </Tabs.Content>

                        <Tabs.Content value="learning" className={styles.tabContent}>
                            <div className={styles.list}>
                                {learningBookmarks.length === 0
                                    ? renderEmptyState('learning materials')
                                    : learningBookmarks.slice(0, 5).map(renderBookmark)}
                            </div>
                        </Tabs.Content>

                        <Tabs.Content value="videos" className={styles.tabContent}>
                            <div className={styles.list}>
                                {videoBookmarks.length === 0
                                    ? renderEmptyState('videos')
                                    : videoBookmarks.slice(0, 5).map(renderBookmark)}
                            </div>
                        </Tabs.Content>

                        <Tabs.Content value="messages" className={styles.tabContent}>
                            <div className={styles.list}>
                                {messageBookmarks.length === 0
                                    ? renderEmptyState('messages')
                                    : messageBookmarks.slice(0, 5).map(renderBookmark)}
                            </div>
                        </Tabs.Content>
                    </Tabs.Root>

                    {bookmarks.length > 0 && (
                        <>
                            <div className={styles.dropdownSeparator} />

                            <div className={styles.dropdownFooter}>
                                <Popover.Close asChild>
                                    <Link
                                        href="/bookmarks"
                                        className={styles.viewAll}
                                    >
                                        View all bookmarks
                                    </Link>
                                </Popover.Close>
                            </div>
                        </>
                    )}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
