'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDiscussion, getDiscussionComments, createComment, Comment } from '@/lib/discussions';
import { getCurrentUserId } from '@/lib/auth';
import Link from 'next/link';

export default function DiscussionPage() {
    const params = useParams();
    const spaceId = params.id as string;
    const discussionId = params.discussionId as string;
    const currentUserId = getCurrentUserId();
    const queryClient = useQueryClient();
    const [replyContent, setReplyContent] = useState('');

    const { data: discussion, isLoading, error } = useQuery({
        queryKey: ['discussion', discussionId],
        queryFn: () => getDiscussion(discussionId),
        enabled: !!discussionId,
    });

    const { data: comments } = useQuery({
        queryKey: ['discussion-comments', discussionId],
        queryFn: () => getDiscussionComments(discussionId),
        enabled: !!discussionId,
    });

    const commentMutation = useMutation({
        mutationFn: (content: string) =>
            createComment(discussionId, { content, author: currentUserId! }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['discussion-comments', discussionId] });
            queryClient.invalidateQueries({ queryKey: ['discussion', discussionId] });
            setReplyContent('');
        },
    });

    const handleSubmitReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (replyContent.trim() && currentUserId) {
            commentMutation.mutate(replyContent.trim());
        }
    };

    if (isLoading) {
        return (
            <div className="discussion-detail">
                <p className="discussion-loading">Loading discussion...</p>
            </div>
        );
    }

    if (error || !discussion) {
        return (
            <div className="discussion-detail">
                <p className="discussion-error">Error loading discussion.</p>
                <Link href={`/spaces/${spaceId}/discussions`} className="discussion-back-link">
                    Back to discussions
                </Link>
            </div>
        );
    }

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
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="discussion-detail">
            <Link href={`/spaces/${spaceId}/discussions`} className="discussion-back-link">
                Back to discussions
            </Link>

            <article className="discussion-article">
                <header className="discussion-article-header">
                    <h1 className="discussion-article-title">{discussion.title}</h1>
                    <div className="discussion-article-meta">
                        {discussion.author?.profile?.photo ? (
                            <img
                                src={discussion.author.profile.photo}
                                alt={authorName}
                                className="discussion-article-avatar"
                            />
                        ) : (
                            <div className="discussion-article-avatar discussion-article-avatar--placeholder">
                                {initials}
                            </div>
                        )}
                        <div className="discussion-article-author-info">
                            <span className="discussion-article-author">{authorName}</span>
                            <span className="discussion-article-date">{formattedDate}</span>
                        </div>
                    </div>
                </header>

                {discussion.content && (
                    <div className="discussion-article-content">
                        <p>{discussion.content}</p>
                    </div>
                )}

                <footer className="discussion-article-footer">
                    <div className="discussion-article-stats">
                        <span className="discussion-article-stat">
                            <span className="discussion-article-stat-icon" data-icon="heart" />
                            {discussion.likesCount ?? 0} like{(discussion.likesCount ?? 0) !== 1 ? 's' : ''}
                        </span>
                        <span className="discussion-article-stat">
                            <span className="discussion-article-stat-icon" data-icon="comment" />
                            {discussion.commentsCount ?? 0} comment{(discussion.commentsCount ?? 0) !== 1 ? 's' : ''}
                        </span>
                    </div>
                </footer>
            </article>

            <section className="discussion-comments">
                <h2 className="discussion-comments-title">
                    Comments ({comments?.length ?? 0})
                </h2>

                {currentUserId ? (
                    <form className="discussion-reply-form" onSubmit={handleSubmitReply}>
                        <textarea
                            className="discussion-reply-input"
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={3}
                            disabled={commentMutation.isPending}
                        />
                        <div className="discussion-reply-actions">
                            <button
                                type="submit"
                                className="discussion-reply-submit"
                                disabled={!replyContent.trim() || commentMutation.isPending}
                            >
                                {commentMutation.isPending ? 'Posting...' : 'Post Reply'}
                            </button>
                        </div>
                        {commentMutation.isError && (
                            <p className="discussion-reply-error">
                                Failed to post reply. Please try again.
                            </p>
                        )}
                    </form>
                ) : (
                    <p className="discussion-login-prompt">
                        <Link href="/login">Log in</Link> to reply to this discussion.
                    </p>
                )}

                {comments && comments.length > 0 ? (
                    <div className="discussion-comments-list">
                        {comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </div>
                ) : (
                    <p className="discussion-comments-empty">No comments yet. Be the first to comment!</p>
                )}
            </section>
        </div>
    );
}

function CommentItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
    const authorName = comment.author?.profile?.fullName
        || `${comment.author?.profile?.firstName || ''} ${comment.author?.profile?.lastName || ''}`.trim()
        || 'Unknown';

    const initials = authorName
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="comment" style={{ marginLeft: depth > 0 ? `${depth * 1.5}rem` : 0 }}>
            <div className="comment-header">
                {comment.author?.profile?.photo ? (
                    <img
                        src={comment.author.profile.photo}
                        alt={authorName}
                        className="comment-avatar"
                    />
                ) : (
                    <div className="comment-avatar comment-avatar--placeholder">
                        {initials}
                    </div>
                )}
                <div className="comment-meta">
                    <span className="comment-author">{authorName}</span>
                    <span className="comment-date">{formattedDate}</span>
                </div>
            </div>
            <div className="comment-content">
                <p>{comment.content}</p>
            </div>
            {comment.replies && comment.replies.length > 0 && (
                <div className="comment-replies">
                    {comment.replies.map((reply) => (
                        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}
