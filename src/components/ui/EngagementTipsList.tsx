'use client';

import { useState } from 'react';
import type { EngagementTip } from '@/types/engagement';

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
        <div className="engagement-tips">
            <div className="tips-header">
                <h4 className="tips-title">💡 Tips to Improve</h4>
                {totalPotentialGain > 0 && (
                    <span className="potential-gain">+{totalPotentialGain} potential points</span>
                )}
            </div>

            {highPriority.length > 0 && !showAll && (
                <div className="tip-section">
                    <div className="tip-section-title">⚡ High Priority</div>
                    {highPriority.map(tip => (
                        <TipItem key={tip.id} tip={tip} />
                    ))}
                </div>
            )}

            {mediumPriority.length > 0 && !showAll && (
                <div className="tip-section">
                    <div className="tip-section-title">📌 Medium Priority</div>
                    {mediumPriority.slice(0, maxVisible - highPriority.length).map(tip => (
                        <TipItem key={tip.id} tip={tip} />
                    ))}
                </div>
            )}

            {showAll && (
                <div className="tips-all">
                    {visibleTips.map(tip => (
                        <TipItem key={tip.id} tip={tip} />
                    ))}
                </div>
            )}

            {!showAll && tips.length > maxVisible && (
                <button
                    onClick={() => setShowAll(true)}
                    className="show-all-tips-button"
                    type="button"
                >
                    Show All Tips ({tips.length})
                </button>
            )}

            {showAll && (
                <button
                    onClick={() => setShowAll(false)}
                    className="show-all-tips-button"
                    type="button"
                >
                    Show Less
                </button>
            )}
        </div>
    );
}

interface TipItemProps {
    tip: EngagementTip;
}

function TipItem({ tip }: TipItemProps) {
    return (
        <div className="tip-item" data-priority={tip.priority}>
            <div className="tip-header">
                <span className="tip-title">{tip.title}</span>
                <span className="tip-impact">+{tip.impact}</span>
            </div>
            <p className="tip-description">{tip.description}</p>
            {tip.suggestion && (
                <div className="tip-suggestion">
                    💬 {tip.suggestion}
                </div>
            )}
        </div>
    );
}
