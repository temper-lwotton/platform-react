'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Send,
  Clock,
  FileText,
  Users,
  TrendingUp,
  Mail,
  Calendar,
  Sparkles,
  Eye,
  MousePointer,
  BarChart3,
  Edit,
  Copy,
  Trash2,
  PlayCircle,
} from 'lucide-react';
import styles from './BroadcastsDashboard.module.scss';

interface Campaign {
  id: string;
  title: string;
  subject: string;
  status: 'sent' | 'scheduled' | 'draft';
  audience: {
    segment: string;
    count: number;
  };
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
  stats?: {
    sent: number;
    opened: number;
    clicked: number;
    openRate: number;
    clickRate: number;
  };
}

interface AIInsight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation: string;
}

// Dummy data
const campaigns: Campaign[] = [
  {
    id: '1',
    title: 'Weekly Community Digest',
    subject: '🌟 This week\'s top discussions and updates',
    status: 'sent',
    audience: {
      segment: 'All Active Members',
      count: 1456,
    },
    sentAt: '2024-03-15T10:00:00',
    createdAt: '2024-03-14',
    stats: {
      sent: 1456,
      opened: 1124,
      clicked: 487,
      openRate: 77.2,
      clickRate: 33.4,
    },
  },
  {
    id: '2',
    title: 'Re-engagement Campaign',
    subject: 'We miss you! Here\'s what you\'ve been missing',
    status: 'sent',
    audience: {
      segment: 'At Risk Members',
      count: 198,
    },
    sentAt: '2024-03-14T14:30:00',
    createdAt: '2024-03-13',
    stats: {
      sent: 198,
      opened: 89,
      clicked: 34,
      openRate: 44.9,
      clickRate: 17.2,
    },
  },
  {
    id: '3',
    title: 'New Feature Announcement',
    subject: '🚀 Exciting new features just for you!',
    status: 'scheduled',
    audience: {
      segment: 'Power Users',
      count: 289,
    },
    scheduledFor: '2024-03-18T09:00:00',
    createdAt: '2024-03-15',
  },
  {
    id: '4',
    title: 'Welcome Series - Day 3',
    subject: 'Getting started: Your first post',
    status: 'scheduled',
    audience: {
      segment: 'New Members',
      count: 124,
    },
    scheduledFor: '2024-03-17T08:00:00',
    createdAt: '2024-03-14',
  },
  {
    id: '5',
    title: 'Monthly Newsletter',
    subject: 'March highlights and community achievements',
    status: 'draft',
    audience: {
      segment: 'All Members',
      count: 2847,
    },
    createdAt: '2024-03-15',
  },
];

const aiInsights: AIInsight[] = [
  {
    type: 'success',
    title: 'Optimal Send Time Detected',
    description: 'Your community is most active on Tuesdays and Thursdays between 9-11 AM.',
    recommendation: 'Schedule your next broadcast for Tuesday, March 19th at 10:00 AM for maximum engagement.',
  },
  {
    type: 'info',
    title: 'Subject Line Opportunity',
    description: 'Subject lines with emojis and questions have 23% higher open rates in your community.',
    recommendation: 'Try: "❓ What\'s your biggest challenge this week?" for your next campaign.',
  },
  {
    type: 'warning',
    title: 'Re-engagement Needed',
    description: '198 members haven\'t opened your last 3 emails. Their engagement is declining.',
    recommendation: 'Create a targeted campaign with exclusive content or a special offer to win them back.',
  },
];

export function BroadcastsDashboard() {
  const router = useRouter();
  const [selectedCampaigns] = useState<Campaign[]>(campaigns);

  const handleCreateCampaign = () => {
    router.push('/admin/broadcasts/new');
  };

  const handleViewCampaign = (id: string) => {
    router.push(`/admin/broadcasts/${id}`);
  };

  const handleEditCampaign = (id: string) => {
    router.push(`/admin/broadcasts/${id}/edit`);
  };

  const handleDuplicateCampaign = (id: string) => {
    console.log('Duplicating campaign:', id);
  };

  const handleDeleteCampaign = (id: string) => {
    console.log('Deleting campaign:', id);
  };

  const sentCampaigns = selectedCampaigns.filter(c => c.status === 'sent');
  const scheduledCampaigns = selectedCampaigns.filter(c => c.status === 'scheduled');
  const draftCampaigns = selectedCampaigns.filter(c => c.status === 'draft');
  const totalReach = selectedCampaigns.reduce((sum, c) => sum + c.audience.count, 0);

  const avgOpenRate = sentCampaigns.length > 0
    ? sentCampaigns.reduce((sum, c) => sum + (c.stats?.openRate || 0), 0) / sentCampaigns.length
    : 0;

  const avgClickRate = sentCampaigns.length > 0
    ? sentCampaigns.reduce((sum, c) => sum + (c.stats?.clickRate || 0), 0) / sentCampaigns.length
    : 0;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1>Broadcasts</h1>
          <p>Create and manage targeted communications to your community</p>
        </div>
        <button onClick={handleCreateCampaign} className={styles.createButton}>
          <Plus />
          Create Campaign
        </button>
      </div>

      {/* Stats Overview */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Send />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{sentCampaigns.length}</div>
            <div className={styles.statLabel}>Sent Campaigns</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Clock />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{scheduledCampaigns.length}</div>
            <div className={styles.statLabel}>Scheduled</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FileText />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{draftCampaigns.length}</div>
            <div className={styles.statLabel}>Drafts</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{totalReach.toLocaleString()}</div>
            <div className={styles.statLabel}>Total Reach</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {sentCampaigns.length > 0 && (
        <div className={styles.performance}>
          <h2>Performance Overview</h2>
          <div className={styles.performanceCards}>
            <div className={styles.performanceCard}>
              <div className={styles.performanceIcon}>
                <Eye />
              </div>
              <div className={styles.performanceContent}>
                <div className={styles.performanceValue}>{avgOpenRate.toFixed(1)}%</div>
                <div className={styles.performanceLabel}>Avg Open Rate</div>
                <div className={styles.performanceTrend}>
                  <TrendingUp />
                  <span>+5.2% vs last month</span>
                </div>
              </div>
            </div>
            <div className={styles.performanceCard}>
              <div className={styles.performanceIcon}>
                <MousePointer />
              </div>
              <div className={styles.performanceContent}>
                <div className={styles.performanceValue}>{avgClickRate.toFixed(1)}%</div>
                <div className={styles.performanceLabel}>Avg Click Rate</div>
                <div className={styles.performanceTrend}>
                  <TrendingUp />
                  <span>+2.8% vs last month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className={styles.insightsSection}>
        <div className={styles.sectionHeader}>
          <Sparkles />
          <h2>AI Insights & Recommendations</h2>
        </div>
        <div className={styles.insights}>
          {aiInsights.map((insight, index) => (
            <div key={index} className={`${styles.insight} ${styles[insight.type]}`}>
              <div className={styles.insightIcon}>
                {insight.type === 'success' && <TrendingUp />}
                {insight.type === 'warning' && <Mail />}
                {insight.type === 'info' && <Sparkles />}
              </div>
              <div className={styles.insightContent}>
                <div className={styles.insightTitle}>{insight.title}</div>
                <div className={styles.insightDescription}>{insight.description}</div>
                <div className={styles.insightRecommendation}>
                  <strong>Recommendation:</strong> {insight.recommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaigns List */}
      <div className={styles.campaignsSection}>
        <div className={styles.sectionHeader}>
          <h2>Recent Campaigns</h2>
        </div>

        <div className={styles.campaignsList}>
          {selectedCampaigns.map((campaign) => (
            <div key={campaign.id} className={styles.campaignCard}>
              <div className={styles.campaignHeader}>
                <div className={styles.campaignInfo}>
                  <div className={styles.campaignTitle}>
                    {campaign.title}
                    <span className={`${styles.statusBadge} ${styles[campaign.status]}`}>
                      {campaign.status === 'sent' && <Send />}
                      {campaign.status === 'scheduled' && <Clock />}
                      {campaign.status === 'draft' && <FileText />}
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </div>
                  <div className={styles.campaignSubject}>{campaign.subject}</div>
                </div>
                <div className={styles.campaignActions}>
                  {campaign.status !== 'sent' && (
                    <button onClick={() => handleEditCampaign(campaign.id)} title="Edit">
                      <Edit />
                    </button>
                  )}
                  <button onClick={() => handleDuplicateCampaign(campaign.id)} title="Duplicate">
                    <Copy />
                  </button>
                  {campaign.status === 'sent' && (
                    <button onClick={() => handleViewCampaign(campaign.id)} title="View Analytics">
                      <BarChart3 />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCampaign(campaign.id)}
                    className={styles.danger}
                    title="Delete"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>

              <div className={styles.campaignMeta}>
                <div className={styles.metaItem}>
                  <Users />
                  <span>
                    {campaign.audience.segment} ({campaign.audience.count.toLocaleString()})
                  </span>
                </div>
                {campaign.sentAt && (
                  <div className={styles.metaItem}>
                    <Send />
                    <span>Sent {new Date(campaign.sentAt).toLocaleString()}</span>
                  </div>
                )}
                {campaign.scheduledFor && (
                  <div className={styles.metaItem}>
                    <Calendar />
                    <span>Scheduled for {new Date(campaign.scheduledFor).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {campaign.stats && (
                <div className={styles.campaignStats}>
                  <div className={styles.campaignStat}>
                    <Mail />
                    <div>
                      <div className={styles.campaignStatValue}>{campaign.stats.sent}</div>
                      <div className={styles.campaignStatLabel}>Sent</div>
                    </div>
                  </div>
                  <div className={styles.campaignStat}>
                    <Eye />
                    <div>
                      <div className={styles.campaignStatValue}>{campaign.stats.opened}</div>
                      <div className={styles.campaignStatLabel}>Opened ({campaign.stats.openRate}%)</div>
                    </div>
                  </div>
                  <div className={styles.campaignStat}>
                    <MousePointer />
                    <div>
                      <div className={styles.campaignStatValue}>{campaign.stats.clicked}</div>
                      <div className={styles.campaignStatLabel}>Clicked ({campaign.stats.clickRate}%)</div>
                    </div>
                  </div>
                  <div className={styles.campaignStat}>
                    <TrendingUp />
                    <div>
                      <div className={styles.campaignStatValue}>
                        {((campaign.stats.clicked / campaign.stats.opened) * 100).toFixed(1)}%
                      </div>
                      <div className={styles.campaignStatLabel}>Click-to-Open</div>
                    </div>
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
