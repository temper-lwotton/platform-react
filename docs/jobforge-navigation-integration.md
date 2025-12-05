# JobForge - Navigation Integration Guide

## 1. HomeSidebar Integration

JobForge will be added as a new section in your existing HomeSidebar navigation, positioned underneath the Calendar section.

### Updated Navigation Structure

```
┌─────────────────────────────────────┐
│         Home Sidebar                │
├─────────────────────────────────────┤
│                                     │
│  🏠 Dashboard                       │
│  📅 Calendar                        │
│  💡 Suggestions                     │
│                                     │
│  ✨ JobForge (NEW)                  │  ← New section added here
│     ├─ 📊 Overview                  │
│     ├─ ➕ Create New                │
│     ├─ 📝 My Drafts (3)             │
│     ├─ ⏳ Awaiting Approval (2)     │
│     ├─ ✅ Approved                  │
│     └─ 📋 Templates                 │
│                                     │
│  [Other existing sections...]       │
│                                     │
└─────────────────────────────────────┘
```

### Badge Indicators

The navigation items will show real-time counts:
- **My Drafts (3)** - Number of saved drafts
- **Awaiting Approval (2)** - Number of jobs pending manager review
- **Approved** - Jobs approved and ready to push

For managers, an additional badge will show:
- **Review Queue (5)** - Number of approval requests awaiting their review

---

## 2. Navigation Component Changes

### HomeSidebar.tsx Updates

```tsx
// HomeSidebar.tsx

import { JobForgeIcon } from '@/components/icons';
import { useJobForgeCounts } from '@/features/jobforge/hooks';

export function HomeSidebar() {
  const { draftsCount, awaitingApprovalCount, reviewQueueCount } = useJobForgeCounts();
  const { user } = useAuth();
  const isManager = user.role === 'manager';

  return (
    <aside className="sidebar">
      {/* Existing navigation items */}
      <NavItem icon={<HomeIcon />} label="Dashboard" to="/" />
      <NavItem icon={<CalendarIcon />} label="Calendar" to="/calendar" />
      <NavItem icon={<SuggestionsIcon />} label="Suggestions" to="/suggestions" />

      {/* JobForge Section */}
      <NavSection label="JobForge" icon={<JobForgeIcon />} defaultExpanded>
        <NavItem
          icon={<OverviewIcon />}
          label="Overview"
          to="/jobforge"
        />

        <NavItem
          icon={<PlusIcon />}
          label="Create New"
          to="/jobforge/create"
          variant="primary"  // Highlighted as primary action
        />

        <NavItem
          icon={<DraftsIcon />}
          label="My Drafts"
          to="/jobforge/drafts"
          badge={draftsCount}
        />

        <NavItem
          icon={<ClockIcon />}
          label="Awaiting Approval"
          to="/jobforge/awaiting-approval"
          badge={awaitingApprovalCount}
          badgeVariant="warning"
        />

        {isManager && (
          <NavItem
            icon={<ReviewIcon />}
            label="Review Queue"
            to="/jobforge/review-queue"
            badge={reviewQueueCount}
            badgeVariant="urgent"
          />
        )}

        <NavItem
          icon={<CheckIcon />}
          label="Approved"
          to="/jobforge/approved"
        />

        <NavItem
          icon={<TemplateIcon />}
          label="Templates"
          to="/jobforge/templates"
        />
      </NavSection>

      {/* Other existing sections */}
    </aside>
  );
}
```

### NavSection Component

For collapsible navigation sections:

```tsx
interface NavSectionProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

function NavSection({ label, icon, children, defaultExpanded = false }: NavSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="nav-section">
      <button
        className="nav-section-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="nav-section-icon">{icon}</span>
        <span className="nav-section-label">{label}</span>
        <ChevronIcon direction={isExpanded ? 'down' : 'right'} />
      </button>

      {isExpanded && (
        <div className="nav-section-items">
          {children}
        </div>
      )}
    </div>
  );
}
```

---

## 3. Routing Structure

### Route Configuration

```tsx
// routes.tsx

import { lazy } from 'react';

const JobForgeDashboard = lazy(() => import('@/features/jobforge/pages/JobForgeDashboard'));
const CreateJob = lazy(() => import('@/features/jobforge/pages/CreateJob'));
const EditJob = lazy(() => import('@/features/jobforge/pages/EditJob'));
const MyDrafts = lazy(() => import('@/features/jobforge/pages/MyDrafts'));
const AwaitingApproval = lazy(() => import('@/features/jobforge/pages/AwaitingApproval'));
const ReviewQueue = lazy(() => import('@/features/jobforge/pages/ReviewQueue'));
const Approved = lazy(() => import('@/features/jobforge/pages/Approved'));
const Templates = lazy(() => import('@/features/jobforge/pages/Templates'));

export const routes = [
  // Existing routes...

  // JobForge routes
  {
    path: '/jobforge',
    element: <JobForgeDashboard />,
  },
  {
    path: '/jobforge/create',
    element: <CreateJob />,
  },
  {
    path: '/jobforge/edit/:jobId',
    element: <EditJob />,
  },
  {
    path: '/jobforge/drafts',
    element: <MyDrafts />,
  },
  {
    path: '/jobforge/awaiting-approval',
    element: <AwaitingApproval />,
  },
  {
    path: '/jobforge/review-queue',
    element: <ReviewQueue />,
    permissions: ['approve_job'],  // Manager only
  },
  {
    path: '/jobforge/approved',
    element: <Approved />,
  },
  {
    path: '/jobforge/templates',
    element: <Templates />,
  },
];
```

---

## 4. Page Layouts with HomeSidebar

Each JobForge page will maintain the HomeSidebar layout:

```tsx
// JobForge page layout structure

┌────────────────────────────────────────────────────────────┐
│                     Top Navigation Bar                      │
├──────────────┬─────────────────────────────────────────────┤
│              │                                              │
│  HomeSidebar │         JobForge Page Content               │
│              │                                              │
│  - Dashboard │  ┌────────────────────────────────────────┐ │
│  - Calendar  │  │                                        │ │
│  - Suggestions│  │     Page-specific content here        │ │
│              │  │                                        │ │
│  ✨JobForge  │  │  (Dashboard, Create, Drafts, etc.)    │ │
│    Overview  │  │                                        │ │
│    Create    │  │                                        │ │
│    Drafts    │  │                                        │ │
│    Awaiting  │  │                                        │ │
│    Approved  │  └────────────────────────────────────────┘ │
│    Templates │                                              │
│              │                                              │
└──────────────┴─────────────────────────────────────────────┘
```

### Example Page Implementation

```tsx
// CreateJob.tsx

export default function CreateJob() {
  return (
    <MainLayout sidebar={<HomeSidebar />}>
      <PageHeader
        title="Create New Job"
        breadcrumbs={[
          { label: 'JobForge', to: '/jobforge' },
          { label: 'Create New', to: '/jobforge/create' },
        ]}
      />

      <JobComposer />
    </MainLayout>
  );
}
```

---

## 5. Mobile Navigation

On mobile devices, the HomeSidebar collapses into a hamburger menu:

```
Mobile View (< 768px):

┌─────────────────────────────────────┐
│  ☰  JobForge - Create New      👤   │  ← Top bar with menu
├─────────────────────────────────────┤
│                                     │
│     [Mobile-optimized content]      │
│                                     │
│     JobComposer in single-column    │
│     layout with tabs                │
│                                     │
└─────────────────────────────────────┘

When ☰ is clicked:

┌─────────────────────────────────────┐
│  Navigation Menu              ✕     │
├─────────────────────────────────────┤
│  🏠 Dashboard                       │
│  📅 Calendar                        │
│  💡 Suggestions                     │
│                                     │
│  ✨ JobForge                        │
│     📊 Overview                     │
│     ➕ Create New                   │
│     📝 My Drafts (3)                │
│     ⏳ Awaiting Approval (2)        │
│     ✅ Approved                     │
│     📋 Templates                    │
│                                     │
└─────────────────────────────────────┘
```

---

## 6. Quick Actions

### Global Quick Action Menu

Add a quick create button to the top navigation:

```tsx
// TopNavigation.tsx

<div className="top-nav-actions">
  <QuickActionMenu>
    <QuickAction
      icon={<PlusIcon />}
      label="New Job Spec"
      to="/jobforge/create"
      shortcut="Ctrl+N"
    />
    {/* Other quick actions */}
  </QuickActionMenu>
</div>
```

### Keyboard Shortcut

```typescript
// Keyboard shortcuts
{
  'ctrl+n': () => navigate('/jobforge/create'),
  'g j': () => navigate('/jobforge'),  // Go to JobForge (vim-style)
}
```

---

## 7. Navigation State Management

### Track Active Route

```tsx
function useActiveRoute() {
  const location = useLocation();

  const isJobForgeActive = location.pathname.startsWith('/jobforge');
  const activeJobForgeSection = location.pathname.split('/')[2]; // create, drafts, etc.

  return {
    isJobForgeActive,
    activeJobForgeSection,
  };
}
```

### Highlight Active Nav Item

```tsx
<NavItem
  label="My Drafts"
  to="/jobforge/drafts"
  isActive={activeJobForgeSection === 'drafts'}
/>
```

---

## 8. Permission-Based Navigation

Show/hide navigation items based on user permissions:

```tsx
function JobForgeNav() {
  const { hasPermission } = usePermissions();

  return (
    <NavSection label="JobForge">
      {hasPermission('create_job') && (
        <NavItem label="Create New" to="/jobforge/create" />
      )}

      {hasPermission('approve_job') && (
        <NavItem label="Review Queue" to="/jobforge/review-queue" />
      )}

      {hasPermission('manage_templates') && (
        <NavItem label="Templates" to="/jobforge/templates" />
      )}
    </NavSection>
  );
}
```

---

## 9. Breadcrumbs

All JobForge pages should include breadcrumbs for easy navigation:

```tsx
// Example breadcrumbs for different pages

// Dashboard
Home > JobForge

// Create Job
Home > JobForge > Create New

// Edit Job
Home > JobForge > My Drafts > Edit: "Senior Software Engineer"

// Review Queue
Home > JobForge > Review Queue

// Templates
Home > JobForge > Templates > "Senior Developer Template"
```

### Breadcrumb Component

```tsx
<Breadcrumbs>
  <Breadcrumb to="/">Home</Breadcrumb>
  <Breadcrumb to="/jobforge">JobForge</Breadcrumb>
  <Breadcrumb to="/jobforge/drafts">My Drafts</Breadcrumb>
  <Breadcrumb current>Senior Software Engineer</Breadcrumb>
</Breadcrumbs>
```

---

## 10. Integration Checklist

- [ ] Add JobForge icon to icon library
- [ ] Update HomeSidebar component with JobForge section
- [ ] Implement collapsible NavSection component
- [ ] Add badge component for counts
- [ ] Set up routes for all JobForge pages
- [ ] Implement useJobForgeCounts hook
- [ ] Add permission checks to navigation
- [ ] Create mobile navigation variant
- [ ] Add keyboard shortcuts
- [ ] Implement breadcrumbs
- [ ] Test navigation on all screen sizes
- [ ] Add loading states for badge counts
- [ ] Implement active route highlighting

---

## 11. Visual Design Specs

### Navigation Item Styles

```scss
.nav-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &.active {
    background: var(--primary-50);
    color: var(--primary-600);
    font-weight: 600;
  }

  .icon {
    margin-right: 0.75rem;
    width: 1.25rem;
    height: 1.25rem;
  }

  .badge {
    margin-left: auto;
    padding: 0.125rem 0.5rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;

    &.warning {
      background: var(--amber-100);
      color: var(--amber-700);
    }

    &.urgent {
      background: var(--red-100);
      color: var(--red-700);
    }
  }
}
```

### Collapsed Section Styles

```scss
.nav-section {
  margin: 1rem 0;

  .nav-section-header {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.5rem 1rem;
    font-weight: 600;
    color: var(--gray-700);
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }

  .nav-section-items {
    padding-left: 1rem;
    margin-top: 0.25rem;
  }
}
```

---

## 12. Analytics Tracking

Track navigation usage:

```typescript
// Track when users navigate to JobForge sections
analytics.track('Navigation Click', {
  section: 'JobForge',
  destination: '/jobforge/create',
  source: 'sidebar',
});

// Track most used navigation items
analytics.track('Most Used JobForge Sections', {
  overview: clickCount,
  createNew: clickCount,
  drafts: clickCount,
});
```

---

## 13. Loading States

While fetching badge counts:

```tsx
<NavItem
  label="My Drafts"
  to="/jobforge/drafts"
  badge={
    isLoadingCounts ? (
      <Spinner size="sm" />
    ) : (
      draftsCount
    )
  }
/>
```

---

## 14. Notifications Integration

Show notification dots for new activity:

```tsx
<NavItem
  label="Review Queue"
  to="/jobforge/review-queue"
  badge={reviewQueueCount}
  hasNewActivity={hasNewApprovals}  // Red dot indicator
/>
```

```scss
.nav-item {
  position: relative;

  &.has-new-activity::before {
    content: '';
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 0.5rem;
    height: 0.5rem;
    background: var(--red-500);
    border-radius: 50%;
    border: 2px solid white;
  }
}
```

---

This completes the navigation integration guide for JobForge!
