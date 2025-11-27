'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getResources } from '@/lib/resources';
import { getCurrentUserId, fetchCurrentUser } from '@/lib/auth';
import { ResourceCard } from '@/components/ui/ResourceCard';
import { Icon } from '@/components/ui/Icon';

export default function ResourcesPage() {
    const router = useRouter();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [resourceTypeFilter, setResourceTypeFilter] = useState<'all' | 'guide' | 'template' | 'documentation' | 'best-practice' | 'tool'>('all');
    const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'helpful'>('newest');

    useEffect(() => {
        setIsClient(true);
        setCurrentUserId(getCurrentUserId());
    }, []);

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['current-user'],
        queryFn: fetchCurrentUser,
        enabled: isClient && !!currentUserId,
    });

    const { data: resourcesData, isLoading: resourcesLoading } = useQuery({
        queryKey: ['all-resources'],
        queryFn: () => getResources({ limit: 100, offset: 0 }),
        enabled: isClient && !!currentUserId,
    });

    const resources = resourcesData || [];

    // Filter resources
    const filteredResources = resources.filter(resource => {
        const typeMatch = resourceTypeFilter === 'all' || resource.resourceType === resourceTypeFilter;
        const difficultyMatch = difficultyFilter === 'all' || resource.difficulty === difficultyFilter;
        return typeMatch && difficultyMatch;
    });

    // Sort resources
    const sortedResources = [...filteredResources].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === 'popular') {
            return (b.viewCount || 0) - (a.viewCount || 0);
        } else if (sortBy === 'helpful') {
            return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        }
        return 0;
    });

    if (!isClient || !currentUserId) {
        return null;
    }

    const isLoading = userLoading || resourcesLoading;

    return (
        <div className="resources-page">
            <div className="resources-page-container">
                <header className="resources-page-header">
                    <div className="resources-page-header-content">
                        <h1 className="resources-page-title">Knowledge Base</h1>
                        <p className="resources-page-subtitle">
                            Guides, templates, documentation, and tools to help you succeed
                        </p>
                    </div>
                    <Link href="/resources/new" className="resources-create-button">
                        <Icon icon="plus" size={16} />
                        Add Resource
                    </Link>
                </header>

                {/* Filters and Sort */}
                <div className="resources-controls">
                    <div className="resources-filter-group">
                        <label className="resources-filter-label">Type</label>
                        <div className="resources-filter-buttons">
                            <button
                                onClick={() => setResourceTypeFilter('all')}
                                className={`resources-filter-btn ${resourceTypeFilter === 'all' ? 'resources-filter-btn--active' : ''}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setResourceTypeFilter('guide')}
                                className={`resources-filter-btn ${resourceTypeFilter === 'guide' ? 'resources-filter-btn--active' : ''}`}
                            >
                                <Icon icon="book" size={14} />
                                Guides
                            </button>
                            <button
                                onClick={() => setResourceTypeFilter('template')}
                                className={`resources-filter-btn ${resourceTypeFilter === 'template' ? 'resources-filter-btn--active' : ''}`}
                            >
                                <Icon icon="document" size={14} />
                                Templates
                            </button>
                            <button
                                onClick={() => setResourceTypeFilter('documentation')}
                                className={`resources-filter-btn ${resourceTypeFilter === 'documentation' ? 'resources-filter-btn--active' : ''}`}
                            >
                                <Icon icon="file" size={14} />
                                Docs
                            </button>
                            <button
                                onClick={() => setResourceTypeFilter('best-practice')}
                                className={`resources-filter-btn ${resourceTypeFilter === 'best-practice' ? 'resources-filter-btn--active' : ''}`}
                            >
                                <Icon icon="star" size={14} />
                                Best Practices
                            </button>
                            <button
                                onClick={() => setResourceTypeFilter('tool')}
                                className={`resources-filter-btn ${resourceTypeFilter === 'tool' ? 'resources-filter-btn--active' : ''}`}
                            >
                                <Icon icon="settings" size={14} />
                                Tools
                            </button>
                        </div>
                    </div>

                    <div className="resources-filter-group">
                        <label className="resources-filter-label">Difficulty</label>
                        <div className="resources-filter-buttons">
                            <button
                                onClick={() => setDifficultyFilter('all')}
                                className={`resources-filter-btn ${difficultyFilter === 'all' ? 'resources-filter-btn--active' : ''}`}
                            >
                                All Levels
                            </button>
                            <button
                                onClick={() => setDifficultyFilter('beginner')}
                                className={`resources-filter-btn ${difficultyFilter === 'beginner' ? 'resources-filter-btn--active' : ''}`}
                            >
                                Beginner
                            </button>
                            <button
                                onClick={() => setDifficultyFilter('intermediate')}
                                className={`resources-filter-btn ${difficultyFilter === 'intermediate' ? 'resources-filter-btn--active' : ''}`}
                            >
                                Intermediate
                            </button>
                            <button
                                onClick={() => setDifficultyFilter('advanced')}
                                className={`resources-filter-btn ${difficultyFilter === 'advanced' ? 'resources-filter-btn--active' : ''}`}
                            >
                                Advanced
                            </button>
                        </div>
                    </div>

                    <div className="resources-sort-group">
                        <label className="resources-sort-label">Sort by</label>
                        <div className="resources-sort-buttons">
                            <button
                                onClick={() => setSortBy('newest')}
                                className={`resources-sort-btn ${sortBy === 'newest' ? 'resources-sort-btn--active' : ''}`}
                            >
                                <Icon icon="clock" size={14} />
                                Newest
                            </button>
                            <button
                                onClick={() => setSortBy('popular')}
                                className={`resources-sort-btn ${sortBy === 'popular' ? 'resources-sort-btn--active' : ''}`}
                            >
                                <Icon icon="eye" size={14} />
                                Most Viewed
                            </button>
                            <button
                                onClick={() => setSortBy('helpful')}
                                className={`resources-sort-btn ${sortBy === 'helpful' ? 'resources-sort-btn--active' : ''}`}
                            >
                                <Icon icon="thumbsUp" size={14} />
                                Most Helpful
                            </button>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="resources-loading">
                        <p>Loading resources...</p>
                    </div>
                ) : sortedResources.length === 0 ? (
                    <div className="resources-empty">
                        <Icon icon="book" size={48} />
                        <p className="resources-empty-title">No resources found</p>
                        <p className="resources-empty-description">
                            {resourceTypeFilter !== 'all' || difficultyFilter !== 'all'
                                ? 'Try adjusting your filters to see more resources'
                                : 'Resources and documentation will appear here'}
                        </p>
                    </div>
                ) : (
                    <div className="resources-grid">
                        {sortedResources.map(resource => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
