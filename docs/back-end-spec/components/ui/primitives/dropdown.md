# **Component Specification: Dropdown**

## **1. Component Name**

**`Dropdown`**

## **2. Description**

A dropdown menu component built on Radix UI DropdownMenu primitive.

* Provides accessible dropdown menus
* Supports items, separators, and labels
* Includes destructive action styling
* Full keyboard navigation

## **3. Location**

```
src/components/ui/primitives/Dropdown/Dropdown.tsx
```

## **4. Component Type**

**UI** – Presentational component managed by Radix UI.

## **5. Props Interface**

### **Dropdown (Root)**

```typescript
interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  className?: string;
}
```

### **DropdownItem**

```typescript
interface DropdownItemProps {
  children: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
  destructive?: boolean;
}
```

### **DropdownSeparator & DropdownLabel**

```typescript
interface DropdownSeparatorProps {
  className?: string;
}

interface DropdownLabelProps {
  children: ReactNode;
  className?: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `trigger` | `ReactNode` | Yes | - | Element that opens dropdown |
| `children` | `ReactNode` | Yes | - | Menu content |
| `align` | `'start' \| 'center' \| 'end'` | No | `'end'` | Horizontal alignment |
| `sideOffset` | `number` | No | `4` | Distance from trigger |
| `onSelect` | `() => void` | No | - | Item selection handler |
| `disabled` | `boolean` | No | `false` | Disable item |
| `destructive` | `boolean` | No | `false` | Destructive action styling |

## **7. Data Requirements**

*No external data – purely presentational.*

## **8. Internal State**

*None – managed by Radix UI.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Trigger clicked | Menu opens | Focus moves to menu |
| Item clicked | Item selected | Menu closes |
| `destructive === true` | Red styling | Warning appearance |
| `disabled === true` | Grayed out | Non-selectable |
| Press Escape | Menu closes | Returns focus |

## **10. Dependencies**

### **External Libraries**

* `@radix-ui/react-dropdown-menu`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onSelect` | Item clicked | Item selection handler |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Dropdown.module.scss`

### **CSS Classes**

* `.content` – Menu container
* `.item` – Menu item
* `.separator` – Divider line
* `.label` – Non-interactive label
* `.destructive` – Destructive action

## **13. Accessibility Requirements**

* **Keyboard**: Arrow keys navigate, Enter/Space select
* **ARIA**: Proper menu semantics via Radix
* **Focus**: Focus trapped within menu
* **Screen Reader**: Announces items and states

### **Improvements Needed**

* None – Radix provides full accessibility

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| No items | Empty menu | Graceful |
| Invalid align | Default to 'end' | No error |

## **15. Performance & Lifecycle Notes**

### **Menu Composition**

```tsx
// Compose menu with items, separators, labels
<Dropdown trigger={<Button>Menu</Button>}>
  <DropdownLabel>Actions</DropdownLabel>
  <DropdownItem onSelect={handleEdit}>Edit</DropdownItem>
  <DropdownSeparator />
  <DropdownItem onSelect={handleDelete} destructive>Delete</DropdownItem>
</Dropdown>
```

## **16. Usage Examples**

### **Basic Dropdown**

```tsx
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
} from '@/components/ui/primitives/Dropdown';

<Dropdown
  trigger={<Button variant="ghost"><Icon icon="moreVertical" /></Button>}
>
  <DropdownItem onSelect={() => handleEdit()}>Edit</DropdownItem>
  <DropdownItem onSelect={() => handleDuplicate()}>Duplicate</DropdownItem>
  <DropdownSeparator />
  <DropdownItem onSelect={() => handleDelete()} destructive>
    Delete
  </DropdownItem>
</Dropdown>
```

### **With Labels and Groups**

```tsx
<Dropdown
  trigger={<Button>Options</Button>}
  align="start"
>
  <DropdownLabel>Actions</DropdownLabel>
  <DropdownItem onSelect={handleView}>View Details</DropdownItem>
  <DropdownItem onSelect={handleShare}>Share</DropdownItem>

  <DropdownSeparator />

  <DropdownLabel>Settings</DropdownLabel>
  <DropdownItem onSelect={handleSettings}>Preferences</DropdownItem>
  <DropdownItem disabled>Advanced (Coming Soon)</DropdownItem>
</Dropdown>
```

### **User Menu Dropdown**

```tsx
<Dropdown
  trigger={<Avatar src={user.avatar} size="sm" />}
  align="end"
>
  <DropdownLabel>{user.name}</DropdownLabel>
  <DropdownItem onSelect={() => navigate('/profile')}>
    <Icon icon="user" size={16} /> Profile
  </DropdownItem>
  <DropdownItem onSelect={() => navigate('/settings')}>
    <Icon icon="settings" size={16} /> Settings
  </DropdownItem>
  <DropdownSeparator />
  <DropdownItem onSelect={handleLogout} destructive>
    <Icon icon="logOut" size={16} /> Log out
  </DropdownItem>
</Dropdown>
```

## **17. Features Summary**

### **Exported Components**

| Component | Purpose |
|-----------|---------|
| `Dropdown` | Root container with trigger |
| `DropdownItem` | Selectable menu item |
| `DropdownSeparator` | Visual divider |
| `DropdownLabel` | Non-interactive label |

### **Alignment**

| Align | Position |
|-------|----------|
| `start` | Left-aligned |
| `center` | Center-aligned |
| `end` | Right-aligned (default) |

## **18. Testing Considerations**

### **Unit Tests**

* Opens on trigger click
* Closes on item select
* Keyboard navigation works
* Disabled items not selectable
* Destructive styling applies

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Empty menu
* Many items (scroll)
* Long item text
* Nested dropdowns

## **19. Out of Scope / Non-Goals**

* **Rich content**: Use Popover
* **Forms**: Use Dialog
* **Checkable items**: Not supported
* **Sub-menus**: Not supported

## **20. Related Components & System Context**

### **Used By**

* `UserMenu`
* Action menus
* Context menus

### **Siblings**

* `Popover`
* `Dialog`

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Basic menu | Standard items | Base state |
| `WithLabels` | Grouped items | Labels + separators | Organized |
| `WithIcons` | Icon items | Icons in items | Rich items |
| `Destructive` | Delete action | destructive: true | Red styling |
| `Disabled` | Disabled item | disabled: true | Non-selectable |
| `Alignment` | All alignments | start, center, end | Positioning |

### **Controls (Args) Required**

* `align` (select) – Menu alignment
* `sideOffset` (number) – Distance from trigger

### **Mocking Requirements**

*None – stateless component*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify keyboard navigation
* Check focus management
* Verify item announcement

### **Interaction Tests**

* Click trigger to open
* Arrow key navigation
* Enter/Space to select
* Escape to close
