'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConversationHead } from '@/lib/conversations';
import { Avatar, Badge } from '../primitives';
import styles from './ConversationList.module.scss';

interface ConversationListProps {
    conversations: ConversationHead[];
    currentUserId: string;
}

export function ConversationList({ conversations, currentUserId }: ConversationListProps) {
    const pathname = usePathname();

    if (conversations.length === 0) {
        return (
            <div className={styles.empty}>
                <p className={styles.emptyMessage}>No conversations yet</p>
                <p className={styles.emptyHint}>Start a new conversation to begin messaging</p>
            </div>
        );
    }

    const formatRelativeTime = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'now';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <ul className={styles.list}>
            {conversations.map((conversation) => {
                const isActive = pathname === `/messages/${conversation.id}`;
                const otherParticipants = conversation.participants?.filter(
                    p => p.id !== currentUserId
                ) || [];

                const displayName = otherParticipants.length > 0
                    ? otherParticipants.map(p =>
                        (p as any).fullName ||
                        p.profile?.fullName ||
                        `${p.profile?.firstName || ''} ${p.profile?.lastName || ''}`.trim() ||
                        'Unknown'
                    ).join(', ')
                    : 'Conversation';

                const firstParticipant = otherParticipants[0];
                const initials = displayName
                    .split(' ')
                    .map(part => part.charAt(0))
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || '?';

                const formattedTime = formatRelativeTime(conversation.updatedAt);

                return (
                    <li key={conversation.id}>
                        <Link
                            href={`/messages/${conversation.id}`}
                            className={`${styles.item} ${isActive ? styles.active : ''} ${conversation.unread > 0 ? styles.unread : ''}`}
                        >
                            <Avatar
                                src={(firstParticipant as any)?.photo || firstParticipant?.profile?.photo}
                                alt={displayName}
                                fallback={initials}
                                size="md"
                            />
                            <div className={styles.content}>
                                <div className={styles.header}>
                                    <span className={styles.name}>{displayName}</span>
                                    <span className={styles.time}>{formattedTime}</span>
                                </div>
                                <div className={styles.preview}>
                                    <span className={styles.message}>
                                        {conversation.lastMessage || 'No messages yet'}
                                    </span>
                                    {conversation.unread > 0 && (
                                        <Badge variant="primary" size="sm">
                                            {conversation.unread}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
