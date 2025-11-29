'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentUserId } from '@/lib/auth';
import { LoginForm } from '../LoginForm';
import styles from './AuthRequired.module.scss';

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
            <div className={styles.loading}>
                <p>Loading...</p>
            </div>
        );
    }

    // Not authenticated - show login form
    if (!isAuthenticated) {
        return (
            <div className={styles.authRequired}>
                <div className={styles.container}>
                    <div className={styles.message}>
                        <h2 className={styles.title}>Authentication Required</h2>
                        <p className={styles.text}>{message}</p>
                    </div>
                    <LoginForm onSuccess={handleLoginSuccess} />
                </div>
            </div>
        );
    }

    // Authenticated - render children
    return <>{children}</>;
}
