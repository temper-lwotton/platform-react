# **Route Specification: Admin Settings - Writing**

## **1. Route Path**

**`/admin/settings/writing`**

## **2. Description**

Writing settings page for configuring content creation options, editor preferences, and publishing defaults.

* Editor type preferences
* Auto-save settings
* Publishing workflow options
* Default content formats

## **3. Source File**

```
src/app/(protected)/admin/settings/writing/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying writing settings form
* Configuring editor behavior
* Setting publishing defaults

### **This route does not:**

* Handle reading/display settings
* Manage media uploads
* Configure user permissions

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

* SettingsLayout wrapper with navigation sidebar
* WritingSettings content component

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Settings Navigation | Links to all settings pages |
| Settings Form | Writing configuration options |
| Actions | Save/Reset buttons |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `SettingsLayout` | `@/components/cms/settings/SettingsLayout` | Settings page wrapper with navigation |
| `WritingSettings` | `@/components/cms/settings/WritingSettings` | Writing settings form |

### **UI / Feature Components**

*All handled within WritingSettings component*

## **9. Data Flow Overview**

1. Render within SettingsLayout
2. WritingSettings fetches current settings
3. Populate form with existing values
4. User modifies settings
5. On save → validate → update → confirm

## **10. Data Fetching**

*Handled within WritingSettings component*

## **11. State Management**

### **Local State**

*Handled within WritingSettings component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Form loading skeleton |
| Settings loaded | Form populated with values |
| Unsaved changes | "Unsaved changes" indicator |
| Saving | Save button shows loading |
| Save success | Success message |

## **13. User Actions**

### **UI Interactions**

*Handled by WritingSettings component:*
- Edit setting values
- Save changes
- Reset to defaults

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| General settings | Click nav link | `/admin/settings/general` |
| Reading settings | Click nav link | `/admin/settings/reading` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Save settings | Form submit | Update settings API | Show success |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Loading:** Form skeleton
* **Save error:** "Failed to save settings"
* **Validation error:** Field-level messages

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within WritingSettings
* **Parallel vs sequential fetching:** Single settings fetch
* **Known constraints:** None significant

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through form fields
* **Focus management:** Focus on first field
* **Screen reader expectations:** Labels associated with inputs
* **Landmark roles:** Form with proper structure

## **18. Storybook & Testing Strategy**

### **Storybook**

* WritingSettings form states
* Editor preference options

### **Testing**

* **Unit test focus:** Form validation
* **Integration test focus:** Settings save flow
* **E2E test focus:** Writing settings modification

## **19. Non-Goals / Out of Scope**

* Reading/display settings
* Media configuration
* Permission management

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/settings/general` | General settings |
| `/admin/settings/reading` | Reading settings |

## **21. Open Questions / Notes**

* Consider adding editor preview
* May need per-user editor preferences

### **Settings Typically Included**

The WritingSettings component typically provides configuration for:
- Default post category
- Default post format
- Editor type preferences
- Auto-save interval
- Content formatting options
- Publishing workflow settings
