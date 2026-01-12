# **Route Specification: Admin Content Calendar**

## **1. Route Path**

**`/admin/content/calendar`**

## **2. Description**

Content calendar view showing scheduled and published content on a calendar interface for editorial planning.

* Month/week/day calendar views
* Visual content scheduling
* Drag-and-drop rescheduling
* Content type color coding

## **3. Source File**

```
src/app/(protected)/admin/content/calendar/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying content on calendar
* Allowing schedule visualization
* Supporting drag-and-drop rescheduling
* Creating content for specific dates

### **This route does not:**

* Edit content details
* Manage content listings
* Handle bulk operations

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `date` | `string` | No | Center date for calendar view |
| `view` | `string` | No | View mode (month/week/day) |

* **Default behaviour:** Current month view
* **Validation:** Invalid dates default to today

## **7. Layout & Structure**

### **Layout Overview**

* Full ContentCalendar component rendering
* Navigation controls, calendar grid

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Navigation | Date navigation, view toggle |
| Calendar Grid | Content items on dates |
| Legend | Content type color key |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `ContentCalendar` | `@/components/cms/content/ContentCalendar` | Calendar-based content view |

### **UI / Feature Components**

*All handled within ContentCalendar component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Determine date range from view
3. Fetch content for date range
4. Display on calendar
5. User drags item → update date → save
6. User clicks date → create content for date

## **10. Data Fetching**

*Handled within ContentCalendar component. Typically includes:*
- Scheduled content
- Published content with dates
- Draft content with target dates

## **11. State Management**

### **Local State**

*Handled within ContentCalendar component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Calendar skeleton |
| Data loaded | Content items on dates |
| Empty date | Empty cell |
| Item dragged | Visual drag feedback |
| Date changed | Persist new date |

## **13. User Actions**

### **UI Interactions**

*Handled by ContentCalendar component:*
- Navigate between dates
- Change view mode (month/week/day)
- Drag to reschedule content
- Click to view/edit content
- Create content for specific date

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| List view | Click list button | `/admin/content` |
| Create content | Click new button | `/admin/content/new` |
| Edit content | Click item | `/admin/content/[id]` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Reschedule | Drag and drop | Update date API | Show new position |

## **14. Infinite Scroll / Pagination**

*Not applicable - calendar view loads date range*

## **15. Error & Empty States**

* **Loading:** Calendar skeleton
* **Error:** "Failed to load calendar"
* **No content:** Empty calendar cells

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within ContentCalendar
* **Parallel vs sequential fetching:** Single range query
* **Known constraints:**
  * Large date ranges may load slowly
  * Many items on one date may overflow

## **17. Accessibility Considerations**

* **Keyboard navigation:** Arrow keys for date navigation
* **Focus management:** Focus on current date
* **Screen reader expectations:** Date and content announced
* **Landmark roles:** Calendar region

## **18. Storybook & Testing Strategy**

### **Storybook**

* Calendar with various content distributions
* Different view modes
* Drag-and-drop states

### **Testing**

* **Unit test focus:** Date calculations, view switching
* **Integration test focus:** Drag-and-drop rescheduling
* **E2E test focus:** Calendar navigation and editing

## **19. Non-Goals / Out of Scope**

* Content editing
* Bulk operations
* Media management

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/content` | Content dashboard |
| `/admin/content/new` | Create content |

## **21. Open Questions / Notes**

* Consider adding recurring content
* May need team calendar features
* Consider adding deadline tracking

### **Content Calendar Features**

The ContentCalendar component typically provides:
- Month/week/day views
- Drag-and-drop rescheduling
- Content type color coding
- Quick view on hover
- Create content from date
