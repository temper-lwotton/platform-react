'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useJobs, useDeleteJob } from '@/lib/jobforge/hooks';
import { JobStatusBadge, QualityScoreCard } from '@/components/ui/JobForge';
import { Icon } from '@/components/ui/Icon';
import styles from '../jobforge.module.scss';

export default function DraftsPage() {
  const router = useRouter();
  const { jobs, isLoading } = useJobs();
  const { deleteJob } = useDeleteJob();

  // Filter for drafts only
  const drafts = jobs.filter(j => j.status === 'draft');

  const handleDelete = async (jobId: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteJob(jobId);
      window.location.reload(); // Simple refresh
    }
  };

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
        <div>
          <h1 className={styles.dashboardTitle}>My Drafts</h1>
          <p className={styles.composerSubtitle}>
            {drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'}
          </p>
        </div>
        <button
          onClick={() => router.push('/jobforge/create')}
          className={styles.buttonPrimary}
        >
          <Icon icon="plus" size={18} />
          Create New Job
        </button>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Loading drafts...</div>
      ) : drafts.length === 0 ? (
        <div className={styles.section}>
          <div className={styles.empty}>
            <Icon icon="briefcase" size={48} />
            <p>No drafts yet</p>
            <button
              onClick={() => router.push('/jobforge/create')}
              className={styles.buttonSecondary}
            >
              Create your first job
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.draftsGrid}>
          {drafts.map((draft) => (
            <div key={draft.id} className={styles.draftCard}>
              <div className={styles.draftCardHeader}>
                <div>
                  <Link href={`/jobforge/edit/${draft.id}`} className={styles.draftTitle}>
                    {draft.title || 'Untitled Job'}
                  </Link>
                  <JobStatusBadge status={draft.status} />
                </div>
                <div className={styles.draftCardActions}>
                  <button
                    onClick={() => router.push(`/jobforge/edit/${draft.id}`)}
                    className={styles.iconButton}
                    aria-label="Edit"
                  >
                    <Icon icon="edit" size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(draft.id, draft.title)}
                    className={styles.iconButton}
                    aria-label="Delete"
                  >
                    <Icon icon="trash" size={16} />
                  </button>
                </div>
              </div>

              <div className={styles.draftCardMeta}>
                <span>{draft.industry || 'No industry'}</span>
                <span>•</span>
                <span>{draft.location.city || 'No location'}</span>
                <span>•</span>
                <span>
                  {draft.salary.currency} {draft.salary.min.toLocaleString()}-
                  {draft.salary.max.toLocaleString()}
                </span>
              </div>

              <div className={styles.draftCardStatus}>
                <div className={styles.statusBadge}>
                  <Icon icon={draft.validationStatus.overall === 'valid' ? 'check' : 'info'} size={14} />
                  <span>
                    {draft.validationStatus.requiredFields.completed}/
                    {draft.validationStatus.requiredFields.total} required fields
                  </span>
                </div>
                <div className={styles.statusBadge}>
                  <Icon icon="star" size={14} />
                  <span>Quality: {draft.qualityMetrics.overallScore}%</span>
                </div>
              </div>

              <div className={styles.draftCardFooter}>
                <span className={styles.draftCardDate}>
                  Last edited: {formatTimeAgo(draft.updatedAt)}
                </span>
                <button
                  onClick={() => router.push(`/jobforge/edit/${draft.id}`)}
                  className={styles.buttonSecondary}
                >
                  Continue Editing
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
