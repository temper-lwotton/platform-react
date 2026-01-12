# **Route Specification: Forms**

## **1. Route Path**

**`/forms`**

## **2. Description**

Forms management page displaying all forms created by the user.

* Search, sorting, and pagination controls
* CRUD operations (create, duplicate, delete)
* Grid display of form cards with metadata
* Access to drag-and-drop form builder

## **3. Source File**

```
src/app/(protected)/forms/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Listing all user-created forms
* Providing search and sorting functionality
* Handling pagination
* Supporting form deletion and duplication
* Navigating to form builder

### **This route does not:**

* Create or edit forms (see form-builder routes)
* Display form responses
* Manage form permissions
* Handle form submissions

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** Users only see their own forms

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `search` | `string` | No | Search query for filtering |
| `sort` | `string` | No | Sort field |
| `order` | `string` | No | Sort direction |
| `page` | `number` | No | Current page number |

* **Default behaviour:** Show all forms sorted by `updatedAt` descending
* **Validation:** Invalid params use defaults

## **7. Layout & Structure**

### **Layout Overview**

* Single column layout with container
* Header, controls, content grid, pagination

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Title, subtitle, "New Form" button |
| Controls | Search bar, sort buttons |
| Content Grid | Form cards with actions |
| Pagination | Page navigation controls |

## **8. Components Used**

### **Layout Components**

*None - container layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Icon` | `@/components/ui/Icon` | Layers icon for sections |
| `Link` | `next/link` | Navigation links |

### **Lucide Icons**

| Icon | Purpose |
|------|---------|
| `FileText` | Form icon, field count |
| `Plus` | Create button |
| `Trash2` | Delete action |
| `Copy` | Duplicate action |
| `Edit` | Edit action |
| `Search` | Search input |
| `Calendar` | Date sort and display |
| `MoreVertical` | Menu trigger |

## **9. Data Flow Overview**

1. Verify user authentication
2. Fetch forms with current filter/sort/page params
3. Display forms in grid with metadata
4. User interacts with search/sort → update params → refetch
5. User clicks card → navigate to editor
6. User uses menu → delete/duplicate → refetch

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['forms', params]` | `getForms(params)` | `{ data: Form[], meta: PaginationMeta }` | `isClient && !!currentUserId` |

### **Mutations**

| Mutation | Function | On Success |
|----------|----------|------------|
| `deleteMutation` | `deleteForm(id)` | Invalidate forms query |
| `duplicateMutation` | `duplicateForm(id, title)` | Invalidate, redirect to editor |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `currentUserId` | `string \| null` | Current user ID |
| `isClient` | `boolean` | Hydration check |
| `searchQuery` | `string` | Search input value |
| `sortBy` | `'createdAt' \| 'updatedAt' \| 'title'` | Sort field |
| `sortOrder` | `'asc' \| 'desc'` | Sort direction |
| `currentPage` | `number` | Current pagination page |
| `activeMenu` | `number \| null` | Which form's menu is open |

### **Query Parameters**

```typescript
{
  page: currentPage,
  limit: 20,
  sort: sortBy,
  order: sortOrder,
  search: searchQuery || undefined
}
```

### **Derived State**

*None*

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Not authenticated | Returns null |
| Loading | Spinner with "Loading forms..." |
| Error | "Failed to load forms. Please try again." |
| Data loaded | Grid of form cards |
| Empty (with search) | "No forms match your search. Try a different query." |
| Empty (no search) | "Get started by creating your first form" with create button |
| Menu open | Dropdown with Edit/Duplicate/Delete options |
| Delete confirm | Confirm dialog with form title |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Search forms | Type in search field | Update `searchQuery`, reset page |
| Sort by field | Click sort button | Update `sortBy` and `sortOrder` |
| Open menu | Click three-dot button | Set `activeMenu` to form ID |
| Close menu | Click backdrop | Set `activeMenu` to null |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| New form | Click "New Form" button | `/form-builder/new` |
| Edit form | Click card title or edit | `/form-builder/[id]` |
| Next page | Click next button | Updates `currentPage` |
| Previous page | Click previous button | Updates `currentPage` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Delete form | Confirm delete | `deleteForm(id)` | Refetch forms |
| Duplicate form | Click duplicate | `duplicateForm(id, title)` | Redirect to editor |

## **14. Infinite Scroll / Pagination**

* **Type:** Traditional pagination
* **Page size:** 20 forms per page
* **Controls:** Previous/Next buttons with page indicator

## **15. Error & Empty States**

* **Not authenticated:** Returns null
* **Loading:** Spinner with "Loading forms..."
* **Error:** "Failed to load forms. Please try again."
* **Empty (with search):** "No forms match your search. Try a different query."
* **Empty (no search):** "Get started by creating your first form" with create button

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** None needed
* **Parallel vs sequential fetching:** Single forms query
* **Known constraints:**
  * Limited to 20 forms per page
  * Search is client-triggered (not debounced in URL)

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through cards, buttons, and menus
* **Focus management:** Focus trap in dropdown menus
* **Screen reader expectations:** Form titles and actions announced
* **Landmark roles:** Main content area, card grid

## **18. Storybook & Testing Strategy**

### **Storybook**

* Form card variants
* Sort controls
* Pagination controls
* Empty states

### **Testing**

* **Unit test focus:** Sort logic, search filtering
* **Integration test focus:** Delete/duplicate flows
* **E2E test focus:** Complete form management journey

## **19. Non-Goals / Out of Scope**

* Form creation/editing (handled by form-builder)
* Form response viewing
* Form sharing/permissions
* Bulk operations

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/form-builder/new` | Create new form |
| `/form-builder/[id]` | Edit existing form |

## **21. Open Questions / Notes**

* Consider adding bulk delete functionality
* May need form templates feature
* Consider adding form analytics/response counts

### **Sort Options**

| Field | Label | Toggle Behavior |
|-------|-------|-----------------|
| `updatedAt` | Updated | Default, toggles asc/desc |
| `createdAt` | Created | Toggles asc/desc |
| `title` | Name | Toggles asc/desc |

### **Form Card Display**

Each card shows:
- Title (clickable link to editor)
- Description (if available)
- Field count with icon
- Section count with icon (if > 0)
- Last updated date (relative)
- Edit button
- Three-dot menu with Edit/Duplicate/Delete
