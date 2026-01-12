# Component: Dashboard

## Description
CMS admin dashboard providing an overview of content statistics, quick actions for common tasks, and recent activity feed.

## Location
`src/components/cms/Dashboard.tsx`

## Props Interface
None - self-contained dashboard component.

## Data Requirements

### Stat Card Props
```typescript
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  href?: string;
}
```

### Quick Action Props
```typescript
interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}
```

## Dependencies

### Icons
- `lucide-react` - FileText, FolderOpen, Tags, Blocks, Plus, TrendingUp

### Libraries
- `next/link` - Navigation

## Styling
- **CSS Module**: `Dashboard.module.scss`

## Features
- Stats grid with key metrics
- Trend indicators on stats
- Quick action cards
- Recent activity feed
- Activity type badges

## UI Sections

### Header Section
- "Dashboard" title
- Welcome subtitle

### Stats Grid
| Stat | Icon | Link |
|------|------|------|
| Total Posts | FileText | /admin/posts |
| Post Types | FolderOpen | /admin/post-types |
| Taxonomies | Tags | /admin/taxonomies |
| Block Templates | Blocks | /admin/blocks |

### Quick Actions Grid
| Action | Description | Link |
|--------|-------------|------|
| Create New Post | Start writing with Lexical editor | /admin/posts/new |
| Create Post Type | Define new content type | /admin/post-types/new |
| Create Taxonomy | Add new taxonomy | /admin/taxonomies/new |
| Create Block Template | Design reusable blocks | /admin/blocks/new |

### Recent Activity
- Activity list with:
  - User name
  - Action type (created/updated/published)
  - Item name
  - Time ago
  - Action badge

## Child Components
- `StatCard` - Displays individual statistic
- `QuickAction` - Displays quick action link

## Related Components
- Parent: CMS admin layout
- Links to: PostsList, PostTypesList, TaxonomiesList, BlockTemplatesList
