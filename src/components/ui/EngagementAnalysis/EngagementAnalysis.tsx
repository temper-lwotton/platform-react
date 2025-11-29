'use client';

import type { EngagementAnalysis as EngagementAnalysisType } from '@/types/engagement';
import { EngagementScoreBar } from '../EngagementScoreBar';
import { EngagementTipsList } from '../EngagementTipsList';
import { EngagementPredictions } from '../EngagementPredictions';
import { Button } from '../primitives';
import styles from './EngagementAnalysis.module.scss';

interface EngagementAnalysisProps {
    analysis: EngagementAnalysisType | null;
    isLoading: boolean;
    error?: string;
    onRetry?: () => void;
}

export function EngagementAnalysis({
    analysis,
    isLoading,
    error,
    onRetry
}: EngagementAnalysisProps) {
    if (isLoading) {
        return (
            <div className={styles.card}>
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Analyzing engagement potential...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.card}>
                <div className={styles.error}>
                    <p className={styles.errorMessage}>
                        Unable to analyze engagement at this time.
                    </p>
                    {onRetry && (
                        <Button variant="secondary" size="sm" onClick={onRetry}>
                            Try Again
                        </Button>
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
        if (score >= 80) return 'Excellent! Your post has strong engagement potential.';
        if (score >= 60) return 'Good! A few improvements could boost engagement.';
        return 'Your post could benefit from some enhancements.';
    };

    const scoreLevel = getOverallScoreLevel(analysis.scores.overall);

    return (
        <div className={styles.card}>
            <header className={styles.header}>
                <h3 className={styles.title}>📊 Engagement Analysis</h3>
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

            <EngagementScoreBar scores={analysis.scores} />

            {analysis.tips && analysis.tips.length > 0 && (
                <EngagementTipsList tips={analysis.tips} />
            )}

            <EngagementPredictions predictions={analysis.predictions} />
        </div>
    );
}
