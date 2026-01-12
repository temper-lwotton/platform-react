# Component: FormPreview

## Description
Live preview of the form being built, with full form functionality including validation, conditional logic evaluation, and form submission simulation.

## Location
`src/components/form-builder/preview/FormPreview.tsx`

## Props Interface
None - uses context for form state.

## Data Requirements

### FormSubmissionData Type
```typescript
type FormSubmissionData = Record<string, any>;
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `submitted` | `boolean` | Whether form was submitted |
| `submittedData` | `FormSubmissionData \| null` | Submitted form data |

## Dependencies

### Context
- `useFormBuilder` - Access state (fields, sections, form metadata)

### Hooks
- `react-hook-form` - useForm, Controller

### Components
- `FieldRenderer` - Renders individual fields
- `Button` - Submit and reset buttons

### Icons
- `lucide-react` - CheckCircle2

### Libraries
- `react-hook-form` - Form handling

### Utilities
- `logic-evaluator` - isFieldVisible, isFieldDisabled, isFieldRequired, validateField

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `onSubmit` | Form submit | Logs data and shows success |
| `handleReset` | Reset button | Clears form and resets state |

## Styling
- **CSS Module**: `FormPreview.module.scss`

## Features
- Live form preview
- React Hook Form integration
- Conditional field visibility
- Dynamic required fields
- Cross-field validation
- Submission simulation
- Success state with data display
- Empty state handling

## Conditional Logic Evaluation

### Field Visibility
```typescript
const isFieldVisible = (field: FormField): boolean => {
  return checkFieldVisible(field, formValues);
};
```

### Field Disabled State
```typescript
const isFieldDisabled = (field: FormField): boolean => {
  return checkFieldDisabled(field, formValues);
};
```

### Dynamic Required
```typescript
const isFieldDynamicallyRequired = (field: FormField): boolean => {
  return checkFieldRequired(field, formValues);
};
```

## Validation Rules
```typescript
const getValidationRules = (field: FormField) => ({
  validate: (value: any) => {
    const result = validateField(field, value, formValues, state.fields);
    if (!result.valid) {
      return result.errors[0];
    }
    return true;
  },
  required: isFieldDynamicallyRequired(field) ? 'This field is required' : undefined,
});
```

## UI Sections

### Empty State
- "Add fields to see the form preview" message

### Success State
- CheckCircle2 icon
- "Form Submitted Successfully!" heading
- Preview explanation
- Submitted data display (JSON)
- Reset Form button

### Form View
- Form header (title, description)
- Sections with fields
- Unsectioned fields
- Form actions (Reset, Submit)

## Form Structure
```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  {/* Sections with fields */}
  {state.sections.map((section) => (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>{section.title}</h3>
        {section.description && <p>{section.description}</p>}
      </div>
      <div className={styles.fieldsGrid}>
        {/* Controller-wrapped FieldRenderer for each field */}
      </div>
    </div>
  ))}

  {/* Unsectioned fields */}
  <div className={styles.fieldsGrid}>
    {/* Controller-wrapped FieldRenderer for each field */}
  </div>

  <div className={styles.formActions}>
    <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
    <Button type="submit" variant="primary">Submit</Button>
  </div>
</form>
```

## Related Components
- Parent: `FormBuilder` (preview mode)
- Child: `FieldRenderer`
- Utilities: `logic-evaluator`
