'use client';

import Link from 'next/link';
import * as Avatar from '@radix-ui/react-avatar';
import { User } from '@/lib/users';

interface NewestMembersProps {
    users: User[];
    isLoading?: boolean;
}

export function NewestMembers({ users, isLoading }: NewestMembersProps) {
    if (isLoading) {
        return (
            <aside className="newest-members">
                <h2 className="newest-members-title">Newest Members</h2>
                <div className="newest-members-loading">
                    <p>Loading...</p>
                </div>
            </aside>
        );
    }

    if (!users || users.length === 0) {
        return (
            <aside className="newest-members">
                <h2 className="newest-members-title">Newest Members</h2>
                <div className="newest-members-empty">
                    <p>No new members yet</p>
                </div>
            </aside>
        );
    }

    return (
        <aside className="newest-members">
            <h2 className="newest-members-title">Newest Members</h2>
            <ul className="newest-members-list">
                {users.map((user) => {
                    const { profile } = user;
                    const displayName =
                        profile.fullName ||
                        `${profile.firstName || ''} ${profile.lastName || ''}`.trim() ||
                        'Unknown User';
                    const initials = getInitials(displayName);
                    const joinDate = new Date(user.createdAt);
                    const daysAgo = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

                    return (
                        <li key={user.id} className="newest-members-item">
                            <Link href={`/users/${user.id}`} className="newest-members-link">
                                <Avatar.Root className="newest-members-avatar">
                                    {profile.photo && (
                                        <Avatar.Image
                                            src={profile.photo}
                                            alt={displayName}
                                            className="newest-members-avatar-img"
                                        />
                                    )}
                                    <Avatar.Fallback
                                        className="newest-members-avatar-fallback"
                                        delayMs={profile.photo ? 600 : 0}
                                    >
                                        {initials}
                                    </Avatar.Fallback>
                                </Avatar.Root>

                                <div className="newest-members-info">
                                    <span className="newest-members-name">{displayName}</span>
                                    {profile.jobTitle && (
                                        <span className="newest-members-title">{profile.jobTitle}</span>
                                    )}
                                    <span className="newest-members-date">
                                        {daysAgo === 0 ? 'Joined today' :
                                         daysAgo === 1 ? 'Joined yesterday' :
                                         daysAgo < 7 ? `Joined ${daysAgo} days ago` :
                                         `Joined ${joinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
}
