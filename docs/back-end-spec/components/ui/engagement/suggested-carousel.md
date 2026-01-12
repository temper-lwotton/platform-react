# **Component Specification: SuggestedCarousel**

## **1. Component Name**

**`SuggestedCarousel`**

## **2. Description**

A horizontal scrollable carousel displaying AI-powered suggestions for the user.

* Shows personalized recommendations for users, spaces, events, discussions, resources, and showcases
* Each card includes type badge, title, description, metadata, and AI reasoning
* Provides smooth horizontal scrolling with navigation arrows
* Used on feed and home pages to surface relevant content

## **3. Location**

```
src/components/ui/SuggestedCarousel/SuggestedCarousel.tsx
```

## **4. Component Type**

**Feature** – Manages scroll state and renders suggestion cards with navigation controls.

## **5. Props Interface**

```typescript
// No props - currently uses internal mock data
// Future: suggestions will be passed from API
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| - | - | - | - | No props currently (uses mock data) |

*Future implementation should accept `suggestions: Suggestion[]` prop.*

## **7. Data Requirements**

### **External Data Sources**

* Currently uses `MOCK_SUGGESTIONS` constant (to be replaced with API data)

### **Suggestion Type**

```typescript
type SuggestionType = 'user' | 'space' | 'event' | 'discussion' | 'resource' | 'showcase';

interface Suggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  reason: string;           // AI explanation for suggestion
  image?: string;
  url: string;
  metadata?: {
    memberCount?: number;   // For spaces
    date?: string;          // For events
    author?: string;        // For discussions/showcases
    replies?: number;       // For discussions
  };
}
```

## **8. Internal State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `canScrollLeft` | `boolean` | Controls left navigation button visibility |
| `canScrollRight` | `boolean` | Controls right navigation button visibility |

### **Refs**

| Ref | Type | Purpose |
|-----|------|---------|
| `scrollContainerRef` | `RefObject<HTMLDivElement>` | Reference to scrollable container |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Default (at start) | Right arrow visible, left hidden | `canScrollLeft: false` |
| Scrolled to middle | Both arrows visible | Both scroll directions available |
| Scrolled to end | Left arrow visible, right hidden | `canScrollRight: false` |
| User type | Avatar with photo/initial | Circular avatar |
| Non-user type | Icon wrapper | Icon matching suggestion type |
| Has metadata | Metadata row displayed | Type-specific info |
| No metadata | Metadata row hidden | Clean card |

## **10. Dependencies**

### **Child Components**

* `Icon` – Type icons, navigation arrows, sparkles
* `Badge` – Type label badges

### **Next.js**

* `next/link` – Card and "View all" navigation

### **React**

* `useRef` – Scroll container reference
* `useState` – Scroll state

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `scroll('left')` | Click left arrow | Scrolls container left by 80% of width |
| `scroll('right')` | Click right arrow | Scrolls container right by 80% of width |
| `checkScroll` | Container scroll event | Updates navigation button visibility |
| Card click | Click suggestion card | Navigates to suggestion URL |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `SuggestedCarousel.module.scss`

### **Visual States**

* **Header**: Title row with sparkles icon
* **Navigation Buttons**: Positioned at container edges, appear/hide based on scroll
* **Cards**: Fixed width, consistent height, hover state
* **Type Badge**: Icon + label in top-left
* **Reason Section**: AI sparkles icon with explanation text

## **13. Accessibility Requirements**

* **Keyboard**: Navigation buttons focusable
* **ARIA**: `aria-label` on scroll buttons ("Scroll left", "Scroll right")
* **Focus**: Cards are focusable links
* **Screen Reader**: Type labels provide context

### **Improvements Needed**

* Add `aria-roledescription="carousel"` to container
* Add keyboard arrow key navigation
* Announce current position in carousel
* Consider `aria-live` for scroll state changes

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty suggestions | Component still renders | Shows empty scroll area |
| Missing image | Avatar shows initial | First letter of title |
| Missing metadata | Metadata row hidden | Conditional rendering |
| Scroll container missing | Early return in handlers | No-op |

## **15. Performance & Lifecycle Notes**

* **Scroll Debounce**: `checkScroll` runs on scroll events (consider throttling)
* **Smooth Scroll**: Uses `scrollTo` with `behavior: 'smooth'`
* **Button Update Delay**: 300ms timeout after scroll to update button states

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { SuggestedCarousel } from '@/components/ui/SuggestedCarousel';

// In feed or home page
<SuggestedCarousel />
```

### **In Page Layout**

```tsx
<main className={styles.feed}>
  <SuggestedCarousel />
  <FeedPosts posts={posts} />
</main>
```

## **17. Features Summary**

* Header with sparkles icon and "Suggested for you" title
* "View all suggestions" link to `/suggestions` page
* Horizontal scroll container with smooth scrolling
* Conditional navigation arrows based on scroll position
* Six suggestion types with unique icons and labels
* Avatar display for users, icon wrapper for other types
* Type-specific metadata (member count, date, replies)
* AI reasoning with sparkles icon on each card

## **18. Testing Considerations**

### **Unit Tests**

* Renders all mock suggestions
* Navigation buttons appear/hide correctly
* Scroll functions update container position
* Type icons map correctly
* Type labels map correctly

### **Mocking**

* Scroll container ref with mock scrollLeft/scrollWidth
* Link navigation

### **Edge Cases**

* Single suggestion (no scrolling needed)
* All same type suggestions
* Very long titles/descriptions
* Missing optional metadata fields

## **19. Out of Scope / Non-Goals**

* **API Integration**: Currently uses mock data
* **Dismiss/Hide**: No way to dismiss suggestions
* **Feedback**: No like/dislike on suggestions
* **Infinite Scroll**: Fixed set of suggestions
* **Touch Gestures**: No swipe handling (relies on native scroll)

## **20. Related Components & System Context**

### **Related Components**

* `LikesDisplay` – Sibling engagement component
* `Icon` – Used for type and navigation icons
* `Badge` – Used for type labels

### **Used By**

* Feed page
* Home page

### **Typical Usage Location**

* Top of feed below navigation

## **21. Open Questions / Notes**

* Need to integrate with suggestions API
* Consider adding `suggestions` prop instead of internal mock
* May want loading skeleton state
* Consider touch/swipe gestures for mobile
* Dismiss functionality could improve UX

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Full carousel with all types | Mock data | Base state |
| `AtStart` | Scrolled to beginning | `canScrollLeft: false` | Left button hidden |
| `AtEnd` | Scrolled to end | `canScrollRight: false` | Right button hidden |
| `SingleItem` | One suggestion | Single item array | No scroll needed |
| `UsersOnly` | Only user suggestions | Filtered mock | Avatar display |
| `EventsOnly` | Only event suggestions | Filtered mock | Date metadata |
| `Empty` | No suggestions | Empty array | Empty state |

### **Controls (Args) Required**

* None currently (uses internal mock data)
* Future: `suggestions` array control

### **Mocking Requirements**

* **Suggestions data**: Use `MOCK_SUGGESTIONS` or custom arrays
* **Router**: Mock Next.js Link navigation
* **Scroll container**: May need ref setup for scroll testing

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify navigation buttons have accessible names
* Check card links are focusable
* Verify keyboard navigation works

### **Interaction Tests**

* Click right arrow scrolls container
* Click left arrow scrolls container
* Click card navigates to URL
* Scroll updates button visibility
