# **Route Specification: Admin Moderation Appeals**

## **1. Route Path**

**`/admin/moderation/appeals`**

## **2. Description**

Appeals queue for reviewing user appeals against moderation decisions, with options to uphold or overturn previous actions.

* Pending appeals list
* Original action context
* Decision options
* Appeal history

## **3. Source File**

```
src/app/(protected)/admin/moderation/appeals/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying pending appeals
* Showing original action context
* Enabling appeal decisions
* Viewing appeal history

### **This route does not:**

* Handle initial moderation (see /moderation)
* Configure rules
* Show general analytics

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only (senior moderators)
* **Permission Rules:** Regular moderators may not access

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `status` | `string` | No | Filter by appeal status |

* **Default behaviour:** Show pending appeals
* **Validation:** Invalid params use defaults

## **7. Layout & Structure**

### **Layout Overview**

* Full AppealsQueue component rendering
* Appeals list, details, decisions

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Appeals List | Pending appeals |
| Appeal Details | Original action, user message |
| Decision Panel | Uphold/overturn options |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `AppealsQueue` | `@/components/cms/moderation/AppealsQueue` | Appeals management interface |

### **UI / Feature Components**

*All handled within AppealsQueue component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Fetch pending appeals
3. Display appeals with context
4. User reviews appeal
5. User decides → persist → notify user

## **10. Data Fetching**

*Handled within AppealsQueue component. Typically includes:*
- Pending appeals
- Appeal history
- Original moderation actions

## **11. State Management**

### **Local State**

*Handled within AppealsQueue component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Appeals loading skeleton |
| Data loaded | Appeals list with details |
| Empty | "No pending appeals" message |
| Appeal selected | Details panel shown |
| Decision made | Appeal removed from queue |

## **13. User Actions**

### **UI Interactions**

*Handled by AppealsQueue component:*
- Review appeal details
- View original content
- View moderation history
- Uphold decision
- Overturn decision
- Respond to user
- Escalate to admin

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Back to moderation | Click back | `/admin/moderation` |
| View analytics | Click link | `/admin/moderation/analytics` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Uphold | Uphold button | Uphold API | Notify user, remove |
| Overturn | Overturn button | Overturn API | Restore, notify |
| Respond | Send button | Respond API | Add to history |

## **14. Infinite Scroll / Pagination**

* **Type:** Traditional pagination
* **Page size:** 20 appeals per page
* **Controls:** Previous/next

## **15. Error & Empty States**

* **Loading:** Appeals skeleton
* **Error:** "Failed to load appeals"
* **Empty:** "No pending appeals"

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within AppealsQueue
* **Parallel vs sequential fetching:** Appeals and history separate
* **Known constraints:**
  * Original content may be deleted
  * User notifications are async

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through appeals
* **Focus management:** Focus on first appeal
* **Screen reader expectations:** Appeal status announced
* **Landmark roles:** Main appeals area

## **18. Storybook & Testing Strategy**

### **Storybook**

* AppealsQueue with various states
* Decision flow
* Empty state

### **Testing**

* **Unit test focus:** Decision handlers
* **Integration test focus:** Appeal decision flow
* **E2E test focus:** Complete appeal review

## **19. Non-Goals / Out of Scope**

* Initial moderation
* Rule configuration
* Analytics

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/moderation` | Moderation queue |
| `/admin/moderation/analytics` | Moderation analytics |

## **21. Open Questions / Notes**

* Consider adding appeal templates
* May need escalation workflow
* Consider adding appeal time limits

### **Appeals Queue Features**

The AppealsQueue component typically provides:
- List of pending appeals
- Original action details
- User appeal message
- Content in question
- Decision options
- Appeal history
