import { Event } from './events';

/**
 * Calendar Date Interface
 * Represents a single day in the calendar grid
 */
export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  dateKey: string; // Format: "2025-11-27"
}

/**
 * Get the name of a month from its index (0-11)
 */
export function getMonthName(monthIndex: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex] || 'Unknown';
}

/**
 * Get short month name (3 letters)
 */
export function getShortMonthName(monthIndex: number): string {
  return getMonthName(monthIndex).slice(0, 3);
}

/**
 * Get weekday names
 */
export function getWeekdayNames(short: boolean = false): string[] {
  const full = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return short ? full.map(day => day.slice(0, 2)) : full;
}

/**
 * Format a date as a consistent key for grouping (YYYY-MM-DD)
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDateKey(date1) === formatDateKey(date2);
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Check if two dates are in the same month
 */
export function isSameMonth(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth();
}

/**
 * Check if a date is in the past (before today)
 */
export function isPastDay(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}

/**
 * Get all days to display in a calendar month grid
 * Includes padding days from previous and next months
 */
export function getDaysInMonth(year: number, month: number): CalendarDay[] {
  const days: CalendarDay[] = [];
  const today = new Date();

  // First day of the month
  const firstDay = new Date(year, month, 1);
  const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 6 = Saturday

  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);
  const lastDate = lastDay.getDate();

  // Previous month padding
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const prevMonthLastDate = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

  // Add previous month's trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(prevMonthYear, prevMonth, prevMonthLastDate - i);
    days.push({
      date,
      dayNumber: prevMonthLastDate - i,
      isCurrentMonth: false,
      isToday: isToday(date),
      isPast: isPastDay(date),
      dateKey: formatDateKey(date),
    });
  }

  // Add current month's days
  for (let day = 1; day <= lastDate; day++) {
    const date = new Date(year, month, day);
    days.push({
      date,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: isToday(date),
      isPast: isPastDay(date),
      dateKey: formatDateKey(date),
    });
  }

  // Next month padding (to complete the grid to 6 rows if needed)
  const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;

  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(nextMonthYear, nextMonth, day);
    days.push({
      date,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: isToday(date),
      isPast: isPastDay(date),
      dateKey: formatDateKey(date),
    });
  }

  return days;
}

/**
 * Group events by their date
 * Returns a Map with date keys (YYYY-MM-DD) as keys
 */
export function groupEventsByDate(events: Event[]): Map<string, Event[]> {
  const grouped = new Map<string, Event[]>();

  events.forEach(event => {
    const startDate = new Date(event.eventStart);
    const dateKey = formatDateKey(startDate);

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(event);
  });

  // Sort events within each day by start time
  grouped.forEach((eventList) => {
    eventList.sort((a, b) => {
      return new Date(a.eventStart).getTime() - new Date(b.eventStart).getTime();
    });
  });

  return grouped;
}

/**
 * Get all dates that an event spans (for multi-day events)
 */
export function getEventDateSpan(event: Event): string[] {
  const dates: string[] = [];
  const start = new Date(event.eventStart);
  const end = new Date(event.eventEnd);

  // Set to start of day for comparison
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const current = new Date(start);
  while (current <= end) {
    dates.push(formatDateKey(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Check if an event is a multi-day event
 */
export function isMultiDayEvent(event: Event): boolean {
  const start = new Date(event.eventStart);
  const end = new Date(event.eventEnd);
  return !isSameDay(start, end);
}

/**
 * Check if an event is an all-day event
 * An event is considered all-day if:
 * - It starts at midnight (00:00) and ends at or near midnight the next day
 * - Or it spans exactly 24 hours from any start time
 */
export function isAllDayEvent(event: Event): boolean {
  const start = new Date(event.eventStart);
  const end = new Date(event.eventEnd);

  // Check if start is at midnight
  const startHour = start.getHours();
  const startMinute = start.getMinutes();
  const isStartMidnight = startHour === 0 && startMinute === 0;

  // Check if end is at or near midnight
  const endHour = end.getHours();
  const endMinute = end.getMinutes();
  const isEndMidnight = (endHour === 0 && endMinute === 0) || (endHour === 23 && endMinute === 59);

  // If starts and ends at midnight boundaries, it's all-day
  if (isStartMidnight && isEndMidnight) {
    return true;
  }

  // Check if it spans exactly 24 hours (or multiple of 24)
  const durationMs = end.getTime() - start.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  if (durationHours >= 24 && durationHours % 24 === 0) {
    return true;
  }

  return false;
}

/**
 * Get the duration of an event in days
 */
export function getEventDurationDays(event: Event): number {
  return getEventDateSpan(event).length;
}

/**
 * Get the week number of the year for a date (ISO week)
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Get the start and end dates of a week containing the given date
 */
export function getWeekBounds(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // Go to Sunday
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Go to Saturday
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/**
 * Get all days in a week
 */
export function getDaysInWeek(date: Date): Date[] {
  const { start } = getWeekBounds(date);
  const days: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }

  return days;
}

/**
 * Format time from date (e.g., "2:30 PM")
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format date range for display (e.g., "Nov 27 - Dec 2")
 */
export function formatDateRange(start: Date | string, end: Date | string): string {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;

  if (isSameDay(startDate, endDate)) {
    return startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  if (startDate.getMonth() === endDate.getMonth()) {
    return `${getShortMonthName(startDate.getMonth())} ${startDate.getDate()} - ${endDate.getDate()}`;
  }

  return `${getShortMonthName(startDate.getMonth())} ${startDate.getDate()} - ${getShortMonthName(endDate.getMonth())} ${endDate.getDate()}`;
}

/**
 * Get time slots for a day (hourly from 12 AM to 11 PM)
 */
export function getTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    slots.push(formatTime(date));
  }
  return slots;
}

/**
 * Calculate the position and height of an event in a timeline view
 * Returns percentage values for top and height
 */
export function getEventTimelinePosition(event: Event): { top: number; height: number } {
  const start = new Date(event.eventStart);
  const end = new Date(event.eventEnd);

  // Calculate start position (0-100%)
  const startHour = start.getHours() + start.getMinutes() / 60;
  const top = (startHour / 24) * 100;

  // Calculate duration in hours
  const durationMs = end.getTime() - start.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  const height = Math.max((durationHours / 24) * 100, 2); // Minimum 2% height

  return { top, height };
}

/**
 * Group events by their space for color coding
 */
export function groupEventsBySpace(events: Event[]): Map<number, Event[]> {
  const grouped = new Map<number, Event[]>();

  events.forEach(event => {
    const spaceId = event.space.id;
    if (!grouped.has(spaceId)) {
      grouped.set(spaceId, []);
    }
    grouped.get(spaceId)!.push(event);
  });

  return grouped;
}

/**
 * Get a color for a space (consistent hashing)
 */
export function getSpaceColor(spaceId: number): string {
  const colors = [
    '#ef4444', // red
    '#f97316', // orange
    '#f59e0b', // amber
    '#eab308', // yellow
    '#84cc16', // lime
    '#22c55e', // green
    '#10b981', // emerald
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#0ea5e9', // sky
    '#3b82f6', // blue
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#a855f7', // purple
    '#d946ef', // fuchsia
    '#ec4899', // pink
  ];

  return colors[spaceId % colors.length];
}

/**
 * Check if an event is happening now
 */
export function isEventHappeningNow(event: Event): boolean {
  const now = new Date();
  const start = new Date(event.eventStart);
  const end = new Date(event.eventEnd);
  return start <= now && end >= now;
}

/**
 * Get events for a specific date
 */
export function getEventsForDate(events: Event[], date: Date): Event[] {
  const dateKey = formatDateKey(date);
  return events.filter(event => {
    const eventDates = getEventDateSpan(event);
    return eventDates.includes(dateKey);
  });
}

/**
 * Get events for a specific week
 */
export function getEventsForWeek(events: Event[], date: Date): Event[] {
  const { start, end } = getWeekBounds(date);
  return events.filter(event => {
    const eventStart = new Date(event.eventStart);
    const eventEnd = new Date(event.eventEnd);
    // Event overlaps with week if it starts before week ends and ends after week starts
    return eventStart <= end && eventEnd >= start;
  });
}

/**
 * Format a date to iCalendar format (YYYYMMDDTHHmmssZ)
 */
function formatICalDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  const seconds = String(d.getUTCSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Escape special characters for iCalendar format
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Strip HTML tags from a string
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Convert a single event to iCalendar (.ics) format
 */
export function eventToICS(event: Event): string {
  const now = new Date();
  const uid = `event-${event.id}@spaces-app`;
  const dtstamp = formatICalDate(now);
  const dtstart = formatICalDate(event.eventStart);
  const dtend = formatICalDate(event.eventEnd);
  const summary = escapeICalText(event.title);

  // Get description from htmlContent, strip HTML
  const description = event.htmlContent
    ? escapeICalText(stripHtml(event.htmlContent))
    : '';

  const location = event.location ? escapeICalText(event.location) : '';
  const url = event.isOnline && event.location ? escapeICalText(event.location) : '';

  let icsContent = 'BEGIN:VEVENT\r\n';
  icsContent += `UID:${uid}\r\n`;
  icsContent += `DTSTAMP:${dtstamp}\r\n`;
  icsContent += `DTSTART:${dtstart}\r\n`;
  icsContent += `DTEND:${dtend}\r\n`;
  icsContent += `SUMMARY:${summary}\r\n`;

  if (description) {
    icsContent += `DESCRIPTION:${description}\r\n`;
  }

  if (location && !event.isOnline) {
    icsContent += `LOCATION:${location}\r\n`;
  }

  if (url && event.isOnline) {
    icsContent += `URL:${url}\r\n`;
  }

  icsContent += 'END:VEVENT\r\n';

  return icsContent;
}

/**
 * Convert multiple events to a single iCalendar (.ics) file
 */
export function eventsToICS(events: Event[]): string {
  let icsContent = 'BEGIN:VCALENDAR\r\n';
  icsContent += 'VERSION:2.0\r\n';
  icsContent += 'PRODID:-//Spaces App//Events Calendar//EN\r\n';
  icsContent += 'CALSCALE:GREGORIAN\r\n';
  icsContent += 'METHOD:PUBLISH\r\n';

  events.forEach(event => {
    icsContent += eventToICS(event);
  });

  icsContent += 'END:VCALENDAR\r\n';

  return icsContent;
}

/**
 * Download events as .ics file
 */
export function downloadICS(events: Event[], filename: string = 'events.ics'): void {
  const icsContent = eventsToICS(events);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Download a single event as .ics file
 */
export function downloadEventICS(event: Event): void {
  const filename = `${event.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
  downloadICS([event], filename);
}
