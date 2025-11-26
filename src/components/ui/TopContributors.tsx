'use client';

import Link from 'next/link';
import * as Avatar from '@radix-ui/react-avatar';
import { Discussion } from '@/lib/discussions';

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
            <div className="discussion-sidebar-panel">
                <h3 className="discussion-sidebar-panel-title">Top Contributors</h3>
                <div className="discussion-sidebar-panel-content">
                    <p className="discussion-sidebar-empty">No contributors yet</p>
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
        <div className="discussion-sidebar-panel">
            <h3 className="discussion-sidebar-panel-title">Top Contributors</h3>
            <div className="discussion-sidebar-panel-content">
                <ul className="top-contributors-list">
                    {topContributors.map((contributor, index) => (
                        <li key={contributor.id} className="top-contributor-item">
                            <span className="top-contributor-rank">#{index + 1}</span>
                            <Link href={`/users/${contributor.id}`} className="top-contributor-link">
                                <Avatar.Root className="top-contributor-avatar">
                                    {contributor.photo ? (
                                        <Avatar.Image
                                            src={contributor.photo}
                                            alt={contributor.name}
                                            className="top-contributor-avatar-img"
                                        />
                                    ) : (
                                        <Avatar.Fallback className="top-contributor-avatar-fallback">
                                            {getInitials(contributor.name)}
                                        </Avatar.Fallback>
                                    )}
                                </Avatar.Root>
                                <div className="top-contributor-info">
                                    <span className="top-contributor-name">{contributor.name}</span>
                                    <span className="top-contributor-count">
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
