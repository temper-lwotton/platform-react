# Component: FloatingModerationPanel

## Description
Floating keyboard-driven quick moderation panel accessible via Cmd+Shift+M. Provides rapid navigation and actions using keyboard shortcuts (j/k for navigation, a/r/f for actions).

## Location
`src/components/cms/moderation/FloatingModerationPanel.tsx`

## Props Interface
None - self-contained floating panel component.

## Data Requirements

### Flagged Item Type
```typescript
interface FlaggedItem {
  id: string;
  type: 'post' | 'comment' | 'reply';
  contentPreview: string;
  author: {
    name: string;
    avatar?: string;
  };
  flagReason: string;
  flaggedAt: string;
  priority: 'high' | 'medium' | 'low';
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `isOpen` | `boolean` | Panel visibility |
| `items` | `FlaggedItem[]` | Flagged items queue |
| `selectedIndex` | `number` | Currently selected item index |
| `isProcessing` | `boolean` | Action in progress |

## Dependencies

### Hooks
- `useFlaggedContent` - Fetch flagged items
- `useModerationAction` - Execute moderation actions

### Icons
- `lucide-react` - Shield, X, ChevronUp, ChevronDown, Check, Flag, Trash2, AlertTriangle

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `togglePanel` | Cmd+Shift+M | Opens/closes panel |
| `navigateUp` | k key or ↑ | Selects previous item |
| `navigateDown` | j key or ↓ | Selects next item |
| `handleApprove` | a key | Approves selected item |
| `handleReject` | r key | Rejects selected item |
| `handleFlag` | f key | Escalates/flags item |
| `handleClose` | Escape key | Closes panel |

## Styling
- **CSS Module**: `FloatingModerationPanel.module.scss`

## Features
- Keyboard shortcut activation (Cmd+Shift+M)
- Vim-style navigation (j/k)
- Quick action shortcuts
- Floating position (corner of screen)
- Item count indicator
- Priority indicators
- Compact item list
- Action confirmation feedback

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Cmd+Shift+M` | Toggle panel |
| `j` or `↓` | Next item |
| `k` or `↑` | Previous item |
| `a` | Approve |
| `r` | Reject |
| `f` | Flag/escalate |
| `Escape` | Close panel |
| `Enter` | View full item |

## UI Structure

### Panel Header
- Shield icon
- "Quick Moderation" title
- Item count badge
- Close button (X)

### Keyboard Hints
- Navigation hints (j/k)
- Action hints (a/r/f)

### Items List
- Scrollable compact list
- Selected item highlight
- Priority indicator
- Content preview
- Author name
- Flag reason

### Action Feedback
- Success/error toast
- Item removal animation

## Usage

The component attaches a global keyboard listener and renders as a fixed position overlay when activated.

```tsx
// In layout or app wrapper
<FloatingModerationPanel />
```

## Related Components
- See also: `ModerationQueue`, `InlineModerationControls`
