'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getEvent, formatEventDateRange, isUpcoming, isOngoing } from '@/lib/events';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEvent(eventId),
    enabled: !!eventId,
  });

  if (isLoading) {
    return (
      <div className="event-detail">
        <p className="event-loading">Loading event...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-detail">
        <p className="event-error">Error loading event.</p>
        <Link href="/events" className="event-back-link">
          Back to events
        </Link>
      </div>
    );
  }

  const dateRange = formatEventDateRange(event.eventStart, event.eventEnd);
  const status = isOngoing(event.eventStart, event.eventEnd)
    ? 'ongoing'
    : isUpcoming(event.eventStart)
    ? 'upcoming'
    : 'past';

  // Safely get author name with fallback
  const authorName = event.author?.name || event.author?.username || 'Unknown';

  // Generate initials from author name
  const authorInitials = authorName
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="event-detail">
      <Link href="/events" className="event-back-link">
        ← Back to events
      </Link>

      <article className="event-article">
        {event.photo && (
          <div className="event-article-image-wrapper">
            <img
              src={event.photo}
              alt={event.title}
              className="event-article-image"
            />
            {status === 'ongoing' && (
              <span className="event-article-badge event-article-badge--ongoing">
                Live Now
              </span>
            )}
          </div>
        )}

        <div className="event-article-content">
          <header className="event-article-header">
            <div className="event-article-meta-top">
              <Link
                href={`/spaces/${event.space.id}`}
                className="event-article-space-link"
              >
                {event.space.name}
              </Link>
              <span className="event-article-separator">•</span>
              <span className={`event-article-status event-article-status--${status}`}>
                {status === 'ongoing' ? 'Happening now' : status === 'upcoming' ? 'Upcoming' : 'Past Event'}
              </span>
            </div>

            <h1 className="event-article-title">{event.title}</h1>

            {event.tags && event.tags.length > 0 && (
              <div className="event-article-tags">
                {event.tags.map(tag => (
                  <span key={tag.id} className="event-article-tag">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="event-article-details-section">
            <div className="event-article-detail-card">
              <div className="event-article-detail-row">
                <Icon icon="calendar" size={20} className="event-article-detail-icon" />
                <div>
                  <div className="event-article-detail-label">Date & Time</div>
                  <div className="event-article-detail-value">{dateRange}</div>
                </div>
              </div>

              <div className="event-article-detail-row">
                <Icon icon="mapMarker" size={20} className="event-article-detail-icon" />
                <div>
                  <div className="event-article-detail-label">Location</div>
                  <div className="event-article-detail-value">
                    {event.isOnline ? 'Online Event' : event.location || 'Location TBA'}
                  </div>
                </div>
              </div>

              {event.link && (
                <div className="event-article-detail-row">
                  <Icon icon="link" size={20} className="event-article-detail-icon" />
                  <div>
                    <div className="event-article-detail-label">Event Link</div>
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="event-article-external-link"
                    >
                      Visit event page →
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="event-article-host-card">
              <div className="event-article-host-label">Hosted by</div>
              <div className="event-article-host-info">
                {event.author?.avatar ? (
                  <img
                    src={event.author.avatar}
                    alt={authorName}
                    className="event-article-host-avatar"
                  />
                ) : (
                  <div className="event-article-host-avatar event-article-host-avatar--placeholder">
                    {authorInitials}
                  </div>
                )}
                <div>
                  <div className="event-article-host-name">{authorName}</div>
                  {event.author?.username && (
                    <div className="event-article-host-username">@{event.author.username}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {event.htmlContent && (
            <div className="event-article-body">
              <h2 className="event-article-section-title">About this event</h2>
              <div
                className="event-article-html-content"
                dangerouslySetInnerHTML={{ __html: event.htmlContent }}
              />
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
