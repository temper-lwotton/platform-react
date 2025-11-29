'use client';

import type { EngagementPredictions as EngagementPredictionsType } from '@/types/engagement';
import { Badge } from '../primitives';
import styles from './EngagementPredictions.module.scss';

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
        <div className={styles.container}>
            <div className={styles.title}>Expected Performance</div>
            <div className={styles.items}>
                <div className={`${styles.item} ${styles[`level-${predictions.expectedViews}`]}`}>
                    <span className={styles.icon}>{getLevelIcon(predictions.expectedViews)}</span>
                    <span className={styles.label}>
                        {getLevelLabel(predictions.expectedViews)} views
                    </span>
                </div>
                <span className={styles.separator}>•</span>
                <div className={`${styles.item} ${styles[`level-${predictions.expectedReplies}`]}`}>
                    <span className={styles.icon}>{getLevelIcon(predictions.expectedReplies)}</span>
                    <span className={styles.label}>
                        {getLevelLabel(predictions.expectedReplies)} replies
                    </span>
                </div>
                <span className={styles.separator}>•</span>
                <div className={styles.item}>
                    <span className={styles.label}>
                        ~{predictions.expectedEngagementRate}% engagement
                    </span>
                </div>
            </div>
        </div>
    );
}
