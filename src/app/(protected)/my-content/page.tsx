'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getCurrentUserId } from '@/lib/auth';
import { getDiscussions, Discussion } from '@/lib/discussions';
import { getEvents, Event } from '@/lib/events';
import { Icon } from '@/components/ui/Icon';

type ContentItem = (Discussion | Event) & {
  contentType: 'discussion' | 'event';
  status: 'published' | 'draft';
};

export default function MyContentPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [filter, setFilter] = useState<'all' | 'discussions' | 'events'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    setIsClient(true);
    setCurrentUserId(getCurrentUserId());
  }, []);

  // Fetch all discussions
  const { data: discussions = [], isLoading: discussionsLoading } = useQuery({
    queryKey: ['my-discussions'],
    queryFn: () => getDiscussions(),
    enabled: isClient && !!currentUserId,
  });

  // Fetch all events
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['my-events'],
    queryFn: () => getEvents(),
    enabled: isClient && !!currentUserId,
  });

  if (!isClient) {
    return null;
  }

  // Filter content by current user and combine
  const myDiscussions: ContentItem[] = discussions
    .filter((d) => d.author?.id === currentUserId)
    .map((d) => ({
      ...d,
      contentType: 'discussion' as const,
      status: 'published' as const, // Assuming all fetched content is published
    }));

  const myEvents: ContentItem[] = events
    .filter((e) => (e.author as any)?.id?.toString() === currentUserId)
    .map((e) => ({
      ...e,
      contentType: 'event' as const,
      status: 'published' as const,
    }));

  let allContent: ContentItem[] = [...myDiscussions, ...myEvents];

  // Apply filters
  if (filter !== 'all') {
    allContent = allContent.filter((item) => item.contentType === filter.slice(0, -1));
  }

  if (statusFilter !== 'all') {
    allContent = allContent.filter((item) => item.status === statusFilter);
  }

  // Sort by created date (newest first)
  allContent.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const isLoading = discussionsLoading || eventsLoading;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getContentLink = (item: ContentItem) => {
    if (item.contentType === 'discussion') {
      return `/spaces/${item.space?.id}/discussions/${item.id}`;
    } else {
      return `/events/${item.id}`;
    }
  };

  return (
    <div className="my-content-page">
      <div className="my-content-header">
        <h1 className="my-content-title">My Content</h1>
        <p className="my-content-subtitle">
          View and manage all your discussions and events
        </p>
      </div>

      <div className="my-content-filters">
        <div className="my-content-filter-group">
          <label className="my-content-filter-label">Type:</label>
          <div className="my-content-filter-buttons">
            <button
              className={`my-content-filter-button ${filter === 'all' ? 'my-content-filter-button--active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`my-content-filter-button ${filter === 'discussions' ? 'my-content-filter-button--active' : ''}`}
              onClick={() => setFilter('discussions')}
            >
              Discussions
            </button>
            <button
              className={`my-content-filter-button ${filter === 'events' ? 'my-content-filter-button--active' : ''}`}
              onClick={() => setFilter('events')}
            >
              Events
            </button>
          </div>
        </div>

        <div className="my-content-filter-group">
          <label className="my-content-filter-label">Status:</label>
          <div className="my-content-filter-buttons">
            <button
              className={`my-content-filter-button ${statusFilter === 'all' ? 'my-content-filter-button--active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button
              className={`my-content-filter-button ${statusFilter === 'published' ? 'my-content-filter-button--active' : ''}`}
              onClick={() => setStatusFilter('published')}
            >
              Published
            </button>
            <button
              className={`my-content-filter-button ${statusFilter === 'draft' ? 'my-content-filter-button--active' : ''}`}
              onClick={() => setStatusFilter('draft')}
            >
              Draft
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="my-content-loading">Loading your content...</div>
      ) : allContent.length === 0 ? (
        <div className="my-content-empty">
          <Icon icon="fileText" size={48} className="my-content-empty-icon" />
          <h3 className="my-content-empty-title">No content yet</h3>
          <p className="my-content-empty-text">
            Start creating discussions or events to see them here.
          </p>
        </div>
      ) : (
        <div className="my-content-table-container">
          <table className="my-content-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Space</th>
                <th>Created</th>
                <th>Status</th>
                <th>Stats</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allContent.map((item) => (
                <tr key={`${item.contentType}-${item.id}`}>
                  <td>
                    <span className={`my-content-type-badge my-content-type-badge--${item.contentType}`}>
                      {item.contentType === 'discussion' ? 'Discussion' : 'Event'}
                    </span>
                  </td>
                  <td>
                    <Link href={getContentLink(item)} className="my-content-title-link">
                      {item.title}
                    </Link>
                  </td>
                  <td className="my-content-space">
                    {item.space ? (
                      <Link href={`/spaces/${item.space.id}`} className="my-content-space-link">
                        {(item.space as any).title || (item.space as any).name}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="my-content-date">{formatDate(item.createdAt)}</td>
                  <td>
                    <span className={`my-content-status-badge my-content-status-badge--${item.status}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="my-content-stats">
                    <div className="my-content-stats-row">
                      {item.contentType === 'discussion' ? (
                        <>
                          <span className="my-content-stat">
                            <Icon icon="heart" size={14} />
                            {(item as Discussion).likesCount ?? 0}
                          </span>
                          <span className="my-content-stat">
                            <Icon icon="comment" size={14} />
                            {(item as Discussion).commentsCount ?? 0}
                          </span>
                        </>
                      ) : (
                        <span className="my-content-stat">
                          <Icon icon="calendar" size={14} />
                          {formatDate((item as Event).eventStart)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <Link href={getContentLink(item)} className="my-content-action-button">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
