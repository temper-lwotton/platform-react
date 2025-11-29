'use client';

import { useState } from 'react';
import type { EngagementTip } from '@/types/engagement';
import { Icon } from '../Icon';
import { Button, Badge } from '../primitives';
import styles from './EngagementTipsList.module.scss';

interface EngagementTipsListProps {
    tips: EngagementTip[];
    maxVisible?: number;
}

export function EngagementTipsList({ tips, maxVisible = 3 }: EngagementTipsListProps) {
    const [showAll, setShowAll] = useState(false);

    if (!tips || tips.length === 0) {
        return null;
    }

    const highPriority = tips.filter(t => t.priority === 'high');
    const mediumPriority = tips.filter(t => t.priority === 'medium');
    const lowPriority = tips.filter(t => t.priority === 'low');

    const visibleTips = showAll
        ? tips
        : [...highPriority, ...mediumPriority, ...lowPriority].slice(0, maxVisible);

    const totalPotentialGain = tips.reduce((sum, tip) => sum + tip.impact, 0);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h4 className={styles.title}>
                    <Icon icon="lightbulb" size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Tips to Improve
                </h4>
                {totalPotentialGain > 0 && (
                    <Badge variant="success" size="sm">+{totalPotentialGain} potential points</Badge>
                )}
            </div>

            <div className={styles.tips}>
                {visibleTips.map(tip => (
                    <TipItem key={tip.id} tip={tip} />
                ))}
            </div>

            {tips.length > maxVisible && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAll(!showAll)}
                    fullWidth
                >
                    {showAll ? 'Show Less' : `Show All Tips (${tips.length})`}
                </Button>
            )}
        </div>
    );
}

interface TipItemProps {
    tip: EngagementTip;
}

function TipItem({ tip }: TipItemProps) {
    return (
        <div className={`${styles.tip} ${styles[`priority-${tip.priority}`]}`}>
            <div className={styles.tipHeader}>
                <span className={styles.tipTitle}>{tip.title}</span>
                <Badge variant="outline" size="sm">+{tip.impact}</Badge>
            </div>
            <p className={styles.tipDescription}>{tip.description}</p>
            {tip.suggestion && (
                <div className={styles.tipSuggestion}>
                    <Icon icon="comment" size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    {tip.suggestion}
                </div>
            )}
        </div>
    );
}
