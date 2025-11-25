'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as Popover from '@radix-ui/react-popover';
import { getCurrentUser, logout } from '@/lib/auth';

export function UserMenu() {
    const router = useRouter();
    const [user, setUser] = useState<{ id: string; email: string; fullName: string } | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setUser(getCurrentUser());
    }, []);

    const handleLogout = () => {
        logout();
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:logout'));
        }
        router.push('/login');
    };

    if (!isClient || !user) {
        return null;
    }

    const getInitials = () => {
        if (user.fullName) {
            const nameParts = user.fullName.trim().split(' ');
            if (nameParts.length >= 2) {
                return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
            }
            return user.fullName[0].toUpperCase();
        }
        return user.email[0].toUpperCase();
    };

    const initials = getInitials();

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    className="user-menu-button"
                    aria-label="User menu"
                >
                    <div className="user-menu-avatar">
                        {initials}
                    </div>
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    className="user-menu-dropdown"
                    align="end"
                    sideOffset={8}
                >
                    <div className="user-menu-header">
                        <div className="user-menu-avatar-large">
                            {initials}
                        </div>
                        <div className="user-menu-info">
                            <div className="user-menu-name">
                                {user.fullName || user.email}
                            </div>
                            <div className="user-menu-email">
                                {user.email}
                            </div>
                        </div>
                    </div>

                    <div className="user-menu-divider" />

                    <div className="user-menu-items">
                        <Popover.Close asChild>
                            <button
                                type="button"
                                className="user-menu-item"
                                onClick={handleLogout}
                            >
                                <span className="user-menu-item-icon">🚪</span>
                                <span className="user-menu-item-text">Log out</span>
                            </button>
                        </Popover.Close>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
