'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Popover from '@radix-ui/react-popover';
import { GlobalPostButton } from '../GlobalPostButton';
import { NotificationDropdown } from '../NotificationDropdown';
import { MessagesDropdown } from '../MessagesDropdown';
import { BookmarksDropdown } from '../BookmarksDropdown';
import { UserMenu } from '../UserMenu';
import { GoLiveButton } from '../GoLiveButton';
import { useAuth } from '@/hooks/useAuth';
import { Icon, IconName } from '../Icon';
import styles from './Navigation.module.scss';

interface NavItem {
    href?: string;
    label: string;
    requiresAuth?: boolean;
    hideWhenAuth?: boolean;
    children?: { href: string; label: string; icon?: IconName }[];
}

const navItems: NavItem[] = [
    { href: '/feed', label: 'Home', requiresAuth: true },
    { href: '/users', label: 'Connect', requiresAuth: true },
    {
        label: 'Grow',
        requiresAuth: true,
        children: [
            { href: '/testing', label: 'Funding', icon: 'star' },
            { href: '/testing', label: 'Opportunities', icon: 'book' },
            { href: '/testing', label: 'Find an expert', icon: 'repeat' }
        ]
    },
    {
        label: 'Collaborate',
        requiresAuth: true,
        children: [
            { href: '/test', label: 'Navigation item', icon: 'star' },
            { href: '/test', label: 'Navigation item', icon: 'book' },
            { href: '/test', label: 'Navigation item', icon: 'repeat' }
        ]
    },
    {
        label: 'Learn',
        requiresAuth: true,
        children: [
            { href: '/showcases', label: 'Success Stories', icon: 'star' },
            { href: '/resources', label: 'Knowledge Base', icon: 'book' },
            { href: '/events', label: 'Events', icon: 'book' },
        ]
    },
    {
        label: 'Contribute',
        requiresAuth: true,
        children: [
            { href: '/test', label: 'Navigation item', icon: 'star' },
            { href: '/test', label: 'Navigation item', icon: 'book' },
            { href: '/test', label: 'Navigation item', icon: 'book' },
        ]
    },
    {
        label: 'Exchange',
        requiresAuth: true,
        children: [
            { href: '/test', label: 'Navigation item', icon: 'star' },
            { href: '/exchanges', label: 'Community Exchange', icon: 'repeat' }
        ]
    },
    { href: '/login', label: 'Login', hideWhenAuth: true },
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
        <nav className={styles.nav}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo} aria-label="Spaces AI - Home">
                    <svg
                        width="150"
                        height="28"
                        viewBox="0 0 150 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-labelledby="logo-title"
                    >
                        <title id="logo-title">Spaces AI</title>
                        <path d="M134.716 0.000106812H150V12.8797H134.716V0.000106812Z" fill="#C2FF21"/>
                        <path d="M137.482 9.92403L139.602 2.95644H140.741L142.86 9.92403H141.997L141.418 7.9417H138.925L138.346 9.92403H137.482ZM139.151 7.17625H141.192L140.171 3.69245L139.151 7.17625Z" fill="black"/>
                        <path d="M147.174 2.95644V3.78077H145.594V9.09969H147.233V9.92403H143.112V9.09969H144.75V3.78077H143.17V2.95644H147.174Z" fill="black"/>
                        <path d="M78.1787 0.215195C84.1498 0.215195 88.2531 3.73191 89.3887 9.73961L83.6006 9.99644C82.9412 6.73634 80.9264 4.90386 78.0693 4.90367C73.4904 4.90367 71.3653 8.75039 71.3652 13.8421C71.3652 18.8974 73.5269 22.7074 78.0693 22.7074C81.1096 22.7072 83.0877 20.7288 83.6738 17.2123L89.498 17.432C88.4357 23.7327 84.4062 27.3968 78.1787 27.3968C70.486 27.3968 65.6504 21.5715 65.6504 13.8421C65.6505 6.11289 70.4861 0.215232 78.1787 0.215195ZM10.3672 0.215195C16.155 0.215294 20.1116 3.76884 20.7344 9.00719L15.166 9.30016C14.873 6.55283 12.968 4.83055 10.2207 4.83043C7.80316 4.83043 6.08083 6.07619 6.19043 7.98082C6.26369 10.1787 8.82831 10.9118 11.6123 11.6078C17.4368 12.8899 21.1367 15.3814 21.1367 19.5209C21.1365 24.4659 16.7774 27.2494 11.1729 27.2494C4.83559 27.2494 0.366484 23.7333 0 18.2386L5.60449 17.9818C6.08071 20.7658 8.05909 22.598 11.3193 22.598C13.8103 22.598 15.4956 21.6084 15.459 19.7035C15.4223 17.7987 13.8103 16.6994 9.74414 15.7103C4.10284 14.3549 0.476562 12.0836 0.476562 7.90758C0.476787 3.18224 4.43292 0.215195 10.3672 0.215195ZM121.909 0.215195C127.697 0.215195 131.654 3.76877 132.276 9.00719L126.708 9.30016C126.415 6.55273 124.51 4.83043 121.763 4.83043C119.345 4.83051 117.624 6.07624 117.733 7.98082C117.807 10.1788 120.371 10.9118 123.155 11.6078C128.98 12.8899 132.68 15.3815 132.68 19.5209C132.679 24.4658 128.32 27.2492 122.716 27.2494C116.379 27.2494 111.909 23.7333 111.543 18.2386L117.147 17.9818C117.624 20.7659 119.602 22.598 122.862 22.598C125.353 22.5979 127.038 21.6083 127.001 19.7035C126.964 17.7987 125.353 16.6993 121.287 15.7103C115.646 14.3549 112.019 12.0837 112.019 7.90758C112.019 3.18232 115.975 0.215291 121.909 0.215195ZM28.9414 26.8099H23.373V17.8656H28.9414V26.8099ZM66.6318 26.8099H60.8438L58.9385 21.2787H48.9385L47.0332 26.8099H41.2822L50.6602 0.801132H57.2539L66.6318 26.8099ZM109.818 22.1214V26.8099H96.9971V22.1214H109.818ZM109.525 5.49059H96.9971V11.4613H109.086V16.0765H96.9971V22.1214H91.4287V5.46617H96.9912V0.801132H109.525V5.49059ZM33.7764 0.801132C40.0039 0.801132 43.7773 4.0251 43.7773 9.30016C43.7773 14.5751 40.0038 17.8353 33.7764 17.8353H28.9541V13.1468H33.4463C36.3768 13.1468 38.0624 11.8277 38.0625 9.30016C38.0625 6.77252 36.3769 5.49059 33.4463 5.49059H28.9414V13.0619H23.373V0.801132H33.7764ZM50.5137 16.6996H57.4004L53.957 6.66246L50.5137 16.6996Z" fill="black"/>
                    </svg>
                </Link>
                <ul className={styles.links}>
                    {visibleNavItems.map((item, index) => {
                        // Handle dropdown items
                        if (item.children) {
                            const isActive = item.children.some(child => pathname.startsWith(child.href));

                            return (
                                <li key={`${item.label}-${index}`}>
                                    <Popover.Root>
                                        <Popover.Trigger asChild>
                                            <button
                                                className={`${styles.link} ${styles.linkDropdown} ${isActive ? styles.linkActive : ''}`}
                                            >
                                                {item.label}
                                                <Icon icon="chevronDown" size={14} />
                                            </button>
                                        </Popover.Trigger>
                                        <Popover.Portal>
                                            <Popover.Content
                                                className={styles.dropdown}
                                                align="start"
                                                sideOffset={8}
                                            >
                                                <div className={styles.dropdownItems}>
                                                    {item.children.map((child) => {
                                                        const isChildActive = pathname.startsWith(child.href);
                                                        return (
                                                            <Link
                                                                key={child.href}
                                                                href={child.href}
                                                                className={`${styles.dropdownItem} ${isChildActive ? styles.dropdownItemActive : ''}`}
                                                            >
                                                                {child.icon && <Icon icon={child.icon} size={16} />}
                                                                <span>{child.label}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </Popover.Content>
                                        </Popover.Portal>
                                    </Popover.Root>
                                </li>
                            );
                        }

                        // Handle regular nav items
                        const isActive = item.href === '/'
                            ? pathname === '/'
                            : pathname.startsWith(item.href!);

                        return (
                            <li key={`${item.href}-${item.label}`}>
                                <Link
                                    href={item.href!}
                                    className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                    {/* Auth-only components - only render on client after hydration */}

                    {isClient && isAuthenticated && (
                        <ul className={styles.links}>
                            <li>
                                <MessagesDropdown />
                            </li>
                            <li>
                                <BookmarksDropdown />
                            </li>
                            <li>
                                <NotificationDropdown />
                            </li>
                            <li>
                                <GoLiveButton />
                            </li>
                            <li>
                                <GlobalPostButton />
                            </li>
                            <li>
                                <UserMenu />
                            </li>
                        </ul>


                    )}

            </div>
        </nav>
    );
}
