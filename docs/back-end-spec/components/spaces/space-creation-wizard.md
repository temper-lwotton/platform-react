# Component: SpaceCreationWizard

## Description
Main wizard component for creating new spaces. Features a 6-step process including template selection, branding, privacy settings, structure building, invites, and final review with auto-save functionality.

## Location
`src/components/spaces/SpaceCreationWizard.tsx`

## Props Interface
None - top-level wizard component.

## Data Requirements

### SpaceData Type
```typescript
interface SpaceData {
  // Step 1: Template
  templateId: string;

  // Step 2: Branding
  name: string;
  subtitle: string;
  description: string;
  handle: string;
  icon: string;
  coverImage: string;
  colorPalette: string[];

  // Step 3: Privacy
  visibility: 'public' | 'private' | 'unlisted';
  joinSetting: 'open' | 'request' | 'invite';
  inDirectory: boolean;
  tags: string[];
  searchIndexing: boolean;

  // Step 4: Structure
  channels: Channel[];
  categories: string[];

  // Step 5: Invite
  invites: {
    email: string;
    role: 'admin' | 'moderator' | 'member';
    name?: string;
    avatar?: string;
    userId?: string;
  }[];
  welcomeMessage: string;

  // Meta
  createdAt: string;
  isDraft: boolean;
}
```

### Channel Type
```typescript
interface Channel {
  id: string;
  name: string;
  description: string;
  icon: string;
  isDefault?: boolean;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `currentStep` | `Step` | Current wizard step |
| `completedSteps` | `Step[]` | Completed steps for navigation |
| `useAIDefaults` | `boolean` | AI defaults toggle |
| `spaceData` | `SpaceData` | Full space configuration |

## Dependencies

### Hooks
- `next/navigation` - useRouter

### Icons
- `lucide-react` - ArrowLeft, ArrowRight, Check, Save, Sparkles, Zap

### Libraries
- None

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleNext` | Next button | Advances to next step |
| `handlePrevious` | Previous button | Goes to previous step |
| `handleSaveDraft` | Save Draft button | Saves to localStorage |
| `handleCreateSpace` | Create button | Creates space and redirects |

## Styling
- **CSS Module**: `SpaceCreationWizard.module.scss`

## Features
- 6-step wizard flow
- Visual progress stepper
- Auto-save draft every 30 seconds
- Load draft on mount (if < 7 days old)
- AI defaults option
- Step validation before proceeding
- Click completed steps to navigate back

## Wizard Steps

| Step | Component | Validation |
|------|-----------|------------|
| template | TemplateSelector | templateId required |
| branding | SpaceBrandingForm | name and description required |
| privacy | SpacePrivacySettings | Always valid (has defaults) |
| structure | SpaceStructureBuilder | At least 1 channel |
| invite | SpaceInviteFlow | Optional (skip allowed) |
| review | SpacePreview | Always valid |

## UI Sections

### Header
- Back button
- Title and subtitle
- Save Draft button
- Use AI Defaults button

### Progress Stepper
- Step circles with check/number
- Step labels and descriptions
- Connecting lines (completed state)
- Click to navigate (completed steps only)

### Content Area
- Renders current step component
- Passes spaceData and setSpaceData

### Footer
- Previous button
- Step counter
- Next/Create Space button

## Auto-Save Behavior
```typescript
// Save every 30 seconds if name exists
useEffect(() => {
  const saveInterval = setInterval(() => {
    if (spaceData.name) {
      localStorage.setItem('space-draft', JSON.stringify(spaceData));
    }
  }, 30000);
  return () => clearInterval(saveInterval);
}, [spaceData]);
```

## Draft Loading
```typescript
// Load draft if less than 7 days old
const draftAge = Date.now() - new Date(parsedDraft.createdAt).getTime();
if (draftAge < 7 * 24 * 60 * 60 * 1000) {
  setSpaceData(parsedDraft);
}
```

## localStorage Keys
- `space-draft` - Current space draft data

## Related Components
- Children: `TemplateSelector`, `SpaceBrandingForm`, `SpacePrivacySettings`, `SpaceStructureBuilder`, `SpaceInviteFlow`, `SpacePreview`
