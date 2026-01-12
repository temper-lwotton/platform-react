# **Route Specification: Admin Settings - Permalinks**

## **1. Route Path**

**`/admin/settings/permalinks`**

## **2. Description**

Permalink settings page for configuring URL structure patterns for content, users, and other resources.

* Post URL patterns
* Category and tag slugs
* Custom structure options
* Trailing slash behavior

## **3. Source File**

```
src/app/(protected)/admin/settings/permalinks/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying permalink settings form
* Configuring URL structure patterns
* Setting slug bases

### **This route does not:**

* Generate actual URLs
* Handle redirects
* Manage SEO metadata

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

* SettingsLayout wrapper with navigation sidebar
* PermalinkSettings content component

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Settings Navigation | Links to all settings pages |
| Settings Form | Permalink configuration options |
| Examples | Live URL previews |
| Actions | Save/Reset buttons |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `SettingsLayout` | `@/components/cms/settings/SettingsLayout` | Settings page wrapper with navigation |
| `PermalinkSettings` | `@/components/cms/settings/PermalinkSettings` | Permalink settings form |

### **UI / Feature Components**

*All handled within PermalinkSettings component*

## **9. Data Flow Overview**

1. Render within SettingsLayout
2. PermalinkSettings fetches current settings
3. Populate form with existing values
4. User modifies settings → show live preview
5. On save → validate → update → confirm

## **10. Data Fetching**

*Handled within PermalinkSettings component*

## **11. State Management**

### **Local State**

*Handled within PermalinkSettings component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Form loading skeleton |
| Settings loaded | Form populated with values |
| Pattern changed | Live URL preview updates |
| Unsaved changes | "Unsaved changes" indicator |
| Saving | Save button shows loading |
| Save success | Success message |

## **13. User Actions**

### **UI Interactions**

*Handled by PermalinkSettings component:*
- Select preset structure
- Define custom structure
- Save changes
- View examples

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| General settings | Click nav link | `/admin/settings/general` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Save settings | Form submit | Update settings API | Show success |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Loading:** Form skeleton
* **Save error:** "Failed to save settings"
* **Invalid pattern:** Pattern error message

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within PermalinkSettings
* **Parallel vs sequential fetching:** Single settings fetch
* **Known constraints:**
  * Changing permalinks may break existing links
  * May require redirect setup

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through form fields
* **Focus management:** Focus on first field
* **Screen reader expectations:** Labels associated with inputs
* **Landmark roles:** Form with proper structure

## **18. Storybook & Testing Strategy**

### **Storybook**

* PermalinkSettings form states
* Pattern presets
* Custom pattern builder

### **Testing**

* **Unit test focus:** Pattern validation
* **Integration test focus:** Settings save flow
* **E2E test focus:** Permalink structure modification

## **19. Non-Goals / Out of Scope**

* URL generation
* Redirect management
* SEO configuration

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/settings/general` | General settings |

## **21. Open Questions / Notes**

* Consider adding redirect rules for changed permalinks
* May need per-content-type URL patterns
* Consider adding URL conflict detection

### **Permalink Patterns**

Common permalink patterns:
- `/posts/%postname%/`
- `/blog/%year%/%month%/%postname%/`
- `/%category%/%postname%/`
- `/p/%post_id%/`

### **Settings Typically Included**

The PermalinkSettings component typically provides configuration for:
- Post URL structure
- Category base slug
- Tag base slug
- Author base slug
- Custom structure patterns
- Trailing slash behavior
