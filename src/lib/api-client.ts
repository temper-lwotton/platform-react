import { getToken, clearAuth } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

// Custom error class for auth errors
export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthError';
    }
}

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        // Handle 401 Unauthorized - clear auth and notify
        if (res.status === 401) {
            clearAuth();
            // Dispatch custom event so components can react
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('auth:logout'));
            }
            throw new AuthError('Session expired. Please log in again.');
        }

        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text}`);
    }

    // Handle 204 No Content responses
    if (res.status === 204) {
        return undefined as T;
    }

    return res.json() as Promise<T>;
}
