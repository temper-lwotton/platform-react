'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@/lib/events';
import { formatTime, getMonthName, getSpaceColor, downloadEventICS } from '@/lib/calendar-utils';
import { Icon } from '../Icon';
import { Popover, Badge } from '../primitives';
import styles from './CalendarDayPopover.module.scss';

interface CalendarDayPopoverProps {
  date: Date;
  events: Event[];
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CalendarDayPopover({
  date,
  events,
  children,
  open,
  onOpenChange,
}: CalendarDayPopoverProps) {
  const router = useRouter();

  if (events.length === 0) {
    return <>{children}</>;
  }

  const formattedDate = `${getMonthName(date.getMonth())} ${date.getDate()}, ${date.getFullYear()}`;

  const handleEventClick = (event: Event) => {
    router.push(`/events/${event.id}`);
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleExport = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadEventICS(event);
  };

  return (
    <Popover
      trigger={children}
      open={open}
      onOpenChange={onOpenChange}
      align="center"
      sideOffset={8}
      className={styles.popover}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{formattedDate}</h3>
        <Badge variant="outline" size="sm">
          {events.length} event{events.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className={styles.events}>
        {events.map((event) => (
          <button
            key={event.id}
            className={styles.eventItem}
            onClick={() => handleEventClick(event)}
          >
            <div
              className={styles.indicator}
              style={{ backgroundColor: getSpaceColor(event.space.id) }}
            />

            <div className={styles.eventContent}>
              <div className={styles.eventTime}>
                {formatTime(event.eventStart)}
                {event.isOnline && (
                  <Badge variant="primary" size="sm">
                    Online
                  </Badge>
                )}
              </div>

              <h4 className={styles.eventTitle}>{event.title}</h4>

              <div className={styles.eventMeta}>
                <span className={styles.eventSpace}>
                  <Icon icon="folder" size={12} />
                  {event.space.name}
                </span>
                {!event.isOnline && event.location && (
                  <>
                    <span className={styles.separator}>•</span>
                    <span className={styles.eventLocation}>
                      <Icon icon="mapMarker" size={12} />
                      {event.location}
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              className={styles.exportButton}
              onClick={(e) => handleExport(event, e)}
              aria-label="Export to calendar"
              title="Export to calendar"
            >
              <Icon icon="download" size={16} />
            </button>
          </button>
        ))}
      </div>
    </Popover>
  );
}
