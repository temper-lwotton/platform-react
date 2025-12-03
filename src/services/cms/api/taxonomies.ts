/**
 * Taxonomies & Terms API Service
 */

import cmsApiClient from './client';
import {
  Taxonomy,
  Term,
  CreateTaxonomyInput,
  UpdateTaxonomyInput,
  CreateTermInput,
  UpdateTermInput,
  TermListParams,
  ApiResponse,
  Post,
  PostListParams,
  PaginatedResponse,
} from '@/types/cms';

export const taxonomiesAPI = {
  /**
   * List all taxonomies
   */
  list: async (params?: { space?: number; active?: boolean }): Promise<ApiResponse<Taxonomy[]>> => {
    const response = await cmsApiClient.get('/taxonomies', { params });
    return response.data;
  },

  /**
   * Get a single taxonomy
   */
  get: async (id: number): Promise<ApiResponse<Taxonomy>> => {
    const response = await cmsApiClient.get(`/taxonomies/${id}`);
    return response.data;
  },

  /**
   * Create a new taxonomy
   */
  create: async (data: CreateTaxonomyInput): Promise<ApiResponse<Taxonomy>> => {
    const response = await cmsApiClient.post('/taxonomies', data);
    return response.data;
  },

  /**
   * Update a taxonomy
   */
  update: async (id: number, data: UpdateTaxonomyInput): Promise<ApiResponse<Taxonomy>> => {
    const response = await cmsApiClient.put(`/taxonomies/${id}`, data);
    return response.data;
  },

  /**
   * Delete a taxonomy
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await cmsApiClient.delete(`/taxonomies/${id}`);
    return response.data;
  },
};

export const termsAPI = {
  /**
   * List terms for a taxonomy
   */
  list: async (taxonomyId: number, params?: TermListParams): Promise<ApiResponse<Term[]>> => {
    const response = await cmsApiClient.get(`/taxonomies/${taxonomyId}/terms`, { params });
    return response.data;
  },

  /**
   * Get a single term
   */
  get: async (id: number): Promise<ApiResponse<Term>> => {
    const response = await cmsApiClient.get(`/terms/${id}`);
    return response.data;
  },

  /**
   * Create a new term
   */
  create: async (taxonomyId: number, data: CreateTermInput): Promise<ApiResponse<Term>> => {
    const response = await cmsApiClient.post(`/taxonomies/${taxonomyId}/terms`, data);
    return response.data;
  },

  /**
   * Update a term
   */
  update: async (id: number, data: UpdateTermInput): Promise<ApiResponse<Term>> => {
    const response = await cmsApiClient.put(`/terms/${id}`, data);
    return response.data;
  },

  /**
   * Delete a term
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await cmsApiClient.delete(`/terms/${id}`);
    return response.data;
  },

  /**
   * Get posts by term
   */
  getPosts: async (id: number, params?: PostListParams): Promise<PaginatedResponse<Post>> => {
    const response = await cmsApiClient.get(`/terms/${id}/posts`, { params });
    return response.data;
  },
};
