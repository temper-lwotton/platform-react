# **Component Specification: LexicalCommentEditor**

## **1. Component Name**

**`LexicalCommentEditor`**

## **2. Description**

A lightweight Lexical editor optimized for comments and quick replies.

* Provides basic rich text editing without a toolbar
* Supports @mentions with user autocomplete
* Returns both plain text and HTML content
* Ideal for comment forms, reply inputs, and inline editing

## **3. Location**

```
src/components/ui/Lexical/components/LexicalCommentEditor.tsx
```

## **4. Component Type**

**Feature** – Simplified editor orchestrating minimal Lexical plugins.

## **5. Props Interface**

```typescript
interface LexicalCommentEditorProps {
  value?: string;
  onChange: (content: string, html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  users?: MentionUser[];
  onMention?: (user: MentionUser) => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | No | `''` | Current content (used for clearing) |
| `onChange` | `(content: string, html: string) => void` | Yes | - | Callback with plain text and HTML |
| `placeholder` | `string` | No | `'Write a comment...'` | Placeholder text |
| `disabled` | `boolean` | No | - | Disable editing |
| `autoFocus` | `boolean` | No | - | Focus on mount |
| `users` | `MentionUser[]` | No | `[]` | Users for @mentions |
| `onMention` | `(user: MentionUser) => void` | No | - | Callback when user mentioned |

## **7. Data Requirements**

### **External Data Sources**

* Users list for mentions passed via props

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

| State Variable | Type | Purpose |
|----------------|------|---------|
| - | - | No React state – uses Lexical internal state |

### **Custom Plugins (Internal)**

| Plugin | Purpose |
|--------|---------|
| `UpdatePlugin` | Clears editor when `value` becomes empty |
| `AutoFocusPlugin` | Focuses editor on mount when `autoFocus` is true |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Default | Editable content area only | No toolbar |
| `disabled === true` | Read-only editor | `editable: false` in config |
| `autoFocus === true` | Editor focused on mount | AutoFocusPlugin triggers |
| `users.length > 0` | MentionsPlugin active | @mention autocomplete |
| `value` cleared | Editor content cleared | UpdatePlugin triggers |
| Text typed | Placeholder hidden | Standard Lexical behaviour |

## **10. Dependencies**

### **Lexical Core**

* `LexicalComposer` – Editor context provider
* `RichTextPlugin` – Rich text editing
* `ContentEditable` – Editable content area
* `HistoryPlugin` – Undo/redo support
* `OnChangePlugin` – Content change detection
* `LexicalErrorBoundary` – Error handling

### **Custom Plugins**

* `MentionsPlugin` – @mention functionality
* `UpdatePlugin` – External value sync (internal)
* `AutoFocusPlugin` – Auto-focus handling (internal)

### **Nodes**

* `MentionNode` – @mention display

### **Utilities**

* `$generateHtmlFromNodes` – HTML generation
* `$getRoot` – Root node access

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onChange` | Any content change | Returns `(textContent, html)` |
| `onMention` | User selects mention | Returns mentioned `MentionUser` |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `../Lexical.module.scss`

### **Theme Configuration**

Minimal theme for comment editor:

```typescript
const theme = {
  paragraph: styles.commentParagraph,
  text: {
    bold: styles.textBold,
    italic: styles.textItalic,
    underline: styles.textUnderline,
    strikethrough: styles.textStrikethrough,
    code: styles.textCode,
  },
};
```

### **CSS Classes**

* `.editorContainer` – Main wrapper
* `.editorInner` – Content area wrapper
* `.contentEditable` – Editable div
* `.placeholder` – Placeholder text overlay
* `.commentParagraph` – Comment-specific paragraph styling

## **13. Accessibility Requirements**

* **Keyboard**: Standard text input, Tab works normally
* **ARIA**: `aria-placeholder` on content editable
* **Focus**: Auto-focus available via prop
* **Screen Reader**: Content accessible

### **Improvements Needed**

* Add `role="textbox"` and `aria-multiline="true"`
* Add `aria-label` describing the input purpose
* Consider `aria-describedby` for mention instructions

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Lexical error | `onError` logs to console | Editor may be in inconsistent state |
| Missing MentionUser | Mention dropdown empty | Graceful degradation |

## **15. Performance & Lifecycle Notes**

* **Minimal Plugins**: Fewer plugins than full editor
* **HTML Generation**: Runs on every change
* **Memory**: Lighter footprint than LexicalEditor
* **Focus**: Handled via custom AutoFocusPlugin

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { LexicalCommentEditor } from '@/components/ui/Lexical';

<LexicalCommentEditor
  value={commentContent}
  onChange={(text, html) => {
    setContent(html);
    setIsEmpty(!text.trim());
  }}
  placeholder="Write your reply..."
/>
```

### **With Mentions and Auto-focus**

```tsx
<LexicalCommentEditor
  value={content}
  onChange={(text, html) => setContent(html)}
  users={spaceMembers}
  onMention={(user) => notifyMention(user)}
  autoFocus
/>
```

### **In Comment Form**

```tsx
<form onSubmit={handleSubmit}>
  <LexicalCommentEditor
    value={comment}
    onChange={(text, html) => setComment(html)}
    disabled={isSubmitting}
    placeholder="Add a comment..."
  />
  <Button type="submit" disabled={!comment.trim()}>
    Post
  </Button>
</form>
```

## **17. Features Summary**

* Minimal UI with no toolbar
* Rich text output (HTML)
* @mentions with user autocomplete
* External value sync (clearing)
* Auto-focus support
* Disabled state
* Undo/redo via keyboard

## **18. Testing Considerations**

### **Unit Tests**

* Editor renders with placeholder
* onChange fires with text and HTML
* Auto-focus works when enabled
* Mentions plugin shows dropdown
* Disabled state prevents editing
* Value clearing works

### **Mocking**

* Lexical internals (may need special setup)
* MentionsPlugin user data

### **Edge Cases**

* Empty content
* Clear content after typing
* Rapid typing
* Multiple mentions in one comment

## **19. Out of Scope / Non-Goals**

* **Toolbar**: No formatting toolbar
* **Block types**: Only paragraphs
* **Lists/quotes**: Not supported
* **Links**: No link insertion UI
* **Code blocks**: Not supported

## **20. Related Components & System Context**

### **Related Components**

* `LexicalEditor` – Full-featured version
* `MentionsPlugin` – @mention functionality
* `MentionNode` – Mention node type

### **Used By**

* Comment forms
* Reply inputs
* Quick post inputs
* Discussion responses

### **Related Display**

* `RichContentWithMentions` – Displays content with hover cards

## **21. Open Questions / Notes**

* Consider adding basic formatting shortcuts (Ctrl+B, etc.)
* May want character limit enforcement
* Could add "send on Enter" behaviour

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Empty editor | Default props | Base state |
| `WithPlaceholder` | Custom placeholder | `placeholder: "..."` | Placeholder visible |
| `WithMentions` | Mentions enabled | `users: [...]` | Show @mention |
| `AutoFocused` | Focused on mount | `autoFocus: true` | Cursor in editor |
| `Disabled` | Read-only | `disabled: true` | No editing |
| `WithContent` | Pre-filled | Simulate typing | Shows text |

### **Controls (Args) Required**

* `placeholder` (string) – controllable
* `disabled` (boolean) – controllable
* `autoFocus` (boolean) – controllable
* `users` (MentionUser[]) – array control

### **Mocking Requirements**

* **Users data**: Realistic MentionUser objects
* **Actions**: Log onChange, onMention

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify content area is accessible
* Check focus management
* Verify placeholder is announced

### **Interaction Tests**

* Type text and verify onChange
* Insert a mention
* Clear content via value prop
* Test auto-focus behaviour
