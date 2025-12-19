'use client';

import { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  Flag,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  FileText,
  User,
  Image as ImageIcon,
  Clock,
  TrendingUp,
  Zap,
  Brain,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Ban,
  Trash2,
  Archive,
} from 'lucide-react';
import styles from './ModerationQueue.module.scss';

type ContentType = 'post' | 'comment' | 'user' | 'media';
type Priority = 'urgent' | 'high' | 'medium' | 'low';
type Status = 'pending' | 'approved' | 'rejected';

interface AIInsight {
  score: number;
  reasoning: string;
  suggestedAction: 'approve' | 'reject' | 'review';
  confidence: 'high' | 'medium' | 'low';
  flags: string[];
}

interface UserContext {
  userId: string;
  username: string;
  joinDate: string;
  totalPosts: number;
  previousFlags: number;
  reputation: number;
  isNewUser: boolean;
}

interface ModerationItem {
  id: string;
  type: ContentType;
  priority: Priority;
  title: string;
  content: string;
  author: UserContext;
  flaggedBy: number;
  flagReasons: string[];
  aiInsight: AIInsight;
  timestamp: string;
  relatedThread?: string;
  similarPastDecisions?: number;
}

// Dummy data
const moderationItems: ModerationItem[] = [
  {
    id: '1',
    type: 'comment',
    priority: 'urgent',
    title: 'Comment on "How to improve our community guidelines"',
    content: 'This is absolutely ridiculous. You people have no idea what you\'re doing. I\'ve seen better moderation in a kindergarten.',
    author: {
      userId: 'u123',
      username: 'angryuser99',
      joinDate: '2025-12-15',
      totalPosts: 3,
      previousFlags: 2,
      reputation: 15,
      isNewUser: true,
    },
    flaggedBy: 5,
    flagReasons: ['Hostile tone', 'Unconstructive criticism', 'Personal attack'],
    aiInsight: {
      score: 0.78,
      reasoning: 'High toxicity score detected. Language is hostile and unconstructive. However, no profanity or direct threats. User appears frustrated rather than malicious.',
      suggestedAction: 'review',
      confidence: 'high',
      flags: ['Toxic language', 'Dismissive tone', 'Pattern: 3rd negative comment'],
    },
    timestamp: '2 minutes ago',
    relatedThread: 'Community Guidelines Discussion',
    similarPastDecisions: 3,
  },
  {
    id: '2',
    type: 'post',
    priority: 'high',
    title: 'MAKE $5000/WEEK WORKING FROM HOME!!!',
    content: 'Click here to learn the secret method that millionaires don\'t want you to know! Limited time offer! Visit: totally-legit-site.biz',
    author: {
      userId: 'u456',
      username: 'bizopportunity',
      joinDate: '2025-12-18',
      totalPosts: 8,
      previousFlags: 0,
      reputation: 5,
      isNewUser: true,
    },
    flaggedBy: 12,
    flagReasons: ['Spam', 'Promotional content', 'Suspicious link'],
    aiInsight: {
      score: 0.95,
      reasoning: 'Clear spam pattern detected: excessive capitalization, urgency tactics, suspicious external link, typical get-rich-quick language. User created 8 similar posts in past 24 hours.',
      suggestedAction: 'reject',
      confidence: 'high',
      flags: ['Spam keywords', 'External link', 'Pattern: 8 similar posts today', 'New user'],
    },
    timestamp: '15 minutes ago',
    similarPastDecisions: 47,
  },
  {
    id: '3',
    type: 'comment',
    priority: 'high',
    title: 'Comment on "What\'s your favorite local restaurant?"',
    content: 'I strongly disagree with the choices here. Most of these restaurants are overrated and overpriced. The real hidden gems are places like Mario\'s Bistro and The Garden Cafe.',
    author: {
      userId: 'u789',
      username: 'foodcritic_jane',
      joinDate: '2024-03-10',
      totalPosts: 234,
      previousFlags: 0,
      reputation: 892,
      isNewUser: false,
    },
    flaggedBy: 2,
    flagReasons: ['Negative tone'],
    aiInsight: {
      score: 0.22,
      reasoning: 'Low toxicity score. While language includes "disagree" and "overrated", this appears to be constructive criticism with alternative suggestions. User has strong positive history. Likely false flag.',
      suggestedAction: 'approve',
      confidence: 'high',
      flags: [],
    },
    timestamp: '1 hour ago',
    relatedThread: 'Local Food Recommendations',
    similarPastDecisions: 15,
  },
  {
    id: '4',
    type: 'user',
    priority: 'medium',
    title: 'User profile: suspicious_account_2024',
    content: 'Profile description contains multiple external links and promotional language. No profile picture. Created 20 posts in first 2 hours.',
    author: {
      userId: 'u999',
      username: 'suspicious_account_2024',
      joinDate: '2025-12-19',
      totalPosts: 20,
      previousFlags: 0,
      reputation: 0,
      isNewUser: true,
    },
    flaggedBy: 0,
    flagReasons: ['Auto-flagged: Suspicious activity pattern'],
    aiInsight: {
      score: 0.68,
      reasoning: 'Bot-like behavior detected: rapid posting, generic content, promotional links in bio. Recommend monitoring or temporary restriction.',
      suggestedAction: 'review',
      confidence: 'medium',
      flags: ['Rapid posting', 'New account', 'Promotional bio', 'No profile picture'],
    },
    timestamp: '3 hours ago',
    similarPastDecisions: 8,
  },
  {
    id: '5',
    type: 'media',
    priority: 'low',
    title: 'Image upload: potentially inappropriate content',
    content: 'Image flagged by AI for potentially sensitive content. Manual review recommended.',
    author: {
      userId: 'u555',
      username: 'regular_member',
      joinDate: '2024-08-20',
      totalPosts: 89,
      previousFlags: 0,
      reputation: 450,
      isNewUser: false,
    },
    flaggedBy: 0,
    flagReasons: ['Auto-flagged: AI content detection'],
    aiInsight: {
      score: 0.35,
      reasoning: 'Image contains partial nudity (artistic context possible). User has clean history. Likely false positive from conservative AI filter.',
      suggestedAction: 'review',
      confidence: 'low',
      flags: ['Potential sensitive content'],
    },
    timestamp: '5 hours ago',
    similarPastDecisions: 12,
  },
];

const stats = {
  pending: 18,
  autoHandledToday: 47,
  avgResponseTime: '12 minutes',
  accuracy: '94%',
};

function ModerationItemCard({ item, onAction }: { item: ModerationItem; onAction: (action: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeIcon = () => {
    switch (item.type) {
      case 'post': return FileText;
      case 'comment': return MessageSquare;
      case 'user': return User;
      case 'media': return ImageIcon;
    }
  };

  const TypeIcon = getTypeIcon();

  return (
    <div className={`${styles.moderationItem} ${styles[item.priority]}`}>
      {/* Header */}
      <div className={styles.itemHeader}>
        <div className={styles.itemMeta}>
          <div className={styles.typeIcon}>
            <TypeIcon />
          </div>
          <div className={styles.itemInfo}>
            <h3 className={styles.itemTitle}>{item.title}</h3>
            <div className={styles.itemDetails}>
              <span className={styles.author}>@{item.author.username}</span>
              <span className={styles.separator}>•</span>
              <span className={styles.timestamp}>{item.timestamp}</span>
              {item.flaggedBy > 0 && (
                <>
                  <span className={styles.separator}>•</span>
                  <span className={styles.flagCount}>
                    <Flag className={styles.flagIcon} />
                    {item.flaggedBy} {item.flaggedBy === 1 ? 'flag' : 'flags'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={styles.itemActions}>
          <span className={`${styles.priorityBadge} ${styles[item.priority]}`}>
            {item.priority}
          </span>
          <button
            className={styles.expandButton}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <div className={styles.contentPreview}>
        <p>{item.content}</p>
      </div>

      {/* AI Insight Bar */}
      <div className={`${styles.aiInsightBar} ${styles[item.aiInsight.suggestedAction]}`}>
        <div className={styles.aiHeader}>
          <Brain className={styles.aiIcon} />
          <span className={styles.aiLabel}>AI Assistant</span>
          <span className={`${styles.confidence} ${styles[item.aiInsight.confidence]}`}>
            {item.aiInsight.confidence} confidence
          </span>
        </div>
        <p className={styles.aiReasoning}>{item.aiInsight.reasoning}</p>
        {item.aiInsight.flags.length > 0 && (
          <div className={styles.aiFlags}>
            {item.aiInsight.flags.map((flag, idx) => (
              <span key={idx} className={styles.aiFlag}>{flag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Expanded Context */}
      {isExpanded && (
        <div className={styles.expandedContext}>
          {/* User Context */}
          <div className={styles.contextSection}>
            <h4>User Context</h4>
            <div className={styles.contextGrid}>
              <div className={styles.contextItem}>
                <span className={styles.contextLabel}>Member since</span>
                <span className={styles.contextValue}>{item.author.joinDate}</span>
              </div>
              <div className={styles.contextItem}>
                <span className={styles.contextLabel}>Total posts</span>
                <span className={styles.contextValue}>{item.author.totalPosts}</span>
              </div>
              <div className={styles.contextItem}>
                <span className={styles.contextLabel}>Previous flags</span>
                <span className={styles.contextValue}>{item.author.previousFlags}</span>
              </div>
              <div className={styles.contextItem}>
                <span className={styles.contextLabel}>Reputation</span>
                <span className={styles.contextValue}>{item.author.reputation}</span>
              </div>
            </div>
            {item.author.isNewUser && (
              <div className={styles.warningBanner}>
                <AlertCircle className={styles.warningIcon} />
                <span>This is a new user (joined within last 7 days)</span>
              </div>
            )}
          </div>

          {/* Flag Reasons */}
          <div className={styles.contextSection}>
            <h4>Flag Reasons</h4>
            <div className={styles.flagReasons}>
              {item.flagReasons.map((reason, idx) => (
                <span key={idx} className={styles.flagReason}>{reason}</span>
              ))}
            </div>
          </div>

          {/* Similar Past Decisions */}
          {item.similarPastDecisions && item.similarPastDecisions > 0 && (
            <div className={styles.contextSection}>
              <h4>Similar Past Cases</h4>
              <p className={styles.similarCases}>
                You've reviewed {item.similarPastDecisions} similar {item.similarPastDecisions === 1 ? 'case' : 'cases'} in the past
                <button className={styles.linkButton}>View history</button>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <button
          className={`${styles.actionBtn} ${styles.approve}`}
          onClick={() => onAction('approve')}
        >
          <CheckCircle2 />
          Approve
        </button>
        <button
          className={`${styles.actionBtn} ${styles.reject}`}
          onClick={() => onAction('reject')}
        >
          <XCircle />
          Reject
        </button>
        <button
          className={`${styles.actionBtn} ${styles.warn}`}
          onClick={() => onAction('warn')}
        >
          <AlertTriangle />
          Warn User
        </button>
        <button
          className={`${styles.actionBtn} ${styles.ban}`}
          onClick={() => onAction('ban')}
        >
          <Ban />
          Ban User
        </button>
        <button
          className={`${styles.actionBtn} ${styles.more}`}
          onClick={() => onAction('more')}
        >
          <MoreHorizontal />
        </button>
      </div>
    </div>
  );
}

export function ModerationQueue() {
  const [filter, setFilter] = useState<'all' | Priority>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | ContentType>('all');

  const filteredItems = moderationItems.filter(item => {
    if (filter !== 'all' && item.priority !== filter) return false;
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    return true;
  });

  const handleAction = (itemId: string, action: string) => {
    console.log(`Action ${action} on item ${itemId}`);
    // In real implementation, this would call an API
  };

  return (
    <div className={styles.moderationQueue}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Community Moderation</h1>
          <p>AI-assisted content review and community safety</p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Clock />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Pending Review</div>
            <div className={styles.statValue}>{stats.pending}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Zap />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Auto-Handled Today</div>
            <div className={styles.statValue}>{stats.autoHandledToday}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Avg Response Time</div>
            <div className={styles.statValue}>{stats.avgResponseTime}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CheckCircle2 />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Accuracy Rate</div>
            <div className={styles.statValue}>{stats.accuracy}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Priority</label>
          <div className={styles.filterButtons}>
            <button
              className={filter === 'all' ? styles.active : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={filter === 'urgent' ? styles.active : ''}
              onClick={() => setFilter('urgent')}
            >
              Urgent ({moderationItems.filter(i => i.priority === 'urgent').length})
            </button>
            <button
              className={filter === 'high' ? styles.active : ''}
              onClick={() => setFilter('high')}
            >
              High ({moderationItems.filter(i => i.priority === 'high').length})
            </button>
            <button
              className={filter === 'medium' ? styles.active : ''}
              onClick={() => setFilter('medium')}
            >
              Medium ({moderationItems.filter(i => i.priority === 'medium').length})
            </button>
            <button
              className={filter === 'low' ? styles.active : ''}
              onClick={() => setFilter('low')}
            >
              Low ({moderationItems.filter(i => i.priority === 'low').length})
            </button>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label>Content Type</label>
          <div className={styles.filterButtons}>
            <button
              className={typeFilter === 'all' ? styles.active : ''}
              onClick={() => setTypeFilter('all')}
            >
              All
            </button>
            <button
              className={typeFilter === 'post' ? styles.active : ''}
              onClick={() => setTypeFilter('post')}
            >
              Posts
            </button>
            <button
              className={typeFilter === 'comment' ? styles.active : ''}
              onClick={() => setTypeFilter('comment')}
            >
              Comments
            </button>
            <button
              className={typeFilter === 'user' ? styles.active : ''}
              onClick={() => setTypeFilter('user')}
            >
              Users
            </button>
            <button
              className={typeFilter === 'media' ? styles.active : ''}
              onClick={() => setTypeFilter('media')}
            >
              Media
            </button>
          </div>
        </div>
      </div>

      {/* Queue */}
      <div className={styles.queue}>
        {filteredItems.length === 0 ? (
          <div className={styles.emptyState}>
            <Shield className={styles.emptyIcon} />
            <h3>All clear!</h3>
            <p>No items in the moderation queue match your filters</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <ModerationItemCard
              key={item.id}
              item={item}
              onAction={(action) => handleAction(item.id, action)}
            />
          ))
        )}
      </div>
    </div>
  );
}
