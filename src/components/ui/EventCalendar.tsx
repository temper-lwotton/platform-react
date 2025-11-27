'use client';

import { useState, useMemo, useEffect } from 'react';
import { Event } from '@/lib/events';
import {
  getDaysInMonth,
  getMonthName,
  getWeekdayNames,
  CalendarDay,
  getEventsForDate,
  getSpaceColor,
  isMultiDayEvent,
  getEventDateSpan,
  formatDateKey,
  downloadICS,
} from '@/lib/calendar-utils';
import { Icon } from './Icon';
import { CalendarDayPopover } from './CalendarDayPopover';
import { MonthYearSelector } from './MonthYearSelector';

interface EventCalendarProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  onDateClick?: (date: Date) => void;
}

export function EventCalendar({ events, onEventClick, onDateClick }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get all days to display in the calendar grid
  const days = getDaysInMonth(currentYear, currentMonth);
  const weekdays = getWeekdayNames(true); // Short names (Su, Mo, Tu, etc.)

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleMonthChange = (month: number) => {
    setCurrentDate(new Date(currentYear, month, 1));
  };

  const handleYearChange = (year: number) => {
    setCurrentDate(new Date(year, currentMonth, 1));
  };

  const handleDayClick = (day: CalendarDay) => {
    if (onDateClick) {
      onDateClick(day.date);
    }
  };

  const handleExportMonth = () => {
    // Get all events for the current month
    const monthEvents = events.filter(event => {
      const eventDate = new Date(event.eventStart);
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });

    if (monthEvents.length > 0) {
      const filename = `${getMonthName(currentMonth)}-${currentYear}-events.ics`;
      downloadICS(monthEvents, filename);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if no input is focused
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPreviousMonth();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNextMonth();
          break;
        case 't':
        case 'T':
          e.preventDefault();
          goToToday();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMonth, currentYear]);

  // Get events for each day (memoized for performance)
  const getEventsForDay = useMemo(() => {
    const eventsMap = new Map<string, Event[]>();
    days.forEach((day) => {
      const dayEvents = getEventsForDate(events, day.date);
      if (dayEvents.length > 0) {
        eventsMap.set(day.dateKey, dayEvents);
      }
    });
    return eventsMap;
  }, [events, days]);

  // Get multi-day events that need to be rendered as bars
  const multiDayEvents = useMemo(() => {
    return events.filter(isMultiDayEvent);
  }, [events]);

  // Calculate which days each multi-day event spans
  const eventSpans = useMemo(() => {
    const spans = new Map<number, { start: number; end: number; event: Event }[]>();

    multiDayEvents.forEach((event) => {
      const dateSpan = getEventDateSpan(event);
      const dayIndices: number[] = [];

      dateSpan.forEach((dateKey) => {
        const dayIndex = days.findIndex(d => d.dateKey === dateKey);
        if (dayIndex !== -1) {
          dayIndices.push(dayIndex);
        }
      });

      if (dayIndices.length > 0) {
        // Group consecutive days into rows
        let currentRow = Math.floor(dayIndices[0] / 7);
        let rowStart = dayIndices[0];

        dayIndices.forEach((idx, i) => {
          const row = Math.floor(idx / 7);

          if (row !== currentRow || i === dayIndices.length - 1) {
            const end = row !== currentRow ? idx - 1 : idx;
            if (!spans.has(currentRow)) {
              spans.set(currentRow, []);
            }
            spans.get(currentRow)!.push({
              start: rowStart,
              end: i === dayIndices.length - 1 && row === currentRow ? idx : end,
              event,
            });

            currentRow = row;
            rowStart = idx;
          }
        });
      }
    });

    return spans;
  }, [multiDayEvents, days]);

  const renderEventIndicators = (day: CalendarDay) => {
    const dayEvents = getEventsForDay.get(day.dateKey);
    if (!dayEvents || dayEvents.length === 0) return null;

    // Filter out multi-day events (they're shown as bars)
    const singleDayEvents = dayEvents.filter(e => !isMultiDayEvent(e));

    if (singleDayEvents.length === 0) return null;

    const maxDotsToShow = 3;
    const visibleEvents = singleDayEvents.slice(0, maxDotsToShow);
    const remainingCount = singleDayEvents.length - maxDotsToShow;

    return (
      <div className="event-calendar-day-indicators">
        {visibleEvents.map((event, index) => (
          <span
            key={event.id}
            className="event-calendar-day-dot"
            style={{ backgroundColor: getSpaceColor(event.space.id) }}
            title={event.title}
          />
        ))}
        {remainingCount > 0 && (
          <span className="event-calendar-day-more">
            +{remainingCount}
          </span>
        )}
      </div>
    );
  };

  const renderMultiDayEventBars = (rowIndex: number) => {
    const rowSpans = eventSpans.get(rowIndex);
    if (!rowSpans || rowSpans.length === 0) return null;

    return (
      <div className="event-calendar-multiday-container">
        {rowSpans.map((span, index) => {
          const startCol = (span.start % 7) + 1;
          const endCol = (span.end % 7) + 2;
          const spanCols = endCol - startCol;

          return (
            <button
              key={`${span.event.id}-${span.start}`}
              className="event-calendar-multiday-bar"
              style={{
                gridColumnStart: startCol,
                gridColumnEnd: endCol,
                backgroundColor: getSpaceColor(span.event.space.id),
                top: `${index * 24}px`,
              }}
              onClick={() => window.location.href = `/events/${span.event.id}`}
              title={span.event.title}
            >
              <span className="event-calendar-multiday-title">
                {span.event.title}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="event-calendar" role="region" aria-label="Events calendar">
      {/* Calendar Header */}
      <div className="event-calendar-header" role="toolbar" aria-label="Calendar navigation">
        <div className="event-calendar-header-title">
          <MonthYearSelector
            currentMonth={currentMonth}
            currentYear={currentYear}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
          />
          <button
            className="event-calendar-today-btn"
            onClick={goToToday}
            aria-label="Go to today (Shortcut: T)"
            title="Keyboard shortcut: T"
          >
            Today
          </button>
          <button
            className="event-calendar-export-btn"
            onClick={handleExportMonth}
            aria-label="Export month to calendar"
            title="Export month to calendar (.ics)"
          >
            <Icon icon="download" size={18} />
            <span>Export</span>
          </button>
        </div>

        <div className="event-calendar-nav">
          <button
            className="event-calendar-nav-btn"
            onClick={goToPreviousMonth}
            aria-label="Previous month (Shortcut: ←)"
            title="Keyboard shortcut: ←"
          >
            <Icon icon="chevronLeft" size={20} />
          </button>
          <button
            className="event-calendar-nav-btn"
            onClick={goToNextMonth}
            aria-label="Next month (Shortcut: →)"
            title="Keyboard shortcut: →"
          >
            <Icon icon="chevronRight" size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="event-calendar-grid-wrapper">
        <div className="event-calendar-grid" role="grid" aria-label={`Calendar for ${getMonthName(currentMonth)} ${currentYear}`}>
          {/* Weekday Headers */}
          {weekdays.map((weekday) => (
            <div key={weekday} className="event-calendar-weekday" role="columnheader" aria-label={weekday}>
              {weekday}
            </div>
          ))}

          {/* Render weeks with multi-day event bars */}
          {Array.from({ length: 6 }, (_, weekIndex) => {
            const weekDays = days.slice(weekIndex * 7, (weekIndex + 1) * 7);
            if (weekDays.length === 0) return null;

            return (
              <div key={weekIndex} className="event-calendar-week" style={{ gridColumn: '1 / -1' }}>
                <div className="event-calendar-week-grid">
                  {/* Multi-day event bars for this week */}
                  {renderMultiDayEventBars(weekIndex)}

                  {/* Day cells */}
                  {weekDays.map((day) => {
                    const dayEvents = getEventsForDay.get(day.dateKey) || [];
                    const hasEvents = dayEvents.length > 0;

                    return (
                      <CalendarDayPopover
                        key={day.dateKey}
                        date={day.date}
                        events={dayEvents}
                      >
                        <button
                          className={`event-calendar-day ${
                            !day.isCurrentMonth ? 'event-calendar-day--other-month' : ''
                          } ${day.isToday ? 'event-calendar-day--today' : ''} ${
                            day.isPast ? 'event-calendar-day--past' : ''
                          } ${hasEvents ? 'event-calendar-day--has-events' : ''}`}
                          onClick={() => handleDayClick(day)}
                          aria-label={`${getMonthName(day.date.getMonth())} ${day.dayNumber}, ${day.date.getFullYear()}${hasEvents ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''}`}
                        >
                          <span className="event-calendar-day-number">{day.dayNumber}</span>
                          {renderEventIndicators(day)}
                        </button>
                      </CalendarDayPopover>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
