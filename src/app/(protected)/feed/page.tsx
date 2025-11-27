'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getEvents, Event } from '@/lib/events';
import { EventCard } from '@/components/ui/EventCard';
import { UpcomingEventsSidebar } from '@/components/ui/UpcomingEventsSidebar';
import { UrgentTasksSidebar } from '@/components/ui/UrgentTasksSidebar';
import { DiscussionCard } from '@/components/ui/DiscussionCard';
import { getDiscussions, Discussion } from '@/lib/discussions';
import { getCurrentUserId, fetchCurrentUser } from '@/lib/auth';
import { MOCK_TASKS } from '@/lib/tasks';
import { Icon } from '@/components/ui/Icon';
import { getSpace } from '@/lib/spaces';

type FeedItem = {
  type: 'discussion' | 'event';
  data: Discussion | Event;
  createdAt: string;
};

const ITEMS_PER_PAGE = 10;

export default function FeedPage() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Filter states
  const [selectedSpaces, setSelectedSpaces] = useState<Set<number>>(new Set());
  const [contentType, setContentType] = useState<'all' | 'discussions' | 'events'>('all');
  const [timePeriod, setTimePeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'active'>('newest');

  useEffect(() => {
    setIsClient(true);
    setCurrentUserId(getCurrentUserId());
  }, []);

  // Fetch current user with their accessible spaces
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: fetchCurrentUser,
    enabled: isClient && !!currentUserId,
  });

  // Get accessible space IDs
  const accessibleSpaceIds = useMemo(() => {
    if (!userData) return new Set<number>();
    const spaceIds = [
      ...userData.adminSpaces.map(s => s.id),
      ...userData.memberSpaces.map(s => s.id),
    ];
    return new Set(spaceIds);
  }, [userData]);

  // Fetch discussions with infinite scroll (only after user data is loaded)
  const {
    data: discussionsData,
    fetchNextPage: fetchNextDiscussions,
    hasNextPage: hasNextDiscussions,
    isFetchingNextPage: isFetchingNextDiscussions,
    isLoading: discussionsLoading,
  } = useInfiniteQuery({
    queryKey: ['feed-discussions'],
    queryFn: ({ pageParam = 0 }) =>
      getDiscussions({
        limit: ITEMS_PER_PAGE,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      // If last page has fewer items than the limit, we've reached the end
      if (lastPage.length < ITEMS_PER_PAGE) {
        return undefined;
      }
      // Calculate next offset
      return allPages.reduce((acc, page) => acc + page.length, 0);
    },
    initialPageParam: 0,
    enabled: accessibleSpaceIds.size > 0, // Only fetch when we know accessible spaces
  });

  // Fetch events with infinite scroll (only after user data is loaded)
  const {
    data: eventsData,
    fetchNextPage: fetchNextEvents,
    hasNextPage: hasNextEvents,
    isFetchingNextPage: isFetchingNextEvents,
    isLoading: eventsLoading,
  } = useInfiniteQuery({
    queryKey: ['feed-events'],
    queryFn: ({ pageParam = 0 }) =>
      getEvents({
        limit: ITEMS_PER_PAGE,
        offset: pageParam,
        sort: 'desc',
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < ITEMS_PER_PAGE) {
        return undefined;
      }
      return allPages.reduce((acc, page) => acc + page.length, 0);
    },
    initialPageParam: 0,
    enabled: accessibleSpaceIds.size > 0, // Only fetch when we know accessible spaces
  });

  // Fetch all events for sidebar (without pagination)
  const { data: allEvents } = useQuery<Event[]>({
    queryKey: ['sidebar-events'],
    queryFn: () => getEvents({ sort: 'asc' }),
    enabled: accessibleSpaceIds.size > 0,
  });

  // Get space IDs from user data for filter dropdown
  const userSpaceIds = userData
    ? [...userData.adminSpaces, ...userData.memberSpaces].map(s => String(s.id))
    : [];

  // Fetch full details for each space for filter dropdown
  const { data: userSpaces } = useQuery({
    queryKey: ['feed-user-spaces', userSpaceIds],
    queryFn: async () => {
      if (userSpaceIds.length === 0) return [];
      const spaces = await Promise.all(
        userSpaceIds.map(id => getSpace(id))
      );
      return spaces;
    },
    enabled: userSpaceIds.length > 0,
  });

  const isLoading = userLoading || discussionsLoading || eventsLoading;
  const hasMore = hasNextDiscussions || hasNextEvents;
  const isFetchingMore = isFetchingNextDiscussions || isFetchingNextEvents;

  // Filter handlers
  const toggleSpace = (spaceId: number) => {
    setSelectedSpaces(prev => {
      const newSet = new Set(prev);
      if (newSet.has(spaceId)) {
        newSet.delete(spaceId);
      } else {
        newSet.add(spaceId);
      }
      return newSet;
    });
  };

  const clearSpaceFilters = () => {
    setSelectedSpaces(new Set());
  };

  // Flatten and combine all discussions and events
  const allDiscussions = discussionsData?.pages.flat() ?? [];
  const allEventItems = eventsData?.pages.flat() ?? [];

  // Helper function to extract space ID from discussion or event
  const getSpaceId = (item: Discussion | Event): number | null => {
    if ('space' in item && item.space) {
      const space = item.space as any;
      // For discussions, space can be an object or ID
      if (typeof space === 'object' && 'id' in space) {
        return typeof space.id === 'string' ? parseInt(space.id) : space.id;
      }
    }
    return null;
  };

  // Combine and filter feed items by accessible spaces and filters
  const feedItems = useMemo(() => {
    const items: FeedItem[] = [];

    // Add discussions if content type allows
    if (contentType === 'all' || contentType === 'discussions') {
      allDiscussions.forEach(discussion => {
        const spaceId = getSpaceId(discussion);
        // Only include if from an accessible space
        if (spaceId && accessibleSpaceIds.has(spaceId)) {
          // Filter by selected spaces
          if (selectedSpaces.size === 0 || selectedSpaces.has(spaceId)) {
            items.push({
              type: 'discussion',
              data: discussion,
              createdAt: discussion.createdAt,
            });
          }
        }
      });
    }

    // Add events if content type allows
    if (contentType === 'all' || contentType === 'events') {
      allEventItems.forEach(event => {
        const spaceId = getSpaceId(event);
        // Only include if from an accessible space
        if (spaceId && accessibleSpaceIds.has(spaceId)) {
          // Filter by selected spaces
          if (selectedSpaces.size === 0 || selectedSpaces.has(spaceId)) {
            items.push({
              type: 'event',
              data: event,
              createdAt: event.createdAt,
            });
          }
        }
      });
    }

    // Filter by time period
    const now = new Date();
    const filteredByTime = items.filter(item => {
      const createdDate = new Date(item.createdAt);

      if (timePeriod === 'all') return true;

      if (timePeriod === 'today') {
        return createdDate.toDateString() === now.toDateString();
      }

      if (timePeriod === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdDate >= weekAgo;
      }

      if (timePeriod === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return createdDate >= monthAgo;
      }

      return true;
    });

    // Sort items
    const sorted = [...filteredByTime].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'active') {
        // Sort by reply count for discussions, participant count for events
        const aCount = a.type === 'discussion'
          ? (a.data as Discussion).replyCount || 0
          : (a.data as Event).participantCount || 0;
        const bCount = b.type === 'discussion'
          ? (b.data as Discussion).replyCount || 0
          : (b.data as Event).participantCount || 0;
        return bCount - aCount;
      }
      return 0;
    });

    return sorted;
  }, [allDiscussions, allEventItems, accessibleSpaceIds, selectedSpaces, contentType, timePeriod, sortBy]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting && !isFetchingMore) {
          // Fetch both discussions and events if they have more pages
          if (hasNextDiscussions) {
            fetchNextDiscussions();
          }
          if (hasNextEvents) {
            fetchNextEvents();
          }
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [
    hasMore,
    isFetchingMore,
    isLoading,
    hasNextDiscussions,
    hasNextEvents,
    fetchNextDiscussions,
    fetchNextEvents,
  ]);

  if (isLoading) {
    return (
      <main className="feed-page-container">
        <div className="feed-page-main">
          <div className="feed-loading-container">
            <p className="feed-loading">Loading your feed...</p>
          </div>
        </div>
      </main>
    );
  }

  // If user has no accessible spaces, show a message
  if (accessibleSpaceIds.size === 0) {
    return (
      <main className="feed-page-container">
        <div className="feed-page-main">
          <header className="feed-header">
            <h1 className="feed-title">Feed</h1>
            <p className="feed-subtitle">Stay up to date with your community</p>
          </header>
          <div className="feed-empty">
            <p className="feed-empty-title">No spaces found</p>
            <p className="feed-empty-description">
              Join or create a space to see discussions and events in your feed
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="feed-page-container">
      <div className="feed-page-main">
        <header className="feed-header">
          <h1 className="feed-title">Feed</h1>
          <p className="feed-subtitle">Stay up to date with your community</p>
        </header>

        {/* Filters */}
        <div className="feed-filters">
          <div className="feed-filters-row">
            {/* Space Filter */}
            <div className="feed-filter-group">
              <label className="feed-filter-label">Spaces</label>
              <div className="feed-filter-dropdown-wrapper">
                <button className="feed-filter-dropdown-btn">
                  <Icon icon="filter" size={16} />
                  <span>
                    {selectedSpaces.size === 0
                      ? 'All Spaces'
                      : `${selectedSpaces.size} Selected`}
                  </span>
                  <Icon icon="chevronDown" size={16} />
                </button>
                <div className="feed-filter-dropdown-menu">
                  {selectedSpaces.size > 0 && (
                    <>
                      <button
                        onClick={clearSpaceFilters}
                        className="feed-filter-dropdown-item feed-filter-clear"
                      >
                        Clear filters
                      </button>
                      <div className="feed-filter-dropdown-divider" />
                    </>
                  )}
                  {userSpaces?.map(space => (
                    <label
                      key={space.id}
                      className="feed-filter-dropdown-item feed-filter-checkbox-item"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSpaces.has(Number(space.id))}
                        onChange={() => toggleSpace(Number(space.id))}
                        className="feed-filter-checkbox"
                      />
                      <span className="feed-filter-space-icon">
                        {space.title.charAt(0).toUpperCase()}
                      </span>
                      <span>{space.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Type Filter */}
            <div className="feed-filter-group">
              <label className="feed-filter-label">Type</label>
              <div className="feed-filter-buttons">
                <button
                  onClick={() => setContentType('all')}
                  className={`feed-filter-btn ${contentType === 'all' ? 'feed-filter-btn--active' : ''}`}
                >
                  All
                </button>
                <button
                  onClick={() => setContentType('discussions')}
                  className={`feed-filter-btn ${contentType === 'discussions' ? 'feed-filter-btn--active' : ''}`}
                >
                  <Icon icon="comment" size={14} />
                  Discussions
                </button>
                <button
                  onClick={() => setContentType('events')}
                  className={`feed-filter-btn ${contentType === 'events' ? 'feed-filter-btn--active' : ''}`}
                >
                  <Icon icon="calendar" size={14} />
                  Events
                </button>
              </div>
            </div>

            {/* Time Period Filter */}
            <div className="feed-filter-group">
              <label className="feed-filter-label">Time</label>
              <div className="feed-filter-buttons">
                <button
                  onClick={() => setTimePeriod('all')}
                  className={`feed-filter-btn ${timePeriod === 'all' ? 'feed-filter-btn--active' : ''}`}
                >
                  All Time
                </button>
                <button
                  onClick={() => setTimePeriod('today')}
                  className={`feed-filter-btn ${timePeriod === 'today' ? 'feed-filter-btn--active' : ''}`}
                >
                  Today
                </button>
                <button
                  onClick={() => setTimePeriod('week')}
                  className={`feed-filter-btn ${timePeriod === 'week' ? 'feed-filter-btn--active' : ''}`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setTimePeriod('month')}
                  className={`feed-filter-btn ${timePeriod === 'month' ? 'feed-filter-btn--active' : ''}`}
                >
                  This Month
                </button>
              </div>
            </div>

            {/* Sort By Filter */}
            <div className="feed-filter-group">
              <label className="feed-filter-label">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="feed-filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="active">Most Active</option>
              </select>
            </div>
          </div>
        </div>

        {feedItems.length === 0 ? (
          <div className="feed-empty">
            <p className="feed-empty-title">No activity yet</p>
            <p className="feed-empty-description">
              When people share discussions or create events in your spaces, they'll appear here
            </p>
          </div>
        ) : (
          <>
            <div className="feed-list">
              {feedItems.map((item, index) => {
                if (item.type === 'discussion') {
                  const discussion = item.data as Discussion;
                  // Extract space ID from discussion
                  const spaceId = typeof discussion.space === 'object'
                    ? discussion.space.id
                    : discussion.space;

                  return (
                    <div key={`discussion-${discussion.id}-${index}`} className="feed-item">
                      <DiscussionCard
                        discussion={discussion}
                        spaceId={String(spaceId)}
                      />
                    </div>
                  );
                } else {
                  const event = item.data as Event;
                  return (
                    <div key={`event-${event.id}-${index}`} className="feed-item">
                      <EventCard event={event} showRSVP={true} />
                    </div>
                  );
                }
              })}
            </div>

            {/* Intersection Observer Trigger */}
            {hasMore && (
              <div ref={loadMoreRef} className="feed-load-more">
                {isFetchingMore ? (
                  <div className="feed-loading-more">
                    <div className="feed-spinner" />
                    <p>Loading more...</p>
                  </div>
                ) : (
                  <div style={{ height: '20px' }} />
                )}
              </div>
            )}

            {!hasMore && feedItems.length > 0 && (
              <div className="feed-end-message">
                <p>You've reached the end of your feed</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sidebar with upcoming events - filtered by accessible spaces */}
      <div className="feed-page-sidebar">
        {allEvents && (
          <UpcomingEventsSidebar
            events={allEvents.filter(event => {
              const spaceId = getSpaceId(event);
              return spaceId && accessibleSpaceIds.has(spaceId);
            })}
          />
        )}
        <UrgentTasksSidebar tasks={MOCK_TASKS} />
      </div>
    </main>
  );
}
