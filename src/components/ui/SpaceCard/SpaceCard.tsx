'use client';

import Link from 'next/link';
import * as Avatar from '@radix-ui/react-avatar';
import { Space, SpaceUser } from '@/lib/spaces';
import styles from './SpaceCard.module.scss';

interface SpaceCardProps {
    space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
    // Deduplicate members by ID
    const allMembersMap = new Map();
    [...space.admins, ...space.members].forEach(member => {
        if (member.id && !allMembersMap.has(member.id)) {
            allMembersMap.set(member.id, member);
        }
    });
    const allMembers = Array.from(allMembersMap.values());
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
        <Link href={`/spaces/${space.id}`} className={styles.card}>
            <article className={styles.content}>
                <header className={styles.header}>
                    <Avatar.Root className={styles.icon}>
                        <Avatar.Fallback className={styles.iconFallback}>
                            {space.title.charAt(0).toUpperCase()}
                        </Avatar.Fallback>
                    </Avatar.Root>
                    <div className={styles.titleGroup}>
                        <h3 className={styles.title}>{space.title}</h3>
                        {space.subtitle && (
                            <p className={styles.subtitle}>{space.subtitle}</p>
                        )}
                    </div>
                </header>
                {space.description && (
                    <p className={styles.description}>{space.description}</p>
                )}
                <footer className={styles.footer}>
                    <span
                        className={styles.badge}
                        data-public={space.isPublic}
                        role="status"
                        aria-label={space.isPublic ? 'Public space' : 'Private space'}
                    >
                        {space.isPublic ? 'Public' : 'Private'}
                    </span>
                    <div className={styles.membersSection}>
                        {displayMembers.length > 0 && (
                            <div className={styles.avatars} aria-label={`${memberCount} members`}>
                                {displayMembers.map((member, index) => (
                                    <Avatar.Root key={member.id} className={styles.memberAvatar}>
                                        {member.profile?.photo && (
                                            <Avatar.Image
                                                src={member.profile.photo}
                                                alt={member.profile.fullName || member.email || 'Member'}
                                                className={styles.memberAvatarImage}
                                            />
                                        )}
                                        <Avatar.Fallback className={styles.memberAvatarFallback}>
                                            {getUserInitials(member)}
                                        </Avatar.Fallback>
                                    </Avatar.Root>
                                ))}
                            </div>
                        )}
                        <span className={styles.membersCount}>
                            {memberCount} member{memberCount !== 1 ? 's' : ''}
                        </span>
                    </div>
                </footer>
            </article>
        </Link>
    );
}
