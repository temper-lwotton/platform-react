'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConversation, replyToConversation, deleteMessage } from '@/lib/conversations';
import { MessageThread } from '@/components/ui/MessageThread';
import { MessageInput } from '@/components/ui/MessageInput';
import { getCurrentUserId } from '@/lib/auth';

function useCurrentUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return getCurrentUserId();
}

export default function ConversationPage() {
    const params = useParams();
    const conversationId = params.conversationId as string;
    const currentUserId = useCurrentUserId();
    const queryClient = useQueryClient();

    const { data: conversation, isLoading, error } = useQuery({
        queryKey: ['conversation', currentUserId, conversationId],
        queryFn: () => getConversation(currentUserId!, conversationId),
        enabled: !!currentUserId && !!conversationId,
        refetchInterval: 10000, // Poll every 10 seconds for new messages
    });

    const sendMutation = useMutation({
        mutationFn: ({ content, attachments }: { content: string; attachments?: File[] }) =>
            replyToConversation(
                conversationId,
                { content, sender: currentUserId! },
                attachments
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversation', currentUserId, conversationId] });
            queryClient.invalidateQueries({ queryKey: ['conversations', currentUserId] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (messageId: string) =>
            deleteMessage(currentUserId!, conversationId, messageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversation', currentUserId, conversationId] });
        },
    });

    const handleSend = (content: string, attachments?: File[]) => {
        sendMutation.mutate({ content, attachments });
    };

    const handleDelete = (messageId: string) => {
        if (confirm('Are you sure you want to delete this message?')) {
            deleteMutation.mutate(messageId);
        }
    };

    if (!currentUserId) {
        return (
            <div className="messages-error">
                <p>Please log in to view messages</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="messages-loading">
                <p>Loading conversation...</p>
            </div>
        );
    }

    if (error || !conversation) {
        return (
            <div className="messages-error">
                <p>Error loading conversation</p>
            </div>
        );
    }

    return (
        <div className="conversation-view">
            <MessageThread
                messages={conversation.messages}
                participants={conversation.participants}
                currentUserId={currentUserId}
                onDeleteMessage={handleDelete}
            />
            <MessageInput
                onSend={handleSend}
                disabled={sendMutation.isPending}
                placeholder="Type a message..."
            />
        </div>
    );
}
