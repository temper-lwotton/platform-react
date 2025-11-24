'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/lib/users';
import Link from 'next/link';

export default function UserPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: user, isLoading, error } = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUser(id),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <main className="user-page">
                <p className="user-loading">Loading user...</p>
            </main>
        );
    }

    if (error || !user) {
        return (
            <main className="user-page">
                <p className="user-error">Error loading user.</p>
                <Link href="/users" className="user-back-link">Back to users</Link>
            </main>
        );
    }

    const { profile } = user;
    const displayName = profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Unknown User';
    const initials = displayName
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <main className="user-page">
            <Link href="/users" className="user-back-link">Back to users</Link>

            <header className="user-header">
                {profile.photo ? (
                    <img src={profile.photo} alt={displayName} className="user-header-avatar" />
                ) : (
                    <div className="user-header-avatar user-header-avatar--placeholder">
                        {initials}
                    </div>
                )}
                <div className="user-header-info">
                    <h1 className="user-page-name">{displayName}</h1>
                    {profile.jobTitle && <p className="user-page-title">{profile.jobTitle}</p>}
                    {profile.companyName && <p className="user-page-company">{profile.companyName}</p>}
                </div>
            </header>

            <div className="user-details">
                <section className="user-section">
                    <h2 className="user-section-title">Contact</h2>
                    <dl className="user-detail-list">
                        <div className="user-detail-item">
                            <dt>Email</dt>
                            <dd><a href={`mailto:${user.email}`}>{user.email}</a></dd>
                        </div>
                        {profile.telephone && (
                            <div className="user-detail-item">
                                <dt>Phone</dt>
                                <dd>{profile.telephone}</dd>
                            </div>
                        )}
                        {profile.linkedInProfile && (
                            <div className="user-detail-item">
                                <dt>LinkedIn</dt>
                                <dd><a href={profile.linkedInProfile} target="_blank" rel="noopener noreferrer">View Profile</a></dd>
                            </div>
                        )}
                    </dl>
                </section>

                {(profile.companyName || profile.companyType || profile.trigProjectTitle) && (
                    <section className="user-section">
                        <h2 className="user-section-title">Work</h2>
                        <dl className="user-detail-list">
                            {profile.companyName && (
                                <div className="user-detail-item">
                                    <dt>Company</dt>
                                    <dd>{profile.companyName}</dd>
                                </div>
                            )}
                            {profile.companyType && (
                                <div className="user-detail-item">
                                    <dt>Company Type</dt>
                                    <dd>{profile.companyType}</dd>
                                </div>
                            )}
                            {profile.trigProjectTitle && (
                                <div className="user-detail-item">
                                    <dt>TRIG Project</dt>
                                    <dd>{profile.trigProjectTitle}</dd>
                                </div>
                            )}
                            {profile.transportModesOfInterest && (
                                <div className="user-detail-item">
                                    <dt>Transport Modes</dt>
                                    <dd>{profile.transportModesOfInterest}</dd>
                                </div>
                            )}
                        </dl>
                    </section>
                )}

                {(user.adminSpaces.length > 0 || user.memberSpaces.length > 0) && (
                    <section className="user-section">
                        <h2 className="user-section-title">Spaces</h2>
                        {user.adminSpaces.length > 0 && (
                            <div className="user-spaces-group">
                                <h3 className="user-spaces-label">Admin of</h3>
                                <ul className="user-spaces-list">
                                    {user.adminSpaces.map(space => (
                                        <li key={space.id}>
                                            <Link href={`/spaces/${space.id}`}>{space.title}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {user.memberSpaces.length > 0 && (
                            <div className="user-spaces-group">
                                <h3 className="user-spaces-label">Member of</h3>
                                <ul className="user-spaces-list">
                                    {user.memberSpaces.map(space => (
                                        <li key={space.id}>
                                            <Link href={`/spaces/${space.id}`}>{space.title}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </main>
    );
}
