/**
 * Post Types API Service
 */

import cmsApiClient from './client';
import {
  PostType,
  CreatePostTypeInput,
  UpdatePostTypeInput,
  ApiResponse,
} from '@/types/cms';

export const postTypesAPI = {
  /**
   * List all post types
   */
  list: async (params?: { space?: number; active?: boolean }): Promise<ApiResponse<PostType[]>> => {
    const response = await cmsApiClient.get('/post-types', { params });
    return response.data;
  },

  /**
   * Get a single post type
   */
  get: async (id: number): Promise<ApiResponse<PostType>> => {
    const response = await cmsApiClient.get(`/post-types/${id}`);
    return response.data;
  },

  /**
   * Create a new post type
   */
  create: async (data: CreatePostTypeInput): Promise<ApiResponse<PostType>> => {
    const response = await cmsApiClient.post('/post-types', data);
    return response.data;
  },

  /**
   * Update a post type
   */
  update: async (id: number, data: UpdatePostTypeInput): Promise<ApiResponse<PostType>> => {
    const response = await cmsApiClient.put(`/post-types/${id}`, data);
    return response.data;
  },

  /**
   * Delete a post type
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await cmsApiClient.delete(`/post-types/${id}`);
    return response.data;
  },
};
