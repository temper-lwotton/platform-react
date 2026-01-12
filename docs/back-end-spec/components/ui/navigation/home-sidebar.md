# **Component Specification: HomeSidebar**

## **1. Component Name**

**`HomeSidebar`**

## **2. Description**

The main navigation sidebar for authenticated users on home pages.

* Displays primary navigation links (Feed, Suggestions, Tasks, Calendar)
* Shows user's spaces with activity badges
* Includes resources section with help links
* Provides quick settings per space via popover
* Used on feed and other non-space protected pages

## **3. Location**

```
src/components/ui/HomeSidebar/HomeSidebar.tsx
```

## **4. Component Type**

**Feature** – Fetches user data and manages space display with interactive elements.

## **5. Props Interface**

```typescript
// No props - uses internal state and queries
```

## **6. Props**

*No props – component fetches data internally.*

## **7. Data Requirements**

### **External Data Sources**

| Source | Hook/Function | Returns |
|--------|---------------|---------|
| Query | `['current-user']` via `fetchCurrentUser` | Current user with space IDs |
| Query | `['user-spaces', userSpaceIds]` via `getSpace` | Full space details |
| Function | `getCurrentUserId()` | Current user ID |

### **User Data Type**

```typescript
// From fetchCurrentUser
interface CurrentUser {
  id: string;
  adminSpaces: Space[];
  memberSpaces: Space[];
}
```

### **Space Data Type**

```typescript
// From getSpace
interface Space {
  id: string | number;
  title: string;
  // ... other space properties
}
```

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `currentUserId` | `string \| null` | `null` | Current user ID from auth |
| `isClient` | `boolean` | `false` | Client-side hydration check |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Default | Full sidebar with sections | Normal state |
| `isClient === false` | Null or skeleton | SSR protection |
| Spaces loading | Loading state | Spinner or skeleton |
| No spaces | Empty state message | Helpful guidance |
| `spaces.length > 10` | First 10 + "View all" | Limit shown |
| Current path matches link | Active styling | Highlighted link |

## **10. Dependencies**

### **Child Components**

* `Icon` – Navigation icons
* `SpaceSettingsPopover` – Space quick settings menu

### **External Libraries**

* `next/link`
* `next/navigation` (`usePathname`)
* `@tanstack/react-query`
* `@radix-ui/react-separator`

### **API Functions**

* `fetchCurrentUser` – Get current user with spaces
* `getSpace` – Get space details
* `getCurrentUserId` – Get auth user ID

## **11. Events & Callbacks**

*No external callbacks – navigation handled by Next.js Link.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `HomeSidebar.module.scss`

### **CSS Classes**

* `.sidebar` – Main container
* `.section` – Section wrapper
* `.sectionHeader` – Section title
* `.navItem` – Navigation link
* `.navItem--active` – Active state
* `.spaceItem` – Space row
* `.spaceIcon` – Colored letter icon
* `.activityBadge` – Activity count
* `.resourceItem` – Resource link

### **Layout**

* Primary navigation section
* My Spaces section
* Resources section
* Separators between sections

## **13. Accessibility Requirements**

* **Keyboard**: All links focusable via Tab
* **ARIA**: Navigation should use `role="navigation"`
* **Screen Reader**: Announce active state and badges

### **Improvements Needed**

* Add `aria-current="page"` for active links
* Add `aria-label` for navigation region
* Announce badge counts

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| User query fails | Empty spaces section | Continue with nav |
| Spaces query fails | Error or empty state | Show error message |
| No user ID | Null render | Check auth |

## **15. Performance & Lifecycle Notes**

### **Helper Functions**

```typescript
// Mock activity count based on space ID
const getSpaceActivityCount = (spaceId: string): number => {
  // Returns consistent count for demo
};

// Consistent color variant for space icon
const getSpaceIconColor = (spaceId: string): string => {
  // Returns color based on ID
};
```

* Space list limited to 10 items
* Queries cached via React Query

## **16. Usage Examples**

### **In Layout**

```tsx
import { HomeSidebar } from '@/components/ui/HomeSidebar';

<div className={styles.layout}>
  <HomeSidebar />
  <main>{children}</main>
</div>
```

## **17. Features Summary**

### **Primary Navigation**

| Link | Path | Icon |
|------|------|------|
| Feed | `/feed` | feed |
| Suggestions | `/suggestions` | sparkles |
| Tasks | `/tasks` | clipboard |
| Calendar | `/calendar` | calendar |

### **My Spaces Section**

* Lists user's spaces (up to 10)
* Color-coded letter icons
* Activity count badges
* Settings popover per space
* "View all spaces" link → `/spaces`

### **Resources Section**

| Link | Path | Icon |
|------|------|------|
| Getting Started | `/getting-started` | rocket |
| Help Center | `/help` | help |
| Community Guidelines | `/community-guidelines` | clipboard |
| Give Feedback | `/feedback` | comment |

## **18. Testing Considerations**

### **Unit Tests**

* Renders navigation links
* Shows active state for current path
* Displays user's spaces
* Shows activity badges
* "View all" appears when > 10 spaces
* Settings popover opens

### **Mocking**

* `fetchCurrentUser` query
* `getSpace` query
* `getCurrentUserId` function

### **Edge Cases**

* No spaces
* Many spaces (> 10)
* Space with long title
* Query loading state
* Query error state

## **19. Out of Scope / Non-Goals**

* **Space creation**: Not in sidebar
* **Drag reorder**: Spaces not reorderable
* **Collapse/expand**: Always expanded
* **Space search**: Not built-in

## **20. Related Components & System Context**

### **Siblings**

* `SpaceSidebar` – Space-specific navigation
* `Navigation` – Top navigation bar

### **Child Components**

* `Icon`
* `SpaceSettingsPopover`

### **Used By**

* Protected layout
* Feed page

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Multiple spaces | 5 spaces | Base state |
| `NoSpaces` | No spaces | Empty array | Empty state |
| `ManySpaces` | More than 10 | 15+ spaces | View all shown |
| `Loading` | Fetching data | Loading state | Skeleton |
| `WithActivity` | Has badges | Various counts | Badges visible |
| `ActiveState` | Current path | Path matches | Highlight shown |

### **Controls (Args) Required**

*None – internal data fetching*

### **Mocking Requirements**

* **Queries**: Mock React Query responses
* **Auth**: Mock getCurrentUserId

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify navigation role
* Check active state announcement
* Verify keyboard navigation

### **Interaction Tests**

* Click navigation link
* Open space settings popover
* Click "View all spaces"
