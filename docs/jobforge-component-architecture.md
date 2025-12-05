# JobForge - Component Architecture

## 1. Component Hierarchy

```
JobForge/
├── JobForgeDashboard/
│   ├── StatsCards/
│   ├── RecentActivityList/
│   ├── ApprovalQueue/
│   └── QuickActions/
│
├── JobComposer/
│   ├── AIAssistantPanel/
│   │   ├── CreationModeSelector/
│   │   ├── AIToolsPalette/
│   │   └── VersionManager/
│   │
│   ├── JobDescriptionEditor/
│   │   ├── EditorToolbar/
│   │   ├── RichTextEditor/
│   │   ├── SectionManager/
│   │   └── AIInlineSuggestions/
│   │
│   └── CRMFieldPanel/
│       ├── FieldCompletionStatus/
│       ├── CRMFieldList/
│       ├── QualityScoreCard/
│       └── ActionButtons/
│
├── CRMFieldMapper/
│   ├── FieldGroupList/
│   │   ├── RequiredFields/
│   │   └── OptionalFields/
│   │
│   ├── FieldInput/
│   │   ├── InputControl/
│   │   ├── ValidationIndicator/
│   │   └── AISuggestionChip/
│   │
│   └── ValidationSummary/
│
├── ApprovalWorkflow/
│   ├── ApprovalSubmission/
│   │   ├── PreSubmissionChecks/
│   │   ├── ApproverSelector/
│   │   └── SubmissionPreview/
│   │
│   ├── ApprovalReview/
│   │   ├── JobSpecPreview/
│   │   ├── CRMFieldsPreview/
│   │   ├── QualityInsights/
│   │   ├── FeedbackThread/
│   │   └── DecisionActions/
│   │
│   └── ApprovalQueue/
│       ├── QueueFilters/
│       ├── QueueList/
│       ├── ApprovalQueueItem/
│       └── BatchActions/
│
├── DraftManagement/
│   ├── DraftsList/
│   │   ├── DraftsFilters/
│   │   ├── DraftCard/
│   │   └── BulkActions/
│   │
│   └── VersionComparer/
│
├── ShareInterface/
│   ├── FormatSelector/
│   ├── ContentOptions/
│   ├── BrandingSettings/
│   ├── DeliveryMethod/
│   └── PreviewPane/
│
└── Settings/
    ├── CRMIntegration/
    ├── UserPreferences/
    └── AISettings/
```

---

## 2. Core Components Specifications

### 2.1 JobComposer

**Purpose**: Main interface for creating and editing job specifications

**Props**:
```typescript
interface JobComposerProps {
  jobId?: string;              // For editing existing job
  mode?: 'create' | 'edit';
  onSave?: (job: JobSpec) => void;
  onSubmitApproval?: (job: JobSpec) => void;
  onPushToCRM?: (job: JobSpec) => void;
  initialData?: Partial<JobSpec>;
}
```

**State**:
```typescript
interface JobComposerState {
  jobSpec: JobSpec;
  crmFields: CRMField[];
  validationStatus: ValidationStatus;
  qualityMetrics: QualityMetrics;
  isDirty: boolean;
  isSaving: boolean;
  activePanel: 'ai' | 'editor' | 'crm';
  versions: JobSpecVersion[];
}
```

**Key Methods**:
- `handleAutoSave()` - Debounced auto-save (every 30s)
- `generateWithAI(prompt: string)` - Trigger AI generation
- `validateCRMFields()` - Run validation on all fields
- `updateQualityMetrics()` - Calculate quality scores
- `createVersion(name: string)` - Save current state as version

**Events**:
- `onFieldChange` - CRM field updated
- `onContentChange` - JD content updated
- `onAIGenerate` - AI generation requested
- `onValidationChange` - Validation status updated

---

### 2.2 AIAssistantPanel

**Purpose**: AI-powered tools for job spec creation and refinement

**Props**:
```typescript
interface AIAssistantPanelProps {
  jobSpec: JobSpec;
  onAICommand: (command: AICommand) => void;
  onVersionCreate: (name: string) => void;
  versions: JobSpecVersion[];
  isGenerating: boolean;
}
```

**AI Commands**:
```typescript
type AICommand =
  | { type: 'generate', prompt: string }
  | { type: 'expand', section: string }
  | { type: 'shorten', section: string }
  | { type: 'adjust_tone', tone: 'formal' | 'casual' }
  | { type: 'adjust_seniority', direction: 'up' | 'down' }
  | { type: 'localize', region: string }
  | { type: 'improve_clarity' }
  | { type: 'remove_bias' };
```

**Features**:
- **Quick Start Templates**: Scratch, Template, Email Import, Clone
- **AI Transformation Tools**: Tone, seniority, length adjustments
- **Version Management**: Create, compare, restore versions
- **Progress Indicator**: Shows AI generation progress

**UI Elements**:
```tsx
<AIAssistantPanel>
  <QuickStartSection>
    <Button icon={<FileText />}>Start from Scratch</Button>
    <Button icon={<Template />}>Use Template</Button>
    <Button icon={<Mail />}>Import from Email</Button>
    <Button icon={<Copy />}>Clone Existing</Button>
  </QuickStartSection>

  <AIToolsSection>
    <SliderControl label="Tone" min="formal" max="casual" />
    <SliderControl label="Seniority" min="junior" max="senior" />
    <ButtonGroup>
      <Button>Expand</Button>
      <Button>Shorten</Button>
    </ButtonGroup>
    <Select label="Localize for">
      <Option value="uk">UK</Option>
      <Option value="us">US</Option>
      <Option value="eu">EU</Option>
    </Select>
  </AIToolsSection>

  <VersionsSection>
    <VersionList versions={versions} />
    <Button>Compare Versions</Button>
  </VersionsSection>
</AIAssistantPanel>
```

---

### 2.3 JobDescriptionEditor

**Purpose**: Rich text editor for job description content

**Props**:
```typescript
interface JobDescriptionEditorProps {
  content: JobDescription;
  onChange: (content: JobDescription) => void;
  aiSuggestions: Suggestion[];
  onAcceptSuggestion: (id: string) => void;
  readOnly?: boolean;
}
```

**JobDescription Structure**:
```typescript
interface JobDescription {
  overview: string;
  responsibilities: string[];
  requirements: {
    required: string[];
    desirable: string[];
  };
  benefits?: string[];
  companyDescription?: string;
  candidatePersona?: string;
}
```

**Features**:
- **Tab View**: Switch between "Your Notes" and "Generated JD"
- **Section-Based Editing**: Overview, Responsibilities, Requirements, etc.
- **Rich Text Controls**: Bold, italic, lists, headings
- **AI Inline Suggestions**: Underlined suggestions with accept/reject
- **Drag-to-Reorder**: Reorder sections and bullet points
- **Templates**: Insert section templates

**Toolbar Actions**:
```tsx
<EditorToolbar>
  <ToolbarGroup>
    <IconButton icon={<Bold />} />
    <IconButton icon={<Italic />} />
    <IconButton icon={<List />} />
  </ToolbarGroup>

  <ToolbarGroup>
    <Button icon={<Sparkles />}>AI Improve</Button>
    <Button icon={<Template />}>Insert Template</Button>
  </ToolbarGroup>

  <ToolbarGroup>
    <Button icon={<Eye />}>Preview</Button>
    <Button icon={<Download />}>Export</Button>
  </ToolbarGroup>
</EditorToolbar>
```

---

### 2.4 CRMFieldPanel

**Purpose**: Display and manage CRM field mapping and validation

**Props**:
```typescript
interface CRMFieldPanelProps {
  crmFields: CRMField[];
  jobSpec: JobSpec;
  validationStatus: ValidationStatus;
  qualityMetrics: QualityMetrics;
  onFieldUpdate: (fieldId: string, value: any) => void;
  onAutoFill: () => void;
}
```

**CRMField Interface**:
```typescript
interface CRMField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'currency';
  required: boolean;
  value: any;
  validation: {
    status: 'valid' | 'warning' | 'error' | 'empty';
    message?: string;
  };
  aiSuggestion?: {
    value: any;
    confidence: number;
    source: string;
  };
  options?: Array<{ label: string; value: string }>;
}
```

**UI Structure**:
```tsx
<CRMFieldPanel>
  <FieldCompletionStatus
    required={{ completed: 8, total: 10 }}
    optional={{ completed: 3, total: 15 }}
  />

  <FieldCategories>
    <FieldCategory title="Required Fields" badge="8/10">
      {requiredFields.map(field => (
        <FieldInput
          key={field.id}
          field={field}
          onUpdate={(value) => handleFieldUpdate(field.id, value)}
        />
      ))}
    </FieldCategory>

    <FieldCategory title="Optional Fields" badge="3/15" collapsible>
      {optionalFields.map(field => (
        <FieldInput
          key={field.id}
          field={field}
          onUpdate={(value) => handleFieldUpdate(field.id, value)}
        />
      ))}
    </FieldCategory>
  </FieldCategories>

  <QualityScoreCard metrics={qualityMetrics} />

  <ActionButtons>
    <Button variant="secondary">Save Draft</Button>
    <Button variant="primary">Send for Approval</Button>
    <Button variant="primary">Push to CRM</Button>
  </ActionButtons>
</CRMFieldPanel>
```

---

### 2.5 FieldInput

**Purpose**: Smart input control with validation and AI suggestions

**Props**:
```typescript
interface FieldInputProps {
  field: CRMField;
  onUpdate: (value: any) => void;
  showAISuggestions?: boolean;
}
```

**Rendering Logic**:
```tsx
function FieldInput({ field, onUpdate, showAISuggestions = true }) {
  const renderInput = () => {
    switch (field.type) {
      case 'text':
        return <TextInput {...field} onChange={onUpdate} />;
      case 'select':
        return <Select options={field.options} onChange={onUpdate} />;
      case 'currency':
        return <CurrencyInput {...field} onChange={onUpdate} />;
      // ... other types
    }
  };

  return (
    <FieldWrapper>
      <FieldLabel required={field.required}>
        {field.label}
        <ValidationIndicator status={field.validation.status} />
      </FieldLabel>

      {renderInput()}

      {field.aiSuggestion && showAISuggestions && (
        <AISuggestionChip
          suggestion={field.aiSuggestion.value}
          confidence={field.aiSuggestion.confidence}
          source={field.aiSuggestion.source}
          onAccept={() => onUpdate(field.aiSuggestion.value)}
        />
      )}

      {field.validation.message && (
        <ValidationMessage status={field.validation.status}>
          {field.validation.message}
        </ValidationMessage>
      )}
    </FieldWrapper>
  );
}
```

---

### 2.6 ApprovalReview

**Purpose**: Manager interface for reviewing job specs

**Props**:
```typescript
interface ApprovalReviewProps {
  approvalRequest: ApprovalRequest;
  onApprove: (notes?: string) => void;
  onRequestChanges: (feedback: string) => void;
  onReject: (reason: string) => void;
  onComment: (comment: Comment) => void;
}
```

**ApprovalRequest Interface**:
```typescript
interface ApprovalRequest {
  id: string;
  jobSpec: JobSpec;
  submittedBy: User;
  submittedAt: Date;
  urgency: 'normal' | 'urgent' | 'critical';
  notes: string;
  crmFields: CRMField[];
  qualityMetrics: QualityMetrics;
  insights: Insight[];
  comments: Comment[];
}
```

**Layout**:
```tsx
<ApprovalReview>
  <ApprovalHeader>
    <JobTitle>{jobSpec.title}</JobTitle>
    <UrgencyBadge level={urgency} />
    <SubmissionInfo>
      Submitted by {submittedBy.name} • {timeAgo(submittedAt)}
    </SubmissionInfo>
  </ApprovalHeader>

  <SplitView>
    <JobSpecPreview>
      <Tabs>
        <Tab label="Job Description">
          <JobDescriptionView content={jobSpec.description} />
        </Tab>
        <Tab label="Full Preview">
          <FullJobPreview jobSpec={jobSpec} />
        </Tab>
      </Tabs>
    </JobSpecPreview>

    <CRMFieldsPreview>
      <FieldCompletionStatus />
      <CRMFieldList fields={crmFields} readOnly />
      <QualityScoreCard metrics={qualityMetrics} />
    </CRMFieldsPreview>
  </SplitView>

  <InsightsSection>
    {insights.map(insight => (
      <InsightCard key={insight.id} insight={insight} />
    ))}
  </InsightsSection>

  <FeedbackSection>
    <CommentThread comments={comments} />
    <CommentInput onSubmit={onComment} />
  </FeedbackSection>

  <DecisionActions>
    <Button variant="success" onClick={handleApprove}>
      Approve & Push to CRM
    </Button>
    <Button variant="warning" onClick={handleRequestChanges}>
      Request Changes
    </Button>
    <Button variant="danger" onClick={handleReject}>
      Reject
    </Button>
  </DecisionActions>
</ApprovalReview>
```

---

### 2.7 QualityScoreCard

**Purpose**: Display quality metrics for job spec

**Props**:
```typescript
interface QualityScoreCardProps {
  metrics: QualityMetrics;
  showDetails?: boolean;
}

interface QualityMetrics {
  clarity: number;          // 0-100
  bias: 'none' | 'low' | 'medium' | 'high';
  completeness: number;     // 0-100
  readability: number;      // 0-100
  overallScore: number;     // 0-100
  issues: QualityIssue[];
}

interface QualityIssue {
  type: 'grammar' | 'bias' | 'clarity' | 'completeness';
  severity: 'info' | 'warning' | 'error';
  message: string;
  location?: string;       // Section or field
  suggestion?: string;
}
```

**UI Implementation**:
```tsx
<QualityScoreCard metrics={metrics}>
  <ScoreHeader>
    <OverallScore score={metrics.overallScore} />
    <ScoreLabel>{getScoreLabel(metrics.overallScore)}</ScoreLabel>
  </ScoreHeader>

  <MetricsList>
    <MetricItem
      label="Clarity"
      value={metrics.clarity}
      status={getStatus(metrics.clarity)}
    />
    <MetricItem
      label="Bias"
      value={metrics.bias}
      status={getBiasStatus(metrics.bias)}
    />
    <MetricItem
      label="Completeness"
      value={metrics.completeness}
      status={getStatus(metrics.completeness)}
    />
    <MetricItem
      label="Readability"
      value={metrics.readability}
      status={getStatus(metrics.readability)}
    />
  </MetricsList>

  {metrics.issues.length > 0 && (
    <IssuesList>
      <IssuesHeader>Issues ({metrics.issues.length})</IssuesHeader>
      {metrics.issues.map(issue => (
        <IssueItem key={issue.id} issue={issue} />
      ))}
    </IssuesList>
  )}
</QualityScoreCard>
```

---

### 2.8 AISuggestionChip

**Purpose**: Display AI suggestions with accept/reject actions

**Props**:
```typescript
interface AISuggestionChipProps {
  suggestion: any;
  confidence: number;      // 0-100
  source: string;          // "Detected from job title"
  onAccept: () => void;
  onReject: () => void;
  variant?: 'inline' | 'popover';
}
```

**UI Variants**:

**Inline**:
```tsx
<AISuggestionChip variant="inline">
  <SuggestionIcon />
  <SuggestionText>
    AI suggests: "{suggestion}" ({confidence}%)
  </SuggestionText>
  <Source>{source}</Source>
  <Actions>
    <IconButton icon={<Check />} onClick={onAccept} />
    <IconButton icon={<X />} onClick={onReject} />
  </Actions>
</AISuggestionChip>
```

**Popover**:
```tsx
<Popover trigger={<AIIndicatorDot />}>
  <PopoverContent>
    <SuggestionHeader>
      AI Suggestion ({confidence}% confident)
    </SuggestionHeader>
    <SuggestionValue>{suggestion}</SuggestionValue>
    <SuggestionSource>{source}</SuggestionSource>
    <PopoverActions>
      <Button onClick={onAccept}>Accept</Button>
      <Button variant="ghost" onClick={onReject}>Dismiss</Button>
    </PopoverActions>
  </PopoverContent>
</Popover>
```

---

### 2.9 VersionComparer

**Purpose**: Compare different versions of job spec

**Props**:
```typescript
interface VersionComparerProps {
  versions: JobSpecVersion[];
  onSelectVersion: (versionId: string) => void;
  onMerge?: (versionIds: string[]) => void;
}

interface JobSpecVersion {
  id: string;
  name: string;
  createdAt: Date;
  content: JobSpec;
  tags?: string[];
}
```

**UI Layout**:
```tsx
<VersionComparer>
  <VersionSelector>
    <VersionDropdown
      label="Version A"
      versions={versions}
      selected={versionA}
      onChange={setVersionA}
    />
    <VersionDropdown
      label="Version B"
      versions={versions}
      selected={versionB}
      onChange={setVersionB}
    />
  </VersionSelector>

  <ComparisonView>
    <DiffViewer
      left={versionA.content}
      right={versionB.content}
      highlightDifferences
    />
  </ComparisonView>

  <ComparisonActions>
    <Button onClick={() => onSelectVersion(versionA.id)}>
      Use Version A
    </Button>
    <Button onClick={() => onSelectVersion(versionB.id)}>
      Use Version B
    </Button>
    {onMerge && (
      <Button onClick={() => onMerge([versionA.id, versionB.id])}>
        Merge Versions
      </Button>
    )}
  </ComparisonActions>
</VersionComparer>
```

---

### 2.10 ShareInterface

**Purpose**: Generate shareable job specifications

**Props**:
```typescript
interface ShareInterfaceProps {
  jobSpec: JobSpec;
  onShare: (config: ShareConfig) => void;
}

interface ShareConfig {
  format: 'branded-pdf' | 'unbranded-pdf' | 'email' | 'markdown' | 'plain';
  includesSalary: boolean;
  includesCompany: boolean;
  includesReferenceNumber: boolean;
  includesContactDetails: boolean;
  branding?: BrandingConfig;
  customMessage?: string;
  deliveryMethod: 'link' | 'download' | 'email' | 'clipboard';
  trackingEnabled?: boolean;
}
```

**UI Flow**:
```tsx
<ShareInterface>
  <FormatSelector
    selected={format}
    onChange={setFormat}
    options={[
      { value: 'branded-pdf', label: 'Branded PDF', icon: <FileText /> },
      { value: 'unbranded-pdf', label: 'Unbranded PDF', icon: <File /> },
      { value: 'email', label: 'Email Text', icon: <Mail /> },
      { value: 'markdown', label: 'Markdown', icon: <Code /> },
      { value: 'plain', label: 'Plain Text', icon: <AlignLeft /> },
    ]}
  />

  <ContentOptions>
    <Checkbox checked={includesSalary} onChange={setIncludesSalary}>
      Include salary range
    </Checkbox>
    <Checkbox checked={includesCompany} onChange={setIncludesCompany}>
      Include company description
    </Checkbox>
    <Checkbox checked={includesReference} onChange={setIncludesReference}>
      Include reference number
    </Checkbox>
    <Checkbox checked={includesContact} onChange={setIncludesContact}>
      Include consultant contact
    </Checkbox>
  </ContentOptions>

  {format.includes('pdf') && (
    <BrandingSettings>
      <LogoUpload />
      <TemplateSelector />
      <ColorSchemeSelector />
    </BrandingSettings>
  )}

  <CustomMessage>
    <Textarea
      placeholder="Add custom message (optional)"
      value={customMessage}
      onChange={setCustomMessage}
    />
  </CustomMessage>

  <PreviewPane>
    <PreviewTitle>Preview</PreviewTitle>
    <PreviewContent format={format} config={shareConfig} />
    <Button variant="ghost">View Full Preview</Button>
  </PreviewPane>

  <DeliveryMethod>
    <Radio name="delivery" value="link">
      Generate shareable link (expires in 30 days)
    </Radio>
    <Radio name="delivery" value="download">
      Download file
    </Radio>
    <Radio name="delivery" value="email">
      Send via email
    </Radio>
    <Radio name="delivery" value="clipboard">
      Copy to clipboard
    </Radio>
  </DeliveryMethod>

  {deliveryMethod === 'link' && (
    <TrackingOptions>
      <Checkbox checked={trackingEnabled}>
        Enable tracking (notify when opened)
      </Checkbox>
    </TrackingOptions>
  )}

  <ShareActions>
    <Button variant="secondary" onClick={onCancel}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleShare}>
      Generate & Share
    </Button>
  </ShareActions>
</ShareInterface>
```

---

## 3. State Management Architecture

### Global State (Redux/Zustand)

```typescript
interface JobForgeState {
  // User & Auth
  currentUser: User;
  permissions: Permission[];

  // CRM Integration
  crmConnection: {
    status: 'connected' | 'disconnected' | 'error';
    lastSync: Date;
    schema: CRMSchema;
  };

  // Active Job Composer
  activeJob: {
    spec: JobSpec;
    isDirty: boolean;
    lastSaved: Date;
    validationStatus: ValidationStatus;
    qualityMetrics: QualityMetrics;
  };

  // Drafts
  drafts: JobSpec[];
  draftsFilter: DraftFilter;

  // Approvals
  approvalQueue: ApprovalRequest[];
  approvalFilter: ApprovalFilter;

  // Templates
  templates: Template[];

  // UI State
  ui: {
    activePanel: 'ai' | 'editor' | 'crm';
    sidebarCollapsed: boolean;
    modals: {
      shareOpen: boolean;
      crmMapperOpen: boolean;
      approvalSubmitOpen: boolean;
    };
  };

  // AI State
  ai: {
    isGenerating: boolean;
    lastGeneration: Date;
    suggestions: Suggestion[];
  };
}
```

### Actions

```typescript
// Job Actions
const jobActions = {
  createJob: (initialData?: Partial<JobSpec>) => void;
  updateJob: (updates: Partial<JobSpec>) => void;
  saveJob: () => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  duplicateJob: (jobId: string) => Promise<JobSpec>;

  // AI Actions
  generateWithAI: (prompt: string) => Promise<void>;
  applyAICommand: (command: AICommand) => Promise<void>;
  acceptSuggestion: (suggestionId: string) => void;
  rejectSuggestion: (suggestionId: string) => void;

  // Validation Actions
  validateCRMFields: () => ValidationStatus;
  updateQualityMetrics: () => QualityMetrics;

  // Version Actions
  createVersion: (name: string) => JobSpecVersion;
  restoreVersion: (versionId: string) => void;
  compareVersions: (v1: string, v2: string) => void;
};

// Approval Actions
const approvalActions = {
  submitForApproval: (jobId: string, config: ApprovalConfig) => Promise<void>;
  approveJob: (requestId: string, notes?: string) => Promise<void>;
  requestChanges: (requestId: string, feedback: string) => Promise<void>;
  rejectJob: (requestId: string, reason: string) => Promise<void>;
  addComment: (requestId: string, comment: Comment) => Promise<void>;
};

// CRM Actions
const crmActions = {
  connectCRM: (credentials: CRMCredentials) => Promise<void>;
  syncCRMSchema: () => Promise<CRMSchema>;
  pushJobToCRM: (jobId: string) => Promise<{ crmJobId: string }>;
  validateCRMField: (fieldId: string, value: any) => ValidationResult;
  autoFillCRMFields: (jobSpec: JobSpec) => CRMField[];
};
```

---

## 4. API Integration Layer

### API Client

```typescript
class JobForgeAPI {
  // Job Spec Endpoints
  async createJobSpec(data: Partial<JobSpec>): Promise<JobSpec>;
  async updateJobSpec(id: string, updates: Partial<JobSpec>): Promise<JobSpec>;
  async getJobSpec(id: string): Promise<JobSpec>;
  async listJobSpecs(filter?: JobSpecFilter): Promise<JobSpec[]>;
  async deleteJobSpec(id: string): Promise<void>;

  // AI Endpoints
  async generateJobDescription(prompt: string): Promise<JobDescription>;
  async applyAITransform(jobId: string, command: AICommand): Promise<JobSpec>;
  async getSuggestions(jobId: string): Promise<Suggestion[]>;
  async checkQuality(content: string): Promise<QualityMetrics>;

  // CRM Endpoints
  async getCRMSchema(): Promise<CRMSchema>;
  async validateCRMField(field: CRMField): Promise<ValidationResult>;
  async pushToCRM(jobSpec: JobSpec): Promise<{ crmJobId: string }>;
  async syncFromCRM(crmJobId: string): Promise<JobSpec>;

  // Approval Endpoints
  async submitForApproval(jobId: string, config: ApprovalConfig): Promise<ApprovalRequest>;
  async getApprovalQueue(filter?: ApprovalFilter): Promise<ApprovalRequest[]>;
  async approveRequest(requestId: string, notes?: string): Promise<void>;
  async requestChanges(requestId: string, feedback: string): Promise<void>;
  async rejectRequest(requestId: string, reason: string): Promise<void>;

  // Share Endpoints
  async generateShareLink(jobId: string, config: ShareConfig): Promise<{ url: string }>;
  async generatePDF(jobId: string, config: ShareConfig): Promise<Blob>;
  async trackLinkAccess(linkId: string): Promise<AccessMetrics>;
}
```

---

## 5. Hooks for Component Logic

### useJobComposer

```typescript
function useJobComposer(jobId?: string) {
  const [jobSpec, setJobSpec] = useState<JobSpec>();
  const [crmFields, setCRMFields] = useState<CRMField[]>([]);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>();
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics>();
  const [isDirty, setIsDirty] = useState(false);

  // Auto-save logic
  useAutoSave(jobSpec, 30000); // Every 30 seconds

  // Validation
  const validateFields = useCallback(async () => {
    const status = await api.validateCRMFields(crmFields);
    setValidationStatus(status);
  }, [crmFields]);

  // Quality metrics
  const updateQuality = useCallback(async () => {
    const metrics = await api.checkQuality(jobSpec.description);
    setQualityMetrics(metrics);
  }, [jobSpec]);

  // AI generation
  const generateWithAI = useCallback(async (prompt: string) => {
    const result = await api.generateJobDescription(prompt);
    setJobSpec(prev => ({ ...prev, description: result }));
    updateQuality();
  }, []);

  return {
    jobSpec,
    crmFields,
    validationStatus,
    qualityMetrics,
    isDirty,
    updateJobSpec: setJobSpec,
    updateCRMField: (fieldId, value) => { /* ... */ },
    generateWithAI,
    saveJob: () => api.updateJobSpec(jobId, jobSpec),
  };
}
```

### useAIAssistant

```typescript
function useAIAssistant(jobSpec: JobSpec) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const applyCommand = useCallback(async (command: AICommand) => {
    setIsGenerating(true);
    try {
      const result = await api.applyAITransform(jobSpec.id, command);
      return result;
    } finally {
      setIsGenerating(false);
    }
  }, [jobSpec]);

  const getSuggestions = useCallback(async () => {
    const sug = await api.getSuggestions(jobSpec.id);
    setSuggestions(sug);
  }, [jobSpec]);

  return {
    isGenerating,
    suggestions,
    applyCommand,
    getSuggestions,
  };
}
```

### useApprovalWorkflow

```typescript
function useApprovalWorkflow() {
  const [queue, setQueue] = useState<ApprovalRequest[]>([]);
  const [filter, setFilter] = useState<ApprovalFilter>({});

  const loadQueue = useCallback(async () => {
    const requests = await api.getApprovalQueue(filter);
    setQueue(requests);
  }, [filter]);

  const approve = useCallback(async (requestId: string, notes?: string) => {
    await api.approveRequest(requestId, notes);
    await loadQueue();
  }, [loadQueue]);

  const requestChanges = useCallback(async (requestId: string, feedback: string) => {
    await api.requestChanges(requestId, feedback);
    await loadQueue();
  }, [loadQueue]);

  const reject = useCallback(async (requestId: string, reason: string) => {
    await api.rejectRequest(requestId, reason);
    await loadQueue();
  }, [loadQueue]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  return {
    queue,
    filter,
    setFilter,
    approve,
    requestChanges,
    reject,
  };
}
```

---

## 6. Performance Optimizations

### Code Splitting

```typescript
// Lazy load heavy components
const JobComposer = lazy(() => import('./JobComposer'));
const ApprovalReview = lazy(() => import('./ApprovalReview'));
const VersionComparer = lazy(() => import('./VersionComparer'));
const ShareInterface = lazy(() => import('./ShareInterface'));
```

### Memoization

```typescript
// Memoize expensive calculations
const qualityMetrics = useMemo(() => {
  return calculateQualityMetrics(jobSpec.description);
}, [jobSpec.description]);

// Memoize callbacks
const handleFieldUpdate = useCallback((fieldId, value) => {
  setFields(prev => prev.map(f =>
    f.id === fieldId ? { ...f, value } : f
  ));
}, []);
```

### Debouncing

```typescript
// Debounce auto-save
const debouncedSave = useDebouncedCallback(
  async (jobSpec) => {
    await api.updateJobSpec(jobSpec.id, jobSpec);
  },
  30000 // 30 seconds
);

// Debounce validation
const debouncedValidate = useDebouncedCallback(
  async (fields) => {
    const status = await api.validateCRMFields(fields);
    setValidationStatus(status);
  },
  500
);
```

### Virtualization

```typescript
// Virtualize long lists (drafts, approvals)
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={drafts.length}
  itemSize={120}
  width="100%"
>
  {({ index, style }) => (
    <DraftCard key={drafts[index].id} draft={drafts[index]} style={style} />
  )}
</FixedSizeList>
```

---

This completes the comprehensive component architecture for JobForge!
