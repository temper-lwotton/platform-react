'use client';

import Link from 'next/link';
import { Webinar } from '@/lib/webinars';
import { Icon } from '@/components/ui/Icon';

interface WebinarCardProps {
    webinar: Webinar;
    variant?: 'compact' | 'full';
}

export function WebinarCard({ webinar, variant = 'full' }: WebinarCardProps) {
    const isLive = webinar.status === 'live';
    const isScheduled = webinar.status === 'scheduled';
    const isEnded = webinar.status === 'ended';

    // Calculate time displays
    const getTimeDisplay = () => {
        if (isLive && webinar.startedAt) {
            const minutesAgo = Math.floor((Date.now() - new Date(webinar.startedAt).getTime()) / (1000 * 60));
            if (minutesAgo < 60) {
                return `Started ${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
            }
            const hoursAgo = Math.floor(minutesAgo / 60);
            return `Started ${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
        }

        if (isScheduled && webinar.scheduledFor) {
            const scheduledDate = new Date(webinar.scheduledFor);
            const now = new Date();
            const diffMs = scheduledDate.getTime() - now.getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffHours / 24);

            if (diffDays > 1) {
                return scheduledDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } else if (diffDays === 1) {
                return `Tomorrow at ${scheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
            } else if (diffHours > 0) {
                return `In ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
            } else {
                const diffMinutes = Math.floor(diffMs / (1000 * 60));
                return `In ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
            }
        }

        if (isEnded && webinar.endedAt) {
            const endedDate = new Date(webinar.endedAt);
            return `Ended ${endedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        }

        return '';
    };

    const getStatusBadge = () => {
        if (isLive) {
            return (
                <span className="webinar-status-badge webinar-status-badge--live">
                    Live Now
                </span>
            );
        }
        if (isScheduled) {
            return (
                <span className="webinar-status-badge webinar-status-badge--scheduled">
                    Scheduled
                </span>
            );
        }
        if (isEnded) {
            return (
                <span className="webinar-status-badge webinar-status-badge--ended">
                    Ended
                </span>
            );
        }
        return null;
    };

    const getActionButton = () => {
        if (isLive) {
            return (
                <Link href={`/webinars/${webinar.id}/room`} className="webinar-card-action webinar-card-action--live">
                    <Icon icon="video" size={18} />
                    Join Webinar
                </Link>
            );
        }
        if (isScheduled) {
            return (
                <button className="webinar-card-action webinar-card-action--register">
                    <Icon icon="bell" size={18} />
                    {webinar.settings.requireRegistration ? 'Register' : 'Add to Calendar'}
                </button>
            );
        }
        if (isEnded && webinar.settings.enableRecording) {
            return (
                <Link href={`/webinars/${webinar.id}`} className="webinar-card-action webinar-card-action--ended">
                    <Icon icon="play" size={18} />
                    Watch Recording
                </Link>
            );
        }
        return null;
    };

    return (
        <article className={`webinar-card ${isLive ? 'webinar-card--live' : ''}`}>
            {/* Header with status */}
            <div className="webinar-card-header">
                {getStatusBadge()}
                <span className="webinar-card-space">{webinar.spaceName}</span>
            </div>

            {/* Main content */}
            <div className="webinar-card-content">
                <Link href={`/webinars/${webinar.id}`} className="webinar-card-title-link">
                    <h3 className="webinar-card-title">{webinar.title}</h3>
                </Link>

                {variant === 'full' && webinar.description && (
                    <p className="webinar-card-description">{webinar.description}</p>
                )}

                {/* Host info */}
                <div className="webinar-card-host">
                    <div className="webinar-card-host-avatar">
                        {webinar.hostPhoto ? (
                            <img src={webinar.hostPhoto} alt={webinar.hostName} />
                        ) : (
                            <div className="webinar-card-host-avatar-placeholder">
                                {webinar.hostName.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="webinar-card-host-info">
                        <span className="webinar-card-host-name">{webinar.hostName}</span>
                        {webinar.coHosts && webinar.coHosts.length > 0 && (
                            <span className="webinar-card-cohosts">
                                + {webinar.coHosts.length} co-host{webinar.coHosts.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="webinar-card-stats">
                    {isLive && webinar.stats && (
                        <div className="webinar-card-stat">
                            <Icon icon="users" size={16} />
                            <span>{webinar.stats.attendeeCount} attending</span>
                        </div>
                    )}
                    {isScheduled && webinar.stats && webinar.stats.registeredCount > 0 && (
                        <div className="webinar-card-stat">
                            <Icon icon="users" size={16} />
                            <span>{webinar.stats.registeredCount} registered</span>
                        </div>
                    )}
                    {isEnded && webinar.stats && (
                        <div className="webinar-card-stat">
                            <Icon icon="users" size={16} />
                            <span>{webinar.stats.peakAttendees} peak attendees</span>
                        </div>
                    )}
                    <div className="webinar-card-stat">
                        <Icon icon="clock" size={16} />
                        <span>{getTimeDisplay()}</span>
                    </div>
                    {webinar.duration && (
                        <div className="webinar-card-stat">
                            <Icon icon="calendar" size={16} />
                            <span>{webinar.duration} min</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer with action */}
            <div className="webinar-card-footer">
                {getActionButton()}
            </div>
        </article>
    );
}
