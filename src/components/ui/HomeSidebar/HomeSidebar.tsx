'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import * as Separator from '@radix-ui/react-separator';
import { getSpace } from '@/lib/spaces';
import { getCurrentUserId, fetchCurrentUser } from '@/lib/auth';
import { Icon } from '../Icon';
import { SpaceSettingsPopover } from '../SpaceSettingsPopover';
import { useJobForgeStats } from '@/lib/jobforge/hooks';
import styles from './HomeSidebar.module.scss';

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

  // Get JobForge stats for badges
  const { stats: jobForgeStats } = useJobForgeStats();

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
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {/* Feed Link */}
        <Link
          href="/feed"
          className={`${styles.link} ${isActive('/feed') ? styles.linkActive : ''}`}
        >
          <Icon icon="feed" size={18} className={styles.linkIcon} />
          <span className={styles.linkText}>Feed</span>
        </Link>

          {/* Suggestions Link */}
          <Link
              href="/suggestions"
              className={`${styles.link} ${isActive('/suggestions') ? styles.linkActive : ''}`}
          >
              <Icon icon="sparkles" size={18} className={styles.linkIcon} />
              <span className={styles.linkText}>Suggestions</span>
          </Link>
        {/* Tasks Link */}
        <Link
          href="/tasks"
          className={`${styles.link} ${isActive('/tasks') ? styles.linkActive : ''}`}
        >
          <Icon icon="clipboard" size={18} className={styles.linkIcon} />
          <span className={styles.linkText}>Tasks</span>
        </Link>

        {/* Calendar Link */}
        <Link
          href="/calendar"
          className={`${styles.link} ${isActive('/calendar') ? styles.linkActive : ''}`}
        >
          <Icon icon="calendar" size={18} className={styles.linkIcon} />
          <span className={styles.linkText}>Calendar</span>
        </Link>

        {/* JobForge Link */}
        <Link
          href="/jobforge"
          className={`${styles.link} ${pathname?.startsWith('/jobforge') ? styles.linkActive : ''}`}
        >
          <Icon icon="briefcase" size={18} className={styles.linkIcon} />
          <span className={styles.linkText}>JobForge</span>
          {jobForgeStats.draftsCount > 0 && (
            <span className={styles.activityBadge}>
              {jobForgeStats.draftsCount}
            </span>
          )}
        </Link>

        {/* Open Calls Link */}
        <Link
          href="/open-calls"
          className={`${styles.link} ${pathname?.startsWith('/open-calls') ? styles.linkActive : ''}`}
        >
          <Icon icon="megaphone" size={18} className={styles.linkIcon} />
          <span className={styles.linkText}>Open Calls</span>
        </Link>

        <Separator.Root className={styles.separator} />

        {/* My Spaces Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>My Spaces</h3>
          <div className={styles.sectionContent}>
            {spacesLoading ? (
              <p className={styles.empty}>Loading spaces...</p>
            ) : mySpaces.length === 0 ? (
              <p className={styles.empty}>No spaces yet</p>
            ) : (
              <>
                {mySpaces.slice(0, 10).map((space) => {
                  const activityCount = getSpaceActivityCount(space.id);
                  return (
                    <div key={space.id} className={styles.spaceItem}>
                      <Link
                        href={`/spaces/${space.id}`}
                        className={`${styles.link} ${styles.linkSecondary} ${
                          pathname === `/spaces/${space.id}` ? styles.linkActive : ''
                        }`}
                      >
                        <span className={styles.spaceIcon}>
                          {space.title.charAt(0).toUpperCase()}
                        </span>
                        <span className={styles.linkText}>{space.title}</span>
                        {activityCount > 0 && (
                          <span className={styles.activityBadge}>
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
                  className={`${styles.link} ${styles.linkTertiary}`}
                >
                  <span className={styles.linkText}>View all spaces →</span>
                </Link>
              </>
            )}
          </div>
        </div>

        <Separator.Root className={styles.separator} />

        {/* Resources Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Resources</h3>
          <div className={styles.sectionContent}>
            <Link
              href="/getting-started"
              className={`${styles.link} ${styles.linkSecondary} ${
                isActive('/getting-started') ? styles.linkActive : ''
              }`}
            >
              <Icon icon="rocket" size={18} className={styles.linkIcon} />
              <span className={styles.linkText}>Getting Started</span>
            </Link>
            <Link
              href="/help"
              className={`${styles.link} ${styles.linkSecondary} ${
                isActive('/help') ? styles.linkActive : ''
              }`}
            >
              <Icon icon="help" size={18} className={styles.linkIcon} />
              <span className={styles.linkText}>Help Center</span>
            </Link>
            <Link
              href="/community-guidelines"
              className={`${styles.link} ${styles.linkSecondary} ${
                isActive('/community-guidelines') ? styles.linkActive : ''
              }`}
            >
              <Icon icon="clipboard" size={18} className={styles.linkIcon} />
              <span className={styles.linkText}>Community Guidelines</span>
            </Link>
            <Link
              href="/feedback"
              className={`${styles.link} ${styles.linkSecondary} ${
                isActive('/feedback') ? styles.linkActive : ''
              }`}
            >
              <Icon icon="comment" size={18} className={styles.linkIcon} />
              <span className={styles.linkText}>Give Feedback</span>
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
}
