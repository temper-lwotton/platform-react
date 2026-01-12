# Component: SpacePrivacySettings

## Description
Privacy and discovery settings step for the space creation wizard. Configures visibility, join settings, directory listing, and search engine indexing options.

## Location
`src/components/spaces/wizard/SpacePrivacySettings.tsx`

## Props Interface

```typescript
interface SpacePrivacySettingsProps {
  spaceData: SpaceData;
  setSpaceData: (data: SpaceData) => void;
  useAIDefaults: boolean;
}
```

## Data Requirements
Uses SpaceData visibility, joinSetting, inDirectory, and searchIndexing properties.

## Dependencies

### Icons
- `lucide-react` - Globe, Lock, EyeOff, Check, Users, UserPlus, Mail, Sparkles

### Libraries
- None

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| Visibility click | Option card | Sets visibility |
| Join setting click | Option card | Sets joinSetting |
| Toggle inDirectory | Toggle button | Toggles directory listing |
| Toggle searchIndexing | Toggle button | Toggles search indexing |

## Styling
- **CSS Module**: `SpacePrivacySettings.module.scss`

## Features
- 3 visibility options with pros/cons
- 3 join setting options
- Directory listing toggle
- Search engine indexing toggle
- AI recommendation display
- Visual selection states

## Visibility Options

| ID | Icon | Name | Description |
|----|------|------|-------------|
| public | Globe | Public | Anyone can discover and view |
| private | Lock | Private | Only members can see content |
| unlisted | EyeOff | Unlisted | Hidden from search, link access |

### Visibility Pros/Cons

**Public**
- Pros: Maximum discoverability, SEO benefits, Grows organically
- Cons: Less control over members, Content is public

**Private**
- Pros: Full privacy control, Exclusive feel, Protected content
- Cons: Harder to discover, Requires invites/requests

**Unlisted**
- Pros: Shareable link, Some privacy, Easy to join
- Cons: Link can be shared, Not fully private

## Join Options

| ID | Icon | Name | Description |
|----|------|------|-------------|
| open | Users | Open | Anyone can join immediately |
| request | UserPlus | Request to Join | Users request, admins approve |
| invite | Mail | Invite Only | Only invited users can join |

## UI Sections

### Header
- Title and description

### Visibility Section
- Section title and description
- 3 option cards with:
  - Icon and name
  - Description
  - Recommended use case
  - Pros list
  - Cons list
  - Selected indicator

### Join Settings Section
- Section title and description
- 3 join option cards with:
  - Icon and name
  - Description
  - Recommendation
  - Selected indicator

### Discovery Settings Section
- Toggle options:
  - Show in Directory
  - Search Engine Indexing

### AI Recommendation
- Recommendation based on template choice
- Explains current configuration benefits

## Related Components
- Parent: `SpaceCreationWizard`
- Previous: `SpaceBrandingForm`
- Next: `SpaceStructureBuilder`
