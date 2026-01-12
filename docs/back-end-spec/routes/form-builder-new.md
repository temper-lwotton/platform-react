# **Route Specification: Form Builder New**

## **1. Route Path**

**`/form-builder/new`**

## **2. Description**

New form creation page using the drag-and-drop FormBuilder component.

* Full form builder interface
* Creates new form with null formId
* Drag-and-drop field management
* Form configuration and preview

## **3. Source File**

```
src/app/(protected)/form-builder/new/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Rendering FormBuilder component for new form creation
* Passing null formId to indicate new form
* Providing page metadata

### **This route does not:**

* Implement form building logic (delegated to FormBuilder)
* Handle data fetching directly
* Manage form state directly

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** Any authenticated user can create forms

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

* Full-page FormBuilder interface
* Drag-and-drop form editing experience

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| FormBuilder | Complete form builder interface |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `FormBuilder` | `@/components/form-builder/FormBuilder` | Complete form builder interface |

### **UI / Feature Components**

*All handled within FormBuilder component*

## **9. Data Flow Overview**

1. Render FormBuilder with null formId
2. FormBuilder initializes empty form state
3. User builds form via drag-and-drop
4. User saves → FormBuilder creates form → redirect

## **10. Data Fetching**

*Handled within FormBuilder component*

## **11. State Management**

### **Local State**

*Handled within FormBuilder component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Page loaded | FormBuilder renders with empty form |
| Form saved | Redirect to editor or forms list |
| Cancel | Navigate to forms list |

## **13. User Actions**

### **UI Interactions**

*All handled by FormBuilder component:*
- Add form fields via drag-and-drop
- Configure field properties
- Add sections
- Set form title and description
- Preview form
- Save/publish form

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Save form | Save button | `/form-builder/[newId]` or `/forms` |
| Cancel | Cancel/back button | `/forms` |

### **Data Mutations**

*Handled within FormBuilder component*

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

*Handled within FormBuilder component*

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within FormBuilder
* **Parallel vs sequential fetching:** None at page level
* **Known constraints:**
  * FormBuilder is a complex component
  * May have performance considerations with many fields

## **17. Accessibility Considerations**

* **Keyboard navigation:** Handled by FormBuilder
* **Focus management:** Handled by FormBuilder
* **Screen reader expectations:** Handled by FormBuilder
* **Landmark roles:** Handled by FormBuilder

## **18. Storybook & Testing Strategy**

### **Storybook**

* FormBuilder in new form mode
* Various field type configurations

### **Testing**

* **Unit test focus:** FormBuilder component
* **Integration test focus:** Form creation flow
* **E2E test focus:** Complete form building journey

## **19. Non-Goals / Out of Scope**

* Form editing (see `/form-builder/[id]`)
* Form response handling
* Form analytics

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/forms` | Forms listing |
| `/form-builder/[id]` | Edit existing form |

## **21. Open Questions / Notes**

* Consider adding form templates
* May need autosave functionality
* Consider adding undo/redo

### **Page Metadata**

```typescript
export const metadata = {
  title: 'New Form - Form Builder',
  description: 'Create a new form with drag-and-drop interface',
};
```

### **Component Props**

```typescript
<FormBuilder formId={null} />
```

The `null` formId indicates a new form being created.

### **FormBuilder Features**

The FormBuilder component typically provides:
- Drag-and-drop field palette
- Field configuration panel
- Form preview mode
- Section management
- Field validation settings
- Form settings (title, description)
- Save/publish functionality
