# Component: BlockTemplateEditor

## Description
Editor interface for creating and editing reusable content block templates. Includes template metadata fields and a Lexical rich text editor for block content.

## Location
`src/components/cms/blocks/BlockTemplateEditor.tsx`

## Props Interface

```typescript
interface BlockTemplateEditorProps {
  templateId?: number;
}
```

## Data Requirements

### Block Template Type
```typescript
interface BlockTemplate {
  id: number;
  name: string;
  description?: string;
  category?: string;
  blockJson: string;
  isActive: boolean;
  author: {
    id: number;
    name: string;
  };
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `name` | `string` | Template name (required) |
| `description` | `string` | Template description |
| `category` | `string` | Template category |
| `content` | `string` | Plain text content |
| `contentHtml` | `string` | HTML content from editor |
| `isActive` | `boolean` | Active status |
| `isDirty` | `boolean` | Unsaved changes flag |
| `showPreview` | `boolean` | Preview mode toggle |

## Dependencies

### Components
- `LexicalEditor` - Rich text content editing

### Hooks
- `useBlockTemplate` - Fetch existing template
- `useCreateBlockTemplate` - Create mutation
- `useUpdateBlockTemplate` - Update mutation

### Icons
- `lucide-react` - Save, Eye, ArrowLeft

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleContentChange` | Editor change | Updates content state |
| `handleSave` | Save button | Creates or updates template |

## Styling
- **CSS Module**: `BlockTemplateEditor.module.scss`

## Features
- Edit/Create modes
- Back to templates link
- Template info fields
- Rich text content editor
- HTML preview toggle
- Active status checkbox
- Save/Update button
- Validation (name required)

## Layout Structure

### Header
- Back button with icon
- Title (Edit/New Block Template)

### Main Editor Area

#### Info Section
- Template Name (required)
- Description textarea
- Category input
- Active checkbox

#### Content Section
- Section header with Preview toggle
- LexicalEditor or HTML preview
- Preview renders contentHtml

### Sidebar
- Publish panel
- Save/Update button
- Help text for edit mode

## Save Logic
```typescript
const handleSave = async () => {
  if (!name.trim()) {
    alert('Please enter a template name');
    return;
  }

  const blockJson = JSON.stringify({
    root: {
      children: [],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  });

  const data = {
    name: name.trim(),
    description: description.trim() || undefined,
    category: category.trim() || undefined,
    blockJson,
    isActive,
  };

  if (isEditMode && templateId) {
    await updateTemplate.mutateAsync({ id: templateId, data });
  } else {
    const result = await createTemplate.mutateAsync(data);
    router.push(`/admin/block-templates/${result.data.id}/edit`);
  }
};
```

## Related Components
- Parent: Admin layout
- Child: `LexicalEditor`
- See also: `BlockTemplatesList`, `BlockTemplatePicker`
