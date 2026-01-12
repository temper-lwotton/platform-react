# **Component Specification: RichContentWithMentions**

## **1. Component Name**

**`RichContentWithMentions`**

## **2. Description**

An enhanced rich content renderer that adds interactive hover cards to @mention links.

* Extends RichContent functionality with dynamic mention hover cards
* Detects mention links in rendered HTML and injects React HoverCard components
* Provides user preview on hover without navigating away from content
* Used when content contains @mentions that should have interactive previews

## **3. Location**

```
src/components/ui/RichContentWithMentions/RichContentWithMentions.tsx
```

## **4. Component Type**

**Feature** – Manages refs and effects for dynamic DOM manipulation and React root injection.

## **5. Props Interface**

```typescript
interface RichContentWithMentionsProps {
  content: string;
  users: MentionUser[];
  className?: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `content` | `string` | Yes | - | HTML string with mention links |
| `users` | `MentionUser[]` | Yes | - | User data for hover card display |
| `className` | `string` | No | `''` | Additional CSS class for styling |

## **7. Data Requirements**

### **External Data Sources**

* `MentionUser` array passed via props (typically from API with content)

### **MentionUser Type**

```typescript
// From @/hooks/useMentions
interface MentionUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}
```

### **Mention Link Format**

The component expects mention links in this HTML format:

```html
<a class="mention-link" data-user-id="123">@John Doe</a>
```

## **8. Internal State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `contentRef` | `RefObject<HTMLDivElement>` | Reference to content container for DOM queries |
| `hoverCardRootsRef` | `Map<Element, Root>` | Tracks React roots for cleanup on unmount |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| No mention links in content | Standard HTML rendering | Same as RichContent |
| Mention link with matching user | Mention wrapped in HoverCard | Shows user preview on hover |
| Mention link without matching user | Mention link unchanged | User not found in array |
| User hovers mention | HoverCard opens with user info | Avatar, name, email |
| User clicks mention | Navigates to `/users/{id}` | Standard link navigation |
| Content updates | Re-processes mentions | Previous roots cleaned up |

## **10. Dependencies**

### **React / React DOM**

* `useRef` – DOM and root tracking
* `useEffect` – DOM manipulation after render
* `createRoot` from `react-dom/client` – Dynamic React rendering

### **Child Components**

* `MentionHoverCard` – User preview hover card component

### **Hooks**

* `MentionUser` type from `@/hooks/useMentions`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| Hover on mention | Mouse enter mention link | Opens HoverCard with user info |
| Click mention | Click mention link | Navigates to user profile page |
| Content/users change | Props update | Re-runs mention processing effect |

## **12. Styling**

* **Approach**: CSS Modules with SCSS + global class
* **File**: `RichContentWithMentions.module.scss`

### **CSS Classes**

* `rich-content` – Global class applied to container (not from module)
* `styles.mentionHoverWrapper` – Wrapper span for hover card
* `styles.mentionLink` – Styled mention link

### **Visual States**

* **Default Mention**: Styled link text (typically blue with @ prefix)
* **Mention Hover**: HoverCard visible with user preview
* **Mention Focus**: Focus ring on link

## **13. Accessibility Requirements**

* **Keyboard**: Mention links focusable via Tab
* **Focus**: HoverCard should be keyboard accessible
* **Screen Reader**: Mention text read as link; hover content accessible
* **ARIA**: HoverCard should manage focus appropriately

### **Improvements Needed**

* Ensure HoverCard content is accessible without hover (keyboard/touch)
* Add `aria-describedby` linking mention to hover content
* Consider touch device behaviour (tap vs hover)

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| User not found in array | Mention link left unchanged | No hover card added |
| Invalid user ID | Mention skipped | Original link preserved |
| Empty users array | No hover cards added | Content renders normally |
| Content ref not available | Effect exits early | Content still renders |

## **15. Performance & Lifecycle Notes**

### **Effect Timing**

* Uses 100ms `setTimeout` delay to ensure DOM is ready after render
* Effect re-runs when `content` or `users` props change

### **Cleanup**

* Clears timeout on unmount
* Unmounts all React roots created for hover cards
* Clears the roots Map

### **DOM Manipulation**

* Queries for `a.mention-link[data-user-id]` elements
* Replaces mention links with wrapper spans containing React-rendered hover cards
* Original link content preserved in new React-rendered link

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { RichContentWithMentions } from '@/components/ui/RichContentWithMentions';

<RichContentWithMentions
  content={post.content}
  users={mentionedUsers}
/>
```

### **With Custom Styling**

```tsx
<RichContentWithMentions
  content={comment.body}
  users={allUsers}
  className="comment-content"
/>
```

### **In Discussion Thread**

```tsx
<article className={styles.post}>
  <PostHeader author={post.author} />
  <RichContentWithMentions
    content={post.content}
    users={post.mentionedUsers}
  />
  <PostActions post={post} />
</article>
```

## **17. Features Summary**

* HTML rendering with dangerouslySetInnerHTML
* Automatic mention link detection via CSS selector
* Dynamic React root injection for hover cards
* User matching by ID (handles string/number conversion)
* Proper cleanup of React roots on unmount
* Preserves original mention text and styling

## **18. Testing Considerations**

### **Unit Tests**

* Renders content correctly
* Detects mention links in content
* Matches users by ID correctly
* Creates hover card for matched mentions
* Skips mentions without matching user
* Cleans up roots on unmount

### **Mocking**

* `MentionHoverCard` component
* `createRoot` from react-dom/client
* DOM queries (querySelectorAll)

### **Edge Cases**

* Content with no mentions
* All mentions have matching users
* No mentions have matching users
* Mixed matched/unmatched mentions
* User ID as string vs number
* Rapid content updates (cleanup timing)
* Very long user lists

## **19. Out of Scope / Non-Goals**

* **Content sanitization**: Must be done server-side
* **Mention autocomplete**: Handled by editor, not this component
* **User data fetching**: Users must be passed as props
* **Mention creation**: This is display-only
* **Non-mention hover cards**: Only handles `a.mention-link` elements

## **20. Related Components & System Context**

### **Related Components**

* `RichContent` – Base version without mention hover cards
* `MentionHoverCard` – The hover card component injected into mentions
* `LexicalEditor` – Creates content with mention links

### **Used By**

* Post display with mentions
* Discussion threads with mentions
* Comment sections with mentions
* Any content area showing Lexical content with @mentions

### **Typical Usage Location**

* Content areas where users can @mention others

## **21. Open Questions / Notes**

* Consider lazy loading user data for hover cards
* Touch device UX needs consideration (no hover on mobile)
* Could cache React roots for mentions that appear multiple times
* May want to debounce the processing effect for rapid updates

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Content with mentions | Mentions with matching users | Base state with hover |
| `NoMentions` | Plain content | No mention links | Same as RichContent |
| `SingleMention` | One @mention | One user in array | Basic hover test |
| `MultipleMentions` | Several @mentions | Multiple users | Multiple hover cards |
| `UnmatchedMention` | Mention without user | Empty users array | Fallback behaviour |
| `MixedMentions` | Some matched, some not | Partial user matches | Mixed behaviour |
| `LongContent` | Article with mentions | Scattered throughout | Scroll with hovers |

### **Controls (Args) Required**

* `content` (string) – controllable, use HTML with mention links
* `users` (MentionUser[]) – array of user objects
* `className` (string) – controllable

### **Mocking Requirements**

* **MentionHoverCard**: May need to mock or use actual component
* **User data**: Provide realistic MentionUser objects
* **Router**: Mock Next.js router for link navigation

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify mention links are keyboard accessible
* Check hover card is accessible via keyboard
* Verify focus management when hover card opens

### **Interaction Tests**

* Hover mention to open hover card
* Click mention navigates to profile (mock router)
* Tab through multiple mentions
* Hover card closes when mouse leaves
