'use client';

import Link from 'next/link';
import * as Avatar from '@radix-ui/react-avatar';
import { Space, SpaceUser } from '@/lib/spaces';

interface SpaceCardProps {
    space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
    const allMembers = [...space.admins, ...space.members];
    const memberCount = allMembers.length;
    const displayMembers = allMembers.slice(0, 5);

    const getUserInitials = (user: SpaceUser): string => {
        if (user.profile?.fullName) {
            const names = user.profile.fullName.split(' ');
            if (names.length >= 2) {
                return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
            }
            return user.profile.fullName.charAt(0).toUpperCase();
        }
        if (user.profile?.firstName && user.profile?.lastName) {
            return `${user.profile.firstName[0]}${user.profile.lastName[0]}`.toUpperCase();
        }
        if (user.profile?.firstName) {
            return user.profile.firstName.charAt(0).toUpperCase();
        }
        if (user.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return '?';
    };

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
                    <div className="space-card-members-section">
                        {displayMembers.length > 0 && (
                            <div className="space-card-avatars" aria-label={`${memberCount} members`}>
                                {displayMembers.map((member, index) => (
                                    <Avatar.Root key={member.id} className="space-card-member-avatar">
                                        {member.profile?.photo && (
                                            <Avatar.Image
                                                src={member.profile.photo}
                                                alt={member.profile.fullName || member.email || 'Member'}
                                                className="space-card-member-avatar-image"
                                            />
                                        )}
                                        <Avatar.Fallback className="space-card-member-avatar-fallback">
                                            {getUserInitials(member)}
                                        </Avatar.Fallback>
                                    </Avatar.Root>
                                ))}
                            </div>
                        )}
                        <span className="space-card-members-count">
                            {memberCount} member{memberCount !== 1 ? 's' : ''}
                        </span>
                    </div>
                </footer>
            </article>
        </Link>
    );
}
