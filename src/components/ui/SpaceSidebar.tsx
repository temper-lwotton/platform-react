'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SpaceSidebarProps {
    spaceId: string;
    spaceTitle: string;
}

const navItems = [
    { href: '', label: 'Overview', icon: 'home' },
    { href: '/discussions', label: 'Discussions', icon: 'chat' },
    { href: '/events', label: 'Events', icon: 'calendar' },
];

export function SpaceSidebar({ spaceId, spaceTitle }: SpaceSidebarProps) {
    const pathname = usePathname();
    const basePath = `/spaces/${spaceId}`;

    return (
        <aside className="space-sidebar">
            <div className="space-sidebar-header">
                <Link href={basePath} className="space-sidebar-title">
                    {spaceTitle}
                </Link>
            </div>
            <nav className="space-sidebar-nav">
                <ul className="space-sidebar-list">
                    {navItems.map((item) => {
                        const fullPath = `${basePath}${item.href}`;
                        const isActive = item.href === ''
                            ? pathname === basePath
                            : pathname.startsWith(fullPath);

                        return (
                            <li key={item.href}>
                                <Link
                                    href={fullPath}
                                    className={`space-sidebar-link ${isActive ? 'space-sidebar-link--active' : ''}`}
                                >
                                    <span className="space-sidebar-icon" data-icon={item.icon} />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
