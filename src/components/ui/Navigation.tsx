'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GlobalPostButton } from './GlobalPostButton';
import { NotificationDropdown } from './NotificationDropdown';
import { MessagesDropdown } from './MessagesDropdown';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
    href: string;
    label: string;
    requiresAuth?: boolean; // Optional: only show when logged in
    hideWhenAuth?: boolean; // Optional: only show when logged out
}

const navItems: NavItem[] = [
    { href: '/', label: 'Home',  requiresAuth: true },
    { href: '/spaces', label: 'Spaces',  requiresAuth: true },
    { href: '/users', label: 'People', requiresAuth: true },
    { href: '/login', label: 'Login', hideWhenAuth: true },
    // Example of auth-only link:
    // { href: '/my-profile', label: 'My Profile', requiresAuth: true },
];

export function Navigation() {
    const pathname = usePathname();
    const { isAuthenticated, isClient } = useAuth();

    // Filter nav items based on auth state
    const visibleNavItems = navItems.filter(item => {
        if (item.requiresAuth && !isAuthenticated) return false;
        if (item.hideWhenAuth && isAuthenticated) return false;
        return true;
    });

    return (
        <nav className="main-nav">
            <div className="main-nav-container">
                <Link href="/" className="main-nav-logo">
                    Spaces
                </Link>
                <ul className="main-nav-links">
                    {visibleNavItems.map((item) => {
                        const isActive = item.href === '/'
                            ? pathname === '/'
                            : pathname.startsWith(item.href);

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`main-nav-link ${isActive ? 'main-nav-link--active' : ''}`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}

                    {/* Auth-only components - only render on client after hydration */}
                    {isClient && isAuthenticated && (
                        <>
                            <li>
                                <MessagesDropdown />
                            </li>
                            <li>
                                <NotificationDropdown />
                            </li>
                            <li>
                                <GlobalPostButton />
                            </li>
                            <li>
                                <UserMenu />
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
