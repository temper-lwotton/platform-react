'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { TabbedDropdown, TabbedDropdownTab } from '../primitives';
import { NotificationItem } from './NotificationItem';

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

        if (link !== '#') {
            router.push(link);
        }
    };

    const handleMarkAllRead = () => {
        markAllReadMutation.mutate();
    };

    if (!isClient || !currentUserId) return null;

    // Split notifications into tabs
    const inboxNotifications = notifications.filter(n => !n.readAt).slice(0, 5);
    const mentionNotifications = notifications.filter(n => n.type === 'mention').slice(0, 5);
    const archivedNotifications = notifications.filter(n => n.readAt).slice(0, 5);

    const tabs: TabbedDropdownTab<Notification>[] = [
        {
            id: 'inbox',
            label: 'Inbox',
            count: notifications.filter(n => !n.readAt).length,
            items: inboxNotifications,
        },
        {
            id: 'mentions',
            label: 'Mentions',
            count: notifications.filter(n => n.type === 'mention').length,
            items: mentionNotifications,
        },
        {
            id: 'archived',
            label: 'Archived',
            items: archivedNotifications,
        },
    ];

    return (
        <TabbedDropdown<Notification>
            icon="bell"
            badgeCount={unreadCount}
            ariaLabel="Notifications"
            title="Notifications"
            headerAction={
                unreadCount > 0
                    ? {
                          label: 'Mark all read',
                          onClick: handleMarkAllRead,
                          disabled: markAllReadMutation.isPending,
                      }
                    : undefined
            }
            tabs={tabs}
            defaultTab="inbox"
            renderItem={(notification) => (
                <NotificationItem
                    notification={notification}
                    title={getNotificationTitle(notification)}
                    text={getNotificationText(notification)}
                />
            )}
            isLoading={isLoading}
            emptyMessage="No notifications"
            viewAllLink="/notifications"
            viewAllLabel="View all notifications"
            onItemClick={handleNotificationClick}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
        />
    );
}
