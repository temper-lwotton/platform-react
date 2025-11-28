'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, sendConnectionRequest, removeConnection } from '@/lib/users';
import { getCurrentUserId } from '@/lib/auth';
import { useToast } from './ToastProvider';
import { Icon } from './Icon';

interface UserCardProps {
    user: User;
    onConnectionChange?: () => void;
}

export function UserCard({ user, onConnectionChange }: UserCardProps) {
    const { profile } = user;
    const toast = useToast();
    const displayName =
        profile.fullName ||
        `${profile.firstName || ''} ${profile.lastName || ''}`.trim() ||
        'Unknown User';

    const initials = getInitials(displayName);
    const spaceCount = user.adminSpaces.length + user.memberSpaces.length;

    // Real connection state management
    const [status, setStatus] = useState<'none' | 'pending' | 'connected'>(user.connectionStatus || 'none');
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if user joined within the last 7 days
    const joinDate = new Date(user.createdAt);
    const daysAgo = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
    const isNewUser = daysAgo <= 7;

    // Generate a stable color variation based on user ID
    const colorVariation = getColorVariation(user.id);

    const currentUserId = getCurrentUserId();

    // Parse transport modes if they exist (handle both string and array types)
    let transportModes: string[] = [];
    if (profile.transportModesOfInterest) {
        if (typeof profile.transportModesOfInterest === 'string') {
            transportModes = profile.transportModesOfInterest.split(',').map(m => m.trim()).filter(Boolean);
        } else if (Array.isArray(profile.transportModesOfInterest)) {
            transportModes = (profile.transportModesOfInterest as any[]).map((m: any) => String(m).trim()).filter(Boolean);
        }
    }

    const handleConnect = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (isConnecting || !currentUserId) return;

        setError(null);
        setIsConnecting(true);

        try {
            if (status === 'none') {
                // Send connection request - optimistic update
                const previousStatus = status;
                setStatus('pending');

                try {
                    await sendConnectionRequest(currentUserId, String(user.id));
                    // Success - keep pending state
                    toast.success(
                        'Connection request sent',
                        `Your connection request to ${displayName} has been sent successfully.`
                    );
                    onConnectionChange?.();
                } catch (err) {
                    // Rollback on error
                    setStatus(previousStatus);
                    throw err;
                }
            } else if (status === 'connected') {
                // Remove connection - optimistic update
                const previousStatus = status;
                setStatus('none');

                try {
                    await removeConnection(currentUserId, String(user.id));
                    // Success - keep none state
                    toast.info(
                        'Connection removed',
                        `You are no longer connected with ${displayName}.`
                    );
                    onConnectionChange?.();
                } catch (err) {
                    // Rollback on error
                    setStatus(previousStatus);
                    throw err;
                }
            }
            // Note: 'pending' state doesn't allow actions from the sender's side
        } catch (err) {
            console.error('Connection action failed:', err);
            const errorMessage = err instanceof Error ? err.message : 'Connection action failed';
            setError(errorMessage);

            // Show error toast
            toast.error(
                'Connection failed',
                errorMessage
            );

            // Auto-clear error after 3 seconds
            setTimeout(() => setError(null), 3000);
        } finally {
            setIsConnecting(false);
        }
    };

    const getButtonContent = () => {
        if (isConnecting) {
            return (
                <>
                    <span className="user-card-btn-spinner"></span>
                    Connecting...
                </>
            );
        }

        switch (status) {
            case 'pending':
                return (
                    <>
                        <Icon icon="clock" size={16} />
                        Pending
                    </>
                );
            case 'connected':
                return (
                    <>
                        <Icon icon="check" size={16} />
                        Connected
                    </>
                );
            default:
                return (
                    <>
                        <Icon icon="userPlus" size={16} />
                        Connect
                    </>
                );
        }
    };

    const getButtonClassName = () => {
        let className = `user-card-connect-btn user-card-connect-btn--${status}`;
        if (isConnecting) className += ' user-card-connect-btn--loading';
        if (error) className += ' user-card-connect-btn--error';
        return className;
    };

    return (
        <article className="user-card">
            {/* 4:3 Cover Image Section */}
            <Link href={`/users/${user.id}`} className="user-card-cover-link">
                <div className="user-card-cover">
                    {profile.photo ? (
                        <img
                            src={profile.photo}
                            alt={displayName}
                            className="user-card-cover-image"
                        />
                    ) : (
                        <div className={`user-card-cover-placeholder user-card-cover-placeholder--${colorVariation}`}>
                            <span className="user-card-cover-initials">{initials}</span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Card Content */}
            <div className="user-card-content">
                {/* Name and New Badge */}
                <div className="user-card-name-section">
                    <Link href={`/users/${user.id}`} className="user-card-name-link">
                        <h3 className="user-card-name">{displayName}</h3>
                    </Link>
                    {isNewUser && (
                        <span className="user-card-new-badge">
                            <Icon icon="sparkles" size={12} />
                            New
                        </span>
                    )}
                </div>

                {/* Job Title */}
                {profile.jobTitle && (
                    <p className="user-card-job-title">
                        <Icon icon="briefcase" size={14} />
                        {profile.jobTitle}
                    </p>
                )}

                {/* Company Name */}
                {profile.companyName && (
                    <p className="user-card-company">
                        <Icon icon="building" size={14} />
                        {profile.companyName}
                    </p>
                )}

                {/* Interest Tags */}
                {transportModes.length > 0 && (
                    <div className="user-card-tags">
                        {transportModes.slice(0, 4).map((mode, index) => (
                            <span
                                key={index}
                                className="user-card-tag"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {mode}
                            </span>
                        ))}
                        {transportModes.length > 4 && (
                            <span className="user-card-tag user-card-tag-more">
                                +{transportModes.length - 4}
                            </span>
                        )}
                    </div>
                )}

                {/* Connect CTA */}
                <button
                    onClick={handleConnect}
                    className={getButtonClassName()}
                    disabled={isConnecting || status === 'pending'}
                    title={error || undefined}
                >
                    {getButtonContent()}
                </button>

                {/* Error Message */}
                {error && (
                    <div className="user-card-error">
                        <Icon icon="alertCircle" size={14} />
                        {error}
                    </div>
                )}

                {/* Footer Metadata */}
                <div className="user-card-footer">
                    {spaceCount > 0 && (
                        <span className="user-card-meta">
                            <Icon icon="users" size={14} />
                            {spaceCount} space{spaceCount !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Generate color variation based on user ID (for consistent placeholder colors)
function getColorVariation(userId: string | number): number {
    const hash = String(userId).split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return Math.abs(hash) % 5; // 5 color variations
}
