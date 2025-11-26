'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getEvents, Event } from '@/lib/events';
import { EventCard } from '@/components/ui/EventCard';
import { UpcomingEventsSidebar } from '@/components/ui/UpcomingEventsSidebar';
import { DiscussionCard } from '@/components/ui/DiscussionCard';
import { getDiscussions, Discussion } from '@/lib/discussions';
import { getCurrentUserId, fetchCurrentUser } from '@/lib/auth';

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

  const isLoading = userLoading || discussionsLoading || eventsLoading;
  const hasMore = hasNextDiscussions || hasNextEvents;
  const isFetchingMore = isFetchingNextDiscussions || isFetchingNextEvents;

  // Flatten and combine all discussions and events
  const allDiscussions = discussionsData?.pages.flat() ?? [];
  const allEventItems = eventsData?.pages.flat() ?? [];

  // Helper function to extract space ID from discussion or event
  const getSpaceId = (item: Discussion | Event): number | null => {
    if ('space' in item && item.space) {
      // For discussions, space can be an object or ID
      if (typeof item.space === 'object' && 'id' in item.space) {
        return typeof item.space.id === 'string' ? parseInt(item.space.id) : item.space.id;
      }
      // For events, space is always an object
      return item.space.id;
    }
    return null;
  };

  // Combine and filter feed items by accessible spaces
  const feedItems: FeedItem[] = [];

  allDiscussions.forEach(discussion => {
    const spaceId = getSpaceId(discussion);
    // Only include if from an accessible space
    if (spaceId && accessibleSpaceIds.has(spaceId)) {
      feedItems.push({
        type: 'discussion',
        data: discussion,
        createdAt: discussion.createdAt,
      });
    }
  });

  allEventItems.forEach(event => {
    const spaceId = getSpaceId(event);
    // Only include if from an accessible space
    if (spaceId && accessibleSpaceIds.has(spaceId)) {
      feedItems.push({
        type: 'event',
        data: event,
        createdAt: event.createdAt,
      });
    }
  });

  // Sort by creation date, newest first
  feedItems.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
      </div>
    </main>
  );
}
