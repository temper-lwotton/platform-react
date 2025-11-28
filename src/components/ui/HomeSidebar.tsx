'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import * as Separator from '@radix-ui/react-separator';
import { getSpace, Space } from '@/lib/spaces';
import { getCurrentUserId, fetchCurrentUser } from '@/lib/auth';
import { Icon } from './Icon';
import { SpaceSettingsPopover } from './SpaceSettingsPopover';

export function HomeSidebar() {
    const pathname = usePathname();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setCurrentUserId(getCurrentUserId());
    }, []);

    // Fetch current user with their spaces
    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['current-user'],
        queryFn: fetchCurrentUser,
        enabled: isClient && !!currentUserId,
    });

    // Get space IDs from user data
    const userSpaceIds = userData
        ? [...userData.adminSpaces, ...userData.memberSpaces].map(s => String(s.id))
        : [];

    // Fetch full details for each space
    const spaceQueries = useQuery({
        queryKey: ['user-spaces', userSpaceIds],
        queryFn: async () => {
            if (userSpaceIds.length === 0) return [];
            const spaces = await Promise.all(
                userSpaceIds.map(id => getSpace(id))
            );
            return spaces;
        },
        enabled: userSpaceIds.length > 0,
    });

    const mySpaces = spaceQueries.data || [];
    const spacesLoading = userLoading || spaceQueries.isLoading;

    // Mock function to generate activity count - replace with real API call later
    const getSpaceActivityCount = (spaceId: string | number): number => {
        // Generate consistent mock data based on space ID
        const idString = String(spaceId);
        const hash = idString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const count = hash % 15; // Random count between 0-14
        return count > 2 ? count : 0; // Only show badge if count > 2
    };

    if (!isClient) return null;

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="home-sidebar">
            <nav className="home-sidebar-nav">
                {/* Feed Link */}
                <Link
                    href="/feed"
                    className={`home-sidebar-link ${isActive('/feed') ? 'home-sidebar-link--active' : ''}`}
                >
                    <Icon icon="feed" size={18} className="home-sidebar-link-icon" />
                    <span className="home-sidebar-link-text">Feed</span>
                </Link>

                {/* Tasks Link */}
                <Link
                    href="/tasks"
                    className={`home-sidebar-link ${isActive('/tasks') ? 'home-sidebar-link--active' : ''}`}
                >
                    <Icon icon="clipboard" size={18} className="home-sidebar-link-icon" />
                    <span className="home-sidebar-link-text">Tasks</span>
                </Link>

                <Separator.Root className="home-sidebar-separator" />

                {/* My Spaces Section */}
                <div className="home-sidebar-section">
                    <h3 className="home-sidebar-section-title">My Spaces</h3>
                    <div className="home-sidebar-section-content">
                        {spacesLoading ? (
                            <p className="home-sidebar-empty">Loading spaces...</p>
                        ) : mySpaces.length === 0 ? (
                            <p className="home-sidebar-empty">No spaces yet</p>
                        ) : (
                            <>
                                {mySpaces.slice(0, 10).map((space) => {
                                    const activityCount = getSpaceActivityCount(space.id);
                                    return (
                                        <div key={space.id} className="home-sidebar-space-item">
                                            <Link
                                                href={`/spaces/${space.id}`}
                                                className={`home-sidebar-link home-sidebar-link--secondary ${
                                                    pathname === `/spaces/${space.id}` ? 'home-sidebar-link--active' : ''
                                                }`}
                                            >
                                                <span className="home-sidebar-space-icon">
                                                    {space.title.charAt(0).toUpperCase()}
                                                </span>
                                                <span className="home-sidebar-link-text">{space.title}</span>
                                                {activityCount > 0 && (
                                                    <span className="home-sidebar-activity-badge">
                                                        {activityCount}
                                                    </span>
                                                )}
                                            </Link>
                                            <SpaceSettingsPopover
                                                spaceId={space.id}
                                                spaceName={space.title}
                                            />
                                        </div>
                                    );
                                })}
                                <Link
                                    href="/spaces"
                                    className="home-sidebar-link home-sidebar-link--tertiary"
                                >
                                    <span className="home-sidebar-link-text">View all spaces →</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <Separator.Root className="home-sidebar-separator" />

                {/* Resources Section */}
                <div className="home-sidebar-section">
                    <h3 className="home-sidebar-section-title">Resources</h3>
                    <div className="home-sidebar-section-content">
                        <Link
                            href="/getting-started"
                            className={`home-sidebar-link home-sidebar-link--secondary ${
                                isActive('/getting-started') ? 'home-sidebar-link--active' : ''
                            }`}
                        >
                            <Icon icon="rocket" size={18} className="home-sidebar-link-icon" />
                            <span className="home-sidebar-link-text">Getting Started</span>
                        </Link>
                        <Link
                            href="/help"
                            className={`home-sidebar-link home-sidebar-link--secondary ${
                                isActive('/help') ? 'home-sidebar-link--active' : ''
                            }`}
                        >
                            <Icon icon="help" size={18} className="home-sidebar-link-icon" />
                            <span className="home-sidebar-link-text">Help Center</span>
                        </Link>
                        <Link
                            href="/community-guidelines"
                            className={`home-sidebar-link home-sidebar-link--secondary ${
                                isActive('/community-guidelines') ? 'home-sidebar-link--active' : ''
                            }`}
                        >
                            <Icon icon="clipboard" size={18} className="home-sidebar-link-icon" />
                            <span className="home-sidebar-link-text">Community Guidelines</span>
                        </Link>
                        <Link
                            href="/feedback"
                            className={`home-sidebar-link home-sidebar-link--secondary ${
                                isActive('/feedback') ? 'home-sidebar-link--active' : ''
                            }`}
                        >
                            <Icon icon="comment" size={18} className="home-sidebar-link-icon" />
                            <span className="home-sidebar-link-text">Give Feedback</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </aside>
    );
}
