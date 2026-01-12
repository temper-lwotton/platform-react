# Component: TemplateSelector

## Description
Template selection step for the space creation wizard. Offers 8 pre-defined templates with AI-powered suggestion based on natural language description.

## Location
`src/components/spaces/wizard/TemplateSelector.tsx`

## Props Interface

```typescript
interface TemplateSelectorProps {
  spaceData: SpaceData;
  setSpaceData: (data: SpaceData) => void;
  useAIDefaults: boolean;
}
```

## Data Requirements

### SpaceTemplate Type
```typescript
interface SpaceTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  channels: { id: string; name: string; description: string; icon: string }[];
  tags: string[];
  recommendedPrivacy: 'public' | 'private' | 'unlisted';
  recommendedJoinSetting: 'open' | 'request' | 'invite';
  useCases: string[];
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `aiInput` | `string` | User's description for AI |
| `aiSuggestion` | `SpaceTemplate \| null` | AI-recommended template |
| `showAIInput` | `boolean` | AI input visibility |

## Dependencies

### Icons
- `lucide-react` - Briefcase, Users, GraduationCap, PartyPopper, Network, Palette, Wrench, Sparkles, MessageSquare, FileText, Calendar, FolderKanban, LifeBuoy, Home

### Libraries
- None

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleTemplateSelect` | Card click | Selects template and updates spaceData |
| `handleAISuggest` | AI suggest button | Matches keywords to template |

## Styling
- **CSS Module**: `TemplateSelector.module.scss`

## Features
- 8 pre-defined templates
- AI assistant for suggestions
- Template preview cards
- Channel count display
- Use case badges
- Color-coded templates

## Available Templates

| ID | Name | Icon | Privacy | Use Cases |
|----|------|------|---------|-----------|
| team-workspace | Team Workspace | Briefcase | Private | Work teams, Remote teams |
| community-hub | Community Hub | Users | Public | Brand communities, Interest groups |
| learning-hub | Learning Hub | GraduationCap | Private | Online courses, Study groups |
| event-space | Event Space | PartyPopper | Unlisted | Conferences, Webinars |
| professional-network | Professional Network | Network | Private | Alumni groups, Associations |
| creator-fanclub | Creator Fan Club | Palette | Private | YouTubers, Podcasters |
| support-community | Support Community | LifeBuoy | Public | Customer support |
| custom | Custom Space | Wrench | Private | Custom use case |

## AI Suggestion Logic
```typescript
const handleAISuggest = () => {
  const input = aiInput.toLowerCase();

  if (input.includes('team') || input.includes('work')) {
    setAiSuggestion(templates[0]); // Team Workspace
  } else if (input.includes('community') || input.includes('brand')) {
    setAiSuggestion(templates[1]); // Community Hub
  }
  // ... more keyword matching
};
```

## Template Selection Effect
When a template is selected:
- Sets templateId
- Copies template channels
- Copies template tags
- Sets recommended visibility
- Sets recommended joinSetting
- Sets color palette

## UI Sections

### Header
- Title and description

### AI Section
- Toggle button
- Description textarea
- Get AI Suggestion button
- Suggestion result with recommendation

### Templates Grid
- Template cards with:
  - Icon with template color
  - Name and description
  - Channel count
  - Privacy recommendation
  - Use case badges
  - Selected indicator

## Related Components
- Parent: `SpaceCreationWizard`
- Next Step: `SpaceBrandingForm`
