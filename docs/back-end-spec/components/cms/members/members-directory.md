# Component: MembersDirectory

## Description
Admin listing page for managing community members. Displays members in grid or list view with segment filtering, search, bulk actions, and engagement metrics.

## Location
`src/components/cms/members/MembersDirectory.tsx`

## Props Interface
None - self-contained page component.

## Data Requirements

### Member Type
```typescript
type LifecycleStage = 'new' | 'active' | 'power_user' | 'at_risk' | 'inactive' | 'champion';
type MemberRole = 'admin' | 'moderator' | 'contributor' | 'member';

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: MemberRole;
  lifecycleStage: LifecycleStage;
  joinedDate: string;
  lastActive: string;
  stats: {
    posts: number;
    comments: number;
    likes: number;
    reputation: number;
  };
  engagementScore: number;
  onboardingProgress: number;
  tags: string[];
}
```

### Segment Type
```typescript
interface Segment {
  id: string;
  name: string;
  count: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `searchQuery` | `string` | Search input value |
| `selectedSegment` | `string` | Current segment filter |
| `selectedMembers` | `string[]` | IDs of selected members |
| `showFilters` | `boolean` | Advanced filters visibility |
| `viewMode` | `'grid' \| 'list'` | Display mode |

## Dependencies

### Hooks
- `useRouter` - Navigation

### Icons
- `lucide-react` - Users, Search, Filter, Download, Mail, Award, TrendingUp, TrendingDown, Clock, CheckCircle2, AlertCircle, Star, MessageSquare, Heart, Calendar, MoreVertical, UserPlus, Target, Zap, Shield, LayoutGrid, List

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleSelectAll` | Select all checkbox | Toggles all visible members selection |
| `handleSelectMember` | Member checkbox | Toggles individual member selection |
| `handleViewProfile` | View Profile button | Navigates to member profile |
| `handleBulkAction` | Bulk action button | Executes bulk action on selected |

## Styling
- **CSS Module**: `MembersDirectory.module.scss`

## Features
- Grid and list view modes
- Segment filtering tabs
- Search by name/email
- Bulk member selection
- Bulk actions (email, role, tag, export)
- Stats overview cards
- Member cards with engagement metrics
- Lifecycle stage badges
- Empty state handling

## UI Sections

### Header
- "Member Directory" title
- Subtitle
- Export button
- Invite Members button

### Stats Grid
- Total Members (with trend)
- Active Members (with trend)
- New This Week (with trend)
- Average Engagement (with trend)

### Segments Section
- Clickable segment cards:
  - All Members
  - New Members
  - Active
  - Power Users
  - Champions
  - At Risk
  - Inactive
- Each with icon, name, description, count

### Controls Bar
- Search input
- View mode toggle (grid/list)
- Filters button

### Bulk Actions Bar (when members selected)
- Selection count
- Select all checkbox
- Send Email button
- Assign Role button
- Add Tag button
- Export button

### Members Grid View
- Member cards with:
  - Checkbox
  - Avatar
  - Name and email
  - Lifecycle badge
  - Role badge
  - Stats (posts, comments, likes)
  - Engagement score bar
  - Onboarding progress (for new members)
  - Join date and last active
  - View Profile button

### Members List View
- Table headers
- Member rows with:
  - Checkbox
  - Avatar and info
  - Status badge
  - Activity stats
  - Engagement bar
  - Last active time
  - Actions (View Profile, menu)

### Empty State
- Users icon
- "No members found" message
- Suggestion to adjust filters

## Child Components
- `MemberRow` - List view row component
- `MemberCard` - Grid view card component

## Related Components
- Links to: `MemberProfile` (via View Profile)
- See also: `MemberAnalytics`, `MemberSegments`
