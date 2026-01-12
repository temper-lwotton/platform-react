# Component: ConditionalLogicSettings

## Description
Conditional logic configuration panel for setting up field visibility, enable/disable states, and dynamic required rules based on other field values.

## Location
`src/components/form-builder/settings/ConditionalLogicSettings.tsx`

## Props Interface

```typescript
interface ConditionalLogicSettingsProps {
  field: FormField;
}
```

## Data Requirements

### ConditionalLogic Type
```typescript
interface ConditionalLogic {
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require';
  logicType: 'all' | 'any';
  conditions: ConditionalRule[];
}
```

### ConditionalRule Type
```typescript
interface ConditionalRule {
  id: string;
  fieldId: string;
  operator: ComparisonOperator;
  value: string;
}
```

### ComparisonOperator Type
```typescript
type ComparisonOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'isEmpty'
  | 'isNotEmpty';
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `enabled` | `boolean` | Whether conditional logic is active |

## Dependencies

### Context
- `useFormBuilder` - Access state fields, updateField action

### Icons
- `lucide-react` - Plus, Trash2, AlertCircle

### Libraries
- None

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleToggle` | Enable switch | Enables/disables logic |
| `handleActionChange` | Action button | Changes logic action |
| `handleLogicTypeChange` | Radio button | Switches AND/OR |
| `handleAddCondition` | Add button | Adds new condition |
| `handleRemoveCondition` | Remove button | Removes condition |
| `handleConditionChange` | Input/select | Updates condition config |

## Styling
- **CSS Module**: `ConditionalLogicSettings.module.scss`

## Features
- Enable/disable toggle
- Action selection (show, hide, enable, disable, require)
- Logic type (all/any)
- Multiple conditions support
- Field selector
- Operator selector
- Dynamic value input based on field type
- Empty state handling

## Actions

| Action | Description |
|--------|-------------|
| show | Show field when conditions met |
| hide | Hide field when conditions met |
| enable | Enable field when conditions met |
| disable | Disable field when conditions met |
| require | Make required when conditions met |

## Comparison Operators

| Operator | Label |
|----------|-------|
| equals | Equals |
| notEquals | Does not equal |
| contains | Contains |
| notContains | Does not contain |
| greaterThan | Greater than |
| lessThan | Less than |
| greaterThanOrEqual | Greater than or equal |
| lessThanOrEqual | Less than or equal |
| isEmpty | Is empty |
| isNotEmpty | Is not empty |

## UI Sections

### Header
- Title and description
- Enable/disable toggle

### Content (when enabled)

#### Action Selection
- Grid of action buttons
- Active state indicator
- Tooltip descriptions

#### Logic Type (when multiple conditions)
- Radio: All conditions (AND)
- Radio: Any condition (OR)

#### Conditions List
- Numbered condition cards
- Field selector dropdown
- Operator selector dropdown
- Value input (dynamic type)
- Remove button

#### Add Condition Button
- Plus icon
- "Add Condition" text

### Empty State
- Alert icon
- "No other fields available" message

## Value Input Types
```typescript
// Dynamic based on selected field type
selectedField?.type === 'number' || selectedField?.type === 'currency'
  ? 'number'
  : selectedField?.type === 'date'
  ? 'date'
  : 'text'
```

## Options Field Handling
```typescript
// Show select dropdown for fields with options
{selectedField?.options ? (
  <select>
    {selectedField.options.map((opt) => (
      <option key={opt.id} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
) : (
  <input type="text" />
)}
```

## Related Components
- Parent: `FieldSettingsPanel`
- Sibling: `BasicSettings`, `ValidationSettings`, `AdvancedSettings`
