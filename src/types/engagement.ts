export interface EngagementScores {
    overall: number;        // 0-100: Overall engagement potential
    clarity: number;        // 0-100: How clear/understandable
    structure: number;      // 0-100: Organization quality
    appeal: number;         // 0-100: How interesting/compelling
}

export interface EngagementSentiment {
    tone: 'positive' | 'neutral' | 'negative' | 'mixed';
    confidence: number;     // 0-1: AI confidence in assessment
}

export interface EngagementMetrics {
    wordCount: number;
    paragraphCount: number;
    hasQuestion: boolean;
    hasCallToAction: boolean;
    readingLevel: string;   // e.g., "8th grade", "college"
}

export interface EngagementTip {
    id: string;
    category: 'structure' | 'clarity' | 'engagement' | 'tone' | 'formatting';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: number;           // 0-100: potential score improvement
    actionable: boolean;      // Can user act on this now?
    suggestion?: string;      // Specific suggestion if applicable
}

export interface EngagementPredictions {
    expectedViews: 'low' | 'medium' | 'high';
    expectedReplies: 'low' | 'medium' | 'high';
    expectedEngagementRate: number; // 0-100%
}

export interface EngagementAnalysis {
    scores: EngagementScores;
    sentiment: EngagementSentiment;
    metrics: EngagementMetrics;
    tips: EngagementTip[];
    predictions: EngagementPredictions;
}

export interface AnalyzeEngagementRequest {
    title: string;
    content: string;
    excerpt: string;
    spaceId?: number;
}

export interface AnalyzeEngagementResponse {
    analysis: EngagementAnalysis;
}
