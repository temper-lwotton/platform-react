# Component: RatingField

## Description
Star rating input field with hover preview and click-to-select functionality. Displays current rating value with configurable maximum stars.

## Location
`src/components/form-builder/fields/RatingField.tsx`

## Props Interface

```typescript
interface RatingFieldProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
}
```

## Data Requirements
No external data requirements - controlled component.

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `hover` | `number \| null` | Currently hovered star |

## Dependencies

### Icons
- `lucide-react` - Star

### Libraries
- None

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `onClick` | Star click | Sets rating value |
| `onMouseEnter` | Star hover | Shows hover preview |
| `onMouseLeave` | Mouse leave | Clears hover preview |

## Styling
- **CSS Module**: `RatingField.module.scss`

## Features
- Configurable max stars (default 5)
- Hover preview
- Filled/empty star icons
- Current rating text display
- Disabled state support
- Accessible labels

## Star Rendering
```typescript
{Array.from({ length: max }, (_, i) => i + 1).map((star) => (
  <button
    key={star}
    type="button"
    className={`${styles.star} ${
      star <= (hover ?? value) ? styles.filled : ''
    }`}
    onClick={() => !disabled && onChange?.(star)}
    onMouseEnter={() => !disabled && setHover(star)}
    onMouseLeave={() => setHover(null)}
    aria-label={`Rate ${star} out of ${max}`}
    disabled={disabled}
  >
    <Star
      size={24}
      fill={star <= (hover ?? value) ? 'currentColor' : 'none'}
    />
  </button>
))}
```

## Rating Display
```tsx
{value > 0 && (
  <span className={styles.ratingText}>
    {value} / {max}
  </span>
)}
```

## Visual States
- Default: Outline stars
- Hovered: Filled stars up to hover position
- Selected: Filled stars up to value
- Disabled: Reduced opacity, no interactions

## Related Components
- Parent: `FieldRenderer`
- Uses: `Star` icon from lucide-react
