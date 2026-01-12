# Component: AutoModerationRules

## Description
Admin interface for creating and managing automated moderation rules. Supports various triggers (spam patterns, toxicity scores, new user detection) and actions (auto-approve, auto-reject, flag for review).

## Location
`src/components/cms/moderation/AutoModerationRules.tsx`

## Props Interface
None - self-contained admin page component.

## Data Requirements

### Moderation Rule Type
```typescript
interface ModerationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'spam_pattern' | 'toxicity_score' | 'new_user' | 'keyword' | 'link_count' | 'reputation_threshold';
    config: Record<string, unknown>;
  };
  action: {
    type: 'auto_approve' | 'auto_reject' | 'flag_for_review' | 'require_approval' | 'shadowban';
    config?: Record<string, unknown>;
  };
  isActive: boolean;
  priority: number;
  stats: {
    triggered: number;
    actioned: number;
    falsePositives: number;
  };
  createdAt: string;
  updatedAt: string;
}
```

### Trigger Types
```typescript
type TriggerType =
  | 'spam_pattern'      // Match known spam patterns
  | 'toxicity_score'    // AI toxicity threshold
  | 'new_user'          // Account age threshold
  | 'keyword'           // Blocked word list
  | 'link_count'        // Max links per post
  | 'reputation_threshold'; // Min reputation required
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `rules` | `ModerationRule[]` | All moderation rules |
| `showCreateModal` | `boolean` | Create rule modal visibility |
| `editingRule` | `ModerationRule \| null` | Rule being edited |
| `filterActive` | `boolean \| null` | Filter by active status |

## Dependencies

### Icons
- `lucide-react` - Shield, Plus, Edit, Trash2, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle, Target, Zap

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleCreateRule` | Create button | Opens create modal |
| `handleEditRule` | Edit button | Opens edit modal with rule |
| `handleDeleteRule` | Delete button | Deletes rule with confirmation |
| `handleToggleActive` | Toggle button | Activates/deactivates rule |
| `handleSaveRule` | Save in modal | Creates or updates rule |

## Styling
- **CSS Module**: `AutoModerationRules.module.scss`

## Features
- Rule list with stats
- Create/edit rule modal
- Trigger type selector
- Action type selector
- Priority ordering
- Active/inactive toggle
- Performance metrics (triggered, actioned, false positives)
- Rule testing capability

## UI Sections

### Header
- "Auto-Moderation Rules" title
- "Create Rule" button

### Rules List
- Rule cards showing:
  - Name and description
  - Trigger type badge
  - Action type badge
  - Stats (triggers, actions, false positives)
  - Active toggle
  - Edit/Delete buttons

### Create/Edit Modal
- Name input
- Description textarea
- Trigger type dropdown
- Trigger configuration fields
- Action type dropdown
- Action configuration fields
- Priority input
- Active checkbox

## Trigger Configuration

### Spam Pattern
- Pattern regex input
- Case sensitivity toggle

### Toxicity Score
- Threshold slider (0-100)
- Categories to check

### New User
- Account age threshold (days)
- Post count threshold

### Keyword
- Blocked words list
- Match whole word toggle

### Link Count
- Maximum links allowed

### Reputation Threshold
- Minimum reputation required

## Related Components
- Parent: Admin moderation settings
- See also: `ModerationQueue`, `ModerationAnalytics`
