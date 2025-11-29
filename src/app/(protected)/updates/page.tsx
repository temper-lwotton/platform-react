'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getUpdates } from '@/lib/updates';
import { getCurrentUserId, fetchCurrentUser } from '@/lib/auth';
import { UpdateCard } from '@/components/ui/UpdateCard';
import { Icon } from '@/components/ui/Icon';

export default function UpdatesPage() {
    const router = useRouter();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'normal' | 'high' | 'urgent'>('all');
    const [categoryFilter, setCategoryFilter] = useState<'all' | 'news' | 'milestone' | 'policy' | 'announcement' | 'other'>('all');

    useEffect(() => {
        setIsClient(true);
        setCurrentUserId(getCurrentUserId());
    }, []);

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['current-user'],
        queryFn: fetchCurrentUser,
        enabled: isClient && !!currentUserId,
    });

    const { data: updatesData, isLoading: updatesLoading } = useQuery({
        queryKey: ['all-updates'],
        queryFn: getUpdates,
        enabled: isClient && !!currentUserId,
    });

    const updates = updatesData || [];

    // Filter updates based on selected filters
    const filteredUpdates = updates.filter(update => {
        const priorityMatch = priorityFilter === 'all' || update.priority === priorityFilter;
        const categoryMatch = categoryFilter === 'all' || update.category === categoryFilter;
        return priorityMatch && categoryMatch;
    });

    if (!isClient || !currentUserId) {
        return null;
    }

    const isLoading = userLoading || updatesLoading;

    return (
        <div className="updates-page">
            <div className="updates-page-container">
                <header className="updates-page-header">
                    <div className="updates-page-header-content">
                        <h1 className="updates-page-title">Updates & Announcements</h1>
                        <p className="updates-page-subtitle">
                            Stay informed about important news, milestones, and policy changes
                        </p>
                    </div>
                    <Link href="/updates/new" className="updates-create-button">
                        <Icon icon="plus" size={16} />
                        Create Update
                    </Link>
                </header>

                {/* Filters */}
                <div className="updates-filters">
                    <div className="updates-filter-group">
                        <label className="updates-filter-label">Priority</label>
                        <div className="updates-filter-buttons">
                            <button
                                onClick={() => setPriorityFilter('all')}
                                className={`updates-filter-btn ${priorityFilter === 'all' ? 'updates-filter-btn--active' : ''}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setPriorityFilter('urgent')}
                                className={`updates-filter-btn ${priorityFilter === 'urgent' ? 'updates-filter-btn--active' : ''}`}
                            >
                                Urgent
                            </button>
                            <button
                                onClick={() => setPriorityFilter('high')}
                                className={`updates-filter-btn ${priorityFilter === 'high' ? 'updates-filter-btn--active' : ''}`}
                            >
                                High
                            </button>
                            <button
                                onClick={() => setPriorityFilter('normal')}
                                className={`updates-filter-btn ${priorityFilter === 'normal' ? 'updates-filter-btn--active' : ''}`}
                            >
                                Normal
                            </button>
                            <button
                                onClick={() => setPriorityFilter('low')}
                                className={`updates-filter-btn ${priorityFilter === 'low' ? 'updates-filter-btn--active' : ''}`}
                            >
                                Low
                            </button>
                        </div>
                    </div>

                    <div className="updates-filter-group">
                        <label className="updates-filter-label">Category</label>
                        <div className="updates-filter-buttons">
                            <button
                                onClick={() => setCategoryFilter('all')}
                                className={`updates-filter-btn ${categoryFilter === 'all' ? 'updates-filter-btn--active' : ''}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setCategoryFilter('announcement')}
                                className={`updates-filter-btn ${categoryFilter === 'announcement' ? 'updates-filter-btn--active' : ''}`}
                            >
                                <Icon icon="bell" size={14} />
                                Announcements
                            </button>
                            <button
                                onClick={() => setCategoryFilter('news')}
                                className={`updates-filter-btn ${categoryFilter === 'news' ? 'updates-filter-btn--active' : ''}`}
                            >
                                <Icon icon="feed" size={14} />
                                News
                            </button>
                            <button
                                onClick={() => setCategoryFilter('milestone')}
                                className={`updates-filter-btn ${categoryFilter === 'milestone' ? 'updates-filter-btn--active' : ''}`}
                            >
                                <Icon icon="star" size={14} />
                                Milestones
                            </button>
                            <button
                                onClick={() => setCategoryFilter('policy')}
                                className={`updates-filter-btn ${categoryFilter === 'policy' ? 'updates-filter-btn--active' : ''}`}
                            >
                                <Icon icon="fileText" size={14} />
                                Policy
                            </button>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="updates-loading">
                        <p>Loading updates...</p>
                    </div>
                ) : filteredUpdates.length === 0 ? (
                    <div className="updates-empty">
                        <Icon icon="bell" size={48} />
                        <p className="updates-empty-title">No updates found</p>
                        <p className="updates-empty-description">
                            {priorityFilter !== 'all' || categoryFilter !== 'all'
                                ? 'Try adjusting your filters to see more updates'
                                : 'Updates and announcements will appear here'}
                        </p>
                    </div>
                ) : (
                    <div className="updates-grid">
                        {filteredUpdates.map(update => (
                            <UpdateCard key={update.id} update={update} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
