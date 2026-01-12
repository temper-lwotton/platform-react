# Component: FormBuilderToolbar

## Description
Toolbar for the form builder with mode tabs (Edit, Preview, Logic), undo/redo controls, and action buttons for importing, exporting, saving, and loading form templates.

## Location
`src/components/form-builder/toolbar/FormBuilderToolbar.tsx`

## Props Interface
None - self-contained toolbar using context.

## Data Requirements
Uses FormBuilderProvider context.

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `showImportDialog` | `boolean` | Import form dialog visibility |
| `showSaveTemplateDialog` | `boolean` | Save template dialog visibility |
| `showLoadTemplateDialog` | `boolean` | Load template dialog visibility |

## Dependencies

### Context
- `useFormBuilder` - Access mode, undo/redo, export

### Icons
- `lucide-react` - Undo2, Redo2, Download, Upload, Save, FolderOpen, Edit3, Eye, GitBranch

### Libraries
- None

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleExport` | Export button | Downloads form as JSON file |
| Mode tab clicks | Tab buttons | Switches between edit/preview/logic |
| Undo/Redo clicks | History buttons | Navigates history stack |

## Styling
- **CSS Module**: `FormBuilderToolbar.module.scss`

## Features
- Three-mode tabs with icons
- Undo/redo with disabled states
- Export as JSON download
- Import from JSON file
- Save current form as template
- Load saved form templates
- Visual active mode indicator

## UI Sections

### Left Section - Mode Tabs
| Tab | Icon | Description |
|-----|------|-------------|
| Edit | Edit3 | Field editing mode |
| Preview | Eye | Form preview mode |
| Logic | GitBranch | Conditional logic mode |

### Center Section - Undo/Redo
- Undo button (disabled when cannot undo)
- Redo button (disabled when cannot redo)

### Right Section - Actions
| Button | Icon | Action |
|--------|------|--------|
| Import | Upload | Opens import dialog |
| Export | Download | Downloads JSON file |
| Save Template | Save | Opens save template dialog |
| Load Template | FolderOpen | Opens load template dialog |

## Export Behavior
```javascript
// Creates downloadable JSON file
const blob = new Blob([exportForm()], { type: 'application/json' });
// Filename: form-export-{timestamp}.json
```

## Related Components
- Parent: `FormBuilder`
- Dialogs: `ImportFormDialog`, `SaveFormTemplateDialog`, `LoadFormTemplateDialog`
