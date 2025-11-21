import { apiFetch } from './api-client';

export interface SpaceUser {
    id: string;
    // Add other user fields as needed
}

export interface Space {
    id: string;
    createdAt: string;
    title: string;
    subtitle?: string;
    description?: string;
    isPublic: boolean;
    admins: SpaceUser[];
    members: SpaceUser[];
}

export function getSpaces(): Promise<Space[]> {
    return apiFetch<Space[]>('/api/spaces');
}

export function getSpace(id: string): Promise<Space> {
    return apiFetch<Space>(`/api/spaces/${id}`);
}
