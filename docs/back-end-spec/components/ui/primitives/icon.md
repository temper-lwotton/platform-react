# **Component Specification: Icon**

## **1. Component Name**

**`Icon`**

## **2. Description**

A wrapper component for Lucide React icons.

* Provides a consistent interface for using icons
* Maps friendly names to Lucide icons
* Standardized sizing and styling
* Used throughout the application

## **3. Location**

```
src/components/ui/Icon.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component.

## **5. Props Interface**

```typescript
interface IconProps {
  icon: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

type IconName = 'comment' | 'heart' | 'calendar' | 'mapMarker' | 'mapPin' |
  'link' | 'folder' | 'chevronDown' | 'chevronLeft' | 'chevronRight' |
  'arrowLeft' | 'arrowUp' | 'arrowDown' | 'home' | 'external' | 'bell' |
  'chat' | 'feed' | 'rocket' | 'help' | 'clipboard' | 'lightbulb' | 'zap' |
  'pin' | 'pencil' | 'user' | 'settings' | 'fileText' | 'logOut' | 'sun' |
  'moon' | 'monitor' | 'bookmark' | 'bookmarkFilled' | 'layoutGrid' |
  'download' | 'video' | 'videoOff' | 'microphone' | 'microphoneOff' |
  'screenShare' | 'users' | 'circle' | 'handRaised' | 'thumbsUp' | 'send' |
  'moreVertical' | 'x' | 'check' | 'alertCircle' | 'clock' | 'play' | 'stop' |
  'userPlus' | 'repeat' | 'star' | 'book' | 'checkCircle' | 'briefcase' |
  'building' | 'sparkles' | 'lock' | 'rss' | 'globe' | 'plus' | 'search' |
  'arrowUpDown' | 'list' | 'info' | 'package' | 'gift' | 'dollarSign' |
  'eye' | 'upload' | 'image' | 'wand-2' | 'crop' | 'loader-2' | 'refresh-cw' |
  'check-circle-2' | 'image-off' | 'rectangle-horizontal' | 'rectangle-vertical' |
  'grid-3x3' | 'maximize' | 'layers' | 'check-square' | 'alert-circle' |
  'square' | 'megaphone';
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `icon` | `IconName` | Yes | - | Icon identifier |
| `size` | `number` | No | `24` | Icon size in pixels |
| `className` | `string` | No | `''` | Additional CSS classes |
| `style` | `CSSProperties` | No | - | Inline styles |

## **7. Data Requirements**

*No external data – purely presentational.*

## **8. Internal State**

*None – stateless component.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Valid icon name | Icon rendered | Lucide icon |
| Invalid icon name | `null` | No render |
| Size provided | Custom size | Pixels |
| className provided | Styles applied | Custom styles |

## **10. Dependencies**

### **External Libraries**

* `lucide-react` – Icon library

## **11. Events & Callbacks**

*No events – static component.*

## **12. Styling**

* Icons inherit `currentColor` for fill
* Supports all Lucide icon props via spread
* Custom styling via className and style props

## **13. Accessibility Requirements**

* **ARIA**: Icons are decorative by default
* **Screen Reader**: Hidden unless text accompanies
* **Focus**: Not focusable (decorative)

### **Improvements Needed**

* Add `aria-label` support for standalone icons

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Invalid icon name | Returns `null` | No render |

## **15. Performance & Lifecycle Notes**

### **Icon Map**

The component maps friendly names to Lucide icons:

| Name | Lucide Icon | Use Case |
|------|-------------|----------|
| `comment` | MessageSquare | Comments, discussions |
| `heart` | Heart | Likes, favorites |
| `calendar` | Calendar | Dates, events |
| `bell` | Bell | Notifications |
| `user` | User | User/profile |
| `settings` | Settings | Settings/preferences |
| `search` | Search | Search functionality |
| `plus` | Plus | Add/create actions |
| `x` | X | Close, remove |
| `check` | Check | Confirmation |
| `loader-2` | Loader2 | Loading states |
| `sparkles` | Sparkles | AI features |
| `megaphone` | Megaphone | Broadcasts |

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { Icon } from '@/components/ui/Icon';

<Icon icon="bell" />
```

### **With Custom Size**

```tsx
<Icon icon="settings" size={20} />
<Icon icon="user" size={32} />
```

### **With className**

```tsx
<Icon icon="check" className={styles.successIcon} />
```

### **In Buttons**

```tsx
<Button>
  <Icon icon="plus" size={16} />
  Add Item
</Button>
```

### **Common Patterns**

```tsx
<Icon icon="loader-2" className={styles.spinner} />  // Loading
<Icon icon="check" className={styles.success} />     // Success
<Icon icon="x" className={styles.error} />           // Error/Close
<Icon icon="chevronDown" size={16} />                // Dropdown indicator
```

### **In Navigation**

```tsx
<nav>
  <Link><Icon icon="home" /> Home</Link>
  <Link><Icon icon="calendar" /> Calendar</Link>
  <Link><Icon icon="users" /> Members</Link>
</nav>
```

## **17. Features Summary**

### **Common Icon Sizes**

| Size | Use Case |
|------|----------|
| `12` | Inline badges, tiny indicators |
| `14` | Small buttons, compact UI |
| `16` | Standard buttons, inline icons |
| `20` | Navigation items, card actions |
| `24` | Default size, prominent icons |
| `32+` | Hero sections, empty states |

### **Color Inheritance**

* Icons inherit `currentColor` from parent
* Use className to change color

## **18. Testing Considerations**

### **Unit Tests**

* Renders correct icon
* Applies correct size
* Applies className
* Returns null for invalid icon

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Invalid icon name
* Very large size
* Missing icon from library

## **19. Out of Scope / Non-Goals**

* **Custom SVG**: Import directly
* **Animated icons**: Use CSS animations
* **Icon buttons**: Separate component
* **Icon with badge**: Compose manually

## **20. Related Components & System Context**

### **Used By**

* Nearly all components in the application

### **Part Of**

* Primitive component library

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Default size | icon: bell | 24px |
| `Sizes` | All sizes | 12, 16, 20, 24, 32 | Size comparison |
| `Colors` | Color inheritance | With CSS color | Colored |
| `IconGallery` | All icons | All icon names | Reference |

### **Controls (Args) Required**

* `icon` (select) – Icon name
* `size` (number) – Icon size
* `className` (text) – Custom class

### **Mocking Requirements**

*None – stateless component*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify decorative treatment
* Check color contrast

### **Interaction Tests**

* None – static component
