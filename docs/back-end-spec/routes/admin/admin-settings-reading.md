# **Route Specification: Admin Settings - Reading**

## **1. Route Path**

**`/admin/settings/reading`**

## **2. Description**

Reading settings page for configuring how content is displayed to users.

* Pagination settings
* Excerpt configuration
* Feed display options
* Content visibility defaults

## **3. Source File**

```
src/app/(protected)/admin/settings/reading/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying reading settings form
* Configuring content display options
* Setting pagination defaults

### **This route does not:**

* Handle content creation settings
* Manage user preferences
* Configure theme display

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

* SettingsLayout wrapper with navigation sidebar
* ReadingSettings content component

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Settings Navigation | Links to all settings pages |
| Settings Form | Reading configuration options |
| Actions | Save/Reset buttons |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `SettingsLayout` | `@/components/cms/settings/SettingsLayout` | Settings page wrapper with navigation |
| `ReadingSettings` | `@/components/cms/settings/ReadingSettings` | Reading settings form |

### **UI / Feature Components**

*All handled within ReadingSettings component*

## **9. Data Flow Overview**

1. Render within SettingsLayout
2. ReadingSettings fetches current settings
3. Populate form with existing values
4. User modifies settings
5. On save → validate → update → confirm

## **10. Data Fetching**

*Handled within ReadingSettings component*

## **11. State Management**

### **Local State**

*Handled within ReadingSettings component*

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

*Handled by ReadingSettings component:*
- Edit setting values
- Save changes
- Reset to defaults

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| General settings | Click nav link | `/admin/settings/general` |
| Writing settings | Click nav link | `/admin/settings/writing` |

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
* **Memoisation strategy:** Handled within ReadingSettings
* **Parallel vs sequential fetching:** Single settings fetch
* **Known constraints:** None significant

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through form fields
* **Focus management:** Focus on first field
* **Screen reader expectations:** Labels associated with inputs
* **Landmark roles:** Form with proper structure

## **18. Storybook & Testing Strategy**

### **Storybook**

* ReadingSettings form states
* Number inputs for pagination

### **Testing**

* **Unit test focus:** Form validation
* **Integration test focus:** Settings save flow
* **E2E test focus:** Reading settings modification

## **19. Non-Goals / Out of Scope**

* Content creation settings
* User-specific preferences
* Theme configuration

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/settings/general` | General settings |
| `/admin/settings/writing` | Writing settings |

## **21. Open Questions / Notes**

* Consider adding preview of reading settings
* May need per-content-type settings

### **Settings Typically Included**

The ReadingSettings component typically provides configuration for:
- Posts per page
- Feed display options
- Excerpt length
- Read more text
- Content visibility defaults
- Front page display settings
