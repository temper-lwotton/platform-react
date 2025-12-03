/**
 * React Query hooks for Taxonomies and Terms
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taxonomiesAPI, termsAPI } from '@/services/cms/api';
import {
  Taxonomy,
  Term,
  CreateTaxonomyInput,
  UpdateTaxonomyInput,
  CreateTermInput,
  UpdateTermInput,
  TermListParams,
} from '@/types/cms';

// Query keys for taxonomies
export const taxonomyKeys = {
  all: ['taxonomies'] as const,
  lists: () => [...taxonomyKeys.all, 'list'] as const,
  list: (params?: { space?: number; active?: boolean }) =>
    [...taxonomyKeys.lists(), params] as const,
  details: () => [...taxonomyKeys.all, 'detail'] as const,
  detail: (id: number) => [...taxonomyKeys.details(), id] as const,
};

// Query keys for terms
export const termKeys = {
  all: ['terms'] as const,
  lists: () => [...termKeys.all, 'list'] as const,
  list: (taxonomyId: number, params?: TermListParams) =>
    [...termKeys.lists(), taxonomyId, params] as const,
  details: () => [...termKeys.all, 'detail'] as const,
  detail: (id: number) => [...termKeys.details(), id] as const,
};

// ============================================================================
// Taxonomy Hooks
// ============================================================================

export function useTaxonomies(params?: { space?: number; active?: boolean }) {
  return useQuery({
    queryKey: taxonomyKeys.list(params),
    queryFn: () => taxonomiesAPI.list(params),
  });
}

export function useTaxonomy(id: number) {
  return useQuery({
    queryKey: taxonomyKeys.detail(id),
    queryFn: () => taxonomiesAPI.get(id),
    enabled: !!id,
  });
}

export function useCreateTaxonomy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaxonomyInput) => taxonomiesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxonomyKeys.lists() });
    },
  });
}

export function useUpdateTaxonomy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaxonomyInput }) =>
      taxonomiesAPI.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: taxonomyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taxonomyKeys.detail(variables.id) });
    },
  });
}

export function useDeleteTaxonomy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taxonomiesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxonomyKeys.lists() });
    },
  });
}

// ============================================================================
// Term Hooks
// ============================================================================

export function useTerms(taxonomyId: number, params?: TermListParams) {
  return useQuery({
    queryKey: termKeys.list(taxonomyId, params),
    queryFn: () => termsAPI.list(taxonomyId, params),
    enabled: !!taxonomyId,
  });
}

export function useTerm(id: number) {
  return useQuery({
    queryKey: termKeys.detail(id),
    queryFn: () => termsAPI.get(id),
    enabled: !!id,
  });
}

export function useCreateTerm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taxonomyId, data }: { taxonomyId: number; data: CreateTermInput }) =>
      termsAPI.create(taxonomyId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: termKeys.list(variables.taxonomyId) });
      queryClient.invalidateQueries({ queryKey: taxonomyKeys.lists() });
    },
  });
}

export function useUpdateTerm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTermInput }) =>
      termsAPI.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: termKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: termKeys.lists() });
    },
  });
}

export function useDeleteTerm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => termsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: termKeys.lists() });
    },
  });
}
