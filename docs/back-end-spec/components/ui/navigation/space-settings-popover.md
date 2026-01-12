# **Component Specification: SpaceSettingsPopover**

## **1. Component Name**

**`SpaceSettingsPopover`**

## **2. Description**

A popover menu for quick space settings, accessible from the sidebar space list.

* Allows users to configure notification preferences for individual spaces
* Three notification levels: All, Mentions only, None
* Uses radio group for selection
* Triggered by three-dot button on space items

## **3. Location**

```
src/components/ui/SpaceSettingsPopover/SpaceSettingsPopover.tsx
```

## **4. Component Type**

**Feature** – Manages popover state and notification settings.

## **5. Props Interface**

```typescript
interface SpaceSettingsPopoverProps {
  spaceId: string;
  spaceName: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `spaceId` | `string` | Yes | - | Space identifier |
| `spaceName` | `string` | Yes | - | Space name for display |

## **7. Data Requirements**

*No external data fetching – uses local state only.*

### **NotificationSetting Type**

```typescript
type NotificationSetting = 'all' | 'mentions' | 'none';
```

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `isOpen` | `boolean` | `false` | Popover visibility |
| `notificationSetting` | `NotificationSetting` | `'all'` | Current notification preference |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Default | Three-dot trigger | Popover closed |
| `isOpen === true` | Full popover panel | Settings visible |
| `notificationSetting === 'all'` | All option selected | Default state |
| `notificationSetting === 'mentions'` | Mentions option selected | Reduced notifications |
| `notificationSetting === 'none'` | None option selected | Muted space |

## **10. Dependencies**

### **Child Components**

* `Icon` – Section icons
* `RadioGroup` – Notification options

### **External Libraries**

* `@radix-ui/react-popover`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `handleNotificationChange` | Select radio option | Update notification setting |
| `handleSettingsClick` | Click trigger | Stop propagation to prevent navigation |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `SpaceSettingsPopover.module.scss`

### **CSS Classes**

* `.trigger` – Three-dot button
* `.popover` – Popover container
* `.header` – Settings header
* `.title` – "Space Settings" title
* `.spaceName` – Space name display
* `.section` – Settings section
* `.option` – Radio option
* `.optionLabel` – Option label
* `.optionDescription` – Option description

### **Layout**

* Trigger button (three dots)
* Header with title and space name
* Radio group section
* Arrow indicator

## **13. Accessibility Requirements**

* **Keyboard**: Tab through options, Enter/Space to select
* **ARIA**: Radio group with proper labeling
* **Focus**: Focus trapped in popover
* **Screen Reader**: Announce selected option

### **Improvements Needed**

* Add `aria-label` to trigger
* Announce setting changes
* Add keyboard shortcut to open

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Save setting fails | Error toast | Revert to previous |
| Invalid space ID | Popover still works | Local state only |

## **15. Performance & Lifecycle Notes**

### **Event Propagation**

```typescript
const handleSettingsClick = (e: React.MouseEvent) => {
  e.stopPropagation(); // Prevent navigation to space
};

const handleContentClick = (e: React.MouseEvent) => {
  e.stopPropagation(); // Keep popover open
};
```

### **Future API Integration**

* Save notification preference to backend
* Sync settings across devices
* Load saved preference on mount

## **16. Usage Examples**

### **In Sidebar Space List**

```tsx
import { SpaceSettingsPopover } from '@/components/ui/SpaceSettingsPopover';

<div className={styles.spaceItem}>
  <Link href={`/spaces/${space.id}`}>
    {space.title}
  </Link>
  <SpaceSettingsPopover spaceId={space.id} spaceName={space.title} />
</div>
```

## **17. Features Summary**

### **Trigger**

* Three-dot icon button
* Click prevention (no navigation)
* Hover state

### **Header**

* "Space Settings" title
* Space name subtitle

### **Notification Options**

| Value | Label | Description |
|-------|-------|-------------|
| `all` | All notifications | Get notified for all activity in this space |
| `mentions` | Only @mentions | Get notified only when someone mentions you |
| `none` | Nothing | Don't send notifications from this space |

### **Popover Features**

* Arrow indicator
* Click outside to close
* Stop propagation on content

## **18. Testing Considerations**

### **Unit Tests**

* Renders trigger button
* Opens popover on click
* Shows all notification options
* Selection updates state
* Click doesn't propagate to parent

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Long space name
* Rapid setting changes
* Click outside to close
* Escape to close

## **19. Out of Scope / Non-Goals**

* **Leave space**: Not here
* **Space details**: Not in popover
* **Member management**: Not here
* **Space deletion**: Not here

## **20. Related Components & System Context**

### **Parent Component**

* `HomeSidebar`

### **Child Components**

* `Icon`
* `RadioGroup`

### **Uses**

* Radix Popover primitive

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Closed state | Trigger visible | Base state |
| `Open` | Popover visible | isOpen: true | Full panel |
| `AllSelected` | All notifications | setting: 'all' | Default option |
| `MentionsSelected` | Mentions only | setting: 'mentions' | Reduced |
| `NoneSelected` | Muted | setting: 'none' | No notifications |

### **Controls (Args) Required**

* `spaceId` (string) – controllable
* `spaceName` (string) – controllable

### **Mocking Requirements**

*None – local state only*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify popover accessible
* Check radio group keyboard nav
* Verify focus management

### **Interaction Tests**

* Click trigger to open
* Select notification option
* Click outside to close
* Press Escape to close
