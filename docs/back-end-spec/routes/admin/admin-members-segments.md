# **Route Specification: Admin Members Segments**

## **1. Route Path**

**`/admin/members/segments`**

## **2. Description**

Member segments management page for creating and managing audience segments based on user attributes, behavior, and engagement patterns.

* Rule-based segment creation
* Segment member preview
* Segment statistics
* Export capabilities

## **3. Source File**

```
src/app/(protected)/admin/members/segments/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Creating and editing segments
* Previewing segment members
* Viewing segment statistics
* Exporting segment data

### **This route does not:**

* Manage individual members
* Send broadcasts (uses segments)
* Configure onboarding

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

* Full MemberSegments component rendering
* Segment list, rule editor, preview

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Segment List | Existing segments with counts |
| Rule Editor | Create/edit segment rules |
| Preview Panel | Preview matching members |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `MemberSegments` | `@/components/cms/members/MemberSegments` | Segment management interface |

### **UI / Feature Components**

*All handled within MemberSegments component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Fetch existing segments
3. Display segment list with counts
4. User creates/edits segment rules
5. Preview updates → save → persist

## **10. Data Fetching**

*Handled within MemberSegments component. Typically includes:*
- Existing segments
- Segment member counts
- Available filter criteria

## **11. State Management**

### **Local State**

*Handled within MemberSegments component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Segments loading skeleton |
| Data loaded | Segment list with counts |
| Empty | "No segments yet" message |
| Editing | Rule editor shown |
| Preview loading | Preview loading indicator |

## **13. User Actions**

### **UI Interactions**

*Handled by MemberSegments component:*
- Create new segment
- Edit segment rules
- Preview segment members
- Delete segments
- Duplicate segments
- Export segment data

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Back to members | Click back | `/admin/members` |
| Use for broadcast | Click use | `/admin/broadcasts/new?segment=[id]` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Create segment | Save new | Create API | Add to list |
| Update segment | Save edit | Update API | Update list |
| Delete segment | Delete button | Delete API | Remove from list |
| Export | Export button | Export API | Download file |

## **14. Infinite Scroll / Pagination**

*Not applicable - preview may use pagination*

## **15. Error & Empty States**

* **Loading:** Segments skeleton
* **Error:** "Failed to load segments"
* **Empty:** "No segments yet. Create your first segment."

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within MemberSegments
* **Parallel vs sequential fetching:** Segments and counts in parallel
* **Known constraints:**
  * Complex rules may slow preview
  * Large segments may take time to export

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through segments and controls
* **Focus management:** Focus on first element
* **Screen reader expectations:** Segment names and counts announced
* **Landmark roles:** Main segments area

## **18. Storybook & Testing Strategy**

### **Storybook**

* MemberSegments with various states
* Rule editor interface
* Preview panel

### **Testing**

* **Unit test focus:** Rule validation
* **Integration test focus:** Segment creation
* **E2E test focus:** Complete segment management

## **19. Non-Goals / Out of Scope**

* Member management
* Broadcast sending
* Onboarding configuration

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/members` | Members directory |
| `/admin/broadcasts` | Use segments for targeting |

## **21. Open Questions / Notes**

* Consider adding dynamic segments
* May need segment combination (AND/OR)
* Consider adding scheduled exports

### **Segment Rule Examples**

- Joined within last 30 days
- Active in specific spaces
- Engagement level (high/medium/low)
- Company type
- Geographic location

### **Member Segments Features**

The MemberSegments component typically provides:
- Create/edit segments
- Rule-based filtering
- Preview segment members
- Segment statistics
- Export segment members
- Use segments for targeting
