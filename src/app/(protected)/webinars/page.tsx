'use client';

import { useState } from 'react';
import { mockWebinars, filterWebinars } from '@/lib/mock-webinars';
import { WebinarCard } from '@/components/ui/WebinarCard';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

type FilterType = 'all' | 'live' | 'upcoming' | 'past';

export default function WebinarsPage() {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter webinars
    const filteredWebinars = filterWebinars(activeFilter).filter(webinar => {
        if (!searchQuery) return true;
        return webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               webinar.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               webinar.hostName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Count by status
    const liveCount = mockWebinars.filter(w => w.status === 'live').length;
    const upcomingCount = mockWebinars.filter(w => w.status === 'scheduled').length;
    const pastCount = mockWebinars.filter(w => w.status === 'ended').length;

    return (
        <main className="webinars-page">
            <div className="webinars-page-container">
                {/* Header */}
                <header className="webinars-header">
                    <div className="webinars-header-content">
                        <div>
                            <h1 className="webinars-title">Webinars</h1>
                            <p className="webinars-subtitle">
                                Join live sessions, watch recordings, and register for upcoming events
                            </p>
                        </div>
                        <Link href="/webinars/new" className="webinars-create-button">
                            <Icon icon="video" size={20} />
                            Create Webinar
                        </Link>
                    </div>
                </header>

                {/* Filters */}
                <div className="webinars-filters">
                    {/* Search */}
                    <div className="webinars-search">
                        <Icon icon="search" size={18} className="webinars-search-icon" />
                        <input
                            type="text"
                            placeholder="Search webinars..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="webinars-search-input"
                        />
                    </div>

                    {/* Status filters */}
                    <div className="webinars-filter-tabs">
                        <button
                            className={`webinars-filter-tab ${activeFilter === 'all' ? 'webinars-filter-tab--active' : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            All Webinars
                            <span className="webinars-filter-count">{mockWebinars.length}</span>
                        </button>
                        <button
                            className={`webinars-filter-tab ${activeFilter === 'live' ? 'webinars-filter-tab--active' : ''}`}
                            onClick={() => setActiveFilter('live')}
                        >
                            <span className="webinars-filter-tab-icon webinars-filter-tab-icon--live"></span>
                            Live
                            <span className="webinars-filter-count">{liveCount}</span>
                        </button>
                        <button
                            className={`webinars-filter-tab ${activeFilter === 'upcoming' ? 'webinars-filter-tab--active' : ''}`}
                            onClick={() => setActiveFilter('upcoming')}
                        >
                            Upcoming
                            <span className="webinars-filter-count">{upcomingCount}</span>
                        </button>
                        <button
                            className={`webinars-filter-tab ${activeFilter === 'past' ? 'webinars-filter-tab--active' : ''}`}
                            onClick={() => setActiveFilter('past')}
                        >
                            Past
                            <span className="webinars-filter-count">{pastCount}</span>
                        </button>
                    </div>
                </div>

                {/* Webinars Grid */}
                {filteredWebinars.length === 0 ? (
                    <div className="webinars-empty">
                        <Icon icon="video" size={48} className="webinars-empty-icon" />
                        <h2 className="webinars-empty-title">
                            {searchQuery ? 'No webinars found' : 'No webinars yet'}
                        </h2>
                        <p className="webinars-empty-description">
                            {searchQuery
                                ? 'Try adjusting your search terms'
                                : 'Create your first webinar to get started'}
                        </p>
                        {!searchQuery && (
                            <Link href="/webinars/new" className="webinars-empty-action">
                                <Icon icon="video" size={20} />
                                Create Webinar
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="webinars-grid">
                        {filteredWebinars.map(webinar => (
                            <WebinarCard key={webinar.id} webinar={webinar} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
