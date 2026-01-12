# **Route Specification: Updates New**

## **1. Route Path**

**`/updates/new`**

## **2. Description**

Update creation form for publishing organizational announcements.

* Space selection for targeting
* Priority and category configuration
* Rich text content with @mentions
* Optional expiry date

## **3. Source File**

```
src/app/(protected)/updates/new/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Rendering update creation form
* Providing space selection
* Handling priority and category settings
* Supporting @mentions in content
* Submitting update via API

### **This route does not:**

* Edit existing updates
* Delete updates
* Schedule updates for future publication
* Manage update notifications

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** Must be member/admin of at least one space

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `spaceId` | `string` | No | Pre-select space from URL |

* **Default behaviour:** No space pre-selected
* **Validation:** Invalid spaceId ignored

## **7. Layout & Structure**

### **Layout Overview**

* Single column form layout with container
* Header, form sections, action buttons

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Title and cancel link |
| Form Sections | Space, Title, Priority/Category, Expiry, Content |
| Actions | Cancel and Publish buttons |

## **8. Components Used**

### **Layout Components**

*None - form layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `LexicalEditor` | `@/components/ui/Lexical` | Rich text with @mentions |
| `Input` | `@/components/ui/primitives` | Text inputs |
| `Button` | `@/components/ui/primitives` | Form buttons |
| `Icon` | `@/components/ui/Icon` | Dropdown icons |
| `Link` | `next/link` | Cancel navigation |

### **Radix UI Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Select` | `@radix-ui/react-select` | Space, priority, category dropdowns |

## **9. Data Flow Overview**

1. Resolve current user and space memberships
2. Fetch full space details for accessible spaces
3. Initialize form state with defaults
4. User selects space → update mention users
5. User fills form fields
6. On submit: validate → create update → redirect

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['current-user']` | `fetchCurrentUser` | `User` | `isClient && !!currentUserId` |
| `['user-spaces', userSpaceIds]` | `Promise.all(getSpace)` | `Space[]` | `userSpaceIds.length > 0` |

### **Mutations**

| Mutation | Function | On Success |
|----------|----------|------------|
| `createMutation` | `createUpdate(payload)` | Invalidate feed, redirect |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `title` | `string` | Update title |
| `content` | `string` | Plain text content |
| `htmlContent` | `string` | HTML content with mentions |
| `selectedSpaceId` | `string` | Target space |
| `priority` | `'low' \| 'normal' \| 'high' \| 'urgent'` | Priority level |
| `category` | `'news' \| 'milestone' \| 'policy' \| 'announcement' \| 'other'` | Update category |
| `expiresAt` | `string` | Optional expiry date |
| `currentUserId` | `string \| null` | Current user |
| `isClient` | `boolean` | Hydration check |

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `mentionUsers` | `selectedSpace` | Space members for @mentions |
| `isFormValid` | `title, content, selectedSpaceId, currentUserId` | Enable submit button |

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Not authenticated | Returns null |
| Spaces loading | "Loading spaces..." in selector |
| No spaces | "No spaces available" in selector |
| Form loaded | Form fields with dropdowns |
| Form invalid | Publish button disabled |
| Form valid | Publish button enabled |
| Submitting | Button shows loading state |
| Success | Redirect to `/updates/[id]` |
| Error | Error message displayed |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Select space | Choose from dropdown | Update `selectedSpaceId`, refresh mention users |
| Enter title | Type in field | Update `title` |
| Set priority | Select from dropdown | Update `priority` |
| Set category | Select from dropdown | Update `category` |
| Set expiry | Pick date | Update `expiresAt` |
| Write content | Use rich text editor | Update content states |
| Use @mention | Type @ in editor | Show mention autocomplete |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Cancel | Click cancel link/button | `/feed` |
| View created | Successful submission | `/updates/[newId]` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Publish | Form submit | `createUpdate` | Redirect to `/updates/[id]` |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Not authenticated:** Returns null
* **Submitting:** Button shows loading state
* **Error:** Error message box displayed

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** useMemo for mention users
* **Parallel vs sequential fetching:** User then spaces
* **Known constraints:**
  * Must fetch all accessible spaces
  * Mentions limited to selected space members

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through form fields
* **Focus management:** Focus on first field
* **Screen reader expectations:** Labels associated, dropdown values announced
* **Landmark roles:** Form with proper structure

## **18. Storybook & Testing Strategy**

### **Storybook**

* Form in various states
* Dropdown components
* @mention autocomplete

### **Testing**

* **Unit test focus:** Form validation, mention user derivation
* **Integration test focus:** Form submission flow
* **E2E test focus:** Complete update creation journey

## **19. Non-Goals / Out of Scope**

* Update editing
* Update deletion
* Scheduled publishing
* Notification configuration
* File attachments

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/updates` | Updates listing |
| `/updates/[id]` | Created update destination |
| `/feed` | Cancel destination |

## **21. Open Questions / Notes**

* Consider adding update templates
* May need scheduled publishing
* Consider adding file attachments

### **Form Fields**

#### **Required Fields**

| Field | Type | Description |
|-------|------|-------------|
| Space | `select` | Target space for update |
| Title | `text` | Brief, clear title |
| Content | Rich text | Update body with @mentions |

#### **Optional Fields**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Priority | `select` | `normal` | Urgency level |
| Category | `select` | `announcement` | Update type |
| Expiry Date | `date` | - | When update expires |

### **Update Payload Structure**

```typescript
{
  title: string;
  htmlContent: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'news' | 'milestone' | 'policy' | 'announcement' | 'other';
  space: number;
  expiresAt?: string;
}
```
