const TOKEN_KEY = 'jwt_token';
const USER_ID_KEY = 'current_user_id';
const USER_EMAIL_KEY = 'current_user_email';
const USER_NAME_KEY = 'current_user_name';

interface UserProfile {
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
    transportModesOfInterest?: string[];
    photo?: string;
}

interface UserSpace {
    id: number;
    title: string;
}

export interface AuthUser {
    id: string;
    email: string;
    fullName: string;
}

export interface FullUser {
    id: number;
    createdAt: string;
    externalId?: string;
    email: string;
    profile?: UserProfile;
    adminSpaces: UserSpace[];
    memberSpaces: UserSpace[];
}

interface LoginResponse {
    token: string;
    expires_in: number;
    user: {
        id: number | string;
        email: string;
        fullName: string;
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Get the stored JWT token
 */
export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store the JWT token
 */
export function setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Get the current user ID
 */
export function getCurrentUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(USER_ID_KEY);
}

/**
 * Store the current user ID
 */
export function setCurrentUserId(userId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_ID_KEY, userId);
}

/**
 * Get the current user email
 */
export function getCurrentUserEmail(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(USER_EMAIL_KEY);
}

/**
 * Get the current user name
 */
export function getCurrentUserName(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(USER_NAME_KEY);
}

/**
 * Get the current authenticated user
 */
export function getCurrentUser(): AuthUser | null {
    const id = getCurrentUserId();
    const email = getCurrentUserEmail();
    const fullName = getCurrentUserName();

    if (!id || !email) return null;

    return { id, email, fullName: fullName || '' };
}

/**
 * Clear the stored JWT token and user data
 */
export function clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_NAME_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return getToken() !== null;
}

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
    }

    const data: LoginResponse = await res.json();
    setToken(data.token);

    // Store user data
    if (data.user && typeof window !== 'undefined') {
        setCurrentUserId(String(data.user.id));
        localStorage.setItem(USER_EMAIL_KEY, data.user.email);
        localStorage.setItem(USER_NAME_KEY, data.user.fullName);

        // Dispatch login event so components can update
        window.dispatchEvent(new CustomEvent('auth:login'));
    }

    return data;
}

/**
 * Get current user from API with full details including spaces (requires valid token)
 */
export async function fetchCurrentUser(): Promise<FullUser> {
    const token = getToken();
    if (!token) {
        throw new Error('Not authenticated');
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';
    const res = await fetch(`${apiBaseUrl}/api/auth/me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch user');
    }

    return res.json();
}

/**
 * Logout - clear stored token and user data
 */
export function logout(): void {
    clearAuth();
}
