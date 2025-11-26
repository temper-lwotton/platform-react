import { apiFetch } from './api-client';

export interface DiscussionTag {
    id: number;
    name: string;
}

export interface Discussion {
    id: string;
    createdAt: string;
    updatedAt?: string;
    title: string;
    excerpt?: string;
    htmlContent?: string;
    jsonContent?: object;
    tags?: DiscussionTag[];
    author?: {
        id: string;
        fullName?: string;
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
    followersCount?: number;
    isPinned?: boolean;
    isLiked?: boolean;
    isFollowing?: boolean;
}

export interface Comment {
    id: string;
    createdAt: string;
    content: string;
    level?: number;
    author?: {
        id: string;
        profile?: {
            fullName?: string;
            firstName?: string;
            lastName?: string;
            photo?: string;
        };
    };
    __children?: Comment[];  // API returns nested comments with this field
    replies?: Comment[];     // We'll map __children to replies for consistency
}

// Transform API comments (__children) to our format (replies)
export function transformComments(comments: Comment[]): Comment[] {
    return comments.map(comment => ({
        ...comment,
        replies: comment.__children ? transformComments(comment.__children) : []
    }));
}

// List all discussions with optional pagination
export interface GetDiscussionsParams {
    limit?: number;
    offset?: number;
}

export function getDiscussions(params?: GetDiscussionsParams): Promise<Discussion[]> {
    const queryParams = new URLSearchParams();

    if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
    }

    if (params?.offset) {
        queryParams.append('offset', params.offset.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/api/discussion?${queryString}` : '/api/discussion';

    return apiFetch<Discussion[]>(url);
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
export interface CreateDiscussionData {
    title: string;
    excerpt: string;
    htmlContent: string;
    author: number;
    space: number;
    tags?: number[];
}

export function createDiscussion(data: CreateDiscussionData): Promise<Discussion> {
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

// Create a comment on a discussion
export function createComment(
    discussionId: string,
    data: { content: string; author: string; parent?: string }
): Promise<Comment> {
    return apiFetch<Comment>('/api/discussion/comments', {
        method: 'POST',
        body: JSON.stringify({
            content: data.content,
            author: Number(data.author),
            discussion: Number(discussionId),
            parent: data.parent ? Number(data.parent) : null,
        }),
    });
}
