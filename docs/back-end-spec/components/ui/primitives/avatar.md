# **Component Specification: Avatar**

## **1. Component Name**

**`Avatar`**

## **2. Description**

User avatar component built on Radix UI Avatar primitive.

* Displays user profile images with automatic fallback handling
* Supports multiple sizes from xs to 2xl
* Graceful fallback when images fail to load
* Uses initials as fallback display

## **3. Location**

```
src/components/ui/primitives/Avatar.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component managed by Radix UI.

## **5. Props Interface**

```typescript
interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
}

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `src` | `string \| null` | No | - | Image URL |
| `alt` | `string` | No | `''` | Alt text for image |
| `fallback` | `string` | No | - | Fallback initials |
| `size` | `AvatarSize` | No | `'md'` | Avatar size |
| `className` | `string` | No | `''` | Additional CSS classes |

## **7. Data Requirements**

### **User Data (Typical Source)**

```typescript
interface User {
  name: string;
  avatar?: string | null;
}

// Usage
<Avatar
  src={user.avatar}
  alt={user.name}
  fallback={user.name.charAt(0).toUpperCase()}
/>
```

## **8. Internal State**

*None – handled by Radix UI primitive.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `src` loads successfully | Image | Photo shown |
| `src` fails to load | Fallback after 600ms | Delay prevents flash |
| No `src` provided | Fallback immediately | 0ms delay |
| No `fallback` | First char of `alt` | Auto-generated |
| No `fallback` or `alt` | `'?'` | Final fallback |

## **10. Dependencies**

### **External Libraries**

* `@radix-ui/react-avatar`

## **11. Events & Callbacks**

*No external callbacks.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Avatar.module.scss`

### **CSS Classes**

* `.avatar` – Container
* `.avatarImage` – Image element
* `.avatarFallback` – Fallback display
* `.avatar--xs` through `.avatar--2xl` – Size variants

## **13. Accessibility Requirements**

* **ARIA**: Image has proper alt text
* **Visual**: Fallback is visually distinct
* **Contrast**: Proper contrast for fallback text

### **Improvements Needed**

* Add `role="img"` for fallback

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Image load fails | Show fallback | After delay |
| Invalid URL | Show fallback | Graceful |
| No data | Show '?' | Final fallback |

## **15. Performance & Lifecycle Notes**

### **Fallback Behavior**

```typescript
// Fallback timing
const delayMs = src ? 600 : 0; // Delay only if src provided

// Fallback priority
const fallbackText = fallback ?? alt?.charAt(0) ?? '?';
```

### **Image Loading**

* Radix handles load/error states
* 600ms delay prevents flash on slow loads

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { Avatar } from '@/components/ui/primitives/Avatar';

<Avatar
  src={user.photo}
  alt={user.name}
  fallback="JD"
  size="md"
/>
```

### **Without Image (Fallback)**

```tsx
<Avatar
  alt="John Doe"
  fallback="JD"
  size="lg"
/>
```

### **In a User List**

```tsx
{users.map(user => (
  <Avatar
    key={user.id}
    src={user.avatar}
    alt={user.name}
    fallback={user.name.charAt(0)}
    size="sm"
  />
))}
```

### **Large Profile Avatar**

```tsx
<Avatar
  src={profile.avatarUrl}
  alt={profile.displayName}
  fallback={profile.initials}
  size="2xl"
/>
```

## **17. Features Summary**

### **Sizes**

| Size | Use Case |
|------|----------|
| `xs` | Inline mentions, compact lists |
| `sm` | Comment threads, small cards |
| `md` | Standard user displays |
| `lg` | Profile headers, feature cards |
| `xl` | Profile pages |
| `2xl` | Hero sections, profile editing |

### **Fallback Chain**

1. `fallback` prop
2. First character of `alt`
3. `'?'` as final fallback

## **18. Testing Considerations**

### **Unit Tests**

* Renders image when src provided
* Shows fallback when no src
* Shows fallback on image error
* Correct size class applied
* Alt text present on image

### **Mocking**

* Image load/error events

### **Edge Cases**

* Invalid image URL
* Very long alt text
* Empty fallback
* Rapid src changes

## **19. Out of Scope / Non-Goals**

* **Status indicator**: Add via wrapper
* **Upload**: Separate component
* **Editable**: Separate component
* **Group avatars**: Separate component

## **20. Related Components & System Context**

### **Used By**

* `UserCard`
* `UserMenu`
* `MessageThread`
* `ConversationList`

### **Siblings**

* `Badge`

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `WithImage` | Photo avatar | src provided | Image shown |
| `Fallback` | No image | No src | Initials shown |
| `ImageError` | Load fails | Invalid src | Fallback after delay |
| `Sizes` | All sizes | xs through 2xl | Size comparison |
| `NoData` | Empty | No props | '?' shown |

### **Controls (Args) Required**

* `src` (text) – Image URL
* `alt` (text) – Alt text
* `fallback` (text) – Fallback text
* `size` (select) – Avatar size

### **Mocking Requirements**

* Image load simulation

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify alt text presence
* Check fallback contrast

### **Interaction Tests**

* Image load
* Image error
