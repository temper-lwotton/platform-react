import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { JobSpec } from '@/types/jobforge';
import { JobSpecAnalysis } from '@/types/jobAnalysis';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory cache for analysis results
const cache = new Map<string, { data: JobSpecAnalysis; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Rate limiting
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_USER = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// System prompt for job spec analysis
const SYSTEM_PROMPT = `You are an expert HR technology consultant and job description analyst. Analyze job specifications and provide detailed, actionable feedback to improve quality, inclusivity, and competitiveness.

Your analysis must be:
1. Specific and actionable (not generic advice)
2. Data-driven where possible
3. Focused on improving candidate attraction and quality
4. Inclusive and bias-aware
5. Realistic about market conditions

Return ONLY valid JSON in this exact format:
{
  "scores": {
    "overall": 0-100,
    "clarity": 0-100,
    "completeness": 0-100,
    "appeal": 0-100,
    "competitiveness": 0-100
  },
  "sentiment": {
    "tone": "professional|casual|corporate|mixed",
    "inclusivity": "inclusive|somewhat-inclusive|needs-improvement",
    "confidence": 0-1
  },
  "metrics": {
    "wordCount": number,
    "hasResponsibilities": boolean,
    "hasRequirements": boolean,
    "hasBenefits": boolean,
    "hasSalary": boolean,
    "responsibilitiesCount": number,
    "requirementsCount": number,
    "benefitsCount": number
  },
  "tips": [
    {
      "id": "unique-id-like-tip_clarity_1-or-tip_salary_competitive",
      "category": "clarity|completeness|bias|competitiveness|structure",
      "priority": "high|medium|low",
      "title": "Brief, specific title",
      "description": "Clear explanation of the issue",
      "impact": 0-100,
      "actionable": true,
      "suggestion": "Specific, implementable suggestion",
      "currentValue": "What they have now (if applicable)",
      "suggestedValue": "What to change to (if applicable)",
      "fieldPath": "Field path like 'title' or 'salary.min' (if applicable)"
    }
  ],
  "predictions": {
    "expectedApplications": "low|medium|high",
    "expectedQualifiedCandidates": "low|medium|high",
    "timeToFill": "estimated weeks like '2-4 weeks'",
    "competitivenessLevel": "below-market|market-rate|above-market"
  },
  "biasDetection": {
    "hasBias": boolean,
    "biasTypes": [
      {
        "type": "gender|age|cultural|disability",
        "text": "The problematic phrase",
        "location": "Where it appears",
        "suggestion": "Better alternative",
        "severity": "low|medium|high"
      }
    ],
    "overallSeverity": "none|low|medium|high"
  },
  "salaryBenchmark": {
    "providedRange": { "min": number, "max": number, "currency": string },
    "marketRange": {
      "min": number,
      "max": number,
      "percentile": 0-100
    },
    "recommendation": "increase|decrease|good",
    "notes": "Explanation of salary position"
  },
  "generatedAt": "ISO date string"
}

Scoring Guidelines:
- Clarity (0-100): How clear and understandable the role is
- Completeness (0-100): How much essential information is provided
- Appeal (0-100): How attractive the role is to candidates
- Competitiveness (0-100): How competitive vs market standards
- Overall: Weighted average focusing on completeness and competitiveness

Tips Guidelines:
- Limit to 5-7 most impactful tips
- Prioritize by actual impact on candidate attraction
- Always provide specific suggestions, not generic advice
- Include currentValue and suggestedValue for fields that can be auto-improved
- Use fieldPath for fields that map to the job data structure

Bias Detection Guidelines:
- Flag gendered language (he/she, salesman, chairman)
- Flag age bias (young, energetic, digital native, recent graduate for senior roles)
- Flag cultural bias (native speaker, cultural fit)
- Flag disability bias (must be able to, physically capable)
- Provide inclusive alternatives

Salary Benchmarking Guidelines:
- Consider industry, location, and seniority level
- UK salaries: Junior £20-35K, Mid £35-60K, Senior £60-90K, Lead £90-130K (adjust by industry)
- US salaries: Generally 30-50% higher than UK
- Tech industry: 20-30% premium
- Finance industry: 30-50% premium for certain roles`;

// Generate user prompt from job data
function generateUserPrompt(jobData: Partial<JobSpec>): string {
  const salaryStr = jobData.salary?.min && jobData.salary?.max
    ? `${jobData.salary.currency} ${jobData.salary.min.toLocaleString()} - ${jobData.salary.max.toLocaleString()} per ${jobData.salary.period}`
    : 'Not specified';

  return `Analyze this job specification:

Title: ${jobData.title}
Industry: ${jobData.industry}
Seniority: ${jobData.seniorityLevel}
Location: ${jobData.location?.city || 'Not specified'}, ${jobData.location?.country || 'Not specified'} (${jobData.location?.workType || 'Not specified'})
Salary: ${salaryStr}

Overview:
${jobData.description?.overview || 'Not provided'}

Responsibilities (${jobData.description?.responsibilities?.length || 0}):
${jobData.description?.responsibilities?.map((r, i) => `${i + 1}. ${r}`).join('\n') || 'Not provided'}

Required Skills (${jobData.description?.requirements?.required?.length || 0}):
${jobData.description?.requirements?.required?.map((r, i) => `${i + 1}. ${r.text}`).join('\n') || 'Not provided'}

Desirable Skills (${jobData.description?.requirements?.desirable?.length || 0}):
${jobData.description?.requirements?.desirable?.map((r, i) => `${i + 1}. ${r.text}`).join('\n') || 'Not provided'}

${jobData.description?.benefits && jobData.description.benefits.length > 0 ? `Benefits (${jobData.description.benefits.length}):
${jobData.description.benefits.map((b, i) => `${i + 1}. ${b}`).join('\n')}` : 'Benefits: Not provided'}

Provide comprehensive analysis with scores, specific actionable tips, bias detection, and salary benchmarking.`;
}

// Generate cache key
function generateCacheKey(jobData: Partial<JobSpec>): string {
  const key = JSON.stringify({
    title: jobData.title,
    industry: jobData.industry,
    seniorityLevel: jobData.seniorityLevel,
    salaryMin: jobData.salary?.min,
    salaryMax: jobData.salary?.max,
    overview: jobData.description?.overview?.substring(0, 100),
  });

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return `jobspec:${Math.abs(hash)}`;
}

// Check rate limit
function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = requestCounts.get(userId);

  if (!record || now > record.resetAt) {
    requestCounts.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: MAX_REQUESTS_PER_USER - 1 };
  }

  if (record.count >= MAX_REQUESTS_PER_USER) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_USER - record.count };
}

// Ensure unique tip IDs
function ensureUniqueTipIds(tips: any[]): any[] {
  const seenIds = new Set<string>();
  return tips.map((tip, index) => {
    let uniqueId = tip.id;

    // If ID is missing or duplicate, generate a new one
    if (!uniqueId || seenIds.has(uniqueId)) {
      uniqueId = `tip_${tip.category}_${index}_${Date.now()}`;
    }

    seenIds.add(uniqueId);
    return { ...tip, id: uniqueId };
  });
}

// Validate analysis response
function validateAnalysis(analysis: any): JobSpecAnalysis | null {
  try {
    // Check required fields
    if (!analysis.scores || !analysis.tips || !analysis.predictions) {
      return null;
    }

    // Validate score ranges
    const scores = analysis.scores;
    if (
      scores.overall < 0 || scores.overall > 100 ||
      scores.clarity < 0 || scores.clarity > 100 ||
      scores.completeness < 0 || scores.completeness > 100 ||
      scores.appeal < 0 || scores.appeal > 100 ||
      scores.competitiveness < 0 || scores.competitiveness > 100
    ) {
      return null;
    }

    // Validate tips structure
    if (!Array.isArray(analysis.tips)) {
      return null;
    }

    for (const tip of analysis.tips) {
      if (!tip.id || !tip.category || !tip.title || !tip.description) {
        return null;
      }
    }

    // Ensure all tip IDs are unique
    analysis.tips = ensureUniqueTipIds(analysis.tips);

    return analysis as JobSpecAnalysis;
  } catch (error) {
    return null;
  }
}

// Generate fallback analysis (basic heuristics)
function generateFallbackAnalysis(jobData: Partial<JobSpec>): JobSpecAnalysis {
  const overview = jobData.description?.overview || '';
  const responsibilities = jobData.description?.responsibilities || [];
  const requiredSkills = jobData.description?.requirements?.required || [];
  const desirableSkills = jobData.description?.requirements?.desirable || [];
  const benefits = jobData.description?.benefits || [];

  const wordCount = overview.split(' ').length;
  const hasResponsibilities = responsibilities.length > 0;
  const hasRequirements = requiredSkills.length > 0;
  const hasBenefits = benefits.length > 0;
  const hasSalary = jobData.salary && jobData.salary.min > 0;

  // Calculate scores
  let clarityScore = 50;
  if (wordCount > 50) clarityScore += 20;
  if (wordCount > 100) clarityScore += 10;

  let completenessScore = 0;
  if (jobData.title) completenessScore += 15;
  if (hasResponsibilities) completenessScore += 25;
  if (hasRequirements) completenessScore += 25;
  if (hasBenefits) completenessScore += 15;
  if (hasSalary) completenessScore += 20;

  let appealScore = 60;
  if (hasBenefits) appealScore += 20;
  if (wordCount > 100) appealScore += 10;
  if (benefits.length > 3) appealScore += 10;

  const salaryMid = jobData.salary ? (jobData.salary.min + jobData.salary.max) / 2 : 0;
  let competitivenessScore = 70;

  const overallScore = Math.round(
    (clarityScore + completenessScore + appealScore + competitivenessScore) / 4
  );

  const tips = [];
  if (!hasResponsibilities) {
    tips.push({
      id: 'tip_1',
      category: 'completeness' as const,
      priority: 'high' as const,
      title: 'Add Key Responsibilities',
      description: 'Your job spec is missing a responsibilities section.',
      impact: 25,
      actionable: true,
      suggestion: 'Add 3-5 bullet points describing the main duties.',
    });
  }

  return {
    scores: {
      overall: overallScore,
      clarity: clarityScore,
      completeness: completenessScore,
      appeal: appealScore,
      competitiveness: competitivenessScore,
    },
    sentiment: {
      tone: 'professional' as const,
      inclusivity: 'inclusive' as const,
      confidence: 0.5,
    },
    metrics: {
      wordCount,
      hasResponsibilities,
      hasRequirements,
      hasBenefits,
      hasSalary,
      responsibilitiesCount: responsibilities.length,
      requirementsCount: requiredSkills.length + desirableSkills.length,
      benefitsCount: benefits.length,
    },
    tips,
    predictions: {
      expectedApplications: 'medium' as const,
      expectedQualifiedCandidates: 'medium' as const,
      timeToFill: '3-5 weeks',
      competitivenessLevel: 'market-rate' as const,
    },
    biasDetection: {
      hasBias: false,
      biasTypes: [],
      overallSeverity: 'none' as const,
    },
    generatedAt: new Date(),
  };
}

// Main API handler
export async function POST(request: NextRequest) {
  try {
    // Check API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your-openai-api-key-here') {
      console.error('[JobForge] OpenAI API key not configured');

      // Return fallback analysis
      const jobData = await request.json();
      const fallbackAnalysis = generateFallbackAnalysis(jobData);

      return NextResponse.json({
        analysis: fallbackAnalysis,
        warning: 'Using basic analysis (AI service not configured)',
      });
    }

    // Parse request body
    const jobData: Partial<JobSpec> = await request.json();

    // Basic validation
    if (!jobData.title || !jobData.description?.overview) {
      return NextResponse.json(
        { error: 'Missing required fields: title and description' },
        { status: 400 }
      );
    }

    // Check rate limit (using IP as user ID for now)
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = checkRateLimit(clientIp);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
          fallbackAnalysis: generateFallbackAnalysis(jobData)
        },
        { status: 429 }
      );
    }

    // Check cache
    const cacheKey = generateCacheKey(jobData);
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[JobForge] Cache hit:', cacheKey);
      return NextResponse.json({
        analysis: cached.data,
        cached: true,
      });
    }

    // Call OpenAI API
    console.log('[JobForge] Calling OpenAI API...');
    const userPrompt = generateUserPrompt(jobData);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse and validate response
    const parsedAnalysis = JSON.parse(responseText);
    const validatedAnalysis = validateAnalysis(parsedAnalysis);

    if (!validatedAnalysis) {
      console.error('[JobForge] Invalid analysis structure from OpenAI');
      const fallbackAnalysis = generateFallbackAnalysis(jobData);
      return NextResponse.json({
        analysis: fallbackAnalysis,
        warning: 'Using basic analysis due to validation error',
      });
    }

    // Cache the result
    cache.set(cacheKey, {
      data: validatedAnalysis,
      timestamp: Date.now(),
    });

    // Log usage (for cost tracking)
    console.log('[JobForge] Usage:', {
      promptTokens: completion.usage?.prompt_tokens,
      completionTokens: completion.usage?.completion_tokens,
      totalTokens: completion.usage?.total_tokens,
    });

    return NextResponse.json({
      analysis: validatedAnalysis,
    });

  } catch (error: any) {
    console.error('[JobForge] API error:', error);

    // Handle specific OpenAI errors
    if (error.status === 429) {
      const jobData = await request.json();
      return NextResponse.json({
        error: 'Too many requests to AI service. Please try again in a moment.',
        fallbackAnalysis: generateFallbackAnalysis(jobData),
      }, { status: 429 });
    }

    if (error.status === 401) {
      return NextResponse.json({
        error: 'AI service authentication error. Please contact support.',
      }, { status: 500 });
    }

    // General fallback
    try {
      const jobData = await request.json();
      const fallbackAnalysis = generateFallbackAnalysis(jobData);
      return NextResponse.json({
        analysis: fallbackAnalysis,
        warning: 'Using basic analysis due to temporary AI service unavailability',
      });
    } catch {
      return NextResponse.json({
        error: 'Failed to process request',
      }, { status: 500 });
    }
  }
}
