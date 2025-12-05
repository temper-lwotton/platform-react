'use client';

import { QualityMetrics } from '@/types/jobforge';
import { Icon } from '../Icon';
import styles from './JobForge.module.scss';

interface QualityScoreCardProps {
  metrics: QualityMetrics;
  showDetails?: boolean;
}

export function QualityScoreCard({ metrics, showDetails = false }: QualityScoreCardProps) {
  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Needs Improvement';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 70) return 'amber';
    return 'red';
  };

  const getBiasColor = (level: string) => {
    if (level === 'none') return 'green';
    if (level === 'low') return 'amber';
    return 'red';
  };

  return (
    <div className={styles.qualityCard}>
      <div className={styles.qualityHeader}>
        <h4 className={styles.qualityTitle}>Quality Score</h4>
        <div className={`${styles.qualityOverall} ${styles[`quality${getScoreColor(metrics.overallScore).charAt(0).toUpperCase() + getScoreColor(metrics.overallScore).slice(1)}`]}`}>
          {metrics.overallScore}%
        </div>
      </div>

      <div className={styles.qualityLabel}>
        {getScoreLabel(metrics.overallScore)}
      </div>

      <div className={styles.qualityMetrics}>
        <div className={styles.qualityMetric}>
          <div className={styles.qualityMetricHeader}>
            <span className={styles.qualityMetricLabel}>Clarity</span>
            <span className={styles.qualityMetricValue}>{metrics.clarity}%</span>
          </div>
          <div className={styles.qualityProgressBar}>
            <div
              className={styles.qualityProgressFill}
              style={{ width: `${metrics.clarity}%` }}
            />
          </div>
        </div>

        <div className={styles.qualityMetric}>
          <div className={styles.qualityMetricHeader}>
            <span className={styles.qualityMetricLabel}>Readability</span>
            <span className={styles.qualityMetricValue}>{metrics.readability}%</span>
          </div>
          <div className={styles.qualityProgressBar}>
            <div
              className={styles.qualityProgressFill}
              style={{ width: `${metrics.readability}%` }}
            />
          </div>
        </div>

        <div className={styles.qualityMetric}>
          <div className={styles.qualityMetricHeader}>
            <span className={styles.qualityMetricLabel}>Completeness</span>
            <span className={styles.qualityMetricValue}>{metrics.completeness}%</span>
          </div>
          <div className={styles.qualityProgressBar}>
            <div
              className={styles.qualityProgressFill}
              style={{ width: `${metrics.completeness}%` }}
            />
          </div>
        </div>

        <div className={styles.qualityMetric}>
          <div className={styles.qualityMetricHeader}>
            <span className={styles.qualityMetricLabel}>Bias</span>
            <span className={`${styles.qualityMetricBadge} ${styles[`badge${getBiasColor(metrics.bias.level).charAt(0).toUpperCase() + getBiasColor(metrics.bias.level).slice(1)}`]}`}>
              {metrics.bias.level === 'none' ? 'None' : metrics.bias.level}
            </span>
          </div>
        </div>
      </div>

      {showDetails && metrics.issues.length > 0 && (
        <div className={styles.qualityIssues}>
          <h5 className={styles.qualityIssuesTitle}>
            Issues ({metrics.issues.length})
          </h5>
          <div className={styles.qualityIssuesList}>
            {metrics.issues.map((issue) => (
              <div key={issue.id} className={styles.qualityIssue}>
                <div className={styles.qualityIssueHeader}>
                  <Icon
                    icon={issue.severity === 'error' ? 'x' : 'info'}
                    size={14}
                  />
                  <span>{issue.message}</span>
                </div>
                {issue.suggestion && (
                  <div className={styles.qualityIssueSuggestion}>
                    Suggestion: {issue.suggestion}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
