import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { AnalyzeEngagementRequest, EngagementAnalysis } from '@/types/engagement';

// Simple in-memory cache (in production, use Redis or similar)
const cache = new Map<string, { data: EngagementAnalysis; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function generateCacheKey(title: string, content: string, excerpt: string): string {
    // Simple hash function for cache key
    const str = `${title}|${content}|${excerpt}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return `engagement:${hash}`;
}

function generateBasicAnalysis(title: string, content: string, excerpt: string): EngagementAnalysis {
    // Fallback heuristic-based analysis if OpenAI fails
    const wordCount = content.split(/\s+/).length;
    const paragraphCount = content.split(/\n\n+/).length;
    const hasQuestion = /\?/.test(content) || /\?/.test(title);
    const hasCallToAction = /(what do you think|share your|tell us|let me know|comment below)/i.test(content);

    // Basic scoring heuristics
    const clarityScore = Math.min(100, 50 + (hasQuestion ? 15 : 0) + (wordCount > 100 && wordCount < 500 ? 20 : 0));
    const structureScore = Math.min(100, 40 + (paragraphCount > 2 ? 20 : 0) + (wordCount > 150 ? 15 : 0));
    const appealScore = Math.min(100, 50 + (hasQuestion ? 20 : 0) + (hasCallToAction ? 15 : 0));
    const overallScore = Math.round((clarityScore + structureScore + appealScore) / 3);

    const tips: EngagementAnalysis['tips'] = [];

    if (!hasQuestion) {
        tips.push({
            id: 'add-question',
            category: 'engagement',
            priority: 'high',
            title: 'Add a Question',
            description: 'Posts with questions get 3x more replies. Consider asking your audience for their thoughts or experiences.',
            impact: 20,
            actionable: true,
            suggestion: 'Try ending with: "What\'s your experience with this?"'
        });
    }

    if (!hasCallToAction) {
        tips.push({
            id: 'add-cta',
            category: 'engagement',
            priority: 'medium',
            title: 'Include a Call-to-Action',
            description: 'Encourage readers to engage by asking them to share their thoughts or experiences.',
            impact: 15,
            actionable: true
        });
    }

    if (wordCount < 100) {
        tips.push({
            id: 'add-detail',
            category: 'clarity',
            priority: 'medium',
            title: 'Add More Detail',
            description: 'Posts with 150-500 words tend to get more engagement. Consider expanding on your ideas.',
            impact: 12,
            actionable: true
        });
    }

    return {
        scores: {
            overall: overallScore,
            clarity: clarityScore,
            structure: structureScore,
            appeal: appealScore
        },
        sentiment: {
            tone: 'neutral',
            confidence: 0.6
        },
        metrics: {
            wordCount,
            paragraphCount,
            hasQuestion,
            hasCallToAction,
            readingLevel: wordCount < 150 ? '8th grade' : '10th grade'
        },
        tips,
        predictions: {
            expectedViews: overallScore > 70 ? 'high' : overallScore > 50 ? 'medium' : 'low',
            expectedReplies: hasQuestion ? 'medium' : 'low',
            expectedEngagementRate: Math.round(overallScore * 0.15)
        }
    };
}

export async function POST(request: NextRequest) {
    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your-openai-api-key-here') {
        return NextResponse.json(
            { error: 'OpenAI API key not configured' },
            { status: 500 }
        );
    }

    // Parse request body
    let body: AnalyzeEngagementRequest;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }

    // Validate required fields
    if (!body.title || !body.content || !body.excerpt) {
        return NextResponse.json(
            { error: 'Title, content, and excerpt are required' },
            { status: 400 }
        );
    }

    // Check cache
    const cacheKey = generateCacheKey(body.title, body.content, body.excerpt);
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return NextResponse.json({ analysis: cached.data });
    }

    try {
        const openai = new OpenAI({
            apiKey: apiKey,
        });

        const systemPrompt = `You are an expert content engagement analyst. Analyze discussion posts and provide:
1. Engagement scores (0-100) for overall, clarity, structure, and appeal
2. Specific, actionable tips to improve engagement
3. Sentiment analysis
4. Predictions for views and replies

Return ONLY valid JSON in this exact format:
{
  "scores": { "overall": 0-100, "clarity": 0-100, "structure": 0-100, "appeal": 0-100 },
  "sentiment": { "tone": "positive|neutral|negative|mixed", "confidence": 0-1 },
  "metrics": {
    "wordCount": number,
    "paragraphCount": number,
    "hasQuestion": boolean,
    "hasCallToAction": boolean,
    "readingLevel": string
  },
  "tips": [
    {
      "id": "unique-id",
      "category": "structure|clarity|engagement|tone|formatting",
      "priority": "high|medium|low",
      "title": "Brief title",
      "description": "Clear explanation",
      "impact": 0-100,
      "actionable": boolean,
      "suggestion": "Optional specific suggestion"
    }
  ],
  "predictions": {
    "expectedViews": "low|medium|high",
    "expectedReplies": "low|medium|high",
    "expectedEngagementRate": 0-100
  }
}

Guidelines:
- Be encouraging but honest
- Prioritize actionable tips (things user can fix now)
- Impact scores should be realistic (not all tips are +20)
- Limit to 3-5 tips, prioritized by impact
- Focus on what improves engagement, not perfection`;

        const userPrompt = `Analyze this discussion post for engagement potential:

Title: ${body.title}

Content: ${body.content}

Excerpt: ${body.excerpt}

Provide engagement scores, sentiment analysis, and actionable tips to improve engagement.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent) {
            throw new Error('No response from OpenAI');
        }

        // Parse the JSON response
        let analysis: EngagementAnalysis;
        try {
            analysis = JSON.parse(responseContent);
        } catch (parseError) {
            console.error('Failed to parse OpenAI response:', responseContent);
            // Fall back to basic analysis
            analysis = generateBasicAnalysis(body.title, body.content, body.excerpt);
        }

        // Validate the analysis structure
        if (!analysis.scores || !analysis.tips || !analysis.predictions) {
            console.error('Invalid analysis structure from OpenAI');
            analysis = generateBasicAnalysis(body.title, body.content, body.excerpt);
        }

        // Cache the result
        cache.set(cacheKey, { data: analysis, timestamp: Date.now() });

        // Clean up old cache entries (simple cleanup)
        if (cache.size > 100) {
            const now = Date.now();
            for (const [key, value] of cache.entries()) {
                if (now - value.timestamp > CACHE_TTL) {
                    cache.delete(key);
                }
            }
        }

        return NextResponse.json({ analysis });

    } catch (error) {
        console.error('[Engagement] OpenAI API error:', error);

        // Return basic heuristic analysis as fallback
        const fallbackAnalysis = generateBasicAnalysis(body.title, body.content, body.excerpt);
        return NextResponse.json({ analysis: fallbackAnalysis });
    }
}
