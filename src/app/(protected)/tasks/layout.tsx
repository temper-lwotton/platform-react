'use client';

import { HomeSidebar } from '@/components/ui/HomeSidebar';

export default function TasksLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="home-layout">
            <HomeSidebar />
            <div className="home-layout-content">
                {children}
            </div>
        </div>
    );
}
