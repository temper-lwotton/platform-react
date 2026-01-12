# Component: MemberProfile

## Description
Detailed individual member profile view with engagement stats visualization, activity timeline, onboarding progress, and administrative actions. Provides comprehensive member management capabilities.

## Location
`src/components/cms/members/MemberProfile.tsx`

## Props Interface

```typescript
interface MemberProfileProps {
  memberId: string;
}
```

## Data Requirements

### Member Type
```typescript
interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'admin' | 'moderator' | 'contributor' | 'member';
  lifecycleStage: 'new' | 'active' | 'power_user' | 'champion' | 'at_risk' | 'inactive';
  joinedDate: string;
  lastActive: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  stats: {
    posts: number;
    comments: number;
    likes: number;
    likesReceived: number;
    reputation: number;
  };
  engagementScore: number;
  onboardingProgress: number;
  tags: string[];
}
```

### Activity Event Type
```typescript
interface ActivityEvent {
  id: string;
  type: 'post' | 'comment' | 'like' | 'follow' | 'achievement' | 'milestone';
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `member` | `Member \| null` | Member data |
| `activities` | `ActivityEvent[]` | Recent activity timeline |
| `showEditModal` | `boolean` | Edit profile modal visibility |
| `showActionMenu` | `boolean` | Admin action menu visibility |

## Dependencies

### Hooks
- `useMember` - Fetch member data
- `useMemberActivity` - Fetch activity timeline
- `useUpdateMemberRole` - Role change mutation
- `useBanMember` - Ban mutation

### Icons
- `lucide-react` - User, Mail, MapPin, Link, Calendar, MessageSquare, Heart, Award, TrendingUp, Clock, Edit, MoreVertical, Shield, Ban

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleEditProfile` | Edit button | Opens edit modal |
| `handleChangeRole` | Role dropdown | Changes member role |
| `handleBanMember` | Ban action | Bans the member |
| `handleSendMessage` | Message button | Opens direct message |

## Styling
- **CSS Module**: `MemberProfile.module.scss`

## Features
- Profile header with avatar
- Contact information
- Social links
- Engagement score visualization (circular chart)
- Stats cards (posts, comments, likes, reputation)
- Activity timeline
- Onboarding progress (for new members)
- Role management
- Tag management
- Admin actions (ban, warn, message)

## UI Sections

### Profile Header
- Large avatar
- Name and role badge
- Lifecycle stage badge
- Location
- Member since date
- Last active

### Contact Section
- Email
- Website
- Social links

### Stats Grid
- Posts count
- Comments count
- Likes given
- Likes received
- Reputation points

### Engagement Score
- Circular progress visualization
- Percentage display
- Trend indicator

### Onboarding Progress
- Progress bar
- Completed tasks list
- Pending tasks

### Activity Timeline
- Chronological activity list
- Activity type icons
- Timestamps
- Load more button

### Admin Actions Panel
- Edit profile button
- Change role dropdown
- Add/remove tags
- Send message
- Warn user
- Ban user

## Related Components
- Parent: `MembersDirectory`
- See also: `MemberAnalytics`, `MemberSegments`
