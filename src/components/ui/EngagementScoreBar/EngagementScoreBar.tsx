'use client';

import type { EngagementScores } from '@/types/engagement';
import styles from './EngagementScoreBar.module.scss';

interface EngagementScoreBarProps {
    scores: EngagementScores;
}

export function EngagementScoreBar({ scores }: EngagementScoreBarProps) {
    return (
        <div className={styles.scores}>
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
        <div className={styles.item}>
            <div className={styles.label}>{label}</div>
            <div className={`${styles.value} ${styles[`level-${getScoreLevel(score)}`]}`}>
                {score}
            </div>
            <div className={styles.bar}>
                <div
                    className={`${styles.barFill} ${styles[`level-${getScoreLevel(score)}`]}`}
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
}
