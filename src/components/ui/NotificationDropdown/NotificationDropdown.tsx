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
import { Icon } from '../Icon';
import styles from './NotificationDropdown.module.scss';

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
                className={`${styles.item} ${
                    !notification.readAt ? styles.itemUnread : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
            >
                <div className={styles.itemAvatar}>
                    {hasPhoto ? (
                        <img
                            src={notification.actor.profile!.photo}
                            alt={actorName}
                            className={styles.itemAvatarImg}
                        />
                    ) : (
                        <div className={styles.itemAvatarPlaceholder}>
                            {actorInitial}
                        </div>
                    )}
                </div>

                <div className={styles.itemContent}>
                    <h4 className={styles.itemTitle}>
                        {getNotificationTitle(notification)}
                    </h4>

                    <p className={styles.itemText}>
                        {getNotificationText(notification)}
                    </p>

                    <span className={styles.itemTime}>
                        {getTimeAgo(notification.createdAt)}
                    </span>
                </div>

                {!notification.readAt && (
                    <span className={styles.itemDot} />
                )}
            </button>
        );
    };

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    className={styles.button}
                    aria-label="Notifications"
                >
                    <Icon icon="bell" size={20} className={styles.icon} />
                    {unreadCount > 0 && (
                        <span className={styles.badge}>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    className={styles.dropdownMenu}
                    align="end"
                    sideOffset={8}
                >
                    <div className={styles.dropdownHeader}>
                        <span className={styles.dropdownTitle}>Notifications</span>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                className={styles.markAllRead}
                                onClick={handleMarkAllRead}
                                disabled={markAllReadMutation.isPending}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className={styles.list}>
                            <div className={styles.loading}>Loading...</div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className={styles.list}>
                            <div className={styles.empty}>No notifications</div>
                        </div>
                    ) : (
                        <Tabs.Root defaultValue="inbox" className={styles.tabs}>
                            <Tabs.List className={styles.tabsList}>
                                <Tabs.Trigger value="inbox" className={styles.tabTrigger}>
                                    Inbox
                                    {inboxNotifications.length > 0 && (
                                        <span className={styles.tabBadge}>
                                            {inboxNotifications.length}
                                        </span>
                                    )}
                                </Tabs.Trigger>
                                <Tabs.Trigger value="mentions" className={styles.tabTrigger}>
                                    Mentions
                                    {mentionNotifications.length > 0 && (
                                        <span className={styles.tabBadge}>
                                            {mentionNotifications.length}
                                        </span>
                                    )}
                                </Tabs.Trigger>
                                <Tabs.Trigger value="archived" className={styles.tabTrigger}>
                                    Archived
                                </Tabs.Trigger>
                            </Tabs.List>

                            <Tabs.Content value="inbox" className={styles.tabContent}>
                                <div className={styles.list}>
                                    {inboxNotifications.length === 0 ? (
                                        <div className={styles.empty}>No unread notifications</div>
                                    ) : (
                                        inboxNotifications.slice(0, 5).map(renderNotification)
                                    )}
                                </div>
                            </Tabs.Content>

                            <Tabs.Content value="mentions" className={styles.tabContent}>
                                <div className={styles.list}>
                                    {mentionNotifications.length === 0 ? (
                                        <div className={styles.empty}>No mentions yet</div>
                                    ) : (
                                        mentionNotifications.slice(0, 5).map(renderNotification)
                                    )}
                                </div>
                            </Tabs.Content>

                            <Tabs.Content value="archived" className={styles.tabContent}>
                                <div className={styles.list}>
                                    {archivedNotifications.length === 0 ? (
                                        <div className={styles.empty}>No archived notifications</div>
                                    ) : (
                                        archivedNotifications.slice(0, 5).map(renderNotification)
                                    )}
                                </div>
                            </Tabs.Content>
                        </Tabs.Root>
                    )}

                    {notifications.length > 0 && (
                        <>
                            <div className={styles.dropdownSeparator} />

                            <div className={styles.dropdownFooter}>
                                <Popover.Close asChild>
                                    <Link
                                        href="/notifications"
                                        className={styles.viewAll}
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
