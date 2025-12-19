'use client';

import {
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Flag,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  Target,
  Activity,
  Brain,
} from 'lucide-react';
import styles from './ModerationAnalytics.module.scss';

interface TimeSeriesData {
  date: string;
  flagged: number;
  approved: number;
  rejected: number;
  autoHandled: number;
}

interface PatternInsight {
  id: string;
  type: 'spike' | 'trend' | 'anomaly' | 'success';
  title: string;
  description: string;
  metric: string;
  severity: 'high' | 'medium' | 'low';
  recommendation?: string;
}

interface ModeratorPerformance {
  id: string;
  name: string;
  avatar: string;
  actionsToday: number;
  avgResponseTime: string;
  accuracy: number;
}

interface ContentTypeStats {
  type: string;
  total: number;
  flagged: number;
  flagRate: number;
}

// Dummy data
const timeSeriesData: TimeSeriesData[] = [
  { date: 'Dec 13', flagged: 12, approved: 8, rejected: 3, autoHandled: 34 },
  { date: 'Dec 14', flagged: 15, approved: 11, rejected: 4, autoHandled: 38 },
  { date: 'Dec 15', flagged: 9, approved: 6, rejected: 2, autoHandled: 41 },
  { date: 'Dec 16', flagged: 18, approved: 13, rejected: 5, autoHandled: 36 },
  { date: 'Dec 17', flagged: 14, approved: 9, rejected: 4, autoHandled: 42 },
  { date: 'Dec 18', flagged: 11, approved: 7, rejected: 3, autoHandled: 45 },
  { date: 'Dec 19', flagged: 23, approved: 15, rejected: 7, autoHandled: 47 },
];

const patternInsights: PatternInsight[] = [
  {
    id: '1',
    type: 'spike',
    title: 'Spam Activity Spike Detected',
    description: 'Spam flagging increased 87% in the last 24 hours, primarily from new accounts created in the past 3 days.',
    metric: '+87% spam flags',
    severity: 'high',
    recommendation: 'Consider enabling "New User Link Protection" rule or tightening rate limits.',
  },
  {
    id: '2',
    type: 'success',
    title: 'Auto-Moderation Effectiveness Up',
    description: 'Your auto-moderation rules are handling 73% of flagged content correctly without manual intervention.',
    metric: '73% auto-handled',
    severity: 'low',
    recommendation: 'Your "Block Obvious Spam" rule is performing exceptionally well (95.7% accuracy).',
  },
  {
    id: '3',
    type: 'trend',
    title: 'Faster Response Times',
    description: 'Average time to moderate flagged content has improved by 42% this week.',
    metric: '-42% response time',
    severity: 'low',
  },
  {
    id: '4',
    type: 'anomaly',
    title: 'Unusual Flagging Pattern',
    description: '3 users have flagged content 5x more than usual. Possible coordinated flagging or legitimate concern.',
    metric: '3 unusual users',
    severity: 'medium',
    recommendation: 'Review flagging patterns to identify if this is abuse or a genuine issue.',
  },
];

const moderatorPerformance: ModeratorPerformance[] = [
  { id: '1', name: 'Sarah Johnson', avatar: '', actionsToday: 34, avgResponseTime: '8 min', accuracy: 96.2 },
  { id: '2', name: 'Michael Chen', avatar: '', actionsToday: 28, avgResponseTime: '12 min', accuracy: 94.5 },
  { id: '3', name: 'Emma Williams', avatar: '', actionsToday: 19, avgResponseTime: '15 min', accuracy: 91.8 },
];

const contentTypeStats: ContentTypeStats[] = [
  { type: 'Posts', total: 487, flagged: 23, flagRate: 4.7 },
  { type: 'Comments', total: 1243, flagged: 67, flagRate: 5.4 },
  { type: 'User Profiles', total: 89, flagged: 4, flagRate: 4.5 },
  { type: 'Media', total: 312, flagged: 8, flagRate: 2.6 },
];

const topFlags = [
  { reason: 'Spam', count: 47, percentage: 38 },
  { reason: 'Toxic Language', count: 28, percentage: 23 },
  { reason: 'Off-Topic', count: 19, percentage: 15 },
  { reason: 'Misinformation', count: 16, percentage: 13 },
  { reason: 'Other', count: 14, percentage: 11 },
];

export function ModerationAnalytics() {
  const maxValue = Math.max(...timeSeriesData.flatMap(d => [d.flagged, d.approved, d.rejected, d.autoHandled]));

  return (
    <div className={styles.analytics}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Moderation Analytics</h1>
          <p>Insights and patterns to improve community safety</p>
        </div>
        <div className={styles.timeRange}>
          <button className={`${styles.timeButton} ${styles.active}`}>7 Days</button>
          <button className={styles.timeButton}>30 Days</button>
          <button className={styles.timeButton}>90 Days</button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Total Flagged</span>
            <TrendingUp className={styles.metricTrendUp} />
          </div>
          <div className={styles.metricValue}>102</div>
          <div className={styles.metricChange}>+12% from last week</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Auto-Handled</span>
            <Zap className={styles.metricIcon} />
          </div>
          <div className={styles.metricValue}>283</div>
          <div className={styles.metricChange}>+18% from last week</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Avg Response Time</span>
            <Clock className={styles.metricIcon} />
          </div>
          <div className={styles.metricValue}>12 min</div>
          <div className={`${styles.metricChange} ${styles.positive}`}>-42% faster</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Accuracy Rate</span>
            <Target className={styles.metricIcon} />
          </div>
          <div className={styles.metricValue}>94.2%</div>
          <div className={`${styles.metricChange} ${styles.positive}`}>+2.3% improvement</div>
        </div>
      </div>

      {/* AI Pattern Insights */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>
            <Brain className={styles.sectionIcon} />
            AI-Detected Patterns
          </h2>
        </div>
        <div className={styles.insightsGrid}>
          {patternInsights.map(insight => (
            <div key={insight.id} className={`${styles.insightCard} ${styles[insight.type]} ${styles[insight.severity]}`}>
              <div className={styles.insightHeader}>
                <div className={styles.insightBadge}>
                  {insight.type === 'spike' && <TrendingUp />}
                  {insight.type === 'trend' && <Activity />}
                  {insight.type === 'anomaly' && <AlertTriangle />}
                  {insight.type === 'success' && <CheckCircle2 />}
                  <span>{insight.type}</span>
                </div>
                <div className={styles.insightMetric}>{insight.metric}</div>
              </div>
              <h3 className={styles.insightTitle}>{insight.title}</h3>
              <p className={styles.insightDescription}>{insight.description}</p>
              {insight.recommendation && (
                <div className={styles.insightRecommendation}>
                  <strong>Recommendation:</strong> {insight.recommendation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Time Series Chart */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Moderation Activity Over Time</h2>
        </div>
        <div className={styles.chartCard}>
          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.flagged}`}></div>
              <span>Flagged</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.approved}`}></div>
              <span>Approved</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.rejected}`}></div>
              <span>Rejected</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.autoHandled}`}></div>
              <span>Auto-Handled</span>
            </div>
          </div>

          <div className={styles.chart}>
            {timeSeriesData.map((day, idx) => (
              <div key={idx} className={styles.chartBar}>
                <div className={styles.barGroup}>
                  <div
                    className={`${styles.bar} ${styles.flagged}`}
                    style={{ height: `${(day.flagged / maxValue) * 100}%` }}
                    title={`Flagged: ${day.flagged}`}
                  ></div>
                  <div
                    className={`${styles.bar} ${styles.approved}`}
                    style={{ height: `${(day.approved / maxValue) * 100}%` }}
                    title={`Approved: ${day.approved}`}
                  ></div>
                  <div
                    className={`${styles.bar} ${styles.rejected}`}
                    style={{ height: `${(day.rejected / maxValue) * 100}%` }}
                    title={`Rejected: ${day.rejected}`}
                  ></div>
                  <div
                    className={`${styles.bar} ${styles.autoHandled}`}
                    style={{ height: `${(day.autoHandled / maxValue) * 100}%` }}
                    title={`Auto-Handled: ${day.autoHandled}`}
                  ></div>
                </div>
                <div className={styles.barLabel}>{day.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className={styles.twoColumn}>
        {/* Content Type Breakdown */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Content Type Breakdown</h2>
          </div>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Total</th>
                  <th>Flagged</th>
                  <th>Flag Rate</th>
                </tr>
              </thead>
              <tbody>
                {contentTypeStats.map((stat, idx) => (
                  <tr key={idx}>
                    <td className={styles.typeCell}>{stat.type}</td>
                    <td>{stat.total}</td>
                    <td>{stat.flagged}</td>
                    <td>
                      <span className={styles.flagRate}>{stat.flagRate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Flag Reasons */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Top Flag Reasons</h2>
          </div>
          <div className={styles.flagReasonsCard}>
            {topFlags.map((flag, idx) => (
              <div key={idx} className={styles.flagReasonItem}>
                <div className={styles.flagReasonHeader}>
                  <span className={styles.flagReasonName}>{flag.reason}</span>
                  <span className={styles.flagReasonCount}>{flag.count}</span>
                </div>
                <div className={styles.flagReasonBar}>
                  <div
                    className={styles.flagReasonProgress}
                    style={{ width: `${flag.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Moderator Performance */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>
            <Users className={styles.sectionIcon} />
            Moderator Performance
          </h2>
        </div>
        <div className={styles.moderatorsGrid}>
          {moderatorPerformance.map(mod => (
            <div key={mod.id} className={styles.moderatorCard}>
              <div className={styles.moderatorAvatar}>
                {mod.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className={styles.moderatorInfo}>
                <h3 className={styles.moderatorName}>{mod.name}</h3>
                <div className={styles.moderatorStats}>
                  <div className={styles.moderatorStat}>
                    <span className={styles.moderatorStatLabel}>Actions Today</span>
                    <span className={styles.moderatorStatValue}>{mod.actionsToday}</span>
                  </div>
                  <div className={styles.moderatorStat}>
                    <span className={styles.moderatorStatLabel}>Avg Response</span>
                    <span className={styles.moderatorStatValue}>{mod.avgResponseTime}</span>
                  </div>
                  <div className={styles.moderatorStat}>
                    <span className={styles.moderatorStatLabel}>Accuracy</span>
                    <span className={`${styles.moderatorStatValue} ${styles.accuracy}`}>
                      {mod.accuracy}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
