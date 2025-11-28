'use client';

import Link from 'next/link';
import { Webinar } from '@/lib/webinars';
import { Icon } from '../Icon';
import { Avatar, Badge } from '../primitives';
import styles from './WebinarCard.module.scss';

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
                <Badge variant="danger" size="sm">
                    Live Now
                </Badge>
            );
        }
        if (isScheduled) {
            return (
                <Badge variant="primary" size="sm">
                    Scheduled
                </Badge>
            );
        }
        if (isEnded) {
            return (
                <Badge variant="default" size="sm">
                    Ended
                </Badge>
            );
        }
        return null;
    };

    const getActionButton = () => {
        if (isLive) {
            return (
                <Link href={`/webinars/${webinar.id}/room`} className={`${styles.action} ${styles.actionLive}`}>
                    <Icon icon="video" size={18} />
                    Join Webinar
                </Link>
            );
        }
        if (isScheduled) {
            return (
                <button className={`${styles.action} ${styles.actionRegister}`}>
                    <Icon icon="bell" size={18} />
                    {webinar.settings.requireRegistration ? 'Register' : 'Add to Calendar'}
                </button>
            );
        }
        if (isEnded && webinar.settings.enableRecording) {
            return (
                <Link href={`/webinars/${webinar.id}`} className={`${styles.action} ${styles.actionEnded}`}>
                    <Icon icon="play" size={18} />
                    Watch Recording
                </Link>
            );
        }
        return null;
    };

    return (
        <article className={`${styles.card} ${isLive ? styles.live : ''}`}>
            {/* Header with status */}
            <div className={styles.header}>
                {getStatusBadge()}
                <span className={styles.space}>{webinar.spaceName}</span>
            </div>

            {/* Main content */}
            <div className={styles.content}>
                <Link href={`/webinars/${webinar.id}`} className={styles.titleLink}>
                    <h3 className={styles.title}>{webinar.title}</h3>
                </Link>

                {variant === 'full' && webinar.description && (
                    <p className={styles.description}>{webinar.description}</p>
                )}

                {/* Host info */}
                <div className={styles.host}>
                    <Avatar
                        src={webinar.hostPhoto}
                        alt={webinar.hostName}
                        fallback={webinar.hostName.charAt(0).toUpperCase()}
                        size="sm"
                    />
                    <div className={styles.hostInfo}>
                        <span className={styles.hostName}>{webinar.hostName}</span>
                        {webinar.coHosts && webinar.coHosts.length > 0 && (
                            <span className={styles.cohosts}>
                                + {webinar.coHosts.length} co-host{webinar.coHosts.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className={styles.stats}>
                    {isLive && webinar.stats && (
                        <div className={styles.stat}>
                            <Icon icon="users" size={16} />
                            <span>{webinar.stats.attendeeCount} attending</span>
                        </div>
                    )}
                    {isScheduled && webinar.stats && webinar.stats.registeredCount > 0 && (
                        <div className={styles.stat}>
                            <Icon icon="users" size={16} />
                            <span>{webinar.stats.registeredCount} registered</span>
                        </div>
                    )}
                    {isEnded && webinar.stats && (
                        <div className={styles.stat}>
                            <Icon icon="users" size={16} />
                            <span>{webinar.stats.peakAttendees} peak attendees</span>
                        </div>
                    )}
                    <div className={styles.stat}>
                        <Icon icon="clock" size={16} />
                        <span>{getTimeDisplay()}</span>
                    </div>
                    {webinar.duration && (
                        <div className={styles.stat}>
                            <Icon icon="calendar" size={16} />
                            <span>{webinar.duration} min</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer with action */}
            <div className={styles.footer}>
                {getActionButton()}
            </div>
        </article>
    );
}
