/**
 * Media Library API Client
 *
 * Handles all API interactions for the media library including:
 * - Uploading images with AI analysis
 * - Fetching media items
 * - Updating metadata
 * - Generating alt text
 */

import { getToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

// ============================================================================
// Types (matching backend spec)
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface MediaItem {
  id: number;
  filename: string;
  seoFilename?: string; // SEO-optimized filename
  url: string;
  thumbnailUrl: string | null;
  size: number;
  width: number | null;
  height: number | null;
  type: string;
  orientation: 'portrait' | 'landscape' | 'square' | null;
  altText: string | null;
  title: string | null;
  description: string | null;
  userTags: string[];
  aiAnalysis: AIAnalysis | null;
  uploadedAt: string;
  uploadedBy: User;
  space: Space | null;
}

export interface AIAnalysis {
  tags: AITag[];
  suggestedAltTexts: string[];
  dominantColors: string[];
  peopleCount: number;
  faces?: Face[];
  moderationFlags: ModerationFlags;
}

export interface AITag {
  id: string;
  label: string;
  confidence: number;
  category: 'object' | 'person' | 'emotion' | 'scene' | 'color' | 'text';
}

export interface Face {
  x: number;
  y: number;
  width: number;
  height: number;
  emotion?: string;
}

export interface ModerationFlags {
  isAdult: boolean;
  isViolent: boolean;
  confidence: number;
}

export interface User {
  id: number;
  name: string;
  avatar: string | null;
}

export interface Space {
  id: number;
  name: string;
  slug: string;
}

export interface MediaListResponse {
  items: MediaItem[];
  total: number;
}

export interface MediaUploadOptions {
  spaceId?: number;
  title?: string;
  description?: string;
  altText?: string;
  userTags?: string[];
  autoRename?: boolean; // Enable AI-generated SEO filename (default: true)
  customFilename?: string; // Custom SEO filename (overrides autoRename)
}

export interface MediaUpdateRequest {
  altText?: string;
  title?: string;
  description?: string;
  userTags?: string[];
}

export interface MediaListParams {
  spaceId?: number;
  userId?: number;
  type?: 'image';
  orientation?: 'portrait' | 'landscape' | 'square';
  tags?: string[];
  search?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GenerateAltTextRequest {
  imageUrl?: string;
  imageId?: number;
  count?: number;
}

export interface GenerateAltTextResponse {
  suggestions: string[];
}

// ============================================================================
// API Client
// ============================================================================

/**
 * Upload an image file with optional metadata
 * Returns the uploaded media item with AI analysis
 */
export async function uploadMedia(
  file: File,
  options?: MediaUploadOptions
): Promise<MediaItem> {
  const formData = new FormData();
  formData.append('file', file);

  if (options?.spaceId) {
    formData.append('spaceId', options.spaceId.toString());
  }
  if (options?.title) {
    formData.append('title', options.title);
  }
  if (options?.description) {
    formData.append('description', options.description);
  }
  if (options?.altText) {
    formData.append('altText', options.altText);
  }
  if (options?.userTags) {
    options.userTags.forEach(tag => {
      formData.append('userTags[]', tag);
    });
  }

  // SEO filename options
  if (options?.customFilename) {
    formData.append('customFilename', options.customFilename);
  }
  if (options?.autoRename !== undefined) {
    formData.append('autoRename', options.autoRename.toString());
  }

  const token = getToken();
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const result: ApiResponse<MediaItem> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error?.message || 'Upload failed');
  }

  return result.data;
}

/**
 * Get a list of media items with optional filtering
 */
export async function getMediaList(params?: MediaListParams): Promise<MediaItem[]> {
  const queryParams = new URLSearchParams();

  if (params?.spaceId) {
    queryParams.append('spaceId', params.spaceId.toString());
  }
  if (params?.userId) {
    queryParams.append('userId', params.userId.toString());
  }
  if (params?.type) {
    queryParams.append('type', params.type);
  }
  if (params?.orientation) {
    queryParams.append('orientation', params.orientation);
  }
  if (params?.tags) {
    params.tags.forEach(tag => {
      queryParams.append('tags[]', tag);
    });
  }
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  if (params?.sortOrder) {
    queryParams.append('sortOrder', params.sortOrder);
  }

  const url = `${API_BASE_URL}/api/media?${queryParams.toString()}`;
  const token = getToken();
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });
  const result: ApiResponse<MediaListResponse> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error?.message || 'Failed to fetch media');
  }

  return result.data.items;
}

/**
 * Get a single media item by ID
 */
export async function getMediaItem(id: number): Promise<MediaItem> {
  const token = getToken();
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/media/${id}`, { headers });
  const result: ApiResponse<MediaItem> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error?.message || 'Media item not found');
  }

  return result.data;
}

/**
 * Update media item metadata
 */
export async function updateMediaItem(
  id: number,
  updates: MediaUpdateRequest
): Promise<MediaItem> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/media/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(updates),
  });

  const result: ApiResponse<MediaItem> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error?.message || 'Update failed');
  }

  return result.data;
}

/**
 * Re-analyze an existing image
 */
export async function reanalyzeImage(id: number): Promise<AIAnalysis> {
  const token = getToken();
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/media/${id}/analyze`, {
    method: 'POST',
    headers,
  });

  const result: ApiResponse<{ aiAnalysis: AIAnalysis }> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error?.message || 'Analysis failed');
  }

  return result.data.aiAnalysis;
}

/**
 * Generate alt text suggestions for an image
 */
export async function generateAltText(
  request: GenerateAltTextRequest
): Promise<string[]> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/media/generate-alt-text`, {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  });

  const result: ApiResponse<GenerateAltTextResponse> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error?.message || 'Alt text generation failed');
  }

  return result.data.suggestions;
}

/**
 * Delete a media item
 */
export async function deleteMediaItem(id: number): Promise<void> {
  const token = getToken();
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/media/${id}`, {
    method: 'DELETE',
    headers,
  });

  // Handle 204 No Content (empty response body)
  if (response.status === 204) {
    return;
  }

  // Handle JSON response
  if (!response.ok) {
    // Try to parse error response
    try {
      const result: ApiResponse<null> = await response.json();
      throw new Error(result.error?.message || 'Delete failed');
    } catch {
      throw new Error('Delete failed');
    }
  }

  // If response has content, parse it
  const text = await response.text();
  if (text) {
    const result: ApiResponse<null> = JSON.parse(text);
    if (!result.success) {
      throw new Error(result.error?.message || 'Delete failed');
    }
  }
}

/**
 * Archive a media item
 */
export async function archiveMediaItem(id: number): Promise<MediaItem> {
  const token = getToken();
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/media/${id}/archive`, {
    method: 'POST',
    headers,
  });

  const result: ApiResponse<MediaItem> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error?.message || 'Archive failed');
  }

  return result.data;
}

/**
 * Unarchive a media item
 */
export async function unarchiveMediaItem(id: number): Promise<MediaItem> {
  const token = getToken();
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/media/${id}/unarchive`, {
    method: 'POST',
    headers,
  });

  const result: ApiResponse<MediaItem> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error?.message || 'Unarchive failed');
  }

  return result.data;
}
