'use client';

import { useState } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  User,
  FileText,
  Calendar,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import styles from './AppealsQueue.module.scss';

type AppealStatus = 'pending' | 'approved' | 'rejected';
type AppealType = 'post_removal' | 'comment_removal' | 'account_warning' | 'account_ban';

interface TimelineEvent {
  id: string;
  type: 'flagged' | 'removed' | 'appealed' | 'reviewed' | 'decision';
  actor: string;
  timestamp: string;
  details: string;
}

interface Appeal {
  id: string;
  type: AppealType;
  status: AppealStatus;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  originalContent: {
    id: string;
    type: string;
    title: string;
    excerpt: string;
  };
  moderationAction: {
    type: string;
    reason: string;
    moderator: string;
    timestamp: string;
  };
  appealReason: string;
  appealDetails: string;
  submittedAt: string;
  timeline: TimelineEvent[];
}

// Dummy data
const appeals: Appeal[] = [
  {
    id: 'app1',
    type: 'comment_removal',
    status: 'pending',
    user: {
      id: 'u1',
      name: 'Alex Thompson',
      email: 'alex@example.com',
    },
    originalContent: {
      id: 'c123',
      type: 'comment',
      title: 'Comment on "Community Guidelines Discussion"',
      excerpt: 'I strongly disagree with this approach. We need to reconsider...',
    },
    moderationAction: {
      type: 'Removed',
      reason: 'Hostile tone',
      moderator: 'Sarah Johnson',
      timestamp: '2025-12-18 14:30',
    },
    appealReason: 'I believe my comment was constructive criticism',
    appealDetails: 'I was providing critical feedback on the proposed guidelines, not attacking anyone personally. My language may have been strong, but it was meant to emphasize important points about community governance. I\'ve been an active member for 2 years and have never violated community standards before.',
    submittedAt: '2025-12-18 16:45',
    timeline: [
      {
        id: 't1',
        type: 'flagged',
        actor: '5 community members',
        timestamp: '2025-12-18 14:15',
        details: 'Content flagged for hostile tone',
      },
      {
        id: 't2',
        type: 'removed',
        actor: 'Sarah Johnson',
        timestamp: '2025-12-18 14:30',
        details: 'Comment removed after review',
      },
      {
        id: 't3',
        type: 'appealed',
        actor: 'Alex Thompson',
        timestamp: '2025-12-18 16:45',
        details: 'User submitted appeal',
      },
    ],
  },
  {
    id: 'app2',
    type: 'post_removal',
    status: 'pending',
    user: {
      id: 'u2',
      name: 'Maria Garcia',
      email: 'maria@example.com',
    },
    originalContent: {
      id: 'p456',
      type: 'post',
      title: 'Check out this amazing productivity tool!',
      excerpt: 'I recently discovered TaskMaster Pro and it changed my workflow...',
    },
    moderationAction: {
      type: 'Auto-removed',
      reason: 'Spam pattern detected',
      moderator: 'Auto-moderation system',
      timestamp: '2025-12-19 09:15',
    },
    appealReason: 'This was not spam - I was genuinely sharing a helpful tool',
    appealDetails: 'I was sharing a productivity tool that I personally use and find valuable for project management. I included a link because people asked me about it in another discussion. I\'m not affiliated with the company and receive no benefit from sharing this.',
    submittedAt: '2025-12-19 10:30',
    timeline: [
      {
        id: 't1',
        type: 'flagged',
        actor: 'Auto-moderation',
        timestamp: '2025-12-19 09:15',
        details: 'Triggered "Block Obvious Spam" rule',
      },
      {
        id: 't2',
        type: 'removed',
        actor: 'System',
        timestamp: '2025-12-19 09:15',
        details: 'Post auto-removed',
      },
      {
        id: 't3',
        type: 'appealed',
        actor: 'Maria Garcia',
        timestamp: '2025-12-19 10:30',
        details: 'User submitted appeal',
      },
    ],
  },
  {
    id: 'app3',
    type: 'account_warning',
    status: 'approved',
    user: {
      id: 'u3',
      name: 'John Smith',
      email: 'john@example.com',
    },
    originalContent: {
      id: 'warn1',
      type: 'warning',
      title: 'Warning for repeated negative comments',
      excerpt: 'You have received 3 flags in the past week',
    },
    moderationAction: {
      type: 'Warning issued',
      reason: 'Pattern of negative engagement',
      moderator: 'Michael Chen',
      timestamp: '2025-12-15 11:20',
    },
    appealReason: 'I was misunderstood - my intent was to help',
    appealDetails: 'I realize my comments came across as negative, but I was trying to help improve discussions by pointing out logical inconsistencies. I\'ve adjusted my communication style and will focus on being more constructive going forward.',
    submittedAt: '2025-12-15 14:00',
    timeline: [
      {
        id: 't1',
        type: 'flagged',
        actor: 'Multiple users',
        timestamp: '2025-12-15 10:00',
        details: 'Pattern of negative comments detected',
      },
      {
        id: 't2',
        type: 'reviewed',
        actor: 'Michael Chen',
        timestamp: '2025-12-15 11:20',
        details: 'Moderator reviewed user history',
      },
      {
        id: 't3',
        type: 'removed',
        actor: 'Michael Chen',
        timestamp: '2025-12-15 11:20',
        details: 'Warning issued',
      },
      {
        id: 't4',
        type: 'appealed',
        actor: 'John Smith',
        timestamp: '2025-12-15 14:00',
        details: 'User submitted appeal',
      },
      {
        id: 't5',
        type: 'decision',
        actor: 'Sarah Johnson',
        timestamp: '2025-12-16 09:30',
        details: 'Appeal approved - warning removed',
      },
    ],
  },
];

function AppealCard({ appeal, onDecision }: { appeal: Appeal; onDecision: (id: string, decision: 'approve' | 'reject') => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = () => {
    switch (appeal.status) {
      case 'pending':
        return (
          <span className={`${styles.statusBadge} ${styles.pending}`}>
            <Clock />
            Pending Review
          </span>
        );
      case 'approved':
        return (
          <span className={`${styles.statusBadge} ${styles.approved}`}>
            <CheckCircle2 />
            Appeal Approved
          </span>
        );
      case 'rejected':
        return (
          <span className={`${styles.statusBadge} ${styles.rejected}`}>
            <XCircle />
            Appeal Rejected
          </span>
        );
    }
  };

  const getTypeLabel = (type: AppealType): string => {
    const labels: Record<AppealType, string> = {
      post_removal: 'Post Removal',
      comment_removal: 'Comment Removal',
      account_warning: 'Account Warning',
      account_ban: 'Account Ban',
    };
    return labels[type];
  };

  const getTimelineIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'flagged': return <AlertCircle />;
      case 'removed': return <XCircle />;
      case 'appealed': return <MessageSquare />;
      case 'reviewed': return <Shield />;
      case 'decision': return <CheckCircle2 />;
    }
  };

  return (
    <div className={`${styles.appealCard} ${styles[appeal.status]}`}>
      {/* Header */}
      <div className={styles.appealHeader}>
        <div className={styles.appealMeta}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {appeal.user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className={styles.userName}>{appeal.user.name}</h3>
              <p className={styles.userEmail}>{appeal.user.email}</p>
            </div>
          </div>
          <div className={styles.appealInfo}>
            <span className={styles.appealType}>{getTypeLabel(appeal.type)}</span>
            <span className={styles.appealDate}>
              <Calendar className={styles.dateIcon} />
              {appeal.submittedAt}
            </span>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Original Content */}
      <div className={styles.contentSection}>
        <h4 className={styles.sectionTitle}>Original Content</h4>
        <div className={styles.contentPreview}>
          <div className={styles.contentHeader}>
            <FileText className={styles.contentIcon} />
            <span className={styles.contentTitle}>{appeal.originalContent.title}</span>
          </div>
          <p className={styles.contentExcerpt}>{appeal.originalContent.excerpt}</p>
        </div>
      </div>

      {/* Moderation Action */}
      <div className={styles.actionSection}>
        <h4 className={styles.sectionTitle}>Moderation Action Taken</h4>
        <div className={styles.actionDetails}>
          <div className={styles.actionRow}>
            <span className={styles.actionLabel}>Action:</span>
            <span className={styles.actionValue}>{appeal.moderationAction.type}</span>
          </div>
          <div className={styles.actionRow}>
            <span className={styles.actionLabel}>Reason:</span>
            <span className={styles.actionValue}>{appeal.moderationAction.reason}</span>
          </div>
          <div className={styles.actionRow}>
            <span className={styles.actionLabel}>By:</span>
            <span className={styles.actionValue}>{appeal.moderationAction.moderator}</span>
          </div>
          <div className={styles.actionRow}>
            <span className={styles.actionLabel}>When:</span>
            <span className={styles.actionValue}>{appeal.moderationAction.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Appeal */}
      <div className={styles.appealSection}>
        <h4 className={styles.sectionTitle}>User's Appeal</h4>
        <div className={styles.appealContent}>
          <div className={styles.appealReason}>
            <strong>Reason:</strong> {appeal.appealReason}
          </div>
          <div className={styles.appealDetails}>
            {appeal.appealDetails}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className={styles.timelineSection}>
        <button
          className={styles.timelineToggle}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>View Timeline ({appeal.timeline.length} events)</span>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </button>

        {isExpanded && (
          <div className={styles.timeline}>
            {appeal.timeline.map((event, idx) => (
              <div key={event.id} className={styles.timelineEvent}>
                <div className={styles.timelineIcon}>
                  {getTimelineIcon(event.type)}
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <span className={styles.timelineActor}>{event.actor}</span>
                    <span className={styles.timelineTime}>{event.timestamp}</span>
                  </div>
                  <p className={styles.timelineDetails}>{event.details}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {appeal.status === 'pending' && (
        <div className={styles.appealActions}>
          <button
            className={`${styles.decisionButton} ${styles.approve}`}
            onClick={() => onDecision(appeal.id, 'approve')}
          >
            <CheckCircle2 />
            Approve Appeal
          </button>
          <button
            className={`${styles.decisionButton} ${styles.reject}`}
            onClick={() => onDecision(appeal.id, 'reject')}
          >
            <XCircle />
            Reject Appeal
          </button>
        </div>
      )}
    </div>
  );
}

export function AppealsQueue() {
  const [activeAppeals, setActiveAppeals] = useState(appeals);
  const [filter, setFilter] = useState<'all' | AppealStatus>('all');

  const handleDecision = (appealId: string, decision: 'approve' | 'reject') => {
    const newStatus: AppealStatus = decision === 'approve' ? 'approved' : 'rejected';
    setActiveAppeals(prev =>
      prev.map(appeal =>
        appeal.id === appealId
          ? { ...appeal, status: newStatus }
          : appeal
      )
    );
  };

  const filteredAppeals = activeAppeals.filter(appeal => {
    if (filter === 'all') return true;
    return appeal.status === filter;
  });

  const pendingCount = activeAppeals.filter(a => a.status === 'pending').length;
  const approvedCount = activeAppeals.filter(a => a.status === 'approved').length;
  const rejectedCount = activeAppeals.filter(a => a.status === 'rejected').length;

  return (
    <div className={styles.appealsQueue}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Appeals Queue</h1>
          <p>Review user appeals for moderation decisions</p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <Clock className={styles.statIcon} />
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Pending Appeals</div>
            <div className={styles.statValue}>{pendingCount}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <CheckCircle2 className={styles.statIcon} />
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Approved This Week</div>
            <div className={styles.statValue}>{approvedCount}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <XCircle className={styles.statIcon} />
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Rejected This Week</div>
            <div className={styles.statValue}>{rejectedCount}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <button
          className={filter === 'all' ? styles.active : ''}
          onClick={() => setFilter('all')}
        >
          All Appeals ({activeAppeals.length})
        </button>
        <button
          className={filter === 'pending' ? styles.active : ''}
          onClick={() => setFilter('pending')}
        >
          Pending ({pendingCount})
        </button>
        <button
          className={filter === 'approved' ? styles.active : ''}
          onClick={() => setFilter('approved')}
        >
          Approved ({approvedCount})
        </button>
        <button
          className={filter === 'rejected' ? styles.active : ''}
          onClick={() => setFilter('rejected')}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* Appeals List */}
      <div className={styles.appealsList}>
        {filteredAppeals.length === 0 ? (
          <div className={styles.emptyState}>
            <MessageSquare className={styles.emptyIcon} />
            <h3>No appeals found</h3>
            <p>There are no appeals matching your current filter</p>
          </div>
        ) : (
          filteredAppeals.map(appeal => (
            <AppealCard
              key={appeal.id}
              appeal={appeal}
              onDecision={handleDecision}
            />
          ))
        )}
      </div>
    </div>
  );
}
