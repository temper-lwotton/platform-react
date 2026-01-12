# **Route Specification: API Discussions Analyze Engagement**

## **1. Route Path**

**`POST /api/discussions/analyze-engagement`**

## **2. Description**

AI-powered content engagement analysis endpoint using OpenAI GPT-3.5. Analyzes discussion post content and provides engagement scores, sentiment analysis, actionable improvement tips, and engagement predictions.

* Engagement scoring
* Sentiment analysis
* Improvement tips
* Prediction metrics

## **3. Source File**

```
src/app/api/discussions/analyze-engagement/route.ts
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Analyzing content quality
* Calculating engagement scores
* Generating improvement suggestions
* Predicting engagement metrics

### **This route does not:**

* Create discussions
* Modify content
* Store analysis results
* Manage user data

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** User must be authenticated

## **6. URL Parameters & Query Params**

*None*

## **7. Request Structure**

### **Method**

`POST`

### **Headers**

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | `application/json` | Yes |

### **Request Body**

```typescript
interface AnalyzeEngagementRequest {
    title: string;   // Discussion post title
    content: string; // Full post content
    excerpt: string; // Post excerpt/summary
}
```

### **Example Request**

```json
{
    "title": "Tips for Better Team Communication",
    "content": "In today's remote-first world, team communication has become more important than ever. Here are some strategies I've found helpful...",
    "excerpt": "Discover effective strategies for improving team communication in remote environments."
}
```

## **8. Response Structure**

### **Success Response (200 OK)**

```typescript
interface EngagementAnalysisResponse {
    analysis: EngagementAnalysis;
}

interface EngagementAnalysis {
    scores: {
        overall: number;    // 0-100 overall engagement score
        clarity: number;    // 0-100 clarity score
        structure: number;  // 0-100 structure score
        appeal: number;     // 0-100 appeal score
    };
    sentiment: {
        tone: 'positive' | 'neutral' | 'negative' | 'mixed';
        confidence: number; // 0-1 confidence level
    };
    metrics: {
        wordCount: number;
        paragraphCount: number;
        hasQuestion: boolean;
        hasCallToAction: boolean;
        readingLevel: string; // e.g., "8th grade", "10th grade"
    };
    tips: Array<{
        id: string;
        category: 'structure' | 'clarity' | 'engagement' | 'tone' | 'formatting';
        priority: 'high' | 'medium' | 'low';
        title: string;
        description: string;
        impact: number;      // 0-100 expected improvement
        actionable: boolean;
        suggestion?: string; // Optional specific suggestion
    }>;
    predictions: {
        expectedViews: 'low' | 'medium' | 'high';
        expectedReplies: 'low' | 'medium' | 'high';
        expectedEngagementRate: number; // 0-100
    };
}
```

### **Example Response**

```json
{
    "analysis": {
        "scores": {
            "overall": 72,
            "clarity": 78,
            "structure": 65,
            "appeal": 73
        },
        "sentiment": {
            "tone": "positive",
            "confidence": 0.85
        },
        "metrics": {
            "wordCount": 245,
            "paragraphCount": 4,
            "hasQuestion": true,
            "hasCallToAction": false,
            "readingLevel": "10th grade"
        },
        "tips": [
            {
                "id": "add-cta",
                "category": "engagement",
                "priority": "medium",
                "title": "Include a Call-to-Action",
                "description": "Encourage readers to share their thoughts.",
                "impact": 15,
                "actionable": true
            }
        ],
        "predictions": {
            "expectedViews": "medium",
            "expectedReplies": "medium",
            "expectedEngagementRate": 11
        }
    }
}
```

### **Error Responses**

| Status | Description | Body |
|--------|-------------|------|
| 400 | Invalid request body | `{ "error": "Invalid request body" }` |
| 400 | Missing required fields | `{ "error": "Title, content, and excerpt are required" }` |
| 500 | OpenAI API key not configured | `{ "error": "OpenAI API key not configured" }` |

## **9. Data Flow Overview**

1. Receive POST request with content
2. Validate request body structure
3. Check cache for existing analysis
4. Call OpenAI GPT-3.5 for analysis
5. Parse and validate AI response
6. Cache result
7. Return analysis to client

## **10. AI Model Configuration**

### **Model Details**

| Setting | Value |
|---------|-------|
| Model | `gpt-3.5-turbo` |
| Temperature | 0.7 |
| Max tokens | 1000 |

## **11. Caching Strategy**

### **Cache Configuration**

| Setting | Value |
|---------|-------|
| TTL | 5 minutes |
| Max entries | 100 |
| Key generation | Hash of title + content + excerpt |

### **Cache Behavior**

* In-memory cache implementation
* Auto-cleanup when size exceeds limit
* Cache key based on content hash

## **12. Behaviour Matrix**

| Condition | Response |
|-----------|----------|
| Valid request + AI success | 200 with analysis |
| Valid request + AI failure | 200 with fallback analysis |
| Missing fields | 400 error |
| No API key | 500 error |
| Cache hit | 200 with cached analysis |

## **13. Fallback Analysis**

If OpenAI API fails, returns heuristic-based analysis:

* Word count scoring
* Question detection
* Call-to-action detection
* Basic structure analysis

## **14. Environment Variables**

| Variable | Purpose | Required |
|----------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API authentication | Yes |

## **15. Performance & Constraints**

* **Rendering strategy:** Server-side API route
* **Caching:** 5-minute in-memory cache
* **Known constraints:**
  * OpenAI API latency (1-3 seconds)
  * Rate limits on OpenAI API
  * Cache memory usage

## **16. Testing Strategy**

### **Unit Tests**

* Request validation
* Cache behavior
* Fallback analysis logic

### **Integration Tests**

* OpenAI API integration
* Error handling

### **E2E Tests**

* Complete analysis flow

## **17. Non-Goals / Out of Scope**

* Content modification
* Persistent storage
* Historical analysis
* User-specific tuning

## **18. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/spaces/[id]/discussions` | Discussions listing |
| `/spaces/[id]/discussions/[discussionId]` | Discussion detail |
| `/posts/new` | Create post with analysis |

## **19. Open Questions / Notes**

* Consider adding persistent caching (Redis)
* May need rate limiting per user
* Consider upgrading to GPT-4 for better analysis
