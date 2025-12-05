# JobForge - User Workflows & User Journeys

## 1. Core User Workflows

### 1.1 Consultant: Create New Job Spec

**Trigger**: Consultant clicks "Create New Job" in JobForge

**Steps**:
1. **Entry Point Selection**
   - Start from scratch
   - Import from email/document
   - Use template
   - Clone existing job

2. **Initial Information Gathering**
   - Quick form: Job title, industry, location, salary range
   - AI analyzes input and suggests CRM field values
   - Shows confidence score for suggestions

3. **AI-Assisted Description Writing**
   - Consultant enters rough notes/bullet points
   - AI generates structured JD in real-time
   - Side-by-side view: notes → polished output

4. **CRM Field Mapping**
   - System auto-populates CRM fields from JD content
   - Highlights required fields (red/amber/green status)
   - Shows validation warnings
   - Consultant reviews and adjusts

5. **Refinement & Experimentation**
   - Use AI tools to adjust tone/seniority
   - Preview different versions
   - Save drafts automatically

6. **Completion Actions**
   - Save as draft
   - Send for approval
   - Push directly to CRM
   - Export/share with client

**Success Criteria**: Job spec created with all required CRM fields populated, ready for approval or publishing

---

### 1.2 Consultant: Experiment with Job Spec

**Trigger**: Consultant wants to refine an existing draft

**Steps**:
1. **Open Draft**
   - View saved drafts list
   - Select draft to edit

2. **AI Experimentation Panel**
   - "Make more senior/junior" toggle
   - "Adjust tone" slider (formal ↔ casual)
   - "Expand/condense" sections
   - "Localize for region" dropdown

3. **Version Comparison**
   - Create variant without losing original
   - Side-by-side comparison view
   - Merge elements from different versions

4. **Real-time CRM Validation**
   - As changes are made, CRM field suggestions update
   - Validation status updates live
   - Missing fields highlighted

5. **Save Variant**
   - Name the version
   - Tag for later reference
   - Set as primary version

**Success Criteria**: Multiple refined versions created, consultant can choose best fit

---

### 1.3 Consultant: Submit for Approval

**Trigger**: Consultant clicks "Send for Approval"

**Steps**:
1. **Pre-submission Validation**
   - System checks all required CRM fields
   - Runs quality checks (bias detection, clarity score)
   - Shows validation report

2. **Fix Issues** (if any)
   - Guided fixes for missing/invalid fields
   - AI suggestions for improvements
   - Override option for intentional choices

3. **Select Approver**
   - Choose manager from list
   - Add approval notes/context
   - Set urgency level

4. **Review Summary**
   - Preview approval request as manager will see it
   - Includes: JD, CRM fields, quality scores, notes

5. **Submit**
   - Confirmation message
   - Notification sent to manager
   - Draft locked for editing (optional setting)

6. **Track Status**
   - Real-time status updates
   - Notifications when reviewed
   - Comment/feedback thread

**Success Criteria**: Approval request sent successfully, consultant notified of status changes

---

### 1.4 Manager: Review and Approve Job Spec

**Trigger**: Manager receives approval notification

**Steps**:
1. **Approval Queue**
   - View pending approvals list
   - Priority/urgency indicators
   - Quick stats (consultant, client, role level)

2. **Review Job Spec**
   - Full JD preview
   - CRM field review panel
   - Quality metrics dashboard
   - Consultant notes

3. **Comparison Tools**
   - Compare against similar roles
   - Check salary benchmarks
   - Review historical versions (if updated)

4. **Decision Actions**
   - **Approve**: Job pushed to CRM or back to consultant for final push
   - **Request Changes**: Add specific feedback comments
   - **Reject**: Provide reasoning

5. **Feedback Loop**
   - Leave comments on specific sections
   - Suggest edits
   - Request consultant call if needed

6. **Approve with Edits** (optional)
   - Manager makes minor adjustments
   - Pushes directly to CRM
   - Consultant notified of changes

**Success Criteria**: Decision made, consultant notified, job spec progressed to next stage

---

### 1.5 Consultant: Push to CRM

**Trigger**: Consultant clicks "Push to CRM" (after approval or direct push)

**Steps**:
1. **Final Validation Check**
   - All required CRM fields present
   - Data format validation
   - Duplicate job check

2. **CRM Field Mapping Review**
   - View final field mappings
   - Last chance to adjust
   - Confirm critical fields (salary, location, etc.)

3. **Additional CRM Options**
   - Add tags/categories
   - Assign owner
   - Set visibility/permissions
   - Add to campaigns/lists

4. **Push Execution**
   - Progress indicator
   - Real-time sync status
   - Error handling (retry, manual fix)

5. **Confirmation**
   - Success message with CRM link
   - Job ID displayed
   - Option to view in CRM
   - Create another job

6. **Post-Push Actions**
   - Archive draft in JobForge
   - Link to CRM entry
   - Generate activity report

**Success Criteria**: Job successfully created in CRM with all fields populated correctly

---

### 1.6 Consultant: Share with Client

**Trigger**: Consultant clicks "Share with Client"

**Steps**:
1. **Format Selection**
   - Branded PDF
   - Unbranded version
   - Email body text
   - Markdown/plain text
   - Custom template

2. **Content Customization**
   - Toggle salary visibility
   - Include/exclude internal notes
   - Add company branding
   - Custom intro/outro text

3. **Preview**
   - See exactly what client will receive
   - Different format previews

4. **Delivery Method**
   - Generate shareable link
   - Download PDF
   - Copy to clipboard (email-ready)
   - Direct email integration

5. **Tracking** (optional)
   - Link opened notification
   - Time spent reading
   - Download tracking

**Success Criteria**: Client-ready job description generated and delivered

---

## 2. Administrative Workflows

### 2.1 Administrator: Configure CRM Integration

**Steps**:
1. Connect CRM (API credentials)
2. Import CRM schema (entities, fields, validation rules)
3. Map JobForge components to CRM fields
4. Configure field defaults and rules
5. Set up validation thresholds
6. Test connection and field mapping

### 2.2 Administrator: Manage Templates

**Steps**:
1. Create job description templates by industry/role type
2. Define template variables and placeholders
3. Set template permissions (who can use)
4. Version control for templates
5. Analyze template performance

---

## 3. User Journey Maps

### Journey 1: First-Time User (Consultant)

**Context**: New consultant creates their first job spec

1. **Onboarding**: Quick tutorial highlighting key features
2. **Template Selection**: Choose from example templates
3. **Guided Creation**: Step-by-step wizard mode
4. **AI Introduction**: First AI suggestion with explanation
5. **CRM Field Discovery**: Understanding required fields
6. **Draft Save**: Auto-save explanation
7. **Approval Process**: Understanding workflow
8. **Success**: First job created

**Pain Points to Address**:
- Overwhelm from too many options
- Uncertainty about CRM requirements
- Not understanding AI capabilities

**UX Solutions**:
- Progressive disclosure of features
- Wizard mode for first job
- Tooltips and contextual help
- CRM field explanations

---

### Journey 2: Experienced Consultant (Speed User)

**Context**: Experienced user creating 5th job this week

1. **Quick Create**: Skip wizard, straight to composer
2. **Template Clone**: Start from similar previous job
3. **Rapid Editing**: Keyboard shortcuts, bulk operations
4. **AI Shortcuts**: Quick commands for common adjustments
5. **Fast Validation**: Glance at validation status
6. **One-Click Push**: Direct to CRM (skip approval if permitted)

**Pain Points to Address**:
- Too many clicks
- Slow AI processing
- Repetitive field entry

**UX Solutions**:
- Keyboard shortcuts everywhere
- Bulk templates and cloning
- Smart defaults from history
- Background AI processing
- Saved field presets

---

### Journey 3: Manager Reviewing Multiple Jobs

**Context**: Manager has 8 jobs to review Monday morning

1. **Queue Overview**: See all pending at a glance
2. **Priority Sort**: Urgent jobs first
3. **Batch Review**: Quick approve/reject interface
4. **Deep Dive**: Detailed review for complex roles
5. **Batch Actions**: Approve multiple similar jobs
6. **Delegate Review**: Assign to another manager if needed

**Pain Points to Address**:
- Time-consuming individual reviews
- Context switching between jobs
- Repetitive approvals

**UX Solutions**:
- Batch operations
- Quick approve with trust scores
- Summary cards for rapid scanning
- Comparison view for similar jobs
- Delegation workflows

---

## 4. Edge Cases & Error Handling

### 4.1 CRM Connection Lost During Push
- Auto-save draft state
- Retry mechanism with exponential backoff
- Queue for later push
- Clear error messaging
- Option to export data

### 4.2 Required CRM Field Cannot Be Auto-Populated
- Highlight missing field with clear label
- Provide examples/suggestions
- Show field validation rules
- Option to save draft and research
- Escalate to admin if field mapping issue

### 4.3 Manager Approval Delayed
- Reminder system for manager
- Escalation after X days
- Alternative approver option
- Urgent override for consultants (with logging)

### 4.4 Duplicate Job Detection
- Warn before creating duplicate
- Show similar existing jobs
- Option to update existing instead
- Clone/version rather than duplicate

### 4.5 AI Generated Inappropriate Content
- Content moderation layer
- Bias detection warnings
- Manual review flag
- Regenerate option
- Human override always available

---

## 5. Integration Points

### 5.1 CRM Integration Touchpoints
- Schema fetch (on load)
- Field validation (real-time)
- Job creation (on push)
- Lookup data (dropdowns, tags)
- Duplicate check (before push)
- Activity logging (all actions)

### 5.2 AI Integration Touchpoints
- Job description generation (on demand)
- Field auto-population (continuous)
- Content refinement (on command)
- Quality scoring (background)
- Bias detection (background)
- Suggestion engine (continuous)

### 5.3 Email Integration
- Import job from email
- Send approval requests
- Share with clients
- Notifications

### 5.4 Document Integration
- Import from Word/PDF
- Export to multiple formats
- Template management

---

## 6. Notification & Communication Flow

### Events That Trigger Notifications

**For Consultants**:
- Approval granted
- Approval rejected with feedback
- Manager commented on spec
- CRM push successful
- CRM push failed
- Draft auto-saved
- Colleague mentioned you

**For Managers**:
- New approval request
- Approval request urgent
- Approval overdue reminder
- Consultant responded to feedback

**For Administrators**:
- CRM connection error
- High AI usage alert
- New user onboarded
- Template performance report (weekly)

### Notification Channels
- In-app (primary)
- Email (configurable)
- Slack/Teams integration (optional)
- Mobile push (future)

---

## 7. Success Metrics & Analytics

### Consultant Metrics
- Time to create job spec
- AI suggestion acceptance rate
- CRM validation error rate
- Approval success rate (first time)
- Jobs created per week

### Manager Metrics
- Average approval time
- Approval vs rejection rate
- Common rejection reasons
- Review queue depth

### System Metrics
- AI generation success rate
- CRM field mapping accuracy
- Duplicate detection accuracy
- User satisfaction score
- Feature adoption rates

### Business Metrics
- Jobs published per consultant
- Time saved vs manual entry
- CRM data quality improvement
- Client satisfaction with JDs
