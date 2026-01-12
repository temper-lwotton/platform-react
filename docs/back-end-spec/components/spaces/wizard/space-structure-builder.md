# Component: SpaceStructureBuilder

## Description
Channel structure builder step for the space creation wizard. Allows adding, editing, deleting, and reordering channels with icon selection and default channel designation.

## Location
`src/components/spaces/wizard/SpaceStructureBuilder.tsx`

## Props Interface

```typescript
interface SpaceStructureBuilderProps {
  spaceData: SpaceData;
  setSpaceData: (data: SpaceData) => void;
  useAIDefaults: boolean;
}
```

## Data Requirements

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
| `newChannelName` | `string` | New channel name input |
| `newChannelDescription` | `string` | New channel description |
| `newChannelIcon` | `string` | Selected icon for new channel |
| `editingChannel` | `string \| null` | Channel ID being edited |

## Dependencies

### Icons
- `lucide-react` - Plus, GripVertical, Edit, Trash2, Sparkles, Hash

### Libraries
- None

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleAddChannel` | Add button | Creates new channel |
| `handleDeleteChannel` | Delete button | Removes channel |
| `handleSetDefaultChannel` | Set Default button | Marks channel as default |

## Styling
- **CSS Module**: `SpaceStructureBuilder.module.scss`

## Features
- Channel list from template
- Add new channels
- Delete channels
- Set default channel
- Icon picker
- Drag handle for reordering (visual only)
- Channel count display
- AI tips

## Channel Icons
`['💬', '📢', '📁', '❓', '✨', '🎉', '📚', '🔧', '💡', '🎯', '📊', '🎨']`

## Channel Creation
```typescript
const handleAddChannel = () => {
  if (!newChannelName) return;

  const newChannel = {
    id: Date.now().toString(),
    name: newChannelName,
    description: newChannelDescription,
    icon: newChannelIcon,
  };

  setSpaceData({
    ...spaceData,
    channels: [...spaceData.channels, newChannel],
  });

  // Reset form
  setNewChannelName('');
  setNewChannelDescription('');
  setNewChannelIcon('💬');
};
```

## UI Sections

### Header
- Title and description

### Layout (Two Columns)

#### Channels List
- Section header with count
- Template source hint
- Empty state (if no channels)
- Channel cards with:
  - Drag handle
  - Icon
  - Name with Hash prefix
  - Description
  - Default badge (if default)
  - Actions: Set as Default, Edit, Delete

#### Add Channel Section
- Section header
- Add channel form:
  - Icon picker grid
  - Channel name input with Hash prefix
  - Description textarea
  - Add Channel button

### AI Tip
- Recommendation about starting with 3-5 channels

## Related Components
- Parent: `SpaceCreationWizard`
- Previous: `SpacePrivacySettings`
- Next: `SpaceInviteFlow`
