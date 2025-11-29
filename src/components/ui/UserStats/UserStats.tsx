'use client';

import styles from './UserStats.module.scss';

interface UserStatsProps {
    totalUsers: number;
    newThisWeek: number;
    activeSpaces: number;
    isLoading?: boolean;
}

export function UserStats({ totalUsers, newThisWeek, activeSpaces, isLoading }: UserStatsProps) {
    if (isLoading) {
        return (
            <div className={styles.card}>
                <div className={styles.loading}>
                    <p>Loading stats...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>Community Stats</h2>
            <div className={styles.content}>
                <div className={styles.item}>
                    <div className={styles.value}>{totalUsers.toLocaleString()}</div>
                    <div className={styles.label}>Total Members</div>
                </div>
                <div className={styles.divider} />
                <div className={styles.item}>
                    <div className={`${styles.value} ${styles.highlight}`}>{newThisWeek}</div>
                    <div className={styles.label}>New This Week</div>
                </div>
                <div className={styles.divider} />
                <div className={styles.item}>
                    <div className={styles.value}>{activeSpaces}</div>
                    <div className={styles.label}>Active Spaces</div>
                </div>
            </div>
        </div>
    );
}
