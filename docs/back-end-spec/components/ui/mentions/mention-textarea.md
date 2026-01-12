# **Component Specification: MentionTextarea**

## **1. Component Name**

**`MentionTextarea`**

## **2. Description**

A textarea component with built-in @mention functionality.

* Detects "@" trigger and shows user dropdown
* Filters users based on typed query
* Inserts formatted mentions into text
* Supports keyboard and mouse selection
* Provides imperative methods via ref

## **3. Location**

```
src/components/ui/MentionTextarea/MentionTextarea.tsx
```

## **4. Component Type**

**Feature** – Manages mention detection and integrates with useMentions hook.

## **5. Props Interface**

```typescript
interface MentionTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  users: MentionUser[];
  onMention?: (user: MentionUser) => void;
}

interface MentionTextareaHandle {
  focus: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `users` | `MentionUser[]` | Yes | - | Available users for mentions |
| `onMention` | `(user) => void` | No | - | Callback when user is mentioned |
| ...textareaProps | `TextareaHTMLAttributes` | No | - | Standard textarea props |

## **7. Data Requirements**

### **MentionUser Type**

```typescript
// From @/hooks/useMentions
interface MentionUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}
```

## **8. Internal State**

Managed by `useMentions` hook:

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `mentionState.isOpen` | `boolean` | `false` | Dropdown visibility |
| `mentionState.filteredUsers` | `MentionUser[]` | `[]` | Matching users |
| `mentionState.selectedIndex` | `number` | `0` | Highlighted user |
| `mentionState.query` | `string` | `''` | Text after "@" |
| `mentionState.position` | `{ top, left }` | `{ 0, 0 }` | Caret position |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Default | Standard textarea | No dropdown |
| "@" typed | Dropdown opens | All users shown |
| "@jo" typed | Filtered dropdown | Matching users |
| Arrow keys pressed | Selection moves | Keyboard navigation |
| Enter pressed | Mention inserted | Dropdown closes |
| Click user | Mention inserted | Dropdown closes |
| Escape pressed | Dropdown closes | No insertion |
| Outside click | Dropdown closes | Focus blur handling |

## **10. Dependencies**

### **Hooks**

* `useMentions` – Mention detection and state management

### **Child Components**

* `MentionDropdown` – User selection dropdown (styles reused)

### **Radix UI**

* `@radix-ui/react-popover` – Dropdown positioning
* `@radix-ui/react-avatar` – User avatars

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onChange` | Text input | Forwarded after mention processing |
| `onKeyDown` | Key press | Forwarded if not mention-handled |
| `onMention` | User selected | Fires with selected user |
| Internal `handleInputChange` | Text change | Processes "@" detection |
| Internal `handleMentionKeyDown` | Key press | Handles arrows, Enter, Escape |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `MentionTextarea.module.scss`
* **Dropdown Styles**: Uses `MentionDropdown.module.scss`

### **CSS Classes**

* `.container` – Wrapper element
* `.textarea` – The textarea element
* `.dropdown` – Mention dropdown (from MentionDropdown)

## **13. Accessibility Requirements**

* **Keyboard**: Full keyboard navigation for mentions
* **ARIA**: Textarea should have `aria-expanded` when dropdown open
* **Screen Reader**: Announce dropdown opening and options

### **Improvements Needed**

* Add `aria-expanded` to textarea
* Add `aria-haspopup="listbox"`
* Add `aria-controls` linking to dropdown
* Announce filtered result count

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty users array | No dropdown shown | Standard textarea |
| Invalid user selection | Callback not fired | Silent skip |
| Focus lost during selection | Blur prevented | Selection completes |

## **15. Performance & Lifecycle Notes**

### **Ref Methods**

```typescript
// Exposed via forwardRef + useImperativeHandle
ref.current.focus()      // Focus the textarea
ref.current.getValue()   // Get current value
ref.current.setValue(v)  // Set value programmatically
```

### **Event Handling**

```typescript
// Combined handlers merge useMentions logic with standard events
const handleChange = (e) => {
  handleInputChange(e);  // Process for mentions
  onChange?.(e);         // Forward to parent
};

const handleKeyDownCombined = (e) => {
  const handled = handleMentionKeyDown(e);  // Try mention handling
  if (!handled) {
    onKeyDown?.(e);      // Forward to parent if not handled
  }
};
```

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { MentionTextarea, MentionTextareaHandle } from '@/components/ui/MentionTextarea';

<MentionTextarea
  users={allUsers}
  onMention={(user) => console.log('Mentioned:', user.name)}
  placeholder="Type @ to mention someone..."
  rows={4}
/>
```

### **With Ref Control**

```tsx
const textareaRef = useRef<MentionTextareaHandle>(null);

<MentionTextarea
  ref={textareaRef}
  users={users}
  onMention={handleMention}
/>

// Programmatic control
textareaRef.current?.focus();
const value = textareaRef.current?.getValue();
textareaRef.current?.setValue('Hello @John');
```

### **Form Integration**

```tsx
<form onSubmit={handleSubmit}>
  <MentionTextarea
    users={teamMembers}
    name="message"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onMention={(user) => addMentionedUser(user.id)}
    required
  />
  <Button type="submit">Send</Button>
</form>
```

## **17. Features Summary**

### **@ Detection**

* Opens dropdown when "@" typed
* Tracks position for dropdown placement

### **Filtering**

* Filters as user types after "@"
* Matches on name and email

### **Keyboard Navigation**

* ↑↓ to navigate options
* Enter to select
* Escape to dismiss

### **Mouse Selection**

* Click user to select
* Blur prevention during selection

### **Mention Insertion**

* Replaces @query with formatted mention
* Fires onMention callback

## **18. Testing Considerations**

### **Unit Tests**

* Dropdown appears on "@" trigger
* Filtering works correctly
* Keyboard navigation updates selection
* Enter key inserts mention
* Escape key closes dropdown
* Click inserts mention
* onMention callback fires
* Ref methods work correctly

### **Mocking**

* `useMentions` hook
* Textarea events
* Ref methods

### **Edge Cases**

* Empty users array
* Single user
* Very long user list
* "@" at start/middle/end
* Multiple "@" symbols
* Special characters in names

## **19. Out of Scope / Non-Goals**

* **Rich text**: Plain textarea only
* **Mention styling**: Text-only representation
* **User fetching**: Users passed via props
* **Debounced filtering**: Filters synchronously
* **Remote search**: No API calls

## **20. Related Components & System Context**

### **Hook**

* `useMentions` – Core mention logic

### **Child Components**

* `MentionDropdown` – Selection dropdown

### **Related**

* `LexicalEditor` – Rich text with mentions
* `LexicalCommentEditor` – Comments with mentions
* `MentionHoverCard` – Display mentions

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Empty textarea | Users provided | Base state |
| `WithPlaceholder` | Custom placeholder | Placeholder text | Guidance shown |
| `DropdownOpen` | Mention active | "@" typed | Dropdown visible |
| `Filtered` | Query typed | "@jo" typed | Filtered results |
| `LargeUserList` | Many users | 50+ users | Scroll behaviour |
| `Disabled` | Read-only | `disabled: true` | No interaction |

### **Controls (Args) Required**

* `users` (array) – controllable
* `placeholder` (string) – controllable
* `rows` (number) – controllable
* `disabled` (boolean) – controllable

### **Mocking Requirements**

* **User data**: Realistic MentionUser objects
* **useMentions hook**: For controlled states

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify keyboard navigation
* Check dropdown accessibility
* Verify focus management

### **Interaction Tests**

* Type "@" to open dropdown
* Type query to filter
* Navigate with arrows
* Select with Enter
* Select with click
* Dismiss with Escape
