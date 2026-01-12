# **Route Specification: Admin Moderation Rules**

## **1. Route Path**

**`/admin/moderation/rules`**

## **2. Description**

Auto-moderation rules configuration page for setting up automated content filtering, spam detection, and content guidelines enforcement.

* Rule creation and editing
* Pattern matching configuration
* Action configuration
* Rule statistics

## **3. Source File**

```
src/app/(protected)/admin/moderation/rules/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Creating and editing rules
* Configuring pattern matching
* Setting rule actions
* Viewing rule effectiveness

### **This route does not:**

* Process moderation queue
* Handle appeals
* Show detailed analytics

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

* Full AutoModerationRules component rendering
* Rule list, editor, testing

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Rule List | Existing rules with statistics |
| Rule Editor | Create/edit rule |
| Test Panel | Test rules against content |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `AutoModerationRules` | `@/components/cms/moderation/AutoModerationRules` | Auto-moderation configuration |

### **UI / Feature Components**

*All handled within AutoModerationRules component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Fetch existing rules
3. Display rule list with statistics
4. User creates/edits rules
5. User tests rule → preview matches → save

## **10. Data Fetching**

*Handled within AutoModerationRules component. Typically includes:*
- Existing moderation rules
- Rule effectiveness statistics
- Blocked content patterns

## **11. State Management**

### **Local State**

*Handled within AutoModerationRules component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Rules loading skeleton |
| Data loaded | Rule list with actions |
| Empty | "No rules yet" message |
| Editing | Rule editor shown |
| Testing | Test results displayed |

## **13. User Actions**

### **UI Interactions**

*Handled by AutoModerationRules component:*
- Create new rules
- Edit existing rules
- Enable/disable rules
- Test rules
- View rule statistics
- Reorder rule priority

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Back to moderation | Click back | `/admin/moderation` |
| Discussion settings | Click link | `/admin/settings/discussion` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Create rule | Save new | Create API | Add to list |
| Update rule | Save edit | Update API | Update list |
| Delete rule | Delete button | Delete API | Remove |
| Toggle | Enable/disable | Update API | Update status |
| Reorder | Drag and drop | Update API | Update order |

## **14. Infinite Scroll / Pagination**

*Not applicable*

## **15. Error & Empty States**

* **Loading:** Rules skeleton
* **Error:** "Failed to load rules"
* **Empty:** "No rules yet. Create your first rule."

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within AutoModerationRules
* **Parallel vs sequential fetching:** Rules and stats in parallel
* **Known constraints:**
  * Complex regex may be slow to test
  * Rule order matters for processing

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through rules and controls
* **Focus management:** Focus on first element
* **Screen reader expectations:** Rule names and status announced
* **Landmark roles:** Main rules area

## **18. Storybook & Testing Strategy**

### **Storybook**

* AutoModerationRules with various states
* Rule editor interface
* Test panel

### **Testing**

* **Unit test focus:** Rule validation
* **Integration test focus:** Rule creation
* **E2E test focus:** Complete rule management

## **19. Non-Goals / Out of Scope**

* Manual moderation
* Appeals handling
* Detailed analytics

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/moderation` | Moderation queue |
| `/admin/settings/discussion` | Discussion settings |

## **21. Open Questions / Notes**

* Consider adding rule templates
* May need machine learning rules
* Consider adding rule import/export

### **Rule Types**

- Keyword filters
- Spam detection
- Link restrictions
- Content length limits
- Duplicate content detection
- Media content filters

### **Auto-Moderation Rules Features**

The AutoModerationRules component typically provides:
- Create/edit rules
- Pattern matching configuration
- Action configuration (flag, remove, warn)
- Rule priority ordering
- Test rules against sample content
- Rule statistics
