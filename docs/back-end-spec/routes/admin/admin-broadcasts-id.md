# **Route Specification: Admin Broadcast Edit**

## **1. Route Path**

**`/admin/broadcasts/[id]`**

## **2. Description**

Broadcast editing page for modifying existing campaigns, viewing statistics, or rescheduling broadcasts.

* Edit draft/scheduled campaigns
* View sent campaign statistics
* Reschedule or cancel
* Duplicate to new campaign

## **3. Source File**

```
src/app/(protected)/admin/broadcasts/[id]/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Loading existing broadcast data
* Displaying campaign editor or statistics
* Supporting reschedule/cancel actions
* Enabling campaign duplication

### **This route does not:**

* Create new broadcasts
* Manage audience segments
* Design templates

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | The unique identifier of the broadcast |

* **Default behaviour:** N/A - id is required
* **Validation:** Invalid id shows error

## **7. Layout & Structure**

### **Layout Overview**

* Full BroadcastEditor component rendering
* Content varies by campaign status (draft vs sent)

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Campaign title and status |
| Content Editor | Edit content (if editable) |
| Statistics | Send metrics (if sent) |
| Actions | Save/send/cancel buttons |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `BroadcastEditor` | `@/components/cms/broadcasts/BroadcastEditor` | Broadcast editing interface |

### **UI / Feature Components**

*All handled within BroadcastEditor component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Parse broadcast ID from URL
3. Fetch broadcast data
4. Display editor (draft/scheduled) or stats (sent)
5. User edits → save changes
6. User sends/reschedules → update → redirect

## **10. Data Fetching**

*Handled within BroadcastEditor component. Typically includes:*
- Existing broadcast data
- Campaign statistics (if sent)
- Audience information

## **11. State Management**

### **Local State**

*Handled within BroadcastEditor component*

### **Component Props**

```typescript
<BroadcastEditor broadcastId={id} />
```

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Editor loading skeleton |
| Draft loaded | Full editor enabled |
| Scheduled loaded | Editor with reschedule option |
| Sent loaded | Statistics view (read-only content) |
| Not found | Error message |
| Saving | Save button loading |

## **13. User Actions**

### **UI Interactions**

*Handled by BroadcastEditor component:*
- Edit content (if draft/scheduled)
- View statistics (if sent)
- Reschedule broadcast
- Cancel broadcast
- Duplicate to new campaign
- Delete broadcast

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Back to list | Click back | `/admin/broadcasts` |
| Duplicate | Click duplicate | `/admin/broadcasts/new` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Save changes | Save button | Update API | Show success |
| Reschedule | Reschedule button | Update API | Show new time |
| Cancel | Cancel button | Cancel API | Redirect to list |
| Delete | Delete button | Delete API | Redirect to list |
| Duplicate | Duplicate button | Duplicate API | Navigate to new |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Loading:** Editor skeleton
* **Not found:** "Broadcast not found"
* **Save error:** "Failed to save changes"
* **Delete error:** "Failed to delete broadcast"

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within BroadcastEditor
* **Parallel vs sequential fetching:** Broadcast and stats in parallel
* **Known constraints:**
  * Sent campaigns are read-only
  * Statistics may have slight delay

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through editor fields
* **Focus management:** Focus on first editable field
* **Screen reader expectations:** Status and fields announced
* **Landmark roles:** Editor region

## **18. Storybook & Testing Strategy**

### **Storybook**

* BroadcastEditor for draft campaign
* BroadcastEditor for sent campaign (statistics)
* Various status states

### **Testing**

* **Unit test focus:** Status-based rendering
* **Integration test focus:** Edit and reschedule flows
* **E2E test focus:** Complete broadcast editing

## **19. Non-Goals / Out of Scope**

* Creating new broadcasts
* Segment management
* Template design

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/broadcasts` | Broadcasts dashboard |
| `/admin/broadcasts/new` | Create new broadcast |

## **21. Open Questions / Notes**

* Consider adding campaign cloning
* May need revision history
* Consider adding resend to non-openers

### **Broadcast Editor Features**

The BroadcastEditor component typically provides:
- Edit campaign content
- Modify audience targeting
- View send statistics
- Reschedule if not sent
- Duplicate campaign
- Cancel scheduled broadcast
