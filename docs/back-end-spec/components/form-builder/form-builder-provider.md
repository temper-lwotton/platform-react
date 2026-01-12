# Component: FormBuilderProvider

## Description
Context provider managing all form builder state using a reducer pattern. Provides 50+ actions for field manipulation, undo/redo, templates, clipboard operations, and form import/export.

## Location
`src/components/form-builder/FormBuilderProvider.tsx`

## Props Interface

```typescript
interface FormBuilderProviderProps {
  children: React.ReactNode;
  initialFields?: FormField[];
  initialSections?: FormSection[];
  formId?: string;
  formTitle?: string;
  formDescription?: string;
}
```

## Data Requirements

### FormBuilderState Type
```typescript
interface FormBuilderState {
  fields: FormField[];
  sections: FormSection[];
  selectedFieldIds: string[];
  focusedFieldId: string | null;
  mode: 'edit' | 'preview' | 'logic';
  history: HistoryEntry[];
  historyIndex: number;
  fieldTemplates: FieldTemplate[];
  formTemplates: FormTemplate[];
  favoriteFieldTypes: string[];
  clipboard: FormField[];
  formId: string | null;
  formTitle: string;
  formDescription: string;
}
```

### HistoryEntry Type
```typescript
interface HistoryEntry {
  fields: FormField[];
  sections: FormSection[];
  timestamp: number;
}
```

## Internal State
Uses `useReducer` with `formBuilderReducer` for state management.

## Action Types

### Field Actions
| Action | Payload | Description |
|--------|---------|-------------|
| `ADD_FIELD` | `{ field, index? }` | Add field at position |
| `REMOVE_FIELD` | `{ id }` | Remove field |
| `UPDATE_FIELD` | `{ id, updates }` | Update field properties |
| `REORDER_FIELDS` | `{ fromIndex, toIndex }` | Move field position |
| `DUPLICATE_FIELD` | `{ id }` | Clone field |

### Section Actions
| Action | Payload | Description |
|--------|---------|-------------|
| `ADD_SECTION` | `{ section }` | Add new section |
| `REMOVE_SECTION` | `{ id }` | Remove section |
| `UPDATE_SECTION` | `{ id, updates }` | Update section |
| `ADD_FIELD_TO_SECTION` | `{ fieldId, sectionId }` | Move field to section |
| `REMOVE_FIELD_FROM_SECTION` | `{ fieldId, sectionId }` | Remove from section |

### Selection Actions
| Action | Payload | Description |
|--------|---------|-------------|
| `SELECT_FIELD` | `{ id }` | Single select |
| `TOGGLE_FIELD_SELECTION` | `{ id }` | Toggle selection |
| `SELECT_RANGE` | `{ fromId, toId }` | Range select |
| `SELECT_ALL` | - | Select all fields |
| `CLEAR_SELECTION` | - | Deselect all |
| `SET_FOCUSED_FIELD` | `{ id }` | Set keyboard focus |

### History Actions
| Action | Description |
|--------|-------------|
| `UNDO` | Restore previous state |
| `REDO` | Restore next state |
| `SAVE_HISTORY` | Save current state to history |

### Template Actions
| Action | Payload | Description |
|--------|---------|-------------|
| `SAVE_FIELD_TEMPLATE` | `{ fieldId, name, description? }` | Save field as template |
| `DELETE_FIELD_TEMPLATE` | `{ id }` | Remove field template |
| `SAVE_FORM_TEMPLATE` | `{ name, description? }` | Save form as template |
| `LOAD_FORM_TEMPLATE` | `{ id }` | Load saved form |
| `DELETE_FORM_TEMPLATE` | `{ id }` | Remove form template |

### Clipboard Actions
| Action | Description |
|--------|-------------|
| `COPY_FIELDS` | Copy selected to clipboard |
| `PASTE_FIELDS` | Paste from clipboard |

### Other Actions
| Action | Payload | Description |
|--------|---------|-------------|
| `SET_MODE` | `{ mode }` | Switch builder mode |
| `TOGGLE_FAVORITE` | `{ fieldType }` | Toggle field type favorite |
| `IMPORT_FORM` | `{ json }` | Import form from JSON |
| `SET_FORM_METADATA` | `{ title?, description? }` | Update form info |

## Context Value

```typescript
interface FormBuilderContextValue {
  state: FormBuilderState;
  // Field operations
  addField: (field: FormField, index?: number) => void;
  removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
  duplicateField: (id: string) => void;
  // Section operations
  addSection: (section: FormSection) => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, updates: Partial<FormSection>) => void;
  addFieldToSection: (fieldId: string, sectionId: string) => void;
  removeFieldFromSection: (fieldId: string, sectionId: string) => void;
  // Selection operations
  selectField: (id: string) => void;
  toggleFieldSelection: (id: string) => void;
  selectRange: (fromId: string, toId: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setFocusedField: (id: string | null) => void;
  // History operations
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  // Mode operations
  setMode: (mode: 'edit' | 'preview' | 'logic') => void;
  // Template operations
  saveFieldAsTemplate: (fieldId: string, name: string, description?: string) => void;
  deleteFieldTemplate: (id: string) => void;
  saveFormAsTemplate: (name: string, description?: string) => void;
  loadFormTemplate: (id: string) => void;
  deleteFormTemplate: (id: string) => void;
  // Favorites
  toggleFavorite: (fieldType: string) => void;
  // Clipboard
  copyFields: () => void;
  pasteFields: () => void;
  // Import/Export
  importForm: (json: string) => { success: boolean; error?: string };
  exportForm: () => string;
  // Metadata
  setFormMetadata: (title?: string, description?: string) => void;
}
```

## Dependencies

### Libraries
- `react` - createContext, useContext, useReducer, useCallback

## Styling
None - logic-only provider.

## Features
- Complete state management via reducer
- 50+ action types for form manipulation
- Undo/redo with history stack (max 50 entries)
- Field and form templates with localStorage persistence
- Clipboard operations (copy/paste/duplicate)
- Multi-selection support (single, toggle, range, all)
- JSON import/export with validation
- Mode switching (edit, preview, logic)
- Favorite field types

## localStorage Keys
- `form-builder-field-templates` - Saved field templates
- `form-builder-form-templates` - Saved form templates
- `form-builder-favorites` - Favorite field types

## Related Components
- Parent: `FormBuilder`
- Children: All form builder components via context
