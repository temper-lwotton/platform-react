# **Component Specification: Separator**

## **1. Component Name**

**`Separator`**

## **2. Description**

A visual separator component built on Radix UI Separator primitive.

* Provides accessible horizontal or vertical dividers
* Supports decorative and semantic modes
* Simple, lightweight component
* Used between content sections

## **3. Location**

```
src/components/ui/primitives/Separator/Separator.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component.

## **5. Props Interface**

```typescript
interface SeparatorProps {
  orientation?: SeparatorOrientation;
  decorative?: boolean;
  className?: string;
}

type SeparatorOrientation = 'horizontal' | 'vertical';
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `orientation` | `SeparatorOrientation` | No | `'horizontal'` | Direction of separator |
| `decorative` | `boolean` | No | `true` | Whether purely decorative |
| `className` | `string` | No | `''` | Additional CSS classes |

## **7. Data Requirements**

*No external data – purely presentational.*

## **8. Internal State**

*None – stateless component.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `orientation === 'horizontal'` | Horizontal line | Full width |
| `orientation === 'vertical'` | Vertical line | Full height |
| `decorative === true` | Hidden from SR | role="none" |
| `decorative === false` | Announced | role="separator" |

## **10. Dependencies**

### **External Libraries**

* `@radix-ui/react-separator`

## **11. Events & Callbacks**

*No events – static component.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Separator.module.scss`

### **CSS Classes**

* `.separator` – Base styles
* `.orientation-horizontal` – Horizontal line
* `.orientation-vertical` – Vertical line

## **13. Accessibility Requirements**

* **Decorative**: `role="none"` (hidden from assistive tech)
* **Semantic**: `role="separator"` (announced)
* **ARIA**: Proper `aria-orientation` attribute

### **Improvements Needed**

* None – Radix provides full accessibility

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Invalid orientation | Default to 'horizontal' | No error |

## **15. Performance & Lifecycle Notes**

### **Decorative vs Semantic**

| Type | Use Case | Accessibility |
|------|----------|---------------|
| `decorative={true}` | Visual separation only | Hidden from screen readers |
| `decorative={false}` | Semantic section break | Announced as separator |

## **16. Usage Examples**

### **Horizontal Separator (Default)**

```tsx
import { Separator } from '@/components/ui/primitives/Separator';

<div className={styles.content}>
  <section>First section</section>
  <Separator />
  <section>Second section</section>
</div>
```

### **Vertical Separator**

```tsx
<div className={styles.toolbar}>
  <Button>Edit</Button>
  <Button>Copy</Button>
  <Separator orientation="vertical" />
  <Button>Delete</Button>
</div>
```

### **In Dropdown Menus**

```tsx
<Dropdown trigger={<Button>Menu</Button>}>
  <DropdownItem>Edit</DropdownItem>
  <DropdownItem>Duplicate</DropdownItem>
  <Separator />
  <DropdownItem destructive>Delete</DropdownItem>
</Dropdown>
```

### **With Custom Styling**

```tsx
<Separator className={styles.thickSeparator} />
```

## **17. Features Summary**

### **Orientations**

| Orientation | Use Case |
|-------------|----------|
| `horizontal` | Between stacked content (default) |
| `vertical` | Between side-by-side content |

### **Decorative Setting**

| Setting | Use Case |
|---------|----------|
| `true` | Visual only, no semantic meaning |
| `false` | Meaningful content division |

## **18. Testing Considerations**

### **Unit Tests**

* Renders horizontal by default
* Renders vertical when specified
* Correct role based on decorative
* Accepts className

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* In flex container
* Custom thickness
* Colored separators

## **19. Out of Scope / Non-Goals**

* **Text separators**: Not supported
* **Dashed lines**: Use CSS
* **Animated**: Not built-in
* **Icon separators**: Not supported

## **20. Related Components & System Context**

### **Used In**

* `Dropdown`
* `Popover`
* Sidebars
* Toolbars

### **Siblings**

* Other layout primitives

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Horizontal` | Horizontal | orientation: horizontal | Default |
| `Vertical` | Vertical | orientation: vertical | Side by side |
| `Semantic` | Non-decorative | decorative: false | Announced |
| `InToolbar` | Toolbar use | With buttons | Use case |
| `InMenu` | Menu use | With items | Use case |

### **Controls (Args) Required**

* `orientation` (select) – Separator direction
* `decorative` (boolean) – Decorative mode
* `className` (text) – Custom class

### **Mocking Requirements**

*None – stateless component*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify role attribute
* Check announcement for semantic

### **Interaction Tests**

* None – static component
