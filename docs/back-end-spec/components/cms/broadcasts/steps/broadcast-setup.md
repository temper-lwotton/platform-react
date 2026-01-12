# Component: BroadcastSetup

## Description
Step 1 of the broadcast wizard for configuring campaign details including name, subject line, preheader, and sender information.

## Location
`src/components/cms/broadcasts/steps/BroadcastSetup.tsx`

## Props Interface

```typescript
interface BroadcastSetupProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}
```

## Data Requirements

### Form Fields
```typescript
interface SetupData {
  name: string;        // Campaign name (internal)
  subject: string;     // Email subject line
  preheader?: string;  // Preview text (max 100 chars)
  fromName: string;    // Sender display name
  fromEmail: string;   // Sender email address
  replyTo?: string;    // Reply-to address (optional)
}
```

## Internal State
No internal state - fully controlled by parent via props.

## Dependencies

### Icons
- `lucide-react` - Mail, User

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleChange` | Input change | Updates form field via onUpdate |
| `isValid` | Form validation | Checks required fields |
| `onNext` | Continue button | Proceeds to next step |

## Styling
- **CSS Module**: `Steps.module.scss`

## Features
- Campaign name input with hint
- Email subject input with icon
- Preheader text with character limit (100)
- From name input with icon
- From email input with icon
- Reply-to email input (optional)
- Validation for required fields
- Continue button (disabled until valid)

## Form Sections

### Campaign Name
- Required field
- Internal reference name
- Placeholder: "e.g. Welcome Series - Week 1"

### Email Subject
- Required field
- Visible to recipients
- Mail icon prefix

### Preheader Text
- Optional field
- Max 100 characters
- Preview text in email clients

### Sender Information
- From Name (required) with User icon
- From Email (required) with Mail icon
- Reply-To (optional, defaults to From Email)

## Validation
```typescript
const isValid = () => {
  return data.name && data.subject && data.fromName && data.fromEmail;
};
```

## Related Components
- Parent: `BroadcastEditor`
- Next: `BroadcastRecipients`
