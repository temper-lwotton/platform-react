# **Component Specification: MessageInput**

## **1. Component Name**

**`MessageInput`**

## **2. Description**

A chat message input component with text area, attachment support, and typing indicator integration.

* Provides textarea for message composition
* Supports file attachments with preview
* Integrates with typing indicator API
* Handles Enter-to-send with Shift+Enter for newlines
* Used in conversation pages and message threads

## **3. Location**

```
src/components/ui/MessageInput/MessageInput.tsx
```

## **4. Component Type**

**Feature** – Manages message content, attachments, and typing indicator state.

## **5. Props Interface**

```typescript
interface MessageInputProps {
  onSend: (content: string, attachments?: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
  conversationId?: string;
  currentUserId?: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onSend` | `(content, attachments?) => void` | Yes | - | Send message callback |
| `disabled` | `boolean` | No | `false` | Disable input |
| `placeholder` | `string` | No | `'Type a message...'` | Input placeholder |
| `conversationId` | `string` | No | - | For typing indicator API |
| `currentUserId` | `string` | No | - | For typing indicator API |

## **7. Data Requirements**

### **API Integration**

* Typing status API: `POST /api/conversations/typing/{conversationId}`
  * Request: `{ userId: number, isTyping: boolean }`

### **Dependencies**

* `getToken` from `@/lib/auth` for authenticated requests

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `content` | `string` | `''` | Message text content |
| `attachments` | `File[]` | `[]` | Attached files |
| `isTyping` | `boolean` | `false` | Typing indicator sent |
| `typingTimeout` | `NodeJS.Timeout` | `null` | Auto-stop typing timer |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Default | Empty textarea with buttons | Ready state |
| `content.length > 0` | Send button enabled | Can send |
| `content.length === 0` | Send button disabled | Cannot send |
| `attachments.length > 0` | Attachment preview shown | Files queued |
| `disabled === true` | Input and buttons disabled | No interaction |
| User typing | Typing API called | After 100ms |
| User stops typing 3s | Typing API cleared | Auto-stop |
| Enter pressed | Message sent | Content cleared |
| Shift+Enter pressed | Newline added | Multi-line support |

## **10. Dependencies**

### **Child Components**

* `Textarea` – Message text input
* `Button` – Send and attach buttons
* `Icon` – Button icons

### **API Functions**

* `getToken` – From `@/lib/auth`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `handleSend` | Click send or Enter | Send message |
| `handleInputChange` | Text change | Update content, send typing status |
| `handleKeyDown` | Key press | Enter sends, Shift+Enter for newline |
| `handleFileSelect` | Select files | Add attachments |
| `removeAttachment` | Click remove | Remove specific attachment |
| `onSend` | Send triggered | Fires callback with content and files |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `MessageInput.module.scss`

### **CSS Classes**

* `.container` – Main wrapper
* `.attachmentPreview` – Queued files display
* `.inputRow` – Textarea and buttons row
* `.textarea` – Message input
* `.actions` – Button group
* `.attachButton` – File picker trigger
* `.sendButton` – Send button

### **Layout**

* Attachments preview (above)
* Input row: Attach | Textarea | Send

## **13. Accessibility Requirements**

* **Keyboard**: Enter to send, Shift+Enter for newline
* **ARIA**: Textarea should have `aria-label`
* **Screen Reader**: Announce send success

### **Improvements Needed**

* Add `aria-label` to textarea
* Add `aria-disabled` to disabled buttons
* Announce attachment added/removed

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Typing API fails | Silent failure | Continue without indicator |
| Empty content on send | Prevented | Button disabled |
| File too large | Error shown | File rejected |
| Send fails | Error toast | Content preserved |

## **15. Performance & Lifecycle Notes**

### **Typing Indicator Flow**

1. User types → Send `isTyping: true`
2. User stops for 3s → Send `isTyping: false`
3. User sends message → Clear typing, send message

### **Debouncing**

* Typing status debounced to prevent API spam
* 3-second timeout for auto-stop

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { MessageInput } from '@/components/ui/MessageInput';

<MessageInput
  onSend={(content, attachments) => sendMessage(content, attachments)}
  placeholder="Write your message..."
/>
```

### **With Typing Indicator**

```tsx
<MessageInput
  onSend={handleSend}
  conversationId={conversationId}
  currentUserId={userId}
  disabled={isSending}
/>
```

## **17. Features Summary**

### **Message Composition**

* Textarea for content
* Enter to send (Shift+Enter for newline)
* Disabled state support

### **Attachments**

* File picker button
* Attachment preview with remove buttons
* Multiple file support

### **Typing Indicator Integration**

* Sends typing status on input change
* Auto-stops typing after 3s of inactivity
* Clears typing on message send

### **Send Action**

* Send button (disabled when empty)
* Keyboard shortcut (Enter)

## **18. Testing Considerations**

### **Unit Tests**

* Send button disabled when empty
* Enter key sends message
* Shift+Enter adds newline
* Typing indicator sent on input
* Typing clears after timeout
* Attachments can be added/removed
* onSend receives content and files

### **Mocking**

* Typing API calls
* File picker
* getToken function

### **Edge Cases**

* Empty message
* Very long message
* Multiple attachments
* Rapid typing
* Disabled state

## **19. Out of Scope / Non-Goals**

* **Rich text**: Plain text only
* **Emoji picker**: Not built-in
* **@ mentions**: Not in this component
* **Message editing**: Create only
* **Draft persistence**: No auto-save

## **20. Related Components & System Context**

### **Parent Components**

* Messages page
* `MessageThread`

### **Child Components**

* `Textarea`
* `Button`

### **Used With**

* `TypingIndicator` – Displays typing status
* `MessageThread` – Shows messages

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Empty input | Default props | Base state |
| `WithContent` | Has text | Content entered | Can send |
| `WithAttachments` | Files attached | Attachments array | Preview shown |
| `Disabled` | Input disabled | `disabled: true` | No interaction |
| `Sending` | Send in progress | Simulated loading | Disabled state |

### **Controls (Args) Required**

* `placeholder` (string) – controllable
* `disabled` (boolean) – controllable

### **Mocking Requirements**

* **Typing API**: Simulated responses
* **File picker**: Mock file selection

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify keyboard shortcuts work
* Check focus management
* Verify disabled state

### **Interaction Tests**

* Type message
* Press Enter to send
* Press Shift+Enter for newline
* Attach file
* Remove attachment
