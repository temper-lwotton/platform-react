import { apiFetch } from './api-client';
import { User } from './users';

export interface ConversationHead {
    id: string;
    lastMessage: string;
    unread: number;
    updatedAt: string;
    participants: User[];
}

export interface Message {
    id: string;
    lastUpdated: string;
    type: 'user' | 'system';
    conversation: string;
    sender: User;
    content: string;
    attachments?: string[];
}

export interface Conversation {
    id: string;
    participants: User[];
    messages: Message[];
}

export interface MessageDto {
    content: string;
    sender: string;
    recipients?: string[];
    type?: 'user' | 'system';
}

// Get conversation list for a user
export function getConversations(userId: string): Promise<ConversationHead[]> {
    return apiFetch<ConversationHead[]>(`/api/conversations/${userId}`);
}

// Get total unread message count
export async function getUnreadMessagesCount(userId: string): Promise<number> {
    const conversations = await getConversations(userId);
    return conversations.reduce((total, conv) => total + conv.unread, 0);
}

// Get full conversation thread (also marks as read)
export function getConversation(userId: string, conversationId: string): Promise<Conversation> {
    return apiFetch<Conversation>(`/api/conversations/${userId}/${conversationId}`);
}

// Start a new conversation
export async function startConversation(
    data: MessageDto,
    attachments?: File[]
): Promise<Conversation> {
    // Convert IDs to numbers as required by the API
    const payload = {
        content: data.content,
        sender: Number(data.sender),
        recipients: data.recipients?.map(r => Number(r)),
        type: data.type || 'user',
    };

    if (attachments && attachments.length > 0) {
        const formData = new FormData();
        formData.append('content', payload.content);
        formData.append('sender', String(payload.sender));
        if (payload.recipients) {
            payload.recipients.forEach((r, i) => formData.append(`recipients[${i}]`, String(r)));
        }
        formData.append('type', payload.type);
        attachments.forEach(file => formData.append('attachments', file));

        const token = localStorage.getItem('jwt_token');
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

        const res = await fetch(`${API_BASE_URL}/api/conversations`, {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: formData,
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API error ${res.status}: ${text}`);
        }

        return res.json();
    }

    return apiFetch<Conversation>('/api/conversations', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

// Reply to a conversation
export async function replyToConversation(
    conversationId: string,
    data: Omit<MessageDto, 'recipients'>,
    attachments?: File[]
): Promise<Message> {
    // Convert sender ID to number as required by the API
    const payload = {
        content: data.content,
        sender: Number(data.sender),
        type: data.type || 'user',
    };

    if (attachments && attachments.length > 0) {
        const formData = new FormData();
        formData.append('content', payload.content);
        formData.append('sender', String(payload.sender));
        formData.append('type', payload.type);
        attachments.forEach(file => formData.append('attachments', file));

        const token = localStorage.getItem('jwt_token');
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

        const res = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}`, {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: formData,
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API error ${res.status}: ${text}`);
        }

        return res.json();
    }

    return apiFetch<Message>(`/api/conversations/${conversationId}`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

// Delete a message (sender only)
export function deleteMessage(
    userId: string,
    conversationId: string,
    messageId: string
): Promise<void> {
    return apiFetch<void>(`/api/conversations/${userId}/${conversationId}/${messageId}`, {
        method: 'DELETE',
    });
}

// Typing indicator types
export interface TypingUser {
    id: number;
    fullName: string;
    timestamp: number;
}

export interface TypingUsersResponse {
    typingUsers: TypingUser[];
}

// Get users currently typing in a conversation
export async function getTypingUsers(
    conversationId: string,
    excludeUserId: string
): Promise<TypingUser[]> {
    const response = await apiFetch<TypingUsersResponse>(
        `/api/conversations/typing/${conversationId}?excludeUserId=${excludeUserId}`
    );
    return response.typingUsers;
}
