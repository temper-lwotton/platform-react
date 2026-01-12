# **Route Specification: Admin Members Onboarding**

## **1. Route Path**

**`/admin/members/onboarding`**

## **2. Description**

Onboarding flows management page for configuring new member welcome experiences, email sequences, and first-time user guidance.

* Create/edit onboarding flows
* Email sequence configuration
* Welcome message settings
* Flow analytics

## **3. Source File**

```
src/app/(protected)/admin/members/onboarding/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Managing onboarding flows
* Configuring email sequences
* Setting welcome messages
* Viewing completion analytics

### **This route does not:**

* Manage individual members
* Handle broadcast campaigns
* Configure general settings

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

* Full OnboardingFlows component rendering
* Flow list, editor, analytics

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Flow List | Existing onboarding flows |
| Flow Editor | Create/edit flow |
| Analytics | Completion metrics |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `OnboardingFlows` | `@/components/cms/members/OnboardingFlows` | Onboarding configuration interface |

### **UI / Feature Components**

*All handled within OnboardingFlows component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Fetch existing onboarding flows
3. Display flow list with analytics
4. User creates/edits flow
5. User saves → persist → update list

## **10. Data Fetching**

*Handled within OnboardingFlows component. Typically includes:*
- Existing onboarding flows
- Email templates
- Completion statistics

## **11. State Management**

### **Local State**

*Handled within OnboardingFlows component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Flows loading skeleton |
| Data loaded | Flow list with actions |
| Empty | "No flows yet" with create button |
| Editing | Flow editor shown |
| Saving | Save button loading |

## **13. User Actions**

### **UI Interactions**

*Handled by OnboardingFlows component:*
- Create new onboarding flow
- Edit existing flows
- Configure email sequences
- Set up welcome messages
- View completion rates
- Duplicate flows

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Back to members | Click back | `/admin/members` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Create flow | Save new | Create API | Add to list |
| Update flow | Save edit | Update API | Update list |
| Delete flow | Delete button | Delete API | Remove from list |
| Duplicate | Duplicate button | Clone API | Add to list |

## **14. Infinite Scroll / Pagination**

*Not applicable*

## **15. Error & Empty States**

* **Loading:** Flows skeleton
* **Error:** "Failed to load onboarding flows"
* **Empty:** "No onboarding flows yet. Create your first flow."

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within OnboardingFlows
* **Parallel vs sequential fetching:** Flows and templates in parallel
* **Known constraints:**
  * Complex flows may be slow to save
  * Email preview requires template rendering

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through flows and controls
* **Focus management:** Focus on first element
* **Screen reader expectations:** Flow names and status announced
* **Landmark roles:** Main flows area

## **18. Storybook & Testing Strategy**

### **Storybook**

* OnboardingFlows with various states
* Flow editor
* Analytics display

### **Testing**

* **Unit test focus:** Flow validation
* **Integration test focus:** Flow creation
* **E2E test focus:** Complete onboarding setup

## **19. Non-Goals / Out of Scope**

* Member management
* Broadcast campaigns
* General email settings

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/members` | Members directory |
| `/admin/broadcasts` | Email campaigns |

## **21. Open Questions / Notes**

* Consider adding A/B testing
* May need conditional branching
* Consider adding trigger-based flows

### **Onboarding Flows Features**

The OnboardingFlows component typically provides:
- Create/edit onboarding flows
- Email sequence configuration
- Welcome message settings
- Task checklists for new users
- Flow analytics
- A/B testing options
