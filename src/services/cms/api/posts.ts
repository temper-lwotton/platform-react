/**
 * Posts API Service
 */

import cmsApiClient from './client';
import {
  Post,
  CreatePostInput,
  UpdatePostInput,
  PostListParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/cms';

export const postsAPI = {
  /**
   * List all posts with optional filters
   */
  list: async (params?: PostListParams): Promise<PaginatedResponse<Post>> => {
    const response = await cmsApiClient.get('/posts', { params });
    return response.data;
  },

  /**
   * Get a single post by ID
   */
  get: async (
    id: number,
    options?: { includeMeta?: boolean; includeVersions?: boolean }
  ): Promise<ApiResponse<Post>> => {
    const response = await cmsApiClient.get(`/posts/${id}`, { params: options });
    return response.data;
  },

  /**
   * Get published post by slug (public endpoint)
   */
  getPublished: async (slug: string): Promise<ApiResponse<Post>> => {
    const response = await cmsApiClient.get(`/posts/${slug}/published`);
    return response.data;
  },

  /**
   * Create a new post
   */
  create: async (data: CreatePostInput): Promise<ApiResponse<Post>> => {
    const response = await cmsApiClient.post('/posts', data);
    return response.data;
  },

  /**
   * Update an existing post
   */
  update: async (id: number, data: UpdatePostInput): Promise<ApiResponse<Post>> => {
    const response = await cmsApiClient.put(`/posts/${id}`, data);
    return response.data;
  },

  /**
   * Delete (archive) a post
   */
  delete: async (id: number, permanent: boolean = false): Promise<ApiResponse<void>> => {
    const response = await cmsApiClient.delete(`/posts/${id}`, {
      params: { permanent },
    });
    return response.data;
  },

  /**
   * Duplicate a post
   */
  duplicate: async (id: number): Promise<ApiResponse<Post>> => {
    const response = await cmsApiClient.post(`/posts/${id}/duplicate`);
    return response.data;
  },
};
