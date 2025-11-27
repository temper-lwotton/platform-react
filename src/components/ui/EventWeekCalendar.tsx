'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@/lib/events';
import {
  getWeekBounds,
  getDaysInWeek,
  getEventsForWeek,
  formatDateKey,
  getEventTimelinePosition,
  getSpaceColor,
  isToday,
  downloadICS,
  isAllDayEvent,
  getEventDateSpan,
} from '@/lib/calendar-utils';
import { Icon } from './Icon';

interface EventWeekCalendarProps {
  events: Event[];
}

export function EventWeekCalendar({ events }: EventWeekCalendarProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekDays = useMemo(() => getDaysInWeek(currentDate), [currentDate]);
  const weekEvents = useMemo(() => getEventsForWeek(events, currentDate), [events, currentDate]);

  // Separate all-day events from timed events
  const { allDayEvents, timedEvents } = useMemo(() => {
    const allDay: Event[] = [];
    const timed: Event[] = [];
    weekEvents.forEach(event => {
      if (isAllDayEvent(event)) {
        allDay.push(event);
      } else {
        timed.push(event);
      }
    });
    return { allDayEvents: allDay, timedEvents: timed };
  }, [weekEvents]);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Group timed events by day
  const eventsByDay = useMemo(() => {
    const grouped = new Map<string, Event[]>();
    weekDays.forEach(day => {
      const dateKey = formatDateKey(day);
      const dayEvents = timedEvents.filter(event => {
        const eventDate = new Date(event.eventStart);
        return formatDateKey(eventDate) === dateKey;
      });
      if (dayEvents.length > 0) {
        grouped.set(dateKey, dayEvents);
      }
    });
    return grouped;
  }, [weekDays, timedEvents]);

  // Time slots (24 hours)
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? 'AM' : 'PM';
    return `${hour} ${ampm}`;
  });

  // Current time indicator
  const now = new Date();
  const currentHourPercent = (now.getHours() + now.getMinutes() / 60) / 24 * 100;
  const isCurrentWeek = weekDays.some(day => isToday(day));

  const handleEventClick = (event: Event) => {
    router.push(`/events/${event.id}`);
  };

  const handleExportWeek = () => {
    if (weekEvents.length > 0) {
      const start = weekDays[0];
      const end = weekDays[6];
      const startStr = `${start.getMonth() + 1}-${start.getDate()}`;
      const endStr = `${end.getMonth() + 1}-${end.getDate()}`;
      const filename = `week-${startStr}-to-${endStr}-${start.getFullYear()}-events.ics`;
      downloadICS(weekEvents, filename);
    }
  };

  const formatWeekRange = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const year = start.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${year}`;
    }
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${year}`;
  };

  return (
    <div className="event-week-calendar" role="region" aria-label="Week calendar view">
      {/* Week Header */}
      <div className="event-week-calendar-header" role="toolbar" aria-label="Week navigation">
        <div className="event-week-calendar-header-title">
          <h2 className="event-week-calendar-title">
            {formatWeekRange()}
          </h2>
          <button
            className="event-week-calendar-today-btn"
            onClick={goToToday}
            aria-label="Go to today"
          >
            Today
          </button>
          <button
            className="event-week-calendar-export-btn"
            onClick={handleExportWeek}
            aria-label="Export week to calendar"
            title="Export week to calendar (.ics)"
          >
            <Icon icon="download" size={18} />
            <span>Export</span>
          </button>
        </div>

        <div className="event-week-calendar-nav">
          <button
            className="event-week-calendar-nav-btn"
            onClick={goToPreviousWeek}
            aria-label="Previous week"
          >
            <Icon icon="chevronLeft" size={20} />
          </button>
          <button
            className="event-week-calendar-nav-btn"
            onClick={goToNextWeek}
            aria-label="Next week"
          >
            <Icon icon="chevronRight" size={20} />
          </button>
        </div>
      </div>

      {/* All-Day Events Section */}
      {allDayEvents.length > 0 && (
        <div className="event-week-calendar-all-day">
          <div className="event-week-calendar-all-day-label">All Day</div>
          <div className="event-week-calendar-all-day-grid">
            {weekDays.map(day => {
              const dateKey = formatDateKey(day);
              const dayAllDayEvents = allDayEvents.filter(event => {
                const eventDates = getEventDateSpan(event);
                return eventDates.includes(dateKey);
              });

              return (
                <div key={dateKey} className="event-week-calendar-all-day-column">
                  {dayAllDayEvents.map(event => (
                    <button
                      key={event.id}
                      className="event-week-calendar-all-day-event"
                      style={{ backgroundColor: getSpaceColor(event.space.id) }}
                      onClick={() => handleEventClick(event)}
                      title={event.title}
                    >
                      <span className="event-week-calendar-all-day-event-title">
                        {event.title}
                      </span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week Grid */}
      <div className="event-week-calendar-grid">
        {/* Time column */}
        <div className="event-week-calendar-times">
          <div className="event-week-calendar-corner"></div>
          {timeSlots.map((time, index) => (
            <div key={index} className="event-week-calendar-time">
              {time}
            </div>
          ))}
        </div>

        {/* Days columns */}
        {weekDays.map((day, dayIndex) => {
          const dateKey = formatDateKey(day);
          const dayEvents = eventsByDay.get(dateKey) || [];
          const isTodayCell = isToday(day);

          return (
            <div key={dateKey} className="event-week-calendar-day-column">
              {/* Day header */}
              <div className={`event-week-calendar-day-header ${isTodayCell ? 'event-week-calendar-day-header--today' : ''}`}>
                <div className="event-week-calendar-day-name">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`event-week-calendar-day-number ${isTodayCell ? 'event-week-calendar-day-number--today' : ''}`}>
                  {day.getDate()}
                </div>
              </div>

              {/* Time slots grid */}
              <div className="event-week-calendar-day-grid">
                {/* Hour lines */}
                {timeSlots.map((_, index) => (
                  <div key={index} className="event-week-calendar-hour-slot"></div>
                ))}

                {/* Events */}
                {dayEvents.map(event => {
                  const { top, height } = getEventTimelinePosition(event);
                  return (
                    <button
                      key={event.id}
                      className="event-week-calendar-event"
                      style={{
                        top: `${top}%`,
                        height: `${height}%`,
                        backgroundColor: getSpaceColor(event.space.id),
                      }}
                      onClick={() => handleEventClick(event)}
                      title={event.title}
                    >
                      <div className="event-week-calendar-event-time">
                        {new Date(event.eventStart).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="event-week-calendar-event-title">
                        {event.title}
                      </div>
                    </button>
                  );
                })}

                {/* Current time indicator */}
                {isTodayCell && isCurrentWeek && (
                  <div
                    className="event-week-calendar-now-line"
                    style={{ top: `${currentHourPercent}%` }}
                  >
                    <div className="event-week-calendar-now-dot"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
