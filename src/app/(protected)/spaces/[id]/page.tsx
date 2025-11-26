'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getSpace } from '@/lib/spaces';
import { getEvents, Event } from '@/lib/events';
import { EventCard } from '@/components/ui/EventCard';
import Link from 'next/link';

export default function SpaceOverviewPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: space } = useQuery({
        queryKey: ['space', id],
        queryFn: () => getSpace(id),
        enabled: !!id,
    });

    // Fetch upcoming events for this space
    const { data: events } = useQuery<Event[]>({
        queryKey: ['space-events', id],
        queryFn: () => getEvents({ space: parseInt(id), sort: 'asc' }),
        enabled: !!id,
    });

    // Filter to show only upcoming events
    const upcomingEvents = events?.filter(event => {
        return new Date(event.eventEnd) >= new Date();
    }).slice(0, 3); // Show max 3 upcoming events

    if (!space) return null;

    const memberCount = space.members.length + space.admins.length;

    return (
        <div className="space-overview">
            <header className="space-overview-header">
                <div className="space-overview-icon">
                    {space.title.charAt(0).toUpperCase()}
                </div>
                <div className="space-overview-info">
                    <h1 className="space-overview-title">{space.title}</h1>
                    {space.subtitle && <p className="space-overview-subtitle">{space.subtitle}</p>}
                    <div className="space-overview-meta">
                        <span className={`space-overview-badge ${space.isPublic ? 'space-overview-badge--public' : 'space-overview-badge--private'}`}>
                            {space.isPublic ? 'Public' : 'Private'}
                        </span>
                        <span className="space-overview-members">{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            </header>

            {space.description && (
                <section className="space-overview-section">
                    <h2 className="space-overview-section-title">About</h2>
                    <p className="space-overview-description">{space.description}</p>
                </section>
            )}

            {(space.admins.length > 0 || space.members.length > 0) && (
                <section className="space-overview-section">
                    <h2 className="space-overview-section-title">Members</h2>
                    <div className="space-overview-member-counts">
                        <div className="space-overview-member-stat">
                            <span className="space-overview-stat-value">{space.admins.length}</span>
                            <span className="space-overview-stat-label">Admin{space.admins.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="space-overview-member-stat">
                            <span className="space-overview-stat-value">{space.members.length}</span>
                            <span className="space-overview-stat-label">Member{space.members.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </section>
            )}

            {/* Upcoming Events Section */}
            {upcomingEvents && upcomingEvents.length > 0 && (
                <section className="space-overview-section">
                    <div className="space-overview-section-header">
                        <h2 className="space-overview-section-title">Upcoming Events</h2>
                        <Link href={`/spaces/${id}/events`} className="space-overview-view-all">
                            View all events →
                        </Link>
                    </div>
                    <div className="space-overview-events-grid">
                        {upcomingEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
