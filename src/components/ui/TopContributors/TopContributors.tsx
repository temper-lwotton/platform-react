'use client';

import Link from 'next/link';
import { Discussion } from '@/lib/discussions';
import { Avatar, Badge } from '../primitives';
import styles from './TopContributors.module.scss';

interface Contributor {
    id: string;
    name: string;
    photo?: string;
    discussionCount: number;
}

interface TopContributorsProps {
    discussions: Discussion[];
}

export function TopContributors({ discussions }: TopContributorsProps) {
    // Calculate top contributors
    const contributorMap = new Map<string, Contributor>();

    discussions.forEach(discussion => {
        // Skip discussions without author data
        if (!discussion.author?.id) {
            return;
        }

        const authorId = discussion.author.id;

        // Match DiscussionCard's exact pattern for name extraction
        const authorName = discussion.author.profile?.fullName
            || `${discussion.author.profile?.firstName || ''} ${discussion.author.profile?.lastName || ''}`.trim()
            || `User ${authorId}`;

        const authorPhoto = discussion.author.profile?.photo;

        if (contributorMap.has(authorId)) {
            const contributor = contributorMap.get(authorId)!;
            contributor.discussionCount++;
        } else {
            contributorMap.set(authorId, {
                id: authorId,
                name: authorName,
                photo: authorPhoto,
                discussionCount: 1,
            });
        }
    });

    // Sort by discussion count and get top 10
    const topContributors = Array.from(contributorMap.values())
        .sort((a, b) => b.discussionCount - a.discussionCount)
        .slice(0, 10);

    if (topContributors.length === 0) {
        return (
            <div className={styles.panel}>
                <h3 className={styles.title}>Top Contributors</h3>
                <div className={styles.content}>
                    <p className={styles.emptyState}>No contributors yet</p>
                </div>
            </div>
        );
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .filter(Boolean)
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={styles.panel}>
            <h3 className={styles.title}>Top Contributors</h3>
            <div className={styles.content}>
                <ul className={styles.list}>
                    {topContributors.map((contributor, index) => (
                        <li key={contributor.id} className={styles.item}>
                            <Badge variant="outline" size="sm" className={styles.rank}>
                                #{index + 1}
                            </Badge>
                            <Link href={`/users/${contributor.id}`} className={styles.link}>
                                <Avatar
                                    src={contributor.photo}
                                    alt={contributor.name}
                                    fallback={getInitials(contributor.name)}
                                    size="sm"
                                />
                                <div className={styles.info}>
                                    <span className={styles.name}>{contributor.name}</span>
                                    <span className={styles.count}>
                                        {contributor.discussionCount} discussion{contributor.discussionCount !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
