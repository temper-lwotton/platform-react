'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Event, formatEventDateRange, isUpcoming, isOngoing, isPast } from '@/lib/events';
import { Icon } from '../Icon';
import { useToast } from '../ToastProvider';
import { Avatar, Badge } from '../primitives';
import styles from './EventCard.module.scss';

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
    const classes = [styles.rsvpButton];
    if (rsvpStatus === 'going') classes.push(styles.rsvpButtonGoing);
    if (rsvpStatus === 'maybe') classes.push(styles.rsvpButtonMaybe);
    if (rsvpStatus === 'not_going') classes.push(styles.rsvpButtonNotGoing);
    return classes.join(' ');
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
    <article className={styles.card}>
      {event.photo && (
        <div className={styles.imageWrapper}>
          <img
            src={event.photo}
            alt={event.title}
            className={styles.image}
          />
          {status === 'ongoing' && (
            <Badge variant="danger" size="sm" className={styles.badge}>
              Live Now
            </Badge>
          )}
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.meta}>
            <Link
              href={`/spaces/${event.space.id}`}
              className={styles.spaceLink}
            >
              <Icon icon="folder" size={14} />
              {event.space.name}
            </Link>
            <span className={styles.separator}>•</span>
            <Badge
              variant={status === 'ongoing' ? 'danger' : status === 'upcoming' ? 'primary' : 'default'}
              size="sm"
              className={styles.status}
            >
              {status === 'ongoing' ? 'Happening now' : status === 'upcoming' ? 'Upcoming' : 'Past'}
            </Badge>
          </div>
        </div>

        <Link href={`/events/${event.id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{event.title}</h3>
        </Link>

        <div className={styles.details}>
          <div className={styles.detail}>
            <Icon icon="calendar" size={16} className={styles.detailIcon} />
            <span className={styles.detailText}>{dateRange}</span>
          </div>

          <div className={styles.detail}>
            <Icon icon="mapMarker" size={16} className={styles.detailIcon} />
            <span className={styles.detailText}>
              {event.isOnline ? 'Online Event' : event.location || 'Location TBA'}
            </span>
          </div>
        </div>

        {event.htmlContent && (
          <p className={styles.preview}>
            {getTextPreview(event.htmlContent)}
          </p>
        )}

        {event.tags && event.tags.length > 0 && (
          <div className={styles.tags}>
            {event.tags.map(tag => (
              <Badge key={tag.id} variant="outline" size="sm">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.author}>
            <Avatar
              src={event.author?.avatar}
              alt={authorName}
              fallback={authorInitials}
              size="sm"
              className={styles.authorAvatar}
            />
            <span className={styles.authorName}>
              Hosted by {authorName}
            </span>
          </div>

          <div className={styles.actions}>
            {event.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkButton}
                onClick={(e) => e.stopPropagation()}
              >
                <Icon icon="external" size={16} className={styles.linkIcon} />
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
                    <span className={styles.rsvpIcon}>▼</span>
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className={styles.rsvpDropdown}
                    align="end"
                    sideOffset={4}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu.Item
                      className={styles.rsvpOption}
                      onSelect={() => handleRSVP('going')}
                    >
                      <span className={styles.rsvpOptionIcon}>✓</span>
                      <div className={styles.rsvpOptionText}>
                        <div className={styles.rsvpOptionLabel}>Going</div>
                        <div className={styles.rsvpOptionDesc}>
                          I'll be attending this event
                        </div>
                      </div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className={styles.rsvpSeparator} />

                    <DropdownMenu.Item
                      className={styles.rsvpOption}
                      onSelect={() => handleRSVP('maybe')}
                    >
                      <span className={styles.rsvpOptionIcon}>?</span>
                      <div className={styles.rsvpOptionText}>
                        <div className={styles.rsvpOptionLabel}>Maybe</div>
                        <div className={styles.rsvpOptionDesc}>
                          I might attend
                        </div>
                      </div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className={styles.rsvpSeparator} />

                    <DropdownMenu.Item
                      className={styles.rsvpOption}
                      onSelect={() => handleRSVP('not_going')}
                    >
                      <span className={styles.rsvpOptionIcon}>✗</span>
                      <div className={styles.rsvpOptionText}>
                        <div className={styles.rsvpOptionLabel}>Not Going</div>
                        <div className={styles.rsvpOptionDesc}>
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
              className={styles.bookmark}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Icon
                icon={isBookmarked ? 'bookmarkFilled' : 'bookmark'}
                size={18}
                className={styles.bookmarkIcon}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
