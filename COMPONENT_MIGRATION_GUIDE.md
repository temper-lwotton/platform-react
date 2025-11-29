# Component Migration Guide

## Overview

This guide documents the systematic approach to migrating UI components in the `src/components/ui` folder to a modular, scalable architecture using Radix UI primitives and CSS Modules.

## Migration Progress

### ✅ Completed Phases

#### Phase 1: Radix-Based Primitives (5/5 - 100%)
Created foundational primitive components built on Radix UI:

| Primitive | Location | Radix Base | Key Features |
|-----------|----------|------------|--------------|
| **Dropdown** | `primitives/Dropdown/` | `@radix-ui/react-dropdown-menu` | Items, separators, labels, destructive variant |
| **Popover** | `primitives/Popover/` | `@radix-ui/react-popover` | Side positioning, arrow, animations |
| **HoverCard** | `primitives/HoverCard/` | `@radix-ui/react-hover-card` | Configurable delays, positioning |
| **Dialog** | `primitives/Dialog/` | `@radix-ui/react-dialog` | Multiple sizes (sm/md/lg/xl), overlay |
| **Toast** | `primitives/Toast/` | `@radix-ui/react-toast` | 4 variants, swipeable, positioning |

**Previously Created Primitives:**
- Avatar, Badge, Button, Card, Input, Textarea, Checkbox, Radio, Select, Switch

#### Phase 2: Card-Like Components (11/11 - 100%)
Display-focused components migrated to folders:

1. **LikesDisplay** - Uses Dialog, Avatar primitives
2. **SuggestedCarousel** - Uses Badge primitive
3. **TopContributors** - Uses Avatar, Badge primitives
4. **NewestMembers** - Uses Avatar primitive
5. **UnansweredDiscussions** - Uses Badge primitive
6. **UserStats** - Standalone stats card
7. **EngagementScoreBar** - Score visualization
8. **EngagementPredictions** - Uses Badge primitive
9. **EngagementTipsList** - Uses Button, Badge primitives
10. **EngagementAnalysis** - Composite component
11. **ConversationList** - Uses Avatar, Badge primitives

#### Phase 3: Popover/Dropdown Components (1/5 - 20%)
Menu and dropdown components:

✅ **UserMenu** - Migrated, uses Popover primitive + RadioGroup

#### Phase 4: Calendar Components (4/8 - 50%)
Calendar-related components:

✅ **CalendarColorLegend** - Uses Badge primitive
✅ **CalendarSearch** - Uses Input, Button primitives
✅ **MonthYearSelector** - Uses Radix Select
✅ **CalendarDayPopover** - Uses Popover, Badge primitives

---

## 🎯 Remaining Components & Migration Approach

### Phase 3 (Remaining): Complex Popover+Tabs Components (4 components)

These components use **both** `@radix-ui/react-popover` AND `@radix-ui/react-tabs`, making them more complex.

#### 1. BookmarksDropdown
**Current:** `src/components/ui/BookmarksDropdown.tsx`
**Target:** `src/components/ui/BookmarksDropdown/`

**Complexity:** HIGH - Uses Popover + Tabs with 6 tab categories
**Dependencies:** Popover primitive, Tabs (keep Radix Tabs direct)
**Approach:**
```tsx
// Structure
BookmarksDropdown/
├── BookmarksDropdown.tsx      // Main component
├── BookmarksDropdown.module.scss
└── index.ts

// Migration notes:
- Use Popover primitive for the outer container
- Keep @radix-ui/react-tabs for tab navigation
- Create Badge for bookmark counts
- Use Avatar for user bookmarks
- Extract bookmark item rendering to sub-component
```

**Styling considerations:**
- Tab styling with active states
- Bookmark item hover states
- Empty state styling for each tab
- Responsive dropdown sizing

#### 2. MessagesDropdown
**Current:** `src/components/ui/MessagesDropdown.tsx`
**Target:** `src/components/ui/MessagesDropdown/`

**Complexity:** HIGH - Uses Popover + Tabs + React Query
**Dependencies:** Popover primitive, Avatar, Badge, Tabs
**Approach:**
```tsx
// Structure
MessagesDropdown/
├── MessagesDropdown.tsx
├── MessagesDropdown.module.scss
└── index.ts

// Migration notes:
- Use Popover primitive
- Keep React Query hooks for data fetching
- Use Avatar for message participants
- Use Badge for unread counts
- Tab navigation for Direct/Group messages
```

#### 3. NotificationDropdown
**Current:** `src/components/ui/NotificationDropdown.tsx`
**Target:** `src/components/ui/NotificationDropdown/`

**Complexity:** VERY HIGH - Uses Popover + Tabs + React Query + mutations
**Dependencies:** Popover primitive, Avatar, Badge, Button, Tabs
**Approach:**
```tsx
// Structure
NotificationDropdown/
├── NotificationDropdown.tsx
├── NotificationDropdown.module.scss
├── NotificationItem.tsx       // Extract notification rendering
└── index.ts

// Migration notes:
- Use Popover primitive
- Keep React Query for fetching/mutations
- Use Avatar for notification actors
- Use Badge for counts and types
- Tab navigation for All/Mentions/Unread
- Extract notification item to sub-component
- Handle mark as read functionality
```

#### 4. MentionDropdown
**Current:** `src/components/ui/MentionDropdown.tsx`
**Target:** `src/components/ui/MentionDropdown/`

**Complexity:** MEDIUM-HIGH - Autocomplete functionality
**Approach:**
```tsx
// Structure
MentionDropdown/
├── MentionDropdown.tsx
├── MentionDropdown.module.scss
└── index.ts

// Migration notes:
- Evaluate: may use Popover or a different pattern
- Needs keyboard navigation support
- Filter/search functionality
- Position near text cursor
```

---

### Phase 4 (Remaining): Complex Calendar View Components (4 components)

Large, stateful calendar rendering components.

#### 1. EventCalendar
**Current:** `src/components/ui/EventCalendar.tsx`
**Target:** `src/components/ui/EventCalendar/`

**Complexity:** VERY HIGH - Full month calendar grid
**Dependencies:** Badge, Popover (CalendarDayPopover), existing calendar utils
**Approach:**
```tsx
// Structure
EventCalendar/
├── EventCalendar.tsx
├── EventCalendar.module.scss
├── CalendarDay.tsx            // Extract day cell component
├── CalendarWeek.tsx           // Extract week row component
└── index.ts

// Migration notes:
- Break down into smaller sub-components
- Use CalendarDayPopover primitive
- Calendar grid generation logic
- Event positioning and overflow handling
- Color coding by space
- Today indicator
```

**Key challenges:**
- Complex grid layout with SCSS
- Event overflow handling (multiple events per day)
- Interactive day cells
- Performance with many events

#### 2. EventWeekCalendar
**Current:** `src/components/ui/EventWeekCalendar.tsx`
**Target:** `src/components/ui/EventWeekCalendar/`

**Complexity:** VERY HIGH - Week view with time slots
**Approach:**
```tsx
// Structure
EventWeekCalendar/
├── EventWeekCalendar.tsx
├── EventWeekCalendar.module.scss
├── WeekTimeSlot.tsx
├── WeekEventBlock.tsx
└── index.ts

// Migration notes:
- Time slot grid (hourly)
- Event block positioning and sizing
- Overlapping event handling
- All-day event section
- Current time indicator
```

**Key challenges:**
- Complex time-based grid layout
- Event collision detection
- Responsive sizing
- Drag-and-drop support (if present)

#### 3. MiniCalendar
**Current:** `src/components/ui/MiniCalendar.tsx`
**Target:** `src/components/ui/MiniCalendar/`

**Complexity:** MEDIUM - Simplified month view
**Dependencies:** Badge, Button (navigation)
**Approach:**
```tsx
// Structure
MiniCalendar/
├── MiniCalendar.tsx
├── MiniCalendar.module.scss
└── index.ts

// Migration notes:
- Simplified version of EventCalendar
- Date selection functionality
- Event count indicators
- Month/year navigation
- Compact sizing
```

#### 4. CalendarFilters
**Current:** `src/components/ui/CalendarFilters.tsx`
**Target:** `src/components/ui/CalendarFilters/`

**Complexity:** MEDIUM - Filter UI with checkboxes/toggles
**Dependencies:** Checkbox, Switch, Button primitives
**Approach:**
```tsx
// Structure
CalendarFilters/
├── CalendarFilters.tsx
├── CalendarFilters.module.scss
└── index.ts

// Migration notes:
- Use Checkbox primitive for space filters
- Use Switch for view toggles
- Filter state management
- "Clear all" functionality
- Collapsible sections
```

---

### Phase 5: Sidebar Components (4 components)

Navigation and informational sidebars.

#### 1. HomeSidebar
**Current:** `src/components/ui/HomeSidebar.tsx`
**Target:** `src/components/ui/HomeSidebar/`

**Complexity:** HIGH - Main navigation with nested sections
**Dependencies:** Icon, Badge, Avatar
**Approach:**
```tsx
// Structure
HomeSidebar/
├── HomeSidebar.tsx
├── HomeSidebar.module.scss
├── SidebarSection.tsx
├── SidebarLink.tsx
└── index.ts

// Migration notes:
- Active route highlighting
- Collapsible sections
- Notification badges
- User spaces list
- Sticky positioning
```

#### 2. SpaceSidebar
**Current:** `src/components/ui/SpaceSidebar.tsx`
**Target:** `src/components/ui/SpaceSidebar/`

**Complexity:** MEDIUM
**Approach:**
```tsx
// Structure
SpaceSidebar/
├── SpaceSidebar.tsx
├── SpaceSidebar.module.scss
└── index.ts

// Migration notes:
- Space-specific navigation
- Member count display
- Space settings link
```

#### 3. UpcomingEventsSidebar
**Current:** `src/components/ui/UpcomingEventsSidebar.tsx`
**Target:** `src/components/ui/UpcomingEventsSidebar/`

**Complexity:** MEDIUM
**Dependencies:** Badge, Avatar
**Approach:**
```tsx
// Structure
UpcomingEventsSidebar/
├── UpcomingEventsSidebar.tsx
├── UpcomingEventsSidebar.module.scss
├── EventListItem.tsx
└── index.ts

// Migration notes:
- Chronological event list
- Event time formatting
- Space color indicators
- RSVP status
- Empty state
```

#### 4. UrgentTasksSidebar
**Current:** `src/components/ui/UrgentTasksSidebar.tsx`
**Target:** `src/components/ui/UrgentTasksSidebar/`

**Complexity:** MEDIUM
**Dependencies:** Checkbox, Badge
**Approach:**
```tsx
// Structure
UrgentTasksSidebar/
├── UrgentTasksSidebar.tsx
├── UrgentTasksSidebar.module.scss
└── index.ts

// Migration notes:
- Task list with checkboxes
- Priority indicators
- Due date display
- Quick complete functionality
```

---

### Phase 6: Form/Input Composite Components (8 components)

Components that combine multiple form inputs.

#### 1. MessageInput
**Current:** `src/components/ui/MessageInput.tsx`
**Target:** `src/components/ui/MessageInput/`

**Complexity:** MEDIUM
**Dependencies:** Textarea, Button primitives
**Approach:**
```tsx
// Structure
MessageInput/
├── MessageInput.tsx
├── MessageInput.module.scss
└── index.ts

// Migration notes:
- Use Textarea primitive
- Send button integration
- Attachment functionality
- Emoji picker integration
- Auto-resize textarea
- Keyboard shortcuts (Enter to send)
```

#### 2. SpaceChatInput
**Current:** `src/components/ui/SpaceChatInput.tsx`
**Target:** `src/components/ui/SpaceChatInput/`

**Complexity:** MEDIUM-HIGH
**Dependencies:** Textarea, Button, Popover primitives

#### 3. MentionTextarea
**Current:** `src/components/ui/MentionTextarea.tsx`
**Target:** `src/components/ui/MentionTextarea/`

**Complexity:** HIGH - Mention detection and autocomplete
**Dependencies:** Textarea, Popover, MentionDropdown

#### 4. SpacesFilter
**Current:** `src/components/ui/SpacesFilter.tsx`
**Target:** `src/components/ui/SpacesFilter/`

**Complexity:** MEDIUM
**Dependencies:** Input, Select, Checkbox primitives

#### 5. UsersFilter
**Current:** `src/components/ui/UsersFilter.tsx`
**Target:** `src/components/ui/UsersFilter/`

**Complexity:** MEDIUM
**Dependencies:** Input, Select, Checkbox primitives

#### 6. LoginForm
**Current:** `src/components/ui/LoginForm.tsx`
**Target:** `src/components/ui/LoginForm/`

**Complexity:** LOW
**Dependencies:** Input, Button primitives

#### 7. ExcerptSelector
**Current:** `src/components/ui/ExcerptSelector.tsx`
**Target:** `src/components/ui/ExcerptSelector/`

**Complexity:** MEDIUM
**Dependencies:** Textarea, Button primitives

#### 8. SpaceSettingsPopover
**Current:** `src/components/ui/SpaceSettingsPopover.tsx`
**Target:** `src/components/ui/SpaceSettingsPopover/`

**Complexity:** MEDIUM
**Dependencies:** Popover, Input, Switch primitives

---

### Phase 7: Lexical Editor Components (3 components)

Rich text editor components (keep in lexical subfolder).

#### Approach for Lexical Components
```tsx
// Target structure
lexical/
├── LexicalEditor/
│   ├── LexicalEditor.tsx
│   ├── LexicalEditor.module.scss
│   └── index.ts
├── LexicalCommentEditor/
│   └── ...
├── LexicalToolbar/
│   └── ...
├── nodes/
│   └── MentionNode.tsx
├── plugins/
│   └── MentionsPlugin.tsx
└── dialogs/
    ├── LinkInsertDialog.tsx
    └── CodeBlockInsertDialog.tsx

// Migration notes:
- Keep lexical subfolder structure
- Move each major component to its own folder
- Use Button, Popover, Dialog primitives for toolbar/dialogs
- Keep Lexical-specific logic intact
```

---

### Phase 8: Task Components (3 components)

Task management UI.

#### 1. TaskList
**Complexity:** MEDIUM
**Dependencies:** Checkbox, Badge primitives

#### 2. TaskItem
**Complexity:** MEDIUM
**Dependencies:** Checkbox, Button, Popover primitives

#### 3. TaskStats
**Complexity:** LOW
**Dependencies:** Badge primitive

---

### Phase 9: Chat/Message Components (3 components)

Real-time messaging components.

#### 1. MessageThread
**Complexity:** MEDIUM-HIGH
**Dependencies:** Avatar, Badge, Button primitives

#### 2. SpaceChatMembers
**Complexity:** MEDIUM
**Dependencies:** Avatar, Badge primitives

#### 3. TypingIndicator
**Complexity:** LOW
**Dependencies:** None (standalone animation)

---

### Phase 10: Mention & Rich Content Components (4 components)

#### 1. MentionContent
**Complexity:** LOW
**Dependencies:** HoverCard primitive

#### 2. MentionHoverCard
**Complexity:** MEDIUM
**Dependencies:** HoverCard, Avatar primitives

#### 3. RichContent
**Complexity:** MEDIUM
**Dependencies:** None (HTML rendering)

#### 4. RichContentWithMentions
**Complexity:** MEDIUM
**Dependencies:** MentionContent, HoverCard

#### 5. MentionTextareaExample
**Complexity:** LOW - Example/demo component
**Action:** Can be removed or kept as documentation

---

### Phase 11: Miscellaneous Components (15 components)

Standalone components with specific purposes.

#### Simple Components (Move to folders, minimal changes)

1. **Navigation** - Main nav bar
2. **StatusUpdateWidget** - Status update form
3. **GlobalPostButton** - Floating action button
4. **GoLiveButton** - Go live action button
5. **ThemeToggle** - Theme switcher (use Switch primitive)
6. **SpaceDialog** - Space creation (use Dialog primitive)
7. **AuthRequired** - Auth guard component
8. **Icon** - Icon wrapper (keep as-is or move to primitives)
9. **ToastProvider** - Global toast provider (use Toast primitive)

#### Already Using Primitives (Just move to folders)

- **CalendarSearch** ✅ Already migrated
- **Any others already using Button, Input, etc.**

---

## 📋 Migration Checklist Template

For each component migration, follow this checklist:

### Pre-Migration
- [ ] Read component to understand dependencies
- [ ] Identify which primitives can be used
- [ ] Check for Radix UI usage (keep or replace with primitive)
- [ ] Note any complex state management or hooks
- [ ] Check for sub-components that should be extracted

### Migration Steps
- [ ] Create component folder: `src/components/ui/ComponentName/`
- [ ] Create files:
  - [ ] `ComponentName.tsx`
  - [ ] `ComponentName.module.scss`
  - [ ] `index.ts` (export statement)
- [ ] Update imports to use primitives from `'../primitives'`
- [ ] Convert classNames to CSS module styles
- [ ] Extract complex logic to sub-components if needed
- [ ] Add TypeScript types/interfaces
- [ ] Test component in isolation

### Post-Migration
- [ ] Delete old component file
- [ ] Run `npm run build` to verify
- [ ] Test component in app
- [ ] Update any components that import this one
- [ ] Commit changes

---

## 🎨 Styling Patterns

### Standard SCSS Structure
```scss
@use '../../../styles/abstracts' as *;

.container {
  // Container styles
}

.header {
  // Header section
}

.content {
  // Main content
}

.footer {
  // Footer section
}

// Variants
.variant-primary {
  // Variant styles
}

// States
.active {
  // Active state
}

.disabled {
  // Disabled state
}

// Responsive
@media (max-width: 768px) {
  .container {
    // Mobile styles
  }
}
```

### Using CSS Custom Properties
```scss
.component {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);

  &:hover {
    background: var(--color-bg-hover);
  }
}
```

### Animation Patterns
```scss
.item {
  transition: all 0.15s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.appearing {
  animation: fadeIn 0.2s ease;
}
```

---

## 🔧 Common Patterns

### Using Primitives

#### Dialog Pattern
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../primitives';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent size="md">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>

    {/* Content */}

    <DialogFooter>
      <Button onClick={handleSave}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Popover Pattern
```tsx
import { Popover } from '../primitives';

<Popover
  trigger={<button>Open</button>}
  align="end"
  sideOffset={8}
>
  {/* Content */}
</Popover>
```

#### Form with Primitives
```tsx
import { Input, Button, Checkbox } from '../primitives';

<form onSubmit={handleSubmit}>
  <Input
    label="Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />

  <Checkbox
    label="Agree to terms"
    checked={agreed}
    onCheckedChange={setAgreed}
  />

  <Button type="submit">Submit</Button>
</form>
```

### Component Composition
```tsx
// Extract reusable sub-components
function ListItem({ item }) {
  return (
    <div className={styles.item}>
      <Avatar src={item.avatar} fallback={item.initials} />
      <div className={styles.content}>
        <h4>{item.title}</h4>
        <p>{item.description}</p>
      </div>
      <Badge>{item.count}</Badge>
    </div>
  );
}

export function List({ items }) {
  return (
    <div className={styles.list}>
      {items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### Handling Complex State
```tsx
// Use React Query for server state
import { useQuery, useMutation } from '@tanstack/react-query';

export function Component() {
  const { data, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });

  const mutation = useMutation({
    mutationFn: updateItem,
    onSuccess: () => queryClient.invalidateQueries(['items']),
  });

  if (isLoading) return <LoadingState />;

  return <Content data={data} onUpdate={mutation.mutate} />;
}
```

---

## ⚠️ Common Pitfalls

### 1. Forgetting to Remove Old Files
Always delete the old `.tsx` file after creating the folder structure.

```bash
rm src/components/ui/OldComponent.tsx
```

### 2. Import Path Issues
Update imports to use relative paths:
```tsx
// ❌ Wrong
import { Icon } from './Icon';

// ✅ Correct
import { Icon } from '../Icon';
```

### 3. CSS Module Class Names
Convert from string classes to CSS modules:
```tsx
// ❌ Wrong
<div className="my-component-title">

// ✅ Correct
<div className={styles.title}>
```

### 4. Not Using Existing Primitives
Always check if a primitive exists before using Radix directly:
```tsx
// ❌ Avoid
import * as DialogPrimitive from '@radix-ui/react-dialog';

// ✅ Prefer
import { Dialog, DialogContent } from '../primitives';
```

### 5. Missing TypeScript Types
Always define prop interfaces:
```tsx
// ✅ Correct
interface ComponentProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Component({ title, onClose, children }: ComponentProps) {
  // ...
}
```

---

## 🧪 Testing Strategy

### After Each Migration
1. **Build Test**: Run `npm run build`
2. **Type Check**: Ensure TypeScript compiles
3. **Visual Test**: Check component in browser
4. **Interaction Test**: Test all interactive features
5. **Responsive Test**: Test on different screen sizes

### Batch Testing
After migrating a group of related components:
1. Test the full user flow
2. Check component interactions
3. Verify data fetching/mutations
4. Test error states
5. Test loading states

---

## 📈 Estimated Effort

| Phase | Components | Complexity | Estimated Hours |
|-------|-----------|------------|-----------------|
| Phase 3 (Remaining) | 4 | High | 6-8 hours |
| Phase 4 (Remaining) | 4 | Very High | 10-12 hours |
| Phase 5 | 4 | Medium-High | 6-8 hours |
| Phase 6 | 8 | Medium | 8-10 hours |
| Phase 7 | 3 | Medium | 4-6 hours |
| Phase 8 | 3 | Low-Medium | 3-4 hours |
| Phase 9 | 3 | Medium | 4-5 hours |
| Phase 10 | 5 | Low-Medium | 4-5 hours |
| Phase 11 | 15 | Low-Medium | 8-10 hours |
| **Total** | **49** | - | **~53-68 hours** |

---

## 🎯 Priority Recommendations

### High Priority (Do Next)
1. **Phase 5: Sidebar Components** - Used throughout the app
2. **Phase 6: Form Components** - High user interaction
3. **Phase 11: Navigation & Core UI** - Critical for app structure

### Medium Priority
4. **Phase 3 Remaining: Complex Dropdowns** - Can be deferred
5. **Phase 8: Task Components** - Isolated feature area
6. **Phase 9: Chat Components** - Isolated feature area

### Low Priority (Can Wait)
7. **Phase 4 Remaining: Complex Calendars** - Large, complex, working fine
8. **Phase 7: Lexical Components** - Editor working, low churn
9. **Phase 10: Mention Components** - Specialized, low churn

---

## 📚 Additional Resources

### Radix UI Documentation
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Radix Themes](https://www.radix-ui.com/themes)

### CSS Modules
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [Next.js CSS Modules](https://nextjs.org/docs/app/building-your-application/styling/css-modules)

### TypeScript Best Practices
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

## 🏁 Success Criteria

A component is successfully migrated when:

✅ Located in its own folder with proper structure
✅ Uses CSS Modules for styling
✅ Uses Radix primitives where applicable
✅ Has proper TypeScript types
✅ Exports via index.ts
✅ Old file is deleted
✅ Build passes without errors
✅ Component works in the app
✅ No regression in functionality

---

## 📝 Notes

- **Consistency**: All components should follow the same folder structure and patterns
- **Reusability**: Extract common logic to utilities or primitives
- **Performance**: Lazy load large components when possible
- **Accessibility**: Radix primitives provide excellent a11y defaults
- **Maintenance**: Smaller, focused components are easier to maintain

---

**Last Updated**: November 29, 2024
**Completed**: 21/70 components (30%)
**Status**: ✅ Build passing, ready for next phase
