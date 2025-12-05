'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useJobForgeStats, useJobs } from '@/lib/jobforge/hooks';
import { JobStatusBadge } from '@/components/ui/JobForge';
import { Icon } from '@/components/ui/Icon';
import styles from './jobforge.module.scss';

export default function JobForgePage() {
  const router = useRouter();
  const { stats, isLoading: statsLoading } = useJobForgeStats();
  const { jobs, isLoading: jobsLoading } = useJobs();

  // Get recent jobs (last 5)
  const recentJobs = jobs
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>JobForge</h1>
        <div className={styles.dashboardActions}>
          <button
            onClick={() => router.push('/jobforge/create-new')}
            className={styles.buttonPrimary}
          >
            <Icon icon="plus" size={18} />
            Create New Job
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.jobsCreated}</div>
          <div className={styles.statLabel}>Jobs Created</div>
          <div className={styles.statTrend}>
            <Icon icon="arrowUp" size={14} />
            <span>+12%</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.draftsCount}</div>
          <div className={styles.statLabel}>My Drafts</div>
          {stats.draftsCount > 0 && (
            <Link href="/jobforge/drafts" className={styles.statLink}>
              View all →
            </Link>
          )}
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.awaitingApprovalCount}</div>
          <div className={styles.statLabel}>Awaiting Approval</div>
          {stats.awaitingApprovalCount > 0 && (
            <Link href="/jobforge/approvals" className={styles.statLink}>
              View all →
            </Link>
          )}
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.thisWeek}</div>
          <div className={styles.statLabel}>This Week</div>
          <div className={styles.statTrend}>
            <Icon icon="arrowUp" size={14} />
            <span>+33%</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <Link href="/jobforge/drafts" className={styles.sectionLink}>
            View all →
          </Link>
        </div>

        <div className={styles.activityList}>
          {jobsLoading ? (
            <div className={styles.loading}>Loading...</div>
          ) : recentJobs.length === 0 ? (
            <div className={styles.empty}>
              <Icon icon="briefcase" size={48} />
              <p>No jobs yet</p>
              <button
                onClick={() => router.push('/jobforge/create-new')}
                className={styles.buttonSecondary}
              >
                Create your first job
              </button>
            </div>
          ) : (
            recentJobs.map((job) => (
              <div key={job.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <Icon icon="briefcase" size={18} />
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityTitle}>
                    <Link href={`/jobforge/edit/${job.id}`} className={styles.activityLink}>
                      {job.title}
                    </Link>
                    <JobStatusBadge status={job.status} />
                  </div>
                  <div className={styles.activityMeta}>
                    {job.location.city} • {job.salary.currency} {job.salary.min.toLocaleString()}-
                    {job.salary.max.toLocaleString()} • {formatTimeAgo(job.updatedAt)}
                  </div>
                </div>
                <div className={styles.activityActions}>
                  <button
                    onClick={() => router.push(`/jobforge/edit/${job.id}`)}
                    className={styles.iconButton}
                    aria-label="Edit job"
                  >
                    <Icon icon="edit" size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.quickActions}>
          <button
            onClick={() => router.push('/jobforge/create-new')}
            className={styles.quickAction}
          >
            <Icon icon="copy" size={24} />
            <span>Clone Last Job</span>
          </button>
          <button
            onClick={() => router.push('/jobforge/templates')}
            className={styles.quickAction}
          >
            <Icon icon="book" size={24} />
            <span>Use Template</span>
          </button>
          <button
            onClick={() => router.push('/jobforge/create-new')}
            className={styles.quickAction}
          >
            <Icon icon="mail" size={24} />
            <span>Import from Email</span>
          </button>
        </div>
      </div>
    </div>
  );
}
