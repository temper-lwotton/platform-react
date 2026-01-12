# Component: FieldSettingsPanel

## Description
Right sidebar panel for configuring selected field properties. Features tabbed interface for basic settings, validation rules, options (for select/radio), and conditional logic.

## Location
`src/components/form-builder/settings/FieldSettingsPanel.tsx`

## Props Interface
None - uses context for selected field.

## Data Requirements
Uses FormBuilderProvider context for selected field data.

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `activeTab` | `'basic' \| 'validation' \| 'options' \| 'logic' \| 'advanced'` | Current settings tab |

## Dependencies

### Context
- `useFormBuilder` - Access selected field, update actions

### Icons
- `lucide-react` - Settings, CheckCircle, List, GitBranch, Cog

### Libraries
- None

## Styling
- **CSS Module**: `FieldSettingsPanel.module.scss`

## Features
- Dynamic tab display based on field type
- Field type indicator
- Delete field action
- Save as template action
- Tab-based settings organization

## Settings Tabs

| Tab | Icon | Component | Visibility |
|-----|------|-----------|------------|
| Basic | Settings | BasicSettings | Always |
| Validation | CheckCircle | ValidationSettings | Always |
| Options | List | OptionsSettings | Only for select/radio/checkbox-group |
| Logic | GitBranch | ConditionalLogicSettings | Always |
| Advanced | Cog | AdvancedSettings | Always |

## UI Sections

### Header
- "Field Settings" title
- Field type badge
- Delete button
- Save as template button

### Tab Bar
- Dynamic tabs based on field type
- Active tab indicator

### Content Area
- Renders active tab component
- Passes selected field as prop

### Empty State
- Displayed when no field selected
- Instructions to select a field

## Tab Visibility Logic
```typescript
const showOptionsTab = ['select', 'radio', 'checkbox-group'].includes(selectedField.type);
```

## Related Components
- Parent: `FormBuilder`
- Children: `BasicSettings`, `ValidationSettings`, `OptionsSettings`, `ConditionalLogicSettings`, `AdvancedSettings`
- Dialog: `SaveAsTemplateDialog`
