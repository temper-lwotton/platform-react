/**
 * React Query hooks for Post Versions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { versionsAPI } from '@/services/cms/api';
import {
  PostVersion,
  PostVersionListItem,
  CreateVersionInput,
} from '@/types/cms';
import { postKeys } from './usePosts';

// Query keys
export const versionKeys = {
  all: ['versions'] as const,
  lists: () => [...versionKeys.all, 'list'] as const,
  list: (postId: number) => [...versionKeys.lists(), postId] as const,
  details: () => [...versionKeys.all, 'detail'] as const,
  detail: (postId: number, versionId: number) =>
    [...versionKeys.details(), postId, versionId] as const,
};

/**
 * Hook to fetch all versions for a post
 */
export function useVersions(postId: number) {
  return useQuery({
    queryKey: versionKeys.list(postId),
    queryFn: () => versionsAPI.list(postId),
    enabled: !!postId,
  });
}

/**
 * Hook to fetch a specific version
 */
export function useVersion(postId: number, versionId: number) {
  return useQuery({
    queryKey: versionKeys.detail(postId, versionId),
    queryFn: () => versionsAPI.get(postId, versionId),
    enabled: !!postId && !!versionId,
  });
}

/**
 * Hook to create a new version (save)
 */
export function useCreateVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: number; data: CreateVersionInput }) =>
      versionsAPI.create(postId, data),
    onSuccess: (response, variables) => {
      // Invalidate versions list and post details
      queryClient.invalidateQueries({ queryKey: versionKeys.list(variables.postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
    },
  });
}

/**
 * Hook to create an autosave
 */
export function useAutosaveVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: number;
      data: Omit<CreateVersionInput, 'isAutosave'>;
    }) => versionsAPI.autosave(postId, data),
    onSuccess: (response, variables) => {
      // Invalidate versions list
      queryClient.invalidateQueries({ queryKey: versionKeys.list(variables.postId) });
    },
  });
}

/**
 * Hook to publish a version
 */
export function usePublishVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, versionId }: { postId: number; versionId: number }) =>
      versionsAPI.publish(postId, versionId),
    onSuccess: (response, variables) => {
      // Invalidate post and versions
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: versionKeys.list(variables.postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Hook to unpublish a post
 */
export function useUnpublishPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => versionsAPI.unpublish(postId),
    onSuccess: (response, postId) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Hook to delete a version
 */
export function useDeleteVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, versionId }: { postId: number; versionId: number }) =>
      versionsAPI.delete(postId, versionId),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: versionKeys.list(variables.postId) });
    },
  });
}

/**
 * Hook to restore a version (makes it the latest version)
 */
export function useRestoreVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, versionId }: { postId: number; versionId: number }) =>
      versionsAPI.restore(postId, versionId),
    onSuccess: (response, variables) => {
      // Invalidate post details and versions list
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: versionKeys.list(variables.postId) });
    },
  });
}

/**
 * Hook to compare two versions
 */
export function useCompareVersions(postId: number, v1: number, v2: number) {
  return useQuery({
    queryKey: [...versionKeys.all, 'compare', postId, v1, v2] as const,
    queryFn: () => versionsAPI.compare(postId, v1, v2),
    enabled: !!postId && !!v1 && !!v2,
  });
}

/**
 * Hook to duplicate a version
 */
export function useDuplicateVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, versionId }: { postId: number; versionId: number }) =>
      versionsAPI.duplicate(postId, versionId),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: versionKeys.list(variables.postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
    },
  });
}
