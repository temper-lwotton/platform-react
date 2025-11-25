'use client';

import type { EngagementPredictions as EngagementPredictionsType } from '@/types/engagement';

interface EngagementPredictionsProps {
    predictions: EngagementPredictionsType;
}

export function EngagementPredictions({ predictions }: EngagementPredictionsProps) {
    const getLevelLabel = (level: 'low' | 'medium' | 'high'): string => {
        return level.charAt(0).toUpperCase() + level.slice(1);
    };

    const getLevelIcon = (level: 'low' | 'medium' | 'high'): string => {
        switch (level) {
            case 'high': return '🔥';
            case 'medium': return '📊';
            case 'low': return '📉';
        }
    };

    return (
        <div className="engagement-predictions">
            <div className="predictions-title">Expected Performance</div>
            <div className="predictions-items">
                <div className="prediction-item" data-level={predictions.expectedViews}>
                    <span className="prediction-icon">{getLevelIcon(predictions.expectedViews)}</span>
                    <span className="prediction-label">
                        {getLevelLabel(predictions.expectedViews)} views
                    </span>
                </div>
                <span className="prediction-separator">•</span>
                <div className="prediction-item" data-level={predictions.expectedReplies}>
                    <span className="prediction-icon">{getLevelIcon(predictions.expectedReplies)}</span>
                    <span className="prediction-label">
                        {getLevelLabel(predictions.expectedReplies)} replies
                    </span>
                </div>
                <span className="prediction-separator">•</span>
                <div className="prediction-item">
                    <span className="prediction-label">
                        ~{predictions.expectedEngagementRate}% engagement
                    </span>
                </div>
            </div>
        </div>
    );
}
