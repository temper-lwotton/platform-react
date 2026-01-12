# Component: MetaFieldsPanel

## Description
Dynamic key-value custom fields panel for adding arbitrary metadata to content items. Allows adding, editing, and removing custom field pairs.

## Location
`src/components/cms/shared/MetaFieldsPanel.tsx`

## Props Interface

```typescript
interface MetaFieldsPanelProps {
  fields: Record<string, any>;
  onChange: (fields: Record<string, any>) => void;
}
```

## Data Requirements

The component works with a simple key-value object:
```typescript
// Example fields data
{
  "custom_field_1": "value1",
  "author_twitter": "@author",
  "reading_time": "5 min"
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `newKey` | `string` | Input value for new field name |
| `newValue` | `string` | Input value for new field value |

## Dependencies

### Icons
- `lucide-react` - Plus, X

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleAdd` | Add button click | Adds new key-value pair to fields |
| `handleRemove` | X button click | Removes field by key |
| `handleUpdate` | Value input change | Updates existing field value |

## Styling
- **CSS Module**: `MetaFieldsPanel.module.scss`

## Usage Example

```tsx
import { MetaFieldsPanel } from '@/components/cms/shared/MetaFieldsPanel';

<MetaFieldsPanel
  fields={metaFields}
  onChange={setMetaFields}
/>
```

## Features
- Display existing custom fields
- Edit field values inline
- Remove fields with X button
- Add new fields with key-value inputs
- Add button disabled when key is empty
- Automatic clearing of inputs after adding

## Panel Sections

### Title
- "Custom Fields" heading

### Existing Fields List
- Each field shows:
  - Field key (name) as label
  - Remove button (X icon)
  - Editable value input
- Only shown when fields exist

### Add New Field Section
- Field name input (placeholder: "Field name")
- Value input (placeholder: "Value")
- Add button with Plus icon
- Button disabled when field name is empty

## Field Operations

### Add Field
```typescript
const handleAdd = () => {
  if (!newKey.trim()) return;
  onChange({
    ...fields,
    [newKey]: newValue,
  });
  setNewKey('');
  setNewValue('');
};
```

### Remove Field
```typescript
const handleRemove = (key: string) => {
  const newFields = { ...fields };
  delete newFields[key];
  onChange(newFields);
};
```

### Update Field
```typescript
const handleUpdate = (key: string, value: any) => {
  onChange({
    ...fields,
    [key]: value,
  });
};
```

## Related Components
- Parent: `PostEditor`, `PageEditor`
- See also: `CategoriesPanel`
