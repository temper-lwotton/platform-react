# Component: OnboardingFlows

## Description
Admin interface for creating and managing member onboarding flows. Guide new members through their journey with task checklists, completion tracking, and AI-powered insights.

## Location
`src/components/cms/members/OnboardingFlows.tsx`

## Props Interface
None - self-contained admin page component.

## Data Requirements

### Onboarding Task Type
```typescript
interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  order: number;
  isRequired: boolean;
  estimatedTime?: string;
  completionRate: number;
  avgTimeToComplete?: string;
}
```

### Onboarding Flow Type
```typescript
interface OnboardingFlow {
  id: string;
  name: string;
  description: string;
  targetSegment: string;
  tasks: OnboardingTask[];
  stats: {
    totalMembers: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    avgCompletionTime: string;
    completionRate: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Flow Insight Type
```typescript
interface FlowInsight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  flowId: string;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `flows` | `OnboardingFlow[]` | All onboarding flows |
| `aiInsights` | `FlowInsight[]` | AI-generated insights |
| `expandedFlow` | `string \| null` | Flow with expanded tasks |

## Dependencies

### Icons
- `lucide-react` - Plus, CheckCircle2, AlertCircle, TrendingUp, Users, Target, Clock, Sparkles, Edit, Trash2, Copy, ChevronRight, BarChart3, Award

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleCreateFlow` | Create button | Opens create flow interface |
| `handleDuplicateFlow` | Duplicate button | Creates copy of flow |
| `handleEditFlow` | Edit button | Opens edit interface |
| `handleDeleteFlow` | Delete button | Deletes flow with confirmation |
| `toggleFlowExpansion` | Toggle tasks button | Shows/hides task list |

## Styling
- **CSS Module**: `OnboardingFlows.module.scss`

## Features
- Flow cards with stats
- Task list (expandable)
- Completion rate visualization
- AI insights panel
- Target segment display
- Create/edit/duplicate/delete flows
- Task metrics (completion rate, avg time)
- Required task indicators

## UI Sections

### Header
- "Onboarding Flows" title
- Subtitle
- "Create Flow" button

### Stats Overview
- Active flows count
- Members in flows
- Completed flows
- Average completion rate

### AI Insights Section
- Sparkles icon header
- Insight cards with:
  - Type icon (success/warning/info)
  - Title
  - Description
  - Linked flow

### Flows List
- Flow cards containing:
  - Flow name and description
  - Target segment badge
  - Task count
  - Action buttons (duplicate, edit, delete)

### Flow Stats
- Total members
- Completed count
- In progress count
- Completion percentage

### Progress Bar
- Overall completion visualization
- Average completion time

### Tasks Section (Expandable)
- Toggle button with task count
- Task list with:
  - Task number
  - Title
  - Required badge
  - Estimated time
  - Description
  - Completion rate bar
  - Average completion time

## Related Components
- Parent: Admin members section
- See also: `MemberProfile`, `MembersDirectory`
