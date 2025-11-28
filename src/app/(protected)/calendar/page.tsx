'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEvents, Event } from '@/lib/events';
import { MOCK_TASKS } from '@/lib/tasks';
import { fetchCurrentUser } from '@/lib/auth';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

type CalendarView = 'month' | 'week' | 'day';

interface CalendarEvent {
    id: string;
    type: 'event' | 'task';
    title: string;
    start: Date;
    end: Date;
    color: string;
    spaceTitle?: string;
    spaceId?: string;
    url: string;
}

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarView>('month');

    // Fetch user data to get accessible spaces
    const { data: userData } = useQuery({
        queryKey: ['current-user'],
        queryFn: fetchCurrentUser,
    });

    // Fetch all events
    const { data: events } = useQuery<Event[]>({
        queryKey: ['all-events'],
        queryFn: () => getEvents({ sort: 'asc' }),
    });

    // Combine events and tasks into calendar items
    const calendarItems = useMemo<CalendarEvent[]>(() => {
        const items: CalendarEvent[] = [];

        // Add events
        if (events) {
            events.forEach(event => {
                items.push({
                    id: `event-${event.id}`,
                    type: 'event',
                    title: event.title,
                    start: new Date(event.eventStart),
                    end: new Date(event.eventEnd),
                    color: '#3b82f6', // Blue for events
                    spaceTitle: typeof event.space === 'object' ? event.space.title : undefined,
                    spaceId: typeof event.space === 'object' ? String(event.space.id) : String(event.space),
                    url: `/events/${event.id}`
                });
            });
        }

        // Add tasks with due dates
        MOCK_TASKS.forEach(task => {
            if (task.dueDate) {
                const dueDate = new Date(task.dueDate);
                items.push({
                    id: `task-${task.id}`,
                    type: 'task',
                    title: task.title,
                    start: dueDate,
                    end: dueDate,
                    color: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#10b981',
                    url: `/tasks`
                });
            }
        });

        return items.sort((a, b) => a.start.getTime() - b.start.getTime());
    }, [events]);

    // Get days in current month
    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];

        // Add empty slots for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days in month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    }, [currentDate]);

    // Get items for a specific day
    const getItemsForDay = (date: Date | null) => {
        if (!date) return [];
        return calendarItems.filter(item => {
            const itemDate = new Date(item.start);
            return itemDate.getDate() === date.getDate() &&
                   itemDate.getMonth() === date.getMonth() &&
                   itemDate.getFullYear() === date.getFullYear();
        });
    };

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <main className="calendar-page-container">
            <div className="calendar-page-main">
                {/* Header */}
                <header className="calendar-header">
                    <div className="calendar-header-left">
                        <h1 className="calendar-title">My Calendar</h1>
                        <p className="calendar-subtitle">Events and tasks from all your spaces</p>
                    </div>
                    <div className="calendar-header-right">
                        <button className="calendar-today-btn" onClick={goToToday}>
                            Today
                        </button>
                    </div>
                </header>

                {/* Controls */}
                <div className="calendar-controls">
                    <div className="calendar-nav">
                        <button className="calendar-nav-btn" onClick={goToPreviousMonth}>
                            <Icon icon="chevronLeft" size={20} />
                        </button>
                        <h2 className="calendar-month-title">{monthName}</h2>
                        <button className="calendar-nav-btn" onClick={goToNextMonth}>
                            <Icon icon="chevronRight" size={20} />
                        </button>
                    </div>

                    {/* Legend */}
                    <div className="calendar-legend">
                        <div className="calendar-legend-item">
                            <div className="calendar-legend-color" style={{ background: '#3b82f6' }} />
                            <span>Events</span>
                        </div>
                        <div className="calendar-legend-item">
                            <div className="calendar-legend-color" style={{ background: '#ef4444' }} />
                            <span>High Priority Tasks</span>
                        </div>
                        <div className="calendar-legend-item">
                            <div className="calendar-legend-color" style={{ background: '#f59e0b' }} />
                            <span>Medium Priority</span>
                        </div>
                        <div className="calendar-legend-item">
                            <div className="calendar-legend-color" style={{ background: '#10b981' }} />
                            <span>Low Priority</span>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="calendar-grid-container">
                    {/* Day headers */}
                    <div className="calendar-day-headers">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="calendar-day-header">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar days */}
                    <div className="calendar-grid">
                        {daysInMonth.map((date, index) => {
                            const items = getItemsForDay(date);
                            const isToday = date &&
                                date.getDate() === new Date().getDate() &&
                                date.getMonth() === new Date().getMonth() &&
                                date.getFullYear() === new Date().getFullYear();

                            return (
                                <div
                                    key={index}
                                    className={`calendar-day ${!date ? 'calendar-day-empty' : ''} ${isToday ? 'calendar-day-today' : ''}`}
                                >
                                    {date && (
                                        <>
                                            <div className="calendar-day-number">
                                                {date.getDate()}
                                            </div>
                                            <div className="calendar-day-items">
                                                {items.slice(0, 3).map(item => (
                                                    <Link
                                                        key={item.id}
                                                        href={item.url}
                                                        className="calendar-item"
                                                        style={{ borderLeftColor: item.color }}
                                                    >
                                                        <div className="calendar-item-content">
                                                            <Icon icon={item.type === 'event' ? 'calendar' : 'check-square'} size={12} />
                                                            <span className="calendar-item-title">{item.title}</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                                {items.length > 3 && (
                                                    <div className="calendar-item-more">
                                                        +{items.length - 3} more
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Upcoming Section - Right Sidebar */}
            <div className="calendar-page-sidebar">
                <div className="calendar-upcoming">
                    <h3 className="calendar-upcoming-title">
                        <Icon icon="clock" size={18} />
                        Upcoming
                    </h3>
                    <div className="calendar-upcoming-list">
                        {calendarItems.filter(item => item.start >= new Date()).slice(0, 10).map(item => (
                            <Link
                                key={item.id}
                                href={item.url}
                                className="calendar-upcoming-item"
                            >
                                <div className="calendar-upcoming-date">
                                    <div className="calendar-upcoming-day">
                                        {item.start.toLocaleString('default', { day: 'numeric' })}
                                    </div>
                                    <div className="calendar-upcoming-month">
                                        {item.start.toLocaleString('default', { month: 'short' })}
                                    </div>
                                </div>
                                <div className="calendar-upcoming-info">
                                    <div className="calendar-upcoming-item-title">
                                        <Icon icon={item.type === 'event' ? 'calendar' : 'check-square'} size={16} />
                                        {item.title}
                                    </div>
                                    {item.spaceTitle && (
                                        <div className="calendar-upcoming-space">{item.spaceTitle}</div>
                                    )}
                                    <div className="calendar-upcoming-time">
                                        {item.start.toLocaleString('default', {
                                            weekday: 'short',
                                            hour: 'numeric',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                                <div
                                    className="calendar-upcoming-indicator"
                                    style={{ background: item.color }}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
