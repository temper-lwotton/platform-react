'use client';

import Link from 'next/link';
import { Space } from '@/lib/spaces';

interface SpaceCardProps {
    space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
    const memberCount = space.members.length + space.admins.length;

    return (
        <Link href={`/spaces/${space.id}`} className="space-card">
            <div className="space-card-header">
                <div className="space-card-icon">
                    {space.title.charAt(0).toUpperCase()}
                </div>
                <div className="space-card-title-group">
                    <h3 className="space-card-title">{space.title}</h3>
                    {space.subtitle && <span className="space-card-subtitle">{space.subtitle}</span>}
                </div>
            </div>
            {space.description && (
                <p className="space-card-description">{space.description}</p>
            )}
            <div className="space-card-footer">
                <span className={`space-card-badge ${space.isPublic ? 'space-card-badge--public' : 'space-card-badge--private'}`}>
                    {space.isPublic ? 'Public' : 'Private'}
                </span>
                <span className="space-card-members">{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
            </div>
        </Link>
    );
}
