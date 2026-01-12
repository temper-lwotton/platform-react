# **Route Specification: Form Builder Edit**

## **1. Route Path**

**`/form-builder/[id]`**

## **2. Description**

Form editing page using the drag-and-drop FormBuilder component.

* Loads existing form by ID
* Full form builder interface
* Drag-and-drop field management
* Save and update functionality

## **3. Source File**

```
src/app/(protected)/form-builder/[id]/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Parsing form ID from URL
* Validating form ID is numeric
* Rendering FormBuilder component with form ID
* Showing invalid ID error state

### **This route does not:**

* Implement form building logic (delegated to FormBuilder)
* Handle data fetching directly
* Manage form state directly

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Form owner or authorized user
* **Permission Rules:** Only form owner can edit

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Form ID (parsed as integer) |

* **Default behaviour:** N/A - id is required
* **Validation:** Shows error for non-numeric IDs

## **7. Layout & Structure**

### **Layout Overview**

* Full-page FormBuilder interface
* Drag-and-drop form editing experience

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| FormBuilder | Complete form builder interface |
| Error State | Invalid ID message (if applicable) |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `FormBuilder` | `@/components/form-builder/FormBuilder` | Complete form builder interface |

### **UI / Feature Components**

*All handled within FormBuilder component*

## **9. Data Flow Overview**

1. Extract ID from URL parameters
2. Parse ID as integer
3. Validate ID is numeric → show error if not
4. Render FormBuilder with formId
5. FormBuilder loads existing form data
6. User edits form → save → stay or redirect

## **10. Data Fetching**

*Handled within FormBuilder component based on formId*

## **11. State Management**

### **Local State**

*Handled within FormBuilder component*

### **URL Parameter Handling**

```typescript
const { id } = use(params);
const formId = parseInt(id, 10);

if (isNaN(formId)) {
  // Show invalid ID error
}
```

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Valid ID | FormBuilder renders with form data |
| Invalid ID (NaN) | "Invalid Form ID" error message |
| Form not found | Handled by FormBuilder component |
| Loading | Handled by FormBuilder component |
| Form saved | Stay on page or redirect to `/forms` |

## **13. User Actions**

### **UI Interactions**

*All handled by FormBuilder component:*
- Modify existing form fields
- Reorder fields via drag-and-drop
- Configure field properties
- Add/remove sections
- Update form title and description
- Preview form
- Save changes

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Save form | Save button | Stay on page or `/forms` |
| Cancel/back | Cancel button | `/forms` |

### **Data Mutations**

*Handled within FormBuilder component*

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Invalid ID:** "Invalid Form ID" with explanation "The form ID must be a valid number."
* **Form not found:** Handled by FormBuilder component
* **Loading:** Handled by FormBuilder component

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within FormBuilder
* **Parallel vs sequential fetching:** None at page level
* **Known constraints:**
  * FormBuilder is a complex component
  * Form data must be fetched before editing
  * May have performance considerations with many fields

## **17. Accessibility Considerations**

* **Keyboard navigation:** Handled by FormBuilder
* **Focus management:** Handled by FormBuilder
* **Screen reader expectations:** Handled by FormBuilder
* **Landmark roles:** Handled by FormBuilder

## **18. Storybook & Testing Strategy**

### **Storybook**

* FormBuilder in edit mode
* Invalid ID error state
* Various form configurations

### **Testing**

* **Unit test focus:** ID parsing and validation
* **Integration test focus:** Form loading and saving
* **E2E test focus:** Complete form editing journey

## **19. Non-Goals / Out of Scope**

* New form creation (see `/form-builder/new`)
* Form response handling
* Form analytics
* Version history

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/forms` | Forms listing |
| `/form-builder/new` | Create new form |

## **21. Open Questions / Notes**

* Consider adding version history
* May need autosave functionality
* Consider adding undo/redo
* May need form duplication from editor

### **Component Props**

```typescript
<FormBuilder formId={formId} />
```

The numeric `formId` indicates an existing form to be loaded.

### **FormBuilder Features**

The FormBuilder component typically provides:
- Load existing form data
- Drag-and-drop field reordering
- Field configuration panel
- Form preview mode
- Section management
- Field validation settings
- Form settings (title, description)
- Save/update functionality
- Version history (if implemented)
