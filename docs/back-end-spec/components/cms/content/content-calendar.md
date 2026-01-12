# Component: ContentCalendar

## Description
Visual calendar interface for content scheduling with support for post publishing, version switching, and unpublishing events. Features month navigation, event filtering, and AI-powered publishing time insights.

## Location
`src/components/cms/content/ContentCalendar.tsx`

## Props Interface
None - self-contained calendar component.

## Data Requirements

### Content Version Type
```typescript
interface ContentVersion {
  id: string;
  versionNumber: number;
  title: string;
  isActive: boolean;
  createdAt: string;
}
```

### Scheduled Event Type
```typescript
interface ScheduledEvent {
  id: string;
  postId: string;
  postTitle: string;
  type: 'publish' | 'version-switch' | 'unpublish';
  scheduledFor: string;
  version?: ContentVersion;
  fromVersion?: ContentVersion;
  toVersion?: ContentVersion;
  status: 'scheduled' | 'completed' | 'failed';
  category: string;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `currentDate` | `Date` | Currently displayed month |
| `selectedDate` | `Date \| null` | Selected day for event details |
| `viewMode` | `'month' \| 'week'` | Calendar view mode |
| `filterCategory` | `string` | Category filter |

## Dependencies

### Icons
- `lucide-react` - ChevronLeft, ChevronRight, Calendar, Plus, Clock, Eye, Edit, Send, AlertCircle, CheckCircle, Layers, ArrowRight, ArrowLeft, Sparkles, Filter

## Styling
- **CSS Module**: `ContentCalendar.module.scss`

## Features
- Month navigation with prev/next buttons
- "Today" quick navigation
- Category filter dropdown
- Calendar grid with event dots
- Event type indicators (publish, version-switch, unpublish)
- AI insights panel
- Events sidebar with details
- Version switch visualization

## UI Sections

### Header
- "Content Calendar" title
- Subtitle
- "Schedule Content" button

### AI Insights
- Optimal publishing times recommendation
- Upcoming version switch notifications

### Calendar Controls
- Previous/Next month buttons
- Current month/year display
- "Today" button
- Category filter dropdown

### Calendar Grid
- Day headers (Sun-Sat)
- Date cells with:
  - Day number
  - Event dots (color-coded by type)
  - "+X more" indicator for overflow
- Today highlighting
- Selected date highlighting

### Legend
- Publish (green dot)
- Version Switch (blue dot)
- Unpublish (gray dot)

### Events Sidebar
- Selected date display or "All Scheduled Events"
- "View All" button
- Event cards showing:
  - Event type badge
  - Category label
  - Post title
  - Scheduled time
  - Version switch details (from/to)
  - Edit/Preview buttons

## Event Type Icons
- Publish: Send icon
- Version Switch: Layers icon
- Unpublish: Eye icon

## Calendar Navigation
```typescript
const previousMonth = () => {
  setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
};

const nextMonth = () => {
  setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
};
```

## Related Components
- Parent: Admin layout
- See also: `ContentDashboard`, `VersionManager`
