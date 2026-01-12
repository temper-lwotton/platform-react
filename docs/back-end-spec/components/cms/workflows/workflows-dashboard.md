# Component: WorkflowsDashboard

## Description
Admin dashboard for managing automation workflows. Displays active workflows, AI suggestions, templates, recent executions, and workflow cards with visual flow representation.

## Location
`src/components/cms/workflows/WorkflowsDashboard.tsx`

## Props Interface
None - self-contained dashboard component.

## Data Requirements

### Workflow Type
```typescript
type TriggerType = 'post_created' | 'user_joined' | 'post_liked' | 'comment_flagged' | 'user_inactive' | 'time_based';
type ConditionType = 'like_count' | 'user_role' | 'content_quality' | 'time_elapsed' | 'flag_count';
type ActionType = 'send_notification' | 'feature_content' | 'assign_role' | 'auto_moderate' | 'send_email' | 'create_task';

interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: { type: TriggerType; label: string };
  conditions: { type: ConditionType; label: string }[];
  actions: { type: ActionType; label: string }[];
  stats: {
    totalExecutions: number;
    successRate: number;
    lastRun?: string;
    avgExecutionTime: string;
  };
  createdAt: string;
  category: string;
}
```

### Workflow Template Type
```typescript
interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  estimatedImpact: string;
}
```

### Recent Execution Type
```typescript
interface RecentExecution {
  id: string;
  workflowName: string;
  status: 'success' | 'failed' | 'running';
  timestamp: string;
  details: string;
}
```

### AI Suggestion Type
```typescript
interface AIsuggestion {
  id: string;
  title: string;
  description: string;
  rationale: string;
  confidence: 'high' | 'medium';
  template?: string;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `activeWorkflows` | `Workflow[]` | All workflows |
| `showTemplates` | `boolean` | Templates section expanded |
| `showSuggestions` | `boolean` | AI suggestions visible |

## Dependencies

### Icons
- `lucide-react` - Zap, Plus, Play, Pause, Settings, Copy, Trash2, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle, ChevronRight, Sparkles, Brain, Users, FileText, Flag, Bell, Target, ArrowRight

### Libraries
- `next/navigation` - useRouter

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleToggleWorkflow` | Toggle button | Activates/pauses workflow |
| `handleEditWorkflow` | Edit button | Navigates to builder |
| `handleDeleteWorkflow` | Delete button | Deletes with confirmation |

## Styling
- **CSS Module**: `WorkflowsDashboard.module.scss`

## Features
- Stats overview (active count, executions, success rate, time saved)
- AI-powered workflow suggestions
- Workflow templates library
- Recent executions log
- Visual workflow flow display
- Workflow cards with stats and actions

## UI Sections

### Header
- "Automation & Workflows" title
- "Create Workflow" button

### Stats Grid
- Active Workflows
- Total Executions
- Avg Success Rate
- Time Saved

### AI Suggestions Section (dismissable)
- Brain icon header
- Suggestion cards with:
  - Confidence badge
  - Title and description
  - Rationale explanation
  - "Create This Workflow" button

### Templates Section (expandable)
- Template count
- Template cards with:
  - Icon
  - Name and description
  - Estimated impact
  - "Use Template" button

### Recent Executions Section
- Execution items with:
  - Status icon (success/failed/running)
  - Workflow name
  - Timestamp
  - Details

### Workflows List
- Workflow cards (see WorkflowCard component)

## Child Components

### WorkflowCard
Displays individual workflow with:
- Name and description
- Category badge
- Active/Paused toggle
- Visual flow (When → If → Then)
- Stats (executions, success rate, last run, avg time)
- Actions (Edit, Duplicate, Delete)

## Related Components
- Links to: `WorkflowBuilder`
- Parent: Admin workflows section
