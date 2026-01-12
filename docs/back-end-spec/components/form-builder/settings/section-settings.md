# Component: SectionSettings

## Description
Settings panel for configuring section properties including title, description, and viewing section information such as field count and collapsed state.

## Location
`src/components/form-builder/settings/SectionSettings.tsx`

## Props Interface

```typescript
interface SectionSettingsProps {
  section: FormSection;
}
```

## Data Requirements

### FormSection Type
```typescript
interface FormSection {
  id: string;
  title: string;
  description?: string;
  fieldIds: string[];
  collapsed?: boolean;
}
```

## Dependencies

### Context
- `useFormBuilder` - Access state fields, updateSection action

### Components
- `Input` - Title input
- `Textarea` - Description input
- `Label` - Form labels

### Icons
- None

### Libraries
- None

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| Title change | Input change | Updates section title |
| Description change | Textarea change | Updates section description |

## Styling
- **CSS Module**: `Settings.module.scss`

## Features
- Section title editing
- Section description editing
- Section information display
- Field list preview

## UI Sections

### Title Field
- Input for section title
- Placeholder text

### Description Field
- Textarea for description
- Optional indicator
- Hint about purpose

### Section Information Box
- Section ID (read-only)
- Field count
- Collapsed state

### Fields in Section Box
- List of fields in section
- Field label and type display
- Empty state handling

## Information Display
```typescript
<dl className={styles.configList}>
  <div className={styles.configItem}>
    <dt>Section ID:</dt>
    <dd>{section.id}</dd>
  </div>
  <div className={styles.configItem}>
    <dt>Fields:</dt>
    <dd>{sectionFields.length}</dd>
  </div>
  <div className={styles.configItem}>
    <dt>Collapsed:</dt>
    <dd>{section.collapsed ? 'Yes' : 'No'}</dd>
  </div>
</dl>
```

## Related Components
- Parent: `FieldSettingsPanel`
- Sibling: `BasicSettings`, `ValidationSettings`, `AdvancedSettings`
