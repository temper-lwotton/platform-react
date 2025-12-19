'use client';

import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Sparkles, Users, MessageSquare, FileText, Calendar, Target, Zap } from 'lucide-react';
import styles from './AnalyticsDashboard.module.scss';

interface InsightAction {
  label: string;
  type: 'primary' | 'secondary';
}

interface Insight {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  metric?: string;
  actions: InsightAction[];
}

interface Metric {
  label: string;
  value: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

interface Prediction {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  confidence?: 'high' | 'medium';
}

// Dummy data
const spaceHealth = {
  score: 87,
  status: 'Thriving' as const,
  trend: 12,
};

const insights: Insight[] = [
  {
    id: '1',
    icon: Sparkles,
    priority: 'high',
    title: 'High-quality discussions are up 40%',
    description: '15 great posts from last week have low visibility and could benefit from featuring',
    metric: '+40% discussion quality',
    actions: [
      { label: 'Feature Top 3 Posts', type: 'primary' },
      { label: 'View Posts', type: 'secondary' },
    ],
  },
  {
    id: '2',
    icon: Users,
    priority: 'high',
    title: '23 new members haven\'t engaged yet',
    description: 'These members joined 5+ days ago but haven\'t posted, commented, or joined any discussions',
    metric: '23 inactive new members',
    actions: [
      { label: 'Send Welcome Task List', type: 'primary' },
      { label: 'View Members', type: 'secondary' },
    ],
  },
  {
    id: '3',
    icon: Calendar,
    priority: 'medium',
    title: 'Weekly Challenges driving 3x engagement',
    description: 'Your "Weekly Challenges" event series has significantly higher completion rates than other tasks',
    metric: '3x completion rate',
    actions: [
      { label: 'Create Similar Event', type: 'primary' },
      { label: 'AI Template', type: 'secondary' },
    ],
  },
];

const weeklyWins: Metric[] = [
  {
    label: 'New meaningful connections',
    value: '18',
    trend: { value: 25, direction: 'up' },
  },
  {
    label: 'Avg. post quality score',
    value: '8.2/10',
    trend: { value: 13, direction: 'up' },
  },
  {
    label: 'Response time to questions',
    value: '2.3 hrs',
    trend: { value: 30, direction: 'down' },
  },
  {
    label: 'Weekly active members',
    value: '67',
    trend: { value: 8, direction: 'up' },
  },
];

const predictions: Prediction[] = [
  {
    icon: Target,
    text: 'Predicted to reach 100 active members by Jan 15',
    confidence: 'high',
  },
  {
    icon: AlertCircle,
    text: 'Content creation trending downward - consider a community prompt',
    confidence: 'medium',
  },
  {
    icon: Zap,
    text: 'Engagement peaks on Tuesday mornings - optimal time for announcements',
    confidence: 'high',
  },
];

const engagementMetrics = [
  { label: 'Posts', value: '142', change: '+12%', trend: 'up' as const },
  { label: 'Comments', value: '1,247', change: '+28%', trend: 'up' as const },
  { label: 'Reactions', value: '3,421', change: '+15%', trend: 'up' as const },
  { label: 'Shares', value: '89', change: '-5%', trend: 'down' as const },
];

const contentMetrics = [
  { label: 'Published Posts', value: '47', change: '+8%', trend: 'up' as const },
  { label: 'Drafts', value: '12', change: '-15%', trend: 'down' as const },
  { label: 'Avg. Read Time', value: '4.2 min', change: '+22%', trend: 'up' as const },
  { label: 'Top Category', value: 'Discussion', change: null, trend: null },
];

const userMetrics = [
  { label: 'Total Members', value: '89', change: '+7%', trend: 'up' as const },
  { label: 'Active This Week', value: '67', change: '+11%', trend: 'up' as const },
  { label: 'New This Week', value: '8', change: '+33%', trend: 'up' as const },
  { label: 'Retention Rate', value: '92%', change: '+3%', trend: 'up' as const },
];

export function AnalyticsDashboard() {
  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Analytics & Insights</h1>
          <p>AI-powered insights to help your space thrive</p>
        </div>
      </div>

      {/* Space Health */}
      <div className={styles.healthSection}>
        <div className={styles.healthCard}>
          <div className={styles.healthHeader}>
            <div>
              <h2>Space Health</h2>
              <p className={styles.healthStatus}>{spaceHealth.status}</p>
            </div>
            <div className={styles.healthScore}>
              <div className={styles.scoreCircle}>
                <svg viewBox="0 0 100 100" className={styles.scoreRing}>
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray={`${spaceHealth.score * 2.827} 283`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className={styles.scoreValue}>{spaceHealth.score}</div>
              </div>
            </div>
          </div>
          <div className={styles.healthTrend}>
            <TrendingUp className={styles.trendIcon} />
            <span>↑ {spaceHealth.trend}% from last week</span>
          </div>
        </div>
      </div>

      {/* What Needs Attention */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>What Needs Your Attention</h2>
        <div className={styles.insightsGrid}>
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div key={insight.id} className={`${styles.insightCard} ${styles[insight.priority]}`}>
                <div className={styles.insightHeader}>
                  <div className={styles.insightIcon}>
                    <Icon />
                  </div>
                  <span className={styles.priorityBadge}>{insight.priority}</span>
                </div>
                <h3 className={styles.insightTitle}>{insight.title}</h3>
                <p className={styles.insightDescription}>{insight.description}</p>
                {insight.metric && (
                  <div className={styles.insightMetric}>{insight.metric}</div>
                )}
                <div className={styles.insightActions}>
                  {insight.actions.map((action, idx) => (
                    <button
                      key={idx}
                      className={`${styles.actionButton} ${styles[action.type]}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* This Week's Wins */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>This Week&apos;s Wins</h2>
        <div className={styles.winsGrid}>
          {weeklyWins.map((win, idx) => (
            <div key={idx} className={styles.winCard}>
              <div className={styles.winLabel}>{win.label}</div>
              <div className={styles.winValue}>{win.value}</div>
              {win.trend && (
                <div className={`${styles.winTrend} ${styles[win.trend.direction]}`}>
                  {win.trend.direction === 'up' ? (
                    <TrendingUp className={styles.trendIcon} />
                  ) : (
                    <TrendingDown className={styles.trendIcon} />
                  )}
                  <span>{win.trend.value}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Looking Ahead */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Looking Ahead</h2>
        <div className={styles.predictionsCard}>
          {predictions.map((prediction, idx) => {
            const Icon = prediction.icon;
            return (
              <div key={idx} className={styles.prediction}>
                <div className={styles.predictionIcon}>
                  <Icon />
                </div>
                <div className={styles.predictionContent}>
                  <p>{prediction.text}</p>
                  {prediction.confidence && (
                    <span className={`${styles.confidence} ${styles[prediction.confidence]}`}>
                      {prediction.confidence} confidence
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className={styles.metricsSection}>
        {/* Engagement Metrics */}
        <div className={styles.metricCategory}>
          <h2 className={styles.sectionTitle}>
            <MessageSquare className={styles.titleIcon} />
            Engagement Metrics
          </h2>
          <div className={styles.metricsGrid}>
            {engagementMetrics.map((metric, idx) => (
              <div key={idx} className={styles.metricCard}>
                <div className={styles.metricLabel}>{metric.label}</div>
                <div className={styles.metricValue}>{metric.value}</div>
                {metric.change && (
                  <div className={`${styles.metricChange} ${styles[metric.trend || 'neutral']}`}>
                    {metric.change}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Metrics */}
        <div className={styles.metricCategory}>
          <h2 className={styles.sectionTitle}>
            <FileText className={styles.titleIcon} />
            Content Metrics
          </h2>
          <div className={styles.metricsGrid}>
            {contentMetrics.map((metric, idx) => (
              <div key={idx} className={styles.metricCard}>
                <div className={styles.metricLabel}>{metric.label}</div>
                <div className={styles.metricValue}>{metric.value}</div>
                {metric.change && (
                  <div className={`${styles.metricChange} ${styles[metric.trend || 'neutral']}`}>
                    {metric.change}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* User Metrics */}
        <div className={styles.metricCategory}>
          <h2 className={styles.sectionTitle}>
            <Users className={styles.titleIcon} />
            User Metrics
          </h2>
          <div className={styles.metricsGrid}>
            {userMetrics.map((metric, idx) => (
              <div key={idx} className={styles.metricCard}>
                <div className={styles.metricLabel}>{metric.label}</div>
                <div className={styles.metricValue}>{metric.value}</div>
                {metric.change && (
                  <div className={`${styles.metricChange} ${styles[metric.trend || 'neutral']}`}>
                    {metric.change}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
