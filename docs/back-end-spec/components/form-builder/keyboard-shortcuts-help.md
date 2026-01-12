# Component: KeyboardShortcutsHelp

## Description
Modal dialog displaying all available keyboard shortcuts for the form builder, organized by category. Triggered by pressing the `?` key.

## Location
`src/components/form-builder/KeyboardShortcutsHelp.tsx`

## Props Interface

```typescript
interface KeyboardShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

## Data Requirements

### Shortcut Types
```typescript
interface Shortcut {
  keys: string[];
  description: string;
}

interface ShortcutGroup {
  title: string;
  shortcuts: Shortcut[];
}
```

## Dependencies

### Icons
- `lucide-react` - X, Keyboard

### Libraries
- `@radix-ui/react-dialog` - Dialog components

## Styling
- **CSS Module**: `KeyboardShortcutsHelp.module.scss`

## Features
- Organized shortcut categories
- Visual key display with `<kbd>` elements
- Keyboard icon header
- Press `?` to toggle hint

## Shortcut Categories

### Quick Field Insertion
| Key | Action |
|-----|--------|
| T | Add Text field |
| E | Add Email field |
| N | Add Number field |
| P | Add Phone field |
| S | Add Select field |
| R | Add Radio field |
| C | Add Checkbox field |
| D | Add Date field |
| F | Add File upload field |

### Navigation
| Keys | Action |
|------|--------|
| ↑ ↓ | Navigate between fields |
| Enter | Open field settings |
| Esc | Clear selection |

### Editing
| Keys | Action |
|------|--------|
| ⌘/Ctrl + Z | Undo |
| ⌘/Ctrl + Shift + Z | Redo |
| ⌘/Ctrl + A | Select all fields |
| ⌘/Ctrl + C | Copy selected fields |
| ⌘/Ctrl + V | Paste fields |
| ⌘/Ctrl + D | Duplicate selected fields |
| Delete | Delete selected fields |

### Selection
| Keys | Action |
|------|--------|
| Shift + Click | Range select |
| ⌘/Ctrl + Click | Toggle selection |

### Help
| Key | Action |
|-----|--------|
| ? | Show/hide this help |

## UI Sections

### Header
- Keyboard icon
- "Keyboard Shortcuts" title
- Close button (X)

### Body
- Shortcut groups
- Group titles
- Shortcut rows with keys and descriptions

### Footer
- Hint: Press `?` to toggle

## Key Display
```tsx
<div className={styles.keys}>
  {shortcut.keys.map((key, keyIndex) => (
    <React.Fragment key={keyIndex}>
      <kbd className={styles.key}>{key}</kbd>
      {keyIndex < shortcut.keys.length - 1 && (
        <span className={styles.plus}>+</span>
      )}
    </React.Fragment>
  ))}
</div>
```

## Related Components
- Parent: `FormBuilder`
- Triggered by: Global keyboard handler in FormBuilder
