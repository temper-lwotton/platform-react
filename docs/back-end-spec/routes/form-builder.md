# **Route Specification: Form Builder Index**

## **1. Route Path**

**`/form-builder`**

## **2. Description**

Redirect page that automatically redirects users to the forms listing page.

* No standalone view
* Immediate redirect on mount
* Serves as navigation convenience

## **3. Source File**

```
src/app/(protected)/form-builder/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Redirecting to `/forms` on mount

### **This route does not:**

* Display any UI
* Fetch any data
* Handle any user interactions

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** Redirect applies to all authenticated users

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

*None - immediately redirects*

### **Structural Regions**

*None*

## **8. Components Used**

### **Layout Components**

*None*

### **UI / Feature Components**

*None*

## **9. Data Flow Overview**

1. Component mounts
2. useEffect triggers redirect to `/forms`

## **10. Data Fetching**

*None*

## **11. State Management**

### **Local State**

*None*

### **Derived State**

*None*

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Component mounted | Immediate redirect to `/forms` |

## **13. User Actions**

### **UI Interactions**

*None*

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Auto redirect | Mount | `/forms` |

### **Data Mutations**

*None*

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

*None - redirect only*

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side redirect
* **Memoisation strategy:** None needed
* **Parallel vs sequential fetching:** None
* **Known constraints:** Brief flash before redirect

## **17. Accessibility Considerations**

* **Keyboard navigation:** N/A
* **Focus management:** N/A
* **Screen reader expectations:** N/A
* **Landmark roles:** N/A

## **18. Storybook & Testing Strategy**

### **Storybook**

*Not applicable*

### **Testing**

* **Unit test focus:** Redirect behavior
* **Integration test focus:** N/A
* **E2E test focus:** Redirect completes successfully

## **19. Non-Goals / Out of Scope**

* Any UI rendering
* Form builder functionality (see `/form-builder/new` and `/form-builder/[id]`)

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/forms` | Redirect destination |

## **21. Open Questions / Notes**

* Consider removing this route if not needed
* Could potentially show a loading state during redirect

### **Redirect Implementation**

```typescript
useEffect(() => {
  router.replace('/forms');
}, [router]);
```
