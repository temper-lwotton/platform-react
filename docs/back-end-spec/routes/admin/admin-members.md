# **Route Specification: Admin Members**

## **1. Route Path**

**`/admin/members`**

## **2. Description**

Members directory for administrators to view, search, and manage all platform members with filtering and bulk actions.

* Searchable member listing
* Role and segment filtering
* Bulk actions (role change, deactivate)
* Export functionality

## **3. Source File**

```
src/app/(protected)/admin/members/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Listing all platform members
* Providing search and filter functionality
* Supporting bulk member operations
* Enabling member export

### **This route does not:**

* Edit individual member profiles
* Manage segments (see /segments)
* Configure onboarding (see /onboarding)

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `search` | `string` | No | Search query |
| `role` | `string` | No | Filter by role |
| `segment` | `string` | No | Filter by segment |
| `status` | `string` | No | Filter by status |

* **Default behaviour:** Show all members
* **Validation:** Invalid params use defaults

## **7. Layout & Structure**

### **Layout Overview**

* Full MembersDirectory component rendering
* Filters, member grid, bulk actions

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Statistics | Member counts |
| Filters | Search/role/segment filters |
| Member Grid | List of members |
| Actions | Bulk actions, export, invite |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `MembersDirectory` | `@/components/cms/members/MembersDirectory` | Member management interface |

### **UI / Feature Components**

*All handled within MembersDirectory component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Fetch members with filters
3. Display member grid with metadata
4. User filters → refetch
5. User selects → enable bulk actions
6. User clicks member → navigate to profile

## **10. Data Fetching**

*Handled within MembersDirectory component. Typically includes:*
- Member listings
- Membership statistics
- Filter options

## **11. State Management**

### **Local State**

*Handled within MembersDirectory component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Directory loading skeleton |
| Data loaded | Member grid with filters |
| Empty | "No members found" message |
| Items selected | Bulk action bar appears |
| Export in progress | Export button loading |

## **13. User Actions**

### **UI Interactions**

*Handled by MembersDirectory component:*
- Search members
- Filter by criteria
- View member profiles
- Bulk operations
- Export member data
- Invite new members

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| View member | Click member row | `/admin/members/[id]` |
| View analytics | Click analytics | `/admin/members/analytics` |
| View segments | Click segments | `/admin/members/segments` |
| View onboarding | Click onboarding | `/admin/members/onboarding` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Bulk role change | Bulk action | Update roles API | Refetch |
| Bulk deactivate | Bulk action | Deactivate API | Refetch |
| Export | Export button | Export API | Download file |

## **14. Infinite Scroll / Pagination**

* **Type:** Traditional pagination
* **Page size:** 50 members per page
* **Controls:** Page numbers with previous/next

## **15. Error & Empty States**

* **Loading:** Directory skeleton
* **Error:** "Failed to load members"
* **Empty:** "No members match your criteria"

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within MembersDirectory
* **Parallel vs sequential fetching:** Members and stats in parallel
* **Known constraints:**
  * Large member lists paginated
  * Export may take time for large datasets

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through rows and controls
* **Focus management:** Handled by MembersDirectory
* **Screen reader expectations:** Member names and roles announced
* **Landmark roles:** Main directory area

## **18. Storybook & Testing Strategy**

### **Storybook**

* MembersDirectory with various states
* Filter combinations
* Bulk action states

### **Testing**

* **Unit test focus:** Filter logic, selection state
* **Integration test focus:** Bulk operations
* **E2E test focus:** Member management flow

## **19. Non-Goals / Out of Scope**

* Member profile editing
* Segment management
* Onboarding configuration

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/members/[id]` | Member profile |
| `/admin/members/analytics` | Member analytics |
| `/admin/members/segments` | Member segments |
| `/admin/members/onboarding` | Onboarding flows |

## **21. Open Questions / Notes**

* Consider adding member import
* May need advanced filtering
* Consider adding member notes

### **Members Directory Features**

The MembersDirectory component typically provides:
- Member listing with search
- Filter by role, segment, status
- Bulk actions (role change, deactivate)
- Export functionality
- Invite new members
- Member statistics
