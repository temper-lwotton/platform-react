# Component: BroadcastDesign

## Description
Step 3 of the broadcast wizard for designing email content using the visual EmailBuilder component.

## Location
`src/components/cms/broadcasts/steps/BroadcastDesign.tsx`

## Props Interface

```typescript
interface BroadcastDesignProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}
```

## Data Requirements

### Content Data
```typescript
interface DesignData {
  emailContent: any; // Email builder content object
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `emailContent` | `any` | Current email content from builder |

## Dependencies

### Components
- `EmailBuilder` - Visual email content creation

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleContentChange` | Builder change | Updates email content |
| `isValid` | Form validation | Checks content exists |

## Styling
- **CSS Module**: `Steps.module.scss`

## Features
- Step header with title and description
- Email builder wrapper
- Continue button (disabled until content exists)
- Full-width editor area

## Layout Structure

### Step Header
- Title: "Design Your Email"
- Description: "Create your email using the visual builder"

### Email Builder Section
- Full-width EmailBuilder component
- Handles content state internally

### Step Footer
- Continue button to proceed to review

## Validation
```typescript
const isValid = () => {
  return emailContent !== null;
};
```

## Related Components
- Parent: `BroadcastEditor`
- Child: `EmailBuilder`
- Previous: `BroadcastRecipients`
- Next: `BroadcastReview`
