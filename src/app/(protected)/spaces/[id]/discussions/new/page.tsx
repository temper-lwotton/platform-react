'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { createDiscussion } from '@/lib/discussions';
import { getCurrentUserId } from '@/lib/auth';

export default function NewDiscussionPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const spaceId = params.id as string;
    const currentUserId = getCurrentUserId();

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');

    const createMutation = useMutation({
        mutationFn: () =>
            createDiscussion({
                title: title.trim(),
                excerpt: excerpt.trim(),
                htmlContent: `<p>${content.trim()}</p>`,
                author: Number(currentUserId),
                space: Number(spaceId),
            }),
        onSuccess: (newDiscussion) => {
            queryClient.invalidateQueries({ queryKey: ['space-discussions', spaceId] });
            router.push(`/spaces/${spaceId}/discussions/${newDiscussion.id}`);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && excerpt.trim() && content.trim() && currentUserId) {
            createMutation.mutate();
        }
    };

    const isFormValid = title.trim() && excerpt.trim() && content.trim() && currentUserId;

    return (
        <div className="new-discussion-page">
            <Link
                href={`/spaces/${spaceId}/discussions`}
                className="discussion-back-link"
            >
                Back to Discussions
            </Link>

            <h1 className="new-discussion-title">Start a New Discussion</h1>

            <form className="new-discussion-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="title" className="form-label">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        className="form-input"
                        placeholder="What would you like to discuss?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={createMutation.isPending}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="excerpt" className="form-label">
                        Excerpt
                    </label>
                    <textarea
                        id="excerpt"
                        className="form-input new-discussion-excerpt"
                        placeholder="A brief summary of your discussion..."
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={2}
                        disabled={createMutation.isPending}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="content" className="form-label">
                        Content
                    </label>
                    <textarea
                        id="content"
                        className="form-input new-discussion-textarea"
                        placeholder="Share your thoughts, questions, or ideas..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={8}
                        disabled={createMutation.isPending}
                        required
                    />
                </div>

                {createMutation.isError && (
                    <div className="form-error-box">
                        {createMutation.error instanceof Error
                            ? createMutation.error.message
                            : 'Failed to create discussion. Please try again.'}
                    </div>
                )}

                <div className="new-discussion-actions">
                    <Link
                        href={`/spaces/${spaceId}/discussions`}
                        className="new-discussion-cancel"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="form-button new-discussion-submit"
                        disabled={!isFormValid || createMutation.isPending}
                    >
                        {createMutation.isPending ? 'Creating...' : 'Create Discussion'}
                    </button>
                </div>
            </form>
        </div>
    );
}
