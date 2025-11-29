'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserId } from '@/lib/auth';
import { TabbedDropdown, TabbedDropdownTab } from '../primitives';
import { BookmarkItem } from './BookmarkItem';

export interface BookmarkedItem {
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
            default:
                break;
        }
    };

    const handleRemoveBookmark = (bookmark: BookmarkedItem) => {
        // TODO: Remove bookmark when API is available
    };

    if (!isClient || !currentUserId) return null;

    // Filter bookmarks by type
    const postBookmarks = bookmarks.filter(b => b.type === 'post').slice(0, 5);
    const discussionBookmarks = bookmarks.filter(b => b.type === 'discussion').slice(0, 5);
    const eventBookmarks = bookmarks.filter(b => b.type === 'event').slice(0, 5);
    const learningBookmarks = bookmarks.filter(b => b.type === 'learning').slice(0, 5);
    const videoBookmarks = bookmarks.filter(b => b.type === 'video').slice(0, 5);
    const messageBookmarks = bookmarks.filter(b => b.type === 'message').slice(0, 5);

    const tabs: TabbedDropdownTab<BookmarkedItem>[] = [
        {
            id: 'posts',
            label: 'Posts',
            count: bookmarks.filter(b => b.type === 'post').length,
            items: postBookmarks,
        },
        {
            id: 'discussions',
            label: 'Discussions',
            count: bookmarks.filter(b => b.type === 'discussion').length,
            items: discussionBookmarks,
        },
        {
            id: 'events',
            label: 'Events',
            count: bookmarks.filter(b => b.type === 'event').length,
            items: eventBookmarks,
        },
        {
            id: 'learning',
            label: 'Learning',
            count: bookmarks.filter(b => b.type === 'learning').length,
            items: learningBookmarks,
        },
        {
            id: 'videos',
            label: 'Videos',
            count: bookmarks.filter(b => b.type === 'video').length,
            items: videoBookmarks,
        },
        {
            id: 'messages',
            label: 'Messages',
            count: bookmarks.filter(b => b.type === 'message').length,
            items: messageBookmarks,
        },
    ];

    return (
        <TabbedDropdown<BookmarkedItem>
            icon="bookmark"
            badgeCount={bookmarks.length > 0 ? bookmarks.length : undefined}
            ariaLabel="Bookmarks"
            title="Bookmarks"
            tabs={tabs}
            defaultTab="discussions"
            renderItem={(bookmark) => (
                <BookmarkItem
                    bookmark={bookmark}
                    onRemove={handleRemoveBookmark}
                />
            )}
            emptyMessage="No bookmarks"
            viewAllLink="/bookmarks"
            viewAllLabel="View all bookmarks"
            onItemClick={handleBookmarkClick}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
        />
    );
}
