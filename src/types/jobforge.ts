// JobForge TypeScript Types

export type JobSpecStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'in_crm'
  | 'archived';

export type CRMFieldType =
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

export type ValidationStatus = 'valid' | 'warning' | 'error' | 'empty';

export type UserRole = 'consultant' | 'manager' | 'admin';

export type ApprovalStatus =
  | 'pending'
  | 'in_review'
  | 'approved'
  | 'changes_requested'
  | 'rejected'
  | 'cancelled';

export interface JobSpec {
  id: string;
  externalId?: string;
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
  crmFields: Record<string, any>;
  crmFieldMapping: CRMFieldMapping[];

  // Quality & Validation
  validationStatus: ValidationState;
  qualityMetrics: QualityMetrics;

  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastSyncedAt?: Date;

  // Versioning
  version: number;

  // Relations
  clientId?: string;
  templateId?: string;
  tags: string[];
}

export interface JobDescription {
  overview: string;
  responsibilities: string[];
  requirements: {
    required: Requirement[];
    desirable: Requirement[];
  };
  benefits?: string[];
  companyDescription?: string;
  candidatePersona?: CandidatePersona;
  applicationProcess?: string;
  diversityStatement?: string;
  format: 'markdown' | 'html' | 'plain';
}

export interface Requirement {
  text: string;
  category?: 'technical' | 'soft-skill' | 'certification' | 'experience';
  priority?: 'must-have' | 'nice-to-have';
}

export interface CandidatePersona {
  summary: string;
  keySkills: string[];
  background: string;
  motivations: string[];
}

export interface CRMFieldMapping {
  id: string;
  crmFieldId: string;
  crmFieldName: string;
  jobForgeField?: string;

  type: CRMFieldType;
  required: boolean;

  value: any;
  defaultValue?: any;

  validation: {
    status: ValidationStatus;
    message?: string;
    rules?: ValidationRule[];
  };

  aiSuggestion?: AISuggestion;
  autoPopulated: boolean;
  autoPopulatedFrom?: string;

  options?: SelectOption[];
  placeholder?: string;
  helpText?: string;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface SelectOption {
  label: string;
  value: string;
  metadata?: Record<string, any>;
}

export interface AISuggestion {
  id: string;
  fieldId: string;
  value: any;
  confidence: number;
  source: string;
  reasoning?: string;
  alternatives?: any[];
  acceptedAt?: Date;
  rejectedAt?: Date;
}

export interface ValidationState {
  overall: 'valid' | 'warning' | 'error' | 'incomplete';
  requiredFields: {
    total: number;
    completed: number;
    missing: string[];
  };
  optionalFields: {
    total: number;
    completed: number;
  };
  errors: ValidationError[];
  warnings: ValidationWarning[];
  lastValidated: Date;
}

export interface ValidationError {
  fieldId: string;
  fieldName: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  fieldId: string;
  fieldName: string;
  message: string;
  suggestion?: string;
  canIgnore: boolean;
}

export interface QualityMetrics {
  clarity: number;
  readability: number;
  completeness: number;
  overallScore: number;

  bias: {
    level: 'none' | 'low' | 'medium' | 'high';
    details?: BiasDetail[];
  };

  issues: QualityIssue[];

  benchmark?: {
    similarRoles: number;
    industry: number;
  };

  analyzedAt: Date;
  version: string;
}

export interface BiasDetail {
  type: 'gender' | 'age' | 'cultural' | 'other';
  text: string;
  location: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

export interface QualityIssue {
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

export interface ApprovalRequest {
  id: string;
  jobSpecId: string;
  jobSpec: JobSpec;

  status: ApprovalStatus;
  urgency: 'normal' | 'urgent' | 'critical';

  submittedBy: string;
  assignedTo: string;

  submittedAt: Date;
  reviewedAt?: Date;
  dueDate?: Date;

  submissionNotes: string;
  reviewNotes?: string;

  comments: Comment[];
  changeRequests: ChangeRequest[];

  insights: Insight[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
  attachments?: Attachment[];
  mentions?: string[];
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface ChangeRequest {
  id: string;
  section: string;
  fieldId?: string;
  message: string;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface Insight {
  id: string;
  type: 'salary_benchmark' | 'similar_roles' | 'market_data' | 'quality_alert';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  data?: any;
  actionable: boolean;
  action?: {
    label: string;
    handler: string;
  };
}

export interface Template {
  id: string;
  name: string;
  description?: string;

  industry?: string;
  role?: string;
  seniorityLevel?: string;
  tags: string[];

  jobSpec: Partial<JobSpec>;

  createdBy: string;
  visibility: 'private' | 'team' | 'organization';

  useCount: number;
  lastUsed?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface JobForgeStats {
  jobsCreated: number;
  draftsCount: number;
  awaitingApprovalCount: number;
  approvedCount: number;
  thisWeek: number;
  averageQualityScore: number;
}

export interface UserPreferences {
  defaultView: 'list' | 'card';
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  autoSaveInterval: number;
  requireApproval: boolean;
  defaultApprover?: string;
  aiAssistanceLevel: 'minimal' | 'balanced' | 'maximum';
  autoAcceptHighConfidence: boolean;
  emailNotifications: {
    approvalRequests: boolean;
    approvalDecisions: boolean;
    comments: boolean;
  };
}
