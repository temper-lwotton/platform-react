'use client';

import { JobSpecAnalysis as JobSpecAnalysisType } from '@/types/jobAnalysis';
import { Icon } from '../Icon';
import styles from './JobForgeAnalysis.module.scss';

interface JobSpecAnalysisProps {
  analysis: JobSpecAnalysisType | null;
  isLoading: boolean;
  error?: string;
  onRetry?: () => void;
  onApplySuggestion?: (tipId: string, fieldPath: string, value: string) => void;
  appliedSuggestions?: Set<string>;
}

export function JobSpecAnalysis({
  analysis,
  isLoading,
  error,
  onRetry,
  onApplySuggestion,
  appliedSuggestions = new Set()
}: JobSpecAnalysisProps) {
  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Analyzing your job specification...</p>
          <p className={styles.loadingSubtext}>Checking clarity, completeness, bias, and market competitiveness</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.card}>
        <div className={styles.error}>
          <Icon icon="x" size={48} />
          <p className={styles.errorMessage}>
            Unable to analyze job specification at this time.
          </p>
          {onRetry && (
            <button onClick={onRetry} className={styles.retryButton}>
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const getOverallScoreLevel = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  const getScoreMessage = (score: number): string => {
    if (score >= 80) return 'Excellent! Your job spec is highly competitive and well-structured.';
    if (score >= 60) return 'Good job! A few improvements could make this even stronger.';
    return 'This job spec needs some improvements to attract top candidates.';
  };

  const scoreLevel = getOverallScoreLevel(analysis.scores.overall);

  return (
    <div className={styles.analysisContainer}>
      {/* Header with Overall Score */}
      <div className={styles.card}>
        <header className={styles.header}>
          <h2 className={styles.title}>📊 Job Spec Analysis</h2>
          <div className={styles.overallScore}>
            <div className={`${styles.scoreCircle} ${styles[`level-${scoreLevel}`]}`}>
              <span className={styles.scoreValue}>{analysis.scores.overall}</span>
              <span className={styles.scoreLabel}>/ 100</span>
            </div>
            <div className={styles.scoreMessage}>
              {getScoreMessage(analysis.scores.overall)}
            </div>
          </div>
        </header>

        {/* Score Breakdown */}
        <div className={styles.scoreBreakdown}>
          <div className={styles.scoreItem}>
            <div className={styles.scoreItemHeader}>
              <span>Clarity</span>
              <span className={styles.scoreItemValue}>{analysis.scores.clarity}/100</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${analysis.scores.clarity}%` }}
              />
            </div>
          </div>

          <div className={styles.scoreItem}>
            <div className={styles.scoreItemHeader}>
              <span>Completeness</span>
              <span className={styles.scoreItemValue}>{analysis.scores.completeness}/100</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${analysis.scores.completeness}%` }}
              />
            </div>
          </div>

          <div className={styles.scoreItem}>
            <div className={styles.scoreItemHeader}>
              <span>Appeal</span>
              <span className={styles.scoreItemValue}>{analysis.scores.appeal}/100</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${analysis.scores.appeal}%` }}
              />
            </div>
          </div>

          <div className={styles.scoreItem}>
            <div className={styles.scoreItemHeader}>
              <span>Competitiveness</span>
              <span className={styles.scoreItemValue}>{analysis.scores.competitiveness}/100</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${analysis.scores.competitiveness}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bias Detection Alert */}
      {analysis.biasDetection.hasBias && (
        <div className={`${styles.card} ${styles.alertCard}`}>
          <div className={styles.alertHeader}>
            <Icon icon="info" size={20} />
            <h3>Potential Bias Detected</h3>
          </div>
          <p className={styles.alertDescription}>
            We found {analysis.biasDetection.biasTypes.length} potential {analysis.biasDetection.biasTypes.length === 1 ? 'issue' : 'issues'} that may limit your candidate pool.
          </p>
          <div className={styles.biasIssues}>
            {analysis.biasDetection.biasTypes.map((bias, index) => (
              <div key={index} className={styles.biasIssue}>
                <div className={styles.biasIssueHeader}>
                  <span className={`${styles.biasSeverity} ${styles[`severity-${bias.severity}`]}`}>
                    {bias.severity}
                  </span>
                  <span className={styles.biasType}>{bias.type} bias</span>
                </div>
                <div className={styles.biasText}>
                  Found "{bias.text}" in {bias.location}
                </div>
                <div className={styles.biasSuggestion}>
                  💡 Suggestion: {bias.suggestion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Salary Benchmark */}
      {analysis.salaryBenchmark && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>💰 Salary Analysis</h3>
          <div className={styles.salaryComparison}>
            <div className={styles.salaryRange}>
              <div className={styles.salaryLabel}>Your Range</div>
              <div className={styles.salaryValue}>
                {analysis.salaryBenchmark.providedRange.currency} {analysis.salaryBenchmark.providedRange.min.toLocaleString()} - {analysis.salaryBenchmark.providedRange.max.toLocaleString()}
              </div>
            </div>
            <div className={styles.salaryRange}>
              <div className={styles.salaryLabel}>Market Range</div>
              <div className={styles.salaryValue}>
                {analysis.salaryBenchmark.providedRange.currency} {analysis.salaryBenchmark.marketRange.min.toLocaleString()} - {analysis.salaryBenchmark.marketRange.max.toLocaleString()}
              </div>
            </div>
          </div>
          <div className={`${styles.salaryRecommendation} ${styles[`recommendation-${analysis.salaryBenchmark.recommendation}`]}`}>
            {analysis.salaryBenchmark.notes}
          </div>
        </div>
      )}

      {/* Improvement Tips */}
      {analysis.tips && analysis.tips.length > 0 && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>💡 Improvement Suggestions</h3>
          <div className={styles.tipsList}>
            {analysis.tips.sort((a, b) => {
              const priorityOrder = { high: 0, medium: 1, low: 2 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            }).map((tip) => (
              <div key={tip.id} className={styles.tip}>
                <div className={styles.tipHeader}>
                  <div>
                    <span className={`${styles.tipPriority} ${styles[`priority-${tip.priority}`]}`}>
                      {tip.priority}
                    </span>
                    <span className={styles.tipTitle}>{tip.title}</span>
                  </div>
                  <span className={styles.tipImpact}>+{tip.impact} pts</span>
                </div>
                <p className={styles.tipDescription}>{tip.description}</p>
                {tip.suggestion && (
                  <div className={styles.tipSuggestion}>
                    <Icon icon="lightbulb" size={14} />
                    <span>{tip.suggestion}</span>
                  </div>
                )}
                {tip.currentValue && tip.suggestedValue && (
                  <div className={styles.tipComparison}>
                    <div className={styles.comparisonItem}>
                      <span className={styles.comparisonLabel}>Current:</span>
                      <span>{tip.currentValue}</span>
                    </div>
                    <Icon icon="arrowRight" size={14} />
                    <div className={styles.comparisonItem}>
                      <span className={styles.comparisonLabel}>Suggested:</span>
                      <span className={styles.suggestedValue}>{tip.suggestedValue}</span>
                    </div>
                    {onApplySuggestion && tip.fieldPath && (
                      appliedSuggestions.has(tip.id) ? (
                        <div className={styles.appliedBadge}>
                          <Icon icon="check" size={14} />
                          Applied
                        </div>
                      ) : (
                        <button
                          onClick={() => onApplySuggestion(tip.id, tip.fieldPath!, tip.suggestedValue)}
                          className={styles.applyButton}
                          title="Apply this suggestion"
                        >
                          <Icon icon="check" size={14} />
                          Apply
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predictions */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>🎯 Expected Outcomes</h3>
        <div className={styles.predictions}>
          <div className={styles.prediction}>
            <Icon icon="users" size={20} />
            <div>
              <div className={styles.predictionLabel}>Expected Applications</div>
              <div className={`${styles.predictionValue} ${styles[analysis.predictions.expectedApplications]}`}>
                {analysis.predictions.expectedApplications}
              </div>
            </div>
          </div>

          <div className={styles.prediction}>
            <Icon icon="star" size={20} />
            <div>
              <div className={styles.predictionLabel}>Qualified Candidates</div>
              <div className={`${styles.predictionValue} ${styles[analysis.predictions.expectedQualifiedCandidates]}`}>
                {analysis.predictions.expectedQualifiedCandidates}
              </div>
            </div>
          </div>

          <div className={styles.prediction}>
            <Icon icon="clock" size={20} />
            <div>
              <div className={styles.predictionLabel}>Time to Fill</div>
              <div className={styles.predictionValue}>
                {analysis.predictions.timeToFill}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>📈 Content Metrics</h3>
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Word Count</span>
            <span className={styles.metricValue}>{analysis.metrics.wordCount}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Responsibilities</span>
            <span className={styles.metricValue}>{analysis.metrics.responsibilitiesCount}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Requirements</span>
            <span className={styles.metricValue}>{analysis.metrics.requirementsCount}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Benefits</span>
            <span className={styles.metricValue}>{analysis.metrics.benefitsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
