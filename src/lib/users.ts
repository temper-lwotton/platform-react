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
    bio?: string;
    interests?: string[];
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
    connectionStatus?: 'none' | 'pending' | 'connected';
}

export interface UsersQueryParams {
    search?: string;
    companyType?: string;
    transportMode?: string;
    sort?: 'name' | 'newest' | 'oldest';
    limit?: number;
}

export function getUsers(params?: UsersQueryParams): Promise<User[]> {
    const queryParams = new URLSearchParams();

    if (params?.search) {
        queryParams.append('search', params.search);
    }

    if (params?.companyType) {
        queryParams.append('companyType', params.companyType);
    }

    if (params?.transportMode) {
        queryParams.append('transportMode', params.transportMode);
    }

    if (params?.sort) {
        queryParams.append('sort', params.sort);
    }

    if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/api/users?${queryString}` : '/api/users';

    return apiFetch<User[]>(url);
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

// Connection management functions
export interface ConnectionRequestUser {
    id: number;
    name: string;
    email: string;
    photo: string | null;
}

export interface ConnectionRequest {
    id: number;
    sender: ConnectionRequestUser;
    recipient: ConnectionRequestUser;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
    createdAt: string; // "Y-m-d H:i:s" format
    closedAt: string | null; // "Y-m-d H:i:s" format
}

export function sendConnectionRequest(senderId: string | number, recipientId: string | number): Promise<ConnectionRequest> {
    return apiFetch<ConnectionRequest>(`/api/users/${senderId}/connection-requests/${recipientId}`, {
        method: 'POST',
    });
}

export function acceptConnectionRequest(requestId: string | number): Promise<ConnectionRequest> {
    return apiFetch<ConnectionRequest>(`/api/users/connection-requests/${requestId}/accept`, {
        method: 'POST',
    });
}

export function declineConnectionRequest(requestId: string | number): Promise<ConnectionRequest> {
    return apiFetch<ConnectionRequest>(`/api/users/connection-requests/${requestId}/decline`, {
        method: 'POST',
    });
}

export function removeConnection(userId: string | number, connectionId: string | number): Promise<void> {
    return apiFetch<void>(`/api/users/${userId}/connections/${connectionId}`, {
        method: 'DELETE',
    });
}

export function getConnections(userId: string | number): Promise<User[]> {
    return apiFetch<User[]>(`/api/users/${userId}/connections`);
}

export function getReceivedConnectionRequests(userId: string | number, status?: 'PENDING' | 'ACCEPTED' | 'DECLINED'): Promise<ConnectionRequest[]> {
    const queryParams = status ? `?status=${status}` : '';
    return apiFetch<ConnectionRequest[]>(`/api/users/${userId}/connection-requests/received${queryParams}`);
}

export function getSentConnectionRequests(userId: string | number, status?: 'PENDING' | 'ACCEPTED' | 'DECLINED'): Promise<ConnectionRequest[]> {
    const queryParams = status ? `?status=${status}` : '';
    return apiFetch<ConnectionRequest[]>(`/api/users/${userId}/connection-requests/sent${queryParams}`);
}

// Helper function to enrich users with connection status
export async function enrichUsersWithConnectionStatus(
    users: User[],
    currentUserId: string | number
): Promise<User[]> {
    if (!currentUserId || users.length === 0) {
        return users;
    }

    try {
        // Fetch all connection-related data in parallel
        const [connections, sentRequests, receivedRequests] = await Promise.all([
            getConnections(currentUserId).catch(() => []),
            getSentConnectionRequests(currentUserId, 'PENDING').catch(() => []),
            getReceivedConnectionRequests(currentUserId, 'PENDING').catch(() => [])
        ]);

        // Create lookup sets for faster checking
        const connectedUserIds = new Set(connections.map(u => String(u.id)));
        const sentRequestUserIds = new Set(sentRequests.map(r => String(r.recipient.id)));
        const receivedRequestUserIds = new Set(receivedRequests.map(r => String(r.sender.id)));

        // Enrich each user with their connection status
        return users.map(user => {
            const userId = String(user.id);
            const userIdNum = String(currentUserId);

            // Don't show connection status for self
            if (userId === userIdNum) {
                return { ...user, connectionStatus: 'none' as const };
            }

            // Check connection status
            if (connectedUserIds.has(userId)) {
                return { ...user, connectionStatus: 'connected' as const };
            }

            // Check if there's a pending request (sent or received)
            if (sentRequestUserIds.has(userId) || receivedRequestUserIds.has(userId)) {
                return { ...user, connectionStatus: 'pending' as const };
            }

            return { ...user, connectionStatus: 'none' as const };
        });
    } catch (error) {
        console.error('Error enriching users with connection status:', error);
        // Return users without connection status on error
        return users.map(user => ({ ...user, connectionStatus: 'none' as const }));
    }
}

// User Stats Interface
export interface UserStats {
    discussionsStarted: number;
    repliesMade: number;
    eventsCreated: number;
    resourcesShared: number;
    showcasesPublished: number;
    updatesPosted: number;
    totalConnections: number;
    spacesJoined: number;
    spacesAdministered: number;
    likesGiven: number;
    likesReceived: number;
    memberSince: string;
    lastActive: string;
    mostActiveSpace?: {
        id: string;
        title: string;
    };
}

// User Content Interface
export interface UserContent {
    discussions: any[];
    resources: any[];
    showcases: any[];
    updates: any[];
    events: any[];
}

// Get user stats (mock for now - will be replaced with API call)
export function getUserStats(userId: string): Promise<UserStats> {
    // TODO: Replace with actual API call
    return Promise.resolve({
        discussionsStarted: Math.floor(Math.random() * 50) + 5,
        repliesMade: Math.floor(Math.random() * 200) + 20,
        eventsCreated: Math.floor(Math.random() * 10) + 1,
        resourcesShared: Math.floor(Math.random() * 30) + 5,
        showcasesPublished: Math.floor(Math.random() * 8) + 1,
        updatesPosted: Math.floor(Math.random() * 100) + 10,
        totalConnections: Math.floor(Math.random() * 150) + 10,
        spacesJoined: Math.floor(Math.random() * 12) + 3,
        spacesAdministered: Math.floor(Math.random() * 3),
        likesGiven: Math.floor(Math.random() * 300) + 50,
        likesReceived: Math.floor(Math.random() * 400) + 30,
        memberSince: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        mostActiveSpace: {
            id: '1',
            title: 'AI & Machine Learning',
        },
    });
}

// Get user content (mock for now - will be replaced with API calls)
export function getUserContent(userId: string): Promise<UserContent> {
    // TODO: Replace with actual API calls to fetch user's content
    return Promise.resolve({
        discussions: [],
        resources: [],
        showcases: [],
        updates: [],
        events: [],
    });
}
