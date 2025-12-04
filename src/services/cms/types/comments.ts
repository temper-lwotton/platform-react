/**
 * Comments and Moderation Type Definitions
 */

// Comment status
export type CommentStatus = 'approved' | 'pending' | 'spam' | 'trash';

// Comment interface
export interface Comment {
  id: number;
  postId: number;
  parentId: number | null; // For threaded comments
  author: {
    id?: number; // User ID if authenticated
    name: string;
    email: string;
    url?: string;
    avatar?: string;
  };
  content: string;
  status: CommentStatus;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt?: string;
  // Moderation flags
  moderationFlags?: {
    spam: boolean;
    inappropriateLanguage: boolean;
    offTopic: boolean;
    requiresReview: boolean;
  };
  // Threading
  replies?: Comment[];
  replyCount: number;
}

// Comment creation request
export interface CreateCommentRequest {
  postId: number;
  parentId?: number | null;
  authorName: string;
  authorEmail: string;
  authorUrl?: string;
  content: string;
}

// Comment update request
export interface UpdateCommentRequest {
  content?: string;
  status?: CommentStatus;
}

// Comment list parameters
export interface CommentListParams {
  postId?: number;
  status?: CommentStatus;
  authorEmail?: string;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'thread';
  page?: number;
  limit?: number;
}

// Bulk moderation action
export type BulkCommentAction = 'approve' | 'spam' | 'trash' | 'delete';

export interface BulkCommentRequest {
  commentIds: number[];
  action: BulkCommentAction;
}

// Comment stats for dashboard
export interface CommentStats {
  total: number;
  approved: number;
  pending: number;
  spam: number;
  trash: number;
  todayCount: number;
}

// Moderation settings (from discussion settings)
export interface ModerationSettings {
  enableComments: boolean;
  requireNameEmail: boolean;
  requireRegistration: boolean;
  autoCloseComments: boolean;
  autoCloseCommentsDays: number;
  enableThreadedComments: boolean;
  threadedCommentsDepth: number;
  pageComments: boolean;
  commentsPerPage: number;
  commentOrder: 'asc' | 'desc';
  emailOnComment: boolean;
  emailOnModeration: boolean;
  moderationRequired: boolean;
  moderationHoldKeywords: string[];
  disallowedKeywords: string[];
}

// API Response types
export interface CommentListResponse {
  items: Comment[];
  total: number;
  page: number;
  limit: number;
}

export interface CommentResponse {
  success: boolean;
  data?: Comment;
  error?: {
    code: string;
    message: string;
  };
}

export interface CommentsListResponse {
  success: boolean;
  data?: CommentListResponse;
  error?: {
    code: string;
    message: string;
  };
}

export interface CommentStatsResponse {
  success: boolean;
  data?: CommentStats;
  error?: {
    code: string;
    message: string;
  };
}
