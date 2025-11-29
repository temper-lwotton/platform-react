'use client';

import { useMemo } from 'react';
import {
  getDaysInMonth,
  getMonthName,
  getWeekdayNames,
  CalendarDay,
  getEventsForDate,
} from '@/lib/calendar-utils';
import { Event } from '@/lib/events';

interface MiniCalendarProps {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
}

export function MiniCalendar({ currentDate, events, onDateClick, onMonthChange }: MiniCalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = getDaysInMonth(year, month);
  const weekdays = getWeekdayNames(true);

  // Count events per day
  const eventCounts = useMemo(() => {
    const counts = new Map<string, number>();
    days.forEach((day) => {
      const dayEvents = getEventsForDate(events, day.date);
      if (dayEvents.length > 0) {
        counts.set(day.dateKey, dayEvents.length);
      }
    });
    return counts;
  }, [events, days]);

  const handleDayClick = (day: CalendarDay) => {
    onDateClick(day.date);
  };

  const goToPreviousMonth = () => {
    if (onMonthChange) {
      onMonthChange(new Date(year, month - 1, 1));
    }
  };

  const goToNextMonth = () => {
    if (onMonthChange) {
      onMonthChange(new Date(year, month + 1, 1));
    }
  };

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">
        <button
          className="mini-calendar-nav-btn"
          onClick={goToPreviousMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="mini-calendar-month-name">
          {getMonthName(month)} {year}
        </span>
        <button
          className="mini-calendar-nav-btn"
          onClick={goToNextMonth}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="mini-calendar-grid">
        {weekdays.map((weekday) => (
          <div key={weekday} className="mini-calendar-weekday">
            {weekday}
          </div>
        ))}

        {days.map((day) => {
          const eventCount = eventCounts.get(day.dateKey) || 0;
          const hasEvents = eventCount > 0;

          return (
            <button
              key={day.dateKey}
              className={`mini-calendar-day ${
                !day.isCurrentMonth ? 'mini-calendar-day--other-month' : ''
              } ${day.isToday ? 'mini-calendar-day--today' : ''} ${
                hasEvents ? 'mini-calendar-day--has-events' : ''
              }`}
              onClick={() => handleDayClick(day)}
              title={hasEvents ? `${eventCount} event${eventCount > 1 ? 's' : ''}` : undefined}
            >
              <span className="mini-calendar-day-number">{day.dayNumber}</span>
              {hasEvents && (
                <span className="mini-calendar-day-badge">{eventCount}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
