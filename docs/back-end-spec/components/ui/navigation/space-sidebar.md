# **Component Specification: SpaceSidebar**

## **1. Component Name**

**`SpaceSidebar`**

## **2. Description**

A sidebar navigation component for space pages.

* Displays back link to home
* Shows navigation items for space sections
* Highlights active section based on URL
* Used on all space layout pages

## **3. Location**

```
src/components/ui/SpaceSidebar/SpaceSidebar.tsx
```

## **4. Component Type**

**UI** – Stateless navigation component with active state from URL.

## **5. Props Interface**

```typescript
interface SpaceSidebarProps {
  spaceId: string;
  spaceTitle: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `spaceId` | `string` | Yes | - | Space identifier for URL building |
| `spaceTitle` | `string` | Yes | - | Space title (currently unused in UI) |

## **7. Data Requirements**

*No external data fetching – uses props only.*

## **8. Internal State**

*None – stateless component relying on pathname.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Default | Back link + navigation | Normal state |
| Path is `/spaces/[id]` exactly | Overview active | Exact match |
| Path starts with `/spaces/[id]/chat` | Chat active | Prefix match |
| Path starts with `/spaces/[id]/discussions` | Discussions active | Prefix match |
| Path starts with `/spaces/[id]/events` | Events active | Prefix match |

## **10. Dependencies**

### **Child Components**

* `Icon` – Navigation icons

### **External Libraries**

* `next/link`
* `next/navigation` (`usePathname`)

## **11. Events & Callbacks**

*No external callbacks – navigation handled by Next.js Link.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `SpaceSidebar.module.scss`

### **CSS Classes**

* `.sidebar` – Main container
* `.backLink` – "Back to Home" link
* `.navList` – Navigation items container
* `.navItem` – Navigation link
* `.navItem--active` – Active state
* `.navIcon` – Icon in link

### **Layout**

* Back button header
* Vertical navigation list

## **13. Accessibility Requirements**

* **Keyboard**: All links focusable via Tab
* **ARIA**: Navigation should use `role="navigation"`
* **Screen Reader**: Announce active state

### **Improvements Needed**

* Add `aria-current="page"` for active link
* Add `aria-label` for navigation region

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Invalid spaceId | Broken links | 404 on click |
| Missing pathname | No active state | All items normal |

## **15. Performance & Lifecycle Notes**

* Stateless component with minimal re-renders
* Active state computed on each render from pathname

## **16. Usage Examples**

### **In Space Layout**

```tsx
import { SpaceSidebar } from '@/components/ui/SpaceSidebar';

<SpaceSidebar spaceId="123" spaceTitle="Design Team" />
```

### **With Layout**

```tsx
<div className={styles.spaceLayout}>
  <SpaceSidebar spaceId={params.id} spaceTitle={space.title} />
  <main>{children}</main>
</div>
```

## **17. Features Summary**

### **Back Link**

* "Back to Home" with arrow icon
* Links to `/feed`

### **Navigation Items**

| Label | Path | Icon |
|-------|------|------|
| Overview | `/spaces/[id]` | home |
| Chat | `/spaces/[id]/chat` | chat |
| Discussions | `/spaces/[id]/discussions` | chat |
| Events | `/spaces/[id]/events` | calendar |

### **Active State**

* Exact match for Overview
* Prefix match for sub-pages

## **18. Testing Considerations**

### **Unit Tests**

* Renders back link
* Shows all navigation items
* Active state for Overview (exact match)
* Active state for sub-pages (prefix match)
* Links build correct URLs

### **Mocking**

* `usePathname` hook

### **Edge Cases**

* Deep nested routes
* Invalid space ID
* URL with query params

## **19. Out of Scope / Non-Goals**

* **Space info display**: Just navigation
* **Member list**: Not in sidebar
* **Space settings**: Not here
* **Collapse/expand**: Always expanded

## **20. Related Components & System Context**

### **Siblings**

* `HomeSidebar`
* `Navigation`

### **Child Components**

* `Icon`

### **Used By**

* Space layout pages

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Overview active | Path: `/spaces/123` | Base state |
| `ChatActive` | Chat page | Path: `/spaces/123/chat` | Chat highlighted |
| `DiscussionsActive` | Discussions page | Path: `/spaces/123/discussions` | Discussions highlighted |
| `EventsActive` | Events page | Path: `/spaces/123/events` | Events highlighted |

### **Controls (Args) Required**

* `spaceId` (string) – controllable
* `spaceTitle` (string) – controllable

### **Mocking Requirements**

* **usePathname**: Mock current path

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify navigation role
* Check active state announcement
* Verify keyboard navigation

### **Interaction Tests**

* Click back link
* Click navigation items
