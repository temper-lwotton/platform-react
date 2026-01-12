# **Route Specification: Admin Settings - Discussion**

## **1. Route Path**

**`/admin/settings/discussion`**

## **2. Description**

Discussion settings page for configuring comment and discussion behavior, moderation options, and notification settings.

* Comment moderation settings
* Nested comment configuration
* Spam filtering options
* Mention and notification settings

## **3. Source File**

```
src/app/(protected)/admin/settings/discussion/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying discussion settings form
* Configuring comment behavior
* Setting moderation defaults

### **This route does not:**

* Handle active moderation (see /admin/moderation)
* Manage individual comments
* Process spam reports

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

* SettingsLayout wrapper with navigation sidebar
* DiscussionSettings content component

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Settings Navigation | Links to all settings pages |
| Settings Form | Discussion configuration options |
| Actions | Save/Reset buttons |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `SettingsLayout` | `@/components/cms/settings/SettingsLayout` | Settings page wrapper with navigation |
| `DiscussionSettings` | `@/components/cms/settings/DiscussionSettings` | Discussion settings form |

### **UI / Feature Components**

*All handled within DiscussionSettings component*

## **9. Data Flow Overview**

1. Render within SettingsLayout
2. DiscussionSettings fetches current settings
3. Populate form with existing values
4. User modifies settings
5. On save → validate → update → confirm

## **10. Data Fetching**

*Handled within DiscussionSettings component*

## **11. State Management**

### **Local State**

*Handled within DiscussionSettings component*

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

*Handled by DiscussionSettings component:*
- Edit setting values
- Save changes
- Reset to defaults

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| General settings | Click nav link | `/admin/settings/general` |
| Moderation | Click link | `/admin/moderation` |

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
* **Memoisation strategy:** Handled within DiscussionSettings
* **Parallel vs sequential fetching:** Single settings fetch
* **Known constraints:** None significant

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through form fields
* **Focus management:** Focus on first field
* **Screen reader expectations:** Labels associated with inputs
* **Landmark roles:** Form with proper structure

## **18. Storybook & Testing Strategy**

### **Storybook**

* DiscussionSettings form states
* Moderation option toggles

### **Testing**

* **Unit test focus:** Form validation
* **Integration test focus:** Settings save flow
* **E2E test focus:** Discussion settings modification

## **19. Non-Goals / Out of Scope**

* Active content moderation
* Individual comment management
* Spam queue processing

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/settings/general` | General settings |
| `/admin/moderation` | Moderation settings |

## **21. Open Questions / Notes**

* Consider integrating with external spam services
* May need per-space discussion settings

### **Settings Typically Included**

The DiscussionSettings component typically provides configuration for:
- Allow comments by default
- Comment moderation settings
- Nested comment depth
- Comment ordering
- Notification settings for replies
- Spam filtering options
- Mention settings
- Close comments after N days
