'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Popover from '@radix-ui/react-popover';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { getCurrentUser, logout } from '@/lib/auth';
import { useTheme } from '@/contexts/ThemeContext';
import { Icon } from './Icon';

export function UserMenu() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
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

                    <div className="user-menu-theme-section">
                        <div className="user-menu-theme-label">Theme</div>
                        <RadioGroup.Root
                            value={theme}
                            onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
                            className="user-menu-theme-options"
                        >
                            <div className="user-menu-theme-option">
                                <RadioGroup.Item value="light" className="user-menu-theme-radio" id="theme-light">
                                    <RadioGroup.Indicator className="user-menu-theme-radio-indicator" />
                                </RadioGroup.Item>
                                <label htmlFor="theme-light" className="user-menu-theme-option-label">
                                    <Icon icon="sun" size={14} />
                                    Light
                                </label>
                            </div>
                            <div className="user-menu-theme-option">
                                <RadioGroup.Item value="dark" className="user-menu-theme-radio" id="theme-dark">
                                    <RadioGroup.Indicator className="user-menu-theme-radio-indicator" />
                                </RadioGroup.Item>
                                <label htmlFor="theme-dark" className="user-menu-theme-option-label">
                                    <Icon icon="moon" size={14} />
                                    Dark
                                </label>
                            </div>
                            <div className="user-menu-theme-option">
                                <RadioGroup.Item value="system" className="user-menu-theme-radio" id="theme-system">
                                    <RadioGroup.Indicator className="user-menu-theme-radio-indicator" />
                                </RadioGroup.Item>
                                <label htmlFor="theme-system" className="user-menu-theme-option-label">
                                    <Icon icon="monitor" size={14} />
                                    System
                                </label>
                            </div>
                        </RadioGroup.Root>
                    </div>

                    <div className="user-menu-divider" />

                    <div className="user-menu-items">
                        <Popover.Close asChild>
                            <Link href={`/users/${user.id}`} className="user-menu-item">
                                <Icon icon="user" size={16} className="user-menu-item-icon" />
                                <span className="user-menu-item-text">My Profile</span>
                            </Link>
                        </Popover.Close>

                        <Popover.Close asChild>
                            <Link href="/my-content" className="user-menu-item">
                                <Icon icon="fileText" size={16} className="user-menu-item-icon" />
                                <span className="user-menu-item-text">My Content</span>
                            </Link>
                        </Popover.Close>

                        <Popover.Close asChild>
                            <Link href="/preferences" className="user-menu-item">
                                <Icon icon="settings" size={16} className="user-menu-item-icon" />
                                <span className="user-menu-item-text">Preferences</span>
                            </Link>
                        </Popover.Close>

                        <div className="user-menu-divider" />

                        <Popover.Close asChild>
                            <button
                                type="button"
                                className="user-menu-item"
                                onClick={handleLogout}
                            >
                                <Icon icon="logOut" size={16} className="user-menu-item-icon" />
                                <span className="user-menu-item-text">Log out</span>
                            </button>
                        </Popover.Close>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
