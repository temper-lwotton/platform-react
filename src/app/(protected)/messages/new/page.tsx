'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, User } from '@/lib/users';
import { startConversation } from '@/lib/conversations';
import { getCurrentUserId } from '@/lib/auth';

function useCurrentUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return getCurrentUserId();
}

export default function NewConversationPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const currentUserId = useCurrentUserId();
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
    });

    const createMutation = useMutation({
        mutationFn: () =>
            startConversation({
                content: message,
                sender: currentUserId!,
                recipients: selectedUsers.map(u => u.id),
            }),
        onSuccess: (response) => {
            // The API returns the created message, which has a conversation field
            // Use conversation ID if available, otherwise fall back to id
            const conversationId = response.conversation || response.id;
            // Invalidate the conversations list so it shows the new conversation
            queryClient.invalidateQueries({ queryKey: ['conversations', currentUserId] });
            router.push(`/messages/${conversationId}`);
        },
    });

    const filteredUsers = users?.filter(user => {
        if (user.id === currentUserId) return false;
        if (selectedUsers.some(s => s.id === user.id)) return false;

        const name = user.profile?.fullName ||
            `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() ||
            user.email;

        return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
    }) || [];

    const handleUserSelect = (user: User) => {
        setSelectedUsers(prev => [...prev, user]);
        setSearchQuery('');
    };

    const handleUserRemove = (userId: string) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== userId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUsers.length > 0 && message.trim()) {
            createMutation.mutate();
        }
    };

    const getDisplayName = (user: User) =>
        user.profile?.fullName ||
        `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() ||
        user.email;

    if (!currentUserId) {
        return (
            <div className="messages-error">
                <p>Please log in to start a conversation</p>
            </div>
        );
    }

    return (
        <div className="new-conversation">
            <h2 className="new-conversation-title">New Message</h2>

            <form onSubmit={handleSubmit} className="new-conversation-form">
                <div className="new-conversation-recipients">
                    <label className="new-conversation-label">To:</label>
                    <div className="new-conversation-recipients-input">
                        {selectedUsers.map(user => (
                            <span key={user.id} className="new-conversation-recipient-tag">
                                {getDisplayName(user)}
                                <button
                                    type="button"
                                    onClick={() => handleUserRemove(user.id)}
                                    className="new-conversation-recipient-remove"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={selectedUsers.length === 0 ? 'Search for people...' : ''}
                            className="new-conversation-search"
                        />
                    </div>
                </div>

                {searchQuery && filteredUsers.length > 0 && (
                    <ul className="new-conversation-suggestions">
                        {filteredUsers.slice(0, 5).map(user => (
                            <li key={user.id}>
                                <button
                                    type="button"
                                    className="new-conversation-suggestion"
                                    onClick={() => handleUserSelect(user)}
                                >
                                    {user.profile?.photo ? (
                                        <img
                                            src={user.profile.photo}
                                            alt={getDisplayName(user)}
                                            className="new-conversation-suggestion-avatar"
                                        />
                                    ) : (
                                        <div className="new-conversation-suggestion-avatar new-conversation-suggestion-avatar--placeholder">
                                            {getDisplayName(user).charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="new-conversation-suggestion-info">
                                        <span className="new-conversation-suggestion-name">
                                            {getDisplayName(user)}
                                        </span>
                                        <span className="new-conversation-suggestion-email">
                                            {user.email}
                                        </span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="new-conversation-message">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message..."
                        className="new-conversation-textarea"
                        rows={4}
                    />
                </div>

                <button
                    type="submit"
                    className="new-conversation-submit"
                    disabled={selectedUsers.length === 0 || !message.trim() || createMutation.isPending}
                >
                    {createMutation.isPending ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    );
}
