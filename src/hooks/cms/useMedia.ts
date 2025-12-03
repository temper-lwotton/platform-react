/**
 * React Query hooks for Media Library
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import * as mediaAPI from '@/services/cms/api/media';

// Query keys
export const mediaKeys = {
  all: ['media'] as const,
  lists: () => [...mediaKeys.all, 'list'] as const,
  list: (params?: mediaAPI.PaginatedMediaListParams) => [...mediaKeys.lists(), params] as const,
  infinite: (params?: mediaAPI.PaginatedMediaListParams) => [...mediaKeys.lists(), 'infinite', params] as const,
  details: () => [...mediaKeys.all, 'detail'] as const,
  detail: (id: number) => [...mediaKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated media items
 */
export function useMediaItems(params?: mediaAPI.PaginatedMediaListParams) {
  return useQuery({
    queryKey: mediaKeys.list(params),
    queryFn: () => mediaAPI.getMediaItems(params),
  });
}

/**
 * Hook to fetch media items with infinite scroll
 */
export function useInfiniteMediaItems(params?: Omit<mediaAPI.PaginatedMediaListParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: mediaKeys.infinite(params),
    queryFn: ({ pageParam = 1 }) =>
      mediaAPI.getMediaItems({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      const currentPage = pages.length;
      const totalPages = Math.ceil((lastPage.data?.total || 0) / (params?.limit || 20));
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

/**
 * Hook to fetch a single media item
 */
export function useMediaItem(id: number) {
  return useQuery({
    queryKey: mediaKeys.detail(id),
    queryFn: () => mediaAPI.getMediaItem(id),
    enabled: !!id,
  });
}

/**
 * Hook to upload media files
 */
export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, options }: { file: File; options?: mediaAPI.MediaUploadOptions }) =>
      mediaAPI.uploadMedia(file, options),
    onSuccess: () => {
      // Invalidate all media lists to show the new upload
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}

/**
 * Hook to update media metadata
 */
export function useUpdateMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: mediaAPI.MediaUpdateData }) =>
      mediaAPI.updateMediaItem(id, data),
    onSuccess: (response, variables) => {
      // Invalidate the specific item and all lists
      queryClient.invalidateQueries({ queryKey: mediaKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}

/**
 * Hook to delete media
 */
export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => mediaAPI.deleteMediaItem(id),
    onSuccess: () => {
      // Invalidate all lists
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}

/**
 * Hook to generate alt text for media
 */
export function useGenerateAltText() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => mediaAPI.generateAltText(id),
    onSuccess: (response, id) => {
      // Invalidate the specific item
      queryClient.invalidateQueries({ queryKey: mediaKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}

/**
 * Hook to re-analyze media with AI
 */
export function useReanalyzeMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => mediaAPI.reanalyzeMedia(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}

/**
 * Hook to archive/unarchive media
 */
export function useArchiveMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, archive }: { id: number; archive: boolean }) =>
      archive ? mediaAPI.archiveMediaItem(id) : mediaAPI.unarchiveMediaItem(id),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}

/**
 * Hook for bulk delete
 */
export function useBulkDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) =>
      Promise.all(ids.map(id => mediaAPI.deleteMediaItem(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}
