# **Component Specification: Badge**

## **1. Component Name**

**`Badge`**

## **2. Description**

A badge component for displaying status indicators, labels, tags, and counts.

* Supports multiple visual variants for different contexts
* Multiple sizes for various use cases
* Extends native HTML span attributes
* Used throughout the application for status display

## **3. Location**

```
src/components/ui/primitives/Badge.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component.

## **5. Props Interface**

```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `BadgeVariant` | No | `'default'` | Visual style variant |
| `size` | `BadgeSize` | No | `'md'` | Badge size |
| `children` | `ReactNode` | Yes | - | Badge content |
| `className` | `string` | No | `''` | Additional CSS classes |

## **7. Data Requirements**

*No external data – purely presentational.*

## **8. Internal State**

*None – stateless component.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Variant applied | Variant colors | Visual distinction |
| Size applied | Size styling | Different padding/font |
| With children | Content displayed | Any React node |

## **10. Dependencies**

### **External Libraries**

* React `forwardRef`

## **11. Events & Callbacks**

*No custom events – inherits HTMLSpanElement events.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Badge.module.scss`

### **CSS Classes**

* `.badge` – Base badge styles
* `.badge--default` – Default variant
* `.badge--primary` – Primary variant
* `.badge--success` – Success variant
* `.badge--warning` – Warning variant
* `.badge--danger` – Danger variant
* `.badge--info` – Info variant
* `.badge--outline` – Outline variant
* `.badge--sm`, `.badge--md`, `.badge--lg` – Size variants

## **13. Accessibility Requirements**

* **ARIA**: Semantic text content
* **Contrast**: Proper color contrast for all variants
* **Screen Reader**: Content announced

### **Improvements Needed**

* Add `role="status"` for dynamic badges

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Invalid variant | Default to 'default' | No error |
| Invalid size | Default to 'md' | No error |

## **15. Performance & Lifecycle Notes**

### **Common Patterns**

```typescript
// Status mapping
const statusVariant = {
  published: 'success',
  draft: 'warning',
  archived: 'default',
  rejected: 'danger',
} as const;

<Badge variant={statusVariant[post.status]}>
  {post.status}
</Badge>
```

### **Notification Count**

```typescript
{unreadCount > 0 && (
  <Badge variant="danger" size="sm">
    {unreadCount > 99 ? '99+' : unreadCount}
  </Badge>
)}
```

## **16. Usage Examples**

### **Status Badges**

```tsx
import { Badge } from '@/components/ui/primitives/Badge';

<Badge variant="success">Published</Badge>
<Badge variant="warning">Draft</Badge>
<Badge variant="danger">Rejected</Badge>
```

### **Size Variations**

```tsx
<Badge variant="primary" size="sm">New</Badge>
<Badge variant="primary" size="md">Featured</Badge>
<Badge variant="primary" size="lg">Premium</Badge>
```

### **Tags**

```tsx
<Badge variant="outline">React</Badge>
<Badge variant="outline">TypeScript</Badge>
<Badge variant="outline">Next.js</Badge>
```

### **Count Badge**

```tsx
<Badge variant="danger" size="sm">3</Badge>
```

### **With Removable Action**

```tsx
<Badge variant="primary" size="sm">
  Filter tag
  <button onClick={onRemove}>
    <Icon icon="x" size={12} />
  </button>
</Badge>
```

## **17. Features Summary**

### **Variants**

| Variant | Use Case |
|---------|----------|
| `default` | Neutral labels, counts |
| `primary` | Primary actions, featured items |
| `success` | Completed, approved, published |
| `warning` | Pending, needs attention |
| `danger` | Errors, deleted, rejected |
| `info` | Informational, tips |
| `outline` | Subtle tags, secondary labels |

### **Sizes**

| Size | Use Case |
|------|----------|
| `sm` | Inline counts, compact UI |
| `md` | Standard badges |
| `lg` | Prominent labels |

## **18. Testing Considerations**

### **Unit Tests**

* Renders with correct variant class
* Renders with correct size class
* Renders children content
* Accepts className prop

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Long content
* Empty children
* Icon only

## **19. Out of Scope / Non-Goals**

* **Interactive**: Use Button for actions
* **Closable**: Compose with button
* **Animated**: Not built-in
* **Dot indicator**: Separate component

## **20. Related Components & System Context**

### **Used By**

* Cards
* Notifications
* Lists
* Tags

### **Siblings**

* `Avatar`
* `Button`

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Default variant | variant: default | Base |
| `Primary` | Primary | variant: primary | Blue |
| `Success` | Success | variant: success | Green |
| `Warning` | Warning | variant: warning | Yellow |
| `Danger` | Danger | variant: danger | Red |
| `Info` | Info | variant: info | Blue-info |
| `Outline` | Outline | variant: outline | Border only |
| `Sizes` | All sizes | sm, md, lg | Size comparison |

### **Controls (Args) Required**

* `variant` (select) – Badge variant
* `size` (select) – Badge size
* `children` (text) – Badge content

### **Mocking Requirements**

*None – stateless component*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Check color contrast
* Verify content readable

### **Interaction Tests**

* None – static component
