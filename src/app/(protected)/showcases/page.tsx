'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getShowcases } from '@/lib/showcases';
import { getCurrentUserId, fetchCurrentUser } from '@/lib/auth';
import { ShowcaseCard } from '@/components/ui/ShowcaseCard';
import { Icon } from '@/components/ui/Icon';

export default function ShowcasesPage() {
    const router = useRouter();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

    useEffect(() => {
        setIsClient(true);
        setCurrentUserId(getCurrentUserId());
    }, []);

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['current-user'],
        queryFn: fetchCurrentUser,
        enabled: isClient && !!currentUserId,
    });

    const { data: showcasesData, isLoading: showcasesLoading } = useQuery({
        queryKey: ['all-showcases', sortBy],
        queryFn: () => getShowcases({ limit: 100, offset: 0 }),
        enabled: isClient && !!currentUserId,
    });

    const showcases = showcasesData || [];

    // Sort showcases based on selected sort option
    const sortedShowcases = [...showcases].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === 'oldest') {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === 'popular') {
            return (b.likesCount || 0) - (a.likesCount || 0);
        }
        return 0;
    });

    if (!isClient || !currentUserId) {
        return null;
    }

    const isLoading = userLoading || showcasesLoading;

    return (
        <div className="showcases-page">
            <div className="showcases-page-container">
                <header className="showcases-page-header">
                    <div className="showcases-page-header-content">
                        <h1 className="showcases-page-title">Project Showcases</h1>
                        <p className="showcases-page-subtitle">
                            Discover successful projects and innovative solutions from our community
                        </p>
                    </div>
                    <Link href="/showcases/new" className="showcases-create-button">
                        <Icon icon="plus" size={16} />
                        Create Showcase
                    </Link>
                </header>

                {/* Sort Options */}
                <div className="showcases-controls">
                    <div className="showcases-sort-group">
                        <label className="showcases-sort-label">Sort by</label>
                        <div className="showcases-sort-buttons">
                            <button
                                onClick={() => setSortBy('newest')}
                                className={`showcases-sort-btn ${sortBy === 'newest' ? 'showcases-sort-btn--active' : ''}`}
                            >
                                <Icon icon="clock" size={14} />
                                Newest
                            </button>
                            <button
                                onClick={() => setSortBy('popular')}
                                className={`showcases-sort-btn ${sortBy === 'popular' ? 'showcases-sort-btn--active' : ''}`}
                            >
                                <Icon icon="heart" size={14} />
                                Most Popular
                            </button>
                            <button
                                onClick={() => setSortBy('oldest')}
                                className={`showcases-sort-btn ${sortBy === 'oldest' ? 'showcases-sort-btn--active' : ''}`}
                            >
                                <Icon icon="history" size={14} />
                                Oldest
                            </button>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="showcases-loading">
                        <p>Loading showcases...</p>
                    </div>
                ) : sortedShowcases.length === 0 ? (
                    <div className="showcases-empty">
                        <Icon icon="star" size={48} />
                        <p className="showcases-empty-title">No showcases yet</p>
                        <p className="showcases-empty-description">
                            Be the first to share a project success story with the community
                        </p>
                        <Link href="/showcases/new" className="showcases-empty-cta">
                            <Icon icon="plus" size={16} />
                            Create First Showcase
                        </Link>
                    </div>
                ) : (
                    <div className="showcases-grid">
                        {sortedShowcases.map(showcase => (
                            <ShowcaseCard key={showcase.id} showcase={showcase} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
