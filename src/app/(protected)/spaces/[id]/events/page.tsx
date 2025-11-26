'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getEvents, Event, EventsQueryParams } from '@/lib/events';
import { EventCard } from '@/components/ui/EventCard';

export default function SpaceEventsPage() {
  const params = useParams();
  const spaceId = params.id as string;

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Fetch events for this space
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['space-events', spaceId, activeTab],
    queryFn: () => getEvents({
      space: parseInt(spaceId),
      sort: activeTab === 'upcoming' ? 'asc' : 'desc',
    }),
    enabled: !!spaceId,
  });

  // Filter events by upcoming/past based on active tab
  const filteredEvents = events?.filter(event => {
    const now = new Date();
    const eventEnd = new Date(event.eventEnd);
    if (activeTab === 'upcoming') {
      return eventEnd >= now;
    } else {
      return eventEnd < now;
    }
  });

  const handleTabChange = (tab: 'upcoming' | 'past') => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <div className="space-events-page">
        <p className="space-events-loading">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-events-page">
        <p className="space-events-error">Error loading events.</p>
      </div>
    );
  }

  return (
    <div className="space-events-page">
      <header className="space-events-header">
        <div>
          <h1 className="space-events-title">Events</h1>
          <p className="space-events-subtitle">Upcoming and past events for this space</p>
        </div>
        <div className="space-events-header-actions">
          {filteredEvents && filteredEvents.length > 0 && (
            <div className="space-events-count">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
            </div>
          )}
          <Link
            href={`/spaces/${spaceId}/events/new`}
            className="space-events-new-button"
          >
            New Event
          </Link>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="space-events-tabs">
        <button
          className={`space-events-tab ${activeTab === 'upcoming' ? 'space-events-tab--active' : ''}`}
          onClick={() => handleTabChange('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`space-events-tab ${activeTab === 'past' ? 'space-events-tab--active' : ''}`}
          onClick={() => handleTabChange('past')}
        >
          Past
        </button>
      </div>

      {/* Events Grid */}
      {filteredEvents && filteredEvents.length > 0 ? (
        <div className="space-events-grid">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="space-events-empty">
          <p className="space-events-empty-title">
            No {activeTab} events
          </p>
          <p className="space-events-empty-description">
            {activeTab === 'upcoming'
              ? 'Check back later for new events in this space'
              : 'No past events to display'}
          </p>
        </div>
      )}
    </div>
  );
}
