'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, logout } from '@/lib/auth';
import { useTheme } from '@/contexts/ThemeContext';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Icon } from '../Icon';
import { Popover, Avatar } from '../primitives';
import styles from './UserMenu.module.scss';

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
        <Popover
            trigger={
                <button
                    type="button"
                    className={styles.button}
                    aria-label="User menu"
                >
                    <Avatar
                        fallback={initials}
                        size="sm"
                    />
                </button>
            }
            align="end"
            sideOffset={8}
            className={styles.menu}
        >
            <div className={styles.header}>
                <Avatar
                    fallback={initials}
                    size="md"
                />
                <div className={styles.info}>
                    <div className={styles.name}>
                        {user.fullName || user.email}
                    </div>
                    <div className={styles.email}>
                        {user.email}
                    </div>
                </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.themeSection}>
                <div className={styles.themeLabel}>Theme</div>
                <RadioGroupPrimitive.Root
                    value={theme}
                    onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
                    className={styles.themeOptions}
                >
                    <div className={styles.themeOption}>
                        <RadioGroupPrimitive.Item value="light" className={styles.themeRadio} id="theme-light">
                            <RadioGroupPrimitive.Indicator className={styles.themeRadioIndicator} />
                        </RadioGroupPrimitive.Item>
                        <label htmlFor="theme-light" className={styles.themeOptionLabel}>
                            <Icon icon="sun" size={14} />
                            Light
                        </label>
                    </div>
                    <div className={styles.themeOption}>
                        <RadioGroupPrimitive.Item value="dark" className={styles.themeRadio} id="theme-dark">
                            <RadioGroupPrimitive.Indicator className={styles.themeRadioIndicator} />
                        </RadioGroupPrimitive.Item>
                        <label htmlFor="theme-dark" className={styles.themeOptionLabel}>
                            <Icon icon="moon" size={14} />
                            Dark
                        </label>
                    </div>
                    <div className={styles.themeOption}>
                        <RadioGroupPrimitive.Item value="system" className={styles.themeRadio} id="theme-system">
                            <RadioGroupPrimitive.Indicator className={styles.themeRadioIndicator} />
                        </RadioGroupPrimitive.Item>
                        <label htmlFor="theme-system" className={styles.themeOptionLabel}>
                            <Icon icon="monitor" size={14} />
                            System
                        </label>
                    </div>
                </RadioGroupPrimitive.Root>
            </div>

            <div className={styles.divider} />

            <div className={styles.items}>
                <Link href={`/users/${user.id}`} className={styles.item}>
                    <Icon icon="user" size={16} />
                    <span>My Profile</span>
                </Link>

                <Link href="/my-content" className={styles.item}>
                    <Icon icon="fileText" size={16} />
                    <span>My Content</span>
                </Link>

                <Link href="/preferences" className={styles.item}>
                    <Icon icon="settings" size={16} />
                    <span>Preferences</span>
                </Link>

                {/* Admin Area Link */}
                <Link
                    href="/admin"
                    className={styles.item}>

                    <Icon icon="shield" size={16} />
                    <span>Admin Area</span>
                </Link>

                <div className={styles.divider} />

                <button
                    type="button"
                    className={`${styles.item} ${styles.logout}`}
                    onClick={handleLogout}
                >
                    <Icon icon="logOut" size={16} />
                    <span>Log out</span>
                </button>
            </div>
        </Popover>
    );
}
