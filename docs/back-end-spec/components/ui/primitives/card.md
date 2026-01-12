# **Component Specification: Card**

## **1. Component Name**

**`Card`**

## **2. Description**

A container component for consistent card-based layouts.

* Provides base card styling with multiple variants
* Includes optional hover effects
* Features sub-components for header, content, and footer sections
* Supports semantic HTML elements

## **3. Location**

```
src/components/ui/primitives/Card.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component.

## **5. Props Interface**

### **Card (Main)**

```typescript
interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  as?: 'div' | 'article' | 'section';
  children: React.ReactNode;
}

type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost';
```

### **Card Sections**

```typescript
interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `CardVariant` | No | `'default'` | Visual style variant |
| `hoverable` | `boolean` | No | `false` | Enable hover effects |
| `as` | `'div' \| 'article' \| 'section'` | No | `'div'` | HTML element type |
| `children` | `ReactNode` | Yes | - | Card content |
| `className` | `string` | No | `''` | Additional CSS classes |

## **7. Data Requirements**

*No external data – purely presentational.*

## **8. Internal State**

*None – stateless components.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `variant === 'default'` | Standard card | Background + border |
| `variant === 'elevated'` | Shadow card | Elevated shadow |
| `variant === 'outlined'` | Border card | Subtle border |
| `variant === 'ghost'` | Minimal card | No background |
| `hoverable === true` | Hover effects | Shadow/lift on hover |

## **10. Dependencies**

### **External Libraries**

* React `forwardRef`

## **11. Events & Callbacks**

*No custom events – inherits HTMLElement events.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Card.module.scss`

### **CSS Classes**

* `.card` – Base card styles
* `.card--default`, `.card--elevated`, `.card--outlined`, `.card--ghost` – Variants
* `.card--hoverable` – Hover state
* `.cardHeader` – Header section
* `.cardContent` – Main content section
* `.cardFooter` – Footer section

## **13. Accessibility Requirements**

* **Semantic**: Use `article` for content cards
* **Keyboard**: Children focusable via Tab
* **Screen Reader**: Semantic structure

### **Improvements Needed**

* None – semantic HTML provides accessibility

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Invalid variant | Default to 'default' | No error |
| Invalid `as` | Default to 'div' | No error |

## **15. Performance & Lifecycle Notes**

### **Composition Pattern**

```tsx
// Cards composed using sub-components
<Card variant="elevated" hoverable>
  <CardHeader>Header content</CardHeader>
  <CardContent>Main content</CardContent>
  <CardFooter>Footer content</CardFooter>
</Card>
```

## **16. Usage Examples**

### **Basic Card with Sections**

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/primitives/Card';

<Card variant="elevated" hoverable>
  <CardHeader>
    <h3>Card Title</h3>
    <Badge variant="success">New</Badge>
  </CardHeader>
  <CardContent>
    <p>Card content goes here with any components needed.</p>
  </CardContent>
  <CardFooter>
    <Button variant="ghost">Cancel</Button>
    <Button variant="primary">Save</Button>
  </CardFooter>
</Card>
```

### **Simple Card**

```tsx
<Card variant="outlined">
  <p>Simple card content without header or footer.</p>
</Card>
```

### **Article Card**

```tsx
<Card as="article" variant="default" hoverable>
  <CardHeader>
    <Avatar src={author.avatar} size="sm" />
    <span>{author.name}</span>
  </CardHeader>
  <CardContent>
    <h2>{post.title}</h2>
    <p>{post.excerpt}</p>
  </CardContent>
</Card>
```

### **Ghost Card**

```tsx
<Card variant="ghost" hoverable>
  <CardContent>
    Subtle card that becomes visible on hover
  </CardContent>
</Card>
```

## **17. Features Summary**

### **Exported Components**

| Component | Purpose |
|-----------|---------|
| `Card` | Main card container |
| `CardHeader` | Header section |
| `CardContent` | Main content section |
| `CardFooter` | Footer section |

### **Variants**

| Variant | Use Case |
|---------|----------|
| `default` | Standard content cards |
| `elevated` | Featured or highlighted items |
| `outlined` | Subtle separation, list items |
| `ghost` | Minimal styling, hover reveal |

## **18. Testing Considerations**

### **Unit Tests**

* Renders correct variant class
* Renders correct element type
* Hoverable adds correct class
* Children render correctly
* Sections render correctly

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Very long content
* No sections
* All sections present
* Nested cards

## **19. Out of Scope / Non-Goals**

* **Click handling**: Add via wrapper
* **Loading state**: Compose with skeleton
* **Collapsible**: Separate component
* **Drag and drop**: Separate functionality

## **20. Related Components & System Context**

### **Used By**

* `DiscussionCard`
* `EventCard`
* `SpaceCard`
* `UserCard`

### **Siblings**

* Other layout primitives

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Default variant | variant: default | Base state |
| `Elevated` | Shadow card | variant: elevated | Prominent |
| `Outlined` | Border card | variant: outlined | Subtle |
| `Ghost` | Minimal | variant: ghost | No background |
| `Hoverable` | With hover | hoverable: true | Lift effect |
| `WithSections` | All sections | Header, Content, Footer | Complete |
| `AsArticle` | Article element | as: article | Semantic |

### **Controls (Args) Required**

* `variant` (select) – Card variant
* `hoverable` (boolean) – Hover effect
* `as` (select) – Element type
* `children` (text) – Card content

### **Mocking Requirements**

*None – stateless component*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify semantic structure
* Check heading hierarchy

### **Interaction Tests**

* Hover state
* Click on children
