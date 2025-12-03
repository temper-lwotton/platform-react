/**
 * Media API Service for CMS
 * Wraps media-api with CMS-specific adaptations
 */

import * as mediaAPI from '@/lib/media-api';

// Re-export types
export type {
  MediaItem,
  AIAnalysis,
  AITag,
  Face,
  ModerationFlags,
  User,
  Space,
  MediaUploadOptions,
  MediaUpdateRequest,
  MediaListParams,
} from '@/lib/media-api';

// Type alias for consistency
export type MediaUpdateData = mediaAPI.MediaUpdateRequest;

// Paginated response type
export interface PaginatedMediaResponse {
  items: mediaAPI.MediaItem[];
  total: number;
  page: number;
  limit: number;
}

// Extended params with pagination
export interface PaginatedMediaListParams extends mediaAPI.MediaListParams {
  page?: number;
  limit?: number;
}

/**
 * Get media items with pagination support
 */
export async function getMediaItems(
  params?: PaginatedMediaListParams
): Promise<{ data?: PaginatedMediaResponse; success: boolean }> {
  try {
    const items = await mediaAPI.getMediaList(params);

    // Since the backend doesn't support pagination yet, we'll simulate it
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const paginatedItems = items.slice(start, start + limit);

    return {
      success: true,
      data: {
        items: paginatedItems,
        total: items.length,
        page,
        limit,
      },
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}

/**
 * Upload media file
 */
export async function uploadMedia(
  file: File,
  options?: mediaAPI.MediaUploadOptions
): Promise<{ data?: mediaAPI.MediaItem; success: boolean }> {
  try {
    const item = await mediaAPI.uploadMedia(file, options);
    return {
      success: true,
      data: item,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}

/**
 * Get single media item
 */
export async function getMediaItem(
  id: number
): Promise<{ data?: mediaAPI.MediaItem; success: boolean }> {
  try {
    const item = await mediaAPI.getMediaItem(id);
    return {
      success: true,
      data: item,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}

/**
 * Update media item
 */
export async function updateMediaItem(
  id: number,
  data: mediaAPI.MediaUpdateRequest
): Promise<{ data?: mediaAPI.MediaItem; success: boolean }> {
  try {
    const item = await mediaAPI.updateMediaItem(id, data);
    return {
      success: true,
      data: item,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}

/**
 * Delete media item
 */
export async function deleteMediaItem(
  id: number
): Promise<{ success: boolean }> {
  try {
    await mediaAPI.deleteMediaItem(id);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}

/**
 * Generate alt text for media
 */
export async function generateAltText(
  id: number
): Promise<{ data?: string[]; success: boolean }> {
  try {
    const suggestions = await mediaAPI.generateAltText({ imageId: id });
    return {
      success: true,
      data: suggestions,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}

/**
 * Re-analyze media with AI
 */
export async function reanalyzeMedia(
  id: number
): Promise<{ data?: mediaAPI.AIAnalysis; success: boolean }> {
  try {
    const analysis = await mediaAPI.reanalyzeImage(id);
    return {
      success: true,
      data: analysis,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}

/**
 * Archive media item
 */
export async function archiveMediaItem(
  id: number
): Promise<{ data?: mediaAPI.MediaItem; success: boolean }> {
  try {
    const item = await mediaAPI.archiveMediaItem(id);
    return {
      success: true,
      data: item,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}

/**
 * Unarchive media item
 */
export async function unarchiveMediaItem(
  id: number
): Promise<{ data?: mediaAPI.MediaItem; success: boolean }> {
  try {
    const item = await mediaAPI.unarchiveMediaItem(id);
    return {
      success: true,
      data: item,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
