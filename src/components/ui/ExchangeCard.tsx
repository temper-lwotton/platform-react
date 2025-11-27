'use client';

import Link from 'next/link';
import { Exchange } from '@/lib/exchanges';
import { Icon } from './Icon';

interface ExchangeCardProps {
    exchange: Exchange;
}

export function ExchangeCard({ exchange }: ExchangeCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'equipment': return 'settings';
            case 'space': return 'home';
            case 'expertise': return 'lightbulb';
            case 'collaboration': return 'users';
            case 'materials': return 'package';
            case 'other': return 'info';
            default: return 'info';
        }
    };

    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case 'available': return 'availability-available';
            case 'in-use': return 'availability-in-use';
            case 'fulfilled': return 'availability-fulfilled';
            case 'expired': return 'availability-expired';
            default: return 'availability-available';
        }
    };

    const getAvailabilityLabel = (availability: string) => {
        switch (availability) {
            case 'available': return 'Available';
            case 'in-use': return 'In Use';
            case 'fulfilled': return 'Fulfilled';
            case 'expired': return 'Expired';
            default: return availability;
        }
    };

    const getTermsIcon = (terms: string) => {
        switch (terms) {
            case 'free': return 'gift';
            case 'trade': return 'repeat';
            case 'paid': return 'dollarSign';
            default: return 'info';
        }
    };

    const getTermsLabel = (terms: string) => {
        if (terms === 'paid' && exchange.price) {
            return `$${exchange.price}`;
        }
        return terms.charAt(0).toUpperCase() + terms.slice(1);
    };

    const getLocationLabel = () => {
        if (!exchange.location) return null;

        if (exchange.location.type === 'remote') {
            return 'Remote';
        } else if (exchange.location.type === 'hybrid') {
            return 'Hybrid';
        } else {
            return exchange.location.address || 'In-person';
        }
    };

    // Strip HTML and get first 150 chars
    const getExcerpt = () => {
        if (exchange.excerpt) return exchange.excerpt;
        const text = exchange.htmlContent.replace(/<[^>]*>/g, '');
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
    };

    const locationLabel = getLocationLabel();

    return (
        <Link href={`/exchanges/${exchange.id}`} className="exchange-card-link">
            <article className="exchange-card">
                {exchange.images && exchange.images.length > 0 && (
                    <div className="exchange-card-image-wrapper">
                        <img
                            src={exchange.images[0].url}
                            alt={exchange.images[0].caption || exchange.title}
                            className="exchange-card-image"
                        />
                        {exchange.images.length > 1 && (
                            <span className="exchange-card-image-count">
                                <Icon icon="image" size={14} />
                                {exchange.images.length}
                            </span>
                        )}
                    </div>
                )}

                <div className="exchange-card-content">
                    <div className="exchange-card-badges">
                        <span className={`exchange-type-badge exchange-type-badge--${exchange.type}`}>
                            <Icon icon={exchange.type === 'offering' ? 'arrowUp' : 'arrowDown'} size={14} />
                            <span>{exchange.type === 'offering' ? 'Offering' : 'Request'}</span>
                        </span>
                        <span className="exchange-category-badge">
                            <Icon icon={getCategoryIcon(exchange.category)} size={14} />
                            <span>{exchange.category}</span>
                        </span>
                        <span className={`exchange-availability-badge ${getAvailabilityColor(exchange.availability)}`}>
                            {getAvailabilityLabel(exchange.availability)}
                        </span>
                    </div>

                    <div className="exchange-card-header">
                        <h3 className="exchange-card-title">{exchange.title}</h3>
                    </div>

                    <p className="exchange-card-excerpt">{getExcerpt()}</p>

                    <div className="exchange-card-details">
                        <span className="exchange-card-detail">
                            <Icon icon={getTermsIcon(exchange.terms)} size={16} />
                            {getTermsLabel(exchange.terms)}
                        </span>
                        {locationLabel && (
                            <span className="exchange-card-detail">
                                <Icon icon="mapPin" size={16} />
                                {locationLabel}
                            </span>
                        )}
                        {exchange.schedule && (
                            <span className="exchange-card-detail">
                                <Icon icon="calendar" size={16} />
                                {exchange.schedule}
                            </span>
                        )}
                    </div>

                    {exchange.conditions && (
                        <div className="exchange-card-conditions">
                            <Icon icon="info" size={14} />
                            <span>{exchange.conditions}</span>
                        </div>
                    )}

                    <div className="exchange-card-meta">
                        {exchange.author.profile?.photo ? (
                            <img
                                src={exchange.author.profile.photo}
                                alt={exchange.author.fullName}
                                className="exchange-card-avatar"
                            />
                        ) : (
                            <div className="exchange-card-avatar exchange-card-avatar--placeholder">
                                {exchange.author.fullName.charAt(0)}
                            </div>
                        )}
                        <div className="exchange-card-author-info">
                            <span className="exchange-card-author">{exchange.author.fullName}</span>
                            <div className="exchange-card-meta-details">
                                <span className="exchange-card-space">{exchange.space.title}</span>
                                <span className="exchange-card-separator">•</span>
                                <span className="exchange-card-date">{formatDate(exchange.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="exchange-card-footer">
                        <span className="exchange-card-stat">
                            <Icon icon="users" size={16} />
                            {exchange.interestedCount} interested
                        </span>
                        <span className="exchange-card-stat">
                            <Icon icon={exchange.isLiked ? 'heartFilled' : 'heart'} size={16} />
                            {exchange.likesCount}
                        </span>
                        <span className="exchange-card-stat">
                            <Icon icon="comment" size={16} />
                            {exchange.commentsCount}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
