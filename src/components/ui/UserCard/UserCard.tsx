'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, sendConnectionRequest, removeConnection } from '@/lib/users';
import { getCurrentUserId } from '@/lib/auth';
import { useToast } from '../ToastProvider';
import { Icon } from '../Icon';
import { Avatar, Badge } from '../primitives';
import styles from './UserCard.module.scss';

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
                    <span className={styles.btnSpinner}></span>
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
        const baseClass = styles.connectBtn;
        const statusClass = styles[`connectBtn--${status}`] || '';
        const loadingClass = isConnecting ? styles['connectBtn--loading'] : '';
        const errorClass = error ? styles['connectBtn--error'] : '';
        return [baseClass, statusClass, loadingClass, errorClass].filter(Boolean).join(' ');
    };

    return (
        <article className={styles.card}>
            {/* 4:3 Cover Image Section */}
            <Link href={`/users/${user.id}`} className={styles.coverLink}>
                <div className={styles.cover}>
                    {profile.photo ? (
                        <img
                            src={profile.photo}
                            alt={displayName}
                            className={styles.coverImage}
                        />
                    ) : (
                        <div className={styles.coverPlaceholder}>
                            <span className={styles.coverInitials}>{initials}</span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Card Content */}
            <div className={styles.content}>
                {/* Name and New Badge */}
                <div className={styles.nameSection}>
                    <Link href={`/users/${user.id}`} className={styles.nameLink}>
                        <h3 className={styles.name}>{displayName}</h3>
                    </Link>
                    {isNewUser && (
                        <Badge variant="success" size="sm">
                            <Icon icon="sparkles" size={12} />
                            New
                        </Badge>
                    )}
                </div>

                {/* Job Title */}
                {profile.jobTitle && (
                    <p className={styles.jobTitle}>
                        <Icon icon="briefcase" size={14} />
                        {profile.jobTitle}
                    </p>
                )}

                {/* Company Name */}
                {profile.companyName && (
                    <p className={styles.company}>
                        <Icon icon="building" size={14} />
                        {profile.companyName}
                    </p>
                )}

                {/* Interest Tags */}
                {transportModes.length > 0 && (
                    <div className={styles.tags}>
                        {transportModes.slice(0, 4).map((mode, index) => (
                            <span
                                key={index}
                                className={styles.tag}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {mode}
                            </span>
                        ))}
                        {transportModes.length > 4 && (
                            <span className={`${styles.tag} ${styles.tagMore}`}>
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
                    <div className={styles.error}>
                        <Icon icon="alertCircle" size={14} />
                        {error}
                    </div>
                )}

                {/* Footer Metadata */}
                <div className={styles.footer}>
                    {spaceCount > 0 && (
                        <span className={styles.meta}>
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
