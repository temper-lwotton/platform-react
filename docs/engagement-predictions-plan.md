# Engagement Predictions Implementation Plan

## Overview

Add AI-powered engagement predictions to the discussion creation workflow, providing users with a score and actionable tips to improve their post's potential for engagement.

---

## Goals

1. **Predict Engagement Potential**: Analyze title, content, and excerpt to estimate engagement likelihood
2. **Provide Actionable Feedback**: Give specific, actionable tips users can implement
3. **Educate Users**: Help users understand what makes content engaging
4. **Non-Blocking UX**: Show predictions without preventing posting
5. **Real-time Updates**: Recalculate when user makes changes

---

## Architecture Options

### Option A: Single API Call (Recommended)
**Pros:**
- Faster (one API call vs multiple)
- Cheaper (single OpenAI request)
- Simpler state management

**Cons:**
- More complex prompt engineering
- All-or-nothing (if one part fails, all fails)

### Option B: Separate Analysis Components
**Pros:**
- Can show progressive results
- Each metric can fail independently
- Easier to test individual components

**Cons:**
- Multiple API calls = more expensive
- Slower overall experience
- More complex orchestration

**Recommendation: Option A** - Use a single, well-structured OpenAI call that returns all engagement metrics at once.

---

## Data Model

### Request Structure
```typescript
interface AnalyzeEngagementRequest {
  title: string;
  content: string;
  excerpt: string;
  spaceId?: number; // Optional: for space-specific context
}
```

### Response Structure
```typescript
interface EngagementAnalysis {
  scores: {
    overall: number;        // 0-100: Overall engagement potential
    clarity: number;        // 0-100: How clear/understandable
    structure: number;      // 0-100: Organization quality
    appeal: number;         // 0-100: How interesting/compelling
  };

  sentiment: {
    tone: 'positive' | 'neutral' | 'negative' | 'mixed';
    confidence: number;     // 0-1: AI confidence in assessment
  };

  metrics: {
    wordCount: number;
    paragraphCount: number;
    hasQuestion: boolean;
    hasCallToAction: boolean;
    readingLevel: string;   // e.g., "8th grade", "college"
  };

  tips: EngagementTip[];

  predictions: {
    expectedViews: 'low' | 'medium' | 'high';
    expectedReplies: 'low' | 'medium' | 'high';
    expectedEngagementRate: number; // 0-100%
  };
}

interface EngagementTip {
  id: string;
  category: 'structure' | 'clarity' | 'engagement' | 'tone' | 'formatting';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: number;           // 0-100: potential score improvement
  actionable: boolean;      // Can user act on this now?
  suggestion?: string;      // Specific suggestion if applicable
}
```

### Example Response
```json
{
  "scores": {
    "overall": 73,
    "clarity": 80,
    "structure": 65,
    "appeal": 75
  },
  "sentiment": {
    "tone": "neutral",
    "confidence": 0.85
  },
  "metrics": {
    "wordCount": 342,
    "paragraphCount": 4,
    "hasQuestion": true,
    "hasCallToAction": false,
    "readingLevel": "10th grade"
  },
  "tips": [
    {
      "id": "add-headers",
      "category": "structure",
      "priority": "high",
      "title": "Add Section Headers",
      "description": "Breaking your content into sections with clear headers improves readability by 40%",
      "impact": 15,
      "actionable": true,
      "suggestion": "Consider adding headers like 'Background', 'Problem', and 'Solution'"
    },
    {
      "id": "shorten-paragraphs",
      "category": "structure",
      "priority": "medium",
      "title": "Shorten Long Paragraphs",
      "description": "Paragraph 2 has 178 words. Aim for 50-100 words per paragraph.",
      "impact": 8,
      "actionable": true
    },
    {
      "id": "add-cta",
      "category": "engagement",
      "priority": "high",
      "title": "Include a Call-to-Action",
      "description": "Posts with questions or calls-to-action get 3x more replies",
      "impact": 20,
      "actionable": true,
      "suggestion": "Try ending with: 'What's your experience with this?'"
    },
    {
      "id": "positive-framing",
      "category": "tone",
      "priority": "low",
      "title": "Consider More Positive Framing",
      "description": "Your tone is slightly negative. Positive posts tend to get more engagement.",
      "impact": 5,
      "actionable": false
    }
  ],
  "predictions": {
    "expectedViews": "medium",
    "expectedReplies": "medium",
    "expectedEngagementRate": 12
  }
}
```

---

## UI Component Design

### Option 1: Inline Card (Recommended)
Show the analysis as a card between excerpt selector and submit button.

```
┌─────────────────────────────────────────────────────┐
│ 📊 Engagement Analysis                               │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Overall Score: 73/100 [████████████░░░░░░░]        │
│                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ Clarity │ │Structure│ │ Appeal  │               │
│  │   80    │ │   65    │ │   75    │               │
│  └─────────┘ └─────────┘ └─────────┘               │
│                                                      │
│  💡 Tips to Improve (+28 potential points)          │
│                                                      │
│  ⚡ High Priority                                    │
│  • Add Section Headers                      (+15)   │
│    Breaking content into sections improves...       │
│                                                      │
│  • Include a Call-to-Action                 (+20)   │
│    Try ending with: "What's your experience..."     │
│                                                      │
│  📌 Medium Priority                                  │
│  • Shorten Long Paragraphs                  (+8)    │
│    Paragraph 2 has 178 words. Aim for 50-100...     │
│                                                      │
│  [Show All Tips (4)]                                 │
│                                                      │
│  Expected: Medium views • Medium replies • 12% rate │
└─────────────────────────────────────────────────────┘
```

### Option 2: Modal/Dialog
Open analysis in a modal when requested.

**Pros:**
- Doesn't clutter main form
- More space for detailed feedback

**Cons:**
- Requires extra user action
- Less visible, might be ignored

### Option 3: Side Panel
Show analysis in a collapsible side panel.

**Pros:**
- Available but not intrusive
- Can stay visible while editing

**Cons:**
- Complex responsive design
- Takes up screen real estate

**Recommendation: Option 1 (Inline Card)** - Most visible, no extra clicks needed, clearly actionable.

---

## User Interaction Flow

### When to Show Analysis

**Option A: Automatic After Excerpt Selection**
- User completes Step 2 (excerpt selection)
- Automatically analyze and show results
- User can review tips before posting

**Option B: On-Demand Button**
- Show "Analyze Engagement" button
- User clicks to get analysis
- More control, but extra step

**Option C: Real-time as User Types**
- Debounced analysis while typing
- Show live score updates
- Most interactive, but expensive

**Recommendation: Option A** - Automatic after Step 2 excerpt selection, since we already have all the data needed.

### Integration Points

```
Step 1: Content Entry
  ↓
  [User clicks "Next: AI Enhancement"]
  ↓
Step 2: Excerpt Selection
  ↓
  [Auto-trigger: Engagement Analysis API call]
  ↓
  [Show loading state: "Analyzing engagement..."]
  ↓
Step 2 Enhanced: Excerpt + Engagement Analysis
  ↓
  [User reviews tips, optionally goes back to edit]
  ↓
  [User clicks "Post Discussion"]
```

### Handling Analysis Failures

If engagement analysis fails:
1. Log error (don't block user)
2. Show generic encouragement message
3. Allow posting without analysis
4. Optionally show "Retry Analysis" button

---

## OpenAI Prompt Engineering

### System Prompt
```
You are an expert content engagement analyst. Analyze discussion posts and provide:
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
- Focus on what improves engagement, not perfection
```

### User Prompt Template
```
Analyze this discussion post for engagement potential:

Title: {{title}}

Content: {{content}}

Excerpt: {{excerpt}}

Provide engagement scores, sentiment analysis, and actionable tips to improve engagement.
```

---

## API Implementation

### Endpoint
```
POST /api/discussions/analyze-engagement
Authorization: Bearer {token}

Request Body:
{
  "title": "string",
  "content": "string",
  "excerpt": "string",
  "spaceId": number (optional)
}

Response:
{
  "analysis": EngagementAnalysis
}

Error Response:
{
  "error": "string"
}
```

### Implementation Considerations

1. **Rate Limiting**
   - Limit to 5 analyses per user per hour
   - Cache results for 5 minutes (if user goes back/forward)

2. **Cost Optimization**
   - Use GPT-3.5-turbo for speed and cost
   - Truncate very long content (max 2000 words)
   - Consider GPT-4 for premium users only

3. **Caching Strategy**
   ```typescript
   // Cache key based on content hash
   const cacheKey = `engagement:${hash(title + content + excerpt)}`;
   const cached = await cache.get(cacheKey);
   if (cached) return cached;

   const result = await analyzeWithOpenAI(...);
   await cache.set(cacheKey, result, { ttl: 300 }); // 5 min
   return result;
   ```

4. **Fallback for API Failures**
   ```typescript
   try {
     return await analyzeWithOpenAI(...);
   } catch (error) {
     // Return basic heuristic-based analysis
     return generateBasicAnalysis(title, content, excerpt);
   }
   ```

---

## Component Architecture

### File Structure
```
src/
├── app/api/discussions/
│   └── analyze-engagement/
│       └── route.ts                    # API endpoint
├── components/ui/
│   ├── EngagementAnalysis.tsx          # Main analysis card
│   ├── EngagementScoreBar.tsx          # Score visualization
│   ├── EngagementTipsList.tsx          # Tips list component
│   └── EngagementPredictions.tsx       # Predictions display
├── lib/
│   ├── engagement.ts                   # Client-side API calls
│   └── engagement-utils.ts             # Helpers (scoring, formatting)
└── types/
    └── engagement.ts                   # TypeScript interfaces
```

### React Components

#### EngagementAnalysis.tsx
```typescript
interface EngagementAnalysisProps {
  analysis: EngagementAnalysis;
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
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState onRetry={onRetry} />;
  if (!analysis) return null;

  return (
    <div className="engagement-analysis-card">
      <header>
        <h3>📊 Engagement Analysis</h3>
        <OverallScore score={analysis.scores.overall} />
      </header>

      <EngagementScoreBar scores={analysis.scores} />

      <EngagementTipsList tips={analysis.tips} />

      <EngagementPredictions predictions={analysis.predictions} />
    </div>
  );
}
```

#### EngagementScoreBar.tsx
```typescript
interface EngagementScoreBarProps {
  scores: {
    clarity: number;
    structure: number;
    appeal: number;
  };
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

function ScoreItem({ label, score }: { label: string; score: number }) {
  const getColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  return (
    <div className="score-item">
      <div className="score-label">{label}</div>
      <div className="score-value" data-color={getColor(score)}>
        {score}
      </div>
    </div>
  );
}
```

#### EngagementTipsList.tsx
```typescript
interface EngagementTipsListProps {
  tips: EngagementTip[];
  maxVisible?: number;
}

export function EngagementTipsList({
  tips,
  maxVisible = 3
}: EngagementTipsListProps) {
  const [showAll, setShowAll] = useState(false);

  const highPriority = tips.filter(t => t.priority === 'high');
  const mediumPriority = tips.filter(t => t.priority === 'medium');
  const lowPriority = tips.filter(t => t.priority === 'low');

  const visibleTips = showAll
    ? tips
    : [...highPriority, ...mediumPriority].slice(0, maxVisible);

  const totalPotentialGain = tips.reduce((sum, tip) => sum + tip.impact, 0);

  return (
    <div className="engagement-tips">
      <header className="tips-header">
        <h4>💡 Tips to Improve</h4>
        <span className="potential-gain">+{totalPotentialGain} potential points</span>
      </header>

      {highPriority.length > 0 && (
        <TipSection
          title="⚡ High Priority"
          tips={highPriority}
          visible={showAll}
        />
      )}

      {mediumPriority.length > 0 && (
        <TipSection
          title="📌 Medium Priority"
          tips={mediumPriority}
          visible={showAll}
        />
      )}

      {!showAll && tips.length > maxVisible && (
        <button
          onClick={() => setShowAll(true)}
          className="show-all-tips-button"
        >
          Show All Tips ({tips.length})
        </button>
      )}
    </div>
  );
}

function TipItem({ tip }: { tip: EngagementTip }) {
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
```

---

## Integration into Multi-Step Workflow

### Modified Step 2 Component

```typescript
// In /posts/new/page.tsx

const [engagementAnalysis, setEngagementAnalysis] = useState<EngagementAnalysis | null>(null);

// Analyze engagement mutation
const analyzeEngagementMutation = useMutation({
  mutationFn: async () => {
    const res = await fetch('/api/discussions/analyze-engagement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        content: content.trim(),
        excerpt: selectedExcerpt.trim(),
        spaceId: Number(selectedSpaceId),
      }),
    });

    if (!res.ok) throw new Error('Analysis failed');
    return res.json();
  },
  onSuccess: (data) => {
    setEngagementAnalysis(data.analysis);
  },
});

// Trigger after excerpt selection
useEffect(() => {
  if (currentStep === 2 && selectedExcerpt && !engagementAnalysis) {
    analyzeEngagementMutation.mutate();
  }
}, [currentStep, selectedExcerpt]);

// In Step 2 JSX
{currentStep === 2 && (
  <form className="new-post-form" onSubmit={handleFinalSubmit}>
    <ExcerptSelector {...excerptProps} />

    <EngagementAnalysis
      analysis={engagementAnalysis}
      isLoading={analyzeEngagementMutation.isPending}
      error={analyzeEngagementMutation.error?.message}
      onRetry={() => analyzeEngagementMutation.mutate()}
    />

    {/* Submit buttons */}
  </form>
)}
```

---

## CSS Styling

### Key Classes Needed

```css
/* Main card */
.engagement-analysis-card {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  background: #f9fafb;
}

/* Overall score */
.overall-score {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.score-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.score-circle[data-score="high"] { /* 80-100 */
  background: #d1fae5;
  color: #065f46;
}

.score-circle[data-score="medium"] { /* 60-79 */
  background: #fef3c7;
  color: #92400e;
}

.score-circle[data-score="low"] { /* 0-59 */
  background: #fee2e2;
  color: #991b1b;
}

/* Individual scores */
.engagement-scores {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1rem 0;
}

.score-item {
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 6px;
}

/* Tips section */
.engagement-tips {
  margin: 1.5rem 0;
}

.tip-item {
  padding: 1rem;
  margin: 0.75rem 0;
  background: white;
  border-left: 4px solid #d1d5db;
  border-radius: 4px;
}

.tip-item[data-priority="high"] {
  border-left-color: #ef4444;
}

.tip-item[data-priority="medium"] {
  border-left-color: #f59e0b;
}

.tip-item[data-priority="low"] {
  border-left-color: #6b7280;
}

.tip-suggestion {
  background: #eff6ff;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  font-style: italic;
}

/* Predictions */
.engagement-predictions {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #eff6ff;
  border-radius: 6px;
  font-size: 0.9rem;
}
```

---

## Testing Strategy

### Unit Tests
1. **OpenAI Response Parsing**
   - Valid JSON responses
   - Malformed responses
   - Missing fields

2. **Score Calculations**
   - Boundary conditions (0, 50, 100)
   - Invalid scores (negative, > 100)

3. **Tip Prioritization**
   - Sort by priority
   - Filter by actionable
   - Calculate total impact

### Integration Tests
1. **API Endpoint**
   - Valid request → success response
   - Missing fields → 400 error
   - OpenAI failure → fallback response

2. **Component Rendering**
   - Loading state
   - Error state with retry
   - Success state with all elements

### E2E Tests
1. Complete workflow: Step 1 → Step 2 → Analysis → Post
2. Going back after seeing analysis
3. Retrying failed analysis
4. Posting without waiting for analysis

---

## Cost Analysis

### OpenAI Costs (GPT-3.5-turbo)
- Input: ~500 tokens (title + content + excerpt + prompt)
- Output: ~400 tokens (JSON response)
- **Total: ~900 tokens per analysis**
- **Cost: ~$0.0014 per analysis**

### Expected Usage
- If 1000 posts/month: ~$1.40/month
- If 10,000 posts/month: ~$14/month
- If 100,000 posts/month: ~$140/month

### Optimization Strategies
1. **Cache aggressively** (5-10 min TTL)
2. **Rate limit** (5 analyses/hour per user)
3. **Require minimum content** (skip for very short posts)
4. **Use GPT-3.5** (not GPT-4, unless premium)

---

## Success Metrics

### Quantitative
1. **Adoption Rate**: % of users who view analysis before posting
2. **Action Rate**: % who edit content after seeing tips
3. **Correlation**: Posts with higher scores → higher engagement
4. **Cost per Post**: Track OpenAI API costs

### Qualitative
1. **User Feedback**: Survey users on helpfulness
2. **Tip Effectiveness**: Which tips are acted on most
3. **False Positives**: High-scored posts with low engagement

---

## Future Enhancements

### Phase 1 (Current Plan)
- Basic scoring and tips
- Inline display in Step 2

### Phase 2
- Historical data integration (compare to similar past posts)
- Personalized tips based on user's posting history
- A/B testing different prompts for accuracy

### Phase 3
- Real-time analysis as user types (debounced)
- Suggest specific edits (like Grammarly)
- ML model trained on actual engagement data

### Phase 4
- Image analysis (if post includes images)
- Optimal posting time suggestions
- Audience targeting recommendations

---

## Security & Privacy

1. **No Data Storage**
   - Don't store analysis results long-term
   - Don't send to OpenAI: user PII, sensitive data

2. **Rate Limiting**
   - Prevent abuse/spam
   - 5 analyses per user per hour

3. **Content Filtering**
   - Validate input length (max 2000 words)
   - Sanitize before sending to OpenAI

4. **Error Handling**
   - Never expose OpenAI API errors to users
   - Log failures for monitoring

---

## Implementation Timeline

### Week 1: Backend
- [ ] Create `/api/discussions/analyze-engagement` endpoint
- [ ] Implement OpenAI integration with prompt
- [ ] Add caching layer
- [ ] Write tests

### Week 2: Frontend Components
- [ ] Create TypeScript interfaces
- [ ] Build `EngagementAnalysis` component
- [ ] Build sub-components (ScoreBar, TipsList, Predictions)
- [ ] Add CSS styling

### Week 3: Integration
- [ ] Integrate into Step 2 workflow
- [ ] Add loading/error states
- [ ] Test complete flow
- [ ] Handle edge cases

### Week 4: Polish & Launch
- [ ] User testing
- [ ] Performance optimization
- [ ] Documentation
- [ ] Monitor costs and usage

---

*Document created: 2025*
*Status: Planning Phase*
