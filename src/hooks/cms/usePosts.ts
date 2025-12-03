/**
 * React Query hooks for Posts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsAPI } from '@/services/cms/api';
import {
  Post,
  PostListParams,
  CreatePostInput,
  UpdatePostInput,
  PaginatedResponse,
} from '@/types/cms';

// Query keys
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (params?: PostListParams) => [...postKeys.lists(), params] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated list of posts
 */
export function usePosts(params?: PostListParams) {
  return useQuery<PaginatedResponse<Post>>({
    queryKey: postKeys.list(params),
    queryFn: () => postsAPI.list(params),
  });
}

/**
 * Hook to fetch a single post
 */
export function usePost(
  id: number,
  options?: { includeMeta?: boolean; includeVersions?: boolean }
) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postsAPI.get(id, options),
    enabled: !!id,
  });
}

/**
 * Hook to create a new post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostInput) => postsAPI.create(data),
    onSuccess: () => {
      // Invalidate and refetch posts list
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Hook to update an existing post
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostInput }) =>
      postsAPI.update(id, data),
    onSuccess: (response, variables) => {
      // Invalidate lists and the specific post
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.id) });
    },
  });
}

/**
 * Hook to delete a post
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permanent }: { id: number; permanent?: boolean }) =>
      postsAPI.delete(id, permanent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Hook to duplicate a post
 */
export function useDuplicatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postsAPI.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}
