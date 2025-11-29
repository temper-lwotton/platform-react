'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSpaces, getSpaceTags, Space, SpacesQueryParams } from '@/lib/spaces';
import { SpaceCard } from '@/components/ui/SpaceCard';
import { SpacesFilter } from '@/components/ui/SpacesFilter';

export default function SpacesPage() {
    const [filterParams, setFilterParams] = useState<SpacesQueryParams>({});

    // Fetch spaces with filter parameters
    const { data: spaces, isLoading, error } = useQuery<Space[]>({
        queryKey: ['spaces', filterParams],
        queryFn: () => getSpaces(filterParams),
    });

    // Fetch available tags
    const { data: tags = [] } = useQuery({
        queryKey: ['space-tags'],
        queryFn: getSpaceTags,
    });

    const handleFilterChange = (params: SpacesQueryParams) => {
        setFilterParams(params);
    };

    if (error) {
        return (
            <main className="spaces-page">
                <p className="spaces-error">Error loading spaces. Please try again.</p>
            </main>
        );
    }

    const hasFilters = filterParams.search || (filterParams.tags && filterParams.tags.length > 0);
    const showEmpty = !isLoading && (!spaces || spaces.length === 0);

    return (
        <main className="spaces-page">
            <header className="spaces-header">
                <div className="spaces-header-content">
                    <div>
                        <h1 className="spaces-title">Spaces</h1>
                        <p className="spaces-subtitle">Browse and manage your spaces</p>
                    </div>
                    {spaces && spaces.length > 0 && (
                        <div className="spaces-count">
                            {spaces.length} {spaces.length === 1 ? 'space' : 'spaces'}
                        </div>
                    )}
                </div>
            </header>

            {/* Filter Bar */}
            <SpacesFilter
                tags={tags}
                onFilterChange={handleFilterChange}
                isLoading={isLoading}
            />

            {/* Loading State */}
            {isLoading && (
                <div className="spaces-loading-container">
                    <p className="spaces-loading">Loading spaces...</p>
                </div>
            )}

            {/* Spaces Grid */}
            {!isLoading && spaces && spaces.length > 0 && (
                <div className="spaces-grid">
                    {spaces.map((space, index) => (
                        <SpaceCard
                            key={space.id}
                            space={space}
                            featured={index === 0} // Feature the first space with gradient accent
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {showEmpty && (
                <div className="spaces-empty">
                    {hasFilters ? (
                        <>
                            <p className="spaces-empty-title">No spaces found</p>
                            <p className="spaces-empty-description">
                                Try adjusting your search or filter criteria
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="spaces-empty-title">No spaces yet</p>
                            <p className="spaces-empty-description">
                                Create your first space to get started
                            </p>
                        </>
                    )}
                </div>
            )}
        </main>
    );
}
