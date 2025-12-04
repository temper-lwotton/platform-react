/**
 * React Query hooks for SEO
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoAPI } from '@/services/cms/api';
import type { SEOMetadata, PermalinkConfig } from '@/services/cms/types/seo';

// Query keys
export const seoKeys = {
  all: ['seo'] as const,
  postSEO: (postId: number) => [...seoKeys.all, 'post', postId] as const,
  analysis: (content: string) => [...seoKeys.all, 'analysis', content] as const,
  sitemap: () => [...seoKeys.all, 'sitemap'] as const,
  permalink: () => [...seoKeys.all, 'permalink'] as const,
};

/**
 * Hook to fetch SEO metadata for a post
 */
export function usePostSEO(postId: number) {
  return useQuery({
    queryKey: seoKeys.postSEO(postId),
    queryFn: () => seoAPI.getPostSEO(postId),
    enabled: !!postId,
  });
}

/**
 * Hook to update SEO metadata for a post
 */
export function useUpdatePostSEO() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, metadata }: { postId: number; metadata: SEOMetadata }) =>
      seoAPI.updatePostSEO(postId, metadata),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: seoKeys.postSEO(variables.postId) });
    },
  });
}

/**
 * Hook to analyze content for SEO
 */
export function useSEOAnalysis(content: {
  title: string;
  content: string;
  focusKeyword?: string;
  metaDescription?: string;
}) {
  return useQuery({
    queryKey: seoKeys.analysis(JSON.stringify(content)),
    queryFn: () => seoAPI.analyzeSEO(content),
    enabled: !!content.title && !!content.content,
    staleTime: 30 * 1000, // Cache for 30 seconds
  });
}

/**
 * Hook to generate sitemap
 */
export function useSitemap() {
  return useQuery({
    queryKey: seoKeys.sitemap(),
    queryFn: () => seoAPI.generateSitemap(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

/**
 * Hook to get permalink configuration
 */
export function usePermalinkConfig() {
  return useQuery({
    queryKey: seoKeys.permalink(),
    queryFn: () => seoAPI.getPermalinkConfig(),
  });
}

/**
 * Hook to update permalink configuration
 */
export function useUpdatePermalinkConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (config: PermalinkConfig) => seoAPI.updatePermalinkConfig(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seoKeys.permalink() });
    },
  });
}
