'use client';

import Link from 'next/link';
import { Discussion } from '@/lib/discussions';
import { Badge } from '../primitives';
import styles from './UnansweredDiscussions.module.scss';

interface UnansweredDiscussionsProps {
    discussions: Discussion[];
    spaceId: string;
}

export function UnansweredDiscussions({ discussions, spaceId }: UnansweredDiscussionsProps) {
    // Filter discussions with no comments
    const unanswered = discussions
        .filter(discussion => (discussion.commentsCount || 0) === 0)
        .slice(0, 5);

    const getTimeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'recently';

        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    if (unanswered.length === 0) {
        return (
            <div className={styles.panel}>
                <h3 className={styles.title}>Unanswered Talks</h3>
                <div className={styles.content}>
                    <p className={styles.emptyMessage}>All discussions have responses!</p>
                    <p className={styles.emptyHint}>Great job keeping the conversation going!</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.panel}>
            <h3 className={styles.title}>Unanswered Talks</h3>
            <p className={styles.description}>
                Be the first to join the conversation on these topics
            </p>
            <div className={styles.content}>
                <ul className={styles.list}>
                    {unanswered.map((discussion) => (
                        <li key={discussion.id} className={styles.item}>
                            <Link
                                href={`/spaces/${spaceId}/discussions/${discussion.id}`}
                                className={styles.link}
                            >
                                <h4 className={styles.discussionTitle}>{discussion.title}</h4>
                                {discussion.excerpt && (
                                    <p className={styles.excerpt}>{discussion.excerpt}</p>
                                )}
                                <div className={styles.meta}>
                                    <span className={styles.time}>{getTimeAgo(discussion.createdAt)}</span>
                                    <Badge variant="outline" size="sm">
                                        No replies yet
                                    </Badge>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
