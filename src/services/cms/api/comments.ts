/**
 * Comments API Service
 * Mock implementation using localStorage (replace with actual API calls later)
 */

import type {
  Comment,
  CommentStatus,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentListParams,
  BulkCommentRequest,
  CommentStats,
  CommentListResponse,
} from '../types/comments';

const STORAGE_KEY = 'cms_comments';

// Mock comments data
const mockComments: Comment[] = [
  {
    id: 1,
    postId: 1,
    parentId: null,
    author: {
      id: 2,
      name: 'John Editor',
      email: 'editor@example.com',
      avatar: undefined,
    },
    content: 'Great article! This really helped me understand the topic better.',
    status: 'approved',
    createdAt: '2024-03-10T14:30:00Z',
    replyCount: 2,
    moderationFlags: {
      spam: false,
      inappropriateLanguage: false,
      offTopic: false,
      requiresReview: false,
    },
  },
  {
    id: 2,
    postId: 1,
    parentId: 1,
    author: {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      avatar: undefined,
    },
    content: 'Thanks for the feedback! Glad it was helpful.',
    status: 'approved',
    createdAt: '2024-03-10T15:00:00Z',
    replyCount: 0,
    moderationFlags: {
      spam: false,
      inappropriateLanguage: false,
      offTopic: false,
      requiresReview: false,
    },
  },
  {
    id: 3,
    postId: 1,
    parentId: 1,
    author: {
      name: 'Anonymous User',
      email: 'user@example.com',
    },
    content: 'I agree, very insightful!',
    status: 'approved',
    createdAt: '2024-03-10T16:20:00Z',
    replyCount: 0,
    moderationFlags: {
      spam: false,
      inappropriateLanguage: false,
      offTopic: false,
      requiresReview: false,
    },
  },
  {
    id: 4,
    postId: 1,
    parentId: null,
    author: {
      name: 'Bob Smith',
      email: 'bob@example.com',
    },
    content: 'This is awaiting moderation...',
    status: 'pending',
    createdAt: '2024-03-15T10:00:00Z',
    replyCount: 0,
    moderationFlags: {
      spam: false,
      inappropriateLanguage: false,
      offTopic: false,
      requiresReview: true,
    },
  },
  {
    id: 5,
    postId: 2,
    parentId: null,
    author: {
      name: 'Spammer',
      email: 'spam@spam.com',
    },
    content: 'Buy cheap products now! Visit http://spam.com',
    status: 'spam',
    createdAt: '2024-03-14T09:30:00Z',
    replyCount: 0,
    moderationFlags: {
      spam: true,
      inappropriateLanguage: false,
      offTopic: false,
      requiresReview: false,
    },
  },
];

/**
 * Get comments from localStorage or return defaults
 */
function getStoredComments(): Comment[] {
  if (typeof window === 'undefined') return mockComments;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load comments:', error);
  }
  return mockComments;
}

/**
 * Save comments to localStorage
 */
function saveComments(comments: Comment[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  } catch (error) {
    console.error('Failed to save comments:', error);
  }
}

/**
 * Build threaded comment structure
 */
function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap = new Map<number, Comment>();
  const rootComments: Comment[] = [];

  // First pass: create map and initialize replies array
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: build tree structure
  comments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id)!;
    if (comment.parentId === null) {
      rootComments.push(commentWithReplies);
    } else {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies!.push(commentWithReplies);
      }
    }
  });

  return rootComments;
}

/**
 * Get all comments with optional filtering
 */
export async function getComments(
  params?: CommentListParams
): Promise<{ data: CommentListResponse; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 100));

  let comments = getStoredComments();

  // Apply filters
  if (params?.postId) {
    comments = comments.filter(c => c.postId === params.postId);
  }

  if (params?.status) {
    comments = comments.filter(c => c.status === params.status);
  }

  if (params?.authorEmail) {
    comments = comments.filter(c => c.author.email === params.authorEmail);
  }

  if (params?.search) {
    const search = params.search.toLowerCase();
    comments = comments.filter(
      c =>
        c.content.toLowerCase().includes(search) ||
        c.author.name.toLowerCase().includes(search) ||
        c.author.email.toLowerCase().includes(search)
    );
  }

  // Sort
  const sortBy = params?.sortBy || 'newest';
  if (sortBy === 'newest') {
    comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === 'oldest') {
    comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // Pagination
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const start = (page - 1) * limit;
  const total = comments.length;

  // Build threaded structure if needed
  if (sortBy === 'thread') {
    const threaded = buildCommentTree(comments);
    const flatThreaded = flattenThreadedComments(threaded);
    const paginated = flatThreaded.slice(start, start + limit);

    return {
      success: true,
      data: {
        items: paginated,
        total,
        page,
        limit,
      },
    };
  }

  const paginated = comments.slice(start, start + limit);

  return {
    success: true,
    data: {
      items: paginated,
      total,
      page,
      limit,
    },
  };
}

/**
 * Flatten threaded comments for display
 */
function flattenThreadedComments(comments: Comment[], depth = 0): Comment[] {
  const result: Comment[] = [];

  comments.forEach(comment => {
    result.push(comment);
    if (comment.replies && comment.replies.length > 0) {
      result.push(...flattenThreadedComments(comment.replies, depth + 1));
    }
  });

  return result;
}

/**
 * Get a single comment by ID
 */
export async function getComment(
  id: number
): Promise<{ data: Comment | null; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 50));

  const comments = getStoredComments();
  const comment = comments.find(c => c.id === id) || null;

  return {
    success: true,
    data: comment,
  };
}

/**
 * Create a new comment
 */
export async function createComment(
  request: CreateCommentRequest
): Promise<{ data: Comment; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const comments = getStoredComments();
  const newId = Math.max(0, ...comments.map(c => c.id)) + 1;

  const newComment: Comment = {
    id: newId,
    postId: request.postId,
    parentId: request.parentId || null,
    author: {
      name: request.authorName,
      email: request.authorEmail,
      url: request.authorUrl,
    },
    content: request.content,
    status: 'pending', // Default to pending for moderation
    createdAt: new Date().toISOString(),
    replyCount: 0,
    moderationFlags: {
      spam: false,
      inappropriateLanguage: false,
      offTopic: false,
      requiresReview: true,
    },
  };

  comments.push(newComment);

  // Update parent reply count if this is a reply
  if (newComment.parentId) {
    const parent = comments.find(c => c.id === newComment.parentId);
    if (parent) {
      parent.replyCount += 1;
    }
  }

  saveComments(comments);

  return {
    success: true,
    data: newComment,
  };
}

/**
 * Update a comment
 */
export async function updateComment(
  id: number,
  updates: UpdateCommentRequest
): Promise<{ data: Comment; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const comments = getStoredComments();
  const index = comments.findIndex(c => c.id === id);

  if (index === -1) {
    throw new Error('Comment not found');
  }

  comments[index] = {
    ...comments[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveComments(comments);

  return {
    success: true,
    data: comments[index],
  };
}

/**
 * Delete a comment
 */
export async function deleteComment(id: number): Promise<{ success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 200));

  let comments = getStoredComments();
  const comment = comments.find(c => c.id === id);

  if (!comment) {
    throw new Error('Comment not found');
  }

  // Update parent reply count if this is a reply
  if (comment.parentId) {
    const parent = comments.find(c => c.id === comment.parentId);
    if (parent) {
      parent.replyCount -= 1;
    }
  }

  comments = comments.filter(c => c.id !== id && c.parentId !== id); // Also delete replies
  saveComments(comments);

  return {
    success: true,
  };
}

/**
 * Bulk update comment status
 */
export async function bulkUpdateComments(
  request: BulkCommentRequest
): Promise<{ success: boolean; data: { updated: number } }> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const comments = getStoredComments();
  let updatedCount = 0;

  request.commentIds.forEach(id => {
    const comment = comments.find(c => c.id === id);
    if (comment) {
      if (request.action === 'delete') {
        // Will be handled separately
      } else {
        comment.status = request.action as CommentStatus;
        comment.updatedAt = new Date().toISOString();
        updatedCount++;
      }
    }
  });

  // Handle deletes
  if (request.action === 'delete') {
    const filtered = comments.filter(c => !request.commentIds.includes(c.id));
    updatedCount = comments.length - filtered.length;
    saveComments(filtered);
  } else {
    saveComments(comments);
  }

  return {
    success: true,
    data: { updated: updatedCount },
  };
}

/**
 * Get comment statistics
 */
export async function getCommentStats(): Promise<{ data: CommentStats; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 100));

  const comments = getStoredComments();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats: CommentStats = {
    total: comments.length,
    approved: comments.filter(c => c.status === 'approved').length,
    pending: comments.filter(c => c.status === 'pending').length,
    spam: comments.filter(c => c.status === 'spam').length,
    trash: comments.filter(c => c.status === 'trash').length,
    todayCount: comments.filter(c => new Date(c.createdAt) >= today).length,
  };

  return {
    success: true,
    data: stats,
  };
}
