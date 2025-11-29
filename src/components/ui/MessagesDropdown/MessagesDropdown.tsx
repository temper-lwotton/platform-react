'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
    getConversations,
    getUnreadMessagesCount,
    ConversationHead,
} from '@/lib/conversations';
import { getCurrentUserId } from '@/lib/auth';
import { TabbedDropdown, TabbedDropdownTab } from '../primitives';
import { MessageItem } from './MessageItem';

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
        refetchInterval: 30000,
    });

    // Fetch conversations when popover is opened
    const { data: conversations = [], isLoading } = useQuery({
        queryKey: ['conversations', currentUserId],
        queryFn: () => getConversations(currentUserId!),
        enabled: !!currentUserId && isOpen,
    });

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

    const handleConversationClick = (conversation: ConversationHead) => {
        router.push(`/messages/${conversation.id}`);
    };

    if (!isClient || !currentUserId) {
        return null;
    }

    // Split conversations into unread and read
    const unreadConversations = conversations.filter(c => c.unread > 0).slice(0, 5);
    const readConversations = conversations.filter(c => c.unread === 0).slice(0, 5);

    const tabs: TabbedDropdownTab<ConversationHead>[] = [
        {
            id: 'unread',
            label: 'Unread',
            count: conversations.filter(c => c.unread > 0).length,
            items: unreadConversations,
        },
        {
            id: 'read',
            label: 'Read',
            items: readConversations,
        },
    ];

    return (
        <TabbedDropdown<ConversationHead>
            icon="comment"
            badgeCount={unreadCount}
            ariaLabel="Messages"
            title="Messages"
            tabs={tabs}
            defaultTab="unread"
            renderItem={(conversation) => (
                <MessageItem
                    conversation={conversation}
                    displayName={getDisplayName(conversation)}
                    currentUserId={currentUserId}
                />
            )}
            isLoading={isLoading}
            emptyMessage="No messages"
            viewAllLink="/messages"
            viewAllLabel="View all messages"
            onItemClick={handleConversationClick}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
        />
    );
}
