# JobForge - UI/UX Design Specification

## 1. Design System & Principles

### Design Principles
1. **Speed First**: Optimize for power users who create multiple specs daily
2. **Progressive Disclosure**: Simple for beginners, powerful for experts
3. **Transparency**: Always show what's happening with AI and CRM
4. **Trust & Control**: AI assists, human decides
5. **Error Prevention**: Guide users away from mistakes before they happen

### Visual Hierarchy
- **Primary Action**: Always visible, usually top-right (Push to CRM, Save, etc.)
- **Secondary Actions**: Toolbar or dropdown
- **Tertiary Actions**: Context menus, right-click
- **Status Indicators**: Persistent top bar or sidebar

### Color Coding
- **Green**: Valid, approved, complete
- **Amber**: Warning, needs attention, optional missing
- **Red**: Error, required field missing, validation failed
- **Blue**: AI-generated, suggestion, in-progress
- **Purple**: Manager review, approval workflow
- **Gray**: Draft, inactive, archived

---

## 2. Navigation Structure

### Main Navigation (HomeSidebar Addition)

```
Home Sidebar
├── Dashboard
├── Calendar
├── Suggestions
└── **JobForge** (NEW)
    ├── Active Jobs
    ├── Drafts
    ├── Awaiting Approval
    ├── Approved
    └── Templates
```

### JobForge Section Structure

```
JobForge
├── Overview Dashboard
│   ├── Quick Stats
│   ├── Recent Jobs
│   ├── Pending Approvals (if manager)
│   └── CRM Sync Status
│
├── Create New Job
│   └── Opens Job Composer
│
├── My Drafts
│   ├── List View
│   ├── Card View
│   └── Search/Filter
│
├── Approval Workflow
│   ├── Awaiting My Review (managers)
│   ├── I Submitted
│   └── History
│
├── Templates
│   ├── Personal Templates
│   ├── Team Templates
│   └── Create Template
│
└── Settings
    ├── CRM Connection
    ├── Preferences
    └── AI Settings
```

---

## 3. Screen Layouts

### 3.1 JobForge Dashboard (Overview)

**Layout**: Grid with cards

```
┌─────────────────────────────────────────────────────────────┐
│ JobForge                          [+ Create New Job] [Settings]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ Quick Stats (4-column grid)                                  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │ Jobs     │ │ Drafts   │ │ Awaiting │ │ This     │       │
│ │ Created  │ │          │ │ Approval │ │ Week     │       │
│ │   24     │ │    3     │ │    2     │ │   8      │       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                               │
│ Recent Activity                          View All >          │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ ● Senior Developer - Tech Corp                      │    │
│ │   Pushed to CRM • 2 hours ago                      │    │
│ │                                                      │    │
│ │ ● Marketing Manager - Retail Ltd                   │    │
│ │   Awaiting approval • 5 hours ago                  │    │
│ │                                                      │    │
│ │ ● Junior Designer - Creative Agency                │    │
│ │   Draft saved • 1 day ago                          │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                               │
│ Pending Approvals (Manager View)        View All >          │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ [!] Data Engineer - FinTech Startup                │    │
│ │     Submitted by Sarah • Urgent • 3 hours ago      │    │
│ │     [Review] [Quick Approve]                        │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                               │
│ Quick Actions                                                 │
│ [Clone Last Job] [Use Template] [Import from Email]         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Components**:
- `<JobForgeStats>` - Quick stats cards
- `<RecentActivityList>` - Timeline of recent jobs
- `<ApprovalQueue>` - Manager-only section
- `<QuickActions>` - Common shortcuts

---

### 3.2 Job Composer (Main Creation Interface)

**Layout**: Three-panel layout (collapsible sides)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ JobForge > New Job                    [Draft Auto-saved 30s ago] [Exit] │
├───────────┬──────────────────────────────────────┬───────────────────────┤
│           │                                      │                       │
│ AI        │  MAIN COMPOSER                      │  CRM FIELDS          │
│ ASSISTANT │                                      │                       │
│           │  Job Title *                         │  ✓ Required (8/10)   │
│ ┌───────┐ │  [Senior Software Engineer____]     │  ⚠ Optional (3/15)   │
│ │ Start │ │                                      │                       │
│ │ from: │ │  Industry: Technology               │  ┌─────────────────┐ │
│ └───────┘ │  Location: Manchester (Hybrid)      │  │ Job Title    ✓ │ │
│           │                                      │  │ Industry     ✓ │ │
│ • Scratch │  Salary Range                        │  │ Location     ✓ │ │
│ • Template│  £60,000 - £80,000                  │  │ Salary       ✓ │ │
│ • Email   │                                      │  │ Seniority    ✓ │ │
│ • Clone   │  ─────────────────────────────────   │  │ Work Type    ✓ │ │
│           │                                      │  │ Experience   ✓ │ │
│ ┌───────┐ │  Job Description                     │  │ Cert Req     ⚠ │ │
│ │ AI    │ │                                      │  │ Tags         ⚠ │ │
│ │ Tools │ │  [Tab: Notes] [Tab: Generated]      │  │ Department     │ │
│ └───────┘ │                                      │  └─────────────────┘ │
│           │  ┌────────────────────────────────┐ │                       │
│ • Expand  │  │ We need a senior dev who...    │ │  [View All Fields]   │
│ • Shorten │  │ - React experience             │ │                       │
│ • Tone ↕  │  │ - Team leadership              │ │  ┌─────────────────┐ │
│ • Senior↕ │  │ - Cloud platforms              │ │  │ QUALITY SCORE   │ │
│ • Localize│  └────────────────────────────────┘ │  │                 │ │
│           │                                      │  │   Clarity: 85%  │ │
│ ┌───────┐ │  [Generate JD with AI ✨]          │  │   Bias: None    │ │
│ │Versions│ │                                      │  │   Complete: 80% │ │
│ └───────┘ │  ─────────────────────────────────   │  └─────────────────┘ │
│           │                                      │                       │
│ • v1      │  Responsibilities                    │  ┌─────────────────┐ │
│ • v2      │  • Lead development of React apps    │  │ ACTIONS         │ │
│ • v3      │  • Mentor junior developers          │  │                 │ │
│           │  • Architect cloud solutions         │  │ [Save Draft]    │ │
│ [Compare] │                                      │  │ [Send Approval] │ │
│           │  Requirements                        │  │ [Push to CRM]   │ │
│           │  • 5+ years React experience         │  │ [Share Client]  │ │
│           │  • Leadership experience             │  │                 │ │
│           │  • AWS/Azure knowledge               │  └─────────────────┘ │
│           │                                      │                       │
└───────────┴──────────────────────────────────────┴───────────────────────┘
                              [< Back] [Save & Close]
```

**Key Features**:

**Left Panel: AI Assistant**
- Collapsible (can hide for focus mode)
- Quick creation options
- AI transformation tools
- Version management
- Always accessible, non-intrusive

**Center Panel: Main Composer**
- Tab-based: Notes ↔ Generated JD
- Rich text editor for generated content
- Section-based editing (Overview, Responsibilities, Requirements)
- Real-time AI suggestions (underline)
- Drag-to-reorder sections

**Right Panel: CRM Fields & Validation**
- Live validation status
- Field completion checklist
- Quality metrics
- Action buttons
- Auto-updates as composer changes

**Components**:
- `<JobComposer>` - Main container
- `<AIAssistantPanel>` - Left sidebar
- `<JobDescriptionEditor>` - Center editor
- `<CRMFieldPanel>` - Right sidebar
- `<ValidationStatus>` - Real-time field validation
- `<QualityScore>` - Clarity, bias, completeness metrics

---

### 3.3 CRM Field Mapping (Detailed View)

**Layout**: Modal or full-screen overlay

```
┌─────────────────────────────────────────────────────────────────┐
│ CRM Field Mapping                                [Save] [Cancel] │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ Required Fields (8/10 Complete)                [Auto-fill All]   │
│                                                                   │
│ Job Title *                                              ✓       │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Senior Software Engineer                                    ││
│ └─────────────────────────────────────────────────────────────┘│
│ AI detected from: Job description title                         │
│                                                                   │
│ Industry *                                                ✓       │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Technology                                    ▼              ││
│ └─────────────────────────────────────────────────────────────┘│
│ AI detected from: Job content                                    │
│                                                                   │
│ Salary Range *                                            ✓       │
│ ┌──────────────────────┐    to    ┌──────────────────────────┐│
│ │ £60,000             │          │ £80,000                  ││
│ └──────────────────────┘          └──────────────────────────┘│
│ Currency: GBP ▼          Per: Year ▼                           │
│ AI extracted from: Job description                               │
│                                                                   │
│ Location *                                                ✓       │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Manchester, UK                                              ││
│ └─────────────────────────────────────────────────────────────┘│
│ Work Type: Hybrid ▼                                             │
│                                                                   │
│ Seniority Level *                                         ⚠       │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Senior                                        ▼              ││
│ └─────────────────────────────────────────────────────────────┘│
│ ⚠ Suggestion: "Senior" - Confidence: 95%        [Accept]        │
│                                                                   │
│ Experience Required *                                     ⚠       │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ [________________] years                                    ││
│ └─────────────────────────────────────────────────────────────┘│
│ ⚠ AI suggests: 5 years (from "5+ years React")  [Accept]        │
│                                                                   │
│ Employment Type *                                         ✓       │
│ □ Full-time  □ Part-time  □ Contract  ☑ Permanent              │
│                                                                   │
│ ────────────────────────────────────────────────────────────────│
│                                                                   │
│ Optional Fields (3/15 Complete)                  [Show All]      │
│                                                                   │
│ Department                                                        │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Engineering                                   ▼              ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│ Certifications Required                                          │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ [+ Add certification]                                       ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│ ────────────────────────────────────────────────────────────────│
│                                                                   │
│ Validation Status                                                 │
│ ✓ All required fields complete                                   │
│ ⚠ 2 optional fields have suggestions                            │
│ ✓ No validation errors                                           │
│                                                                   │
│                                    [Cancel] [Save & Continue]    │
└─────────────────────────────────────────────────────────────────┘
```

**Key Features**:
- **Status Indicators**: ✓ (complete), ⚠ (needs attention), ✗ (error)
- **AI Provenance**: Show where data was extracted from
- **Confidence Scores**: For AI suggestions
- **One-Click Accept**: For AI suggestions
- **Smart Validation**: Real-time, prevents invalid data
- **Progress Bar**: Visual completion status

**Components**:
- `<CRMFieldMapper>` - Main container
- `<FieldInput>` - Individual field with validation
- `<AIsuggestion>` - Suggestion chips with confidence
- `<ValidationSummary>` - Overall status
- `<FieldGroup>` - Required/Optional grouping

---

### 3.4 Approval Request Interface

**Consultant View: Submit for Approval**

```
┌─────────────────────────────────────────────────────────────┐
│ Submit Job Spec for Approval                                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ Job: Senior Software Engineer - Tech Corp                    │
│                                                               │
│ Pre-submission Checks                                         │
│ ✓ All required CRM fields complete                           │
│ ✓ Quality score: 87% (Good)                                  │
│ ✓ No bias detected                                           │
│ ⚠ Salary 5% below market average                            │
│   [View Details] [Ignore]                                    │
│                                                               │
│ Select Approver *                                             │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Sarah Jenkins (Team Lead)                   ▼         │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                               │
│ Urgency                                                       │
│ ○ Normal    ● Urgent    ○ Critical                          │
│                                                               │
│ Notes for Approver                                            │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Client requested ASAP. Salary negotiable.             │   │
│ │                                                        │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                               │
│ Preview Approval Request                                      │
│ [View as Approver Will See It]                               │
│                                                               │
│                                  [Cancel] [Submit for Approval]│
└─────────────────────────────────────────────────────────────┘
```

**Manager View: Review Approval Request**

```
┌─────────────────────────────────────────────────────────────────┐
│ Review Job Spec                                      [Urgent 🔴] │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ Senior Software Engineer - Tech Corp                             │
│ Submitted by: John Smith • 3 hours ago                           │
│ Notes: "Client requested ASAP. Salary negotiable."               │
│                                                                   │
│ ┌─────────────────────┬─────────────────────────────────────┐  │
│ │ JOB DESCRIPTION     │  CRM FIELDS                         │  │
│ │                     │                                       │  │
│ │ Overview            │  Job Title: Senior Software Engineer │  │
│ │ We are seeking...   │  Industry: Technology                │  │
│ │                     │  Location: Manchester (Hybrid)       │  │
│ │ Responsibilities    │  Salary: £60k - £80k                 │  │
│ │ • Lead development  │  Seniority: Senior                   │  │
│ │ • Mentor juniors    │  Experience: 5 years                 │  │
│ │ • Architect cloud   │  Type: Permanent                     │  │
│ │                     │                                       │  │
│ │ Requirements        │  [View All Fields]                   │  │
│ │ • 5+ years React    │                                       │  │
│ │ • Leadership exp    │  Quality Metrics                     │  │
│ │ • AWS/Azure         │  Clarity: 87%                        │  │
│ │                     │  Bias: None                          │  │
│ │ [View Full JD]      │  Completeness: 100%                  │  │
│ └─────────────────────┴─────────────────────────────────────┘  │
│                                                                   │
│ Insights & Recommendations                                        │
│ ⚠ Salary is 5% below market average for this role               │
│   Market range: £65k - £90k                                      │
│   [View Benchmark Data]                                          │
│                                                                   │
│ ✓ Similar roles you approved: 3 matches                         │
│   [Compare with Similar]                                         │
│                                                                   │
│ Feedback & Comments                                              │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ [Add comment or request changes...]                         ││
│ │                                                              ││
│ │ 💡 Tag specific sections:                                   ││
│ │ [@Salary] [@Requirements] [@Responsibilities]               ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│ Decision                                                          │
│ ┌──────────────┐ ┌──────────────┐ ┌─────────────────────────┐  │
│ │   Approve    │ │Request Changes│ │        Reject           │  │
│ │  & Push CRM  │ │ (with feedback│ │  (with explanation)     │  │
│ └──────────────┘ └──────────────┘ └─────────────────────────┘  │
│                                                                   │
│ Advanced Options                                                  │
│ □ Approve with edits (I'll make minor adjustments)              │
│ □ Push to CRM immediately                                        │
│ □ Require re-review after changes                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Components**:
- `<ApprovalSubmission>` - Consultant submission form
- `<ApprovalReview>` - Manager review interface
- `<ComparisonView>` - Side-by-side JD and CRM fields
- `<QualityInsights>` - AI-powered insights
- `<FeedbackThread>` - Comment system
- `<DecisionActions>` - Approve/Request Changes/Reject

---

### 3.5 My Drafts (List View)

```
┌─────────────────────────────────────────────────────────────────┐
│ My Drafts                                  [🔍 Search] [Filter▼] │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ 📊 Sort: Last Modified ▼          View: [List] Card              │
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Senior Software Engineer - Tech Corp              [⋮ Menu]   ││
│ │ Last edited: 2 hours ago • Created: Today                    ││
│ │                                                               ││
│ │ Status: ⚠ 8/10 required fields complete                     ││
│ │ Quality: 87% • Salary: £60k-£80k • Location: Manchester     ││
│ │                                                               ││
│ │ [Continue Editing] [Duplicate] [Delete]                      ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Marketing Manager - Retail Ltd                    [⋮ Menu]   ││
│ │ Last edited: 1 day ago • Created: 3 days ago                ││
│ │                                                               ││
│ │ Status: ✓ Ready to submit                                   ││
│ │ Quality: 92% • Salary: £45k-£55k • Location: London         ││
│ │                                                               ││
│ │ [Send for Approval] [Continue Editing] [Duplicate]           ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Junior Designer - Creative Agency                 [⋮ Menu]   ││
│ │ Last edited: 3 days ago • Created: 1 week ago               ││
│ │                                                               ││
│ │ Status: ⚠ Missing: Certifications, Department               ││
│ │ Quality: 78% • Salary: £25k-£30k • Location: Remote         ││
│ │                                                               ││
│ │ [Continue Editing] [Duplicate] [Delete]                      ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│                                                                   │
│                                    [Load More] (12 more drafts)  │
└─────────────────────────────────────────────────────────────────┘
```

**Filters Available**:
- Status (Complete, Incomplete, Ready)
- Date (Today, This Week, This Month, Older)
- Industry
- Salary Range
- Location

**Bulk Actions**:
- Select multiple drafts
- Bulk delete
- Bulk duplicate
- Export selected

**Components**:
- `<DraftsList>` - Main list container
- `<DraftCard>` - Individual draft item
- `<DraftFilters>` - Filter sidebar
- `<BulkActions>` - Multi-select actions

---

### 3.6 Share with Client Interface

```
┌─────────────────────────────────────────────────────────────┐
│ Share Job Specification                                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ Job: Senior Software Engineer - Tech Corp                    │
│                                                               │
│ Format                                                        │
│ ● Branded PDF    ○ Unbranded PDF    ○ Email Text           │
│ ○ Markdown       ○ Plain Text                               │
│                                                               │
│ Content Options                                               │
│ ☑ Include salary range                                       │
│ ☑ Include company description                               │
│ ☐ Include internal reference number                         │
│ ☐ Include consultant contact details                        │
│ ☑ Include application instructions                          │
│                                                               │
│ Branding                                                      │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Agency Logo: [Your Agency Name]             [Change] │   │
│ │ Template: Professional         ▼                      │   │
│ │ Color Scheme: Corporate Blue   ▼                      │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                               │
│ Custom Message (Optional)                                     │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Dear Hiring Manager,                                   │   │
│ │                                                        │   │
│ │ Please find attached the job specification for...     │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                               │
│ Preview                                                       │
│ ┌───────────────────────────────────────────────────────┐   │
│ │                                                        │   │
│ │         [YOUR AGENCY NAME]                            │   │
│ │                                                        │   │
│ │    Senior Software Engineer                           │   │
│ │    Tech Corp                                          │   │
│ │                                                        │   │
│ │    Overview                                           │   │
│ │    We are seeking an experienced...                  │   │
│ │                                                        │   │
│ │    [View Full Preview]                                │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                               │
│ Delivery Method                                               │
│ ○ Generate shareable link (expires in: 30 days ▼)           │
│ ● Download PDF                                               │
│ ○ Copy to clipboard (email-ready)                           │
│ ○ Send via email (requires email integration)               │
│                                                               │
│ Tracking (Optional)                                           │
│ ☑ Notify me when link is opened                             │
│ ☑ Track time spent reading                                  │
│                                                               │
│                                    [Cancel] [Generate & Share]│
└─────────────────────────────────────────────────────────────┘
```

**Components**:
- `<ShareJobSpec>` - Main sharing interface
- `<FormatSelector>` - Output format options
- `<ContentOptions>` - Toggle visibility of sections
- `<BrandingSettings>` - Customize appearance
- `<DeliveryMethod>` - How to share (link, download, email)
- `<PreviewPane>` - Live preview of output

---

### 3.7 Approval Queue (Manager Dashboard)

```
┌─────────────────────────────────────────────────────────────────┐
│ Approval Queue                        [Filter▼] [Sort: Urgent▼] │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ 📊 8 Pending • 3 Urgent • 2 Overdue                              │
│                                                                   │
│ Batch Actions: [Select All] [Approve Selected] [Delegate]       │
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ 🔴 URGENT • Overdue by 2 days                                ││
│ │                                                               ││
│ │ □ Data Engineer - FinTech Startup                            ││
│ │   Submitted by: Sarah Chen • 3 days ago                      ││
│ │   Salary: £70k-£95k • Location: London • Type: Permanent     ││
│ │                                                               ││
│ │   Quality: 92% • ✓ All fields complete • ⚠ Salary above avg ││
│ │                                                               ││
│ │   "Client needs urgent response. Senior role, niche skills." ││
│ │                                                               ││
│ │   [Quick Approve] [Review in Detail] [Request Changes]       ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ 🟠 URGENT • Submitted 5 hours ago                            ││
│ │                                                               ││
│ │ □ Senior Product Manager - SaaS Company                      ││
│ │   Submitted by: John Smith • 5 hours ago                     ││
│ │   Salary: £65k-£80k • Location: Remote • Type: Permanent     ││
│ │                                                               ││
│ │   Quality: 88% • ✓ All fields complete • ✓ No issues        ││
│ │                                                               ││
│ │   "High-profile client. Already have candidates lined up."   ││
│ │                                                               ││
│ │   [Quick Approve] [Review in Detail] [Request Changes]       ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ 🟢 Normal • Submitted 1 day ago                              ││
│ │                                                               ││
│ │ □ Marketing Coordinator - Retail Brand                       ││
│ │   Submitted by: Emma Wilson • 1 day ago                      ││
│ │   Salary: £28k-£32k • Location: Birmingham • Type: FT        ││
│ │                                                               ││
│ │   Quality: 85% • ⚠ 2 optional fields missing                ││
│ │                                                               ││
│ │   "Standard role, existing client relationship."             ││
│ │                                                               ││
│ │   [Quick Approve] [Review in Detail] [Request Changes]       ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│                                                 [Load More (5)]  │
└─────────────────────────────────────────────────────────────────┘
```

**Quick Approve Confirmation Modal**:

```
┌─────────────────────────────────────────┐
│ Quick Approve                           │
├─────────────────────────────────────────┤
│                                         │
│ Approve: Senior Product Manager         │
│                                         │
│ This will:                              │
│ ✓ Approve the job specification        │
│ ✓ Push to CRM immediately              │
│ ✓ Notify consultant                    │
│                                         │
│ Optional: Add approval note             │
│ ┌─────────────────────────────────────┐│
│ │ [Great work, looks good!]           ││
│ └─────────────────────────────────────┘│
│                                         │
│         [Cancel] [Confirm Approval]     │
└─────────────────────────────────────────┘
```

**Components**:
- `<ApprovalQueue>` - Queue list container
- `<ApprovalQueueItem>` - Individual request card
- `<UrgencyBadge>` - Visual urgency indicator
- `<QuickActions>` - Rapid approve/reject
- `<BatchSelector>` - Multi-select checkboxes
- `<FilterSidebar>` - Filter by urgency, consultant, date

---

## 4. Key UI Components Library

### 4.1 JobStatusBadge

Visual indicator of job spec status

```tsx
<JobStatusBadge status="draft" />        // Gray pill
<JobStatusBadge status="pending" />      // Amber pill
<JobStatusBadge status="approved" />     // Green pill
<JobStatusBadge status="in_crm" />       // Blue pill
<JobStatusBadge status="rejected" />     // Red pill
```

### 4.2 ValidationIndicator

Shows field validation status

```tsx
<ValidationIndicator
  status="valid"           // Green checkmark
  message="Field complete"
/>

<ValidationIndicator
  status="warning"         // Amber warning icon
  message="Optional field has suggestion"
/>

<ValidationIndicator
  status="error"           // Red X icon
  message="Required field missing"
/>
```

### 4.3 AIsuggestionChip

Inline AI suggestions with confidence

```tsx
<AISuggestionChip
  suggestion="Senior"
  confidence={95}
  source="Detected from job title"
  onAccept={() => {}}
  onReject={() => {}}
/>
```

Renders as:
```
┌─────────────────────────────────────────┐
│ 💡 AI suggests: "Senior" (95%)          │
│    Detected from job title              │
│    [Accept] [Reject]                    │
└─────────────────────────────────────────┘
```

### 4.4 QualityScoreCard

Shows quality metrics

```tsx
<QualityScoreCard
  clarity={87}
  bias="none"
  completeness={100}
  readability={92}
/>
```

Renders as:
```
┌─────────────────────┐
│ QUALITY SCORE       │
│                     │
│ Clarity: 87%    ✓   │
│ Bias: None      ✓   │
│ Complete: 100%  ✓   │
│ Readable: 92%   ✓   │
│                     │
│ Overall: Excellent  │
└─────────────────────┘
```

### 4.5 FieldAutoComplete

Smart autocomplete with CRM lookup

```tsx
<FieldAutoComplete
  label="Industry"
  crmField="industry"
  aiSuggestions={["Technology", "FinTech"]}
  onSelect={(value) => {}}
/>
```

Features:
- Dropdown shows CRM valid values
- AI suggestions highlighted
- Recent selections shown first
- Fuzzy search

### 4.6 RichTextEditor

Job description editor with AI

```tsx
<RichTextEditor
  content={jobDescription}
  onChange={(content) => {}}
  aiAssist={true}
  onAICommand={(command) => {}}
/>
```

Features:
- Markdown support
- Section templates
- AI inline suggestions
- Grammar/spell check
- Formatting toolbar

### 4.7 VersionComparer

Side-by-side version comparison

```tsx
<VersionComparer
  versions={[
    { id: 'v1', name: 'Original', content: '...' },
    { id: 'v2', name: 'Senior version', content: '...' },
  ]}
  onSelect={(versionId) => {}}
/>
```

Features:
- Diff highlighting
- Merge selected parts
- Revert to version
- Name/tag versions

---

## 5. Interaction Patterns

### 5.1 AI Generation Flow

**Pattern**: Progressive disclosure with transparency

1. User clicks "Generate JD with AI ✨"
2. Loading state shows:
   ```
   ┌──────────────────────────────┐
   │ ✨ AI is generating...       │
   │ ▓▓▓▓▓▓░░░░░░░░░░ 40%         │
   │ Analyzing job requirements    │
   └──────────────────────────────┘
   ```
3. Result appears with:
   - Highlighted sections (color-coded by confidence)
   - "View what changed" button
   - "Regenerate" option
   - "Edit manually" option

### 5.2 Real-time CRM Validation

**Pattern**: Continuous, non-intrusive feedback

- As user types, debounced validation runs
- Status indicator updates in real-time
- Errors shown inline, not blocking
- Suggestions appear as tooltips/popovers
- Never interrupt user flow

### 5.3 Keyboard Shortcuts

**Power User Optimization**:

```
Ctrl/Cmd + S       - Save draft
Ctrl/Cmd + Enter   - Send for approval / Push to CRM
Ctrl/Cmd + K       - AI command palette
Ctrl/Cmd + /       - Search/filter
Ctrl/Cmd + D       - Duplicate current job
Ctrl/Cmd + Shift+V - View version history
Escape             - Close modal/panel
Tab                - Next field
Shift + Tab        - Previous field
```

### 5.4 Drag & Drop

**Use Cases**:
- Reorder job description sections
- Drag fields to reorder in CRM mapping
- Drag to upload documents (for import)

### 5.5 Undo/Redo

**Implementation**:
- Ctrl/Cmd + Z for undo
- Ctrl/Cmd + Shift + Z for redo
- History stack for all edits
- "Restore previous version" in toolbar

---

## 6. Responsive Design Breakpoints

### Desktop (1440px+)
- Three-panel layout (AI Assistant | Composer | CRM Fields)
- Full feature set visible
- Side-by-side comparisons

### Laptop (1024px - 1439px)
- Collapsible side panels
- Default: Composer + CRM Fields visible
- AI Assistant accessible via slide-out

### Tablet (768px - 1023px)
- Single panel focus mode
- Bottom sheet for secondary panels
- Tab-based navigation for sections

### Mobile (< 768px)
- Optimized for viewing/quick edits only
- Full creation experience desktop-only
- Focus on approval workflow for managers
- View-only mode for job specs

---

## 7. Accessibility (A11y) Considerations

### Keyboard Navigation
- All actions accessible via keyboard
- Logical tab order
- Focus indicators clear
- Skip navigation links

### Screen Readers
- ARIA labels on all interactive elements
- Status announcements for AI generation
- Field validation messages announced
- Descriptive alt text for icons

### Visual Accessibility
- WCAG AA contrast ratios minimum
- Color not sole indicator (icons + text)
- Resizable text up to 200%
- Clear focus states

### Cognitive Accessibility
- Clear, simple language
- Progress indicators for multi-step processes
- Confirmation dialogs for destructive actions
- Persistent navigation

---

## 8. Loading States & Skeletons

### AI Generation Loading

```
┌────────────────────────────────────┐
│ Job Description                    │
│                                    │
│ ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░   │
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░   │
│ ▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░   │
│                                    │
│ ✨ AI is crafting your JD...       │
└────────────────────────────────────┘
```

### CRM Field Loading

```
┌────────────────────────────────────┐
│ CRM Fields                         │
│                                    │
│ ▓▓▓▓▓▓▓▓  ✓                       │
│ ▓▓▓▓▓▓▓▓  ✓                       │
│ ▓▓▓▓▓▓▓▓  ⚠                       │
│                                    │
│ Syncing with CRM...                │
└────────────────────────────────────┘
```

### List Loading (Drafts/Approvals)

```
┌────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │
│ ▓▓▓▓▓▓▓▓  ▓▓▓▓  ▓▓▓▓               │
│                                    │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │
│ ▓▓▓▓▓▓▓▓  ▓▓▓▓  ▓▓▓▓               │
└────────────────────────────────────┘
```

---

## 9. Error States & Empty States

### Empty Drafts

```
┌─────────────────────────────────────┐
│                                     │
│         📝                          │
│                                     │
│    No drafts yet                    │
│                                     │
│    Start creating job specs to      │
│    see them here                    │
│                                     │
│    [Create Your First Job]          │
│                                     │
└─────────────────────────────────────┘
```

### Empty Approval Queue

```
┌─────────────────────────────────────┐
│                                     │
│         ✅                          │
│                                     │
│    All caught up!                   │
│                                     │
│    No pending approvals             │
│                                     │
└─────────────────────────────────────┘
```

### CRM Connection Error

```
┌─────────────────────────────────────┐
│         ⚠️                          │
│                                     │
│    CRM Connection Error             │
│                                     │
│    Unable to connect to your CRM    │
│    Please check your settings       │
│                                     │
│    [Retry] [Check Settings]         │
│                                     │
└─────────────────────────────────────┘
```

### AI Generation Failed

```
┌─────────────────────────────────────┐
│         🤖                          │
│                                     │
│    AI Generation Failed             │
│                                     │
│    Something went wrong. You can    │
│    try again or write manually.     │
│                                     │
│    [Retry] [Write Manually]         │
│                                     │
└─────────────────────────────────────┘
```

---

## 10. Notifications & Toasts

### Success Toast

```
┌──────────────────────────────┐
│ ✓ Job pushed to CRM          │
│   View in CRM →              │
└──────────────────────────────┘
```

### Error Toast

```
┌──────────────────────────────┐
│ ✗ Failed to save draft       │
│   Retry  Details             │
└──────────────────────────────┘
```

### Info Toast

```
┌──────────────────────────────┐
│ ℹ Draft auto-saved            │
└──────────────────────────────┘
```

### Progress Toast

```
┌──────────────────────────────┐
│ ⟳ Pushing to CRM...          │
│ ▓▓▓▓▓▓░░░░ 60%               │
└──────────────────────────────┘
```

---

## 11. Animation & Micro-interactions

### AI Generation Animation
- Typing effect for generated text
- Fade-in for new sections
- Pulse effect on AI icon during processing

### Field Validation Animation
- Checkmark bounces in when valid
- Warning icon shakes on error
- Progress bars smooth transitions

### Panel Transitions
- Slide-in/out for side panels
- Fade for overlays
- Smooth expand/collapse

### Button Feedback
- Slight scale on hover
- Ripple effect on click
- Loading spinner for async actions

---

## 12. Design Tokens

### Colors

```scss
// Status colors
$color-success: #10b981;
$color-warning: #f59e0b;
$color-error: #ef4444;
$color-info: #3b82f6;
$color-ai: #8b5cf6;

// UI colors
$color-primary: #2563eb;
$color-secondary: #64748b;
$color-background: #ffffff;
$color-surface: #f8fafc;
$color-border: #e2e8f0;

// Text colors
$color-text-primary: #0f172a;
$color-text-secondary: #475569;
$color-text-tertiary: #94a3b8;
```

### Typography

```scss
$font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-family-mono: 'Fira Code', 'Monaco', monospace;

$font-size-xs: 0.75rem;    // 12px
$font-size-sm: 0.875rem;   // 14px
$font-size-base: 1rem;     // 16px
$font-size-lg: 1.125rem;   // 18px
$font-size-xl: 1.25rem;    // 20px
$font-size-2xl: 1.5rem;    // 24px
```

### Spacing

```scss
$spacing-xs: 0.25rem;   // 4px
$spacing-sm: 0.5rem;    // 8px
$spacing-md: 1rem;      // 16px
$spacing-lg: 1.5rem;    // 24px
$spacing-xl: 2rem;      // 32px
$spacing-2xl: 3rem;     // 48px
```

### Shadows

```scss
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### Border Radius

```scss
$radius-sm: 0.25rem;  // 4px
$radius-md: 0.5rem;   // 8px
$radius-lg: 0.75rem;  // 12px
$radius-xl: 1rem;     // 16px
$radius-full: 9999px; // Fully rounded
```

---

This completes the comprehensive UI/UX design specification for JobForge!
