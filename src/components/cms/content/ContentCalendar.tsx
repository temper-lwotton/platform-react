'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Eye,
  Edit,
  Send,
  AlertCircle,
  CheckCircle,
  Layers,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Filter,
} from 'lucide-react';
import styles from './ContentCalendar.module.scss';

interface ContentVersion {
  id: string;
  versionNumber: number;
  title: string;
  isActive: boolean;
  createdAt: string;
}

interface ScheduledEvent {
  id: string;
  postId: string;
  postTitle: string;
  type: 'publish' | 'version-switch' | 'unpublish';
  scheduledFor: string;
  version?: ContentVersion;
  fromVersion?: ContentVersion;
  toVersion?: ContentVersion;
  status: 'scheduled' | 'completed' | 'failed';
  category: string;
}

export function ContentCalendar() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Dummy scheduled events
  const scheduledEvents: ScheduledEvent[] = [
    {
      id: '1',
      postId: 'p1',
      postTitle: 'Community Guidelines Update',
      type: 'publish',
      scheduledFor: '2024-12-20T10:00:00',
      version: {
        id: 'v1',
        versionNumber: 1,
        title: 'Community Guidelines Update',
        isActive: false,
        createdAt: '2024-12-19T14:00:00',
      },
      status: 'scheduled',
      category: 'Announcements',
    },
    {
      id: '2',
      postId: 'p2',
      postTitle: 'Holiday Hours Announcement',
      type: 'version-switch',
      scheduledFor: '2024-12-24T00:00:00',
      fromVersion: {
        id: 'v2',
        versionNumber: 1,
        title: 'Holiday Hours Announcement',
        isActive: true,
        createdAt: '2024-12-15T10:00:00',
      },
      toVersion: {
        id: 'v3',
        versionNumber: 2,
        title: 'Holiday Hours - Extended Version',
        isActive: false,
        createdAt: '2024-12-18T16:00:00',
      },
      status: 'scheduled',
      category: 'Updates',
    },
    {
      id: '3',
      postId: 'p2',
      postTitle: 'Holiday Hours Announcement',
      type: 'version-switch',
      scheduledFor: '2024-12-27T00:00:00',
      fromVersion: {
        id: 'v3',
        versionNumber: 2,
        title: 'Holiday Hours - Extended Version',
        isActive: false,
        createdAt: '2024-12-18T16:00:00',
      },
      toVersion: {
        id: 'v2',
        versionNumber: 1,
        title: 'Holiday Hours Announcement',
        isActive: true,
        createdAt: '2024-12-15T10:00:00',
      },
      status: 'scheduled',
      category: 'Updates',
    },
    {
      id: '4',
      postId: 'p3',
      postTitle: 'New Year Sale',
      type: 'publish',
      scheduledFor: '2024-12-31T08:00:00',
      version: {
        id: 'v4',
        versionNumber: 1,
        title: 'New Year Sale',
        isActive: false,
        createdAt: '2024-12-19T11:00:00',
      },
      status: 'scheduled',
      category: 'Events',
    },
    {
      id: '5',
      postId: 'p3',
      postTitle: 'New Year Sale',
      type: 'unpublish',
      scheduledFor: '2025-01-05T23:59:00',
      status: 'scheduled',
      category: 'Events',
    },
    {
      id: '6',
      postId: 'p4',
      postTitle: 'Q4 Community Highlights',
      type: 'publish',
      scheduledFor: '2024-12-22T14:00:00',
      version: {
        id: 'v5',
        versionNumber: 1,
        title: 'Q4 Community Highlights',
        isActive: false,
        createdAt: '2024-12-19T09:00:00',
      },
      status: 'scheduled',
      category: 'Community',
    },
  ];

  const categories = ['all', 'Announcements', 'Updates', 'Events', 'Community', 'Guides'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, firstDay, lastDay };
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduledEvents.filter((event) => {
      const eventDate = new Date(event.scheduledFor).toISOString().split('T')[0];
      const matchesDate = eventDate === dateStr;
      const matchesFilter = filterCategory === 'all' || event.category === filterCategory;
      return matchesDate && matchesFilter;
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className={styles.calendarDayEmpty} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const events = getEventsForDate(date);
      const isToday =
        date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`${styles.calendarDay} ${isToday ? styles.today : ''} ${
            isSelected ? styles.selected : ''
          } ${events.length > 0 ? styles.hasEvents : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={styles.dayNumber}>{day}</div>
          {events.length > 0 && (
            <div className={styles.dayEvents}>
              {events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className={`${styles.eventDot} ${styles[event.type]}`}
                  title={event.postTitle}
                />
              ))}
              {events.length > 3 && (
                <div className={styles.moreEvents}>+{events.length - 3}</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const getEventIcon = (type: ScheduledEvent['type']) => {
    switch (type) {
      case 'publish':
        return <Send />;
      case 'version-switch':
        return <Layers />;
      case 'unpublish':
        return <Eye />;
      default:
        return <Clock />;
    }
  };

  const getEventTypeLabel = (type: ScheduledEvent['type']) => {
    switch (type) {
      case 'publish':
        return 'Publish';
      case 'version-switch':
        return 'Version Switch';
      case 'unpublish':
        return 'Unpublish';
      default:
        return type;
    }
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className={styles.calendarContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>Content Calendar</h1>
            <p>Schedule posts, manage versions, and plan your content strategy</p>
          </div>
          <button
            onClick={() => router.push('/admin/content/new')}
            className={styles.primaryButton}
          >
            <Plus />
            Schedule Content
          </button>
        </div>
      </div>

      {/* AI Insights */}
      <div className={styles.aiInsights}>
        <div className={styles.insightCard}>
          <Sparkles />
          <div>
            <strong>Optimal Publishing Times This Week</strong>
            <p>Tuesday 10 AM, Wednesday 2 PM, and Thursday 10 AM show highest engagement</p>
          </div>
        </div>
        <div className={styles.insightCard}>
          <AlertCircle />
          <div>
            <strong>Version Switch Scheduled</strong>
            <p>2 posts will automatically switch versions in the next 7 days</p>
          </div>
        </div>
      </div>

      <div className={styles.calendarLayout}>
        {/* Calendar View */}
        <div className={styles.calendarSection}>
          <div className={styles.calendarControls}>
            <div className={styles.monthNavigation}>
              <button onClick={previousMonth} className={styles.navButton}>
                <ChevronLeft />
              </button>
              <h2>
                {currentDate.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h2>
              <button onClick={nextMonth} className={styles.navButton}>
                <ChevronRight />
              </button>
            </div>

            <div className={styles.calendarActions}>
              <button onClick={goToToday} className={styles.todayButton}>
                Today
              </button>

              <div className={styles.filterDropdown}>
                <Filter />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.calendar}>
            <div className={styles.calendarHeader}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className={styles.calendarHeaderDay}>
                  {day}
                </div>
              ))}
            </div>
            <div className={styles.calendarGrid}>{renderCalendar()}</div>
          </div>

          {/* Legend */}
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.publish}`} />
              <span>Publish</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles['version-switch']}`} />
              <span>Version Switch</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.unpublish}`} />
              <span>Unpublish</span>
            </div>
          </div>
        </div>

        {/* Events Sidebar */}
        <div className={styles.eventsSidebar}>
          <div className={styles.sidebarHeader}>
            <h3>
              {selectedDate
                ? selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'All Scheduled Events'}
            </h3>
            {selectedDate && (
              <button onClick={() => setSelectedDate(null)} className={styles.clearButton}>
                View All
              </button>
            )}
          </div>

          <div className={styles.eventsList}>
            {selectedDateEvents.length === 0 && selectedDate && (
              <div className={styles.noEvents}>
                <CalendarIcon />
                <p>No events scheduled for this day</p>
                <button className={styles.addEventButton}>
                  <Plus />
                  Schedule Content
                </button>
              </div>
            )}

            {!selectedDate &&
              scheduledEvents
                .filter(
                  (event) => filterCategory === 'all' || event.category === filterCategory
                )
                .sort(
                  (a, b) =>
                    new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
                )
                .map((event) => (
                  <div key={event.id} className={styles.eventCard}>
                    <div className={styles.eventHeader}>
                      <div className={`${styles.eventType} ${styles[event.type]}`}>
                        {getEventIcon(event.type)}
                        <span>{getEventTypeLabel(event.type)}</span>
                      </div>
                      <span className={styles.eventCategory}>{event.category}</span>
                    </div>

                    <h4>{event.postTitle}</h4>

                    <div className={styles.eventTime}>
                      <Clock />
                      <span>
                        {new Date(event.scheduledFor).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        at{' '}
                        {new Date(event.scheduledFor).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {event.type === 'version-switch' && event.fromVersion && event.toVersion && (
                      <div className={styles.versionSwitch}>
                        <div className={styles.versionInfo}>
                          <span className={styles.versionLabel}>From</span>
                          <div className={styles.versionTag}>
                            v{event.fromVersion.versionNumber}
                          </div>
                        </div>
                        <ArrowRight className={styles.switchArrow} />
                        <div className={styles.versionInfo}>
                          <span className={styles.versionLabel}>To</span>
                          <div className={styles.versionTag}>
                            v{event.toVersion.versionNumber}
                          </div>
                        </div>
                      </div>
                    )}

                    {event.version && event.type === 'publish' && (
                      <div className={styles.versionBadge}>
                        <Layers />
                        Version {event.version.versionNumber}
                      </div>
                    )}

                    <div className={styles.eventActions}>
                      <button className={styles.actionButton}>
                        <Edit />
                        Edit
                      </button>
                      <button className={styles.actionButton}>
                        <Eye />
                        Preview
                      </button>
                    </div>
                  </div>
                ))}

            {selectedDateEvents.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventHeader}>
                  <div className={`${styles.eventType} ${styles[event.type]}`}>
                    {getEventIcon(event.type)}
                    <span>{getEventTypeLabel(event.type)}</span>
                  </div>
                  <span className={styles.eventCategory}>{event.category}</span>
                </div>

                <h4>{event.postTitle}</h4>

                <div className={styles.eventTime}>
                  <Clock />
                  <span>
                    {new Date(event.scheduledFor).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {event.type === 'version-switch' && event.fromVersion && event.toVersion && (
                  <div className={styles.versionSwitch}>
                    <div className={styles.versionInfo}>
                      <span className={styles.versionLabel}>From</span>
                      <div className={styles.versionTag}>v{event.fromVersion.versionNumber}</div>
                    </div>
                    <ArrowRight className={styles.switchArrow} />
                    <div className={styles.versionInfo}>
                      <span className={styles.versionLabel}>To</span>
                      <div className={styles.versionTag}>v{event.toVersion.versionNumber}</div>
                    </div>
                  </div>
                )}

                {event.version && event.type === 'publish' && (
                  <div className={styles.versionBadge}>
                    <Layers />
                    Version {event.version.versionNumber}
                  </div>
                )}

                <div className={styles.eventActions}>
                  <button className={styles.actionButton}>
                    <Edit />
                    Edit
                  </button>
                  <button className={styles.actionButton}>
                    <Eye />
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
