# **Component Specification: HoverCard**

## **1. Component Name**

**`HoverCard`**

## **2. Description**

A floating preview card built on Radix UI HoverCard primitive.

* Displays additional content when hovering over a trigger
* Configurable delays for open and close
* Includes arrow pointer
* Used for quick previews without clicking

## **3. Location**

```
src/components/ui/primitives/HoverCard/HoverCard.tsx
```

## **4. Component Type**

**UI** – Presentational component managed by Radix UI.

## **5. Props Interface**

```typescript
interface HoverCardProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  openDelay?: number;
  closeDelay?: number;
  className?: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `trigger` | `ReactNode` | Yes | - | Element that triggers hover |
| `children` | `ReactNode` | Yes | - | Card content |
| `align` | `'start' \| 'center' \| 'end'` | No | `'center'` | Horizontal alignment |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | No | `'bottom'` | Placement side |
| `sideOffset` | `number` | No | `8` | Distance from trigger |
| `openDelay` | `number` | No | `200` | Delay before opening (ms) |
| `closeDelay` | `number` | No | `100` | Delay before closing (ms) |

## **7. Data Requirements**

*No external data – purely presentational.*

## **8. Internal State**

*None – managed by Radix UI.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Hover trigger | Card opens (after delay) | Content visible |
| Move to card | Card stays open | Continue viewing |
| Leave trigger/card | Card closes (after delay) | Auto-dismiss |
| Focus trigger | Card opens | Keyboard accessible |

## **10. Dependencies**

### **External Libraries**

* `@radix-ui/react-hover-card`

## **11. Events & Callbacks**

*No external callbacks.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `HoverCard.module.scss`

### **CSS Classes**

* `.content` – Card container
* `.arrow` – Arrow pointer

## **13. Accessibility Requirements**

* **Mouse**: Hover triggers card
* **Keyboard**: Focus triggers card
* **Motion**: Respects reduced motion preferences
* **Screen Reader**: Content accessible

### **Improvements Needed**

* None – Radix provides full accessibility

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Invalid side | Default to 'bottom' | No error |
| Invalid delay | Use defaults | No error |

## **15. Performance & Lifecycle Notes**

### **Delay Configuration**

```tsx
// Longer delay for complex content
<HoverCard
  trigger={<span>@johndoe</span>}
  openDelay={300}  // Wait longer before showing
  closeDelay={200} // Give time to move to card
>
  <UserProfile />
</HoverCard>
```

### **Use Cases**

* User profile previews on @mentions
* Link previews
* Image previews
* Quick info cards
* Tooltip-like content (for rich content)

## **16. Usage Examples**

### **User Preview on Hover**

```tsx
import { HoverCard } from '@/components/ui/primitives/HoverCard';

<HoverCard
  trigger={<span className={styles.mention}>@johndoe</span>}
  openDelay={300}
>
  <div className={styles.userPreview}>
    <Avatar src={user.avatar} size="lg" />
    <h4>{user.name}</h4>
    <p>{user.bio}</p>
    <div className={styles.stats}>
      <span>{user.followers} followers</span>
      <span>{user.posts} posts</span>
    </div>
    <Button variant="outline" size="sm">View Profile</Button>
  </div>
</HoverCard>
```

### **Link Preview**

```tsx
<HoverCard
  trigger={<a href={link.url}>{link.title}</a>}
  side="top"
>
  <div className={styles.linkPreview}>
    <img src={link.thumbnail} alt="" />
    <h4>{link.title}</h4>
    <p>{link.description}</p>
    <span className={styles.domain}>{link.domain}</span>
  </div>
</HoverCard>
```

### **Quick Actions**

```tsx
<HoverCard
  trigger={<span>{item.name}</span>}
  openDelay={500}
  closeDelay={200}
>
  <div className={styles.quickActions}>
    <Button variant="ghost" size="sm">Edit</Button>
    <Button variant="ghost" size="sm">Share</Button>
    <Button variant="ghost" size="sm">Delete</Button>
  </div>
</HoverCard>
```

## **17. Features Summary**

### **HoverCard vs Tooltip**

| Component | Use Case |
|-----------|----------|
| `HoverCard` | Rich content, interactive elements |
| Tooltip | Simple text descriptions |

### **Positioning**

| Side | Placement |
|------|-----------|
| `top` | Above trigger |
| `right` | Right of trigger |
| `bottom` | Below trigger (default) |
| `left` | Left of trigger |

### **Timing**

| Setting | Default | Purpose |
|---------|---------|---------|
| `openDelay` | 200ms | Prevent accidental opens |
| `closeDelay` | 100ms | Allow moving to card |

## **18. Testing Considerations**

### **Unit Tests**

* Opens on hover (after delay)
* Closes on leave (after delay)
* Opens on focus
* Content renders correctly
* Positioning works

### **Mocking**

* Timer mocks for delay testing

### **Edge Cases**

* Quick hover (< openDelay)
* Move between trigger and card
* Focus then blur
* Near viewport edge

## **19. Out of Scope / Non-Goals**

* **Click trigger**: Use Popover
* **Action menus**: Use Dropdown
* **Simple text**: Use Tooltip
* **Modal content**: Use Dialog

## **20. Related Components & System Context**

### **Used By**

* `MentionHoverCard`
* User mentions
* Link previews

### **Siblings**

* `Popover`
* `Dropdown`

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Basic card | Bottom placement | Base state |
| `UserPreview` | User profile | Rich content | Use case |
| `LinkPreview` | URL preview | Image + text | Use case |
| `CustomDelays` | Long delays | openDelay: 500 | Slow open |
| `Sides` | All sides | top, right, bottom, left | Positioning |

### **Controls (Args) Required**

* `side` (select) – Placement side
* `align` (select) – Horizontal alignment
* `sideOffset` (number) – Distance from trigger
* `openDelay` (number) – Open delay ms
* `closeDelay` (number) – Close delay ms

### **Mocking Requirements**

* Timer mocks

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify focus triggers card
* Check reduced motion
* Verify content accessible

### **Interaction Tests**

* Hover to open
* Leave to close
* Move between trigger and card
* Focus trigger
