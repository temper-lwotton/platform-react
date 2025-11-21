import { apiFetch } from './api-client';

export interface UserProfile {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    companyName?: string;
    jobTitle?: string;
    dob?: string;
    telephone?: string;
    companyType?: string;
    linkedInProfile?: string;
    trigProjectTitle?: string;
    transportModesOfInterest?: string;
    photo?: string;
}

export interface UserSpace {
    id: string;
    title: string;
}

export interface User {
    id: string;
    createdAt: string;
    externalId?: string;
    email: string;
    profile: UserProfile;
    adminSpaces: UserSpace[];
    memberSpaces: UserSpace[];
}

export function getUsers(): Promise<User[]> {
    return apiFetch<User[]>('/api/users');
}

export function getUser(id: string): Promise<User> {
    return apiFetch<User>(`/api/users/${id}`);
}

export function createUser(data: Partial<User>): Promise<User> {
    return apiFetch<User>('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function updateUser(id: string, data: Partial<User>): Promise<User> {
    return apiFetch<User>(`/api/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export function deleteUser(id: string): Promise<void> {
    return apiFetch<void>(`/api/users/${id}`, {
        method: 'DELETE',
    });
}

export function getFollowing(id: string): Promise<User[]> {
    return apiFetch<User[]>(`/api/users/${id}/following`);
}

export function getFollowers(id: string): Promise<User[]> {
    return apiFetch<User[]>(`/api/users/${id}/followers`);
}

export function followUser(followerId: string, followeeId: string): Promise<void> {
    return apiFetch<void>(`/api/users/${followerId}/follows/${followeeId}`, {
        method: 'POST',
    });
}

export function unfollowUser(followerId: string, followeeId: string): Promise<void> {
    return apiFetch<void>(`/api/users/${followerId}/unfollows/${followeeId}`, {
        method: 'DELETE',
    });
}
