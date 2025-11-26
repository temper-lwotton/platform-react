'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEvents, Event, EventsQueryParams } from '@/lib/events';
import { EventCard } from '@/components/ui/EventCard';

export default function EventsPage() {
  const [filterParams, setFilterParams] = useState<EventsQueryParams>({
    sort: 'asc', // Show upcoming events first
  });
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Fetch events with filter parameters
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['events', filterParams],
    queryFn: () => getEvents(filterParams),
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
    setFilterParams({
      ...filterParams,
      sort: tab === 'upcoming' ? 'asc' : 'desc',
    });
  };

  if (error) {
    return (
      <main className="events-page">
        <p className="events-error">Error loading events. Please try again.</p>
      </main>
    );
  }

  const showEmpty = !isLoading && (!filteredEvents || filteredEvents.length === 0);

  return (
    <main className="events-page">
      <header className="events-header">
        <div className="events-header-content">
          <div>
            <h1 className="events-title">Events</h1>
            <p className="events-subtitle">Discover and join community events</p>
          </div>
          {filteredEvents && filteredEvents.length > 0 && (
            <div className="events-count">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
            </div>
          )}
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="events-tabs">
        <button
          className={`events-tab ${activeTab === 'upcoming' ? 'events-tab--active' : ''}`}
          onClick={() => handleTabChange('upcoming')}
        >
          Upcoming Events
        </button>
        <button
          className={`events-tab ${activeTab === 'past' ? 'events-tab--active' : ''}`}
          onClick={() => handleTabChange('past')}
        >
          Past Events
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="events-loading-container">
          <p className="events-loading">Loading events...</p>
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && filteredEvents && filteredEvents.length > 0 && (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {showEmpty && (
        <div className="events-empty">
          <p className="events-empty-title">
            No {activeTab} events found
          </p>
          <p className="events-empty-description">
            {activeTab === 'upcoming'
              ? 'Check back later for new events'
              : 'No past events to display'}
          </p>
        </div>
      )}
    </main>
  );
}
