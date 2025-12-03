/**
 * React Query hooks for Block Templates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blockTemplatesAPI } from '@/services/cms/api/blocks';
import {
  BlockTemplate,
  CreateBlockTemplateInput,
  UpdateBlockTemplateInput,
  BlockTemplateListParams,
} from '@/types/cms';

// Query keys
export const blockTemplateKeys = {
  all: ['blockTemplates'] as const,
  lists: () => [...blockTemplateKeys.all, 'list'] as const,
  list: (params?: BlockTemplateListParams) => [...blockTemplateKeys.lists(), params] as const,
  details: () => [...blockTemplateKeys.all, 'detail'] as const,
  detail: (id: number) => [...blockTemplateKeys.details(), id] as const,
};

/**
 * Hook to fetch all block templates
 */
export function useBlockTemplates(params?: BlockTemplateListParams) {
  return useQuery({
    queryKey: blockTemplateKeys.list(params),
    queryFn: () => blockTemplatesAPI.list(params),
  });
}

/**
 * Hook to fetch a single block template
 */
export function useBlockTemplate(id: number) {
  return useQuery({
    queryKey: blockTemplateKeys.detail(id),
    queryFn: () => blockTemplatesAPI.get(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a block template
 */
export function useCreateBlockTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlockTemplateInput) => blockTemplatesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockTemplateKeys.lists() });
    },
  });
}

/**
 * Hook to update a block template
 */
export function useUpdateBlockTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBlockTemplateInput }) =>
      blockTemplatesAPI.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: blockTemplateKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: blockTemplateKeys.lists() });
    },
  });
}

/**
 * Hook to delete a block template
 */
export function useDeleteBlockTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => blockTemplatesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockTemplateKeys.lists() });
    },
  });
}
