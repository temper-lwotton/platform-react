# **Route Specification: Admin Broadcasts New**

## **1. Route Path**

**`/admin/broadcasts/new`**

## **2. Description**

Broadcast creation page with a campaign composer for creating email campaigns, push notifications, or in-app announcements.

* Campaign type selection
* Template selection/editing
* Audience targeting
* Scheduling options

## **3. Source File**

```
src/app/(protected)/admin/broadcasts/new/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Rendering campaign composer
* Supporting campaign creation
* Handling send/schedule actions

### **This route does not:**

* Edit existing broadcasts
* Manage audience segments
* Design email templates

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `string` | No | Pre-select campaign type |
| `template` | `string` | No | Pre-select template |

* **Default behaviour:** Show type selection
* **Validation:** Invalid type shows selection

## **7. Layout & Structure**

### **Layout Overview**

* Full CampaignComposer component rendering
* Type selection, editor, audience, schedule

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Type Selection | Email/push/in-app choice |
| Content Editor | Subject and body |
| Audience Panel | Targeting options |
| Schedule Panel | Timing options |
| Actions | Save/send buttons |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `CampaignComposer` | `@/components/cms/broadcasts/CampaignComposer` | Campaign creation interface |

### **UI / Feature Components**

*All handled within CampaignComposer component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Initialize empty campaign state
3. User selects campaign type
4. User writes content
5. User selects audience
6. User sets schedule or sends immediately
7. Campaign created → redirect to list

## **10. Data Fetching**

*Handled within CampaignComposer component. Typically includes:*
- Audience segments
- Email templates
- Previous campaigns for reference

## **11. State Management**

### **Local State**

*Handled within CampaignComposer component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Page loaded | Type selection shown |
| Type selected | Editor shown |
| Content written | Preview available |
| Audience selected | Recipient count shown |
| Sending | Send button loading |
| Sent | Redirect to list with success |

## **13. User Actions**

### **UI Interactions**

*Handled by CampaignComposer component:*
- Select campaign type
- Choose/edit template
- Write content
- Select audience
- Schedule or send immediately
- Preview
- Send test email
- Save as draft

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Cancel | Click cancel | `/admin/broadcasts` |
| View sent | After send | `/admin/broadcasts` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Save draft | Save button | Create draft API | Show saved |
| Schedule | Schedule button | Schedule API | Redirect |
| Send now | Send button | Send API | Redirect |
| Send test | Test button | Test send API | Show success |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Save error:** "Failed to save draft"
* **Send error:** "Failed to send broadcast"
* **No audience:** "Select at least one audience segment"

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within CampaignComposer
* **Parallel vs sequential fetching:** Segments and templates in parallel
* **Known constraints:**
  * Large audience may take time to process
  * Test sends limited per day

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through composer fields
* **Focus management:** Focus on first field
* **Screen reader expectations:** Fields and actions announced
* **Landmark roles:** Form with proper structure

## **18. Storybook & Testing Strategy**

### **Storybook**

* CampaignComposer for each type
* Template selection
* Audience picker

### **Testing**

* **Unit test focus:** Form validation
* **Integration test focus:** Send and schedule flows
* **E2E test focus:** Complete campaign creation

## **19. Non-Goals / Out of Scope**

* Editing existing campaigns
* Segment management
* Template design

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/broadcasts` | Broadcasts dashboard |
| `/admin/members/segments` | Audience segments |

## **21. Open Questions / Notes**

* Consider adding A/B testing
* May need personalization tokens
* Consider adding send time optimization

### **Campaign Composer Features**

The CampaignComposer component typically provides:
- Campaign type selection (email, push, in-app)
- Template selection/editor
- Subject line editor
- Content editor
- Audience targeting
- Scheduling options
- Preview functionality
- Send test option
