'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConversationHead } from '@/lib/conversations';

interface ConversationListProps {
    conversations: ConversationHead[];
    currentUserId: string;
}

export function ConversationList({ conversations, currentUserId }: ConversationListProps) {
    const pathname = usePathname();

    if (conversations.length === 0) {
        return (
            <div className="conversation-list-empty">
                <p>No conversations yet</p>
                <p className="conversation-list-empty-hint">Start a new conversation to begin messaging</p>
            </div>
        );
    }

    return (
        <ul className="conversation-list">
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
                            className={`conversation-list-item ${isActive ? 'conversation-list-item--active' : ''} ${conversation.unread > 0 ? 'conversation-list-item--unread' : ''}`}
                        >
                            {((firstParticipant as any)?.photo || firstParticipant?.profile?.photo) ? (
                                <img
                                    src={(firstParticipant as any)?.photo || firstParticipant?.profile?.photo}
                                    alt={displayName}
                                    className="conversation-list-avatar"
                                />
                            ) : (
                                <div className="conversation-list-avatar conversation-list-avatar--placeholder">
                                    {initials}
                                </div>
                            )}
                            <div className="conversation-list-content">
                                <div className="conversation-list-header">
                                    <span className="conversation-list-name">{displayName}</span>
                                    <span className="conversation-list-time">{formattedTime}</span>
                                </div>
                                <div className="conversation-list-preview">
                                    <span className="conversation-list-message">
                                        {conversation.lastMessage || 'No messages yet'}
                                    </span>
                                    {conversation.unread > 0 && (
                                        <span className="conversation-list-badge">
                                            {conversation.unread}
                                        </span>
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

function formatRelativeTime(dateString: string): string {
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
}
