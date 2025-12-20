'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getUser, getUserStats, getConnections, sendConnectionRequest, removeConnection, User } from '@/lib/users';
import { getCurrentUserId } from '@/lib/auth';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

type TabType = 'connections' | 'spaces' | 'content';

export default function UserPage() {
    const params = useParams();
    const id = params.id as string;
    const currentUserId = getCurrentUserId();
    const isOwnProfile = currentUserId === id;

    const [activeTab, setActiveTab] = useState<TabType>('connections');

    const { data: user, isLoading, error } = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUser(id),
        enabled: !!id,
    });

    const { data: stats } = useQuery({
        queryKey: ['user-stats', id],
        queryFn: () => getUserStats(id),
        enabled: !!id,
    });

    const { data: connections } = useQuery({
        queryKey: ['user-connections', id],
        queryFn: () => getConnections(id),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <main className="user-detail-page">
                <p className="user-loading">Loading user...</p>
            </main>
        );
    }

    if (error || !user) {
        return (
            <main className="user-detail-page">
                <p className="user-error">Error loading user.</p>
                <Link href="/users" className="user-back-link">Back to users</Link>
            </main>
        );
    }

    const { profile } = user;

    // TODO: Remove this mock data once backend provides bio and interests
    // Enrich profile with mock data for demonstration
    const enrichedProfile = {
        ...profile,
        bio: profile.bio || 'Passionate about leveraging technology to solve complex transportation challenges. With over 10 years of experience in the industry, I specialize in sustainable mobility solutions and smart city infrastructure. Always eager to collaborate on innovative projects that make a positive impact on communities.',
        interests: profile.interests || [
            'Machine Learning',
            'Sustainable Transport',
            'Smart Cities',
            'Data Analytics',
            'Urban Planning',
            'Electric Vehicles',
            'AI & Automation',
            'Public Transit'
        ]
    };

    const displayName = enrichedProfile.fullName || `${enrichedProfile.firstName || ''} ${enrichedProfile.lastName || ''}`.trim() || 'Unknown User';
    const initials = displayName
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const handleConnect = async () => {
        if (!currentUserId) return;
        try {
            await sendConnectionRequest(currentUserId, id);
            // TODO: Show success message and refresh connection status
        } catch (error) {
            console.error('Failed to send connection request:', error);
        }
    };

    const handleDisconnect = async () => {
        if (!currentUserId) return;
        try {
            await removeConnection(currentUserId, id);
            // TODO: Show success message and refresh connection status
        } catch (error) {
            console.error('Failed to remove connection:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        return formatDate(dateString);
    };

    return (
        <main className="user-detail-page">
            <Link href="/users" className="user-detail-back-link">
                <Icon icon="arrowLeft" size={16} />
                Back to users
            </Link>

            <div className="user-detail-container">
                {/* Left Column */}
                <aside className="user-detail-sidebar">
                    <div className="user-detail-card">
                        <div className="user-detail-avatar-container">
                            {enrichedProfile.photo ? (
                                <img src={enrichedProfile.photo} alt={displayName} className="user-detail-avatar" />
                            ) : (
                                <div className="user-detail-avatar user-detail-avatar--placeholder">
                                    {initials}
                                </div>
                            )}
                        </div>

                        <h1 className="user-detail-name">{displayName}</h1>

                        {enrichedProfile.jobTitle && (
                            <p className="user-detail-job-title">{enrichedProfile.jobTitle}</p>
                        )}

                        {enrichedProfile.companyName && (
                            <p className="user-detail-company">
                                <Icon icon="briefcase" size={14} />
                                {enrichedProfile.companyName}
                            </p>
                        )}

                        {/* Action Buttons */}
                        {isOwnProfile ? (
                            <div className="user-detail-actions">
                                <Link href={`/users/${id}/edit`} className="user-detail-btn user-detail-btn--primary">
                                    <Icon icon="edit" size={16} />
                                    Edit Profile
                                </Link>
                            </div>
                        ) : (
                            <div className="user-detail-actions">
                                {user.connectionStatus === 'connected' ? (
                                    <>
                                        <button className="user-detail-btn user-detail-btn--primary">
                                            <Icon icon="send" size={16} />
                                            Message
                                        </button>
                                        <button
                                            className="user-detail-btn user-detail-btn--secondary"
                                            onClick={handleDisconnect}
                                        >
                                            <Icon icon="checkCircle" size={16} />
                                            Connected
                                        </button>
                                    </>
                                ) : user.connectionStatus === 'pending' ? (
                                    <button className="user-detail-btn user-detail-btn--secondary" disabled>
                                        <Icon icon="clock" size={16} />
                                        Request Pending
                                    </button>
                                ) : (
                                    <button
                                        className="user-detail-btn user-detail-btn--primary"
                                        onClick={handleConnect}
                                    >
                                        <Icon icon="userPlus" size={16} />
                                        Connect
                                    </button>
                                )}
                                <button className="user-detail-btn user-detail-btn--icon">
                                    <Icon icon="moreVertical" size={16} />
                                </button>
                            </div>
                        )}

                        {/* Contact Info */}
                        <div className="user-detail-contact">
                            <div className="user-detail-contact-item">
                                <Icon icon="send" size={16} />
                                <a href={`mailto:${user.email}`}>{user.email}</a>
                            </div>
                            {enrichedProfile.telephone && (
                                <div className="user-detail-contact-item">
                                    <Icon icon="info" size={16} />
                                    <span>{enrichedProfile.telephone}</span>
                                </div>
                            )}
                            {enrichedProfile.linkedInProfile && (
                                <div className="user-detail-contact-item">
                                    <Icon icon="external" size={16} />
                                    <a href={enrichedProfile.linkedInProfile} target="_blank" rel="noopener noreferrer">
                                        LinkedIn Profile
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Right Column */}
                <div className="user-detail-main">
                    {/* Interest Tags */}
                    {enrichedProfile.interests && enrichedProfile.interests.length > 0 && (
                        <section className="user-detail-section">
                            <h2 className="user-detail-section-title">Interests</h2>
                            <div className="user-detail-tags">
                                {enrichedProfile.interests.map((interest, index) => (
                                    <span key={index} className="user-detail-tag">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Bio */}
                    {enrichedProfile.bio && (
                        <section className="user-detail-section">
                            <h2 className="user-detail-section-title">About</h2>
                            <p className="user-detail-bio">{enrichedProfile.bio}</p>
                        </section>
                    )}

                    {/* Tabbed Content */}
                    <section className="user-detail-section">
                        <div className="user-detail-tabs">
                            <button
                                className={`user-detail-tab ${activeTab === 'connections' ? 'user-detail-tab--active' : ''}`}
                                onClick={() => setActiveTab('connections')}
                            >
                                <Icon icon="users" size={16} />
                                Connections
                                {stats && <span className="user-detail-tab-count">{stats.totalConnections}</span>}
                            </button>
                            <button
                                className={`user-detail-tab ${activeTab === 'spaces' ? 'user-detail-tab--active' : ''}`}
                                onClick={() => setActiveTab('spaces')}
                            >
                                <Icon icon="layoutGrid" size={16} />
                                Spaces
                                {stats && <span className="user-detail-tab-count">{stats.spacesJoined}</span>}
                            </button>
                            <button
                                className={`user-detail-tab ${activeTab === 'content' ? 'user-detail-tab--active' : ''}`}
                                onClick={() => setActiveTab('content')}
                            >
                                <Icon icon="fileText" size={16} />
                                Content
                            </button>
                        </div>

                        <div className="user-detail-tab-content">
                            {activeTab === 'connections' && (
                                <div className="user-detail-connections">
                                    {connections && connections.length > 0 ? (
                                        <div className="user-detail-connections-grid">
                                            {connections.map((connection) => {
                                                const connName = connection.profile.fullName ||
                                                    `${connection.profile.firstName || ''} ${connection.profile.lastName || ''}`.trim() ||
                                                    'Unknown User';
                                                const connInitials = connName
                                                    .split(' ')
                                                    .map(part => part.charAt(0))
                                                    .join('')
                                                    .toUpperCase()
                                                    .slice(0, 2);

                                                return (
                                                    <Link
                                                        key={connection.id}
                                                        href={`/users/${connection.id}`}
                                                        className="user-detail-connection-card"
                                                    >
                                                        {connection.profile.photo ? (
                                                            <img
                                                                src={connection.profile.photo}
                                                                alt={connName}
                                                                className="user-detail-connection-avatar"
                                                            />
                                                        ) : (
                                                            <div className="user-detail-connection-avatar user-detail-connection-avatar--placeholder">
                                                                {connInitials}
                                                            </div>
                                                        )}
                                                        <div className="user-detail-connection-info">
                                                            <h3 className="user-detail-connection-name">{connName}</h3>
                                                            {connection.profile.jobTitle && (
                                                                <p className="user-detail-connection-title">
                                                                    {connection.profile.jobTitle}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="user-detail-empty">
                                            <Icon icon="users" size={48} />
                                            <p>No connections yet</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'spaces' && (
                                <div className="user-detail-spaces">
                                    {user.adminSpaces.length > 0 && (
                                        <div className="user-detail-spaces-group">
                                            <h3 className="user-detail-spaces-label">Administrator</h3>
                                            <div className="user-detail-spaces-list">
                                                {user.adminSpaces.map(space => (
                                                    <Link
                                                        key={space.id}
                                                        href={`/spaces/${space.id}`}
                                                        className="user-detail-space-card"
                                                    >
                                                        <div className="user-detail-space-icon">
                                                            {space.title.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="user-detail-space-title">{space.title}</span>
                                                        <Icon icon="checkCircle" size={16} className="user-detail-space-badge" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {user.memberSpaces.length > 0 && (
                                        <div className="user-detail-spaces-group">
                                            <h3 className="user-detail-spaces-label">Member</h3>
                                            <div className="user-detail-spaces-list">
                                                {user.memberSpaces.map(space => (
                                                    <Link
                                                        key={space.id}
                                                        href={`/spaces/${space.id}`}
                                                        className="user-detail-space-card"
                                                    >
                                                        <div className="user-detail-space-icon">
                                                            {space.title.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="user-detail-space-title">{space.title}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {user.adminSpaces.length === 0 && user.memberSpaces.length === 0 && (
                                        <div className="user-detail-empty">
                                            <Icon icon="layoutGrid" size={48} />
                                            <p>Not a member of any spaces yet</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'content' && (
                                <div className="user-detail-content">
                                    <div className="user-detail-empty">
                                        <Icon icon="fileText" size={48} />
                                        <p>No content published yet</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Stats Section */}
                    {stats && (
                        <section className="user-detail-section">
                            <h2 className="user-detail-section-title">Activity & Stats</h2>

                            <div className="user-detail-stats-grid">
                                <div className="user-detail-stat-card">
                                    <div className="user-detail-stat-icon">
                                        <Icon icon="comment" size={20} />
                                    </div>
                                    <div className="user-detail-stat-info">
                                        <p className="user-detail-stat-value">{stats.discussionsStarted}</p>
                                        <p className="user-detail-stat-label">Discussions Started</p>
                                    </div>
                                </div>

                                <div className="user-detail-stat-card">
                                    <div className="user-detail-stat-icon">
                                        <Icon icon="comment" size={20} />
                                    </div>
                                    <div className="user-detail-stat-info">
                                        <p className="user-detail-stat-value">{stats.repliesMade}</p>
                                        <p className="user-detail-stat-label">Replies Made</p>
                                    </div>
                                </div>

                                <div className="user-detail-stat-card">
                                    <div className="user-detail-stat-icon">
                                        <Icon icon="calendar" size={20} />
                                    </div>
                                    <div className="user-detail-stat-info">
                                        <p className="user-detail-stat-value">{stats.eventsCreated}</p>
                                        <p className="user-detail-stat-label">Events Created</p>
                                    </div>
                                </div>

                                <div className="user-detail-stat-card">
                                    <div className="user-detail-stat-icon">
                                        <Icon icon="book" size={20} />
                                    </div>
                                    <div className="user-detail-stat-info">
                                        <p className="user-detail-stat-value">{stats.resourcesShared}</p>
                                        <p className="user-detail-stat-label">Resources Shared</p>
                                    </div>
                                </div>

                                <div className="user-detail-stat-card">
                                    <div className="user-detail-stat-icon">
                                        <Icon icon="star" size={20} />
                                    </div>
                                    <div className="user-detail-stat-info">
                                        <p className="user-detail-stat-value">{stats.showcasesPublished}</p>
                                        <p className="user-detail-stat-label">Showcases Published</p>
                                    </div>
                                </div>

                                <div className="user-detail-stat-card">
                                    <div className="user-detail-stat-icon">
                                        <Icon icon="bell" size={20} />
                                    </div>
                                    <div className="user-detail-stat-info">
                                        <p className="user-detail-stat-value">{stats.updatesPosted}</p>
                                        <p className="user-detail-stat-label">Updates Posted</p>
                                    </div>
                                </div>

                                <div className="user-detail-stat-card">
                                    <div className="user-detail-stat-icon">
                                        <Icon icon="heart" size={20} />
                                    </div>
                                    <div className="user-detail-stat-info">
                                        <p className="user-detail-stat-value">{stats.likesReceived}</p>
                                        <p className="user-detail-stat-label">Likes Received</p>
                                    </div>
                                </div>

                                <div className="user-detail-stat-card">
                                    <div className="user-detail-stat-icon">
                                        <Icon icon="thumbsUp" size={20} />
                                    </div>
                                    <div className="user-detail-stat-info">
                                        <p className="user-detail-stat-value">{stats.likesGiven}</p>
                                        <p className="user-detail-stat-label">Likes Given</p>
                                    </div>
                                </div>
                            </div>

                            <div className="user-detail-meta-stats">
                                <div className="user-detail-meta-stat">
                                    <Icon icon="calendar" size={16} />
                                    <span>Member since {formatDate(stats.memberSince)}</span>
                                </div>
                                <div className="user-detail-meta-stat">
                                    <Icon icon="clock" size={16} />
                                    <span>Last active {formatRelativeTime(stats.lastActive)}</span>
                                </div>
                                {stats.mostActiveSpace && (
                                    <div className="user-detail-meta-stat">
                                        <Icon icon="arrowUp" size={16} />
                                        <span>
                                            Most active in{' '}
                                            <Link href={`/spaces/${stats.mostActiveSpace.id}`}>
                                                {stats.mostActiveSpace.title}
                                            </Link>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
}
