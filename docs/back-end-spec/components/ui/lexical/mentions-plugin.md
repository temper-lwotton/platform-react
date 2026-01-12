# **Component Specification: MentionsPlugin**

## **1. Component Name**

**`MentionsPlugin`**

## **2. Description**

A Lexical plugin that enables @mention functionality with user autocomplete.

* Detects "@" trigger and shows user dropdown
* Filters users based on typed query
* Inserts styled mention nodes with user IDs
* Provides keyboard and mouse navigation
* Used within LexicalEditor and LexicalCommentEditor

## **3. Location**

```
src/components/ui/Lexical/plugins/MentionsPlugin.tsx
```

## **4. Component Type**

**Feature** – Lexical plugin managing typeahead state and mention insertion.

## **5. Props Interface**

```typescript
interface MentionsPluginProps {
  users: MentionUser[];
  onMention?: (user: MentionUser) => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `users` | `MentionUser[]` | Yes | - | Available users for mentions |
| `onMention` | `(user: MentionUser) => void` | No | - | Callback when user is mentioned |

## **7. Data Requirements**

### **External Data Sources**

* Users list passed via props

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

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `queryString` | `string \| null` | `null` | Current search query after "@" |

### **Internal Classes**

| Class | Purpose |
|-------|---------|
| `MentionTypeaheadOption` | Extends `MenuOption`, stores user data |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| No "@" typed | Nothing | Plugin inactive |
| "@" typed | Dropdown with all users | Query is empty |
| "@jo" typed | Filtered dropdown | Users matching "jo" |
| No matches | Empty dropdown (hidden) | `options.length === 0` |
| Arrow keys pressed | Selection moves | Keyboard navigation |
| Enter pressed | Mention inserted | Dropdown closes |
| Mouse click option | Mention inserted | Dropdown closes |
| Escape pressed | Dropdown closes | No mention inserted |

## **10. Dependencies**

### **Lexical**

* `useLexicalComposerContext` – Editor access
* `LexicalTypeaheadMenuPlugin` – Typeahead menu system
* `useBasicTypeaheadTriggerMatch` – Trigger matching
* `MenuOption` – Base class for options
* `$createTextNode` – Space node creation

### **React DOM**

* `ReactDOM.createPortal` – Dropdown positioning

### **Radix UI**

* `@radix-ui/react-avatar` – User avatars in dropdown

### **Custom**

* `$createMentionNode` – Mention node factory

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onQueryChange` | Text after "@" changes | Updates `queryString` state |
| `onSelectOption` | User selects option | Inserts mention node |
| `onMention` | After insertion | Fires callback with selected user |

## **12. Styling**

* **Approach**: Global CSS classes (not modules)
* **File**: Lexical stylesheet

### **CSS Classes**

* `.mention-dropdown` – Dropdown container
* `.mention-dropdown-content` – Scrollable option list
* `.mention-dropdown-item` – Individual option
* `.mention-dropdown-item--selected` – Selected/highlighted option
* `.mention-dropdown-avatar` – Avatar container
* `.mention-dropdown-avatar-fallback` – Initials fallback
* `.mention-dropdown-info` – Name/email container
* `.mention-dropdown-name` – User name text
* `.mention-dropdown-email` – User email text
* `.mention-dropdown-hint` – Keyboard hint bar

## **13. Accessibility Requirements**

* **Keyboard**: Arrow keys navigate, Enter selects, Escape closes
* **Focus**: Focus remains in editor while navigating
* **Screen Reader**: Options should be announced as listbox items

### **Improvements Needed**

* Add `role="listbox"` to dropdown
* Add `role="option"` to items
* Add `aria-selected` to selected item
* Announce result count changes

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty users array | No dropdown shown | Graceful degradation |
| User not found in callback | Callback not fired | Silent skip |

## **15. Performance & Lifecycle Notes**

### **Regex Matching**

```typescript
const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' + TRIGGERS + ']' +
    '((?:' + VALID_CHARS + VALID_JOINS + '){0,' + LENGTH_LIMIT + '})' +
  ')$',
);
```

* 75 character length limit
* Matches after whitespace, start, or parenthesis
* Supports names with periods and hyphens

### **Filtering**

* Filters on `name` and `email`
* Case-insensitive matching
* Returns all users when query is empty

## **16. Usage Examples**

### **Basic Usage (Inside LexicalComposer)**

```tsx
<MentionsPlugin
  users={[
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
  ]}
  onMention={(user) => {
    console.log('Mentioned:', user.name);
    trackMention(user.id);
  }}
/>
```

### **With Space Members**

```tsx
const { users } = useSpaceMembers(spaceId);

<MentionsPlugin
  users={users}
  onMention={handleMention}
/>
```

## **17. Features Summary**

* "@" trigger detection
* Live filtering as user types
* Keyboard navigation (↑↓ to navigate, ↵ to select, Esc to dismiss)
* Mouse selection support
* User avatar display (photo or initials)
* Email display in dropdown
* Keyboard hint bar
* Automatic space after mention insertion
* Callback on mention selection

## **18. Testing Considerations**

### **Unit Tests**

* Dropdown appears on "@" trigger
* Filtering works correctly
* Keyboard navigation updates selection
* Enter key inserts mention
* Escape key closes dropdown
* Click inserts mention
* Callback fires with correct user

### **Mocking**

* `useLexicalComposerContext` with mock editor
* `ReactDOM.createPortal`
* Radix Avatar components

### **Edge Cases**

* Empty users array
* Single user
* Many users (scroll)
* Special characters in names
* Email without photo
* Long names

## **19. Out of Scope / Non-Goals**

* **User fetching**: Users must be passed as props
* **Debounced filtering**: Filters synchronously
* **Remote search**: No API calls for filtering
* **Multiple trigger characters**: Only "@" supported
* **Mention editing**: Cannot edit inserted mentions

## **20. Related Components & System Context**

### **Parent Components**

* `LexicalEditor` – Full editor
* `LexicalCommentEditor` – Comment editor

### **Creates**

* `MentionNode` – Inserted mention nodes

### **Related Display**

* `RichContentWithMentions` – Shows hover cards on mentions

### **Internal Sub-Components**

* `MentionsTypeaheadMenuItem` – Dropdown item renderer

## **21. Open Questions / Notes**

* Consider debouncing for large user lists
* May want remote search for very large communities
* Could add recent mentions section
* Consider mention limit per post

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Dropdown with users | Multiple users | Base state |
| `SingleUser` | One user only | Single user array | Minimal dropdown |
| `ManyUsers` | Scrollable list | 20+ users | Scroll behaviour |
| `WithEmail` | Users with email | Email displayed | Email visible |
| `NoPhoto` | Initials fallback | No avatars | Initials shown |
| `Filtered` | Query active | Partial matches | Filtered results |
| `Empty` | No matches | No matching users | Empty state |

### **Controls (Args) Required**

* `users` (MentionUser[]) – array control
* `queryString` (string) – simulate typing

### **Mocking Requirements**

* **Editor context**: Must wrap in LexicalComposer
* **User data**: Realistic MentionUser objects
* **Portal container**: For dropdown positioning

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify keyboard navigation works
* Check screen reader announces options
* Verify focus management

### **Interaction Tests**

* Type "@" shows dropdown
* Type query filters results
* Arrow keys navigate
* Enter selects option
* Escape closes dropdown
* Click option selects it
