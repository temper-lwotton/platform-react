'use client';

import type { EngagementAnalysis as EngagementAnalysisType } from '@/types/engagement';
import { EngagementScoreBar } from './EngagementScoreBar';
import { EngagementTipsList } from './EngagementTipsList';
import { EngagementPredictions } from './EngagementPredictions';

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
            <div className="engagement-analysis-card">
                <div className="engagement-loading">
                    <div className="loading-spinner" />
                    <p>Analyzing engagement potential...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="engagement-analysis-card">
                <div className="engagement-error">
                    <p className="error-message">
                        Unable to analyze engagement at this time.
                    </p>
                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="retry-button"
                        >
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
        if (score >= 80) return 'Excellent! Your post has strong engagement potential.';
        if (score >= 60) return 'Good! A few improvements could boost engagement.';
        return 'Your post could benefit from some enhancements.';
    };

    return (
        <div className="engagement-analysis-card">
            <header className="engagement-header">
                <div className="engagement-header-content">
                    <h3 className="engagement-title">📊 Engagement Analysis</h3>
                    <div className="overall-score-container">
                        <div
                            className="overall-score-circle"
                            data-level={getOverallScoreLevel(analysis.scores.overall)}
                        >
                            <span className="overall-score-value">
                                {analysis.scores.overall}
                            </span>
                            <span className="overall-score-label">/ 100</span>
                        </div>
                        <div className="overall-score-message">
                            {getScoreMessage(analysis.scores.overall)}
                        </div>
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
