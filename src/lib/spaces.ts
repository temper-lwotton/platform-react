import { apiFetch } from './api-client';

export interface SpaceUser {
    id: string;
    // Add other user fields as needed
}

export interface SpaceTag {
    id: number;
    name: string;
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
    tags?: SpaceTag[];
}

export interface SpacesQueryParams {
    search?: string;
    tags?: number[];
    matchAllTags?: boolean;
    sort?: 'asc' | 'desc';
}

export function getSpaces(params?: SpacesQueryParams): Promise<Space[]> {
    const queryParams = new URLSearchParams();

    if (params?.search) {
        queryParams.append('search', params.search);
    }

    if (params?.tags && params.tags.length > 0) {
        params.tags.forEach(tagId => {
            queryParams.append('tags[]', tagId.toString());
        });
    }

    if (params?.matchAllTags) {
        queryParams.append('matchAllTags', 'true');
    }

    if (params?.sort) {
        queryParams.append('sort', params.sort);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/api/spaces?${queryString}` : '/api/spaces';

    return apiFetch<Space[]>(url);
}

export function getSpace(id: string): Promise<Space> {
    return apiFetch<Space>(`/api/spaces/${id}`);
}

// Get all available tags (assuming there's an endpoint for this)
export function getSpaceTags(): Promise<SpaceTag[]> {
    return apiFetch<SpaceTag[]>('/api/spaces/tags');
}
