# Lexical Editor Insert Features - Implementation Plan

## Overview

Implement Link, Image, Table, and Code Block insertion features for the Lexical editor using Radix UI primitives for dialogs and form controls.

---

## Architecture Overview

### Common Pattern

All insert features will follow this pattern:

```
User clicks toolbar button
  ↓
Radix Dialog opens
  ↓
User fills form with Radix components
  ↓
User confirms
  ↓
Lexical command dispatched
  ↓
Content inserted into editor
```

### Shared Components

- `@radix-ui/react-dialog` - Modal dialogs
- `@radix-ui/react-label` - Form labels
- `@radix-ui/react-tabs` - Tab navigation (for Image)
- `@radix-ui/react-select` - Dropdowns (for Table size, Code language)

---

## Feature 1: Link Insertion

### User Flow

1. User selects text or clicks Link button
2. Dialog opens with URL input
3. User enters URL and optional link text
4. User confirms
5. Link inserted/wrapped around selection

### UI Design

```
┌─────────────────────────────────────────┐
│ Insert Link                        [✕]  │
├─────────────────────────────────────────┤
│                                          │
│  Link Text                               │
│  [Hello World                       ]    │
│                                          │
│  URL                                     │
│  [https://example.com               ]    │
│                                          │
│  ☐ Open in new tab                      │
│                                          │
│           [ Cancel ]  [ Insert Link ]   │
└─────────────────────────────────────────┘
```

### Implementation

**Component: `LinkInsertDialog.tsx`**

```typescript
interface LinkInsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (url: string, text: string, openInNewTab: boolean) => void;
  initialText?: string;  // Pre-filled from selection
}
```

**Radix Components:**
- `Dialog.Root` - Modal container
- `Dialog.Portal` - Portal for overlay
- `Dialog.Overlay` - Dark overlay
- `Dialog.Content` - Dialog content
- `Dialog.Title` - "Insert Link"
- `Dialog.Close` - Close button
- `Label` - Form labels
- `Checkbox` - "Open in new tab"

**Lexical Integration:**
```typescript
import { TOGGLE_LINK_COMMAND } from '@lexical/link';

editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
  url: 'https://example.com',
  target: openInNewTab ? '_blank' : undefined,
  rel: openInNewTab ? 'noopener noreferrer' : undefined,
});
```

**Validation:**
- URL must start with http://, https://, or /
- Show error message for invalid URLs
- Disable Insert button until valid

**Edge Cases:**
- If text is selected: Use selection as link text
- If no selection: Require link text input
- If clicking existing link: Populate form with current values (edit mode)

---

## Feature 2: Image Insertion

### User Flow

**Option A: Upload Image**
1. User clicks Image button
2. Dialog opens with upload area
3. User drags/drops or selects file
4. Image uploads to server
5. Image inserted with URL

**Option B: Insert from URL**
1. User clicks Image button
2. Dialog opens with tabs: Upload | URL
3. User switches to URL tab
4. User enters image URL and alt text
5. Image inserted

### UI Design

```
┌─────────────────────────────────────────┐
│ Insert Image                       [✕]  │
├─────────────────────────────────────────┤
│  [ Upload ] [ From URL ]                │
├─────────────────────────────────────────┤
│  Upload Tab:                             │
│  ┌───────────────────────────────────┐  │
│  │                                    │  │
│  │   📁 Drag and drop an image here  │  │
│  │      or click to browse           │  │
│  │                                    │  │
│  └───────────────────────────────────┘  │
│                                          │
│  Supports: JPG, PNG, GIF, WebP          │
│  Max size: 5MB                           │
│                                          │
│           [ Cancel ]  [ Insert Image ]  │
└─────────────────────────────────────────┘

From URL Tab:
┌─────────────────────────────────────────┐
│  Image URL                               │
│  [https://example.com/image.jpg     ]   │
│                                          │
│  Alt Text (for accessibility)           │
│  [Description of image              ]   │
│                                          │
│  Preview:                                │
│  [IMAGE PREVIEW]                         │
│                                          │
│           [ Cancel ]  [ Insert Image ]  │
└─────────────────────────────────────────┘
```

### Implementation

**Component: `ImageInsertDialog.tsx`**

```typescript
interface ImageInsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (url: string, altText: string) => void;
}
```

**Radix Components:**
- `Dialog.Root`, `Dialog.Portal`, `Dialog.Overlay`, `Dialog.Content`
- `Tabs.Root` - Tab container
- `Tabs.List` - Tab buttons
- `Tabs.Trigger` - Upload / From URL tabs
- `Tabs.Content` - Tab panels
- `Label` - Form labels

**File Upload:**
```typescript
// Upload to your backend
const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/upload/image', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return data.url; // Return uploaded image URL
};
```

**Lexical Integration:**
```typescript
// Custom Image Node (needs to be created)
import { $createImageNode } from './nodes/ImageNode';

editor.update(() => {
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
    const imageNode = $createImageNode({
      src: url,
      altText: altText,
    });
    selection.insertNodes([imageNode]);
  }
});
```

**Validation:**
- URL must end with image extension or load successfully
- Alt text required for accessibility
- File size validation (5MB max)
- File type validation (jpg, png, gif, webp)

**Custom Node Required:**
```typescript
// src/lib/lexical/nodes/ImageNode.ts
export class ImageNode extends DecoratorNode<ReactNode> {
  __src: string;
  __altText: string;
  __width?: number;
  __height?: number;
}
```

---

## Feature 3: Table Insertion

### User Flow

1. User clicks Table button
2. Dialog opens with size selector
3. User selects rows and columns (visual picker or inputs)
4. User confirms
5. Table inserted at cursor

### UI Design

```
┌─────────────────────────────────────────┐
│ Insert Table                       [✕]  │
├─────────────────────────────────────────┤
│                                          │
│  Table Size                              │
│                                          │
│  Rows                                    │
│  [ 3 ▼ ]                                │
│                                          │
│  Columns                                 │
│  [ 4 ▼ ]                                │
│                                          │
│  OR                                      │
│                                          │
│  Quick Select:                           │
│  ┌─┬─┬─┬─┬─┬─┐                          │
│  ├─┼─┼─┼─┼─┼─┤                          │
│  ├─┼─┼─┼─┼─┼─┤                          │
│  ├─┼─┼─┼─┼─┼─┤  ← Hover to select       │
│  ├─┼─┼─┼─┼─┼─┤    3 rows × 4 columns    │
│  ├─┼─┼─┼─┼─┼─┤                          │
│  └─┴─┴─┴─┴─┴─┘                          │
│                                          │
│  ☑ Include header row                   │
│                                          │
│           [ Cancel ]  [ Insert Table ]  │
└─────────────────────────────────────────┘
```

### Implementation

**Component: `TableInsertDialog.tsx`**

```typescript
interface TableInsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (rows: number, columns: number, includeHeader: boolean) => void;
}
```

**Radix Components:**
- `Dialog.Root`, `Dialog.Portal`, `Dialog.Overlay`, `Dialog.Content`
- `Select.Root` - Row/column count selects
- `Select.Trigger`, `Select.Content`, `Select.Item`
- `Checkbox` - "Include header row"
- `Label` - Form labels

**Visual Grid Picker:**
```typescript
// Custom component (not Radix)
function TableSizePicker({ onSelect }: { onSelect: (rows: number, cols: number) => void }) {
  const [hoveredCell, setHoveredCell] = useState({ row: 0, col: 0 });

  return (
    <div className="table-picker">
      {Array.from({ length: 6 }).map((_, row) => (
        <div key={row} className="table-picker-row">
          {Array.from({ length: 6 }).map((_, col) => (
            <div
              key={col}
              className={`table-picker-cell ${
                row <= hoveredCell.row && col <= hoveredCell.col ? 'active' : ''
              }`}
              onMouseEnter={() => setHoveredCell({ row, col })}
              onClick={() => onSelect(row + 1, col + 1)}
            />
          ))}
        </div>
      ))}
      <div className="table-picker-label">
        {hoveredCell.row + 1} rows × {hoveredCell.col + 1} columns
      </div>
    </div>
  );
}
```

**Lexical Integration:**
```typescript
import { INSERT_TABLE_COMMAND } from '@lexical/table';

editor.dispatchCommand(INSERT_TABLE_COMMAND, {
  rows: 3,
  columns: 4,
  includeHeaders: true,
});
```

**Table Plugin Required:**
```typescript
// In LexicalEditor.tsx
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';

// Add to editor:
<TablePlugin />
```

**Validation:**
- Min: 1 row, 1 column
- Max: 20 rows, 10 columns
- Default: 3 rows × 3 columns

---

## Feature 4: Code Block Insertion

### User Flow

1. User clicks Code Block button
2. Dialog opens with language selector
3. User optionally selects language for syntax highlighting
4. User confirms
5. Code block inserted, cursor inside

### UI Design

```
┌─────────────────────────────────────────┐
│ Insert Code Block                  [✕]  │
├─────────────────────────────────────────┤
│                                          │
│  Language (optional)                     │
│  [ JavaScript ▼                     ]   │
│                                          │
│  Common languages:                       │
│  [ JavaScript ] [ TypeScript ] [ Python ]│
│  [ HTML ]      [ CSS ]        [ JSON ]  │
│  [ Bash ]      [ SQL ]        [ Go ]    │
│                                          │
│  Or select from dropdown for more...    │
│                                          │
│           [ Cancel ]  [ Insert Code ]   │
└─────────────────────────────────────────┘
```

### Implementation

**Component: `CodeBlockInsertDialog.tsx`**

```typescript
interface CodeBlockInsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (language?: string) => void;
}
```

**Radix Components:**
- `Dialog.Root`, `Dialog.Portal`, `Dialog.Overlay`, `Dialog.Content`
- `Select.Root` - Language selector
- `Select.Trigger`, `Select.Content`, `Select.Item`
- `Label` - Form labels

**Language Selection:**
```typescript
const POPULAR_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'bash', label: 'Bash' },
  { value: 'sql', label: 'SQL' },
  { value: 'go', label: 'Go' },
];

const ALL_LANGUAGES = [
  ...POPULAR_LANGUAGES,
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  // ... more
];
```

**Lexical Integration:**
```typescript
import { $createCodeNode } from '@lexical/code';
import { $createParagraphNode } from 'lexical';

editor.update(() => {
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
    const codeNode = $createCodeNode(language);
    selection.insertNodes([codeNode]);

    // Focus inside the code block
    codeNode.select();
  }
});
```

**Alternative - Direct Insert:**

User might want to insert without dialog:
```typescript
// Quick insert (no dialog)
const insertCodeBlock = (language?: string) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createCodeNode(language));
    }
  });
};
```

**Validation:**
- Language is optional
- Default to plain text if no language selected
- Validate language exists in supported list

---

## Shared Implementation Details

### File Structure

```
src/
├── components/
│   └── ui/
│       ├── LexicalEditor.tsx
│       ├── LexicalToolbar.tsx
│       └── lexical/
│           ├── dialogs/
│           │   ├── LinkInsertDialog.tsx
│           │   ├── ImageInsertDialog.tsx
│           │   ├── TableInsertDialog.tsx
│           │   └── CodeBlockInsertDialog.tsx
│           ├── nodes/
│           │   └── ImageNode.ts
│           └── plugins/
│               └── InsertPlugins.tsx
├── lib/
│   └── lexical/
│       ├── commands.ts
│       └── utils.ts
└── app/
    └── api/
        └── upload/
            └── image/
                └── route.ts
```

### State Management in Toolbar

```typescript
// In LexicalToolbar.tsx
const [linkDialogOpen, setLinkDialogOpen] = useState(false);
const [imageDialogOpen, setImageDialogOpen] = useState(false);
const [tableDialogOpen, setTableDialogOpen] = useState(false);
const [codeDialogOpen, setCodeDialogOpen] = useState(false);
const [selectedText, setSelectedText] = useState('');

// Get selected text for link insertion
useEffect(() => {
  return editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setSelectedText(selection.getTextContent());
      }
    });
  });
}, [editor]);
```

### Toolbar Button Updates

```typescript
// Link button
<button
  type="button"
  disabled={disabled}
  onClick={() => setLinkDialogOpen(true)}
  className="lexical-toolbar-button"
  aria-label="Insert link"
  title="Insert link"
>
  🔗
</button>

<LinkInsertDialog
  open={linkDialogOpen}
  onOpenChange={setLinkDialogOpen}
  onInsert={(url, text, openInNewTab) => {
    insertLink(editor, url, text, openInNewTab);
    setLinkDialogOpen(false);
  }}
  initialText={selectedText}
/>
```

---

## Styling

### Dialog Styles

```css
/* Dialog overlay */
.dialog-overlay {
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  inset: 0;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

/* Dialog content */
.dialog-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 500px;
  max-height: 85vh;
  padding: 24px;
  z-index: 1001;
  animation: slideUp 0.2s ease;
}

/* Dialog title */
.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

/* Form field */
.dialog-field {
  margin-bottom: 1rem;
}

.dialog-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
}

.dialog-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
}

.dialog-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Dialog actions */
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.dialog-button {
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dialog-button-cancel {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
}

.dialog-button-cancel:hover {
  background: #f9fafb;
}

.dialog-button-primary {
  background: #3b82f6;
  border: 1px solid #3b82f6;
  color: white;
}

.dialog-button-primary:hover {
  background: #2563eb;
}

.dialog-button-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Table Picker Styles

```css
.table-picker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
}

.table-picker-row {
  display: flex;
  gap: 4px;
}

.table-picker-cell {
  width: 30px;
  height: 30px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.table-picker-cell:hover,
.table-picker-cell.active {
  background: #3b82f6;
  border-color: #3b82f6;
}

.table-picker-label {
  text-align: center;
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: 0.5rem;
}
```

---

## Implementation Priority

### Phase 1: Core Features (Week 1)
1. ✅ **Link Insertion** (Most common, easiest)
   - Dialog with URL and text inputs
   - Validation and error handling
   - Integration with Lexical TOGGLE_LINK_COMMAND

2. ✅ **Code Block Insertion**
   - Dialog with language selector
   - Quick popular languages
   - Direct block insertion

### Phase 2: Visual Features (Week 2)
3. ✅ **Table Insertion**
   - Visual grid picker
   - Row/column selects
   - Header row option
   - Table plugin integration

### Phase 3: Upload Features (Week 3)
4. ✅ **Image Insertion**
   - From URL (simpler)
   - File upload (complex)
   - Backend upload endpoint
   - Image preview
   - Custom ImageNode

---

## Testing Checklist

### For Each Feature

**Functionality:**
- [ ] Opens dialog on button click
- [ ] Form validation works
- [ ] Inserts content correctly
- [ ] Cursor positioned correctly after insert
- [ ] Works with and without text selection
- [ ] Undo/redo works
- [ ] HTML serialization correct

**UX:**
- [ ] ESC key closes dialog
- [ ] Enter key submits (when appropriate)
- [ ] Tab navigation works
- [ ] Focus management correct
- [ ] Loading states for async operations
- [ ] Error messages clear

**Accessibility:**
- [ ] Keyboard navigable
- [ ] Screen reader compatible
- [ ] ARIA labels present
- [ ] Focus trap in dialog
- [ ] Color contrast sufficient

**Edge Cases:**
- [ ] Empty editor
- [ ] End of document
- [ ] Inside list/quote/code
- [ ] Multiple selections
- [ ] Rapid button clicks

---

## Dependencies to Install

```bash
# Already installed:
# - @radix-ui/react-dialog
# - @radix-ui/react-label

# Need to install:
npm install @radix-ui/react-tabs        # For image dialog tabs
npm install @radix-ui/react-select      # For language/size selects
npm install @radix-ui/react-checkbox    # For checkboxes
npm install @lexical/table              # For table support (if not already)
```

---

## API Endpoint Needed

### Image Upload

```typescript
// src/app/api/upload/image/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('image') as File;

  // Validate file
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const fileType = file.type;
  if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(fileType)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 });
  }

  // Upload to storage (S3, Cloudinary, etc.)
  const url = await uploadToStorage(file);

  return NextResponse.json({ url });
}
```

---

*Document created: 2025*
*Status: Planning Phase*
