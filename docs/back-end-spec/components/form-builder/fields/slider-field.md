# Component: SliderField

## Description
Range slider input field using Radix UI Slider primitive. Displays current value with min/max range indicator.

## Location
`src/components/form-builder/fields/SliderField.tsx`

## Props Interface

```typescript
interface SliderFieldProps {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}
```

## Data Requirements
No external data requirements - controlled component.

## Dependencies

### Icons
- None

### Libraries
- `@radix-ui/react-slider` - Slider components

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `onValueChange` | Slider drag | Updates value |

## Styling
- **CSS Module**: `SliderField.module.scss`

## Features
- Configurable min/max range
- Configurable step increment
- Current value display
- Range indicator
- Accessible thumb
- Disabled state support

## Default Values
| Prop | Default |
|------|---------|
| min | 0 |
| max | 100 |
| step | 1 |
| disabled | false |

## Render Structure
```tsx
<div className={styles.sliderWrapper}>
  <Slider.Root
    className={styles.sliderRoot}
    value={[value]}
    onValueChange={(values) => onChange?.(values[0])}
    min={min}
    max={max}
    step={step}
    disabled={disabled}
  >
    <Slider.Track className={styles.sliderTrack}>
      <Slider.Range className={styles.sliderRange} />
    </Slider.Track>
    <Slider.Thumb className={styles.sliderThumb} aria-label="Value" />
  </Slider.Root>
  <div className={styles.sliderValue}>
    <span className={styles.currentValue}>{value}</span>
    <span className={styles.range}>({min} - {max})</span>
  </div>
</div>
```

## Radix Slider Components
| Component | Purpose |
|-----------|---------|
| Slider.Root | Main slider container |
| Slider.Track | Background track element |
| Slider.Range | Filled portion of track |
| Slider.Thumb | Draggable handle |

## Related Components
- Parent: `FieldRenderer`
- Uses: Radix UI Slider primitive
