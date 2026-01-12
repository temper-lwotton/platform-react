# **Component Specification: Toolbar**

## **1. Component Name**

**`Toolbar`**

## **2. Description**

The rich text formatting toolbar for the Lexical editor with feature toggles and mode-based layouts.

* Provides buttons for text formatting, block types, lists, and insertions
* Syncs button states with current selection formatting
* Supports simple and advanced layout modes
* Includes dialogs for link and code block insertion

## **3. Location**

```
src/components/ui/Lexical/components/Toolbar.tsx
```

## **4. Component Type**

**Feature** – Manages formatting state and dispatches Lexical commands.

## **5. Props Interface**

```typescript
interface ToolbarProps {
  disabled?: boolean;
  features: EditorFeatures;
  mode: EditorMode;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `disabled` | `boolean` | No | - | Disables all toolbar buttons |
| `features` | `EditorFeatures` | Yes | - | Which features to show |
| `mode` | `EditorMode` | Yes | - | Layout mode (affects styling) |

## **7. Data Requirements**

### **External Data Sources**

* Editor context via `useLexicalComposerContext`
* Features configuration passed from parent

### **EditorFeatures Type**

```typescript
// From @/lib/lexical-config
interface EditorFeatures {
  undo?: boolean;
  redo?: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  headings?: boolean;
  bulletList?: boolean;
  numberedList?: boolean;
  quote?: boolean;
  codeBlock?: boolean;
  links?: boolean;
  images?: boolean;
  tables?: boolean;
}
```

### **EditorMode Type**

```typescript
type EditorMode = 'simple' | 'standard' | 'advanced';
```

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `isBold` | `boolean` | `false` | Bold format active at cursor |
| `isItalic` | `boolean` | `false` | Italic format active |
| `isUnderline` | `boolean` | `false` | Underline format active |
| `isStrikethrough` | `boolean` | `false` | Strikethrough format active |
| `isCode` | `boolean` | `false` | Inline code format active |
| `blockType` | `string` | `'paragraph'` | Current block type |
| `linkDialogOpen` | `boolean` | `false` | Link dialog visibility |
| `codeBlockDialogOpen` | `boolean` | `false` | Code block dialog visibility |
| `selectedText` | `string` | `''` | Text selected for link creation |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `disabled === true` | All buttons disabled | No interactions |
| `mode === 'simple'` | Compact layout | `.toolbarCompact` class |
| `mode === 'advanced'` | Full layout + badge | "Advanced" badge visible |
| `isBold === true` | Bold button active | `.active` class |
| `blockType === 'h1'` | Heading 1 selected in dropdown | Block selector reflects state |
| `blockType === 'ul'` | Bullet list button active | Toggle state |
| `features.bold === false` | Bold button hidden | Conditional render |
| `linkDialogOpen === true` | Link insert dialog shown | Modal overlay |

## **10. Dependencies**

### **Lexical**

* `useLexicalComposerContext` – Editor access
* `FORMAT_TEXT_COMMAND` – Text formatting
* `UNDO_COMMAND`, `REDO_COMMAND` – History
* `INSERT_ORDERED_LIST_COMMAND`, `INSERT_UNORDERED_LIST_COMMAND` – Lists
* `TOGGLE_LINK_COMMAND` – Links
* `$createHeadingNode`, `$createQuoteNode`, `$createCodeNode` – Block creation
* `$setBlocksType` – Block type changes

### **Icons (lucide-react)**

* `Bold`, `Italic`, `Underline`, `Strikethrough`, `Code2`
* `List`, `ListOrdered`, `Quote`
* `Undo`, `Redo`
* `Link2`, `Image`, `Table`

### **Child Components**

* `LinkInsertDialog` – Link creation dialog
* `CodeBlockInsertDialog` – Code block creation dialog

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `formatHeading(size)` | Select heading in dropdown | Creates heading node |
| `formatParagraph()` | Select paragraph | Converts to paragraph |
| `formatQuote()` | Click quote button | Creates quote block |
| `formatBulletList()` | Click bullet list | Toggles unordered list |
| `formatNumberedList()` | Click numbered list | Toggles ordered list |
| `handleLinkButtonClick()` | Click link button | Opens link dialog |
| `handleLinkInsert()` | Submit link dialog | Inserts link |
| `handleCodeBlockInsert()` | Submit code dialog | Inserts code block |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `../Lexical.module.scss`

### **CSS Classes**

* `.toolbar` – Main toolbar container
* `.toolbarCompact` – Compact mode modifier
* `.toolbarButton` – Individual buttons
* `.toolbarButton.active` – Active format state
* `.toolbarDivider` – Vertical divider
* `.toolbarGroup` – Button group wrapper
* `.toolbarSelect` – Block type dropdown
* `.toolbarModeBadge` – "Advanced" mode badge

### **Visual States**

* **Default Button**: Standard appearance
* **Active Button**: Highlighted background (`.active`)
* **Disabled Button**: Greyed out, no pointer events
* **Compact Mode**: Tighter spacing

## **13. Accessibility Requirements**

* **Keyboard**: All buttons focusable, keyboard shortcuts shown in titles
* **ARIA**: `aria-label` on all buttons with descriptive names
* **Focus**: Visible focus indicators on buttons
* **Screen Reader**: Button labels describe action

### **Improvements Needed**

* Add `aria-pressed` for toggle buttons
* Group buttons with `role="toolbar"`
* Add `aria-label` to button groups
* Announce state changes

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Editor context missing | Would throw | Must be inside LexicalComposer |
| Command fails | Silent failure | Editor state unchanged |
| Selection invalid | Commands no-op | Button clicks ignored |

## **15. Performance & Lifecycle Notes**

### **Update Listener**

```typescript
useEffect(() => {
  return mergeRegister(
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    })
  );
}, [editor, updateToolbar]);
```

* Runs `updateToolbar` on every editor state change
* Reads current selection to update button states
* Uses `mergeRegister` for cleanup

## **16. Usage Examples**

### **Basic Usage (Internal)**

```tsx
// Inside LexicalEditor
<Toolbar
  disabled={disabled}
  features={editorConfig.features}
  mode={mode}
/>
```

### **Custom Features**

```tsx
<Toolbar
  features={{
    bold: true,
    italic: true,
    links: true,
    // Other features disabled
  }}
  mode="simple"
/>
```

## **17. Features Summary**

### **History Controls**

* Undo (Ctrl+Z)
* Redo (Ctrl+Y)

### **Block Type Selector**

* Paragraph
* Heading 1, 2, 3
* Quote (if enabled)

### **Text Formatting**

* Bold (Ctrl+B)
* Italic (Ctrl+I)
* Underline (Ctrl+U)
* Strikethrough
* Inline Code

### **Lists**

* Bullet list (toggle)
* Numbered list (toggle)

### **Block Elements**

* Quote block
* Code block (with language dialog)

### **Insert Elements**

* Links (with dialog)
* Images (placeholder)
* Tables (placeholder)

### **Mode Badge**

* Shows "Advanced" in advanced mode

## **18. Testing Considerations**

### **Unit Tests**

* Buttons render based on features config
* Click button dispatches correct command
* Button states sync with selection
* Dialogs open/close correctly
* Disabled state prevents interaction

### **Mocking**

* `useLexicalComposerContext` with mock editor
* Lexical commands
* Dialog components

### **Edge Cases**

* All features disabled
* Mode transitions
* Rapid button clicks
* Selection across multiple blocks

## **19. Out of Scope / Non-Goals**

* **Image upload**: Button exists but not connected
* **Table creation**: Button exists but not implemented
* **Custom shortcuts**: Uses Lexical defaults
* **Toolbar position**: Fixed at top (no floating)

## **20. Related Components & System Context**

### **Parent Component**

* `LexicalEditor` – Provides context and config

### **Child Components**

* `LinkInsertDialog` – Link insertion modal
* `CodeBlockInsertDialog` – Code block modal

### **Lexical Integration**

* Uses `useLexicalComposerContext` for editor access
* Dispatches Lexical commands for formatting

## **21. Open Questions / Notes**

* Image upload integration needed
* Table support needs implementation
* Consider floating toolbar for selection
* May want customizable keyboard shortcuts

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | All features enabled | Full features | Base state |
| `Simple` | Compact mode | `mode: 'simple'` | Compact layout |
| `Advanced` | Advanced mode | `mode: 'advanced'` | Shows badge |
| `MinimalFeatures` | Only bold/italic | Limited features | Minimal toolbar |
| `Disabled` | All disabled | `disabled: true` | Greyed out |
| `BoldActive` | Bold format active | `isBold: true` | Active state |
| `InList` | Inside bullet list | `blockType: 'ul'` | List button active |
| `LinkDialogOpen` | Link dialog shown | `linkDialogOpen: true` | Modal visible |

### **Controls (Args) Required**

* `disabled` (boolean) – controllable
* `mode` (select) – simple/standard/advanced
* `features` (object) – feature toggles

### **Mocking Requirements**

* **Lexical context**: Mock editor with commands
* **Selection state**: Control format states via decorator

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify all buttons have accessible names
* Check keyboard navigation
* Verify focus indicators visible

### **Interaction Tests**

* Click formatting buttons
* Open block type dropdown
* Open link dialog
* Submit link form
* Toggle list buttons
