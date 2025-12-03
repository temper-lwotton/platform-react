/**
 * React Query hooks for CMS Settings
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsAPI } from '@/services/cms/api';
import type {
  CMSSettings,
  GeneralSettings,
  MediaSettings,
  ReadingSettings,
  WritingSettings,
  DiscussionSettings,
  PermalinkSettings,
} from '@/services/cms/types/settings';

// Query keys
export const settingsKeys = {
  all: ['settings'] as const,
  general: () => [...settingsKeys.all, 'general'] as const,
  media: () => [...settingsKeys.all, 'media'] as const,
  reading: () => [...settingsKeys.all, 'reading'] as const,
  writing: () => [...settingsKeys.all, 'writing'] as const,
  discussion: () => [...settingsKeys.all, 'discussion'] as const,
  permalinks: () => [...settingsKeys.all, 'permalinks'] as const,
};

/**
 * Hook to fetch all settings
 */
export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: () => settingsAPI.getSettings(),
  });
}

/**
 * Hook to fetch general settings
 */
export function useGeneralSettings() {
  return useQuery({
    queryKey: settingsKeys.general(),
    queryFn: () => settingsAPI.getSettingsCategory('general'),
  });
}

/**
 * Hook to fetch media settings
 */
export function useMediaSettings() {
  return useQuery({
    queryKey: settingsKeys.media(),
    queryFn: () => settingsAPI.getSettingsCategory('media'),
  });
}

/**
 * Hook to fetch reading settings
 */
export function useReadingSettings() {
  return useQuery({
    queryKey: settingsKeys.reading(),
    queryFn: () => settingsAPI.getSettingsCategory('reading'),
  });
}

/**
 * Hook to fetch writing settings
 */
export function useWritingSettings() {
  return useQuery({
    queryKey: settingsKeys.writing(),
    queryFn: () => settingsAPI.getSettingsCategory('writing'),
  });
}

/**
 * Hook to fetch discussion settings
 */
export function useDiscussionSettings() {
  return useQuery({
    queryKey: settingsKeys.discussion(),
    queryFn: () => settingsAPI.getSettingsCategory('discussion'),
  });
}

/**
 * Hook to fetch permalink settings
 */
export function usePermalinkSettings() {
  return useQuery({
    queryKey: settingsKeys.permalinks(),
    queryFn: () => settingsAPI.getSettingsCategory('permalinks'),
  });
}

/**
 * Hook to update general settings
 */
export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<GeneralSettings>) =>
      settingsAPI.updateGeneralSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.general() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}

/**
 * Hook to update media settings
 */
export function useUpdateMediaSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<MediaSettings>) =>
      settingsAPI.updateMediaSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.media() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}

/**
 * Hook to update reading settings
 */
export function useUpdateReadingSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<ReadingSettings>) =>
      settingsAPI.updateReadingSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.reading() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}

/**
 * Hook to update writing settings
 */
export function useUpdateWritingSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<WritingSettings>) =>
      settingsAPI.updateWritingSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.writing() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}

/**
 * Hook to update discussion settings
 */
export function useUpdateDiscussionSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<DiscussionSettings>) =>
      settingsAPI.updateDiscussionSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.discussion() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}

/**
 * Hook to update permalink settings
 */
export function useUpdatePermalinkSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<PermalinkSettings>) =>
      settingsAPI.updatePermalinkSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.permalinks() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}

/**
 * Hook to reset all settings to defaults
 */
export function useResetSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => settingsAPI.resetSettings(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}
