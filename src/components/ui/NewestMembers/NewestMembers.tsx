'use client';

import Link from 'next/link';
import { User } from '@/lib/users';
import { Avatar } from '../primitives';
import styles from './NewestMembers.module.scss';

interface NewestMembersProps {
    users: User[];
    isLoading?: boolean;
}

export function NewestMembers({ users, isLoading }: NewestMembersProps) {
    if (isLoading) {
        return (
            <aside className={styles.container}>
                <h2 className={styles.title}>Newest Members</h2>
                <div className={styles.loading}>
                    <p>Loading...</p>
                </div>
            </aside>
        );
    }

    if (!users || users.length === 0) {
        return (
            <aside className={styles.container}>
                <h2 className={styles.title}>Newest Members</h2>
                <div className={styles.emptyState}>
                    <p>No new members yet</p>
                </div>
            </aside>
        );
    }

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .filter(Boolean)
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <aside className={styles.container}>
            <h2 className={styles.title}>Newest Members</h2>
            <ul className={styles.list}>
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
                        <li key={user.id} className={styles.item}>
                            <Link href={`/users/${user.id}`} className={styles.link}>
                                <Avatar
                                    src={profile.photo}
                                    alt={displayName}
                                    fallback={initials}
                                    size="sm"
                                />

                                <div className={styles.info}>
                                    <span className={styles.name}>{displayName}</span>
                                    {profile.jobTitle && (
                                        <span className={styles.jobTitle}>{profile.jobTitle}</span>
                                    )}
                                    <span className={styles.joinDate}>
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
