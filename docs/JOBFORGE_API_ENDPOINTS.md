# JobForge API Endpoints Reference

This document outlines the API endpoints for the JobForge feature, which provides AI-powered job specification creation and analysis.

## Base URL
All endpoints are relative to: `/api/jobforge`

---

## Job Specification Analysis

### POST /api/jobforge/analyze-job-spec

Analyzes a job specification and provides AI-powered feedback, scoring, and improvement suggestions.

**Request Body:**
```typescript
{
  title: string;
  industry: string;
  location: {
    city: string;
    country: string;
    workType: 'remote' | 'hybrid' | 'onsite';
  };
  salary: {
    min: number;
    max: number;
    currency: string;
    period: 'yearly' | 'monthly' | 'hourly';
    displayOnJD: boolean;
  };
  employmentType: 'permanent' | 'contract' | 'temporary';
  seniorityLevel: 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  experienceYears: {
    min: number;
    max?: number;
  };
  description: {
    overview: string;
    responsibilities: string[];
    requirements: {
      required: Array<{ text: string }>;
      desirable: Array<{ text: string }>;
    };
    benefits: string[];
    format: 'markdown' | 'html' | 'plain';
  };
}
```

**Response:**
```typescript
{
  scores: {
    overall: number;           // 0-100
    clarity: number;           // 0-100
    completeness: number;      // 0-100
    appeal: number;            // 0-100
    competitiveness: number;   // 0-100
  };
  sentiment: {
    tone: 'professional' | 'casual' | 'enthusiastic' | 'neutral';
    positivity: number;        // 0-100
  };
  metrics: {
    wordCount: number;
    responsibilitiesCount: number;
    requirementsCount: number;
    benefitsCount: number;
  };
  tips: Array<{
    id: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    suggestion?: string;
    impact: number;            // Points improvement (0-20)
    currentValue?: string;
    suggestedValue?: string;
    fieldPath?: string;        // For programmatic updates
  }>;
  biasDetection: {
    hasBias: boolean;
    biasTypes: Array<{
      type: 'gender' | 'age' | 'cultural' | 'disability';
      severity: 'high' | 'medium' | 'low';
      text: string;
      location: string;
      suggestion: string;
    }>;
  };
  salaryBenchmark: {
    providedRange: {
      min: number;
      max: number;
      currency: string;
    };
    marketRange: {
      min: number;
      max: number;
      currency: string;
    };
    recommendation: 'competitive' | 'below_market' | 'above_market';
    notes: string;
  };
  predictions: {
    expectedApplications: 'low' | 'medium' | 'high';
    expectedQualifiedCandidates: 'low' | 'medium' | 'high';
    timeToFill: string;        // e.g., "2-4 weeks"
  };
}
```

**Features:**
- ✅ OpenAI GPT-4 Turbo analysis
- ✅ Comprehensive scoring across 5 dimensions
- ✅ Up to 7 actionable improvement tips
- ✅ Bias detection (gender, age, cultural, disability)
- ✅ Salary benchmarking against market rates
- ✅ Predictions for applications and time-to-fill
- ✅ Fallback analysis using heuristics when API fails
- ✅ Response validation and sanitization
- ✅ 5-minute caching (per user + job spec hash)
- ✅ Rate limiting: 10 requests/hour per user

**Status Codes:**
- `200` - Success
- `400` - Invalid request body
- `401` - Unauthorized
- `429` - Rate limit exceeded
- `500` - Server error

**Example Usage:**
```typescript
const analysis = await fetch('/api/jobforge/analyze-job-spec', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(jobSpec),
});
```

---

## Job CRUD Operations

### GET /api/jobforge/jobs

Get all jobs for the current user.

**Query Parameters:**
- `status?: 'draft' | 'published' | 'archived'` - Filter by status
- `limit?: number` - Number of jobs to return (default: 50)
- `offset?: number` - Pagination offset

**Response:**
```typescript
{
  jobs: Array<JobSpec & {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    status: 'draft' | 'published' | 'archived';
    analysis?: JobAnalysis;
  }>;
  total: number;
}
```

---

### GET /api/jobforge/jobs/:id

Get a specific job by ID.

**Response:**
```typescript
{
  job: JobSpec & {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    status: 'draft' | 'published' | 'archived';
    analysis?: JobAnalysis;
  };
}
```

---

### POST /api/jobforge/jobs

Create a new job specification.

**Request Body:**
```typescript
{
  ...JobSpec,  // Same as analyze-job-spec request
  status?: 'draft' | 'published';  // Default: 'draft'
}
```

**Response:**
```typescript
{
  job: JobSpec & {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    status: 'draft' | 'published' | 'archived';
  };
}
```

---

### PATCH /api/jobforge/jobs/:id

Update an existing job specification.

**Request Body:**
```typescript
{
  ...Partial<JobSpec>,  // Any fields to update
  status?: 'draft' | 'published' | 'archived';
}
```

**Response:**
```typescript
{
  job: JobSpec & {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    status: 'draft' | 'published' | 'archived';
  };
}
```

---

### DELETE /api/jobforge/jobs/:id

Delete a job specification.

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

---

## Job Templates

### GET /api/jobforge/templates

Get all available job templates.

**Query Parameters:**
- `industry?: string` - Filter by industry
- `seniorityLevel?: string` - Filter by seniority

**Response:**
```typescript
{
  templates: Array<{
    id: string;
    name: string;
    industry: string;
    seniorityLevel: string;
    template: Partial<JobSpec>;
    createdAt: Date;
  }>;
}
```

---

### POST /api/jobforge/templates

Create a new template from an existing job.

**Request Body:**
```typescript
{
  name: string;
  jobId: string;  // ID of job to base template on
}
```

---

## Job Images & Assets

### POST /api/jobforge/jobs/:id/images

Upload images for a job posting (company photos, office images, team photos, etc.).

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with file fields

**Form Fields:**
```typescript
{
  files: File[];  // Multiple image files
  jobId: string;
}
```

**Response:**
```typescript
{
  images: Array<{
    id: string;
    url: string;
    filename: string;
    size: number;
    mimeType: string;
    createdAt: Date;
  }>;
}
```

**Constraints:**
- Maximum 10 images per job
- Maximum 10MB per image
- Accepted formats: JPEG, PNG, WebP, GIF
- Images are automatically optimized and resized

---

### DELETE /api/jobforge/jobs/:id/images/:imageId

Delete an image from a job posting.

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

---

## Statistics & Analytics

### GET /api/jobforge/stats

Get JobForge statistics for the current user.

**Response:**
```typescript
{
  jobsCreated: number;
  draftsCount: number;
  publishedCount: number;
  archivedCount: number;
  awaitingApprovalCount: number;
  thisWeek: number;
  thisMonth: number;
  avgAnalysisScore: number;
  totalSuggestions: number;
  highPrioritySuggestions: number;
}
```

---

### GET /api/jobforge/suggestions

Get all AI suggestions across all jobs for the current user.

**Query Parameters:**
- `priority?: 'high' | 'medium' | 'low'` - Filter by priority
- `applied?: boolean` - Filter by applied status
- `limit?: number` - Number of suggestions to return (default: 100)

**Response:**
```typescript
{
  suggestions: Array<{
    id: string;
    jobId: string;
    jobTitle: string;
    tipId: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
    title: string;
    description: string;
    suggestion?: string;
    impact: number;
    currentValue?: string;
    suggestedValue?: string;
    fieldPath?: string;
    createdAt: Date;
    applied: boolean;
  }>;
  total: number;
}
```

---

## Approval Workflow

### GET /api/jobforge/approvals

Get all jobs pending approval (for managers/admins).

**Response:**
```typescript
{
  approvals: Array<{
    id: string;
    job: JobSpec;
    submittedBy: {
      id: string;
      name: string;
      email: string;
    };
    submittedAt: Date;
    status: 'pending' | 'approved' | 'rejected';
  }>;
}
```

---

### POST /api/jobforge/approvals/:id/approve

Approve a job specification.

**Request Body:**
```typescript
{
  comments?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  job: JobSpec;
}
```

---

### POST /api/jobforge/approvals/:id/reject

Reject a job specification.

**Request Body:**
```typescript
{
  reason: string;
  comments?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

---

## Import & Export

### POST /api/jobforge/import/email

Import a job specification from email content.

**Request Body:**
```typescript
{
  emailContent: string;
  subject?: string;
}
```

**Response:**
```typescript
{
  job: Partial<JobSpec>;
  confidence: number;  // 0-100
}
```

---

### GET /api/jobforge/jobs/:id/export

Export a job specification in various formats.

**Query Parameters:**
- `format: 'pdf' | 'docx' | 'html' | 'markdown'`

**Response:**
- Content-Type varies based on format
- Content-Disposition: attachment

---

## Webhooks

### POST /api/jobforge/webhooks/linkedin

Receive job posting webhooks from LinkedIn integration.

**Request Body:**
```typescript
{
  event: 'job.created' | 'job.updated' | 'job.deleted';
  jobId: string;
  data: any;
}
```

---

### POST /api/jobforge/webhooks/indeed

Receive job posting webhooks from Indeed integration.

**Request Body:**
```typescript
{
  event: 'job.created' | 'job.updated' | 'job.deleted';
  jobId: string;
  data: any;
}
```

---

## Rate Limits

All endpoints have the following rate limits unless otherwise specified:

- **General endpoints**: 100 requests/minute per user
- **Analysis endpoint**: 10 requests/hour per user (computationally expensive)
- **Upload endpoints**: 20 requests/minute per user

Rate limit headers are returned in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

---

## Error Responses

All error responses follow this format:

```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

**Common Error Codes:**
- `INVALID_REQUEST` - Request validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `SERVER_ERROR` - Internal server error
- `AI_SERVICE_ERROR` - OpenAI API error

---

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens can be obtained via the main authentication endpoints at `/api/auth/login`.

---

## Caching Strategy

- **Analysis results**: 5 minutes (per user + job spec content hash)
- **Job listings**: 1 minute
- **Statistics**: 5 minutes
- **Templates**: 1 hour

Cache headers are returned where applicable:
```
Cache-Control: max-age=300
ETag: "xyz123"
```

---

## Monitoring & Logging

All API requests are logged with the following information:
- Request ID
- User ID
- Endpoint
- Method
- Status code
- Response time
- Error details (if applicable)

Logs can be accessed via the admin dashboard at `/admin/logs`.

---

## Future Endpoints (Roadmap)

The following endpoints are planned for future releases:

- `POST /api/jobforge/generate` - AI-powered job spec generation from prompts
- `POST /api/jobforge/translate` - Translate job specs to multiple languages
- `GET /api/jobforge/market-insights` - Get market insights for job titles
- `POST /api/jobforge/optimize` - Auto-apply AI suggestions
- `GET /api/jobforge/competitors/:id` - Compare with competitor job postings
- `POST /api/jobforge/publish` - Multi-platform publishing (LinkedIn, Indeed, etc.)

---

## Support

For API support, please contact:
- Email: support@yourcompany.com
- Slack: #jobforge-api
- Documentation: https://docs.yourcompany.com/jobforge
