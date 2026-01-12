# Component: BlockEmailEditor

## Description
Block-based drag-and-drop email content editor. Allows building emails using predefined blocks (heading, paragraph, button, image, divider, spacer) with real-time HTML preview.

## Location
`src/components/cms/broadcasts/BlockEmailEditor.tsx`

## Props Interface

```typescript
interface BlockEmailEditorProps {
  initialContent?: string;
  initialBlocks?: Block[] | null;
  onChange: (html: string) => void;
}
```

## Data Requirements

### Block Type
```typescript
type BlockType = 'heading' | 'paragraph' | 'button' | 'image' | 'divider' | 'spacer';

interface Block {
  id: string;
  type: BlockType;
  content: {
    text?: string;
    url?: string;
    alt?: string;
    level?: 'h1' | 'h2' | 'h3';
    buttonText?: string;
    buttonUrl?: string;
    height?: number;
  };
}
```

### Available Block Types
```typescript
const blockTypes = [
  { type: 'heading', label: 'Heading', icon: Type },
  { type: 'paragraph', label: 'Paragraph', icon: AlignLeft },
  { type: 'button', label: 'Button', icon: LinkIcon },
  { type: 'image', label: 'Image', icon: ImageIcon },
  { type: 'divider', label: 'Divider', icon: Minus },
  { type: 'spacer', label: 'Spacer', icon: Space },
];
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `blocks` | `Block[]` | Array of content blocks |
| `showBlockMenu` | `boolean` | Add block menu visibility |

## Dependencies

### Icons
- `lucide-react` - Plus, GripVertical, Trash2, Type, AlignLeft, Link, Image, Minus, Space, ChevronDown, MoveUp, MoveDown

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `addBlock` | Block type selection | Adds new block of selected type |
| `updateBlock` | Content change | Updates block content |
| `deleteBlock` | Delete button | Removes block |
| `moveBlock` | Move up/down buttons | Reorders blocks |
| `onChange` | Any block change | Outputs generated HTML |

## Styling
- **CSS Module**: `BlockEmailEditor.module.scss`

## Features
- Block type selector with icons
- Drag handle for reordering (visual only)
- Move up/down buttons
- Delete button per block
- Live preview panel
- HTML output generation
- Block-specific editors:
  - Heading: Level selector + text input
  - Paragraph: Textarea
  - Button: Text + URL inputs
  - Image: URL + alt text inputs
  - Divider: No configuration
  - Spacer: Height input (8-200px)

## Layout Structure

### Editor Area
- Block list with controls
- Add Block button with dropdown menu

### Preview Area
- "Live Preview" header
- Rendered HTML output

## HTML Generation
Converts blocks to inline-styled HTML for email compatibility:
- Headings with inline color/margin
- Paragraphs with line-height
- Buttons as table-based clickable elements
- Images with max-width and border-radius
- Dividers as styled hr elements
- Spacers as empty divs with height

## Related Components
- Parent: `EmailBuilder`, `BroadcastDesign`
