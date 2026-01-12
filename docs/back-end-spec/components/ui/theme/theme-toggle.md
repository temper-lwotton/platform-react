# **Component Specification: ThemeToggle**

## **1. Component Name**

**`ThemeToggle`**

## **2. Description**

A toggle switch for switching between light and dark themes.

* Uses Radix Switch for accessible toggle
* Displays sun and moon icons for visual context
* Handles hydration safely for SSR
* Persists theme choice to localStorage

## **3. Location**

```
src/components/ui/ThemeToggle/ThemeToggle.tsx
```

## **4. Component Type**

**Feature** – Manages hydration state and interacts with ThemeContext.

## **5. Props Interface**

```typescript
// No props - uses ThemeContext directly
```

## **6. Props**

*No props – component uses context internally.*

## **7. Data Requirements**

### **Theme Context**

```typescript
// From @/contexts/ThemeContext
interface ThemeContextValue {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}
```

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `mounted` | `boolean` | `false` | Hydration safety flag |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `mounted === false` | Placeholder div | SSR/hydration safety |
| `mounted === true` | Toggle switch | Interactive |
| `resolvedTheme === 'light'` | Switch unchecked | Light mode |
| `resolvedTheme === 'dark'` | Switch checked | Dark mode |
| Toggle to checked | Dark mode set | `setTheme('dark')` |
| Toggle to unchecked | Light mode set | `setTheme('light')` |

## **10. Dependencies**

### **Context**

* `useTheme` – Theme state and setter from ThemeContext

### **External Libraries**

* `@radix-ui/react-switch` – Accessible toggle switch
* `lucide-react` – Sun, Moon icons

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `handleToggle` | Switch change | Call `setTheme` with new theme |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `ThemeToggle.module.scss`

### **CSS Classes**

* `.container` – Main wrapper
* `.icon` – Icon styling
* `.icon--sun` – Sun icon
* `.icon--moon` – Moon icon
* `.switch` – Switch root
* `.switchThumb` – Switch thumb/knob
* `.placeholder` – Hydration placeholder

### **Layout**

* Sun icon (left)
* Switch toggle (center)
* Moon icon (right)

## **13. Accessibility Requirements**

* **Keyboard**: Toggle with Space/Enter
* **ARIA**: Radix provides accessible switch role
* **Screen Reader**: Announce toggle state
* **Focus**: Clear focus indicator

### **Improvements Needed**

* Add `aria-label` describing toggle purpose
* Announce theme change to screen readers

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| ThemeContext missing | Error | Must be within ThemeProvider |
| localStorage unavailable | In-memory only | Theme not persisted |

## **15. Performance & Lifecycle Notes**

### **Hydration Safety**

```typescript
// Prevent hydration mismatch with server render
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return <div className={styles.placeholder} />;
}
```

### **Toggle Handler**

```typescript
const { resolvedTheme, setTheme } = useTheme();
const isDark = resolvedTheme === 'dark';

const handleToggle = (checked: boolean) => {
  setTheme(checked ? 'dark' : 'light');
};
```

### **Why Hydration Safety?**

* Server doesn't know user's theme preference
* Client reads from localStorage on mount
* Mismatch causes hydration errors
* Placeholder prevents flash of wrong theme

## **16. Usage Examples**

### **In Navigation**

```tsx
import { ThemeToggle } from '@/components/ui/ThemeToggle';

<nav>
  <ThemeToggle />
</nav>
```

### **In Settings Page**

```tsx
<div className={styles.settingRow}>
  <label>Theme</label>
  <ThemeToggle />
</div>
```

## **17. Features Summary**

### **Visual Elements**

| Element | Position | Purpose |
|---------|----------|---------|
| Sun icon | Left | Indicates light mode |
| Switch | Center | Toggle control |
| Moon icon | Right | Indicates dark mode |

### **Theme Options**

| Checked State | Theme Set | Effect |
|---------------|-----------|--------|
| Unchecked | 'light' | Light theme applied |
| Checked | 'dark' | Dark theme applied |

### **Persistence**

* Theme saved to localStorage
* Restored on page load
* Respects system preference initially

## **18. Testing Considerations**

### **Unit Tests**

* Renders placeholder before mount
* Renders toggle after mount
* Calls setTheme on toggle
* Correct checked state for dark mode
* Correct unchecked state for light mode

### **Mocking**

* `useTheme` context hook
* localStorage

### **Edge Cases**

* Theme context not available
* localStorage disabled
* Rapid toggling
* Initial server render

## **19. Out of Scope / Non-Goals**

* **System preference option**: Not in this toggle
* **Auto-detect**: Handled by ThemeProvider
* **Theme customization**: Just light/dark toggle
* **Transition animation**: Handled by CSS

## **20. Related Components & System Context**

### **Context**

* `ThemeContext`
* `ThemeProvider`

### **Used By**

* `Navigation`
* `UserMenu`
* Settings pages

### **Related**

* Theme settings admin page

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `LightMode` | Light theme | resolvedTheme: 'light' | Unchecked |
| `DarkMode` | Dark theme | resolvedTheme: 'dark' | Checked |
| `BeforeMount` | Hydrating | mounted: false | Placeholder |

### **Controls (Args) Required**

*None – uses mocked context*

### **Mocking Requirements**

* **ThemeContext**: Mock `useTheme` hook
* **Mounted state**: Control hydration simulation

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify switch accessible
* Check keyboard operation
* Verify state announced

### **Interaction Tests**

* Click to toggle
* Keyboard toggle (Space/Enter)
* Verify theme change callback
