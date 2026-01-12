# **Component Specification: StatusUpdateWidget**

## **1. Component Name**

**`StatusUpdateWidget`**

## **2. Description**

A rich status update composer for sharing what you're working on.

* Supports text input with character limit
* Provides emoji selection via picker
* Allows media attachments (images, videos)
* Supports link previews
* Enables space targeting for posts

## **3. Location**

```
src/components/ui/StatusUpdateWidget/StatusUpdateWidget.tsx
```

## **4. Component Type**

**Feature** – Manages complex form state, queries, and mutations for status creation.

## **5. Props Interface**

```typescript
// No props - self-contained widget
```

## **6. Props**

*No props – component is self-contained and fetches data internally.*

## **7. Data Requirements**

### **Current User Query**

```typescript
// From fetchCurrentUser
interface CurrentUser {
  id: string;
  email: string;
  profile: {
    fullName?: string;
    firstName?: string;
    photo?: string;
  };
  adminSpaces: Space[];
  memberSpaces: Space[];
}
```

### **Helper Types**

```typescript
// From @/lib/status-updates
interface QuickTemplate {
  id: string;
  label: string;
  emoji: string;
  placeholder: string;
}

interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'link';
  url: string;
  thumbnail?: string;
  caption?: string;
  title?: string;
  description?: string;
}
```

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `isExpanded` | `boolean` | `false` | Show expanded input |
| `statusText` | `string` | `''` | Status message content |
| `selectedEmoji` | `string` | `''` | Chosen emoji |
| `selectedTemplate` | `QuickTemplate \| null` | `null` | Active template |
| `selectedSpaceId` | `string` | `''` | Target space for post |
| `showEmojiPicker` | `boolean` | `false` | Emoji popover state |
| `mediaAttachments` | `MediaAttachment[]` | `[]` | Attached media |
| `linkUrl` | `string` | `''` | Link input value |
| `showLinkInput` | `boolean` | `false` | Link input visibility |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `isExpanded === false` | Collapsed placeholder | Click to expand |
| `isExpanded === true` | Full composer | All options visible |
| No user | Nothing (`null`) | Unauthenticated |
| Template selected | Pre-filled placeholder | Template emoji shown |
| `statusText.length > 280` | Error state | Over limit |
| `mediaAttachments.length > 0` | Media preview grid | With remove buttons |
| `showLinkInput === true` | Link input field | URL entry |
| `canPost === true` | Share button enabled | All required fields |
| `canPost === false` | Share button disabled | Missing fields |

## **10. Dependencies**

### **Hooks**

* `useQuery` – Fetch current user

### **Child Components**

* `Icon` – Action icons
* `Textarea` – Status input
* `Input` – Link input
* `Button` – Actions
* `Select` – Space selector
* `Popover` – Emoji picker
* `Avatar` – User avatar

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `handleFocus` | Click placeholder | Expand input |
| `handleTemplateSelect` | Click template | Apply template emoji and placeholder |
| `handleEmojiSelect` | Click emoji | Set selected emoji |
| `handleFileUpload` | Select files | Add media attachments |
| `handleAddLink` | Submit link | Add link attachment with preview |
| `handleRemoveMedia` | Click remove | Remove attachment from list |
| `handlePost` | Click share | Submit status update |
| `handleCancel` | Click cancel | Reset form and collapse |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `StatusUpdateWidget.module.scss`

### **CSS Classes**

* `.widget` – Main container
* `.collapsed` – Collapsed state
* `.expanded` – Expanded state
* `.header` – Avatar and input area
* `.avatar` – User avatar
* `.placeholder` – Collapsed placeholder text
* `.textarea` – Status input
* `.charCount` – Character counter
* `.charCount--error` – Over limit
* `.templates` – Quick template buttons
* `.template` – Individual template button
* `.template--active` – Selected template
* `.toolbar` – Action buttons row
* `.toolbarButton` – Individual action
* `.mediaGrid` – Attachment preview grid
* `.mediaItem` – Individual attachment
* `.removeButton` – Remove attachment button
* `.linkInput` – Link URL input
* `.footer` – Space selector and submit
* `.spaceSelect` – Space dropdown
* `.submitButton` – Share button

### **Layout**

* Header with avatar and input
* Templates row (when expanded)
* Media previews (when attached)
* Toolbar with actions
* Footer with space selector and submit

## **13. Accessibility Requirements**

* **Keyboard**: All controls keyboard accessible
* **ARIA**: Emoji picker with proper roles
* **Screen Reader**: Announce character count
* **Focus**: Clear focus management

### **Improvements Needed**

* Add `aria-live` for character count updates
* Add `aria-describedby` for validation errors
* Announce media attachment additions

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| User query fails | Show nothing | Unauthenticated state |
| File upload fails | Error toast | Remove failed attachment |
| Link preview fails | Show URL only | Basic link attachment |
| Post fails | Error toast | Keep form state |
| Character limit exceeded | Red counter | Disable submit |

## **15. Performance & Lifecycle Notes**

### **Validation**

```typescript
const canPost =
  statusText.trim().length > 0 &&
  statusText.length <= 280 &&
  selectedSpaceId;
```

### **Quick Templates**

From `QUICK_TEMPLATES` constant in `@/lib/status-updates`:
* Working on...
* Celebrating...
* Looking for...
* Learning...
* Asking...

### **Space Options**

```typescript
const spaceOptions = [
  ...user.adminSpaces,
  ...user.memberSpaces,
].map(space => ({
  value: space.id,
  label: space.name,
}));
```

### **Form Reset**

```typescript
const handleCancel = () => {
  setStatusText('');
  setSelectedEmoji('');
  setSelectedTemplate(null);
  setMediaAttachments([]);
  setLinkUrl('');
  setShowLinkInput(false);
  setIsExpanded(false);
};
```

## **16. Usage Examples**

### **In Feed Page**

```tsx
import { StatusUpdateWidget } from '@/components/ui/StatusUpdateWidget';

<div className={styles.feedHeader}>
  <StatusUpdateWidget />
</div>
```

### **In Sidebar**

```tsx
<aside className={styles.sidebar}>
  <StatusUpdateWidget />
</aside>
```

## **17. Features Summary**

### **Composer Elements**

| Element | Purpose |
|---------|---------|
| Avatar | Shows current user photo |
| Placeholder | Personalized "What are you working on, {name}?" |
| Character counter | 280 character limit with visual feedback |
| Emoji picker | Common emoji grid in popover |
| Media upload | Image and video attachments |
| Link input | Add external links with preview |
| Space selector | Choose target space |
| Quick templates | Pre-defined status types |

### **Quick Template Structure**

| Template | Emoji | Placeholder |
|----------|-------|-------------|
| Working on | 💼 | What are you working on? |
| Celebrating | 🎉 | What are you celebrating? |
| Looking for | 🔍 | What are you looking for? |
| Learning | 📚 | What are you learning? |

### **Actions**

* Share → Submit status update
* Cancel → Reset and collapse
* Upload media → Open file picker
* Add link → Show link input
* Select emoji → Open emoji picker

## **18. Testing Considerations**

### **Unit Tests**

* Expands on focus/click
* Character count updates
* Character limit validation
* Template selection works
* Emoji selection works
* Media attachment add/remove
* Link attachment add/remove
* Space selection works
* Submit validation
* Form reset on cancel

### **Mocking**

* Current user query
* File upload API
* Link preview API
* Status post mutation

### **Edge Cases**

* No spaces available
* Exactly 280 characters
* Multiple media attachments
* Long link URLs
* Missing user profile photo
* Rapid form interactions

## **19. Out of Scope / Non-Goals**

* **Mentions**: Not in this widget
* **Hashtags**: Not supported
* **Scheduling**: Immediate post only
* **Drafts**: Not saved
* **Rich text**: Plain text only

## **20. Related Components & System Context**

### **Child Components**

* `Textarea`
* `Input`
* `Button`
* `Select`
* `Popover`
* `Avatar`
* `Icon`

### **Related**

* `StatusUpdateCard` – Display component for posted updates
* Feed page

### **API Functions**

* `fetchCurrentUser`
* `createStatusUpdate`
* `uploadMedia`
* `fetchLinkPreview`

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Collapsed` | Initial state | isExpanded: false | Placeholder shown |
| `Expanded` | Ready to type | isExpanded: true | Full composer |
| `WithTemplate` | Template selected | selectedTemplate set | Pre-filled |
| `WithMedia` | Has attachments | mediaAttachments: [...] | Preview grid |
| `WithLink` | Has link | Link attachment | Link preview |
| `AtLimit` | 280 characters | statusText.length: 280 | Limit shown |
| `OverLimit` | Too long | statusText.length: 300 | Error state |
| `ReadyToPost` | Valid form | All fields complete | Enabled submit |

### **Controls (Args) Required**

*None – uses internal state*

### **Mocking Requirements**

* **User query**: Mock current user data
* **File upload**: Mock upload responses
* **Link preview**: Mock preview data

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify textarea accessible
* Check emoji picker accessible
* Verify character count announced
* Check focus management

### **Interaction Tests**

* Click to expand
* Type status text
* Select template
* Pick emoji
* Upload media
* Add link
* Select space
* Submit status
* Cancel and reset
