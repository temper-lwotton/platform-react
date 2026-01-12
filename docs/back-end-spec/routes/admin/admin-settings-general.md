# **Route Specification: Admin Settings - General**

## **1. Route Path**

**`/admin/settings/general`**

## **2. Description**

General platform settings page for configuring site-wide options.

* Site title and description
* Timezone and locale settings
* Date and time formats
* Administrative contact information

## **3. Source File**

```
src/app/(protected)/admin/settings/general/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying general settings form
* Saving site-wide configuration
* Providing timezone and format options

### **This route does not:**

* Handle content-specific settings
* Manage media settings
* Configure theme options

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

* SettingsLayout wrapper with navigation sidebar
* GeneralSettings content component

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Settings Navigation | Links to all settings pages |
| Settings Form | General configuration options |
| Actions | Save/Reset buttons |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `SettingsLayout` | `@/components/cms/settings/SettingsLayout` | Settings page wrapper with navigation |
| `GeneralSettings` | `@/components/cms/settings/GeneralSettings` | General settings form |

### **UI / Feature Components**

*All handled within GeneralSettings component*

## **9. Data Flow Overview**

1. Render within SettingsLayout
2. GeneralSettings fetches current settings
3. Populate form with existing values
4. User modifies settings
5. On save → validate → update → confirm

## **10. Data Fetching**

*Handled within GeneralSettings component. Typically includes:*
- Current site settings
- Available timezone options
- Language options

## **11. State Management**

### **Local State**

*Handled within GeneralSettings component*

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
| Save error | Error message |

## **13. User Actions**

### **UI Interactions**

*Handled by GeneralSettings component:*
- Edit setting values
- Save changes
- Reset to defaults

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Reading settings | Click nav link | `/admin/settings/reading` |
| Writing settings | Click nav link | `/admin/settings/writing` |
| Discussion settings | Click nav link | `/admin/settings/discussion` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Save settings | Form submit/save button | Update settings API | Show success message |
| Reset to defaults | Reset button | Reset settings API | Reload form |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Loading:** Form skeleton
* **Save error:** "Failed to save settings. Please try again."
* **Validation error:** Field-level error messages

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within GeneralSettings
* **Parallel vs sequential fetching:** Single settings fetch
* **Known constraints:**
  * Settings changes may require refresh to take effect

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through form fields
* **Focus management:** Focus on first field
* **Screen reader expectations:** Labels associated with inputs
* **Landmark roles:** Form with proper structure

## **18. Storybook & Testing Strategy**

### **Storybook**

* GeneralSettings form states
* Timezone selector
* Save/reset interactions

### **Testing**

* **Unit test focus:** Form validation
* **Integration test focus:** Settings save flow
* **E2E test focus:** Complete settings modification

## **19. Non-Goals / Out of Scope**

* Content settings
* Media settings
* Theme configuration

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/settings/reading` | Reading settings |
| `/admin/settings/writing` | Writing settings |
| `/admin/settings/discussion` | Discussion settings |

## **21. Open Questions / Notes**

* Consider adding settings import/export
* May need multi-language support
* Consider adding settings history/audit log

### **Settings Typically Included**

The GeneralSettings component typically provides configuration for:
- Site title
- Site description/tagline
- Site URL
- Admin email
- Timezone
- Date format
- Time format
- Week start day
- Default language
