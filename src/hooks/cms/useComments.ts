/**
 * React Query hooks for Comments
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsAPI } from '@/services/cms/api';
import type {
  CommentListParams,
  CreateCommentRequest,
  UpdateCommentRequest,
  BulkCommentRequest,
} from '@/services/cms/types/comments';

// Query keys
export const commentsKeys = {
  all: ['comments'] as const,
  lists: () => [...commentsKeys.all, 'list'] as const,
  list: (params?: CommentListParams) => [...commentsKeys.lists(), params] as const,
  details: () => [...commentsKeys.all, 'detail'] as const,
  detail: (id: number) => [...commentsKeys.details(), id] as const,
  stats: () => [...commentsKeys.all, 'stats'] as const,
};

/**
 * Hook to fetch comments with optional filtering
 */
export function useComments(params?: CommentListParams) {
  return useQuery({
    queryKey: commentsKeys.list(params),
    queryFn: () => commentsAPI.getComments(params),
  });
}

/**
 * Hook to fetch a single comment
 */
export function useComment(id: number) {
  return useQuery({
    queryKey: commentsKeys.detail(id),
    queryFn: () => commentsAPI.getComment(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch comment statistics
 */
export function useCommentStats() {
  return useQuery({
    queryKey: commentsKeys.stats(),
    queryFn: () => commentsAPI.getCommentStats(),
  });
}

/**
 * Hook to create a new comment
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCommentRequest) =>
      commentsAPI.createComment(request),
    onSuccess: (response, variables) => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: commentsKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: commentsKeys.stats() });
      // Invalidate post-specific comments
      queryClient.invalidateQueries({
        queryKey: commentsKeys.list({ postId: variables.postId }),
      });
    },
  });
}

/**
 * Hook to update a comment
 */
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: UpdateCommentRequest }) =>
      commentsAPI.updateComment(id, updates),
    onSuccess: (response, variables) => {
      // Invalidate the specific comment
      queryClient.invalidateQueries({ queryKey: commentsKeys.detail(variables.id) });
      // Invalidate all lists
      queryClient.invalidateQueries({ queryKey: commentsKeys.lists() });
      // Invalidate stats (status might have changed)
      queryClient.invalidateQueries({ queryKey: commentsKeys.stats() });
    },
  });
}

/**
 * Hook to delete a comment
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => commentsAPI.deleteComment(id),
    onSuccess: () => {
      // Invalidate all lists
      queryClient.invalidateQueries({ queryKey: commentsKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: commentsKeys.stats() });
    },
  });
}

/**
 * Hook for bulk comment actions (approve, spam, trash, delete)
 */
export function useBulkUpdateComments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BulkCommentRequest) =>
      commentsAPI.bulkUpdateComments(request),
    onSuccess: () => {
      // Invalidate all lists
      queryClient.invalidateQueries({ queryKey: commentsKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: commentsKeys.stats() });
    },
  });
}

/**
 * Hook to approve a comment (shorthand)
 */
export function useApproveComment() {
  const updateComment = useUpdateComment();

  return {
    ...updateComment,
    mutateAsync: (id: number) =>
      updateComment.mutateAsync({ id, updates: { status: 'approved' } }),
  };
}

/**
 * Hook to mark comment as spam (shorthand)
 */
export function useSpamComment() {
  const updateComment = useUpdateComment();

  return {
    ...updateComment,
    mutateAsync: (id: number) =>
      updateComment.mutateAsync({ id, updates: { status: 'spam' } }),
  };
}

/**
 * Hook to trash a comment (shorthand)
 */
export function useTrashComment() {
  const updateComment = useUpdateComment();

  return {
    ...updateComment,
    mutateAsync: (id: number) =>
      updateComment.mutateAsync({ id, updates: { status: 'trash' } }),
  };
}
