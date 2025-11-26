import { apiFetch } from './api-client';

// Base interfaces for normalized relations
export interface Space {
  id: number;
  name: string;
  slug: string;
  description: string;
  photo?: string;
  privacy: string;
  memberCount?: number;
  discussionCount?: number;
}

export interface User {
  id: number;
  name: string;
  username: string;
  avatar?: string;
  email?: string;
  bio?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

// Event interface matching the API response
export interface Event {
  id: number;
  createdAt: string;
  externalId?: number;
  title: string;
  slug: string;
  htmlContent: string;
  jsonContent: any;
  eventStart: string;
  eventEnd: string;
  isOnline: boolean;
  location?: string;
  link?: string;
  photo?: string;
  space: Space;
  author: User;
  tags: Tag[];
}

// Query parameters for filtering events
export interface EventsQueryParams {
  search?: string;
  tags?: number[];
  matchAllTags?: boolean;
  sort?: 'asc' | 'desc';
  space?: number;
  limit?: number;
  offset?: number;
}

// Create/Update event payload
export interface EventPayload {
  title: string;
  space: number;
  startDateTime: string; // ISO 8601 format (e.g., "2025-11-27T10:00:00Z")
  endDateTime: string;   // ISO 8601 format (e.g., "2025-11-27T12:00:00Z")
  htmlContent: string;
  jsonContent: any;
  isOnline: boolean;
  location?: string;     // Only include for in-person events (when isOnline is false)
  link?: string;         // Optional - event link, meeting URL, or registration page
  tagIds?: number[];
  // Notes:
  // - author is auto-populated from authenticated user on backend
  // - photo must be uploaded separately via multipart/form-data
}

/**
 * Get all events with optional filtering
 * @param params - Query parameters for filtering
 * @returns Promise<Event[]>
 */
export function getEvents(params?: EventsQueryParams): Promise<Event[]> {
  const queryParams = new URLSearchParams();

  if (params?.search) {
    queryParams.append('search', params.search);
  }

  if (params?.tags && params.tags.length > 0) {
    params.tags.forEach(tagId => {
      queryParams.append('tags[]', tagId.toString());
    });
  }

  if (params?.matchAllTags !== undefined) {
    queryParams.append('matchAllTags', params.matchAllTags.toString());
  }

  if (params?.sort) {
    queryParams.append('sort', params.sort);
  }

  if (params?.space !== undefined) {
    queryParams.append('space', params.space.toString());
  }

  if (params?.limit !== undefined) {
    queryParams.append('limit', params.limit.toString());
  }

  if (params?.offset !== undefined) {
    queryParams.append('offset', params.offset.toString());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/api/events?${queryString}` : '/api/events';

  return apiFetch<Event[]>(url);
}

/**
 * Get a single event by ID
 * @param id - Event ID
 * @returns Promise<Event>
 */
export function getEvent(id: string | number): Promise<Event> {
  return apiFetch<Event>(`/api/events/${id}`);
}

/**
 * Create a new event
 * @param data - Event data
 * @returns Promise<Event>
 */
export function createEvent(data: EventPayload): Promise<Event> {
  return apiFetch<Event>('/api/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Create a new event with photo upload
 * Uses FormData to support file upload
 * @param data - Event data
 * @param photoFile - Photo file to upload (optional)
 * @returns Promise<Event>
 */
export async function createEventWithPhoto(data: EventPayload, photoFile?: File): Promise<Event> {
  const formData = new FormData();

  // Add all event fields
  formData.append('title', data.title);
  formData.append('space', data.space.toString());
  formData.append('startDateTime', data.startDateTime);
  formData.append('endDateTime', data.endDateTime);
  formData.append('htmlContent', data.htmlContent);
  formData.append('jsonContent', JSON.stringify(data.jsonContent));
  formData.append('isOnline', data.isOnline.toString());

  // Optional fields
  if (data.location) {
    formData.append('location', data.location);
  }
  if (data.link) {
    formData.append('link', data.link);
  }
  if (data.tagIds && data.tagIds.length > 0) {
    data.tagIds.forEach(tagId => {
      formData.append('tagIds[]', tagId.toString());
    });
  }

  // Add photo file if provided
  if (photoFile) {
    formData.append('photo', photoFile);
  }

  // Use direct fetch to avoid Content-Type being set
  // (Browser needs to set Content-Type with multipart boundary automatically)
  const { getToken, clearAuth } = await import('./auth');
  const token = getToken();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

  const headers: HeadersInit = {};
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  // NOTE: Do NOT set Content-Type - browser will set it automatically with boundary

  const response = await fetch(`${API_BASE_URL}/api/events`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAuth();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
      throw new Error('Session expired. Please log in again.');
    }
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  return response.json() as Promise<Event>;
}

/**
 * Update an existing event
 * @param id - Event ID
 * @param data - Partial event data to update
 * @returns Promise<Event>
 */
export function updateEvent(id: string | number, data: Partial<EventPayload>): Promise<Event> {
  return apiFetch<Event>(`/api/events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete an event
 * @param id - Event ID
 * @returns Promise<void>
 */
export function deleteEvent(id: string | number): Promise<void> {
  return apiFetch<void>(`/api/events/${id}`, {
    method: 'DELETE',
  });
}

/**
 * RSVP to an event
 * @param id - Event ID
 * @param status - RSVP status (going, maybe, not_going)
 * @returns Promise<void>
 */
export function rsvpToEvent(id: string | number, status: 'going' | 'maybe' | 'not_going'): Promise<void> {
  return apiFetch<void>(`/api/events/${id}/rsvp`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}

/**
 * Get attendees for an event
 * @param id - Event ID
 * @returns Promise<User[]>
 */
export function getEventAttendees(id: string | number): Promise<User[]> {
  return apiFetch<User[]>(`/api/events/${id}/attendees`);
}

/**
 * Format event date range for display
 * @param start - Start date string
 * @param end - End date string
 * @returns Formatted date range string
 */
export function formatEventDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };

  const startFormatted = startDate.toLocaleString('en-US', options);
  const endFormatted = endDate.toLocaleString('en-US', options);

  // If same day, show time range
  if (startDate.toDateString() === endDate.toDateString()) {
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
    };
    const endTime = endDate.toLocaleString('en-US', timeOptions);
    return `${startFormatted} - ${endTime}`;
  }

  return `${startFormatted} - ${endFormatted}`;
}

/**
 * Check if an event is upcoming
 * @param eventStart - Event start date string
 * @returns boolean
 */
export function isUpcoming(eventStart: string): boolean {
  return new Date(eventStart) > new Date();
}

/**
 * Check if an event is currently happening
 * @param eventStart - Event start date string
 * @param eventEnd - Event end date string
 * @returns boolean
 */
export function isOngoing(eventStart: string, eventEnd: string): boolean {
  const now = new Date();
  return new Date(eventStart) <= now && new Date(eventEnd) >= now;
}

/**
 * Check if an event is past
 * @param eventEnd - Event end date string
 * @returns boolean
 */
export function isPast(eventEnd: string): boolean {
  return new Date(eventEnd) < new Date();
}
