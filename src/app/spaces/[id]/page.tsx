'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getSpace } from '@/lib/spaces';

export default function SpaceOverviewPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: space } = useQuery({
        queryKey: ['space', id],
        queryFn: () => getSpace(id),
        enabled: !!id,
    });

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
        </div>
    );
}
