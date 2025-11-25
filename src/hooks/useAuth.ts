import { useState, useEffect } from 'react';
import { getCurrentUserId } from '@/lib/auth';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Mark as client-side to prevent hydration issues
        setIsClient(true);

        // Check initial auth state
        const currentUserId = getCurrentUserId();
        setUserId(currentUserId);
        setIsAuthenticated(!!currentUserId);

        // Listen for auth events
        const handleLogin = () => {
            const currentUserId = getCurrentUserId();
            setUserId(currentUserId);
            setIsAuthenticated(!!currentUserId);
        };

        const handleLogout = () => {
            setUserId(null);
            setIsAuthenticated(false);
        };

        window.addEventListener('auth:login', handleLogin);
        window.addEventListener('auth:logout', handleLogout);

        return () => {
            window.removeEventListener('auth:login', handleLogin);
            window.removeEventListener('auth:logout', handleLogout);
        };
    }, []);

    return {
        isAuthenticated,
        userId,
        isClient,
    };
}
