/**
 * React Query hooks for Post Types
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postTypesAPI } from '@/services/cms/api';
import { PostType, CreatePostTypeInput, UpdatePostTypeInput } from '@/types/cms';

// Query keys
export const postTypeKeys = {
  all: ['postTypes'] as const,
  lists: () => [...postTypeKeys.all, 'list'] as const,
  list: (params?: { space?: number; active?: boolean }) =>
    [...postTypeKeys.lists(), params] as const,
  details: () => [...postTypeKeys.all, 'detail'] as const,
  detail: (id: number) => [...postTypeKeys.details(), id] as const,
};

/**
 * Hook to fetch all post types
 */
export function usePostTypes(params?: { space?: number; active?: boolean }) {
  return useQuery({
    queryKey: postTypeKeys.list(params),
    queryFn: () => postTypesAPI.list(params),
  });
}

/**
 * Hook to fetch a single post type
 */
export function usePostType(id: number) {
  return useQuery({
    queryKey: postTypeKeys.detail(id),
    queryFn: () => postTypesAPI.get(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new post type
 */
export function useCreatePostType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostTypeInput) => postTypesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postTypeKeys.lists() });
    },
  });
}

/**
 * Hook to update a post type
 */
export function useUpdatePostType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostTypeInput }) =>
      postTypesAPI.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: postTypeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postTypeKeys.detail(variables.id) });
    },
  });
}

/**
 * Hook to delete a post type
 */
export function useDeletePostType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postTypesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postTypeKeys.lists() });
    },
  });
}
