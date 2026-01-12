# **Route Specification: Admin Member Profile**

## **1. Route Path**

**`/admin/members/[id]`**

## **2. Description**

Admin member profile page showing detailed member information, activity history, and administrative actions for a specific user.

* Full profile information
* Activity timeline
* Role management
* Account actions

## **3. Source File**

```
src/app/(protected)/admin/members/[id]/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying member details
* Showing activity history
* Enabling role management
* Providing account actions

### **This route does not:**

* List all members
* Manage segments
* Configure permissions system

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | The unique identifier of the member |

* **Default behaviour:** N/A - id is required
* **Validation:** Invalid id shows error

## **7. Layout & Structure**

### **Layout Overview**

* Full MemberProfile component rendering
* Profile info, activity, actions

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Profile Header | Avatar, name, role |
| Profile Details | Contact, membership info |
| Activity Timeline | Recent activity |
| Actions Panel | Administrative actions |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `MemberProfile` | `@/components/cms/members/MemberProfile` | Admin member profile view |

### **UI / Feature Components**

*All handled within MemberProfile component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Parse member ID from URL
3. Fetch member data and activity
4. Display profile with actions
5. User takes action → mutation → refetch

## **10. Data Fetching**

*Handled within MemberProfile component. Typically includes:*
- Member details
- Activity history
- Membership information
- Content contributions

## **11. State Management**

### **Local State**

*Handled within MemberProfile component*

### **Component Props**

```typescript
<MemberProfile memberId={params.id} />
```

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Profile loading skeleton |
| Data loaded | Full profile display |
| Not found | Error message |
| Action in progress | Button loading states |
| Action success | Success message |

## **13. User Actions**

### **UI Interactions**

*Handled by MemberProfile component:*
- View profile details
- View activity history
- Change member role
- Suspend/activate account
- Send direct message
- Reset password
- Delete account

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Back to directory | Click back | `/admin/members` |
| View public profile | Click link | `/users/[id]` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Change role | Role selector | Update role API | Show success |
| Suspend | Suspend button | Suspend API | Update status |
| Reset password | Reset button | Reset API | Send email |
| Delete account | Delete button | Delete API | Redirect |

## **14. Infinite Scroll / Pagination**

*Not applicable - activity timeline may use pagination*

## **15. Error & Empty States**

* **Loading:** Profile skeleton
* **Not found:** "Member not found"
* **Action error:** Error message

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within MemberProfile
* **Parallel vs sequential fetching:** Profile and activity in parallel
* **Known constraints:**
  * Activity history may be truncated
  * Some actions require confirmation

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through sections
* **Focus management:** Focus on first element
* **Screen reader expectations:** Profile info announced
* **Landmark roles:** Profile sections

## **18. Storybook & Testing Strategy**

### **Storybook**

* MemberProfile various states
* Activity timeline
* Action buttons

### **Testing**

* **Unit test focus:** Action handlers
* **Integration test focus:** Role change flow
* **E2E test focus:** Complete profile management

## **19. Non-Goals / Out of Scope**

* Bulk member operations
* Segment management
* Permission system configuration

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/members` | Members directory |
| `/users/[id]` | Public user profile |

## **21. Open Questions / Notes**

* Consider adding impersonation feature
* May need audit log access
* Consider adding member notes

### **Member Profile Features**

The MemberProfile component typically provides:
- Full profile information
- Activity timeline
- Content contributions
- Membership status
- Role management
- Account actions
