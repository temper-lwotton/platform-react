'use client';

import Link from 'next/link';
import { Event } from '@/lib/events';
import { Icon } from '../Icon';
import styles from './UpcomingEventsSidebar.module.scss';

interface UpcomingEventsSidebarProps {
  events: Event[];
}

export function UpcomingEventsSidebar({ events }: UpcomingEventsSidebarProps) {
  // Filter to only upcoming events and sort by start date
  const upcomingEvents = events
    .filter(event => new Date(event.eventEnd) >= new Date())
    .sort((a, b) => new Date(a.eventStart).getTime() - new Date(b.eventStart).getTime())
    .slice(0, 5); // Show max 5 upcoming events

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

  if (upcomingEvents.length === 0) {
    return (
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>Upcoming Events</h2>
        <div className={styles.empty}>
          <p>No upcoming events</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Upcoming Events</h2>
        <Link href="/events" className={styles.viewAll}>
          View all
        </Link>
      </div>

      <div className={styles.list}>
        {upcomingEvents.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className={styles.item}
          >
            <div className={styles.date}>
              <div className={styles.day}>
                {new Date(event.eventStart).getDate()}
              </div>
              <div className={styles.month}>
                {new Date(event.eventStart).toLocaleDateString('en-US', {
                  month: 'short',
                })}
              </div>
            </div>

            <div className={styles.details}>
              <h3 className={styles.eventTitle}>{event.title}</h3>
              <div className={styles.meta}>
                <span className={styles.time}>
                  {formatCompactDate(event.eventStart)}
                </span>
                {event.isOnline ? (
                  <span className={`${styles.badge} ${styles.badgeOnline}`}>
                    Online
                  </span>
                ) : event.location && (
                  <span className={styles.location}>
                    <Icon icon="mapMarker" size={14} /> {event.location.split(',')[0]}
                  </span>
                )}
              </div>
              {event.space && (
                <div className={styles.space}>
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
