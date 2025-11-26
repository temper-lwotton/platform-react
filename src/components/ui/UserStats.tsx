'use client';

interface UserStatsProps {
    totalUsers: number;
    newThisWeek: number;
    activeSpaces: number;
    isLoading?: boolean;
}

export function UserStats({ totalUsers, newThisWeek, activeSpaces, isLoading }: UserStatsProps) {
    if (isLoading) {
        return (
            <div className="user-stats-card">
                <div className="user-stats-loading">
                    <p>Loading stats...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-stats-card">
            <h2 className="user-stats-title">Community Stats</h2>
            <div className="user-stats-content">
                <div className="user-stats-item">
                    <div className="user-stats-value">{totalUsers.toLocaleString()}</div>
                    <div className="user-stats-label">Total Members</div>
                </div>
                <div className="user-stats-divider" />
                <div className="user-stats-item">
                    <div className="user-stats-value user-stats-value-highlight">{newThisWeek}</div>
                    <div className="user-stats-label">New This Week</div>
                </div>
                <div className="user-stats-divider" />
                <div className="user-stats-item">
                    <div className="user-stats-value">{activeSpaces}</div>
                    <div className="user-stats-label">Active Spaces</div>
                </div>
            </div>
        </div>
    );
}
