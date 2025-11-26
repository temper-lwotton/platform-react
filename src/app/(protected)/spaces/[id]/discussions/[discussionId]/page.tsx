'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDiscussion, getDiscussionComments, createComment, Comment, transformComments, likeDiscussion, unlikeDiscussion } from '@/lib/discussions';
import { getCurrentUserId } from '@/lib/auth';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { LikesDisplay } from '@/components/ui/LikesDisplay';

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

    // Transform API comment structure (__children) to our format (replies)
    const commentTree = useMemo(() => {
        if (!comments) return [];
        return transformComments(comments);
    }, [comments]);

    const commentMutation = useMutation({
        mutationFn: ({ content, parentId }: { content: string; parentId?: string }) =>
            createComment(discussionId, {
                content,
                author: currentUserId!,
                parent: parentId
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['discussion-comments', discussionId] });
            queryClient.invalidateQueries({ queryKey: ['discussion', discussionId] });
            setReplyContent('');
        },
    });

    const likeMutation = useMutation({
        mutationFn: () => {
            // User ID is automatically detected from JWT token in API
            if (discussion?.isLiked) {
                return unlikeDiscussion(discussionId);
            } else {
                return likeDiscussion(discussionId);
            }
        },
        onSuccess: () => {
            // Refresh discussion data to get updated likedBy array
            queryClient.invalidateQueries({ queryKey: ['discussion', discussionId] });
        },
    });

    const handleSubmitReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (replyContent.trim() && currentUserId) {
            commentMutation.mutate({ content: replyContent.trim() });
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

    const authorName = (discussion.author as any)?.fullName
        || discussion.author?.profile?.fullName
        || `${discussion.author?.profile?.firstName || ''} ${discussion.author?.profile?.lastName || ''}`.trim()
        || 'Unknown';

    const initials = authorName
        .split(' ')
        .map((part: string) => part.charAt(0))
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
                        {((discussion.author as any)?.photo || discussion.author?.profile?.photo) ? (
                            <img
                                src={(discussion.author as any)?.photo || discussion.author?.profile?.photo}
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

                {discussion.htmlContent && (
                    <div
                        className="discussion-article-content"
                        dangerouslySetInnerHTML={{ __html: discussion.htmlContent }}
                    />
                )}

                <footer className="discussion-article-footer">
                    <div className="discussion-article-stats">
                        <LikesDisplay
                            likesCount={discussion.likesCount ?? 0}
                            isLiked={discussion.isLiked ?? false}
                            likedBy={discussion.likedBy ?? []}
                            onLikeToggle={() => likeMutation.mutate()}
                        />
                        <span className="discussion-article-stat">
                            <Icon icon="comment" size={18} className="discussion-article-stat-icon" />
                            {discussion.commentsCount ?? 0} comment{(discussion.commentsCount ?? 0) !== 1 ? 's' : ''}
                        </span>
                    </div>
                </footer>
            </article>

            <section className="discussion-comments">
                <h2 className="discussion-comments-title">
                    Comments ({discussion.commentsCount ?? 0})
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

                {commentTree && commentTree.length > 0 ? (
                    <div className="discussion-comments-list">
                        {commentTree.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                currentUserId={currentUserId}
                                commentMutation={commentMutation}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="discussion-comments-empty">No comments yet. Be the first to comment!</p>
                )}
            </section>
        </div>
    );
}

interface CommentItemProps {
    comment: Comment;
    depth?: number;
    currentUserId: string | null;
    commentMutation: any;
}

function CommentItem({ comment, depth = 0, currentUserId, commentMutation }: CommentItemProps) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');

    const authorName = (comment.author as any)?.fullName
        || comment.author?.profile?.fullName
        || `${comment.author?.profile?.firstName || ''} ${comment.author?.profile?.lastName || ''}`.trim()
        || 'Unknown';

    const initials = authorName
        .split(' ')
        .map((part: string) => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    const handleReply = () => {
        setIsReplying(true);
    };

    const handleCancelReply = () => {
        setIsReplying(false);
        setReplyText('');
    };

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (replyText.trim() && currentUserId) {
            try {
                await commentMutation.mutateAsync({
                    content: replyText.trim(),
                    parentId: comment.id
                });
                setReplyText('');
                setIsReplying(false);
            } catch (error) {
                // Error is handled by the mutation
            }
        }
    };

    return (
        <div className="comment" style={{ marginLeft: depth > 0 ? `${depth * 1.5}rem` : 0 }}>
            <div className="comment-header">
                {((comment.author as any)?.photo || comment.author?.profile?.photo) ? (
                    <img
                        src={(comment.author as any)?.photo || comment.author?.profile?.photo}
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

            {currentUserId && (
                <div className="comment-actions">
                    <button
                        className="comment-reply-button"
                        onClick={handleReply}
                        disabled={isReplying}
                    >
                        Reply
                    </button>
                </div>
            )}

            {isReplying && (
                <form className="comment-reply-form" onSubmit={handleSubmitReply}>
                    <textarea
                        className="comment-reply-input"
                        placeholder={`Reply to ${authorName}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={2}
                        disabled={commentMutation.isPending}
                        autoFocus
                    />
                    <div className="comment-reply-actions">
                        <button
                            type="button"
                            className="comment-reply-cancel"
                            onClick={handleCancelReply}
                            disabled={commentMutation.isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="comment-reply-submit"
                            disabled={!replyText.trim() || commentMutation.isPending}
                        >
                            {commentMutation.isPending ? 'Posting...' : 'Reply'}
                        </button>
                    </div>
                    {commentMutation.isError && (
                        <p className="comment-reply-error">
                            Failed to post reply. Please try again.
                        </p>
                    )}
                </form>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="comment-replies">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            depth={depth + 1}
                            currentUserId={currentUserId}
                            commentMutation={commentMutation}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
