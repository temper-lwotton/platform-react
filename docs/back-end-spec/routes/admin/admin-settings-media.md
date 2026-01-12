# **Route Specification: Admin Settings - Media**

## **1. Route Path**

**`/admin/settings/media`**

## **2. Description**

Media settings page for configuring file upload limits, image processing options, and media library behavior.

* Upload size limits
* Allowed file types
* Image optimization settings
* Thumbnail configuration

## **3. Source File**

```
src/app/(protected)/admin/settings/media/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying media settings form
* Configuring upload limits
* Setting image processing options

### **This route does not:**

* Manage media files directly (see /admin/media)
* Handle uploads
* Process images

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

* SettingsLayout wrapper with navigation sidebar
* MediaSettings content component

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Settings Navigation | Links to all settings pages |
| Settings Form | Media configuration options |
| Actions | Save/Reset buttons |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `SettingsLayout` | `@/components/cms/settings/SettingsLayout` | Settings page wrapper with navigation |
| `MediaSettings` | `@/components/cms/settings/MediaSettings` | Media settings form |

### **UI / Feature Components**

*All handled within MediaSettings component*

## **9. Data Flow Overview**

1. Render within SettingsLayout
2. MediaSettings fetches current settings
3. Populate form with existing values
4. User modifies settings
5. On save → validate → update → confirm

## **10. Data Fetching**

*Handled within MediaSettings component*

## **11. State Management**

### **Local State**

*Handled within MediaSettings component*

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

*Handled by MediaSettings component:*
- Edit setting values
- Save changes
- Reset to defaults

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| General settings | Click nav link | `/admin/settings/general` |
| Media library | Click link | `/admin/media` |

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
* **Memoisation strategy:** Handled within MediaSettings
* **Parallel vs sequential fetching:** Single settings fetch
* **Known constraints:** None significant

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through form fields
* **Focus management:** Focus on first field
* **Screen reader expectations:** Labels associated with inputs
* **Landmark roles:** Form with proper structure

## **18. Storybook & Testing Strategy**

### **Storybook**

* MediaSettings form states
* File type selectors
* Size limit inputs

### **Testing**

* **Unit test focus:** Form validation, size limits
* **Integration test focus:** Settings save flow
* **E2E test focus:** Media settings modification

## **19. Non-Goals / Out of Scope**

* Media file management
* Image editing
* Bulk operations

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/settings/general` | General settings |
| `/admin/media` | Media library |

## **21. Open Questions / Notes**

* Consider adding storage quota display
* May need CDN configuration options

### **Settings Typically Included**

The MediaSettings component typically provides configuration for:
- Maximum upload file size
- Allowed file types
- Image thumbnail sizes
- Image quality/compression
- Media organization options
- Default image alignment
- Automatic image optimization
