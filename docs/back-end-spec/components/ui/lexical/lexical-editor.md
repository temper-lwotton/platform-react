# **Component Specification: LexicalEditor**

## **1. Component Name**

**`LexicalEditor`**

## **2. Description**

A powerful rich text editor built on the Lexical framework with configurable features and modes.

* Provides WYSIWYG editing with a feature-based toolbar
* Supports @mentions with user autocomplete
* Offers multiple editor modes (simple, standard, advanced)
* Outputs both plain text and HTML content
* Used for posts, announcements, and other rich content creation

## **3. Location**

```
src/components/ui/Lexical/components/LexicalEditor.tsx
```

## **4. Component Type**

**Feature** – Orchestrates Lexical plugins and manages editor configuration based on mode.

## **5. Props Interface**

```typescript
interface LexicalEditorProps {
  value: string;
  onChange: (content: string, html: string) => void;
  mode?: EditorMode;
  placeholder?: string;
  disabled?: boolean;
  users?: MentionUser[];
  onMention?: (user: MentionUser) => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | Yes | - | Current content (used for clearing) |
| `onChange` | `(content: string, html: string) => void` | Yes | - | Callback with plain text and HTML |
| `mode` | `EditorMode` | No | `'standard'` | Editor configuration mode |
| `placeholder` | `string` | No | From config | Placeholder text |
| `disabled` | `boolean` | No | - | Disable editing |
| `users` | `MentionUser[]` | No | `[]` | Users for @mentions |
| `onMention` | `(user: MentionUser) => void` | No | - | Callback when user mentioned |

## **7. Data Requirements**

### **External Data Sources**

* Editor configuration from `getEditorConfig(mode)`
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

### **EditorMode Type**

```typescript
// From @/lib/lexical-config
type EditorMode = 'simple' | 'standard' | 'advanced';
```

## **8. Internal State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| - | - | No React state – uses Lexical internal state |

### **Custom Plugins (Internal)**

| Plugin | Purpose |
|--------|---------|
| `UpdatePlugin` | Clears editor when `value` becomes empty |
| `CodeHighlightPluginWrapper` | Registers syntax highlighting |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Default | Toolbar + editable content area | Mode-based features |
| `disabled === true` | Read-only editor | `editable: false` in config |
| `mode === 'simple'` | Compact toolbar | Fewer features enabled |
| `mode === 'standard'` | Standard toolbar | Default feature set |
| `mode === 'advanced'` | Full toolbar + badge | All features enabled |
| `users.length > 0` | MentionsPlugin active | @mention autocomplete available |
| `value` cleared | Editor content cleared | UpdatePlugin triggers |
| `features.codeBlock` | Code highlighting active | CodeHighlightPluginWrapper |

## **10. Dependencies**

### **Lexical Core**

* `LexicalComposer` – Editor context provider
* `RichTextPlugin` – Rich text editing
* `ContentEditable` – Editable content area
* `HistoryPlugin` – Undo/redo support
* `OnChangePlugin` – Content change detection
* `LexicalErrorBoundary` – Error handling

### **Lexical Plugins**

* `ListPlugin` – Ordered/unordered lists
* `LinkPlugin` – Hyperlink support
* `registerCodeHighlighting` – Syntax highlighting

### **Custom Components**

* `Toolbar` – Formatting toolbar
* `MentionsPlugin` – @mention functionality
* `MentionNode` – Mention node type

### **Utilities**

* `$generateHtmlFromNodes` – HTML generation
* `getEditorConfig` – Mode-based configuration

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onChange` | Any content change | Returns `(textContent, html)` |
| `onMention` | User selects mention | Returns mentioned `MentionUser` |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `../Lexical.module.scss`

### **Theme Configuration**

The editor uses a custom Lexical theme mapping CSS module classes:

```typescript
const theme = {
  paragraph: styles.paragraph,
  heading: { h1: styles.h1, h2: styles.h2, ... },
  list: { ul: styles.ul, ol: styles.ol, listitem: styles.listitem },
  quote: styles.quote,
  code: styles.code,
  link: styles.link,
  text: { bold, italic, underline, strikethrough, code }
};
```

### **CSS Classes**

* `.editorContainer` – Main wrapper with mode class
* `.editorInner` – Content area wrapper
* `.contentEditable` – Editable div
* `.placeholder` – Placeholder text overlay

## **13. Accessibility Requirements**

* **Keyboard**: Standard editor shortcuts (Ctrl+B, Ctrl+I, etc.)
* **ARIA**: `aria-placeholder` on content editable
* **Focus**: Standard focus management via Lexical
* **Screen Reader**: Content accessible, toolbar buttons labeled

### **Improvements Needed**

* Add `role="textbox"` and `aria-multiline="true"`
* Announce formatting changes to screen readers
* Improve toolbar keyboard navigation

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Lexical error | `onError` logs to console | Editor may be in inconsistent state |
| Invalid HTML content | Lexical parser handles | May lose formatting |
| Missing nodes | Warning logged | Content renders without that node type |

## **15. Performance & Lifecycle Notes**

* **Re-renders**: Lexical manages internal state; React re-renders minimal
* **HTML Generation**: Runs on every change via `$generateHtmlFromNodes`
* **Plugins**: Only mounted plugins run; conditional based on features
* **Memory**: MentionNode instances cleaned up by Lexical

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { LexicalEditor } from '@/components/ui/Lexical';

<LexicalEditor
  value={content}
  onChange={(text, html) => setContent(html)}
  placeholder="Write your post..."
/>
```

### **With Mentions**

```tsx
<LexicalEditor
  value={content}
  onChange={(text, html) => setContent(html)}
  mode="advanced"
  users={spaceMembers}
  onMention={(user) => trackMention(user.id)}
/>
```

### **Disabled State**

```tsx
<LexicalEditor
  value={content}
  onChange={() => {}}
  disabled={!canEdit}
/>
```

## **17. Features Summary**

* Mode-based feature configuration (simple/standard/advanced)
* Rich text formatting (bold, italic, underline, strikethrough, code)
* Block types (paragraphs, headings H1-H6, quotes, code blocks)
* Lists (ordered and unordered with nesting)
* Links with insert dialog
* @mentions with user autocomplete
* Code syntax highlighting
* History (undo/redo)
* Dual output (plain text + HTML)

## **18. Testing Considerations**

### **Unit Tests**

* Editor renders with initial content
* onChange fires with text and HTML
* Toolbar buttons apply formatting
* Mentions plugin shows dropdown
* Disabled state prevents editing
* Mode changes feature availability

### **Mocking**

* `getEditorConfig` for mode testing
* Lexical internals (may need special setup)
* MentionsPlugin user data

### **Edge Cases**

* Empty content
* Very long content
* Content with all node types
* Rapid typing
* Paste from external sources

## **19. Out of Scope / Non-Goals**

* **Collaborative editing**: No real-time sync
* **Image upload**: Image plugin not connected to upload service
* **Auto-save**: Parent must handle saving
* **Draft recovery**: No localStorage persistence
* **Spell check**: Uses browser native

## **20. Related Components & System Context**

### **Child Components**

* `Toolbar` – Formatting toolbar
* `MentionsPlugin` – @mention autocomplete
* `LinkInsertDialog` – Link creation (via Toolbar)
* `CodeBlockInsertDialog` – Code block creation (via Toolbar)

### **Nodes**

* `MentionNode` – Custom mention node

### **Used By**

* `PostEditor` – Post creation
* Announcement creation
* Any rich content input

### **Related**

* `LexicalCommentEditor` – Lightweight version
* `RichContent` – Read-only display

## **21. Open Questions / Notes**

* Consider adding image upload integration
* May want collaborative editing in future
* Could add auto-save to localStorage
* Consider adding word count display

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Standard mode editor | `mode: 'standard'` | Base state |
| `Simple` | Simple mode | `mode: 'simple'` | Compact toolbar |
| `Advanced` | Advanced mode | `mode: 'advanced'` | Full features + badge |
| `WithMentions` | Mentions enabled | `users: [...]` | Show @mention |
| `Disabled` | Read-only | `disabled: true` | No editing |
| `WithPlaceholder` | Custom placeholder | `placeholder: "..."` | Placeholder visible |
| `WithContent` | Pre-filled content | Rich HTML content | Shows formatting |

### **Controls (Args) Required**

* `mode` (select) – simple/standard/advanced
* `placeholder` (string) – controllable
* `disabled` (boolean) – controllable
* `users` (MentionUser[]) – array control

### **Mocking Requirements**

* **Editor config**: Mock `getEditorConfig` per mode
* **Users data**: Realistic MentionUser objects
* **Actions**: Log onChange, onMention

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify toolbar buttons accessible
* Check keyboard shortcuts work
* Verify content area has proper role

### **Interaction Tests**

* Type text and verify onChange
* Apply bold formatting
* Insert a mention
* Use undo/redo
* Insert a link via dialog
