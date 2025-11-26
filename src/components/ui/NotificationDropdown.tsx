'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import * as Popover from '@radix-ui/react-popover';
import * as Tabs from '@radix-ui/react-tabs';
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    getNotificationTitle,
    getNotificationText,
    getNotificationLink,
    Notification,
} from '@/lib/notifications';
import { getCurrentUserId } from '@/lib/auth';
import { Icon } from './Icon';

export function NotificationDropdown() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setCurrentUserId(getCurrentUserId());
    }, []);

    // Fetch unread count
    const { data: unreadCount = 0 } = useQuery({
        queryKey: ['notifications-count', currentUserId],
        queryFn: () => getUnreadCount(currentUserId!),
        enabled: !!currentUserId && isClient,
        refetchInterval: 30000,
    });

    // Fetch notifications when popover opens
    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications', currentUserId],
        queryFn: () => getNotifications(currentUserId!),
        enabled: !!currentUserId && isOpen,
    });

    // Mark single notification as read
    const markReadMutation = useMutation({
        mutationFn: (notificationId: number) => markAsRead(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', currentUserId] });
            queryClient.invalidateQueries({ queryKey: ['notifications-count', currentUserId] });
        },
    });

    // Mark all read
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

        // Close the popover before navigation
        setIsOpen(false);

        if (link !== '#') {
            router.push(link);
        }
    };

    const handleMarkAllRead = () => {
        markAllReadMutation.mutate();
    };

    const getTimeAgo = (dateString: string): string => {
        const normalized = dateString.replace(' ', 'T');
        const date = new Date(normalized);
        if (isNaN(date.getTime())) return 'recently';

        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    if (!isClient || !currentUserId) return null;

    // Split notifications into inbox, mentions, and archived
    const inboxNotifications = notifications.filter(n => !n.readAt);
    const mentionNotifications = notifications.filter(n => n.type === 'mention');
    const archivedNotifications = notifications.filter(n => n.readAt);

    const renderNotification = (notification: Notification) => {
        const actorName =
            notification.actor?.profile?.fullName ||
            notification.actor?.profile?.firstName ||
            notification.actor?.email ||
            'Someone';
        const actorInitial = actorName[0]?.toUpperCase() || '?';
        const hasPhoto = notification.actor?.profile?.photo;

        return (
            <button
                key={notification.id}
                className={`notification-item ${
                    !notification.readAt ? 'notification-item--unread' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
            >
                <div className="notification-item-avatar">
                    {hasPhoto ? (
                        <img
                            src={notification.actor.profile!.photo}
                            alt={actorName}
                            className="notification-item-avatar-img"
                        />
                    ) : (
                        <div className="notification-item-avatar-placeholder">
                            {actorInitial}
                        </div>
                    )}
                </div>

                <div className="notification-item-content">
                    <h4 className="notification-item-title">
                        {getNotificationTitle(notification)}
                    </h4>

                    <p className="notification-item-text">
                        {getNotificationText(notification)}
                    </p>

                    <span className="notification-item-time">
                        {getTimeAgo(notification.createdAt)}
                    </span>
                </div>

                {!notification.readAt && (
                    <span className="notification-item-dot" />
                )}
            </button>
        );
    };

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    className="notification-button"
                    aria-label="Notifications"
                >
                    <Icon icon="bell" size={20} className="notification-icon" />
                    {unreadCount > 0 && (
                        <span className="notification-badge">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    className="notification-dropdown-menu"
                    align="end"
                    sideOffset={8}
                >
                    <div className="notification-dropdown-header">
                        <span className="notification-dropdown-title">Notifications</span>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                className="notification-mark-all-read"
                                onClick={handleMarkAllRead}
                                disabled={markAllReadMutation.isPending}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="notification-list">
                            <div className="notification-loading">Loading...</div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="notification-list">
                            <div className="notification-empty">No notifications</div>
                        </div>
                    ) : (
                        <Tabs.Root defaultValue="inbox" className="notification-tabs">
                            <Tabs.List className="notification-tabs-list">
                                <Tabs.Trigger value="inbox" className="notification-tab-trigger">
                                    Inbox
                                    {inboxNotifications.length > 0 && (
                                        <span className="notification-tab-badge">
                                            {inboxNotifications.length}
                                        </span>
                                    )}
                                </Tabs.Trigger>
                                <Tabs.Trigger value="mentions" className="notification-tab-trigger">
                                    Mentions
                                    {mentionNotifications.length > 0 && (
                                        <span className="notification-tab-badge">
                                            {mentionNotifications.length}
                                        </span>
                                    )}
                                </Tabs.Trigger>
                                <Tabs.Trigger value="archived" className="notification-tab-trigger">
                                    Archived
                                </Tabs.Trigger>
                            </Tabs.List>

                            <Tabs.Content value="inbox" className="notification-tab-content">
                                <div className="notification-list">
                                    {inboxNotifications.length === 0 ? (
                                        <div className="notification-empty">No unread notifications</div>
                                    ) : (
                                        inboxNotifications.slice(0, 5).map(renderNotification)
                                    )}
                                </div>
                            </Tabs.Content>

                            <Tabs.Content value="mentions" className="notification-tab-content">
                                <div className="notification-list">
                                    {mentionNotifications.length === 0 ? (
                                        <div className="notification-empty">No mentions yet</div>
                                    ) : (
                                        mentionNotifications.slice(0, 5).map(renderNotification)
                                    )}
                                </div>
                            </Tabs.Content>

                            <Tabs.Content value="archived" className="notification-tab-content">
                                <div className="notification-list">
                                    {archivedNotifications.length === 0 ? (
                                        <div className="notification-empty">No archived notifications</div>
                                    ) : (
                                        archivedNotifications.slice(0, 5).map(renderNotification)
                                    )}
                                </div>
                            </Tabs.Content>
                        </Tabs.Root>
                    )}

                    {notifications.length > 0 && (
                        <>
                            <div className="notification-dropdown-separator" />

                            <div className="notification-dropdown-footer">
                                <Popover.Close asChild>
                                    <Link
                                        href="/notifications"
                                        className="notification-view-all"
                                    >
                                        View all notifications
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
