# Component: ContentDashboard

## Description
Content management dashboard with AI-powered insights for content moderation. Displays post statistics, AI moderation flags, and a filterable list of all content with status indicators.

## Location
`src/components/cms/content/ContentDashboard.tsx`

## Props Interface
None - self-contained dashboard component.

## Data Requirements

### Post Type
```typescript
interface Post {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  status: 'published' | 'pending' | 'scheduled' | 'draft' | 'flagged';
  publishedAt?: string;
  scheduledFor?: string;
  views: number;
  comments: number;
  likes: number;
  aiFlags?: AIFlag[];
  category: string;
}

interface AIFlag {
  type: 'spam' | 'inappropriate' | 'toxicity' | 'quality';
  confidence: number;
  reason: string;
}
```

### AI Insight Type
```typescript
interface AIInsight {
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  action?: string;
  count?: number;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `selectedFilter` | `string` | Status filter ('all', 'published', etc.) |
| `searchQuery` | `string` | Search text |

## Dependencies

### Icons
- `lucide-react` - FileText, AlertTriangle, Calendar, Eye, MessageSquare, TrendingUp, Clock, CheckCircle, XCircle, Edit, Trash2, MoreVertical, Sparkles, Users, Heart, Share2, Flag, Filter, Search

## Styling
- **CSS Module**: `ContentDashboard.module.scss`

## Features
- Stats grid with key metrics
- AI-powered insights section
- Content list with search and filters
- Status-based filtering tabs
- AI moderation flags on flagged content
- Approve/Remove actions for flagged content
- Post engagement stats (views, comments, likes)

## UI Sections

### Header
- "Content Management" title
- Subtitle
- "Create Post" button

### Stats Grid
- Total Posts
- Pending Moderation (warning style)
- Scheduled
- Drafts
- Avg. Views
- Flagged by AI (danger style)

### AI Insights
- Sparkles icon header
- Grid of insight cards
- Types: warning, success, info
- Optional action buttons
- Count badges

### Content Filters
- Search input
- Status filter tabs (All, Published, Flagged, Scheduled, Drafts)

### Posts List
Each post card shows:
- Author avatar and info
- Post title and metadata
- Engagement stats (views, comments, likes)
- Status badge (color-coded)
- Action buttons (Edit, More)
- AI flags section (for flagged posts)

### AI Flags Display
- Sparkles header
- Flag type and confidence
- Reason explanation
- Approve/Remove/Review buttons

## Status Styling
- Published: Green (CheckCircle)
- Pending: Yellow (Clock)
- Scheduled: Blue (Calendar)
- Draft: Gray (Edit)
- Flagged: Red (Flag)

## Related Components
- Parent: Admin layout
- Links to: `ContentComposer`, Post editor
