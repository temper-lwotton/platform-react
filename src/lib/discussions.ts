import { apiFetch } from './api-client';

export interface Discussion {
    id: string;
    createdAt: string;
    title: string;
    content?: string;
    author?: {
        id: string;
        profile?: {
            fullName?: string;
            firstName?: string;
            lastName?: string;
            photo?: string;
        };
    };
    space?: {
        id: string;
        title: string;
    };
    likesCount?: number;
    commentsCount?: number;
    isLiked?: boolean;
    isFollowing?: boolean;
}

export interface Comment {
    id: string;
    createdAt: string;
    content: string;
    author?: {
        id: string;
        profile?: {
            fullName?: string;
            firstName?: string;
            lastName?: string;
            photo?: string;
        };
    };
    replies?: Comment[];
}

// List all discussions
export function getDiscussions(): Promise<Discussion[]> {
    return apiFetch<Discussion[]>('/api/discussion');
}

// Get discussions for a specific space
export function getSpaceDiscussions(spaceId: string): Promise<Discussion[]> {
    return apiFetch<Discussion[]>(`/api/spaces/${spaceId}/discussions`);
}

// Get single discussion
export function getDiscussion(id: string): Promise<Discussion> {
    return apiFetch<Discussion>(`/api/discussion/${id}`);
}

// Get discussion comments
export function getDiscussionComments(id: string): Promise<Comment[]> {
    return apiFetch<Comment[]>(`/api/discussion/${id}/comments`);
}

// Create discussion
export function createDiscussion(data: { title: string; content?: string; space?: string }): Promise<Discussion> {
    return apiFetch<Discussion>('/api/discussion', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// Update discussion
export function updateDiscussion(id: string, data: Partial<Discussion>): Promise<Discussion> {
    return apiFetch<Discussion>(`/api/discussion/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

// Delete discussion
export function deleteDiscussion(id: string): Promise<void> {
    return apiFetch<void>(`/api/discussion/${id}`, {
        method: 'DELETE',
    });
}

// Like discussion
export function likeDiscussion(id: string, userId: string): Promise<void> {
    return apiFetch<void>(`/api/discussion/${id}/like`, {
        method: 'POST',
        body: JSON.stringify({ user: userId }),
    });
}

// Unlike discussion
export function unlikeDiscussion(id: string): Promise<void> {
    return apiFetch<void>(`/api/discussion/${id}/unlike`, {
        method: 'DELETE',
    });
}

// Follow discussion
export function followDiscussion(id: string): Promise<void> {
    return apiFetch<void>(`/api/discussion/${id}/follow`, {
        method: 'POST',
    });
}

// Unfollow discussion
export function unfollowDiscussion(id: string): Promise<void> {
    return apiFetch<void>(`/api/discussion/${id}/unfollow`, {
        method: 'DELETE',
    });
}
