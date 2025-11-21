'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/', label: 'Home' },
    { href: '/spaces', label: 'Spaces' },
    { href: '/users', label: 'People' },
    { href: '/messages', label: 'Messages' },
];

export function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="main-nav">
            <div className="main-nav-container">
                <Link href="/" className="main-nav-logo">
                    Spaces
                </Link>
                <ul className="main-nav-links">
                    {navItems.map((item) => {
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
                </ul>
            </div>
        </nav>
    );
}
