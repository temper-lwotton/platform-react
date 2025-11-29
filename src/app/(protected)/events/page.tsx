'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEvents, Event, EventsQueryParams } from '@/lib/events';
import { EventCard } from '@/components/ui/EventCard';
import { EventCalendar } from '@/components/ui/EventCalendar';
import { EventWeekCalendar } from '@/components/ui/EventWeekCalendar';
import { Icon } from '@/components/ui/Icon';

export default function EventsPage() {
  const [filterParams, setFilterParams] = useState<EventsQueryParams>({
    sort: 'asc', // Show upcoming events first
  });
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [view, setView] = useState<'list' | 'calendar' | 'week'>('list');

  // Load saved view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem('events-view');
    if (savedView === 'list' || savedView === 'calendar' || savedView === 'week') {
      setView(savedView);
    }
  }, []);

  // Save view preference to localStorage
  const handleViewChange = (newView: 'list' | 'calendar' | 'week') => {
    setView(newView);
    localStorage.setItem('events-view', newView);
  };

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
          <div className="events-header-actions">
            {/* View Toggle */}
            <div className="events-view-toggle">
              <button
                className={`events-view-toggle-btn ${view === 'list' ? 'events-view-toggle-btn--active' : ''}`}
                onClick={() => handleViewChange('list')}
                aria-label="List view"
              >
                <Icon icon="layoutGrid" size={18} />
                <span>List</span>
              </button>
              <button
                className={`events-view-toggle-btn ${view === 'calendar' ? 'events-view-toggle-btn--active' : ''}`}
                onClick={() => handleViewChange('calendar')}
                aria-label="Calendar view"
              >
                <Icon icon="calendar" size={18} />
                <span>Month</span>
              </button>
              <button
                className={`events-view-toggle-btn ${view === 'week' ? 'events-view-toggle-btn--active' : ''}`}
                onClick={() => handleViewChange('week')}
                aria-label="Week view"
              >
                <Icon icon="calendar" size={18} />
                <span>Week</span>
              </button>
            </div>

            {filteredEvents && filteredEvents.length > 0 && view === 'list' && (
              <div className="events-count">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tab Navigation - Only show for list view */}
      {view === 'list' && (
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
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="events-loading-container">
          <p className="events-loading">Loading events...</p>
        </div>
      )}

      {/* Calendar View */}
      {!isLoading && view === 'calendar' && events && (
        <div className="events-calendar-container">
          <EventCalendar events={events} />
        </div>
      )}

      {/* Week View */}
      {!isLoading && view === 'week' && events && (
        <div className="events-calendar-container">
          <EventWeekCalendar events={events} />
        </div>
      )}

      {/* List View */}
      {!isLoading && view === 'list' && (
        <>
          {/* Events Grid */}
          {filteredEvents && filteredEvents.length > 0 && (
            <div className="events-grid">
              {filteredEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  priority={activeTab === 'upcoming' && index === 0} // Feature first upcoming event with gradient accent
                />
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
        </>
      )}
    </main>
  );
}
