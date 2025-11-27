'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import * as Popover from '@radix-ui/react-popover';
import { Event } from '@/lib/events';
import { formatTime, getMonthName, getSpaceColor, downloadEventICS } from '@/lib/calendar-utils';
import { Icon } from './Icon';

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
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        {children}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="calendar-day-popover"
          align="center"
          sideOffset={8}
          collisionPadding={16}
        >
          <div className="calendar-day-popover-header">
            <h3 className="calendar-day-popover-title">{formattedDate}</h3>
            <span className="calendar-day-popover-count">
              {events.length} event{events.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="calendar-day-popover-events">
            {events.map((event) => (
              <button
                key={event.id}
                className="calendar-day-event-item"
                onClick={() => handleEventClick(event)}
              >
                <div
                  className="calendar-day-event-indicator"
                  style={{ backgroundColor: getSpaceColor(event.space.id) }}
                />

                <div className="calendar-day-event-content">
                  <div className="calendar-day-event-time">
                    {formatTime(event.eventStart)}
                    {event.isOnline && (
                      <span className="calendar-day-event-badge calendar-day-event-badge--online">
                        Online
                      </span>
                    )}
                  </div>

                  <h4 className="calendar-day-event-title">{event.title}</h4>

                  <div className="calendar-day-event-meta">
                    <span className="calendar-day-event-space">
                      <Icon icon="folder" size={12} />
                      {event.space.name}
                    </span>
                    {!event.isOnline && event.location && (
                      <>
                        <span className="calendar-day-event-separator">•</span>
                        <span className="calendar-day-event-location">
                          <Icon icon="mapMarker" size={12} />
                          {event.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  className="calendar-day-event-export"
                  onClick={(e) => handleExport(event, e)}
                  aria-label="Export to calendar"
                  title="Export to calendar"
                >
                  <Icon icon="download" size={16} />
                </button>
              </button>
            ))}
          </div>

          <Popover.Arrow className="calendar-day-popover-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
