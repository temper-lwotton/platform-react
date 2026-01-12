# Component: AdvancedSettings

## Description
Advanced field settings panel displaying read-only field information (ID, type) and configuration summary, plus default value setting and feature documentation.

## Location
`src/components/form-builder/settings/AdvancedSettings.tsx`

## Props Interface

```typescript
interface AdvancedSettingsProps {
  field: FormField;
}
```

## Data Requirements

### FormField Properties Used
```typescript
interface FormField {
  id: string;
  type: FieldType;
  defaultValue?: any;
  required?: boolean;
  width?: 'full' | 'half' | 'third';
  validations?: Validation[];
  options?: FieldOption[];
}
```

## Dependencies

### Context
- `useFormBuilder` - Access updateField action

### Components
- `Input` - Default value input
- `Label` - Form labels
- `Switch` - Toggle components
- `Select` - Dropdown components

### Icons
- None

### Libraries
- None

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| Default value change | Input change | Updates field default value |

## Styling
- **CSS Module**: `Settings.module.scss`

## Features
- Field ID display (read-only)
- Field type display (read-only)
- Default value configuration
- Configuration summary
- Feature documentation

## UI Sections

### Field ID
- Read-only input
- Disabled styling
- Hint about uniqueness

### Field Type
- Read-only input
- Disabled styling
- Hint about immutability

### Default Value
- Editable input
- Pre-fill explanation
- Conditional display

### Configuration Summary Box
| Property | Value |
|----------|-------|
| Width | full/half/third |
| Required | Yes/No |
| Validations | Count |
| Options | Count (if applicable) |

### Additional Features Box
- Logic tab reference
- Validation tab reference
- Feature explanations

### Future Enhancements Box
- Custom CSS classes
- Calculated/formula fields
- Field presets

## Configuration Summary Display
```typescript
<dl className={styles.configList}>
  <div className={styles.configItem}>
    <dt>Width:</dt>
    <dd>{field.width || 'full'}</dd>
  </div>
  <div className={styles.configItem}>
    <dt>Required:</dt>
    <dd>{field.required ? 'Yes' : 'No'}</dd>
  </div>
  <div className={styles.configItem}>
    <dt>Validations:</dt>
    <dd>{field.validations?.length || 0}</dd>
  </div>
</dl>
```

## Related Components
- Parent: `FieldSettingsPanel`
- Sibling: `BasicSettings`, `ValidationSettings`, `OptionsSettings`
