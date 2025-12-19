'use client';

import { useState } from 'react';
import {
  TrendingUp,
  Users,
  UserPlus,
  Activity,
  Award,
  Target,
  Clock,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Calendar,
} from 'lucide-react';
import styles from './MemberAnalytics.module.scss';

interface MetricCard {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: 'users' | 'user-plus' | 'activity' | 'award';
}

interface TimeSeriesPoint {
  date: string;
  newMembers: number;
  activeMembers: number;
  churnedMembers: number;
}

interface LifecycleData {
  stage: string;
  count: number;
  percentage: number;
  color: string;
}

interface TopContributor {
  id: string;
  name: string;
  avatar?: string;
  posts: number;
  comments: number;
  reputation: number;
  engagementScore: number;
}

interface AIInsight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation?: string;
}

// Dummy data
const metrics: MetricCard[] = [
  {
    label: 'Total Members',
    value: '2,847',
    change: 12.5,
    changeLabel: 'vs last month',
    icon: 'users',
  },
  {
    label: 'New This Month',
    value: 324,
    change: 18.2,
    changeLabel: 'vs last month',
    icon: 'user-plus',
  },
  {
    label: 'Active Members',
    value: '1,456',
    change: 8.7,
    changeLabel: 'vs last month',
    icon: 'activity',
  },
  {
    label: 'Avg Engagement',
    value: '74%',
    change: 5.3,
    changeLabel: 'vs last month',
    icon: 'award',
  },
];

const timeSeriesData: TimeSeriesPoint[] = [
  { date: 'Jan', newMembers: 234, activeMembers: 1205, churnedMembers: 45 },
  { date: 'Feb', newMembers: 289, activeMembers: 1312, churnedMembers: 52 },
  { date: 'Mar', newMembers: 324, activeMembers: 1456, churnedMembers: 38 },
  { date: 'Apr', newMembers: 298, activeMembers: 1523, churnedMembers: 41 },
  { date: 'May', newMembers: 356, activeMembers: 1689, churnedMembers: 35 },
  { date: 'Jun', newMembers: 412, activeMembers: 1842, churnedMembers: 29 },
];

const lifecycleDistribution: LifecycleData[] = [
  { stage: 'New', count: 324, percentage: 11.4, color: '#22c55e' },
  { stage: 'Active', count: 1156, percentage: 40.6, color: '#3b82f6' },
  { stage: 'Power Users', count: 289, percentage: 10.2, color: '#8b5cf6' },
  { stage: 'Champions', count: 47, percentage: 1.7, color: '#eab308' },
  { stage: 'At Risk', count: 198, percentage: 7.0, color: '#f97316' },
  { stage: 'Inactive', count: 833, percentage: 29.3, color: '#64748b' },
];

const topContributors: TopContributor[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    posts: 47,
    comments: 234,
    reputation: 2847,
    engagementScore: 92,
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    posts: 52,
    comments: 189,
    reputation: 2654,
    engagementScore: 89,
  },
  {
    id: '3',
    name: 'Emily Watson',
    posts: 38,
    comments: 267,
    reputation: 2432,
    engagementScore: 87,
  },
  {
    id: '4',
    name: 'David Kim',
    posts: 44,
    comments: 198,
    reputation: 2389,
    engagementScore: 85,
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    posts: 41,
    comments: 212,
    reputation: 2267,
    engagementScore: 83,
  },
];

const aiInsights: AIInsight[] = [
  {
    type: 'success',
    title: 'Strong Member Growth',
    description: 'New member signups increased 18% this month, outpacing the previous 3-month average.',
    recommendation: 'Current acquisition channels are performing well. Consider scaling successful campaigns.',
  },
  {
    type: 'warning',
    title: 'Declining Engagement in Active Segment',
    description: 'Active members\' engagement scores dropped 3.2% this week. This may indicate content fatigue.',
    recommendation: 'Introduce new content formats or topics. Consider surveying active members for feedback.',
  },
  {
    type: 'info',
    title: 'Onboarding Completion Improving',
    description: '68% of new members completed onboarding this month, up from 54% last month.',
    recommendation: 'Recent onboarding changes are working. Document what\'s driving the improvement.',
  },
  {
    type: 'warning',
    title: 'At-Risk Members Increasing',
    description: '198 members are now classified as "At Risk", a 12% increase from last month.',
    recommendation: 'Create a re-engagement campaign targeting at-risk members with personalized content.',
  },
];

const iconMap = {
  users: Users,
  'user-plus': UserPlus,
  activity: Activity,
  award: Award,
};

export function MemberAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const maxActiveMembers = Math.max(...timeSeriesData.map((d) => d.activeMembers));
  const maxNewMembers = Math.max(...timeSeriesData.map((d) => d.newMembers));

  return (
    <div className={styles.analytics}>
      <div className={styles.header}>
        <div>
          <h1>Member Analytics</h1>
          <p>Track member growth, engagement, and community health</p>
        </div>
        <div className={styles.timeRangeSelector}>
          <button
            onClick={() => setTimeRange('7d')}
            className={timeRange === '7d' ? styles.active : ''}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={timeRange === '30d' ? styles.active : ''}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={timeRange === '90d' ? styles.active : ''}
          >
            90 Days
          </button>
          <button
            onClick={() => setTimeRange('1y')}
            className={timeRange === '1y' ? styles.active : ''}
          >
            1 Year
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className={styles.metrics}>
        {metrics.map((metric, index) => {
          const Icon = iconMap[metric.icon];
          const isPositive = metric.change > 0;

          return (
            <div key={index} className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <Icon />
              </div>
              <div className={styles.metricContent}>
                <div className={styles.metricLabel}>{metric.label}</div>
                <div className={styles.metricValue}>{metric.value}</div>
                <div className={`${styles.metricChange} ${isPositive ? styles.positive : styles.negative}`}>
                  {isPositive ? <ArrowUp /> : <ArrowDown />}
                  {Math.abs(metric.change)}% {metric.changeLabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insights */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Sparkles />
          <h2>AI Insights</h2>
        </div>
        <div className={styles.insights}>
          {aiInsights.map((insight, index) => (
            <div key={index} className={`${styles.insight} ${styles[insight.type]}`}>
              <div className={styles.insightHeader}>
                <div className={styles.insightIcon}>
                  {insight.type === 'success' && <TrendingUp />}
                  {insight.type === 'warning' && <Activity />}
                  {insight.type === 'info' && <Sparkles />}
                </div>
                <div className={styles.insightContent}>
                  <div className={styles.insightTitle}>{insight.title}</div>
                  <div className={styles.insightDescription}>{insight.description}</div>
                  {insight.recommendation && (
                    <div className={styles.insightRecommendation}>
                      <strong>Recommendation:</strong> {insight.recommendation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        {/* Growth Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3>Member Growth</h3>
              <p>New members and churn over time</p>
            </div>
          </div>
          <div className={styles.chart}>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: '#667eea' }} />
                <span>New Members</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: '#ef4444' }} />
                <span>Churned</span>
              </div>
            </div>
            <div className={styles.barChart}>
              {timeSeriesData.map((point, index) => (
                <div key={index} className={styles.barGroup}>
                  <div className={styles.bars}>
                    <div
                      className={styles.barNew}
                      style={{ height: `${(point.newMembers / maxNewMembers) * 100}%` }}
                      title={`${point.newMembers} new members`}
                    />
                    <div
                      className={styles.barChurn}
                      style={{ height: `${(point.churnedMembers / maxNewMembers) * 100}%` }}
                      title={`${point.churnedMembers} churned`}
                    />
                  </div>
                  <div className={styles.barLabel}>{point.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Members Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3>Active Members</h3>
              <p>Members who engaged in the last 30 days</p>
            </div>
          </div>
          <div className={styles.chart}>
            <div className={styles.lineChart}>
              <svg viewBox="0 0 400 200" className={styles.lineChartSvg}>
                <defs>
                  <linearGradient id="activeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#667eea" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0,${200 - (timeSeriesData[0].activeMembers / maxActiveMembers) * 180} ${timeSeriesData
                    .map(
                      (point, i) =>
                        `L ${(i / (timeSeriesData.length - 1)) * 400},${200 - (point.activeMembers / maxActiveMembers) * 180}`
                    )
                    .join(' ')}`}
                  fill="url(#activeGradient)"
                  stroke="none"
                />
                <path
                  d={`M 0,${200 - (timeSeriesData[0].activeMembers / maxActiveMembers) * 180} ${timeSeriesData
                    .map(
                      (point, i) =>
                        `L ${(i / (timeSeriesData.length - 1)) * 400},${200 - (point.activeMembers / maxActiveMembers) * 180}`
                    )
                    .join(' ')}`}
                  fill="none"
                  stroke="#667eea"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {timeSeriesData.map((point, i) => (
                  <circle
                    key={i}
                    cx={(i / (timeSeriesData.length - 1)) * 400}
                    cy={200 - (point.activeMembers / maxActiveMembers) * 180}
                    r="4"
                    fill="#667eea"
                  />
                ))}
              </svg>
              <div className={styles.xAxisLabels}>
                {timeSeriesData.map((point, i) => (
                  <span key={i}>{point.date}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className={styles.bottomGrid}>
        {/* Lifecycle Distribution */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Target />
            <h3>Lifecycle Distribution</h3>
          </div>
          <div className={styles.lifecycleChart}>
            {lifecycleDistribution.map((item, index) => (
              <div key={index} className={styles.lifecycleItem}>
                <div className={styles.lifecycleBar}>
                  <div
                    className={styles.lifecycleFill}
                    style={{ width: `${item.percentage}%`, background: item.color }}
                  />
                </div>
                <div className={styles.lifecycleLabel}>
                  <span className={styles.lifecycleStage}>{item.stage}</span>
                  <span className={styles.lifecycleCount}>
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Contributors */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Award />
            <h3>Top Contributors</h3>
          </div>
          <div className={styles.contributors}>
            {topContributors.map((contributor, index) => (
              <div key={contributor.id} className={styles.contributor}>
                <div className={styles.contributorRank}>#{index + 1}</div>
                <div className={styles.contributorInfo}>
                  {contributor.avatar ? (
                    <img src={contributor.avatar} alt={contributor.name} />
                  ) : (
                    <div className={styles.contributorInitials}>
                      {contributor.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                  )}
                  <div className={styles.contributorDetails}>
                    <div className={styles.contributorName}>{contributor.name}</div>
                    <div className={styles.contributorStats}>
                      {contributor.posts} posts · {contributor.comments} comments
                    </div>
                  </div>
                </div>
                <div className={styles.contributorScore}>{contributor.engagementScore}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
