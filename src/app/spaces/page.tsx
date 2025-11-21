'use client';

import { useQuery } from '@tanstack/react-query';
import { getSpaces, Space } from '@/lib/spaces';
import { SpaceCard } from '@/components/ui/SpaceCard';

export default function SpacesPage() {
    const { data, isLoading, error } = useQuery<Space[]>({
        queryKey: ['spaces'],
        queryFn: getSpaces,
    });

    if (isLoading) {
        return (
            <main className="spaces-page">
                <p className="spaces-loading">Loading spaces...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="spaces-page">
                <p className="spaces-error">Error loading spaces. Please try again.</p>
            </main>
        );
    }

    return (
        <main className="spaces-page">
            <header className="spaces-header">
                <h1 className="spaces-title">Spaces</h1>
                <p className="spaces-subtitle">Browse and manage your spaces</p>
            </header>

            {data && data.length > 0 ? (
                <div className="spaces-grid">
                    {data.map((space) => (
                        <SpaceCard key={space.id} space={space} />
                    ))}
                </div>
            ) : (
                <div className="spaces-empty">
                    <p>No spaces found. Create your first space to get started.</p>
                </div>
            )}
        </main>
    );
}
