'use client';

import * as HoverCard from '@radix-ui/react-hover-card';
import * as Avatar from '@radix-ui/react-avatar';
import { MentionUser } from '@/hooks/useMentions';
import Link from 'next/link';

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
                    className="mention-hover-card"
                    sideOffset={5}
                    side="top"
                >
                    <div className="mention-hover-card-content">
                        <div className="mention-hover-card-header">
                            <Avatar.Root className="mention-hover-card-avatar">
                                {user.avatar && (
                                    <Avatar.Image src={user.avatar} alt={user.name} />
                                )}
                                <Avatar.Fallback className="mention-hover-card-avatar-fallback">
                                    {getUserInitials(user.name)}
                                </Avatar.Fallback>
                            </Avatar.Root>
                            <div className="mention-hover-card-info">
                                <div className="mention-hover-card-name">{user.name}</div>
                                {user.email && (
                                    <div className="mention-hover-card-email">{user.email}</div>
                                )}
                            </div>
                        </div>
                        <Link
                            href={`/users/${user.id}`}
                            className="mention-hover-card-link"
                        >
                            View Profile →
                        </Link>
                    </div>
                    <HoverCard.Arrow className="mention-hover-card-arrow" />
                </HoverCard.Content>
            </HoverCard.Portal>
        </HoverCard.Root>
    );
}
