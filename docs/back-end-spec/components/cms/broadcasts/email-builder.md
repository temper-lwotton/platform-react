# Component: EmailBuilder

## Description
Visual email content builder with template selection and preview. Provides both template-based and block-based email creation options.

## Location
`src/components/cms/broadcasts/EmailBuilder.tsx`

## Props Interface

```typescript
interface EmailBuilderProps {
  content: any;
  onChange: (content: any) => void;
}
```

## Data Requirements

### Email Template
```typescript
interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  blocks: Block[];
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `selectedTemplate` | `EmailTemplate \| null` | Currently selected template |
| `editorMode` | `'template' \| 'blocks'` | Editor mode selection |

## Dependencies

### Components
- `BlockEmailEditor` - Block-based email editing

### Hooks
- `useEmailTemplates` - Fetch available templates

### Icons
- `lucide-react` - Mail, Layout, Blocks, ChevronRight

## Features
- Template gallery with thumbnails
- Category filtering for templates
- Template preview on hover
- Switch between template and block editing modes
- Live preview panel
- Template customization

## Template Categories
- Welcome emails
- Newsletters
- Announcements
- Promotional
- Transactional

## Related Components
- Parent: `BroadcastDesign`
- Child: `BlockEmailEditor`
