'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import * as Popover from '@radix-ui/react-popover';
import * as Tabs from '@radix-ui/react-tabs';
import {
    getConversations,
    getUnreadMessagesCount,
    ConversationHead,
} from '@/lib/conversations';
import { getCurrentUserId } from '@/lib/auth';

export function MessagesDropdown() {
    const router = useRouter();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setCurrentUserId(getCurrentUserId());
    }, []);

    // Fetch unread count
    const { data: unreadCount = 0 } = useQuery({
        queryKey: ['messages-count', currentUserId],
        queryFn: () => getUnreadMessagesCount(currentUserId!),
        enabled: !!currentUserId && isClient,
        refetchInterval: 30000, // Poll every 30 seconds
    });

    // Fetch conversations when popover is opened
    const { data: conversations = [], isLoading } = useQuery({
        queryKey: ['conversations', currentUserId],
        queryFn: () => getConversations(currentUserId!),
        enabled: !!currentUserId && isOpen,
    });

    const getTimeAgo = (dateString: string): string => {
        const normalizedDateString = dateString.replace(' ', 'T');
        const date = new Date(normalizedDateString);

        if (isNaN(date.getTime())) {
            return 'recently';
        }

        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    const getDisplayName = (conversation: ConversationHead): string => {
        const otherParticipants = conversation.participants?.filter(
            p => p.id !== currentUserId
        ) || [];

        if (otherParticipants.length === 0) {
            return 'Conversation';
        }

        return otherParticipants
            .map(p =>
                (p as any).fullName ||
                p.profile?.fullName ||
                `${p.profile?.firstName || ''} ${p.profile?.lastName || ''}`.trim() ||
                p.email ||
                'Unknown'
            )
            .join(', ');
    };

    if (!isClient || !currentUserId) {
        return null;
    }

    // Split conversations into unread and read
    const unreadConversations = conversations.filter(c => c.unread > 0);
    const readConversations = conversations.filter(c => c.unread === 0);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    };

    const handleConversationClick = (conversationId: string) => {
        setIsOpen(false);
        router.push(`/messages/${conversationId}`);
    };

    const renderConversation = (conversation: ConversationHead) => {
        const otherParticipants =
            conversation.participants?.filter(
                p => p.id !== currentUserId
            ) || [];

        const displayName = getDisplayName(conversation);

        const initials =
            displayName
                .split(' ')
                .map(part => part.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2) || '?';

        const firstParticipant = otherParticipants[0];
        const hasPhoto =
            (firstParticipant as any)?.photo ||
            firstParticipant?.profile?.photo;

        return (
            <button
                key={conversation.id}
                type="button"
                className={`messages-item ${
                    conversation.unread > 0
                        ? 'messages-item--unread'
                        : ''
                }`}
                onClick={() =>
                    handleConversationClick(conversation.id)
                }
            >
                <div className="messages-item-avatar">
                    {hasPhoto ? (
                        <img
                            src={hasPhoto}
                            alt={displayName}
                            className="messages-item-avatar-img"
                        />
                    ) : (
                        <div className="messages-item-avatar-placeholder">
                            {initials}
                        </div>
                    )}
                </div>
                <div className="messages-item-content">
                    <h4 className="messages-item-name">
                        {displayName}
                    </h4>
                    <p className="messages-item-preview">
                        {conversation.lastMessage}
                    </p>
                    <span className="messages-item-time">
                        {getTimeAgo(conversation.updatedAt)}
                    </span>
                </div>
                {conversation.unread > 0 && (
                    <span className="messages-item-badge">
                        {conversation.unread}
                    </span>
                )}
            </button>
        );
    };

    return (
        <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    className="messages-button"
                    aria-label="Messages"
                >
                    <span className="messages-icon">💬</span>
                    {unreadCount > 0 && (
                        <span className="messages-badge">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    className="messages-dropdown-menu"
                    align="end"
                    sideOffset={8}
                >
                    <div className="messages-dropdown-header">
                        <h3 className="messages-dropdown-title">Messages</h3>
                    </div>

                    {isLoading ? (
                        <div className="messages-list">
                            <div className="messages-loading">Loading...</div>
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="messages-list">
                            <div className="messages-empty">No messages</div>
                        </div>
                    ) : (
                        <Tabs.Root defaultValue="unread" className="messages-tabs">
                            <Tabs.List className="messages-tabs-list">
                                <Tabs.Trigger value="unread" className="messages-tab-trigger">
                                    Unread
                                    {unreadConversations.length > 0 && (
                                        <span className="messages-tab-badge">
                                            {unreadConversations.length}
                                        </span>
                                    )}
                                </Tabs.Trigger>
                                <Tabs.Trigger value="read" className="messages-tab-trigger">
                                    Read
                                </Tabs.Trigger>
                            </Tabs.List>

                            <Tabs.Content value="unread" className="messages-tab-content">
                                <div className="messages-list">
                                    {unreadConversations.length === 0 ? (
                                        <div className="messages-empty">No unread messages</div>
                                    ) : (
                                        unreadConversations.slice(0, 5).map(renderConversation)
                                    )}
                                </div>
                            </Tabs.Content>

                            <Tabs.Content value="read" className="messages-tab-content">
                                <div className="messages-list">
                                    {readConversations.length === 0 ? (
                                        <div className="messages-empty">No read messages</div>
                                    ) : (
                                        readConversations.slice(0, 5).map(renderConversation)
                                    )}
                                </div>
                            </Tabs.Content>
                        </Tabs.Root>
                    )}

                    {conversations.length > 0 && (
                        <>
                            <div className="messages-dropdown-separator" />

                            <div className="messages-dropdown-footer">
                                <Popover.Close asChild>
                                    <Link
                                        href="/messages"
                                        className="messages-view-all"
                                    >
                                        View all messages
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
