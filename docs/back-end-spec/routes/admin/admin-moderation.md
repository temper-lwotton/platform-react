# **Route Specification: Admin Moderation**

## **1. Route Path**

**`/admin/moderation`**

## **2. Description**

Content moderation queue showing flagged content, reported items, and pending moderation actions for review.

* Flagged content queue
* Report details
* Quick actions
* Moderation history

## **3. Source File**

```
src/app/(protected)/admin/moderation/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying moderation queue
* Showing report details
* Enabling quick actions
* Viewing moderation history

### **This route does not:**

* Configure moderation rules (see /rules)
* Handle appeals (see /appeals)
* Show analytics (see /analytics)

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin/Moderator users only
* **Permission Rules:** Non-moderators denied access

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `string` | No | Filter by content type |
| `severity` | `string` | No | Filter by severity |

* **Default behaviour:** Show all pending items
* **Validation:** Invalid params use defaults

## **7. Layout & Structure**

### **Layout Overview**

* Full ModerationQueue component rendering
* Filters, queue list, actions

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Filters | Type/severity filters |
| Queue List | Flagged items |
| Item Details | Selected item info |
| Actions | Moderation buttons |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `ModerationQueue` | `@/components/cms/moderation/ModerationQueue` | Moderation queue interface |

### **UI / Feature Components**

*All handled within ModerationQueue component*

## **9. Data Flow Overview**

1. Verify moderator authentication
2. Fetch flagged content
3. Display queue with details
4. User selects item → show details
5. User takes action → persist → remove from queue

## **10. Data Fetching**

*Handled within ModerationQueue component. Typically includes:*
- Flagged content items
- Reported users
- Pending moderation actions

## **11. State Management**

### **Local State**

*Handled within ModerationQueue component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Queue loading skeleton |
| Data loaded | Queue with items |
| Empty | "No pending items" message |
| Item selected | Details panel shown |
| Action taken | Item removed from queue |

## **13. User Actions**

### **UI Interactions**

*Handled by ModerationQueue component:*
- Review flagged content
- Approve or reject content
- Take action on reports
- Warn users
- Suspend accounts
- View moderation history

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| View appeals | Click appeals | `/admin/moderation/appeals` |
| Manage rules | Click rules | `/admin/moderation/rules` |
| View analytics | Click analytics | `/admin/moderation/analytics` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Approve | Approve button | Approve API | Remove from queue |
| Reject | Reject button | Reject API | Remove from queue |
| Warn user | Warn button | Warn API | Log action |
| Suspend | Suspend button | Suspend API | Update status |

## **14. Infinite Scroll / Pagination**

* **Type:** Traditional pagination
* **Page size:** 25 items per page
* **Controls:** Previous/next with page indicator

## **15. Error & Empty States**

* **Loading:** Queue skeleton
* **Error:** "Failed to load moderation queue"
* **Empty:** "No pending items. Great job!"

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within ModerationQueue
* **Parallel vs sequential fetching:** Queue and details separate
* **Known constraints:**
  * Large queues paginated
  * Media content may load slowly

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through queue items
* **Focus management:** Focus on first item
* **Screen reader expectations:** Item type and severity announced
* **Landmark roles:** Main queue area

## **18. Storybook & Testing Strategy**

### **Storybook**

* ModerationQueue with various states
* Different item types
* Action buttons

### **Testing**

* **Unit test focus:** Action handlers
* **Integration test focus:** Moderation flow
* **E2E test focus:** Complete moderation journey

## **19. Non-Goals / Out of Scope**

* Rule configuration
* Appeals handling
* Analytics

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/moderation/appeals` | Appeal management |
| `/admin/moderation/rules` | Moderation rules |
| `/admin/moderation/analytics` | Moderation analytics |

## **21. Open Questions / Notes**

* Consider adding bulk moderation
* May need AI-assisted review
* Consider adding moderator assignment

### **Moderation Queue Features**

The ModerationQueue component typically provides:
- Queue of flagged items
- Report details
- Quick action buttons
- Bulk moderation
- Filter by type/severity
- Moderation history
