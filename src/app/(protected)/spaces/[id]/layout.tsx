'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getSpace } from '@/lib/spaces';
import { SpaceSidebar } from '@/components/ui/SpaceSidebar';
import Link from 'next/link';

export default function SpaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const id = params.id as string;

    const { data: space, isLoading, error } = useQuery({
        queryKey: ['space', id],
        queryFn: () => getSpace(id),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="space-layout">
                <aside className="space-sidebar">
                    <div className="space-sidebar-header">
                        <span className="space-sidebar-title">Loading...</span>
                    </div>
                </aside>
                <main className="space-content">
                    <p className="space-loading">Loading space...</p>
                </main>
            </div>
        );
    }

    if (error || !space) {
        return (
            <div className="space-layout">
                <main className="space-content">
                    <p className="space-error">Error loading space.</p>
                    <Link href="/spaces" className="space-back-link">Back to spaces</Link>
                </main>
            </div>
        );
    }

    return (
        <div className="space-layout">
            <SpaceSidebar spaceId={space.id} spaceTitle={space.title} />
            <main className="space-content">
                {children}
            </main>
        </div>
    );
}
