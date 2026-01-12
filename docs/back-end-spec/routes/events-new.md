# **Route Specification: Events New**

## **1. Route Path**

**`/events/new`**

## **2. Description**

Global event creation form for creating events in any accessible space.

* Requires space selection (unlike space-specific creation)
* Provides comprehensive event form
* Supports image upload with preview
* Handles online and physical locations

## **3. Source File**

```
src/app/(protected)/events/new/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Rendering the event creation form
* Providing space selection from user's accessible spaces
* Handling form state and validation
* Managing image upload and preview
* Submitting event creation via API

### **This route does not:**

* Edit existing events
* Delete events
* Manage event RSVPs
* Handle recurring events

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

* Single column form layout
* Back link, form sections, action buttons

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Back Link | Return to events listing |
| Form Sections | Space selection, Title, Photo, Date/Time, Location, Description |
| Actions | Cancel and Submit buttons |

## **8. Components Used**

### **Layout Components**

*None - form layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `LexicalEditor` | `@/components/ui/Lexical` | Rich text editor for description |
| `Input` | `@/components/ui/primitives` | Form input fields |
| `Checkbox` | `@/components/ui/primitives` | Online event toggle |
| `Button` | `@/components/ui/primitives` | Form buttons |
| `Link` | `next/link` | Back navigation |

### **Radix UI Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Popover` | `@radix-ui/react-popover` | Space selector dropdown |
| `RadioGroup` | `@radix-ui/react-radio-group` | Space selection radio buttons |
| `Separator.Root` | `@radix-ui/react-separator` | Section dividers |

## **9. Data Flow Overview**

1. Resolve current user and their space memberships
2. Fetch full space details for accessible spaces
3. Initialize form state with defaults
4. User selects space from dropdown
5. User fills remaining form fields
6. On submit: validate → create event → redirect

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['current-user']` | `fetchCurrentUser` | `User` | `isClient && !!currentUserId` |
| `['user-spaces', userSpaceIds]` | `Promise.all(getSpace)` | `Space[]` | `userSpaceIds.length > 0` |

### **Mutations**

| Mutation | Function | On Success |
|----------|----------|------------|
| `createMutation` | `createEventWithPhoto(payload, photoFile)` | Invalidate queries, redirect to event |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `title` | `string` | Event title |
| `content` | `string` | Plain text description |
| `htmlContent` | `string` | HTML description |
| `startDateTime` | `string` | Start datetime-local |
| `endDateTime` | `string` | End datetime-local |
| `isOnline` | `boolean` | Online event flag |
| `location` | `string` | Physical location |
| `link` | `string` | Event URL |
| `selectedSpaceId` | `string` | Selected space ID |
| `photoFile` | `File \| null` | Uploaded photo file |
| `photoPreview` | `string \| null` | Photo preview URL |
| `currentUserId` | `string \| null` | Current user ID |
| `isClient` | `boolean` | Hydration check |
| `isPopoverOpen` | `boolean` | Space selector open state |

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `isFormValid` | All form fields | Enable/disable submit button |
| `userSpaceIds` | `userData` | Extract space IDs from user |

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Pre-hydration | Returns null |
| Spaces loading | "Loading spaces..." in selector |
| No spaces | "No spaces available" in selector |
| Form loaded | Form fields with space selector |
| Form invalid | Submit button disabled |
| Form valid | Submit button enabled |
| Submitting | Form disabled, loading button |
| Submission success | Redirect to `/events/[id]` |
| Submission error | Error message box displayed |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Open space selector | Click selector button | Show popover |
| Select space | Click space radio | Update `selectedSpaceId`, close popover |
| Enter title | Type in title field | Update `title` |
| Upload photo | Select file | Store file, show preview |
| Remove photo | Click remove button | Clear file and preview |
| Set date/time | Use datetime pickers | Update date states |
| Toggle online | Check/uncheck checkbox | Update `isOnline` |
| Enter location | Type in field | Update `location` |
| Enter link | Type in field | Update `link` |
| Write description | Use rich text editor | Update content states |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Back | Click back link | `/events` |
| Cancel | Click cancel button | `/events` |
| View created | Successful submission | `/events/[newId]` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Create event | Form submit | `createEventWithPhoto` | Redirect to `/events/[id]` |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Pre-hydration:** Returns null
* **Spaces loading:** "Loading spaces..." in selector
* **No spaces:** "No spaces available" in selector
* **Submitting:** Button shows loading state
* **Error:** Error message box displayed

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR) with hydration
* **Memoisation strategy:** Form validation on state change
* **Parallel vs sequential fetching:** User fetch, then spaces fetch
* **Known constraints:**
  * Image upload may take time
  * Must fetch all accessible spaces

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through form fields
* **Focus management:** Focus on space selector first, then fields
* **Screen reader expectations:** Labels associated, errors announced
* **Landmark roles:** Form with proper structure

## **18. Storybook & Testing Strategy**

### **Storybook**

* Space selector component states
* Form in various states
* Photo upload with preview

### **Testing**

* **Unit test focus:** Form validation, space selection
* **Integration test focus:** Form submission flow
* **E2E test focus:** Complete event creation journey

## **19. Non-Goals / Out of Scope**

* Event editing
* Event deletion
* Recurring events
* RSVP configuration
* Event templates

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/events` | Events listing (cancel destination) |
| `/events/[id]` | Created event destination |
| `/spaces/[id]/events/new` | Space-specific event creation |

## **21. Open Questions / Notes**

* Consider pre-selecting space if only one available
* May need event templates feature
* Consider draft/save functionality

### **Space Selector**

Custom dropdown showing:
- Space title
- Space subtitle (if available)
- Member count
- Radio button for selection

### **Form Validation**

```typescript
const isFormValid =
  title.trim() &&
  (htmlContent || content.trim()) &&
  startDateTime &&
  endDateTime &&
  selectedSpaceId &&     // Must select a space
  currentUserId &&
  (!isOnline ? location.trim() : true);
```
