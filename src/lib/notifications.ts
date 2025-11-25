import { apiFetch } from './api-client';
import { User } from './users';

export type NotificationType =
    | 'comment_reply'
    | 'discussion_like'
    | 'new_discussion'
    | 'mention'
    | 'space_invite';

export interface NotificationPayload {
    comment_id?: number;
    discussion_id?: number;
    space_id?: number;
    message?: string;
}

export interface Notification {
    id: number;
    type: NotificationType;
    payload: NotificationPayload;
    createdAt: string;
    readAt: string | null;
    recipient: User;
    actor: User;
}

export interface NotificationPreferences {
    emailNotifications: boolean;
    pushNotifications: boolean;
    commentReplies: boolean;
    mentions: boolean;
    discussionLikes: boolean;
}

// Get all notifications for a user
export function getNotifications(userId: string): Promise<Notification[]> {
    return apiFetch<Notification[]>(`/api/notifications/${userId}`);
}

// Get unread notification count
export function getUnreadCount(userId: string): Promise<number> {
    return apiFetch<number>(`/api/notifications/${userId}/count`);
}

// Mark a single notification as read
export function markAsRead(notificationId: number): Promise<void> {
    return apiFetch<void>(`/api/notifications/${notificationId}/mark-read`, {
        method: 'POST',
        body: JSON.stringify({}),
    });
}

// Mark all notifications as read
export function markAllAsRead(userId: string): Promise<void> {
    return apiFetch<void>(`/api/notifications/${userId}/mark-all-read`, {
        method: 'POST',
    });
}

// Get notification preferences
export function getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    return apiFetch<NotificationPreferences>(`/api/notifications/${userId}/preferences`);
}

// Helper function to get notification title
export function getNotificationTitle(notification: Notification): string {
    switch (notification.type) {
        case 'comment_reply':
            return 'New reply';
        case 'discussion_like':
            return 'Discussion liked';
        case 'new_discussion':
            return 'New discussion';
        case 'mention':
            return 'You were mentioned';
        case 'space_invite':
            return 'Space invitation';
        default:
            return 'Notification';
    }
}

// Helper function to get notification text (body)
export function getNotificationText(notification: Notification): string {
    const actorName = notification.actor?.profile?.fullName ||
        notification.actor?.profile?.firstName ||
        notification.actor?.email ||
        'Someone';

    switch (notification.type) {
        case 'comment_reply':
            return `${actorName} replied to your comment`;
        case 'discussion_like':
            return `${actorName} liked your discussion`;
        case 'new_discussion':
            return `${actorName} created a new discussion`;
        case 'mention':
            return `${actorName} mentioned you in a discussion`;
        case 'space_invite':
            return `${actorName} invited you to join a space`;
        default:
            return 'New notification';
    }
}

// Helper function to get notification link
export function getNotificationLink(notification: Notification): string {
    const { payload } = notification;

    if (payload.discussion_id && payload.comment_id) {
        return `/spaces/${payload.space_id || ''}/discussions/${payload.discussion_id}#comment-${payload.comment_id}`;
    }

    if (payload.discussion_id) {
        return `/spaces/${payload.space_id || ''}/discussions/${payload.discussion_id}`;
    }

    if (payload.space_id) {
        return `/spaces/${payload.space_id}`;
    }

    return '#';
}
