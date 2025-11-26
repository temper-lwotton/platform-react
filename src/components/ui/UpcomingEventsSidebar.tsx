'use client';

import Link from 'next/link';
import { Event, formatEventDateRange } from '@/lib/events';
import { Icon } from './Icon';

interface UpcomingEventsSidebarProps {
  events: Event[];
}

export function UpcomingEventsSidebar({ events }: UpcomingEventsSidebarProps) {
  // Filter to only upcoming events and sort by start date
  const upcomingEvents = events
    .filter(event => new Date(event.eventEnd) >= new Date())
    .sort((a, b) => new Date(a.eventStart).getTime() - new Date(b.eventStart).getTime())
    .slice(0, 5); // Show max 5 upcoming events

  if (upcomingEvents.length === 0) {
    return (
      <aside className="upcoming-events-sidebar">
        <h2 className="upcoming-events-title">Upcoming Events</h2>
        <div className="upcoming-events-empty">
          <p>No upcoming events</p>
        </div>
      </aside>
    );
  }

  const formatCompactDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time parts for date comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return `Today, ${timeStr}`;
    } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
      return `Tomorrow, ${timeStr}`;
    } else {
      const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      return `${dateStr}, ${timeStr}`;
    }
  };

  return (
    <aside className="upcoming-events-sidebar">
      <div className="upcoming-events-header">
        <h2 className="upcoming-events-title">Upcoming Events</h2>
        <Link href="/events" className="upcoming-events-view-all">
          View all
        </Link>
      </div>

      <div className="upcoming-events-list">
        {upcomingEvents.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="upcoming-event-item"
          >
            <div className="upcoming-event-date">
              <div className="upcoming-event-day">
                {new Date(event.eventStart).getDate()}
              </div>
              <div className="upcoming-event-month">
                {new Date(event.eventStart).toLocaleDateString('en-US', {
                  month: 'short',
                })}
              </div>
            </div>

            <div className="upcoming-event-details">
              <h3 className="upcoming-event-title">{event.title}</h3>
              <div className="upcoming-event-meta">
                <span className="upcoming-event-time">
                  {formatCompactDate(event.eventStart)}
                </span>
                {event.isOnline ? (
                  <span className="upcoming-event-badge upcoming-event-badge--online">
                    Online
                  </span>
                ) : event.location && (
                  <span className="upcoming-event-location">
                    <Icon icon="mapMarker" size={14} /> {event.location.split(',')[0]}
                  </span>
                )}
              </div>
              {event.space && (
                <div className="upcoming-event-space">
                  {event.space.name}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
