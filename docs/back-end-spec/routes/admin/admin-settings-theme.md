# **Route Specification: Admin Settings - Theme**

## **1. Route Path**

**`/admin/settings/theme`**

## **2. Description**

Theme settings page for configuring the visual appearance of the platform including colors, typography, and branding options.

* Color scheme configuration
* Typography settings
* Logo and branding assets
* Dark mode options

## **3. Source File**

```
src/app/(protected)/admin/settings/theme/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying theme settings form
* Configuring visual appearance
* Managing branding assets

### **This route does not:**

* Handle content-specific styling
* Manage CSS directly
* Process template files

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

* SettingsLayout wrapper with navigation sidebar
* ThemeSettings content component

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Settings Navigation | Links to all settings pages |
| Color Settings | Color picker controls |
| Typography Settings | Font selections |
| Branding | Logo and favicon uploads |
| Preview | Live theme preview |
| Actions | Save/Reset buttons |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `SettingsLayout` | `@/components/cms/settings/SettingsLayout` | Settings page wrapper with navigation |
| `ThemeSettings` | `@/components/cms/settings/ThemeSettings` | Theme settings form |

### **UI / Feature Components**

*All handled within ThemeSettings component*

## **9. Data Flow Overview**

1. Render within SettingsLayout
2. ThemeSettings fetches current settings
3. Populate form with existing values
4. User modifies settings → show live preview
5. On save → validate → update → apply theme

## **10. Data Fetching**

*Handled within ThemeSettings component*

## **11. State Management**

### **Local State**

*Handled within ThemeSettings component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Form loading skeleton |
| Settings loaded | Form populated with values |
| Color changed | Preview updates in real-time |
| Logo uploaded | Preview shows new logo |
| Unsaved changes | "Unsaved changes" indicator |
| Saving | Save button shows loading |
| Save success | Theme applied platform-wide |

## **13. User Actions**

### **UI Interactions**

| Action | Description |
|--------|-------------|
| Color picker | Select colors via picker interface |
| Upload logo | Add/change site logo |
| Preview theme | See changes before saving |
| Toggle dark mode | Configure dark mode behavior |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| General settings | Click nav link | `/admin/settings/general` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Save settings | Form submit | Update settings API | Apply theme |
| Upload logo | File upload | Upload API | Show preview |
| Reset to defaults | Reset button | Reset API | Reload form |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Loading:** Form skeleton
* **Save error:** "Failed to save theme settings"
* **Upload error:** "Failed to upload logo"
* **Invalid color:** Color validation message

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within ThemeSettings
* **Parallel vs sequential fetching:** Single settings fetch
* **Known constraints:**
  * Theme changes apply globally
  * Logo uploads have size limits

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through form fields
* **Focus management:** Focus on first field
* **Screen reader expectations:** Color values announced
* **Landmark roles:** Form with proper structure

## **18. Storybook & Testing Strategy**

### **Storybook**

* ThemeSettings form states
* Color pickers
* Logo upload area
* Theme preview

### **Testing**

* **Unit test focus:** Color validation, accessibility checks
* **Integration test focus:** Theme save and apply flow
* **E2E test focus:** Complete theme customization

## **19. Non-Goals / Out of Scope**

* CSS editing
* Template management
* Per-page styling

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/settings/general` | General settings |

## **21. Open Questions / Notes**

* Consider adding theme presets
* May need accessibility contrast checker
* Consider adding custom CSS option

### **Settings Typically Included**

The ThemeSettings component typically provides configuration for:
- Primary color
- Secondary color
- Accent color
- Background colors
- Text colors
- Font family selections
- Logo upload
- Favicon upload
- Dark mode settings
- Custom CSS
