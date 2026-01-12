# Component: WorkflowBuilder

## Description
Step-by-step workflow builder interface for creating automation workflows. Features trigger selection, condition configuration, action setup, and live visual preview.

## Location
`src/components/cms/workflows/WorkflowBuilder.tsx`

## Props Interface
None - self-contained builder component.

## Data Requirements

### Trigger Option Type
```typescript
interface TriggerOption {
  id: string;
  category: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}
```

### Condition Option Type
```typescript
interface ConditionOption {
  id: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'duration';
  operators: string[];
}
```

### Action Option Type
```typescript
interface ActionOption {
  id: string;
  category: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fields?: { name: string; type: string; placeholder?: string }[];
}
```

### Selected Condition Type
```typescript
interface SelectedCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}
```

### Selected Action Type
```typescript
interface SelectedAction {
  id: string;
  type: string;
  config: Record<string, string>;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `step` | `'metadata' \| 'trigger' \| 'conditions' \| 'actions' \| 'preview'` | Current builder step |
| `name` | `string` | Workflow name |
| `description` | `string` | Workflow description |
| `category` | `string` | Workflow category |
| `selectedTrigger` | `TriggerOption \| null` | Chosen trigger |
| `conditions` | `SelectedCondition[]` | Configured conditions |
| `actions` | `SelectedAction[]` | Configured actions |

## Dependencies

### Icons
- `lucide-react` - ArrowLeft, Zap, Target, CheckCircle2, Plus, Trash2, Play, Save, ArrowRight, FileText, Users, MessageSquare, Flag, Clock, Heart, Calendar, Bell, Mail, Shield, TrendingUp, Star, Award, Archive, Ban, AlertCircle, Sparkles

### Libraries
- `next/navigation` - useRouter

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleAddCondition` | Add condition button | Adds new condition row |
| `handleRemoveCondition` | Remove button | Removes condition |
| `handleUpdateCondition` | Field change | Updates condition config |
| `handleAddAction` | Action card click | Adds action |
| `handleRemoveAction` | Remove button | Removes action |
| `handleUpdateActionConfig` | Config field change | Updates action settings |
| `handleSave` | Save button | Saves workflow |
| `handleTest` | Test button | Simulates execution |

## Styling
- **CSS Module**: `WorkflowBuilder.module.scss`

## Features
- 4-step wizard (Info, Trigger, Conditions, Actions)
- Visual progress indicator
- Trigger selection by category
- Condition builder with operators
- Action selection with configuration
- Live preview panel
- Test workflow capability

## Builder Steps

### Step 1: Metadata
- Workflow name input
- Description textarea
- Category select (Content Curation, Onboarding, Moderation, Engagement, User Management)

### Step 2: Trigger Selection
Categories and triggers:
- **Content**: Post Created, Post Liked, Comment Added
- **Users**: User Joined, User Inactive
- **Moderation**: Content Flagged
- **Events**: Event Upcoming
- **Scheduled**: Time-Based

### Step 3: Conditions (Optional)
Available conditions:
- Like Count (number operators)
- Comment Count (number operators)
- Flag Count (number operators)
- User Role (is/is not)
- Time Elapsed (after/before/within)
- Content Quality Score (number operators)
- User Post Count (number operators)

### Step 4: Actions
Available actions:
- **Notifications**: Send In-App Notification, Send Email
- **Content**: Feature Content, Archive Content
- **Users**: Assign User Role
- **Moderation**: Auto-Moderate Content, Ban User
- **Tasks**: Create Task

Each action has configurable fields.

## UI Sections

### Header
- Back button
- Test Workflow button
- Save Workflow button

### Builder Panel (Left)
- Progress steps indicator
- Step content area

### Preview Panel (Right)
- Workflow name and description
- Visual flow diagram:
  - When (trigger)
  - If (conditions)
  - Then (actions)
- Empty state before configuration

## Related Components
- Return to: `WorkflowsDashboard`
- Parent: Admin workflows section
