'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getExchanges, ExchangeType, ExchangeCategory, ExchangeTerms, ExchangeAvailability } from '@/lib/exchanges';
import { getCurrentUserId, fetchCurrentUser } from '@/lib/auth';
import { ExchangeCard } from '@/components/ui/ExchangeCard';
import { Icon } from '@/components/ui/Icon';

export default function ExchangesPage() {
    const router = useRouter();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [typeFilter, setTypeFilter] = useState<'all' | ExchangeType>('all');
    const [categoryFilter, setCategoryFilter] = useState<'all' | ExchangeCategory>('all');
    const [termsFilter, setTermsFilter] = useState<'all' | ExchangeTerms>('all');
    const [availabilityFilter, setAvailabilityFilter] = useState<'all' | ExchangeAvailability>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'interested'>('newest');

    useEffect(() => {
        setIsClient(true);
        setCurrentUserId(getCurrentUserId());
    }, []);

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['current-user'],
        queryFn: fetchCurrentUser,
        enabled: isClient && !!currentUserId,
    });

    const { data: exchangesData, isLoading: exchangesLoading } = useQuery({
        queryKey: ['all-exchanges'],
        queryFn: () => getExchanges({ limit: 100, offset: 0 }),
        enabled: isClient && !!currentUserId,
    });

    const exchanges = exchangesData || [];

    // Filter exchanges
    const filteredExchanges = exchanges.filter(exchange => {
        const typeMatch = typeFilter === 'all' || exchange.type === typeFilter;
        const categoryMatch = categoryFilter === 'all' || exchange.category === categoryFilter;
        const termsMatch = termsFilter === 'all' || exchange.terms === termsFilter;
        const availabilityMatch = availabilityFilter === 'all' || exchange.availability === availabilityFilter;
        return typeMatch && categoryMatch && termsMatch && availabilityMatch;
    });

    // Sort exchanges
    const sortedExchanges = [...filteredExchanges].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === 'popular') {
            return (b.viewCount || 0) - (a.viewCount || 0);
        } else if (sortBy === 'interested') {
            return (b.interestedCount || 0) - (a.interestedCount || 0);
        }
        return 0;
    });

    if (!isClient || !currentUserId) {
        return null;
    }

    const isLoading = userLoading || exchangesLoading;

    const offeringsCount = exchanges.filter(e => e.type === 'offering' && e.availability === 'available').length;
    const requestsCount = exchanges.filter(e => e.type === 'request' && e.availability === 'available').length;

    return (
        <div className="exchanges-page">
            <div className="exchanges-page-container">
                <header className="exchanges-page-header">
                    <div className="exchanges-page-header-content">
                        <h1 className="exchanges-page-title">Community Exchange</h1>
                        <p className="exchanges-page-subtitle">
                            Share resources, equipment, expertise, and collaborate within the community
                        </p>
                        <div className="exchanges-page-stats">
                            <span className="exchanges-page-stat">
                                <Icon icon="arrowUp" size={16} />
                                {offeringsCount} offerings available
                            </span>
                            <span className="exchanges-page-stat">
                                <Icon icon="arrowDown" size={16} />
                                {requestsCount} requests open
                            </span>
                        </div>
                    </div>
                    <Link href="/exchanges/new" className="exchanges-create-button">
                        <Icon icon="plus" size={16} />
                        Create Exchange
                    </Link>
                </header>

                {/* Filters and Sort */}
                <div className="exchanges-controls">
                    <div className="exchanges-filter-group">
                        <label className="exchanges-filter-label">Type</label>
                        <div className="exchanges-filter-buttons">
                            <button
                                onClick={() => setTypeFilter('all')}
                                className={`exchanges-filter-btn ${typeFilter === 'all' ? 'exchanges-filter-btn--active' : ''}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setTypeFilter('offering')}
                                className={`exchanges-filter-btn ${typeFilter === 'offering' ? 'exchanges-filter-btn--active' : ''}`}
                            >
                                <Icon icon="arrowUp" size={14} />
                                Offerings
                            </button>
                            <button
                                onClick={() => setTypeFilter('request')}
                                className={`exchanges-filter-btn ${typeFilter === 'request' ? 'exchanges-filter-btn--active' : ''}`}
                            >
                                <Icon icon="arrowDown" size={14} />
                                Requests
                            </button>
                        </div>
                    </div>

                    <div className="exchanges-filter-group">
                        <label className="exchanges-filter-label">Category</label>
                        <div className="exchanges-filter-buttons">
                            <button
                                onClick={() => setCategoryFilter('all')}
                                className={`exchanges-filter-btn ${categoryFilter === 'all' ? 'exchanges-filter-btn--active' : ''}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setCategoryFilter('equipment')}
                                className={`exchanges-filter-btn ${categoryFilter === 'equipment' ? 'exchanges-filter-btn--active' : ''}`}
                            >
                                <Icon icon="settings" size={14} />
                                Equipment
                            </button>
                            <button
                                onClick={() => setCategoryFilter('space')}
                                className={`exchanges-filter-btn ${categoryFilter === 'space' ? 'exchanges-filter-btn--active' : ''}`}
                            >
                                <Icon icon="home" size={14} />
                                Space
                            </button>
                            <button
                                onClick={() => setCategoryFilter('expertise')}
                                className={`exchanges-filter-btn ${categoryFilter === 'expertise' ? 'exchanges-filter-btn--active' : ''}`}
                            >
                                <Icon icon="lightbulb" size={14} />
                                Expertise
                            </button>
                            <button
                                onClick={() => setCategoryFilter('collaboration')}
                                className={`exchanges-filter-btn ${categoryFilter === 'collaboration' ? 'exchanges-filter-btn--active' : ''}`}
                            >
                                <Icon icon="users" size={14} />
                                Collaboration
                            </button>
                        </div>
                    </div>

                    <div className="exchanges-filter-group">
                        <label className="exchanges-filter-label">Terms</label>
                        <div className="exchanges-filter-buttons">
                            <button
                                onClick={() => setTermsFilter('all')}
                                className={`exchanges-filter-btn ${termsFilter === 'all' ? 'exchanges-filter-btn--active' : ''}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setTermsFilter('free')}
                                className={`exchanges-filter-btn ${termsFilter === 'free' ? 'exchanges-filter-btn--active' : ''}`}
                            >
                                <Icon icon="gift" size={14} />
                                Free
                            </button>
                            <button
                                onClick={() => setTermsFilter('trade')}
                                className={`exchanges-filter-btn ${termsFilter === 'trade' ? 'exchanges-filter-btn--active' : ''}`}
                            >
                                <Icon icon="repeat" size={14} />
                                Trade
                            </button>
                            <button
                                onClick={() => setTermsFilter('paid')}
                                className={`exchanges-filter-btn ${termsFilter === 'paid' ? 'exchanges-filter-btn--active' : ''}`}
                            >
                                <Icon icon="dollarSign" size={14} />
                                Paid
                            </button>
                        </div>
                    </div>

                    <div className="exchanges-filter-group">
                        <label className="exchanges-filter-label">Availability</label>
                        <div className="exchanges-filter-buttons">
                            <button
                                onClick={() => setAvailabilityFilter('all')}
                                className={`exchanges-filter-btn ${availabilityFilter === 'all' ? 'exchanges-filter-btn--active' : ''}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setAvailabilityFilter('available')}
                                className={`exchanges-filter-btn ${availabilityFilter === 'available' ? 'exchanges-filter-btn--active' : ''}`}
                            >
                                Available
                            </button>
                            <button
                                onClick={() => setAvailabilityFilter('in-use')}
                                className={`exchanges-filter-btn ${availabilityFilter === 'in-use' ? 'exchanges-filter-btn--active' : ''}`}
                            >
                                In Use
                            </button>
                            <button
                                onClick={() => setAvailabilityFilter('fulfilled')}
                                className={`exchanges-filter-btn ${availabilityFilter === 'fulfilled' ? 'exchanges-filter-btn--active' : ''}`}
                            >
                                Fulfilled
                            </button>
                        </div>
                    </div>

                    <div className="exchanges-sort-group">
                        <label className="exchanges-sort-label">Sort by</label>
                        <div className="exchanges-sort-buttons">
                            <button
                                onClick={() => setSortBy('newest')}
                                className={`exchanges-sort-btn ${sortBy === 'newest' ? 'exchanges-sort-btn--active' : ''}`}
                            >
                                <Icon icon="clock" size={14} />
                                Newest
                            </button>
                            <button
                                onClick={() => setSortBy('popular')}
                                className={`exchanges-sort-btn ${sortBy === 'popular' ? 'exchanges-sort-btn--active' : ''}`}
                            >
                                <Icon icon="eye" size={14} />
                                Most Viewed
                            </button>
                            <button
                                onClick={() => setSortBy('interested')}
                                className={`exchanges-sort-btn ${sortBy === 'interested' ? 'exchanges-sort-btn--active' : ''}`}
                            >
                                <Icon icon="users" size={14} />
                                Most Interest
                            </button>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="exchanges-loading">
                        <p>Loading exchanges...</p>
                    </div>
                ) : sortedExchanges.length === 0 ? (
                    <div className="exchanges-empty">
                        <Icon icon="repeat" size={48} />
                        <p className="exchanges-empty-title">No exchanges found</p>
                        <p className="exchanges-empty-description">
                            {typeFilter !== 'all' || categoryFilter !== 'all' || termsFilter !== 'all' || availabilityFilter !== 'all'
                                ? 'Try adjusting your filters to see more exchanges'
                                : 'Share something or request what you need to get started'}
                        </p>
                        <Link href="/exchanges/new" className="exchanges-empty-cta">
                            <Icon icon="plus" size={16} />
                            Create First Exchange
                        </Link>
                    </div>
                ) : (
                    <div className="exchanges-grid">
                        {sortedExchanges.map(exchange => (
                            <ExchangeCard key={exchange.id} exchange={exchange} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
