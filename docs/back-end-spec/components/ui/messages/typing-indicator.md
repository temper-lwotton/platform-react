# **Component Specification: TypingIndicator**

## **1. Component Name**

**`TypingIndicator`**

## **2. Description**

A simple animated indicator showing who is currently typing in a conversation.

* Displays animated bouncing dots
* Shows dynamic text based on number of users typing
* Returns null when no one is typing
* Used within MessageThread component

## **3. Location**

```
src/components/ui/TypingIndicator/TypingIndicator.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component with CSS animation.

## **5. Props Interface**

```typescript
interface TypingIndicatorProps {
  names?: string[];
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `names` | `string[]` | No | `[]` | Names of users currently typing |

## **7. Data Requirements**

*No external data – uses prop values only.*

## **8. Internal State**

*None – stateless component.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `names` undefined or empty | Nothing (`null`) | Hidden |
| 1 user typing | "[Name] is typing" + dots | Singular |
| 2 users typing | "[Name1] and [Name2] are typing" + dots | Two names |
| 3+ users typing | "[Name1] and X others are typing" + dots | Abbreviated |

## **10. Dependencies**

*None – pure CSS animation.*

## **11. Events & Callbacks**

*None – display only.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `TypingIndicator.module.scss`

### **CSS Classes**

* `.container` – Main wrapper
* `.dots` – Dot container
* `.dot` – Individual dot
* `.text` – Typing text

### **Animation**

* Three bouncing dots
* Staggered animation timing
* Continuous loop

```scss
@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}

.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.15s; }
.dot:nth-child(3) { animation-delay: 0.3s; }
```

## **13. Accessibility Requirements**

* **ARIA**: Should have `aria-live="polite"` for announcements
* **Screen Reader**: Announce typing status changes

### **Improvements Needed**

* Add `aria-live="polite"` region
* Add `role="status"`
* Consider reduced motion preference

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty names array | Returns null | Nothing rendered |
| Undefined names | Returns null | Nothing rendered |
| Invalid name values | Renders anyway | May show undefined |

## **15. Performance & Lifecycle Notes**

* Pure CSS animation (no JS interval)
* Minimal re-renders (only on names change)
* Returns null early when empty

## **16. Usage Examples**

### **Single User**

```tsx
import { TypingIndicator } from '@/components/ui/TypingIndicator';

<TypingIndicator names={['John']} />
// → "John is typing" + animated dots
```

### **Two Users**

```tsx
<TypingIndicator names={['John', 'Jane']} />
// → "John and Jane are typing" + animated dots
```

### **Multiple Users**

```tsx
<TypingIndicator names={['John', 'Jane', 'Bob']} />
// → "John and 2 others are typing" + animated dots
```

### **No Typing**

```tsx
<TypingIndicator names={[]} />
// → null (nothing rendered)
```

## **17. Features Summary**

### **Visual Elements**

* Animated three-dot indicator
* Bouncing animation with stagger

### **Dynamic Text**

* 1 user: "[Name] is typing"
* 2 users: "[Name1] and [Name2] are typing"
* 3+ users: "[Name1] and X others are typing"

### **Conditional Rendering**

* Returns null when no names provided

## **18. Testing Considerations**

### **Unit Tests**

* Returns null when names is empty
* Returns null when names is undefined
* Shows single user text
* Shows two user text
* Shows multiple user text with count
* Dots are rendered

### **Mocking**

*None needed – pure component*

### **Edge Cases**

* Empty array
* Single name
* Two names
* Many names
* Very long names
* Empty string in array

## **19. Out of Scope / Non-Goals**

* **Typing detection**: Parent handles status tracking
* **Real-time updates**: Parent manages WebSocket data
* **User avatars**: Text-only display
* **Custom animation**: Fixed style

## **20. Related Components & System Context**

### **Parent Component**

* `MessageThread`

### **Used With**

* `MessageInput` – Triggers typing status via API

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `SingleUser` | One person typing | `names: ['John']` | "is typing" |
| `TwoUsers` | Two people typing | `names: ['John', 'Jane']` | "are typing" |
| `MultipleUsers` | 3+ typing | `names: ['John', 'Jane', 'Bob']` | "and X others" |
| `Empty` | No one typing | `names: []` | Returns null |

### **Controls (Args) Required**

* `names` (array) – controllable

### **Mocking Requirements**

*None*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify status is announced
* Check reduced motion handling

### **Interaction Tests**

*None – display only*
