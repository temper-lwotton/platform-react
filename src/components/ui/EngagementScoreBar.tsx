'use client';

import type { EngagementScores } from '@/types/engagement';

interface EngagementScoreBarProps {
    scores: EngagementScores;
}

export function EngagementScoreBar({ scores }: EngagementScoreBarProps) {
    return (
        <div className="engagement-scores">
            <ScoreItem label="Clarity" score={scores.clarity} />
            <ScoreItem label="Structure" score={scores.structure} />
            <ScoreItem label="Appeal" score={scores.appeal} />
        </div>
    );
}

interface ScoreItemProps {
    label: string;
    score: number;
}

function ScoreItem({ label, score }: ScoreItemProps) {
    const getScoreLevel = (score: number): 'high' | 'medium' | 'low' => {
        if (score >= 80) return 'high';
        if (score >= 60) return 'medium';
        return 'low';
    };

    return (
        <div className="score-item">
            <div className="score-label">{label}</div>
            <div className="score-value" data-level={getScoreLevel(score)}>
                {score}
            </div>
            <div className="score-bar">
                <div
                    className="score-bar-fill"
                    data-level={getScoreLevel(score)}
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
}
