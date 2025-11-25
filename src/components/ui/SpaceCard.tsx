'use client';

import Link from 'next/link';
import * as Avatar from '@radix-ui/react-avatar';
import { Space } from '@/lib/spaces';

interface SpaceCardProps {
    space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
    const memberCount = space.members.length + space.admins.length;

    return (
        <Link href={`/spaces/${space.id}`} className="space-card">
            <article className="space-card-content">
                <header className="space-card-header">
                    <Avatar.Root className="space-card-icon">
                        <Avatar.Fallback className="space-card-icon-fallback">
                            {space.title.charAt(0).toUpperCase()}
                        </Avatar.Fallback>
                    </Avatar.Root>
                    <div className="space-card-title-group">
                        <h3 className="space-card-title">{space.title}</h3>
                        {space.subtitle && (
                            <p className="space-card-subtitle">{space.subtitle}</p>
                        )}
                    </div>
                </header>
                {space.description && (
                    <p className="space-card-description">{space.description}</p>
                )}
                <footer className="space-card-footer">
                    <span
                        className="space-card-badge"
                        data-public={space.isPublic}
                        role="status"
                        aria-label={space.isPublic ? 'Public space' : 'Private space'}
                    >
                        {space.isPublic ? 'Public' : 'Private'}
                    </span>
                    <span className="space-card-members" aria-label={`${memberCount} members`}>
                        {memberCount} member{memberCount !== 1 ? 's' : ''}
                    </span>
                </footer>
            </article>
        </Link>
    );
}
