# JobForge - Data Models & API Specification

## 1. Core Data Models

### 1.1 JobSpec

The main entity representing a job specification.

```typescript
interface JobSpec {
  // Identity
  id: string;
  externalId?: string;              // CRM Job ID when pushed
  status: JobSpecStatus;

  // Basic Information
  title: string;
  industry: string;
  location: {
    city: string;
    country: string;
    region?: string;
    workType: 'remote' | 'hybrid' | 'onsite';
  };

  // Compensation
  salary: {
    min: number;
    max: number;
    currency: string;
    period: 'hourly' | 'daily' | 'monthly' | 'yearly';
    displayOnJD: boolean;
  };

  // Employment Details
  employmentType: 'permanent' | 'contract' | 'temporary' | 'part-time';
  seniorityLevel: 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  experienceYears: {
    min: number;
    max?: number;
  };

  // Job Description
  description: JobDescription;

  // CRM Integration
  crmFields: Record<string, any>;   // Dynamic CRM fields
  crmFieldMapping: CRMFieldMapping[];

  // Quality & Validation
  validationStatus: ValidationStatus;
  qualityMetrics: QualityMetrics;

  // Metadata
  createdBy: string;                // User ID
  createdAt: Date;
  updatedAt: Date;
  lastSyncedAt?: Date;

  // Versioning
  version: number;
  versions: JobSpecVersion[];

  // Relations
  clientId?: string;
  templateId?: string;
  tags: string[];
}

type JobSpecStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'in_crm'
  | 'archived';
```

### 1.2 JobDescription

The actual content of the job specification.

```typescript
interface JobDescription {
  // Main Sections
  overview: string;                 // Company and role overview

  responsibilities: string[];       // Key responsibilities

  requirements: {
    required: Requirement[];        // Must-have requirements
    desirable: Requirement[];       // Nice-to-have requirements
  };

  benefits?: string[];              // Perks and benefits

  companyDescription?: string;      // About the company

  candidatePersona?: CandidatePersona; // AI-generated ideal candidate

  // Additional Sections
  applicationProcess?: string;
  diversityStatement?: string;

  // Formatting
  format: 'markdown' | 'html' | 'plain';
  customSections?: CustomSection[];
}

interface Requirement {
  text: string;
  category?: 'technical' | 'soft-skill' | 'certification' | 'experience';
  priority?: 'must-have' | 'nice-to-have';
}

interface CandidatePersona {
  summary: string;
  keySkills: string[];
  background: string;
  motivations: string[];
}

interface CustomSection {
  id: string;
  title: string;
  content: string;
  order: number;
}
```

### 1.3 CRMFieldMapping

Maps JobForge data to CRM fields.

```typescript
interface CRMFieldMapping {
  id: string;
  crmFieldId: string;               // CRM's field identifier
  crmFieldName: string;             // Display name
  jobForgeField?: string;           // Mapped JobForge field path

  // Field Definition
  type: CRMFieldType;
  required: boolean;

  // Value
  value: any;
  defaultValue?: any;

  // Validation
  validation: {
    status: 'valid' | 'warning' | 'error' | 'empty';
    message?: string;
    rules?: ValidationRule[];
  };

  // AI Assistance
  aiSuggestion?: AISuggestion;
  autoPopulated: boolean;
  autoPopulatedFrom?: string;       // Source field/section

  // Metadata
  options?: SelectOption[];         // For select/multiselect fields
  placeholder?: string;
  helpText?: string;
}

type CRMFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'currency'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone';

interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

interface SelectOption {
  label: string;
  value: string;
  metadata?: Record<string, any>;
}
```

### 1.4 AISuggestion

AI-powered suggestions for fields or content.

```typescript
interface AISuggestion {
  id: string;
  fieldId: string;
  value: any;
  confidence: number;               // 0-100
  source: string;                   // "Detected from job title"
  reasoning?: string;               // Why AI suggested this
  alternatives?: any[];             // Other possible values
  acceptedAt?: Date;
  rejectedAt?: Date;
}
```

### 1.5 ValidationStatus

Validation state for job spec and CRM fields.

```typescript
interface ValidationStatus {
  overall: 'valid' | 'warning' | 'error' | 'incomplete';

  requiredFields: {
    total: number;
    completed: number;
    missing: string[];              // Field IDs
  };

  optionalFields: {
    total: number;
    completed: number;
  };

  errors: ValidationError[];
  warnings: ValidationWarning[];

  lastValidated: Date;
}

interface ValidationError {
  fieldId: string;
  fieldName: string;
  message: string;
  code: string;
}

interface ValidationWarning {
  fieldId: string;
  fieldName: string;
  message: string;
  suggestion?: string;
  canIgnore: boolean;
}
```

### 1.6 QualityMetrics

Quality assessment of job description.

```typescript
interface QualityMetrics {
  // Scores (0-100)
  clarity: number;
  readability: number;
  completeness: number;
  overallScore: number;

  // Bias Detection
  bias: {
    level: 'none' | 'low' | 'medium' | 'high';
    details?: BiasDetail[];
  };

  // Issues
  issues: QualityIssue[];

  // Benchmarking
  benchmark?: {
    similarRoles: number;           // Average score for similar roles
    industry: number;               // Industry average
  };

  // Metadata
  analyzedAt: Date;
  version: string;                  // AI model version
}

interface BiasDetail {
  type: 'gender' | 'age' | 'cultural' | 'other';
  text: string;                     // Problematic text
  location: string;                 // Where in JD
  suggestion: string;               // Alternative wording
  severity: 'low' | 'medium' | 'high';
}

interface QualityIssue {
  id: string;
  type: 'grammar' | 'clarity' | 'completeness' | 'consistency';
  severity: 'info' | 'warning' | 'error';
  message: string;
  location: {
    section: string;
    line?: number;
    text?: string;
  };
  suggestion?: string;
  autoFixable: boolean;
}
```

### 1.7 ApprovalRequest

Approval workflow entity.

```typescript
interface ApprovalRequest {
  id: string;
  jobSpecId: string;
  jobSpec: JobSpec;                 // Snapshot at submission

  // Workflow
  status: ApprovalStatus;
  urgency: 'normal' | 'urgent' | 'critical';

  // Participants
  submittedBy: string;              // User ID
  assignedTo: string;               // Manager user ID

  // Timing
  submittedAt: Date;
  reviewedAt?: Date;
  dueDate?: Date;

  // Content
  submissionNotes: string;
  reviewNotes?: string;

  // Feedback
  comments: Comment[];
  changeRequests: ChangeRequest[];

  // Insights
  insights: Insight[];

  // History
  history: ApprovalHistoryEvent[];
}

type ApprovalStatus =
  | 'pending'
  | 'in_review'
  | 'approved'
  | 'changes_requested'
  | 'rejected'
  | 'cancelled';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
  attachments?: Attachment[];
  mentions?: string[];              // Tagged user IDs
}

interface ChangeRequest {
  id: string;
  section: string;                  // Which part of JD
  fieldId?: string;                 // Specific field if applicable
  message: string;
  resolved: boolean;
  resolvedAt?: Date;
}

interface Insight {
  id: string;
  type: 'salary_benchmark' | 'similar_roles' | 'market_data' | 'quality_alert';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  data?: any;
  actionable: boolean;
  action?: {
    label: string;
    handler: string;                // Action identifier
  };
}

interface ApprovalHistoryEvent {
  id: string;
  type: 'submitted' | 'reviewed' | 'approved' | 'rejected' | 'commented' | 'edited';
  userId: string;
  userName: string;
  timestamp: Date;
  data?: any;
}
```

### 1.8 Template

Reusable job spec templates.

```typescript
interface Template {
  id: string;
  name: string;
  description?: string;

  // Categorization
  industry?: string;
  role?: string;
  seniorityLevel?: string;
  tags: string[];

  // Content
  jobSpec: Partial<JobSpec>;        // Template data

  // Ownership & Sharing
  createdBy: string;
  visibility: 'private' | 'team' | 'organization';

  // Usage Stats
  useCount: number;
  lastUsed?: Date;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

### 1.9 JobSpecVersion

Version history for job specs.

```typescript
interface JobSpecVersion {
  id: string;
  jobSpecId: string;
  versionNumber: number;

  // Version Info
  name?: string;                    // User-assigned name
  tags?: string[];

  // Content Snapshot
  snapshot: JobSpec;                // Full job spec at this version

  // Changes
  changedFields: string[];
  changesSummary?: string;          // AI-generated summary

  // Metadata
  createdBy: string;
  createdAt: Date;
  reason?: string;                  // Why version was created
}
```

### 1.10 User

User entity for JobForge.

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;

  // Permissions
  permissions: Permission[];

  // Preferences
  preferences: UserPreferences;

  // Stats
  stats: {
    jobsCreated: number;
    approvalsPending: number;
    approvalsCompleted: number;
  };

  // Metadata
  createdAt: Date;
  lastLoginAt: Date;
}

type UserRole = 'consultant' | 'manager' | 'admin';

type Permission =
  | 'create_job'
  | 'edit_job'
  | 'delete_job'
  | 'approve_job'
  | 'push_to_crm'
  | 'manage_templates'
  | 'manage_users'
  | 'configure_crm';

interface UserPreferences {
  // UI Preferences
  defaultView: 'list' | 'card';
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';

  // Workflow Preferences
  autoSaveInterval: number;         // Seconds
  requireApproval: boolean;
  defaultApprover?: string;         // User ID

  // AI Preferences
  aiAssistanceLevel: 'minimal' | 'balanced' | 'maximum';
  autoAcceptHighConfidence: boolean; // Auto-accept AI suggestions >95%

  // Notifications
  emailNotifications: {
    approvalRequests: boolean;
    approvalDecisions: boolean;
    comments: boolean;
  };
}
```

### 1.11 CRMIntegration

CRM connection configuration.

```typescript
interface CRMIntegration {
  id: string;
  organizationId: string;

  // CRM Details
  crmType: 'bullhorn' | 'salesforce' | 'vincere' | 'recruiterflow' | 'custom';
  crmName: string;

  // Connection
  status: 'connected' | 'disconnected' | 'error';
  credentials: CRMCredentials;      // Encrypted

  // Schema
  schema: CRMSchema;
  lastSchemaSync: Date;

  // Sync Settings
  syncSettings: {
    autoSync: boolean;
    syncInterval: number;           // Minutes
    syncDirection: 'one-way' | 'two-way';
  };

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastSyncAt?: Date;
}

interface CRMCredentials {
  // Varies by CRM type, encrypted at rest
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  instanceUrl?: string;
}

interface CRMSchema {
  version: string;
  entities: CRMEntity[];
  lastFetched: Date;
}

interface CRMEntity {
  name: string;
  label: string;
  fields: CRMSchemaField[];
}

interface CRMSchemaField {
  id: string;
  name: string;
  label: string;
  type: CRMFieldType;
  required: boolean;
  options?: SelectOption[];
  validation?: ValidationRule[];
  defaultValue?: any;
  helpText?: string;
}
```

---

## 2. API Endpoints

### Base URL
```
https://api.yourapp.com/v1/jobforge
```

### Authentication
All endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

### 2.1 Job Spec Endpoints

#### Create Job Spec
```http
POST /jobs
Content-Type: application/json

{
  "title": "Senior Software Engineer",
  "industry": "Technology",
  "location": {
    "city": "Manchester",
    "country": "UK",
    "workType": "hybrid"
  },
  "salary": {
    "min": 60000,
    "max": 80000,
    "currency": "GBP",
    "period": "yearly"
  },
  // ... other fields
}

Response: 201 Created
{
  "id": "job_123456",
  "status": "draft",
  // ... full job spec
}
```

#### Get Job Spec
```http
GET /jobs/:id

Response: 200 OK
{
  "id": "job_123456",
  // ... full job spec
}
```

#### Update Job Spec
```http
PATCH /jobs/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "description": {
    "overview": "New overview..."
  }
}

Response: 200 OK
{
  "id": "job_123456",
  // ... updated job spec
}
```

#### List Job Specs
```http
GET /jobs?status=draft&createdBy=user_123&limit=20&offset=0

Response: 200 OK
{
  "data": [
    { /* job spec 1 */ },
    { /* job spec 2 */ }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

#### Delete Job Spec
```http
DELETE /jobs/:id

Response: 204 No Content
```

#### Duplicate Job Spec
```http
POST /jobs/:id/duplicate

Response: 201 Created
{
  "id": "job_789012",
  // ... duplicated job spec
}
```

---

### 2.2 AI Endpoints

#### Generate Job Description
```http
POST /ai/generate
Content-Type: application/json

{
  "prompt": "Senior React developer for fintech startup...",
  "context": {
    "industry": "FinTech",
    "seniorityLevel": "senior"
  }
}

Response: 200 OK
{
  "description": {
    "overview": "...",
    "responsibilities": [...],
    "requirements": {...}
  },
  "confidence": 92,
  "processingTime": 2.3
}
```

#### Apply AI Transformation
```http
POST /ai/transform
Content-Type: application/json

{
  "jobId": "job_123456",
  "command": {
    "type": "adjust_seniority",
    "direction": "up"
  }
}

Response: 200 OK
{
  "updatedDescription": {
    // ... transformed content
  },
  "changes": [
    "Increased required experience to 7+ years",
    "Added leadership responsibilities"
  ]
}
```

#### Get AI Suggestions
```http
GET /ai/suggestions/:jobId

Response: 200 OK
{
  "suggestions": [
    {
      "fieldId": "seniority_level",
      "value": "senior",
      "confidence": 95,
      "source": "Detected from job title",
      "reasoning": "Title contains 'Senior'"
    }
  ]
}
```

#### Check Quality
```http
POST /ai/quality-check
Content-Type: application/json

{
  "content": "Job description text...",
  "type": "job_description"
}

Response: 200 OK
{
  "metrics": {
    "clarity": 87,
    "readability": 82,
    "completeness": 90,
    "overallScore": 86,
    "bias": {
      "level": "low",
      "details": [...]
    },
    "issues": [...]
  }
}
```

---

### 2.3 CRM Integration Endpoints

#### Get CRM Schema
```http
GET /crm/schema

Response: 200 OK
{
  "schema": {
    "version": "2024-01",
    "entities": [
      {
        "name": "Job",
        "fields": [
          {
            "id": "title",
            "label": "Job Title",
            "type": "text",
            "required": true
          }
        ]
      }
    ]
  },
  "lastSynced": "2024-01-15T10:30:00Z"
}
```

#### Validate CRM Field
```http
POST /crm/validate
Content-Type: application/json

{
  "fieldId": "salary_range",
  "value": {
    "min": 60000,
    "max": 80000,
    "currency": "GBP"
  }
}

Response: 200 OK
{
  "valid": true,
  "warnings": [
    "Salary is 5% below market average"
  ]
}
```

#### Auto-fill CRM Fields
```http
POST /crm/auto-fill
Content-Type: application/json

{
  "jobSpec": {
    "title": "Senior Software Engineer",
    "description": {...}
  }
}

Response: 200 OK
{
  "fields": [
    {
      "fieldId": "title",
      "value": "Senior Software Engineer",
      "confidence": 100,
      "source": "job.title"
    },
    {
      "fieldId": "seniority",
      "value": "senior",
      "confidence": 95,
      "source": "Detected from title"
    }
  ]
}
```

#### Push to CRM
```http
POST /crm/push
Content-Type: application/json

{
  "jobId": "job_123456"
}

Response: 200 OK
{
  "success": true,
  "crmJobId": "crm_job_789",
  "crmUrl": "https://crm.example.com/jobs/789",
  "syncedAt": "2024-01-15T11:00:00Z"
}
```

#### Sync from CRM
```http
POST /crm/sync/:crmJobId

Response: 200 OK
{
  "jobSpec": {
    // ... synced job spec
  }
}
```

---

### 2.4 Approval Workflow Endpoints

#### Submit for Approval
```http
POST /approvals
Content-Type: application/json

{
  "jobId": "job_123456",
  "assignedTo": "manager_user_id",
  "urgency": "urgent",
  "notes": "Client needs ASAP"
}

Response: 201 Created
{
  "id": "approval_123",
  "status": "pending",
  "jobSpec": {...},
  "submittedAt": "2024-01-15T10:00:00Z"
}
```

#### Get Approval Queue
```http
GET /approvals?status=pending&assignedTo=manager_123

Response: 200 OK
{
  "data": [
    {
      "id": "approval_123",
      "jobSpec": {...},
      "urgency": "urgent",
      "submittedBy": {...},
      "insights": [...]
    }
  ],
  "pagination": {...}
}
```

#### Get Approval Request
```http
GET /approvals/:id

Response: 200 OK
{
  "id": "approval_123",
  "jobSpec": {...},
  "status": "pending",
  "comments": [...],
  "insights": [...],
  "history": [...]
}
```

#### Approve Request
```http
POST /approvals/:id/approve
Content-Type: application/json

{
  "notes": "Looks great!",
  "pushToCRM": true
}

Response: 200 OK
{
  "id": "approval_123",
  "status": "approved",
  "reviewedAt": "2024-01-15T11:00:00Z",
  "crmJobId": "crm_job_789"  // If pushToCRM was true
}
```

#### Request Changes
```http
POST /approvals/:id/request-changes
Content-Type: application/json

{
  "feedback": "Please add more detail to responsibilities",
  "changeRequests": [
    {
      "section": "responsibilities",
      "message": "Add leadership duties"
    }
  ]
}

Response: 200 OK
{
  "id": "approval_123",
  "status": "changes_requested",
  "reviewedAt": "2024-01-15T11:00:00Z"
}
```

#### Reject Request
```http
POST /approvals/:id/reject
Content-Type: application/json

{
  "reason": "Salary out of budget range"
}

Response: 200 OK
{
  "id": "approval_123",
  "status": "rejected",
  "reviewedAt": "2024-01-15T11:00:00Z"
}
```

#### Add Comment
```http
POST /approvals/:id/comments
Content-Type: application/json

{
  "text": "Can we increase the salary range?",
  "mentions": ["user_456"]
}

Response: 201 Created
{
  "id": "comment_123",
  "text": "Can we increase the salary range?",
  "userId": "user_789",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### 2.5 Version Management Endpoints

#### Create Version
```http
POST /jobs/:id/versions
Content-Type: application/json

{
  "name": "Senior version",
  "tags": ["adjusted-seniority"]
}

Response: 201 Created
{
  "id": "version_123",
  "versionNumber": 2,
  "name": "Senior version",
  "snapshot": {...}
}
```

#### List Versions
```http
GET /jobs/:id/versions

Response: 200 OK
{
  "versions": [
    {
      "id": "version_123",
      "versionNumber": 2,
      "name": "Senior version",
      "createdAt": "2024-01-15T10:00:00Z"
    },
    {
      "id": "version_456",
      "versionNumber": 1,
      "name": "Original",
      "createdAt": "2024-01-14T14:00:00Z"
    }
  ]
}
```

#### Restore Version
```http
POST /jobs/:id/versions/:versionId/restore

Response: 200 OK
{
  "id": "job_123456",
  "version": 3,  // New version created
  // ... restored content
}
```

#### Compare Versions
```http
GET /jobs/:id/versions/compare?v1=version_123&v2=version_456

Response: 200 OK
{
  "v1": {...},
  "v2": {...},
  "diff": {
    "changed": ["title", "description.overview"],
    "added": ["description.benefits"],
    "removed": []
  }
}
```

---

### 2.6 Template Endpoints

#### Create Template
```http
POST /templates
Content-Type: application/json

{
  "name": "Senior Developer Template",
  "industry": "Technology",
  "role": "Software Engineer",
  "seniorityLevel": "senior",
  "jobSpec": {...},
  "visibility": "team"
}

Response: 201 Created
{
  "id": "template_123",
  // ... full template
}
```

#### List Templates
```http
GET /templates?industry=Technology&visibility=team

Response: 200 OK
{
  "data": [
    {
      "id": "template_123",
      "name": "Senior Developer Template",
      "useCount": 15
    }
  ]
}
```

#### Use Template
```http
POST /templates/:id/use

Response: 201 Created
{
  "id": "job_789012",
  "templateId": "template_123",
  // ... new job from template
}
```

---

### 2.7 Share & Export Endpoints

#### Generate Share Link
```http
POST /jobs/:id/share
Content-Type: application/json

{
  "format": "branded-pdf",
  "config": {
    "includeSalary": true,
    "includeCompany": true,
    "expiresIn": 30  // days
  },
  "tracking": true
}

Response: 200 OK
{
  "url": "https://share.yourapp.com/jobs/abc123",
  "expiresAt": "2024-02-15T00:00:00Z",
  "trackingId": "track_456"
}
```

#### Generate PDF
```http
POST /jobs/:id/export/pdf
Content-Type: application/json

{
  "format": "branded",
  "branding": {
    "logo": "logo_url",
    "colorScheme": "corporate-blue"
  }
}

Response: 200 OK
Content-Type: application/pdf

<PDF binary data>
```

#### Track Link Access
```http
GET /share/tracking/:trackingId

Response: 200 OK
{
  "views": 12,
  "uniqueVisitors": 8,
  "lastViewed": "2024-01-20T15:30:00Z",
  "viewDetails": [
    {
      "timestamp": "2024-01-20T15:30:00Z",
      "location": "London, UK",
      "device": "Desktop"
    }
  ]
}
```

---

### 2.8 Analytics Endpoints

#### Get User Stats
```http
GET /analytics/user/:userId

Response: 200 OK
{
  "jobsCreated": 24,
  "approvalsPending": 2,
  "approvalsCompleted": 18,
  "averageQualityScore": 87,
  "averageTimeToCreate": 420,  // seconds
  "trendsLastMonth": {
    "jobsCreated": 8,
    "qualityImprovement": 5  // percentage
  }
}
```

#### Get Team Stats
```http
GET /analytics/team

Response: 200 OK
{
  "totalJobs": 156,
  "averageQualityScore": 85,
  "approvalRate": 92,
  "averageApprovalTime": 7200,  // seconds
  "topPerformers": [
    {
      "userId": "user_123",
      "name": "John Smith",
      "jobsCreated": 24,
      "qualityScore": 91
    }
  ]
}
```

---

## 3. Webhook Events

JobForge can send webhooks for key events:

### Event Types

```typescript
type WebhookEvent =
  | 'job.created'
  | 'job.updated'
  | 'job.deleted'
  | 'job.pushed_to_crm'
  | 'approval.submitted'
  | 'approval.approved'
  | 'approval.rejected'
  | 'approval.changes_requested'
  | 'comment.added';
```

### Webhook Payload

```json
{
  "event": "approval.submitted",
  "timestamp": "2024-01-15T10:00:00Z",
  "data": {
    "approvalId": "approval_123",
    "jobId": "job_123456",
    "submittedBy": "user_789",
    "assignedTo": "manager_123",
    "urgency": "urgent"
  }
}
```

### Webhook Configuration

```http
POST /webhooks
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/jobforge",
  "events": ["approval.submitted", "approval.approved"],
  "secret": "webhook_secret_key"
}
```

---

## 4. Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Required field 'title' is missing",
    "details": {
      "field": "title",
      "constraint": "required"
    },
    "requestId": "req_123456"
  }
}
```

### Error Codes

```typescript
type ErrorCode =
  | 'VALIDATION_ERROR'          // 400
  | 'UNAUTHORIZED'              // 401
  | 'FORBIDDEN'                 // 403
  | 'NOT_FOUND'                 // 404
  | 'CONFLICT'                  // 409
  | 'RATE_LIMIT_EXCEEDED'       // 429
  | 'CRM_CONNECTION_ERROR'      // 502
  | 'AI_SERVICE_ERROR'          // 503
  | 'INTERNAL_ERROR';           // 500
```

---

## 5. Rate Limiting

```
Rate Limits:
- Standard: 100 requests/minute
- AI Generation: 10 requests/minute
- CRM Push: 20 requests/minute
```

Headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642252800
```

---

## 6. Pagination

All list endpoints support pagination:

```http
GET /jobs?limit=20&offset=40

Response Headers:
X-Total-Count: 156
Link: <https://api.../jobs?limit=20&offset=60>; rel="next"
```

---

This completes the comprehensive data models and API specification for JobForge!
