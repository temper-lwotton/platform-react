# **Component Specification: SpaceChatInput**

## **1. Component Name**

**`SpaceChatInput`**

## **2. Description**

A message input component for space chat rooms that allows users to compose and share updates within a space.

* Provides a rich input experience with emoji selection, media attachments, and link sharing
* Enforces a 280-character limit with visual feedback
* Used as the primary posting mechanism in space chat pages

## **3. Location**

```
src/components/ui/SpaceChatInput/SpaceChatInput.tsx
```

## **4. Component Type**

**Feature** – Manages internal state for composing messages with attachments.

## **5. Props Interface**

```typescript
interface SpaceChatInputProps {
  spaceId: string;
  spaceTitle: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `spaceId` | `string` | Yes | - | ID of the space to post to |
| `spaceTitle` | `string` | Yes | - | Space name used in placeholder text |

## **7. Data Requirements**

### **External Data Sources**

None – component is self-contained for input state. Posting would integrate with space API.

### **MediaAttachment Type**

```typescript
// From @/lib/status-updates
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

| State Variable | Type | Purpose |
|----------------|------|---------|
| `statusText` | `string` | Current message content |
| `selectedEmoji` | `string` | Currently chosen emoji |
| `showEmojiPicker` | `boolean` | Controls emoji popover visibility |
| `mediaAttachments` | `MediaAttachment[]` | Array of attached media items |
| `linkUrl` | `string` | Current link input value |
| `showLinkInput` | `boolean` | Controls link input visibility |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Default state | Empty textarea with placeholder | Placeholder: "Share an update in {spaceTitle}..." |
| Text entered | Textarea with content + character counter | Counter shows remaining characters |
| Character limit exceeded | Counter in warning/error state | Prevents posting |
| `showEmojiPicker === true` | Emoji grid in popover | Popover positioned near emoji button |
| `showLinkInput === true` | Link URL input field visible | With add button |
| `mediaAttachments.length > 0` | Media preview section | Shows thumbnails with remove buttons |
| `canPost === true` | Post button enabled | Blue/active state |
| `canPost === false` | Post button disabled | Greyed out state |

## **10. Dependencies**

### **Child Components**

* `Icon` – Action icons (emoji, image, link, remove)
* `Textarea` – Message input field
* `Input` – Link URL input
* `Button` – Post and link add actions
* `Popover` – Emoji picker container

### **Utilities / Hooks**

* None currently – posting logic would use space API

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `handleEmojiSelect` | Click emoji in picker | Sets `selectedEmoji` state |
| `handleFileUpload` | Select files via input | Adds to `mediaAttachments` array |
| `handleAddLink` | Submit link form | Creates link attachment from URL |
| `handleRemoveMedia` | Click remove on attachment | Removes item from `mediaAttachments` |
| `handlePost` | Click post button | Submits message (when valid) |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `SpaceChatInput.module.scss`

### **Visual States**

* **Default**: Standard input appearance
* **Focus**: Textarea with focus ring
* **With Media**: Shows attachment preview section
* **Character Warning**: Counter turns warning colour near limit
* **Character Error**: Counter shows error when exceeded
* **Post Enabled**: Blue/primary post button
* **Post Disabled**: Greyed out post button

## **13. Accessibility Requirements**

* **Keyboard**: Tab through emoji button, file input, link button, post button
* **Focus**: Focus returns to textarea after emoji selection
* **Screen Reader**: Textarea has accessible label via placeholder; character count announced
* **ARIA**: Popover uses appropriate `aria-expanded` state

### **Improvements Needed**

* Add `aria-label` to icon-only buttons
* Announce character count changes to screen readers
* Add `aria-describedby` linking textarea to character counter

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Character limit exceeded | Post button disabled, counter shows error | User must reduce text |
| Invalid file type | File rejected from upload | Show error message |
| Link URL invalid | Link not added | Show validation error |
| Post submission fails | N/A (not yet implemented) | Would show error toast |

## **15. Performance & Lifecycle Notes**

* **Re-renders**: Component re-renders on each character typed
* **File Handling**: Files converted to preview URLs on upload
* **Cleanup**: Media preview URLs should be revoked on unmount

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { SpaceChatInput } from '@/components/ui/SpaceChatInput';

<SpaceChatInput
  spaceId="space-123"
  spaceTitle="Engineering Team"
/>
```

### **Within Space Chat Page**

```tsx
<div className={styles.chatPage}>
  <SpaceChatMessages messages={messages} />
  <SpaceChatInput
    spaceId={space.id}
    spaceTitle={space.name}
  />
</div>
```

## **17. Features Summary**

* Dynamic placeholder with space name
* 280 character limit with visual counter
* Emoji picker with common emoji grid
* File upload for images and videos
* Link attachments with preview
* Media preview with remove buttons
* Validation-gated post button

## **18. Testing Considerations**

### **Unit Tests**

* Character counter updates correctly
* Post button enables/disables based on validation
* Emoji selection updates state
* Media attachments add/remove correctly
* Link validation works

### **Mocking**

* File input change events
* Blob/URL.createObjectURL for media previews

### **Edge Cases**

* Exactly 280 characters (valid)
* 281 characters (invalid)
* Empty whitespace only (invalid)
* Multiple media attachments
* Mix of media types (image + video + link)

## **19. Out of Scope / Non-Goals**

* **Message persistence**: Posting to backend not yet implemented
* **@mentions**: No user mention autocomplete
* **Rich text**: Plain text only, no formatting
* **Drafts**: No auto-save of draft messages
* **File size limits**: Not currently enforced

## **20. Related Components & System Context**

### **Related Components**

* `StatusUpdateWidget` – Similar input for feed updates
* `MessageInput` – Direct message input variant
* `SpaceChatMembers` – Companion sidebar component

### **Parent Pages**

* Space chat page

### **Typical Usage Location**

* Bottom of space chat interface

## **21. Open Questions / Notes**

* Need to implement actual posting to backend API
* Consider adding @mention support
* File size and type validation needed
* Draft auto-save could improve UX

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Empty input ready for typing | Default props | Base state |
| `WithText` | Message being composed | `statusText: "Hello team!"` | Shows character count |
| `NearLimit` | Approaching character limit | `statusText: "..." (270+ chars)` | Warning state |
| `OverLimit` | Exceeded character limit | `statusText: "..." (281+ chars)` | Error state, disabled post |
| `WithEmoji` | Emoji picker open | `showEmojiPicker: true` | Popover visible |
| `WithMedia` | Media attachments added | `mediaAttachments: [...]` | Preview section visible |
| `WithLink` | Link input visible | `showLinkInput: true` | Link URL input shown |
| `ReadyToPost` | Valid content ready | Valid text, `canPost: true` | Enabled post button |

### **Controls (Args) Required**

* `spaceId` (string) – controllable
* `spaceTitle` (string) – controllable, affects placeholder

### **Mocking Requirements**

* **State simulation**: Initial values for internal state via decorators
* **File uploads**: Mock FileReader and URL.createObjectURL
* **Actions**: Log emoji selection, file upload, post submission

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify keyboard navigation through controls
* Check focus management in emoji popover

### **Interaction Tests**

* Type text and verify character counter
* Open emoji picker and select emoji
* Add and remove media attachment
* Verify post button state changes
