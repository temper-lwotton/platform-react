'use client';

import { useQuery } from '@tanstack/react-query';
import { getConversations } from '@/lib/conversations';
import { ConversationList } from '@/components/ui/ConversationList';
import { getCurrentUserId } from '@/lib/auth';
import Link from 'next/link';

function useCurrentUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return getCurrentUserId();
}

export default function MessagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const currentUserId = useCurrentUserId();

    const { data: conversations, isLoading } = useQuery({
        queryKey: ['conversations', currentUserId],
        queryFn: () => getConversations(currentUserId!),
        enabled: !!currentUserId,
    });

    if (!currentUserId) {
        return (
            <div className="messages-layout">
                <div className="messages-auth-required">
                    <p>Please log in to view messages</p>
                    <Link href="/login" className="messages-login-link">Go to login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="messages-layout">
            <aside className="messages-sidebar">
                <div className="messages-sidebar-header">
                    <h1 className="messages-sidebar-title">Messages</h1>
                    <Link href="/messages/new" className="messages-new-button">
                        New
                    </Link>
                </div>
                {isLoading ? (
                    <div className="messages-sidebar-loading">Loading...</div>
                ) : (
                    <ConversationList
                        conversations={conversations || []}
                        currentUserId={currentUserId}
                    />
                )}
            </aside>
            <main className="messages-content">
                {children}
            </main>
        </div>
    );
}
