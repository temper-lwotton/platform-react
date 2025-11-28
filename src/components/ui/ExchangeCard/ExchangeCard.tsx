'use client';

import Link from 'next/link';
import { Exchange } from '@/lib/exchanges';
import { Icon } from '../Icon';
import { Avatar, Badge } from '../primitives';
import styles from './ExchangeCard.module.scss';

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
        <Link href={`/exchanges/${exchange.id}`} className={styles.link}>
            <article className={styles.card}>
                {exchange.images && exchange.images.length > 0 && (
                    <div className={styles.imageWrapper}>
                        <img
                            src={exchange.images[0].url}
                            alt={exchange.images[0].caption || exchange.title}
                            className={styles.image}
                        />
                        {exchange.images.length > 1 && (
                            <Badge variant="default" size="sm" className={styles.imageCount}>
                                <Icon icon="eye" size={14} />
                                {exchange.images.length}
                            </Badge>
                        )}
                    </div>
                )}

                <div className={styles.content}>
                    <div className={styles.badges}>
                        <Badge
                            variant={exchange.type === 'offering' ? 'success' : 'primary'}
                            size="sm"
                        >
                            <Icon icon={exchange.type === 'offering' ? 'arrowUp' : 'arrowDown'} size={14} />
                            {exchange.type === 'offering' ? 'Offering' : 'Request'}
                        </Badge>
                        <Badge variant="outline" size="sm">
                            <Icon icon={getCategoryIcon(exchange.category)} size={14} />
                            {exchange.category}
                        </Badge>
                        <Badge
                            variant={
                                exchange.availability === 'available' ? 'success' :
                                exchange.availability === 'in-use' ? 'warning' :
                                exchange.availability === 'fulfilled' ? 'info' : 'default'
                            }
                            size="sm"
                        >
                            {getAvailabilityLabel(exchange.availability)}
                        </Badge>
                    </div>

                    <div className={styles.header}>
                        <h3 className={styles.title}>{exchange.title}</h3>
                    </div>

                    <p className={styles.excerpt}>{getExcerpt()}</p>

                    <div className={styles.details}>
                        <span className={styles.detail}>
                            <Icon icon={getTermsIcon(exchange.terms)} size={16} />
                            {getTermsLabel(exchange.terms)}
                        </span>
                        {locationLabel && (
                            <span className={styles.detail}>
                                <Icon icon="mapPin" size={16} />
                                {locationLabel}
                            </span>
                        )}
                        {exchange.schedule && (
                            <span className={styles.detail}>
                                <Icon icon="calendar" size={16} />
                                {exchange.schedule}
                            </span>
                        )}
                    </div>

                    {exchange.conditions && (
                        <div className={styles.conditions}>
                            <Icon icon="info" size={14} />
                            <span>{exchange.conditions}</span>
                        </div>
                    )}

                    <div className={styles.meta}>
                        <Avatar
                            src={exchange.author.profile?.photo}
                            alt={exchange.author.fullName}
                            fallback={exchange.author.fullName.charAt(0).toUpperCase()}
                            size="sm"
                        />
                        <div className={styles.authorInfo}>
                            <span className={styles.author}>{exchange.author.fullName}</span>
                            <div className={styles.metaDetails}>
                                <span className={styles.space}>{exchange.space.title}</span>
                                <span className={styles.separator}>•</span>
                                <span className={styles.date}>{formatDate(exchange.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <span className={styles.stat}>
                            <Icon icon="users" size={16} />
                            {exchange.interestedCount} interested
                        </span>
                        <span className={styles.stat}>
                            <Icon icon="heart" size={16} />
                            {exchange.likesCount}
                        </span>
                        <span className={styles.stat}>
                            <Icon icon="comment" size={16} />
                            {exchange.commentsCount}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
