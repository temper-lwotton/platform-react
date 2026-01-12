# Component: SignatureField

## Description
Canvas-based signature input field allowing users to draw their signature with mouse or touch. Outputs signature as base64 PNG data URL.

## Location
`src/components/form-builder/fields/SignatureField.tsx`

## Props Interface

```typescript
interface SignatureFieldProps {
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}
```

## Data Requirements
Value is stored as base64 PNG data URL.

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `isDrawing` | `boolean` | Currently drawing state |
| `isEmpty` | `boolean` | Whether canvas has content |

## Dependencies

### Components
- `Button` - Clear button

### Icons
- `lucide-react` - RotateCcw

### Libraries
- None (uses native Canvas API)

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `startDrawing` | Mouse/touch down | Begins stroke |
| `draw` | Mouse/touch move | Continues stroke |
| `stopDrawing` | Mouse/touch up/leave | Ends stroke, saves |
| `clearSignature` | Clear button | Clears canvas |

## Styling
- **CSS Module**: `SignatureField.module.scss`

## Features
- Canvas drawing support
- Mouse and touch input
- Existing signature loading
- Base64 PNG output
- Clear/reset functionality
- Placeholder text
- Disabled state support

## Canvas Configuration
```typescript
<canvas
  ref={canvasRef}
  width={600}
  height={200}
  // Event handlers
/>
```

## Drawing Logic

### Start Drawing
```typescript
const startDrawing = (e) => {
  const ctx = canvas.getContext('2d');
  setIsDrawing(true);
  setIsEmpty(false);

  const rect = canvas.getBoundingClientRect();
  const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
  const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

  ctx.beginPath();
  ctx.moveTo(x, y);
};
```

### Continue Drawing
```typescript
const draw = (e) => {
  if (!isDrawing) return;
  const ctx = canvas.getContext('2d');

  ctx.lineTo(x, y);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
};
```

### Stop Drawing
```typescript
const stopDrawing = () => {
  setIsDrawing(false);
  const dataUrl = canvas.toDataURL('image/png');
  onChange?.(dataUrl);
};
```

## Load Existing Signature
```typescript
useEffect(() => {
  if (value && canvasRef.current) {
    const ctx = canvasRef.current.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      setIsEmpty(false);
    };
    img.src = value;
  }
}, []);
```

## Clear Signature
```typescript
const clearSignature = () => {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setIsEmpty(true);
  onChange?.('');
};
```

## UI Structure
```tsx
<div className={styles.signatureField}>
  <canvas ... />
  {isEmpty && (
    <div className={styles.placeholder}>Sign here</div>
  )}
  <div className={styles.actions}>
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={clearSignature}
      disabled={isEmpty || disabled}
    >
      <RotateCcw size={16} />
      Clear
    </Button>
  </div>
</div>
```

## Related Components
- Parent: `FieldRenderer`
