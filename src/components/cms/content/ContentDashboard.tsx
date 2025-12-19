'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  AlertTriangle,
  Calendar,
  Eye,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  MoreVertical,
  Sparkles,
  Users,
  Heart,
  Share2,
  Flag,
  Filter,
  Search,
} from 'lucide-react';
import styles from './ContentDashboard.module.scss';

interface Post {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  status: 'published' | 'pending' | 'scheduled' | 'draft' | 'flagged';
  publishedAt?: string;
  scheduledFor?: string;
  views: number;
  comments: number;
  likes: number;
  aiFlags?: {
    type: 'spam' | 'inappropriate' | 'toxicity' | 'quality';
    confidence: number;
    reason: string;
  }[];
  category: string;
}

interface AIInsight {
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  action?: string;
  count?: number;
}

export function ContentDashboard() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy data
  const stats = {
    totalPosts: 1247,
    pendingModeration: 8,
    scheduled: 12,
    drafts: 23,
    avgViews: 342,
    avgEngagement: 12.4,
    flaggedByAI: 5,
  };

  const aiInsights: AIInsight[] = [
    {
      type: 'warning',
      title: 'Content Requiring Review',
      description: '5 posts have been flagged by AI for potential policy violations',
      action: 'Review Now',
      count: 5,
    },
    {
      type: 'success',
      title: 'High Quality Content Detected',
      description: '12 posts this week exceed your quality threshold and are ready to feature',
      action: 'View Posts',
      count: 12,
    },
    {
      type: 'info',
      title: 'Optimal Posting Time',
      description: 'Your community is most active on Wednesdays at 2-4 PM',
      action: 'Schedule Posts',
    },
    {
      type: 'warning',
      title: 'Duplicate Content Found',
      description: '3 posts appear to be duplicates or very similar to existing content',
      action: 'Review',
      count: 3,
    },
  ];

  const posts: Post[] = [
    {
      id: '1',
      title: 'Introducing our new community guidelines',
      author: { name: 'Sarah Johnson', avatar: 'SJ' },
      status: 'published',
      publishedAt: '2024-03-15T10:30:00',
      views: 1243,
      comments: 45,
      likes: 89,
      category: 'Announcements',
    },
    {
      id: '2',
      title: 'Best practices for engaging with members',
      author: { name: 'Mike Chen', avatar: 'MC' },
      status: 'scheduled',
      scheduledFor: '2024-03-20T14:00:00',
      views: 0,
      comments: 0,
      likes: 0,
      category: 'Guides',
    },
    {
      id: '3',
      title: 'Check out this amazing deal!!!',
      author: { name: 'Spam User', avatar: 'SU' },
      status: 'flagged',
      publishedAt: '2024-03-16T08:15:00',
      views: 23,
      comments: 2,
      likes: 1,
      aiFlags: [
        {
          type: 'spam',
          confidence: 0.89,
          reason: 'Excessive punctuation, promotional language, and external links detected',
        },
      ],
      category: 'General',
    },
    {
      id: '4',
      title: 'Weekly community highlights - March',
      author: { name: 'Admin Team', avatar: 'AT' },
      status: 'draft',
      views: 0,
      comments: 0,
      likes: 0,
      category: 'Updates',
    },
    {
      id: '5',
      title: 'How to maximize your profile visibility',
      author: { name: 'Emma Davis', avatar: 'ED' },
      status: 'published',
      publishedAt: '2024-03-14T16:20:00',
      views: 892,
      comments: 34,
      likes: 67,
      category: 'Tips',
    },
    {
      id: '6',
      title: 'This community sucks and everyone here is terrible',
      author: { name: 'Toxic User', avatar: 'TU' },
      status: 'flagged',
      publishedAt: '2024-03-16T11:45:00',
      views: 156,
      comments: 12,
      likes: 3,
      aiFlags: [
        {
          type: 'toxicity',
          confidence: 0.94,
          reason: 'High toxicity score detected. Contains hostile language and personal attacks',
        },
        {
          type: 'inappropriate',
          confidence: 0.76,
          reason: 'Violates community guidelines on respectful discourse',
        },
      ],
      category: 'General',
    },
  ];

  const getStatusColor = (status: Post['status']) => {
    switch (status) {
      case 'published':
        return styles.statusPublished;
      case 'pending':
        return styles.statusPending;
      case 'scheduled':
        return styles.statusScheduled;
      case 'draft':
        return styles.statusDraft;
      case 'flagged':
        return styles.statusFlagged;
      default:
        return '';
    }
  };

  const getStatusIcon = (status: Post['status']) => {
    switch (status) {
      case 'published':
        return <CheckCircle />;
      case 'pending':
        return <Clock />;
      case 'scheduled':
        return <Calendar />;
      case 'draft':
        return <Edit />;
      case 'flagged':
        return <Flag />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (selectedFilter !== 'all' && post.status !== selectedFilter) {
      return false;
    }
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>Content Management</h1>
            <p>Manage posts, moderate content, and schedule publications</p>
          </div>
          <button
            onClick={() => router.push('/admin/content/new')}
            className={styles.primaryButton}
          >
            <FileText />
            Create Post
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FileText />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalPosts.toLocaleString()}</div>
            <div className={styles.statLabel}>Total Posts</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statIcon}>
            <AlertTriangle />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.pendingModeration}</div>
            <div className={styles.statLabel}>Pending Moderation</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Calendar />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.scheduled}</div>
            <div className={styles.statLabel}>Scheduled</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Edit />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.drafts}</div>
            <div className={styles.statLabel}>Drafts</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Eye />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.avgViews}</div>
            <div className={styles.statLabel}>Avg. Views</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.danger}`}>
          <div className={styles.statIcon}>
            <Flag />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.flaggedByAI}</div>
            <div className={styles.statLabel}>Flagged by AI</div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className={styles.aiInsights}>
        <div className={styles.aiInsightsHeader}>
          <div className={styles.aiInsightsTitle}>
            <Sparkles />
            <h2>AI-Powered Insights</h2>
          </div>
          <p>Intelligent recommendations to optimize your content strategy</p>
        </div>

        <div className={styles.insightsGrid}>
          {aiInsights.map((insight, index) => (
            <div key={index} className={`${styles.insightCard} ${styles[insight.type]}`}>
              <div className={styles.insightHeader}>
                <div className={styles.insightTitle}>
                  {insight.count && <span className={styles.insightBadge}>{insight.count}</span>}
                  <h3>{insight.title}</h3>
                </div>
                {insight.type === 'warning' && <AlertTriangle />}
                {insight.type === 'success' && <CheckCircle />}
                {insight.type === 'info' && <Sparkles />}
              </div>
              <p>{insight.description}</p>
              {insight.action && (
                <button className={styles.insightAction}>{insight.action}</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content List */}
      <div className={styles.contentSection}>
        <div className={styles.contentHeader}>
          <h2>All Content</h2>
          <div className={styles.contentControls}>
            <div className={styles.searchBox}>
              <Search />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className={styles.filterTabs}>
              <button
                className={selectedFilter === 'all' ? styles.active : ''}
                onClick={() => setSelectedFilter('all')}
              >
                All
              </button>
              <button
                className={selectedFilter === 'published' ? styles.active : ''}
                onClick={() => setSelectedFilter('published')}
              >
                Published
              </button>
              <button
                className={selectedFilter === 'flagged' ? styles.active : ''}
                onClick={() => setSelectedFilter('flagged')}
              >
                Flagged
              </button>
              <button
                className={selectedFilter === 'scheduled' ? styles.active : ''}
                onClick={() => setSelectedFilter('scheduled')}
              >
                Scheduled
              </button>
              <button
                className={selectedFilter === 'draft' ? styles.active : ''}
                onClick={() => setSelectedFilter('draft')}
              >
                Drafts
              </button>
            </div>
          </div>
        </div>

        <div className={styles.postsList}>
          {filteredPosts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <div className={styles.postMain}>
                <div className={styles.postAuthor}>
                  <div className={styles.avatar}>{post.author.avatar}</div>
                  <div className={styles.authorInfo}>
                    <div className={styles.postTitle}>{post.title}</div>
                    <div className={styles.postMeta}>
                      <span>{post.author.name}</span>
                      <span>•</span>
                      <span>{post.category}</span>
                      {post.publishedAt && (
                        <>
                          <span>•</span>
                          <span>{formatDate(post.publishedAt)}</span>
                        </>
                      )}
                      {post.scheduledFor && (
                        <>
                          <span>•</span>
                          <span>Scheduled for {new Date(post.scheduledFor).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.postStats}>
                  <div className={styles.stat}>
                    <Eye />
                    <span>{post.views.toLocaleString()}</span>
                  </div>
                  <div className={styles.stat}>
                    <MessageSquare />
                    <span>{post.comments}</span>
                  </div>
                  <div className={styles.stat}>
                    <Heart />
                    <span>{post.likes}</span>
                  </div>
                </div>

                <div className={styles.postStatus}>
                  <div className={`${styles.statusBadge} ${getStatusColor(post.status)}`}>
                    {getStatusIcon(post.status)}
                    <span>{post.status}</span>
                  </div>
                </div>

                <div className={styles.postActions}>
                  <button title="Edit">
                    <Edit />
                  </button>
                  <button title="More actions">
                    <MoreVertical />
                  </button>
                </div>
              </div>

              {/* AI Flags */}
              {post.aiFlags && post.aiFlags.length > 0 && (
                <div className={styles.aiFlags}>
                  <div className={styles.aiFlagsHeader}>
                    <Sparkles />
                    <span>AI Moderation Flags</span>
                  </div>
                  {post.aiFlags.map((flag, index) => (
                    <div key={index} className={styles.aiFlag}>
                      <div className={styles.aiFlagHeader}>
                        <span className={styles.aiFlagType}>{flag.type}</span>
                        <span className={styles.aiFlagConfidence}>
                          {Math.round(flag.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className={styles.aiFlagReason}>{flag.reason}</p>
                    </div>
                  ))}
                  <div className={styles.aiFlagActions}>
                    <button className={styles.approveButton}>
                      <CheckCircle />
                      Approve
                    </button>
                    <button className={styles.rejectButton}>
                      <XCircle />
                      Remove
                    </button>
                    <button className={styles.reviewButton}>Review Details</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
