# JobForge - Visual Summary & Key Screens

This document provides a visual overview of the main JobForge interfaces.

---

## Full Application Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Logo    JobForge                            🔍 Search   🔔 Notifications  👤 │
├──────────────┬───────────────────────────────────────────────────────────────┤
│              │                                                                │
│ Home Sidebar │                 Main Content Area                             │
│              │                                                                │
│ 🏠 Dashboard │  ┌──────────────────────────────────────────────────────────┐ │
│ 📅 Calendar  │  │                                                          │ │
│ 💡 Suggestions│  │                                                          │ │
│              │  │                                                          │ │
│ ✨ JobForge  │  │           Page Content Appears Here                      │ │
│   📊 Overview│  │                                                          │ │
│   ➕ Create  │  │      (Dashboard, Composer, Approvals, etc.)              │ │
│   📝 Drafts  │  │                                                          │ │
│   ⏳ Awaiting│  │                                                          │ │
│   ✅ Approved│  │                                                          │ │
│   📋 Template│  │                                                          │ │
│              │  └──────────────────────────────────────────────────────────┘ │
│              │                                                                │
└──────────────┴───────────────────────────────────────────────────────────────┘
```

---

## Screen 1: JobForge Dashboard

```
┌────────────────────────────────────────────────────────────────────────┐
│ JobForge                                  [+ Create New Job] [Settings] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ Quick Stats                                                             │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│ │ Jobs Created │  │ My Drafts    │  │ Awaiting     │  │ This Week   │ │
│ │              │  │              │  │ Approval     │  │             │ │
│ │     24       │  │      3       │  │      2       │  │      8      │ │
│ │  +12% ↑      │  │              │  │              │  │  +33% ↑     │ │
│ └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘ │
│                                                                         │
│ Recent Activity                                         View All →     │
│ ┌───────────────────────────────────────────────────────────────────┐ │
│ │ ✓ Senior Software Engineer - Tech Corp                           │ │
│ │   Pushed to CRM • 2 hours ago                                    │ │
│ │                                                                   │ │
│ │ ⏳ Marketing Manager - Retail Ltd                                │ │
│ │   Awaiting approval from Sarah • 5 hours ago                     │ │
│ │                                                                   │ │
│ │ 📝 Junior Designer - Creative Agency                             │ │
│ │   Draft saved • 1 day ago                                        │ │
│ └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ Pending Approvals (Manager View)                       View All →     │
│ ┌───────────────────────────────────────────────────────────────────┐ │
│ │ 🔴 URGENT • Data Engineer - FinTech Startup                       │ │
│ │    Submitted by Sarah Chen • 3 hours ago                          │ │
│ │    [Quick Review] [Approve]                                       │ │
│ └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ Quick Actions                                                           │
│ ┌──────────────────┐ ┌──────────────────┐ ┌─────────────────────────┐ │
│ │ Clone Last Job   │ │ Use Template     │ │ Import from Email       │ │
│ └──────────────────┘ └──────────────────┘ └─────────────────────────┘ │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

**Key Features**:
- Quick stats with trend indicators
- Recent activity timeline
- Pending approvals (manager view)
- One-click quick actions

---

## Screen 2: Job Composer (Main Creation Interface)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ JobForge > New Job                         Draft auto-saved 30s ago    [Exit] │
├─────────────┬────────────────────────────────────────┬────────────────────────┤
│             │                                        │                        │
│ AI TOOLS    │  JOB COMPOSER                         │  CRM FIELDS & ACTIONS  │
│             │                                        │                        │
│ Start From: │  Job Title *                           │  Status                │
│ ┌─────────┐ │  [Senior Software Engineer_______]    │  ✓ Required (8/10)    │
│ │Scratch  │ │                                        │  ⚠ Optional (3/15)    │
│ │Template │ │  Industry: Technology ▼               │                        │
│ │Email    │ │  Location: Manchester (Hybrid)         │  Quick View:          │
│ │Clone    │ │                                        │  ┌──────────────────┐ │
│ └─────────┘ │  Salary: £60,000 - £80,000            │  │ Title         ✓ │ │
│             │  Currency: GBP ▼  Per: Year ▼         │  │ Industry      ✓ │ │
│ AI Actions: │                                        │  │ Location      ✓ │ │
│ ┌─────────┐ │  ──────────────────────────────────   │  │ Salary        ✓ │ │
│ │Expand   │ │                                        │  │ Seniority     ✓ │ │
│ │Shorten  │ │  [Tab: Your Notes] [Tab: Generated]   │  │ Experience    ✓ │ │
│ │Tone ↕   │ │                                        │  │ Type          ✓ │ │
│ │Senior↕  │ │  ┌──────────────────────────────────┐ │  │ Department    ⚠ │ │
│ │Localize │ │  │ YOUR NOTES:                      │ │  │ Certifications⚠ │ │
│ └─────────┘ │  │                                  │ │  └──────────────────┘ │
│             │  │ We need a senior developer who:  │ │                        │
│ Versions:   │  │ - Excellent React experience     │ │  [View All Fields]    │
│ ┌─────────┐ │  │ - Can lead a small team         │ │                        │
│ │v1       │ │  │ - AWS/cloud knowledge           │ │  Quality Score        │
│ │v2 (curr)│ │  │ - Manchester based (hybrid OK)  │ │  ┌──────────────────┐ │
│ │v3       │ │  │                                  │ │  │ Clarity:    87% │ │
│ └─────────┘ │  └──────────────────────────────────┘ │  │ Bias:      None │ │
│             │                                        │  │ Complete:   80% │ │
│ [Compare]   │  [✨ Generate with AI]                │  │ Overall: Good   │ │
│             │                                        │  └──────────────────┘ │
│             │  ──────────────────────────────────   │                        │
│             │                                        │  ACTIONS               │
│             │  GENERATED JD:                         │  ┌──────────────────┐ │
│             │                                        │  │ [Save Draft]     │ │
│             │  Overview                              │  │ [Send Approval]  │ │
│             │  We are seeking an experienced...     │  │ [Push to CRM]    │ │
│             │                                        │  │ [Share Client]   │ │
│             │  Responsibilities                      │  └──────────────────┘ │
│             │  • Lead development of React apps      │                        │
│             │  • Mentor junior developers            │                        │
│             │  • Design cloud architecture           │                        │
│             │                                        │                        │
└─────────────┴────────────────────────────────────────┴────────────────────────┘
```

**Three-Panel Layout**:
1. **Left**: AI Assistant & Version Management
2. **Center**: Job Description Editor
3. **Right**: CRM Fields, Validation & Actions

---

## Screen 3: CRM Field Mapping (Detailed View)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ CRM Field Mapping                                      [Auto-fill] [Save] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ Required Fields (8/10 Complete)                 ▓▓▓▓▓▓▓▓░░ 80%         │
│                                                                          │
│ Job Title *                                                          ✓  │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Senior Software Engineer                                           │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ 💡 AI detected from: Job description title (100% confidence)           │
│                                                                          │
│ Industry *                                                           ✓  │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Technology                                             ▼           │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ 💡 AI detected from: Job content (95% confidence)                      │
│                                                                          │
│ Salary Range *                                                       ✓  │
│ ┌─────────────────────┐       to      ┌─────────────────────────────┐ │
│ │ 60,000             │               │ 80,000                      │ │
│ └─────────────────────┘               └─────────────────────────────┘ │
│ Currency: GBP ▼          Per: Year ▼                                   │
│ 💡 AI extracted from: "£60,000 - £80,000" in description              │
│                                                                          │
│ Location *                                                           ✓  │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Manchester, UK                                                     │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ Work Type: Hybrid ▼                                                     │
│                                                                          │
│ Seniority Level *                                                    ⚠  │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ [Select seniority level...]                            ▼           │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ 💡 AI suggests: "Senior" (95% confidence)                 [Accept]     │
│                                                                          │
│ Experience Required *                                                ⚠  │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ [______] years                                                     │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ 💡 AI suggests: 5 years (from "5+ years React")           [Accept]     │
│                                                                          │
│ ────────────────────────────────────────────────────────────────────── │
│                                                                          │
│ Optional Fields (3/15 Complete)                          [Show All]     │
│                                                                          │
│ Department                                                              │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Engineering                                            ▼           │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│ ────────────────────────────────────────────────────────────────────── │
│                                                                          │
│ Validation Summary                                                       │
│ ✓ 8 of 10 required fields complete                                     │
│ ⚠ 2 required fields have AI suggestions ready to accept               │
│ ⚠ 12 optional fields empty (not required)                              │
│ ✓ No validation errors                                                 │
│                                                                          │
│                                            [Cancel] [Save & Continue]   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Features**:
- Visual progress bar
- AI suggestions with confidence scores
- One-click accept for suggestions
- Clear required vs optional grouping

---

## Screen 4: Manager Approval Review

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Review Job Specification                                    [Urgent 🔴] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ Senior Software Engineer - Tech Corp                                    │
│ Submitted by: John Smith • 3 hours ago                                  │
│ Notes: "Client needs urgent response. Senior role, niche skills."       │
│                                                                          │
│ ┌──────────────────────────────┬────────────────────────────────────┐  │
│ │ JOB DESCRIPTION              │ CRM FIELDS                         │  │
│ │                              │                                    │  │
│ │ [Tab: Overview]              │ Job Title: Senior Software Eng  ✓ │  │
│ │ [Tab: Responsibilities]      │ Industry: Technology            ✓ │  │
│ │ [Tab: Requirements]          │ Location: Manchester (Hybrid)   ✓ │  │
│ │                              │ Salary: £60k - £80k             ✓ │  │
│ │ Overview                     │ Seniority: Senior               ✓ │  │
│ │ ───────────────────────────  │ Experience: 5 years             ✓ │  │
│ │ We are seeking an            │ Type: Permanent                 ✓ │  │
│ │ experienced Senior Software  │ Department: Engineering         ✓ │  │
│ │ Engineer to join our         │                                    │  │
│ │ growing team...              │ [View All 23 Fields]               │  │
│ │                              │                                    │  │
│ │ Responsibilities             │ ──────────────────────────────    │  │
│ │ ───────────────────────────  │                                    │  │
│ │ • Lead development of        │ Quality Metrics                    │  │
│ │   React applications         │ ┌────────────────────────────┐   │  │
│ │ • Mentor junior devs         │ │ Clarity:      87%       ✓ │   │  │
│ │ • Architect cloud solutions  │ │ Bias:        None       ✓ │   │  │
│ │                              │ │ Completeness: 100%      ✓ │   │  │
│ │ Requirements                 │ │ Readability:   92%      ✓ │   │  │
│ │ ───────────────────────────  │ │                            │   │  │
│ │ • 5+ years React             │ │ Overall: Excellent         │   │  │
│ │ • Leadership experience      │ └────────────────────────────┘   │  │
│ │ • AWS/Azure knowledge        │                                    │  │
│ │                              │                                    │  │
│ │ [View Full Description]      │                                    │  │
│ └──────────────────────────────┴────────────────────────────────────┘  │
│                                                                          │
│ Insights & Recommendations                                              │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ ⚠ Salary is 5% below market average for this role                 │ │
│ │   Market range: £65k - £90k         [View Benchmark Data]         │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ ✓ Similar to 3 roles you previously approved                      │ │
│ │   "Senior Developer - FinTech Ltd" and 2 others                   │ │
│ │                                      [Compare with Similar]        │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│ Feedback & Comments                                                     │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ [Add comment or request changes...]                               │ │
│ │                                                                    │ │
│ │ 💡 Quick tags: [@Salary] [@Requirements] [@Responsibilities]      │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│ Decision                                                                 │
│ ┌─────────────────┐ ┌─────────────────┐ ┌──────────────────────────┐  │
│ │  ✓ Approve      │ │ ⚠ Request       │ │  ✗ Reject                │  │
│ │  & Push to CRM  │ │   Changes       │ │  (with explanation)      │  │
│ └─────────────────┘ └─────────────────┘ └──────────────────────────┘  │
│                                                                          │
│ Advanced Options                                                         │
│ ☐ Push to CRM immediately after approval                               │
│ ☐ Require re-review if consultant makes changes                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Features**:
- Side-by-side JD and CRM fields view
- AI-powered insights (salary benchmarks, similar roles)
- Inline commenting
- Clear decision actions
- Advanced options

---

## Screen 5: Approval Queue (Manager Dashboard)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Approval Queue                            [Filter ▼] [Sort: Urgent ▼]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ 📊 8 Pending • 3 Urgent • 2 Overdue                                     │
│                                                                          │
│ ☐ Select All    [Approve Selected (0)] [Delegate]                      │
│                                                                          │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 🔴 URGENT • Overdue by 2 days                                      │ │
│ │                                                                    │ │
│ │ ☐  Data Engineer - FinTech Startup                                │ │
│ │    Submitted by: Sarah Chen • 3 days ago                           │ │
│ │    Salary: £70k-£95k • Location: London • Type: Permanent          │ │
│ │                                                                    │ │
│ │    Quality: 92% • ✓ All fields complete • ⚠ Salary above avg     │ │
│ │                                                                    │ │
│ │    "Client needs urgent response. Senior role, niche skills."      │ │
│ │                                                                    │ │
│ │    [Quick Approve] [Review in Detail] [Request Changes]            │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 🟠 URGENT • Submitted 5 hours ago                                  │ │
│ │                                                                    │ │
│ │ ☐  Senior Product Manager - SaaS Company                          │ │
│ │    Submitted by: John Smith • 5 hours ago                          │ │
│ │    Salary: £65k-£80k • Location: Remote • Type: Permanent          │ │
│ │                                                                    │ │
│ │    Quality: 88% • ✓ All fields complete • ✓ No issues            │ │
│ │                                                                    │ │
│ │    "High-profile client. Already have candidates lined up."        │ │
│ │                                                                    │ │
│ │    [Quick Approve] [Review in Detail] [Request Changes]            │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 🟢 Normal • Submitted 1 day ago                                    │ │
│ │                                                                    │ │
│ │ ☐  Marketing Coordinator - Retail Brand                           │ │
│ │    Submitted by: Emma Wilson • 1 day ago                           │ │
│ │    Salary: £28k-£32k • Location: Birmingham • Type: Full-time      │ │
│ │                                                                    │ │
│ │    Quality: 85% • ⚠ 2 optional fields missing                     │ │
│ │                                                                    │ │
│ │    "Standard role, existing client relationship."                  │ │
│ │                                                                    │ │
│ │    [Quick Approve] [Review in Detail] [Request Changes]            │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│                                                     [Load More (5)]      │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Features**:
- Urgency indicators (red, orange, green)
- Batch selection and approval
- Quick approve vs detailed review
- At-a-glance quality metrics
- Submission notes visible

---

## Screen 6: Share with Client

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Share Job Specification                                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ Job: Senior Software Engineer - Tech Corp                               │
│                                                                          │
│ Format                                                                   │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ ● Branded PDF    ○ Unbranded PDF    ○ Email Text                  │ │
│ │ ○ Markdown       ○ Plain Text                                      │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│ Content Options                                                          │
│ ☑ Include salary range                                                  │
│ ☑ Include company description                                           │
│ ☐ Include internal reference number                                     │
│ ☐ Include consultant contact details                                    │
│ ☑ Include application instructions                                      │
│                                                                          │
│ Branding (for PDF formats)                                              │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Agency Logo: [Your Agency Name]                      [Change Logo] │ │
│ │ Template Style: Professional             ▼                         │ │
│ │ Color Scheme: Corporate Blue             ▼                         │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│ Custom Message (Optional)                                               │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Dear Hiring Manager,                                               │ │
│ │                                                                    │ │
│ │ Please find attached the job specification for the Senior         │ │
│ │ Software Engineer position...                                      │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│ Preview                                                                  │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │                                                                    │ │
│ │                     [YOUR AGENCY NAME]                             │ │
│ │                                                                    │ │
│ │              Senior Software Engineer                              │ │
│ │                   Tech Corp                                        │ │
│ │                  Manchester, UK                                    │ │
│ │                                                                    │ │
│ │  Overview                                                          │ │
│ │  We are seeking an experienced Senior Software Engineer...        │ │
│ │                                                                    │ │
│ │  [View Full Preview]                                               │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│ Delivery Method                                                          │
│ ○ Generate shareable link (expires in: 30 days ▼)                      │
│ ● Download PDF                                                          │
│ ○ Copy to clipboard (email-ready)                                       │
│ ○ Send via email (requires integration)                                 │
│                                                                          │
│ ☑ Enable tracking (notify when opened)                                 │
│                                                                          │
│                                       [Cancel] [Generate & Share]       │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Features**:
- Multiple export formats
- Content customization
- Branding options
- Live preview
- Tracking capabilities

---

## Mobile View Example: Create Job

```
┌─────────────────────────────┐
│ ☰  Create Job          [×]  │ ← Collapsed sidebar
├─────────────────────────────┤
│                             │
│ Job Title *                 │
│ ┌─────────────────────────┐ │
│ │ Senior Developer        │ │
│ └─────────────────────────┘ │
│                             │
│ Industry *                  │
│ ┌─────────────────────────┐ │
│ │ Technology          ▼   │ │
│ └─────────────────────────┘ │
│                             │
│ Location *                  │
│ ┌─────────────────────────┐ │
│ │ Manchester              │ │
│ └─────────────────────────┘ │
│ Work Type: Hybrid       ▼   │
│                             │
│ Salary Range *              │
│ ┌──────────┐  ┌───────────┐│
│ │ 60,000   │to│ 80,000    ││
│ └──────────┘  └───────────┘│
│ GBP ▼  Per Year ▼          │
│                             │
│ [Tabs: Notes | Generated]   │
│                             │
│ ┌─────────────────────────┐ │
│ │ Enter job notes...      │ │
│ │                         │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ [✨ Generate with AI]       │
│                             │
│ ─────────────────────────   │
│                             │
│ Status: 8/10 fields ⚠       │
│ Quality: 87% ✓              │
│                             │
│ [Save Draft]                │
│ [Send for Approval]         │
│                             │
└─────────────────────────────┘
```

**Mobile Optimizations**:
- Single-column layout
- Collapsible sidebar menu
- Tabs for different sections
- Simplified field layout
- Touch-friendly buttons

---

## Component Anatomy: AI Suggestion Chip

```
┌───────────────────────────────────────────────────────────┐
│ 💡 AI Suggestion                                         │
│                                                           │
│ Suggested value: "Senior"                                │
│ Confidence: 95%                                           │
│ Source: Detected from job title "Senior Developer"       │
│                                                           │
│ Reasoning: The job title contains the word "Senior",     │
│ which typically indicates a senior-level position.       │
│                                                           │
│                              [Accept] [Dismiss]           │
└───────────────────────────────────────────────────────────┘
```

---

## Component Anatomy: Quality Score Card

```
┌─────────────────────────────────┐
│      QUALITY SCORE              │
│                                 │
│         87/100                  │
│      ▓▓▓▓▓▓▓▓▓░   Excellent    │
│                                 │
│ Metrics:                        │
│ ─────────────────────────────   │
│                                 │
│ Clarity           87%  ✓        │
│ ▓▓▓▓▓▓▓▓▓░                      │
│                                 │
│ Bias             None  ✓        │
│ ▓▓▓▓▓▓▓▓▓▓                      │
│                                 │
│ Completeness     100%  ✓        │
│ ▓▓▓▓▓▓▓▓▓▓                      │
│                                 │
│ Readability       92%  ✓        │
│ ▓▓▓▓▓▓▓▓▓░                      │
│                                 │
│ Issues: 0                       │
│ [View Details]                  │
└─────────────────────────────────┘
```

---

## User Flow: Create → Approve → Push

```
┌──────────────┐
│  Consultant  │
│  Dashboard   │
└──────┬───────┘
       │
       │ Click "Create New"
       ▼
┌──────────────┐
│ Job Composer │
│ - Enter info │
│ - AI generate│
│ - Review     │
└──────┬───────┘
       │
       │ Click "Send for Approval"
       ▼
┌──────────────────┐
│ Approval Request │
│ - Choose manager │
│ - Add notes      │
│ - Submit         │
└──────┬───────────┘
       │
       │ Manager notified
       ▼
┌──────────────┐
│   Manager    │
│ Review Queue │
└──────┬───────┘
       │
       │ Click "Review in Detail"
       ▼
┌──────────────┐
│   Approval   │
│   Review     │
│ - Check JD   │
│ - Check CRM  │
│ - Review     │
│   insights   │
└──────┬───────┘
       │
       │ Click "Approve & Push to CRM"
       ▼
┌──────────────┐
│     CRM      │
│ Job Created! │
│ ✓ Success    │
└──────────────┘
```

---

This visual summary provides a comprehensive overview of the JobForge interface design!
