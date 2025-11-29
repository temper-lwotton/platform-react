'use client';

import * as HoverCard from '@radix-ui/react-hover-card';
import * as Avatar from '@radix-ui/react-avatar';
import { MentionUser } from '@/hooks/useMentions';
import Link from 'next/link';
import styles from './MentionHoverCard.module.scss';

interface MentionHoverCardProps {
    user: MentionUser;
    children: React.ReactNode;
}

export function MentionHoverCard({ user, children }: MentionHoverCardProps) {
    const getUserInitials = (name: string): string => {
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    };

    return (
        <HoverCard.Root openDelay={200} closeDelay={100}>
            <HoverCard.Trigger asChild>
                {children}
            </HoverCard.Trigger>
            <HoverCard.Portal>
                <HoverCard.Content
                    className={styles.card}
                    sideOffset={5}
                    side="top"
                >
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <Avatar.Root className={styles.avatar}>
                                {user.avatar && (
                                    <Avatar.Image src={user.avatar} alt={user.name} />
                                )}
                                <Avatar.Fallback className={styles.avatarFallback}>
                                    {getUserInitials(user.name)}
                                </Avatar.Fallback>
                            </Avatar.Root>
                            <div className={styles.info}>
                                <div className={styles.name}>{user.name}</div>
                                {user.email && (
                                    <div className={styles.email}>{user.email}</div>
                                )}
                            </div>
                        </div>
                        <Link
                            href={`/users/${user.id}`}
                            className={styles.link}
                        >
                            View Profile →
                        </Link>
                    </div>
                    <HoverCard.Arrow className={styles.arrow} />
                </HoverCard.Content>
            </HoverCard.Portal>
        </HoverCard.Root>
    );
}
