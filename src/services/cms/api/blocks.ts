/**
 * Block Templates API Service
 */

import cmsApiClient from './client';
import {
  BlockTemplate,
  CreateBlockTemplateInput,
  UpdateBlockTemplateInput,
  BlockTemplateListParams,
  ApiResponse,
} from '@/types/cms';

export const blockTemplatesAPI = {
  /**
   * List all block templates
   */
  list: async (params?: BlockTemplateListParams): Promise<ApiResponse<BlockTemplate[]>> => {
    const response = await cmsApiClient.get('/block-templates', { params });
    return response.data;
  },

  /**
   * Get a single block template
   */
  get: async (id: number): Promise<ApiResponse<BlockTemplate>> => {
    const response = await cmsApiClient.get(`/block-templates/${id}`);
    return response.data;
  },

  /**
   * Create a new block template
   */
  create: async (data: CreateBlockTemplateInput): Promise<ApiResponse<BlockTemplate>> => {
    const response = await cmsApiClient.post('/block-templates', data);
    return response.data;
  },

  /**
   * Update a block template
   */
  update: async (id: number, data: UpdateBlockTemplateInput): Promise<ApiResponse<BlockTemplate>> => {
    const response = await cmsApiClient.put(`/block-templates/${id}`, data);
    return response.data;
  },

  /**
   * Delete a block template
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await cmsApiClient.delete(`/block-templates/${id}`);
    return response.data;
  },
};
