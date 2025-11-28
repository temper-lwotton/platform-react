'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Event, formatEventDateRange, isUpcoming, isOngoing, isPast } from '@/lib/events';
import { Icon } from './Icon';
import { useToast } from './ToastProvider';
import { Avatar, Badge } from './primitives';

type RSVPStatus = 'going' | 'maybe' | 'not_going' | null;

interface EventCardProps {
  event: Event;
  showRSVP?: boolean; // Optional prop to show RSVP dropdown
}

export function EventCard({ event, showRSVP = false }: EventCardProps) {
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>(null);
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { showToast } = useToast();

  const dateRange = formatEventDateRange(event.eventStart, event.eventEnd);
  const status = isOngoing(event.eventStart, event.eventEnd)
    ? 'ongoing'
    : isUpcoming(event.eventStart)
    ? 'upcoming'
    : 'past';

  // Safely get author name with fallback
  const authorName = event.author?.name || event.author?.username || 'Unknown';

  // Generate initials from author name for Avatar fallback
  const authorInitials = authorName
    .split(' ')
    .filter(Boolean)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Extract plain text from HTML content for preview
  const getTextPreview = (html: string, maxLength: number = 150): string => {
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const handleRSVP = (status: RSVPStatus) => {
    setRsvpStatus(status);
    setIsRSVPOpen(false);
    // TODO: Call API when endpoint is available
    // rsvpToEvent(event.id, status);
  };

  const getRSVPButtonText = (): string => {
    if (rsvpStatus === 'going') return '✓ Going';
    if (rsvpStatus === 'maybe') return '? Maybe';
    if (rsvpStatus === 'not_going') return '✗ Not Going';
    return 'RSVP';
  };

  const getRSVPButtonClass = (): string => {
    const base = 'event-card-rsvp-button';
    if (rsvpStatus === 'going') return `${base} ${base}--going`;
    if (rsvpStatus === 'maybe') return `${base} ${base}--maybe`;
    if (rsvpStatus === 'not_going') return `${base} ${base}--not-going`;
    return base;
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);

    if (newBookmarkState) {
      showToast(`Bookmarked "${event.title}" - you can find it later in your bookmarks`);
    } else {
      showToast(`Removed "${event.title}" from bookmarks`);
    }
  };

  return (
    <article className="event-card">
      {event.photo && (
        <div className="event-card-image-wrapper">
          <img
            src={event.photo}
            alt={event.title}
            className="event-card-image"
          />
          {status === 'ongoing' && (
            <Badge variant="danger" size="sm" className="event-card-badge">
              Live Now
            </Badge>
          )}
        </div>
      )}

      <div className="event-card-content">
        <div className="event-card-header">
          <div className="event-card-meta">
            <Link
              href={`/spaces/${event.space.id}`}
              className="event-card-space-link"
            >
              <Icon icon="folder" size={14} className="event-card-space-icon" />
              {event.space.name}
            </Link>
            <span className="event-card-separator">•</span>
            <Badge
              variant={status === 'ongoing' ? 'danger' : status === 'upcoming' ? 'primary' : 'default'}
              size="sm"
              className="event-card-status"
            >
              {status === 'ongoing' ? 'Happening now' : status === 'upcoming' ? 'Upcoming' : 'Past'}
            </Badge>
          </div>
        </div>

        <Link href={`/events/${event.id}`} className="event-card-title-link">
          <h3 className="event-card-title">{event.title}</h3>
        </Link>

        <div className="event-card-details">
          <div className="event-card-detail">
            <Icon icon="calendar" size={16} className="event-card-detail-icon" />
            <span className="event-card-detail-text">{dateRange}</span>
          </div>

          <div className="event-card-detail">
            <Icon icon="mapMarker" size={16} className="event-card-detail-icon" />
            <span className="event-card-detail-text">
              {event.isOnline ? 'Online Event' : event.location || 'Location TBA'}
            </span>
          </div>
        </div>

        {event.htmlContent && (
          <p className="event-card-preview">
            {getTextPreview(event.htmlContent)}
          </p>
        )}

        {event.tags && event.tags.length > 0 && (
          <div className="event-card-tags">
            {event.tags.map(tag => (
              <Badge key={tag.id} variant="outline" size="sm" className="event-card-tag">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="event-card-footer">
          <div className="event-card-author">
            <Avatar
              src={event.author?.avatar}
              alt={authorName}
              fallback={authorInitials}
              size="sm"
              className="event-card-author-avatar"
            />
            <span className="event-card-author-name">
              Hosted by {authorName}
            </span>
          </div>

          <div className="event-card-actions">
            {event.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="event-card-link-button"
                onClick={(e) => e.stopPropagation()}
              >
                <Icon icon="external" size={16} className="event-card-link-icon" />
                Event Link
              </a>
            )}

            {showRSVP && status === 'upcoming' && (
              <DropdownMenu.Root open={isRSVPOpen} onOpenChange={setIsRSVPOpen}>
                <DropdownMenu.Trigger asChild>
                  <button
                    className={getRSVPButtonClass()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {getRSVPButtonText()}
                    <span className="event-card-rsvp-icon">▼</span>
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="event-card-rsvp-dropdown"
                    align="end"
                    sideOffset={4}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu.Item
                      className="event-card-rsvp-option"
                      onSelect={() => handleRSVP('going')}
                    >
                      <span className="event-card-rsvp-option-icon">✓</span>
                      <div className="event-card-rsvp-option-text">
                        <div className="event-card-rsvp-option-label">Going</div>
                        <div className="event-card-rsvp-option-desc">
                          I'll be attending this event
                        </div>
                      </div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="event-card-rsvp-separator" />

                    <DropdownMenu.Item
                      className="event-card-rsvp-option"
                      onSelect={() => handleRSVP('maybe')}
                    >
                      <span className="event-card-rsvp-option-icon">?</span>
                      <div className="event-card-rsvp-option-text">
                        <div className="event-card-rsvp-option-label">Maybe</div>
                        <div className="event-card-rsvp-option-desc">
                          I might attend
                        </div>
                      </div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="event-card-rsvp-separator" />

                    <DropdownMenu.Item
                      className="event-card-rsvp-option"
                      onSelect={() => handleRSVP('not_going')}
                    >
                      <span className="event-card-rsvp-option-icon">✗</span>
                      <div className="event-card-rsvp-option-text">
                        <div className="event-card-rsvp-option-label">Not Going</div>
                        <div className="event-card-rsvp-option-desc">
                          I can't attend
                        </div>
                      </div>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}

            <button
              onClick={handleBookmark}
              className="event-card-bookmark"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Icon
                icon={isBookmarked ? 'bookmarkFilled' : 'bookmark'}
                size={18}
                className="event-card-bookmark-icon"
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
