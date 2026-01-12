# **Route Specification: Spaces New**

## **1. Route Path**

**`/spaces/new`**

## **2. Description**

Space creation page with multi-step wizard for setting up new collaborative spaces.

* Guides users through space setup process
* Configures space title, description, and privacy
* Allows initial member invitations
* Supports space icon/image upload

## **3. Source File**

```
src/app/(protected)/spaces/new/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Rendering the space creation wizard
* Delegating all form logic to SpaceCreationWizard component
* Providing navigation on completion or cancellation

### **This route does not:**

* Handle form validation (delegated to wizard)
* Manage space data after creation
* Handle space membership beyond initial setup

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user (may require specific permissions)
* **Permission Rules:** User must have permission to create spaces

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

* Single component page
* Full-page wizard interface

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Wizard | Multi-step form with navigation |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `SpaceCreationWizard` | `@/components/spaces/SpaceCreationWizard` | Full-page wizard component |

### **UI / Feature Components**

*Handled within SpaceCreationWizard*

## **9. Data Flow Overview**

1. Page renders SpaceCreationWizard component
2. Wizard manages all form state internally
3. User progresses through wizard steps
4. On submission, wizard creates space via API
5. Success: navigate to new space
6. Cancel: navigate back to spaces list

## **10. Data Fetching**

*Handled within the SpaceCreationWizard component.*

## **11. State Management**

*Managed within the SpaceCreationWizard component.*

### **Wizard Steps (typical)**

1. Basic Info (title, description)
2. Privacy Settings (public/private)
3. Members (initial invitations)
4. Image (icon/cover upload)
5. Review and Create

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Initial load | First wizard step displayed |
| Step completion | Progress to next step |
| Step navigation | Move between completed steps |
| Form validation error | Error displayed, step not advanced |
| Submission in progress | Loading state, form disabled |
| Submission success | Redirect to created space |
| Submission error | Error message displayed |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Enter space title | Type in title field | Update wizard state |
| Enter description | Type in description field | Update wizard state |
| Configure privacy | Toggle public/private | Update wizard state |
| Add members | Search and select users | Update wizard state |
| Upload image | Select file | Preview and store |
| Next step | Click next/continue | Validate and advance |
| Previous step | Click back | Return to previous step |
| Submit | Click create | Create space via API |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Cancel | Click cancel button | `/spaces` |
| Complete creation | Successful submission | `/spaces/[newSpaceId]` |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Loading:** Handled within wizard
* **Validation error:** Field-level error messages
* **Submission error:** Error message with retry option
* **Network error:** Generic error message

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Wizard manages internally
* **Parallel vs sequential fetching:** N/A
* **Known constraints:**
  * Image upload may take time
  * Member search requires API calls

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through form fields, Enter to submit
* **Focus management:** Focus moves to first field in each step
* **Screen reader expectations:** Step progress announced, errors announced
* **Landmark roles:** Form with proper labeling

## **18. Storybook & Testing Strategy**

### **Storybook**

* `SpaceCreationWizard` component with all steps
* Individual step components
* Error states

### **Testing**

* **Unit test focus:** Step validation, state management
* **Integration test focus:** Step navigation, form submission
* **E2E test focus:** Complete space creation journey

## **19. Non-Goals / Out of Scope**

* Space editing (separate route)
* Space deletion
* Member management after creation
* Space settings modification

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/spaces` | Spaces listing (cancel destination) |
| `/spaces/[id]` | Created space destination |

## **21. Open Questions / Notes**

* Consider adding draft/save functionality
* May need template spaces option
* Consider space duplication feature
