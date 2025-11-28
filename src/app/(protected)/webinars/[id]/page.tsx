'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockWebinars } from '@/lib/mock-webinars';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

export default function WebinarDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const webinarId = params.id as string;

    // Find the webinar
    const webinar = mockWebinars.find(w => w.id === webinarId);

    if (!webinar) {
        return (
            <main className="webinar-details-page">
                <div className="webinar-details-container">
                    <div className="webinar-details-not-found">
                        <Icon icon="video" size={64} />
                        <h1>Webinar Not Found</h1>
                        <p>The webinar you're looking for doesn't exist.</p>
                        <Link href="/webinars" className="webinar-details-back-link">
                            Back to Webinars
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const isLive = webinar.status === 'live';
    const isScheduled = webinar.status === 'scheduled';
    const isEnded = webinar.status === 'ended';

    const getTimeDisplay = () => {
        if (isLive && webinar.startedAt) {
            const minutesAgo = Math.floor((Date.now() - new Date(webinar.startedAt).getTime()) / (1000 * 60));
            return `Started ${minutesAgo} minutes ago`;
        }

        if (isScheduled && webinar.scheduledFor) {
            const scheduledDate = new Date(webinar.scheduledFor);
            return scheduledDate.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        if (isEnded && webinar.endedAt) {
            const endedDate = new Date(webinar.endedAt);
            return endedDate.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        return '';
    };

    const handleJoinLive = () => {
        router.push(`/webinars/${webinar.id}/room`);
    };

    const handleRegister = () => {
        // Simulate registration
        alert('Registration functionality would be implemented here');
    };

    return (
        <main className="webinar-details-page">
            <div className="webinar-details-container">
                {/* Header */}
                <header className="webinar-details-header">
                    <Link href="/webinars" className="webinar-details-back">
                        <Icon icon="arrowLeft" size={20} />
                        Back to Webinars
                    </Link>

                    <div className="webinar-details-header-content">
                        <div className="webinar-details-header-main">
                            <div className="webinar-details-status-container">
                                {isLive && (
                                    <span className="webinar-status-badge webinar-status-badge--live">
                                        Live Now
                                    </span>
                                )}
                                {isScheduled && (
                                    <span className="webinar-status-badge webinar-status-badge--scheduled">
                                        Scheduled
                                    </span>
                                )}
                                {isEnded && (
                                    <span className="webinar-status-badge webinar-status-badge--ended">
                                        Ended
                                    </span>
                                )}
                            </div>

                            <h1 className="webinar-details-title">{webinar.title}</h1>

                            {webinar.description && (
                                <p className="webinar-details-description">{webinar.description}</p>
                            )}

                            {/* Meta Info */}
                            <div className="webinar-details-meta">
                                <div className="webinar-details-meta-item">
                                    <Icon icon="calendar" size={18} />
                                    <span>{getTimeDisplay()}</span>
                                </div>
                                {webinar.duration && (
                                    <div className="webinar-details-meta-item">
                                        <Icon icon="clock" size={18} />
                                        <span>{webinar.duration} minutes</span>
                                    </div>
                                )}
                                {webinar.stats && (isLive || isEnded) && (
                                    <div className="webinar-details-meta-item">
                                        <Icon icon="users" size={18} />
                                        <span>
                                            {isLive
                                                ? `${webinar.stats.attendeeCount} watching`
                                                : `${webinar.stats.peakAttendees} peak attendees`}
                                        </span>
                                    </div>
                                )}
                                {webinar.stats && isScheduled && webinar.stats.registeredCount > 0 && (
                                    <div className="webinar-details-meta-item">
                                        <Icon icon="users" size={18} />
                                        <span>{webinar.stats.registeredCount} registered</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="webinar-details-action">
                            {isLive && (
                                <button
                                    onClick={handleJoinLive}
                                    className="webinar-details-join-button webinar-details-join-button--live"
                                >
                                    <Icon icon="video" size={20} />
                                    Join Live Webinar
                                </button>
                            )}
                            {isScheduled && (
                                <button
                                    onClick={handleRegister}
                                    className="webinar-details-join-button webinar-details-join-button--register"
                                >
                                    <Icon icon="bell" size={20} />
                                    {webinar.settings.requireRegistration ? 'Register Now' : 'Add to Calendar'}
                                </button>
                            )}
                            {isEnded && webinar.settings.enableRecording && (
                                <button className="webinar-details-join-button webinar-details-join-button--recording">
                                    <Icon icon="play" size={20} />
                                    Watch Recording
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="webinar-details-content">
                    {/* Left Column */}
                    <div className="webinar-details-main">
                        {/* Host Section */}
                        <section className="webinar-details-section">
                            <h2 className="webinar-details-section-title">Host</h2>
                            <div className="webinar-details-host">
                                <div className="webinar-details-host-avatar">
                                    {webinar.hostPhoto ? (
                                        <img src={webinar.hostPhoto} alt={webinar.hostName} />
                                    ) : (
                                        <div className="webinar-details-host-avatar-placeholder">
                                            {webinar.hostName.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="webinar-details-host-info">
                                    <div className="webinar-details-host-name">{webinar.hostName}</div>
                                    {webinar.coHosts && webinar.coHosts.length > 0 && (
                                        <div className="webinar-details-host-cohosts">
                                            + {webinar.coHosts.length} co-host{webinar.coHosts.length !== 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* About Section */}
                        {webinar.description && (
                            <section className="webinar-details-section">
                                <h2 className="webinar-details-section-title">About This Webinar</h2>
                                <p className="webinar-details-about">{webinar.description}</p>
                            </section>
                        )}

                        {/* Features Section */}
                        <section className="webinar-details-section">
                            <h2 className="webinar-details-section-title">Features</h2>
                            <div className="webinar-details-features">
                                {webinar.settings.enableChat && (
                                    <div className="webinar-details-feature">
                                        <Icon icon="chat" size={20} />
                                        <div>
                                            <div className="webinar-details-feature-title">Live Chat</div>
                                            <div className="webinar-details-feature-description">
                                                Interact with other attendees
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {webinar.settings.enableQA && (
                                    <div className="webinar-details-feature">
                                        <Icon icon="help" size={20} />
                                        <div>
                                            <div className="webinar-details-feature-title">Q&A</div>
                                            <div className="webinar-details-feature-description">
                                                Ask questions to the host
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {webinar.settings.enableRecording && (
                                    <div className="webinar-details-feature">
                                        <Icon icon="video" size={20} />
                                        <div>
                                            <div className="webinar-details-feature-title">Recording Available</div>
                                            <div className="webinar-details-feature-description">
                                                Watch later if you miss it
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Sidebar */}
                    <aside className="webinar-details-sidebar">
                        {/* Space Card */}
                        <div className="webinar-details-sidebar-card">
                            <h3 className="webinar-details-sidebar-title">Space</h3>
                            <Link href={`/spaces/${webinar.spaceId}`} className="webinar-details-space-link">
                                {webinar.spaceName}
                                <Icon icon="external" size={16} />
                            </Link>
                        </div>

                        {/* Stats Card */}
                        {webinar.stats && (
                            <div className="webinar-details-sidebar-card">
                                <h3 className="webinar-details-sidebar-title">Stats</h3>
                                <div className="webinar-details-stats">
                                    {isLive && (
                                        <>
                                            <div className="webinar-details-stat">
                                                <span className="webinar-details-stat-label">Current Viewers</span>
                                                <span className="webinar-details-stat-value">
                                                    {webinar.stats.attendeeCount}
                                                </span>
                                            </div>
                                            <div className="webinar-details-stat">
                                                <span className="webinar-details-stat-label">Peak Viewers</span>
                                                <span className="webinar-details-stat-value">
                                                    {webinar.stats.peakAttendees}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                    {isScheduled && (
                                        <div className="webinar-details-stat">
                                            <span className="webinar-details-stat-label">Registered</span>
                                            <span className="webinar-details-stat-value">
                                                {webinar.stats.registeredCount}
                                            </span>
                                        </div>
                                    )}
                                    {isEnded && (
                                        <>
                                            <div className="webinar-details-stat">
                                                <span className="webinar-details-stat-label">Peak Attendees</span>
                                                <span className="webinar-details-stat-value">
                                                    {webinar.stats.peakAttendees}
                                                </span>
                                            </div>
                                            {webinar.stats.totalViews && (
                                                <div className="webinar-details-stat">
                                                    <span className="webinar-details-stat-label">Total Views</span>
                                                    <span className="webinar-details-stat-value">
                                                        {webinar.stats.totalViews}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Share Card */}
                        <div className="webinar-details-sidebar-card">
                            <h3 className="webinar-details-sidebar-title">Share</h3>
                            <button className="webinar-details-share-button">
                                <Icon icon="link" size={18} />
                                Copy Link
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
