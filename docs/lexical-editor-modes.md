# Lexical Editor Modes

## Overview

The Lexical editor component supports three distinct modes, each optimized for different content creation scenarios. The editor dynamically adjusts its toolbar and available features based on the selected mode.

---

## Available Modes

### 1. Simple Mode (`mode="simple"`)

**Best for:** Quick comments, short discussions, replies

**Features:**
- ✅ Basic text formatting: Bold, Italic, Underline
- ✅ Lists: Bullet and Numbered
- ✅ Links: Auto-linking
- ✅ History: Undo/Redo
- ❌ No headings
- ❌ No quotes
- ❌ No code blocks
- ❌ No strikethrough

**Toolbar:**
```
[↶] [↷] | [B] [I] [U] | [• List] [1. List]
```

**Use Cases:**
- Comment sections
- Quick replies
- Short form discussions
- Chat messages

**Example:**
```tsx
<LexicalEditor
  value={content}
  onChange={handleChange}
  mode="simple"
  placeholder="Write a comment..."
/>
```

---

### 2. Standard Mode (`mode="standard"`) **[Default]**

**Best for:** Discussion posts, forum threads, medium-length content

**Features:**
- ✅ All text formatting: Bold, Italic, Underline, Strikethrough, Code
- ✅ Headings: H1, H2, H3
- ✅ Quotes: Block quotes
- ✅ Code blocks: Syntax highlighting
- ✅ Lists: Bullet and Numbered
- ✅ Links: Auto-linking
- ✅ History: Undo/Redo
- ❌ No tables
- ❌ No images
- ❌ No horizontal rules

**Toolbar:**
```
[↶] [↷] | [Paragraph ▼] | [B] [I] [U] [S] [</>] | [• List] [1. List]
```

**Use Cases:**
- Discussion posts (current implementation)
- Forum threads
- Blog comments with formatting
- Knowledge base articles (simple)

**Example:**
```tsx
<LexicalEditor
  value={content}
  onChange={handleChange}
  mode="standard"
  placeholder="Share your thoughts..."
/>
```

---

### 3. Advanced Mode (`mode="advanced"`)

**Best for:** Long-form articles, documentation, pages with rich content

**Features:**
- ✅ Everything in Standard mode
- ✅ Tables: Create and edit tables
- ✅ Images: Insert and position images (future)
- ✅ Horizontal rules: Visual separators
- ✅ Advanced formatting options
- 🏷️ Badge indicator: "ADVANCED" in toolbar

**Toolbar:**
```
[↶] [↷] | [Paragraph ▼] | [B] [I] [U] [S] [</>] | [• List] [1. List] | [Table] [Image] [HR] ... [ADVANCED]
```

**Use Cases:**
- Long-form articles
- Documentation pages
- Tutorials with code examples
- Product pages
- Landing pages

**Example:**
```tsx
<LexicalEditor
  value={content}
  onChange={handleChange}
  mode="advanced"
  placeholder="Start writing your article..."
/>
```

---

## Feature Comparison Matrix

| Feature | Simple | Standard | Advanced |
|---------|--------|----------|----------|
| Bold | ✅ | ✅ | ✅ |
| Italic | ✅ | ✅ | ✅ |
| Underline | ✅ | ✅ | ✅ |
| Strikethrough | ❌ | ✅ | ✅ |
| Inline Code | ❌ | ✅ | ✅ |
| Headings (H1-H3) | ❌ | ✅ | ✅ |
| Block Quotes | ❌ | ✅ | ✅ |
| Code Blocks | ❌ | ✅ | ✅ |
| Bullet Lists | ✅ | ✅ | ✅ |
| Numbered Lists | ✅ | ✅ | ✅ |
| Links | ✅ | ✅ | ✅ |
| Tables | ❌ | ❌ | ✅ |
| Images | ❌ | ❌ | ✅ |
| Horizontal Rules | ❌ | ❌ | ✅ |
| Undo/Redo | ✅ | ✅ | ✅ |

---

## Implementation Details

### Component Props

```typescript
interface LexicalEditorProps {
  value: string;              // Plain text content
  onChange: (content: string, html: string) => void;  // Callback with text and HTML
  mode?: 'simple' | 'standard' | 'advanced';  // Editor mode (default: 'standard')
  placeholder?: string;       // Placeholder text (optional, has defaults)
  disabled?: boolean;         // Disable editing (default: false)
}
```

### Configuration System

The editor uses a configuration system defined in `src/lib/lexical-config.ts`:

```typescript
import { getEditorConfig } from '@/lib/lexical-config';

const config = getEditorConfig('standard');
// Returns: { mode, features, nodes, placeholder }
```

**Features Object:**
```typescript
interface EditorFeatures {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  code: boolean;
  headings: boolean;
  quote: boolean;
  codeBlock: boolean;
  bulletList: boolean;
  numberedList: boolean;
  links: boolean;
  tables: boolean;
  horizontalRule: boolean;
  images: boolean;
  undo: boolean;
  redo: boolean;
}
```

### Custom Configurations

You can create custom editor configurations:

```typescript
import { createCustomEditorConfig } from '@/lib/lexical-config';

// Start with 'simple' but add headings
const customConfig = createCustomEditorConfig('simple', {
  headings: true,
  quote: true,
});
```

---

## Styling

### Mode-Specific Classes

The editor container gets a mode-specific class:
- `lexical-editor-simple`
- `lexical-editor-standard`
- `lexical-editor-advanced`

**Example CSS:**
```css
.lexical-editor-simple .lexical-content-editable {
  min-height: 150px;  /* Shorter for comments */
}

.lexical-editor-standard .lexical-content-editable {
  min-height: 300px;  /* Default */
}

.lexical-editor-advanced .lexical-content-editable {
  min-height: 500px;  /* Taller for articles */
}
```

### Toolbar Variations

- **Compact Toolbar** (Simple mode): Smaller padding, fewer dividers
- **Standard Toolbar**: Default spacing
- **Advanced Toolbar**: Includes mode badge

---

## Data Flow

```
User Types
  ↓
Lexical Editor State Updates
  ↓
OnChange Handler Triggered
  ↓
onChange(plainText, html)
  ↓
Parent Component
  ├─ plainText → Used for character count, AI analysis
  └─ html → Saved to database
```

**Example:**
```typescript
const [content, setContent] = useState('');
const [htmlContent, setHtmlContent] = useState('');

const handleEditorChange = (plainText: string, html: string) => {
  setContent(plainText);    // "Hello world"
  setHtmlContent(html);      // "<p>Hello <strong>world</strong></p>"
};
```

---

## Keyboard Shortcuts

All modes support standard keyboard shortcuts:

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd + B | Bold |
| Ctrl/Cmd + I | Italic |
| Ctrl/Cmd + U | Underline |
| Ctrl/Cmd + Z | Undo |
| Ctrl/Cmd + Y | Redo |
| Ctrl/Cmd + Shift + Z | Redo (alternative) |

---

## Usage Examples

### Example 1: Discussion Post (Standard)

```tsx
// In /posts/new/page.tsx
<LexicalEditor
  value={content}
  onChange={handleEditorChange}
  mode="standard"  // Headings, quotes, code blocks
  placeholder="Share your thoughts..."
/>
```

### Example 2: Comment Section (Simple)

```tsx
// In comments component
<LexicalEditor
  value={comment}
  onChange={setComment}
  mode="simple"  // Just bold, italic, underline, lists
  placeholder="Write a comment..."
/>
```

### Example 3: Blog Article (Advanced)

```tsx
// In article editor
<LexicalEditor
  value={article}
  onChange={handleArticleChange}
  mode="advanced"  // Tables, images, all features
  placeholder="Start writing your article..."
/>
```

### Example 4: Read-Only Display

```tsx
// Display existing content without editing
<LexicalEditor
  value={existingContent}
  onChange={() => {}} // No-op
  mode="standard"
  disabled={true}  // Prevents editing
/>
```

---

## Performance Considerations

### Mode Impact on Bundle Size

- **Simple**: ~150KB (minimal nodes)
- **Standard**: ~180KB (adds heading, quote, code nodes)
- **Advanced**: ~220KB (adds table, image nodes)

All modes use code splitting, so only loaded features add to bundle size.

### Rendering Performance

- Simple mode: Fastest (fewer node types to handle)
- Standard mode: Good for most use cases
- Advanced mode: Slight overhead for complex nodes

---

## Migration Guide

### From Plain Textarea

**Before:**
```tsx
<textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  placeholder="Write something..."
/>
```

**After:**
```tsx
<LexicalEditor
  value={content}
  onChange={(text, html) => {
    setContent(text);
    setHtmlContent(html);
  }}
  mode="standard"
  placeholder="Write something..."
/>
```

**Key Changes:**
1. `onChange` now provides both plain text and HTML
2. Need to store both versions
3. Use HTML when saving to database
4. Use plain text for character counts, AI analysis

---

## Future Enhancements

### Planned Features

**For Advanced Mode:**
- [ ] Image upload and insertion
- [ ] Table editing with merge/split cells
- [ ] Emoji picker
- [ ] Mention system (@username)
- [ ] Slash commands (/table, /image)
- [ ] Markdown import/export
- [ ] Collaborative editing

**For All Modes:**
- [ ] Mobile-optimized toolbar
- [ ] Touch gesture support
- [ ] Voice dictation
- [ ] Spell check integration
- [ ] Word count display
- [ ] Reading time estimate

---

## Troubleshooting

### Common Issues

**Issue:** Editor not rendering
- **Solution:** Ensure all Lexical packages are installed
- Check for client-side only rendering (`'use client'`)

**Issue:** Features not appearing in toolbar
- **Solution:** Verify mode configuration in `lexical-config.ts`
- Check that correct nodes are registered

**Issue:** HTML output is malformed
- **Solution:** Ensure `$generateHtmlFromNodes` is called correctly
- Check that all custom nodes have proper serialization

**Issue:** Styling not applied
- **Solution:** Verify CSS classes match theme configuration
- Check that mode-specific CSS is defined

---

## Best Practices

### Choosing the Right Mode

1. **Use Simple for:**
   - Comments sections
   - Quick replies
   - User-generated short content
   - Mobile-first experiences

2. **Use Standard for:**
   - Discussion posts (current default)
   - Forum threads
   - Blog posts
   - Q&A platforms

3. **Use Advanced for:**
   - Long-form articles
   - Documentation
   - Marketing pages
   - Tutorial content

### Performance Tips

1. Don't render Advanced mode unnecessarily
2. Use Simple mode for comment sections
3. Lazy load Advanced mode components
4. Consider virtual scrolling for long documents

### Accessibility

- All modes support keyboard navigation
- ARIA labels on toolbar buttons
- Screen reader compatible
- Focus management built-in

---

*Document created: 2025*
*Last updated: 2025*
