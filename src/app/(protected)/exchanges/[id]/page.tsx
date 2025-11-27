'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExchange, expressInterest, withdrawInterest } from '@/lib/exchanges';
import { getCurrentUserId } from '@/lib/auth';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { LikesDisplay } from '@/components/ui/LikesDisplay';
import { RichContent } from '@/components/ui/RichContent';

export default function ExchangeDetailPage() {
    const params = useParams();
    const exchangeId = params.id as string;
    const currentUserId = getCurrentUserId();
    const queryClient = useQueryClient();
    const [interestMessage, setInterestMessage] = useState('');
    const [requestedDate, setRequestedDate] = useState('');
    const [showInterestForm, setShowInterestForm] = useState(false);

    const { data: exchange, isLoading, error } = useQuery({
        queryKey: ['exchange', exchangeId],
        queryFn: () => getExchange(exchangeId),
        enabled: !!exchangeId,
    });

    const expressInterestMutation = useMutation({
        mutationFn: () => expressInterest(exchangeId, interestMessage, requestedDate || undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exchange', exchangeId] });
            setShowInterestForm(false);
            setInterestMessage('');
            setRequestedDate('');
        },
    });

    const withdrawInterestMutation = useMutation({
        mutationFn: () => withdrawInterest(exchangeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exchange', exchangeId] });
        },
    });

    const handleExpressInterest = () => {
        expressInterestMutation.mutate();
    };

    const handleWithdrawInterest = () => {
        withdrawInterestMutation.mutate();
    };

    if (isLoading) {
        return (
            <div className="exchange-detail">
                <p className="exchange-loading">Loading exchange...</p>
            </div>
        );
    }

    if (error || !exchange) {
        return (
            <div className="exchange-detail">
                <p className="exchange-error">Error loading exchange.</p>
                <Link href="/exchanges" className="exchange-back-link">
                    Back to exchanges
                </Link>
            </div>
        );
    }

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const authorName = exchange.author.profile?.fullName || exchange.author.fullName || 'Unknown';
    const authorPhoto = exchange.author.profile?.photo;
    const initials = authorName
        .split(' ')
        .map((part: string) => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const isOwnExchange = currentUserId === exchange.author.id;
    const hasExpressedInterest = exchange.interestedUsers?.some(user => user.userId === currentUserId);
    const canExpressInterest = !isOwnExchange && exchange.availability === 'available' && !hasExpressedInterest;

    return (
        <div className="exchange-detail">
            <Link href="/exchanges" className="exchange-back-link">
                <Icon icon="arrowLeft" size={16} />
                Back to exchanges
            </Link>

            <article className="exchange-article">
                <div className="exchange-article-main">
                    <div className="exchange-article-badges">
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

                    <header className="exchange-article-header">
                        <h1 className="exchange-article-title">{exchange.title}</h1>
                        <div className="exchange-article-meta">
                            {authorPhoto ? (
                                <img
                                    src={authorPhoto}
                                    alt={authorName}
                                    className="exchange-article-avatar"
                                />
                            ) : (
                                <div className="exchange-article-avatar exchange-article-avatar--placeholder">
                                    {initials}
                                </div>
                            )}
                            <div className="exchange-article-author-info">
                                <span className="exchange-article-author">{authorName}</span>
                                <div className="exchange-article-meta-details">
                                    <span className="exchange-article-space">{exchange.space.title}</span>
                                    <span className="exchange-article-separator">•</span>
                                    <span className="exchange-article-date">Posted {formatDate(exchange.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {exchange.images && exchange.images.length > 0 && (
                        <div className="exchange-article-images">
                            {exchange.images.map((image, index) => (
                                <div key={index} className="exchange-article-image-wrapper">
                                    <img
                                        src={image.url}
                                        alt={image.caption || exchange.title}
                                        className="exchange-article-image"
                                    />
                                    {image.caption && (
                                        <p className="exchange-article-image-caption">{image.caption}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <RichContent
                        content={exchange.htmlContent}
                        className="exchange-article-content"
                    />

                    {exchange.conditions && (
                        <div className="exchange-article-conditions">
                            <h3 className="exchange-article-section-title">
                                <Icon icon="info" size={18} />
                                Conditions & Requirements
                            </h3>
                            <p className="exchange-article-conditions-text">{exchange.conditions}</p>
                        </div>
                    )}

                    {exchange.tags && exchange.tags.length > 0 && (
                        <div className="exchange-article-tags">
                            {exchange.tags.map((tag) => (
                                <span key={tag.id} className="exchange-tag">
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <footer className="exchange-article-footer">
                        <div className="exchange-article-actions">
                            {canExpressInterest && !showInterestForm && (
                                <button
                                    onClick={() => setShowInterestForm(true)}
                                    className="exchange-interest-btn exchange-interest-btn--primary"
                                >
                                    <Icon icon="messageSquare" size={18} />
                                    Express Interest
                                </button>
                            )}

                            {hasExpressedInterest && (
                                <button
                                    onClick={handleWithdrawInterest}
                                    className="exchange-interest-btn exchange-interest-btn--secondary"
                                    disabled={withdrawInterestMutation.isPending}
                                >
                                    <Icon icon="x" size={18} />
                                    Withdraw Interest
                                </button>
                            )}

                            {showInterestForm && (
                                <div className="exchange-interest-form">
                                    <h3 className="exchange-interest-form-title">Express Your Interest</h3>
                                    <textarea
                                        value={interestMessage}
                                        onChange={(e) => setInterestMessage(e.target.value)}
                                        placeholder="Tell them why you're interested..."
                                        className="exchange-interest-textarea"
                                        rows={4}
                                    />
                                    {exchange.schedule && (
                                        <input
                                            type="date"
                                            value={requestedDate}
                                            onChange={(e) => setRequestedDate(e.target.value)}
                                            className="exchange-interest-date"
                                            placeholder="Preferred date"
                                        />
                                    )}
                                    <div className="exchange-interest-form-actions">
                                        <button
                                            onClick={handleExpressInterest}
                                            disabled={expressInterestMutation.isPending}
                                            className="exchange-interest-btn exchange-interest-btn--primary"
                                        >
                                            Send Interest
                                        </button>
                                        <button
                                            onClick={() => setShowInterestForm(false)}
                                            className="exchange-interest-btn exchange-interest-btn--secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            <LikesDisplay
                                likesCount={exchange.likesCount ?? 0}
                                isLiked={exchange.isLiked ?? false}
                                likedBy={[]}
                                onLikeToggle={() => {}}
                            />
                        </div>
                    </footer>
                </div>

                <div className="exchange-article-sidebar">
                    <div className="exchange-info-card">
                        <h3 className="exchange-info-title">Exchange Details</h3>
                        <div className="exchange-info-items">
                            <div className="exchange-info-item">
                                <Icon icon={getTermsIcon(exchange.terms)} size={16} />
                                <div>
                                    <div className="exchange-info-label">Terms</div>
                                    <div className="exchange-info-value">{getTermsLabel(exchange.terms)}</div>
                                </div>
                            </div>
                            {exchange.location && (
                                <div className="exchange-info-item">
                                    <Icon icon="mapPin" size={16} />
                                    <div>
                                        <div className="exchange-info-label">Location</div>
                                        <div className="exchange-info-value">
                                            {exchange.location.type === 'remote'
                                                ? 'Remote'
                                                : exchange.location.type === 'hybrid'
                                                ? 'Hybrid'
                                                : exchange.location.address || 'In-person'}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {exchange.schedule && (
                                <div className="exchange-info-item">
                                    <Icon icon="calendar" size={16} />
                                    <div>
                                        <div className="exchange-info-label">Schedule</div>
                                        <div className="exchange-info-value">{exchange.schedule}</div>
                                    </div>
                                </div>
                            )}
                            {exchange.expiresAt && (
                                <div className="exchange-info-item">
                                    <Icon icon="clock" size={16} />
                                    <div>
                                        <div className="exchange-info-label">Expires</div>
                                        <div className="exchange-info-value">{formatDate(exchange.expiresAt)}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="exchange-stats-card">
                        <div className="exchange-stat-item">
                            <Icon icon="users" size={20} />
                            <div>
                                <div className="exchange-stat-value">{exchange.interestedCount}</div>
                                <div className="exchange-stat-label">Interested</div>
                            </div>
                        </div>
                        <div className="exchange-stat-item">
                            <Icon icon="eye" size={20} />
                            <div>
                                <div className="exchange-stat-value">{exchange.viewCount}</div>
                                <div className="exchange-stat-label">Views</div>
                            </div>
                        </div>
                        <div className="exchange-stat-item">
                            <Icon icon="heart" size={20} />
                            <div>
                                <div className="exchange-stat-value">{exchange.likesCount}</div>
                                <div className="exchange-stat-label">Likes</div>
                            </div>
                        </div>
                    </div>

                    {exchange.interestedUsers && exchange.interestedUsers.length > 0 && isOwnExchange && (
                        <div className="exchange-interested-card">
                            <h3 className="exchange-interested-title">Interested Users</h3>
                            <div className="exchange-interested-list">
                                {exchange.interestedUsers.map((interested) => (
                                    <div key={interested.userId} className="exchange-interested-item">
                                        {interested.user.photo ? (
                                            <img
                                                src={interested.user.photo}
                                                alt={interested.user.fullName}
                                                className="exchange-interested-avatar"
                                            />
                                        ) : (
                                            <div className="exchange-interested-avatar exchange-interested-avatar--placeholder">
                                                {interested.user.fullName.charAt(0)}
                                            </div>
                                        )}
                                        <div className="exchange-interested-info">
                                            <div className="exchange-interested-name">{interested.user.fullName}</div>
                                            {interested.message && (
                                                <div className="exchange-interested-message">{interested.message}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </article>

            <section className="exchange-comments">
                <h2 className="exchange-comments-title">
                    Comments ({exchange.commentsCount ?? 0})
                </h2>
                <p className="exchange-comments-placeholder">
                    Comments functionality will be added in a future update.
                </p>
            </section>
        </div>
    );
}
