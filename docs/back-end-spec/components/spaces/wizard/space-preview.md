# Component: SpacePreview

## Description
Final review and launch step for the space creation wizard. Displays complete space preview with all configured settings and provides launch, schedule, and save draft options.

## Location
`src/components/spaces/wizard/SpacePreview.tsx`

## Props Interface

```typescript
interface SpacePreviewProps {
  spaceData: SpaceData;
  onEdit: (step: 'template' | 'branding' | 'privacy' | 'structure' | 'invite') => void;
  onCreate: () => void;
}
```

## Data Requirements
Uses complete SpaceData from wizard.

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `launching` | `boolean` | Launch in progress state |
| `showScheduler` | `boolean` | Schedule launch modal visibility |

## Dependencies

### Icons
- `lucide-react` - Edit, Check, Sparkles, Rocket, Calendar, Save, Globe, Lock, EyeOff, Hash, Mail, CheckCircle

### Libraries
- None

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleLaunch` | Launch button | Sets launching, calls onCreate |
| `onEdit` | Edit buttons | Navigates to specific step |
| Schedule click | Schedule button | Shows scheduler modal |

## Styling
- **CSS Module**: `SpacePreview.module.scss`

## Features
- Full visual preview card
- Editable sections with navigation
- Success checklist
- Multiple launch options
- Visibility icon helper

## Visibility Icons
```typescript
const getVisibilityIcon = () => {
  switch (spaceData.visibility) {
    case 'public': return <Globe />;
    case 'private': return <Lock />;
    case 'unlisted': return <EyeOff />;
  }
};
```

## UI Sections

### Header
- Title and description

### Layout (Two Columns)

#### Preview Card
- Cover image (if set)
- Space icon with gradient
- Space name
- Subtitle (if set)
- Description (if set)
- Meta info (visibility, channels, invites)
- Preview "Join Space" button

#### Details Panel

**Space Details Section**
- Edit button (→ branding)
- Name, URL, Tagline display

**Privacy Section**
- Edit button (→ privacy)
- Visibility, Join Setting, In Directory

**Channels Section**
- Edit button (→ structure)
- Channel count
- First 5 channels with icons
- "+X more" indicator

**Invites Section** (if invites exist)
- Edit button (→ invite)
- Invite count
- First 3 invites with roles
- "+X more" indicator

**Success Checklist**
- Sparkles icon
- "Your Space is Ready!" message
- Checklist items:
  - Template selected & configured
  - Identity & branding set
  - Privacy settings configured
  - X channels created

**Launch Actions**
- Launch Space Now button (Rocket icon)
- Schedule Launch button (Calendar icon)
- Save as Draft button (Save icon)

## Launch Behavior
```typescript
const handleLaunch = () => {
  setLaunching(true);
  onCreate();
};
```

## Related Components
- Parent: `SpaceCreationWizard`
- Previous: `SpaceInviteFlow`
- Navigates to: All previous steps via onEdit
