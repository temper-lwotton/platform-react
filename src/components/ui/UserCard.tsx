'use client';

import Link from 'next/link';
import { User } from '@/lib/users';

interface UserCardProps {
    user: User;
}

export function UserCard({ user }: UserCardProps) {
    const { profile } = user;
    const displayName = profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Unknown User';
    const initials = getInitials(displayName);
    const spaceCount = user.adminSpaces.length + user.memberSpaces.length;

    return (
        <Link href={`/users/${user.id}`} className="user-card">
            <div className="user-card-header">
                {profile.photo ? (
                    <img src={profile.photo} alt={displayName} className="user-card-avatar" />
                ) : (
                    <div className="user-card-avatar user-card-avatar--placeholder">
                        {initials}
                    </div>
                )}
                <div className="user-card-info">
                    <h3 className="user-card-name">{displayName}</h3>
                    {profile.jobTitle && (
                        <span className="user-card-title">{profile.jobTitle}</span>
                    )}
                    {profile.companyName && (
                        <span className="user-card-company">{profile.companyName}</span>
                    )}
                </div>
            </div>
            <div className="user-card-footer">
                <span className="user-card-email">{user.email}</span>
                <span className="user-card-spaces">{spaceCount} space{spaceCount !== 1 ? 's' : ''}</span>
            </div>
        </Link>
    );
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
}
