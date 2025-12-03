/**
 * CMS API Client
 * Axios instance configured for CMS API calls with authentication
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getToken } from '@/lib/auth';
import { ApiError } from '@/types/cms';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const CMS_API_PREFIX = '/api/cms';

/**
 * Create configured axios instance for CMS API
 */
export const cmsApiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}${CMS_API_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

/**
 * Request interceptor - Add JWT token to all requests
 */
cmsApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors globally
 */
cmsApiClient.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response;
  },
  (error: AxiosError<any>) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const apiError: ApiError = {
        message: error.response.data?.message || error.message,
        statusCode: error.response.status,
        errors: error.response.data?.errors,
      };

      // Handle authentication errors
      if (error.response.status === 401) {
        // Token expired or invalid
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
          // Optionally redirect to login
          // window.location.href = '/login';
        }
      }

      // Handle forbidden errors
      if (error.response.status === 403) {
        console.error('Access forbidden:', apiError.message);
      }

      return Promise.reject(apiError);
    } else if (error.request) {
      // Request made but no response received
      const apiError: ApiError = {
        message: 'No response from server. Please check your connection.',
        statusCode: 0,
      };
      return Promise.reject(apiError);
    } else {
      // Error setting up the request
      const apiError: ApiError = {
        message: error.message,
        statusCode: 0,
      };
      return Promise.reject(apiError);
    }
  }
);

/**
 * Helper function to handle file uploads
 */
export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await cmsApiClient.post('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  return response.data.data.url;
};

export default cmsApiClient;
