# **Route Specification: New Event**

## **1. Route Path**

**`/spaces/[id]/events/new`**

## **2. Description**

Event creation form for creating a new event within a specific space.

* Pre-selects space based on URL parameter
* Provides comprehensive form for event details
* Supports image upload with preview
* Handles online and physical event locations

## **3. Source File**

```
src/app/(protected)/spaces/[id]/events/new/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Rendering the event creation form
* Handling form state and validation
* Managing image upload and preview
* Submitting event creation via API
* Redirecting to created event on success

### **This route does not:**

* Edit existing events
* Delete events
* Manage event RSVPs
* Handle recurring events

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Space member or admin
* **Permission Rules:** Must have permission to create events in the space

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | The unique identifier of the space to create event in |

* **Default behaviour:** Space pre-selected from URL
* **Validation:** Invalid id handled gracefully

## **7. Layout & Structure**

### **Layout Overview**

* Single column form layout
* Back link, form sections, action buttons

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Back Link | Return to space events |
| Form Sections | Title, Photo, Date/Time, Location, Description |
| Actions | Cancel and Submit buttons |

## **8. Components Used**

### **Layout Components**

*None - form layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `LexicalEditor` | `@/components/ui/Lexical` | Rich text editor for description |
| `Link` | `next/link` | Back navigation |

### **Radix UI Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Label.Root` | `@radix-ui/react-label` | Form field labels |
| `Checkbox.Root` | `@radix-ui/react-checkbox` | Online event toggle |
| `Separator.Root` | `@radix-ui/react-separator` | Section dividers |

## **9. Data Flow Overview**

1. Extract space ID from URL parameters
2. Initialize form state with defaults (tomorrow 10am, +2 hours)
3. Resolve current user ID
4. User fills form fields
5. On submit: validate → create event via API → redirect to event
6. On error: display error message

## **10. Data Fetching**

### **Mutations**

| Mutation | Function | On Success |
|----------|----------|------------|
| `createMutation` | `createEventWithPhoto(payload, photoFile)` | Invalidate queries, redirect to event |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `isClient` | `boolean` | Hydration check |
| `currentUserId` | `string \| null` | Current user ID |
| `title` | `string` | Event title |
| `content` | `string` | Plain text description |
| `htmlContent` | `string` | HTML description |
| `startDateTime` | `string` | Start datetime-local value |
| `endDateTime` | `string` | End datetime-local value |
| `isOnline` | `boolean` | Online event flag |
| `location` | `string` | Physical location |
| `link` | `string` | Event URL |
| `photoFile` | `File \| null` | Uploaded photo file |
| `photoPreview` | `string \| null` | Photo preview data URL |

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `isFormValid` | All form fields | Enable/disable submit button |

### **Refs**

*None*

### **Default Values**

* Start time: Tomorrow at 10:00 AM
* End time: Start time + 2 hours

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Pre-hydration | Returns null |
| Form loaded | Form fields with defaults |
| Form invalid | Submit button disabled |
| Form valid | Submit button enabled |
| Submitting | Form disabled, "Creating Event..." button |
| Submission success | Redirect to `/events/[id]` |
| Submission error | Error message box displayed |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Enter title | Type in title field | Update `title` state |
| Upload photo | Select file | Store file, show preview |
| Remove photo | Click "Remove Photo" | Clear file and preview |
| Set start date/time | Use datetime picker | Update `startDateTime` |
| Set end date/time | Use datetime picker | Update `endDateTime` |
| Toggle online | Check/uncheck checkbox | Update `isOnline` |
| Enter location | Type in location field | Update `location` |
| Enter link | Type in link field | Update `link` |
| Write description | Use rich text editor | Update content states |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Back | Click back link | `/spaces/[id]/events` |
| Cancel | Click cancel button | `/spaces/[id]/events` |
| View created | Successful submission | `/events/[newId]` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Create event | Form submit | `createEventWithPhoto` | Redirect to `/events/[id]` |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Pre-hydration:** Returns null
* **Submitting:** Form disabled, button shows "Creating Event..."
* **Error:** Error message box with specific or generic error

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR) with hydration
* **Memoisation strategy:** Form validation calculated on state change
* **Parallel vs sequential fetching:** N/A
* **Known constraints:**
  * Image upload may take time for large files
  * Client-side validation only

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through form fields
* **Focus management:** Focus on first field on load, focus on error
* **Screen reader expectations:** Labels associated with inputs, errors announced
* **Landmark roles:** Form with proper structure

## **18. Storybook & Testing Strategy**

### **Storybook**

* Form in various states (empty, filled, error)
* Photo upload with preview
* Online vs physical event modes

### **Testing**

* **Unit test focus:** Form validation logic
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
| `/spaces/[id]/events` | Events listing (cancel destination) |
| `/events/[id]` | Created event destination |

## **21. Open Questions / Notes**

* Consider adding event templates
* May need recurring event support
* Consider draft/save functionality
* Image cropping/editing could improve UX

### **Form Fields**

#### **Required Fields**

| Field | Type | Validation |
|-------|------|------------|
| Title | `text` | Non-empty after trim |
| Description | Rich text | Has HTML or plain text content |
| Start Date/Time | `datetime-local` | Required |
| End Date/Time | `datetime-local` | Required, >= start time |
| Location | `text` | Required if not online event |

#### **Optional Fields**

| Field | Type | Description |
|-------|------|-------------|
| Event Photo | `file` | Image upload with preview |
| Event Link | `url` | Meeting/registration URL |

### **Form Validation**

```typescript
const isFormValid =
  title.trim() &&
  (htmlContent || content.trim()) &&
  startDateTime &&
  endDateTime &&
  currentUserId &&
  (!isOnline ? location.trim() : true);
```

### **Event Payload Structure**

```typescript
{
  title: string;
  space: number;
  startDateTime: string; // ISO 8601
  endDateTime: string;   // ISO 8601
  htmlContent: string;
  jsonContent: object;
  isOnline: boolean;
  location?: string;     // Only if not online
  link?: string;         // Optional
}
```
