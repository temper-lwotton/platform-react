'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDiscussion, getDiscussionComments, createComment, Comment, transformComments, likeDiscussion, unlikeDiscussion } from '@/lib/discussions';
import { getCurrentUserId } from '@/lib/auth';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { LikesDisplay } from '@/components/ui/LikesDisplay';
import { LexicalCommentEditor } from '@/components/ui/LexicalCommentEditor';
import { MentionContent } from '@/components/ui/MentionContent';
import { RichContent } from '@/components/ui/RichContent';
import { RichContentWithMentions } from '@/components/ui/RichContentWithMentions';
import { MentionUser } from '@/hooks/useMentions';
import { getMentionedUserIds } from '@/lib/mentions';
import { getSpace } from '@/lib/spaces';

export default function DiscussionPage() {
    const params = useParams();
    const spaceId = params.id as string;
    const discussionId = params.discussionId as string;
    const currentUserId = getCurrentUserId();
    const queryClient = useQueryClient();
    const [replyContent, setReplyContent] = useState('');
    const [replyHtmlContent, setReplyHtmlContent] = useState('');
    const [clearEditor, setClearEditor] = useState(0); // Trigger to clear editor

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

    // Fetch space data to get members for mentions
    const { data: space } = useQuery({
        queryKey: ['space', spaceId],
        queryFn: () => getSpace(spaceId),
        enabled: !!spaceId,
    });

    // Convert space members to MentionUser format (deduplicated)
    const mentionUsers: MentionUser[] = useMemo(() => {
        if (!space) return [];

        const allMembers = [
            ...(space.admins || []),
            ...(space.members || []),
        ];

        // Deduplicate by user ID
        const uniqueMembers = new Map();
        allMembers.forEach(member => {
            if (member.id && !uniqueMembers.has(member.id)) {
                uniqueMembers.set(member.id, member);
            }
        });

        return Array.from(uniqueMembers.values()).map(member => ({
            id: member.id,
            name: member.profile?.fullName ||
                  `${member.profile?.firstName || ''} ${member.profile?.lastName || ''}`.trim() ||
                  member.email ||
                  'Unknown User',
            email: member.email,
            avatar: member.profile?.photo,
        }));
    }, [space]);

    // Transform API comment structure (__children) to our format (replies)
    const commentTree = useMemo(() => {
        if (!comments) return [];
        return transformComments(comments);
    }, [comments]);

    const commentMutation = useMutation({
        mutationFn: ({ content, htmlContent, parentId }: { content: string; htmlContent: string; parentId?: string }) =>
            createComment(discussionId, {
                content: htmlContent, // Use HTML content to preserve mentions
                author: currentUserId!,
                parent: parentId
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['discussion-comments', discussionId] });
            queryClient.invalidateQueries({ queryKey: ['discussion', discussionId] });
            setReplyContent('');
            setReplyHtmlContent('');
            setClearEditor(prev => prev + 1); // Trigger editor clear
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
            // Extract mentioned user IDs for notifications
            const mentionedUserIds = getMentionedUserIds(replyHtmlContent, mentionUsers);
            console.log('Mentioned users:', mentionedUserIds);

            // TODO: Pass mentionedUserIds to backend when API supports it
            commentMutation.mutate({
                content: replyContent.trim(),
                htmlContent: replyHtmlContent
            });
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
                    <RichContentWithMentions
                        content={discussion.htmlContent}
                        users={mentionUsers}
                        className="discussion-article-content"
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
                        <LexicalCommentEditor
                            key={clearEditor}
                            users={mentionUsers}
                            placeholder="Write a reply... Type @ to mention someone"
                            onChange={(text, html) => {
                                setReplyContent(text);
                                setReplyHtmlContent(html);
                            }}
                            onMention={(user) => console.log('Mentioned:', user.name)}
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
                                mentionUsers={mentionUsers}
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
    mentionUsers: MentionUser[];
}

function CommentItem({ comment, depth = 0, currentUserId, commentMutation, mentionUsers }: CommentItemProps) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replyHtml, setReplyHtml] = useState('');
    const [clearNestedEditor, setClearNestedEditor] = useState(0);

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
        setReplyHtml('');
    };

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (replyText.trim() && currentUserId) {
            try {
                // Extract mentioned user IDs for notifications
                const mentionedUserIds = getMentionedUserIds(replyHtml, mentionUsers);
                console.log('Mentioned users in reply:', mentionedUserIds);

                // TODO: Pass mentionedUserIds to backend when API supports it
                await commentMutation.mutateAsync({
                    content: replyText.trim(),
                    htmlContent: replyHtml,
                    parentId: comment.id
                });
                setReplyText('');
                setReplyHtml('');
                setIsReplying(false);
                setClearNestedEditor(prev => prev + 1);
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

            <RichContentWithMentions
                content={comment.content}
                users={mentionUsers}
                className="comment-content"
            />

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
                    <LexicalCommentEditor
                        key={clearNestedEditor}
                        users={mentionUsers}
                        placeholder={`Reply to ${authorName}... Type @ to mention`}
                        onChange={(text, html) => {
                            setReplyText(text);
                            setReplyHtml(html);
                        }}
                        onMention={(user) => console.log('Mentioned in nested reply:', user.name)}
                        disabled={commentMutation.isPending}
                        autoFocus={true}
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
                            mentionUsers={mentionUsers}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
