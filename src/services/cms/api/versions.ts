/**
 * Post Versions API Service
 */

import cmsApiClient from './client';
import {
  PostVersion,
  PostVersionListItem,
  CreateVersionInput,
  PublishVersionResponse,
  VersionComparison,
  ApiResponse,
} from '@/types/cms';

export const versionsAPI = {
  /**
   * List all versions for a post
   */
  list: async (postId: number): Promise<ApiResponse<PostVersionListItem[]>> => {
    const response = await cmsApiClient.get(`/posts/${postId}/versions`);
    return response.data;
  },

  /**
   * Get a specific version
   */
  get: async (postId: number, versionId: number): Promise<ApiResponse<PostVersion>> => {
    const response = await cmsApiClient.get(`/posts/${postId}/versions/${versionId}`);
    return response.data;
  },

  /**
   * Create a new version (save)
   */
  create: async (
    postId: number,
    data: CreateVersionInput
  ): Promise<ApiResponse<PostVersion>> => {
    const response = await cmsApiClient.post(`/posts/${postId}/versions`, data);
    return response.data;
  },

  /**
   * Create an autosave
   */
  autosave: async (
    postId: number,
    data: Omit<CreateVersionInput, 'isAutosave'>
  ): Promise<ApiResponse<PostVersion>> => {
    const response = await cmsApiClient.post(`/posts/${postId}/autosave`, data);
    return response.data;
  },

  /**
   * Publish a specific version
   */
  publish: async (
    postId: number,
    versionId: number
  ): Promise<ApiResponse<PublishVersionResponse>> => {
    const response = await cmsApiClient.post(`/posts/${postId}/publish/${versionId}`);
    return response.data;
  },

  /**
   * Unpublish a post
   */
  unpublish: async (postId: number): Promise<ApiResponse<void>> => {
    const response = await cmsApiClient.post(`/posts/${postId}/unpublish`);
    return response.data;
  },

  /**
   * Compare two versions
   */
  compare: async (
    postId: number,
    v1: number,
    v2: number
  ): Promise<ApiResponse<VersionComparison>> => {
    const response = await cmsApiClient.get(`/posts/${postId}/versions/compare`, {
      params: { v1, v2 },
    });
    return response.data;
  },

  /**
   * Delete a version
   */
  delete: async (postId: number, versionId: number): Promise<ApiResponse<void>> => {
    const response = await cmsApiClient.delete(`/posts/${postId}/versions/${versionId}`);
    return response.data;
  },

  /**
   * Duplicate a version
   */
  duplicate: async (postId: number, versionId: number): Promise<ApiResponse<PostVersion>> => {
    const response = await cmsApiClient.post(`/posts/${postId}/versions/${versionId}/duplicate`);
    return response.data;
  },

  /**
   * Restore a version (makes it the latest version)
   */
  restore: async (postId: number, versionId: number): Promise<ApiResponse<PostVersion>> => {
    const response = await cmsApiClient.put(`/posts/${postId}/versions/${versionId}/restore`);
    return response.data;
  },
};
