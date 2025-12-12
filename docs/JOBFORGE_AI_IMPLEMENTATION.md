# JobForge AI Implementation

## Overview

JobForge now uses real OpenAI GPT-4 Turbo for job specification analysis, providing:
- **Quality scores** (clarity, completeness, appeal, competitiveness)
- **Actionable improvement tips** with specific suggestions
- **Bias detection** (gender, age, cultural, disability biases)
- **Salary benchmarking** against market rates
- **Predictive analytics** (expected applications, time to fill)

## Architecture

```
Frontend (Next.js App Router)
  └─> useJobAnalysis() hook in /src/lib/jobforge/hooks.ts
      └─> POST /api/jobforge/analyze-job-spec
          └─> OpenAI GPT-4 Turbo API
              └─> JSON structured response
```

## Files Created/Modified

### New Files
- `/src/app/api/jobforge/analyze-job-spec/route.ts` - API endpoint for job analysis
- `/docs/JOBFORGE_AI_IMPLEMENTATION.md` - This documentation

### Modified Files
- `/src/lib/jobforge/hooks.ts` - Updated `useJobAnalysis()` to use real API
- `/src/app/(protected)/jobforge/create-new/page.tsx` - Already integrated (no changes needed)

## Configuration

### Environment Variables

The OpenAI API key is already configured in `.env.local`:

```bash
OPENAI_API_KEY=sk-proj-...
```

**Important:** This file is git-ignored and contains sensitive credentials. Never commit it.

### Model Configuration

- **Model**: `gpt-4-turbo-preview`
- **Temperature**: `0.7` (balanced creativity and consistency)
- **Max Tokens**: `2000` (sufficient for comprehensive analysis)
- **Response Format**: JSON mode (ensures valid structured output)

## Features

### 1. Job Spec Analysis

The AI analyzes job specifications across multiple dimensions:

**Scoring (0-100):**
- **Clarity**: How clear and understandable the role is
- **Completeness**: How much essential information is provided
- **Appeal**: How attractive the role is to candidates
- **Competitiveness**: How competitive vs market standards
- **Overall**: Weighted average of all scores

**Example Request:**
```typescript
const analysis = await analyzeJobSpec({
  title: 'Senior Software Engineer',
  industry: 'Technology',
  seniorityLevel: 'senior',
  location: { city: 'London', country: 'UK', workType: 'hybrid' },
  salary: { min: 60000, max: 80000, currency: 'GBP', period: 'yearly' },
  description: {
    overview: 'We are seeking...',
    responsibilities: ['Lead development...', 'Mentor...'],
    requirements: {
      required: [{ text: '5+ years React' }],
      desirable: [{ text: 'AWS experience' }]
    },
    benefits: ['Health insurance', 'Remote work']
  }
});
```

### 2. Actionable Tips

The AI provides 5-7 specific, prioritized tips with:
- **Impact score**: Potential improvement in overall score
- **Priority**: high/medium/low
- **Current vs suggested values**: For auto-applicable suggestions
- **Field path**: Maps to job data structure for auto-apply

**Example Tip:**
```json
{
  "id": "tip_salary_increase",
  "category": "competitiveness",
  "priority": "high",
  "title": "Increase Salary Range",
  "description": "The current salary is below market average for senior roles in London.",
  "impact": 25,
  "currentValue": "£60,000 - £80,000",
  "suggestedValue": "£75,000 - £95,000",
  "fieldPath": "salary.min",
  "suggestion": "Increase by 20% to match market rates"
}
```

### 3. Bias Detection

Automatically identifies problematic language:
- **Gender bias**: "he/she", "salesman", "chairman"
- **Age bias**: "young", "energetic", "digital native"
- **Cultural bias**: "native speaker", "cultural fit"
- **Disability bias**: "must be able to", "physically capable"

Provides inclusive alternatives for each detected issue.

### 4. Salary Benchmarking

Compares provided salary against market data:
- UK benchmarks by seniority level
- Industry adjustments (tech +20%, finance +30-50%)
- Location considerations
- Percentile ranking

### 5. Predictive Analytics

Predicts job posting outcomes:
- **Expected applications**: low/medium/high
- **Qualified candidates**: low/medium/high
- **Time to fill**: estimated weeks
- **Competitiveness level**: below-market/market-rate/above-market

## Caching & Performance

### In-Memory Cache
- **TTL**: 5 minutes
- **Cache key**: Hash of title, industry, seniority, salary, overview
- **Expected hit rate**: 20-30%

### Response Time
- **Cache hit**: <50ms
- **Cache miss**: 2-4 seconds (OpenAI API call)
- **Fallback**: <100ms (basic heuristics)

## Rate Limiting

### Per-User Limits
- **10 analyses/hour** per IP address
- **50 analyses/day** per IP address
- Returns cached fallback analysis when limit exceeded

### Global Limits
- OpenAI Tier 1: **500 requests/day**, **10,000 tokens/min**
- Average analysis: **1,000 input + 1,500 output tokens**
- Supports ~300 analyses/day at peak

## Cost Management

### Estimated Costs (GPT-4 Turbo)

| Usage Scenario | Analyses/Day | Cost/Day | Cost/Month |
|----------------|--------------|----------|------------|
| Light (MVP) | 50 | $1 | $30 |
| Medium | 200 | $4 | $120 |
| Heavy | 1,000 | $20 | $600 |

**Calculation:**
- Input: ~1,000 tokens × $0.01/1K = $0.01
- Output: ~1,500 tokens × $0.03/1K = $0.045
- **Total per analysis**: ~$0.055

**With 30% cache hit rate:**
- Actual cost per analysis: ~$0.039

## Error Handling

### Fallback Strategy

The system gracefully degrades through multiple fallback levels:

1. **OpenAI API** (primary)
2. **Basic heuristic analysis** (if API fails)
3. **Minimal fallback** (if complete failure)

### Error Scenarios

| Error | Response | UX Impact |
|-------|----------|-----------|
| Missing API key | Basic heuristic analysis | Warning message shown |
| Rate limit (429) | Cached basic analysis | Temporary delay suggested |
| API timeout | Basic heuristic analysis | Warning message shown |
| Invalid response | Basic heuristic analysis | Warning message shown |
| Network error | Minimal fallback | Error message with retry |

All errors are logged for monitoring.

## Testing

### Manual Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to JobForge:**
   http://localhost:3000/jobforge/create-new

3. **Enter a job spec:**
   - Title: "Software Engineer"
   - Description: Paste any job description

4. **Click "Analyze with AI":**
   - Should see loading spinner
   - Analysis appears in 2-4 seconds
   - Check console for logs

### Test Cases

**Good Job Spec (Expected: High Scores)**
```
Title: Senior Software Engineer - Full Stack
Description: We are seeking an experienced Senior Software Engineer to join our growing
technology team in London. This hybrid role offers £75,000 - £90,000.

Responsibilities:
- Lead development of React/Node.js applications
- Mentor junior developers
- Design scalable architectures
- Participate in code reviews

Requirements:
- 5+ years of full-stack experience
- Strong React and Node.js skills
- Experience with cloud platforms (AWS/Azure)
- Excellent communication skills

Benefits:
- Health insurance
- Flexible remote work
- Professional development budget
- 25 days holiday
```

**Poor Job Spec (Expected: Low Scores, Many Tips)**
```
Title: Developer
Description: We need a developer.
```

**Biased Language (Expected: Bias Detection)**
```
Title: Software Engineer
Description: We are seeking a young, energetic developer. He will work with our team
and must be a native English speaker. The ideal candidate is a digital native who can
work long hours.
```

### Monitoring

Check the terminal logs for:
- `[JobForge] Calling OpenAI API...` - API call initiated
- `[JobForge] Usage: { ... }` - Token usage stats
- `[JobForge] Cache hit: ...` - Cache performance
- `[JobForge] API error: ...` - Any errors

## Future Enhancements

### Phase 2 (Week 3-4)
- [ ] Add streaming for content rewriting
- [ ] Improve field extraction accuracy
- [ ] Add industry-specific benchmarks
- [ ] Enhanced bias detection rules

### Phase 3 (Week 4-5)
- [ ] Redis caching for production
- [ ] Usage analytics dashboard
- [ ] A/B testing different prompts
- [ ] Cost optimization (switch to GPT-3.5 for some tasks)

### Phase 4 (Post-MVP)
- [ ] User feedback loop (thumbs up/down on tips)
- [ ] Prompt tuning based on feedback
- [ ] Multi-language support
- [ ] Integration with external salary APIs

## Troubleshooting

### Issue: "Using basic analysis (AI service not configured)"

**Cause:** OpenAI API key is missing or invalid

**Solution:**
1. Check `.env.local` has `OPENAI_API_KEY=sk-proj-...`
2. Verify the API key is valid at https://platform.openai.com/api-keys
3. Restart the dev server after changing `.env.local`

### Issue: "Rate limit exceeded"

**Cause:** Too many requests in short time

**Solution:**
- Wait 1 hour for rate limit to reset
- Check if multiple users are testing simultaneously
- Consider increasing `MAX_REQUESTS_PER_USER` in route.ts (development only)

### Issue: Analysis takes too long (>10 seconds)

**Cause:** OpenAI API slow response or timeout

**Solution:**
- Check OpenAI status: https://status.openai.com/
- Check network connection
- Try again later
- System will automatically fallback to basic analysis

### Issue: Analysis quality is poor

**Cause:** Prompt needs refinement

**Solution:**
- Review the `SYSTEM_PROMPT` in `/src/app/api/jobforge/analyze-job-spec/route.ts`
- Add more examples or guidelines
- Adjust temperature (lower = more consistent, higher = more creative)
- Test with different job spec samples

## Support

For issues or questions:
1. Check the terminal logs for error messages
2. Review this documentation
3. Check the implementation plan in the codebase
4. Contact the development team

## Changelog

### v1.0.0 (Current)
- ✅ Real OpenAI GPT-4 Turbo integration
- ✅ Job spec analysis with scores
- ✅ Actionable tips generation
- ✅ Bias detection
- ✅ Salary benchmarking
- ✅ In-memory caching
- ✅ Rate limiting
- ✅ Error handling with fallbacks
- ✅ Frontend integration with existing wizard
