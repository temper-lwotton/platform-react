'use client';

import Link from 'next/link';
import { Discussion } from '@/lib/discussions';
import { Icon } from './Icon';

interface DiscussionCardProps {
    discussion: Discussion;
    spaceId: string;
}

export function DiscussionCard({ discussion, spaceId }: DiscussionCardProps) {
    const authorName = discussion.author?.profile?.fullName
        || `${discussion.author?.profile?.firstName || ''} ${discussion.author?.profile?.lastName || ''}`.trim()
        || 'Unknown';

    const initials = authorName
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const formattedDate = new Date(discussion.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    // Get space name from discussion
    const spaceName = typeof discussion.space === 'object'
        ? discussion.space?.title
        : undefined;

    return (
        <article className="discussion-card">
            {spaceName && (
                <div className="discussion-card-space">
                    <Link href={`/spaces/${spaceId}`} className="discussion-card-space-link">
                        <Icon icon="folder" size={14} className="discussion-card-space-icon" />
                        {spaceName}
                    </Link>
                </div>
            )}

            <div className="discussion-card-header">
                {discussion.author?.profile?.photo ? (
                    <img
                        src={discussion.author.profile.photo}
                        alt={authorName}
                        className="discussion-card-avatar"
                    />
                ) : (
                    <div className="discussion-card-avatar discussion-card-avatar--placeholder">
                        {initials}
                    </div>
                )}
                <div className="discussion-card-meta">
                    <span className="discussion-card-author">{authorName}</span>
                    <span className="discussion-card-date">{formattedDate}</span>
                </div>
            </div>

            <Link href={`/spaces/${spaceId}/discussions/${discussion.id}`} className="discussion-card-title-link">
                <h3 className="discussion-card-title">{discussion.title}</h3>
            </Link>

            {discussion.excerpt && (
                <p className="discussion-card-preview">
                    {discussion.excerpt.length > 150
                        ? `${discussion.excerpt.slice(0, 150)}...`
                        : discussion.excerpt}
                </p>
            )}

            <div className="discussion-card-footer">
                <div className="discussion-card-stats">
                    <span className="discussion-card-stat">
                        <Icon icon="heart" size={16} className="discussion-card-stat-icon" />
                        {discussion.likesCount ?? 0}
                    </span>
                    <span className="discussion-card-stat">
                        <Icon icon="comment" size={16} className="discussion-card-stat-icon" />
                        {discussion.commentsCount ?? 0}
                    </span>
                </div>
            </div>
        </article>
    );
}
