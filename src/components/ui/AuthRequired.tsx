'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentUserId } from '@/lib/auth';
import { LoginForm } from './LoginForm';

interface AuthRequiredProps {
    children: React.ReactNode;
    message?: string;
}

export function AuthRequired({
    children,
    message = 'Please log in to access this page'
}: AuthRequiredProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const checkAuth = useCallback(() => {
        const userId = getCurrentUserId();
        setIsAuthenticated(!!userId);
    }, []);

    useEffect(() => {
        checkAuth();

        // Listen for logout events (e.g., from 401 responses)
        const handleLogout = () => {
            setIsAuthenticated(false);
        };

        window.addEventListener('auth:logout', handleLogout);
        return () => {
            window.removeEventListener('auth:logout', handleLogout);
        };
    }, [checkAuth]);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    // Still checking auth status
    if (isAuthenticated === null) {
        return (
            <div className="auth-required-loading">
                <p>Loading...</p>
            </div>
        );
    }

    // Not authenticated - show login form
    if (!isAuthenticated) {
        return (
            <div className="auth-required">
                <div className="auth-required-container">
                    <div className="auth-required-message">
                        <h2 className="auth-required-title">Authentication Required</h2>
                        <p className="auth-required-text">{message}</p>
                    </div>
                    <LoginForm onSuccess={handleLoginSuccess} />
                </div>
            </div>
        );
    }

    // Authenticated - render children
    return <>{children}</>;
}
