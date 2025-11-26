'use client';

import Link from 'next/link';
import { Discussion } from '@/lib/discussions';

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
            <div className="discussion-sidebar-panel">
                <h3 className="discussion-sidebar-panel-title">Unanswered Talks</h3>
                <div className="discussion-sidebar-panel-content">
                    <p className="discussion-sidebar-empty">All discussions have responses!</p>
                    <p className="discussion-sidebar-hint">Great job keeping the conversation going!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="discussion-sidebar-panel">
            <h3 className="discussion-sidebar-panel-title">Unanswered Talks</h3>
            <p className="discussion-sidebar-description">
                Be the first to join the conversation on these topics
            </p>
            <div className="discussion-sidebar-panel-content">
                <ul className="unanswered-list">
                    {unanswered.map((discussion) => (
                        <li key={discussion.id} className="unanswered-item">
                            <Link
                                href={`/spaces/${spaceId}/discussions/${discussion.id}`}
                                className="unanswered-link"
                            >
                                <h4 className="unanswered-title">{discussion.title}</h4>
                                {discussion.excerpt && (
                                    <p className="unanswered-excerpt">{discussion.excerpt}</p>
                                )}
                                <div className="unanswered-meta">
                                    <span className="unanswered-time">{getTimeAgo(discussion.createdAt)}</span>
                                    <span className="unanswered-badge">No replies yet</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
