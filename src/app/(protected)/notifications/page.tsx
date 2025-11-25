'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    getNotificationTitle,
    getNotificationText,
    getNotificationLink,
    Notification,
} from '@/lib/notifications';
import { getCurrentUserId } from '@/lib/auth';

export default function NotificationsPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'unread' | 'all'>('unread');

    useEffect(() => {
        setCurrentUserId(getCurrentUserId());
    }, []);

    // Fetch all notifications
    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications', currentUserId],
        queryFn: () => getNotifications(currentUserId!),
        enabled: !!currentUserId,
    });

    // Mark single notification as read
    const markReadMutation = useMutation({
        mutationFn: (notificationId: number) => markAsRead(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', currentUserId] });
            queryClient.invalidateQueries({ queryKey: ['notifications-count', currentUserId] });
        },
    });

    // Mark all as read
    const markAllReadMutation = useMutation({
        mutationFn: () => markAllAsRead(currentUserId!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', currentUserId] });
            queryClient.invalidateQueries({ queryKey: ['notifications-count', currentUserId] });
        },
    });

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.readAt) {
            markReadMutation.mutate(notification.id);
        }
        const link = getNotificationLink(notification);
        if (link !== '#') {
            router.push(link);
        }
    };

    const handleMarkAsRead = (notificationId: number, event: React.MouseEvent) => {
        event.stopPropagation();
        markReadMutation.mutate(notificationId);
    };

    const handleMarkAllRead = () => {
        markAllReadMutation.mutate();
    };

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

    // Filter notifications based on active tab
    const filteredNotifications = activeTab === 'unread'
        ? notifications.filter(n => !n.readAt)
        : notifications;

    const unreadCount = notifications.filter(n => !n.readAt).length;

    if (!currentUserId) {
        return (
            <div className="notifications-page">
                <p className="notifications-error">Please log in to view notifications</p>
            </div>
        );
    }

    return (
        <div className="notifications-page">
            <div className="notifications-page-header">
                <h1 className="notifications-page-title">Notifications</h1>
                {unreadCount > 0 && (
                    <button
                        type="button"
                        className="notifications-mark-all-read"
                        onClick={handleMarkAllRead}
                        disabled={markAllReadMutation.isPending}
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="notifications-tabs">
                <button
                    type="button"
                    className={`notifications-tab ${activeTab === 'unread' ? 'notifications-tab--active' : ''}`}
                    onClick={() => setActiveTab('unread')}
                >
                    Unread
                    {unreadCount > 0 && (
                        <span className="notifications-tab-badge">{unreadCount}</span>
                    )}
                </button>
                <button
                    type="button"
                    className={`notifications-tab ${activeTab === 'all' ? 'notifications-tab--active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All
                </button>
            </div>

            <div className="notifications-content">
                {isLoading ? (
                    <div className="notifications-loading">Loading notifications...</div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="notifications-empty">
                        {activeTab === 'unread'
                            ? 'No unread notifications'
                            : 'No notifications'}
                    </div>
                ) : (
                    <div className="notifications-list-page">
                        {filteredNotifications.map((notification) => {
                            const actorName = notification.actor?.profile?.fullName ||
                                notification.actor?.profile?.firstName ||
                                notification.actor?.email ||
                                'Someone';
                            const actorInitial = actorName[0]?.toUpperCase() || '?';
                            const hasPhoto = notification.actor?.profile?.photo;

                            return (
                                <div
                                    key={notification.id}
                                    className={`notification-card ${!notification.readAt ? 'notification-card--unread' : ''}`}
                                >
                                    <button
                                        type="button"
                                        className="notification-card-main"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="notification-card-avatar">
                                            {hasPhoto ? (
                                                <img
                                                    src={notification.actor.profile!.photo}
                                                    alt={actorName}
                                                    className="notification-card-avatar-img"
                                                />
                                            ) : (
                                                <div className="notification-card-avatar-placeholder">
                                                    {actorInitial}
                                                </div>
                                            )}
                                        </div>
                                        <div className="notification-card-content">
                                            <h3 className="notification-card-title">
                                                {getNotificationTitle(notification)}
                                            </h3>
                                            <p className="notification-card-text">
                                                {getNotificationText(notification)}
                                            </p>
                                            <span className="notification-card-time">
                                                {getTimeAgo(notification.createdAt)}
                                            </span>
                                        </div>
                                    </button>
                                    {!notification.readAt && (
                                        <button
                                            type="button"
                                            className="notification-card-mark-read"
                                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                                            disabled={markReadMutation.isPending}
                                            title="Mark as read"
                                        >
                                            ✓
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
