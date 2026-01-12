# **Component Specification: MentionNode**

## **1. Component Name**

**`MentionNode`**

## **2. Description**

A custom Lexical node representing an @mention that extends TextNode.

* Stores mention display text and user ID
* Exports to HTML as anchor links to user profiles
* Imports from HTML for round-trip editing
* Styled with special CSS class for visual distinction
* Used by MentionsPlugin and displayed by RichContentWithMentions

## **3. Location**

```
src/components/ui/Lexical/nodes/MentionNode.tsx
```

## **4. Component Type**

**Lexical Node** – Not a React component; a custom Lexical node class.

## **5. Class Definition**

```typescript
export class MentionNode extends TextNode {
  __mention: string;  // Display text (e.g., "@John Doe")
  __userId: string;   // User ID for linking

  static getType(): string {
    return 'mention';
  }
}
```

## **6. Properties**

| Property | Type | Description |
|----------|------|-------------|
| `__mention` | `string` | Display text including "@" prefix |
| `__userId` | `string` | User ID for profile linking |

*Inherits all TextNode properties.*

## **7. Serialization Types**

### **SerializedMentionNode**

```typescript
type SerializedMentionNode = Spread<
  {
    mentionName: string;
    userId: string;
  },
  SerializedTextNode
>;
```

## **8. Factory Functions**

### **$createMentionNode**

Creates a new mention node with proper mode settings.

```typescript
export function $createMentionNode(
  mentionName: string,
  userId: string,
): MentionNode {
  const mentionNode = new MentionNode(mentionName, userId);
  mentionNode.setMode('segmented').toggleDirectionless();
  return $applyNodeReplacement(mentionNode);
}
```

### **$isMentionNode**

Type guard for checking if a node is a MentionNode.

```typescript
export function $isMentionNode(
  node: LexicalNode | null | undefined,
): node is MentionNode {
  return node instanceof MentionNode;
}
```

## **9. Behaviour Matrix**

| Method | Input | Output | Notes |
|--------|-------|--------|-------|
| `createDOM` | EditorConfig | HTMLElement (span) | For editing view |
| `exportDOM` | - | Anchor element | For storage/display |
| `importDOM` | HTML anchor | MentionNode | Round-trip support |
| `exportJSON` | - | SerializedMentionNode | JSON persistence |
| `importJSON` | SerializedMentionNode | MentionNode | JSON restoration |
| `isTextEntity` | - | `true` | Treated as single unit |
| `canInsertTextBefore` | - | `false` | No typing before |
| `canInsertTextAfter` | - | `false` | No typing after |

## **10. DOM Methods**

### **createDOM**

Creates the editing view element.

```typescript
createDOM(config: EditorConfig): HTMLElement {
  const element = super.createDOM(config);
  element.className = 'mention-link';
  element.setAttribute('data-user-id', this.__userId);
  element.setAttribute('data-lexical-mention', 'true');
  return element;
}
```

### **exportDOM**

Exports to HTML for storage and read-only display.

```typescript
exportDOM(): DOMExportOutput {
  const element = document.createElement('a');
  element.setAttribute('href', `/users/${this.__userId}`);
  element.setAttribute('data-user-id', this.__userId);
  element.setAttribute('class', 'mention-link');
  element.textContent = this.__text;
  return { element };
}
```

### **importDOM**

Converts HTML back to node for editing.

```typescript
static importDOM(): DOMConversionMap | null {
  return {
    a: (domNode: HTMLElement) => {
      if (!domNode.hasAttribute('data-lexical-mention')) {
        return null;
      }
      return {
        conversion: convertMentionElement,
        priority: 1,
      };
    },
  };
}
```

## **11. JSON Serialization**

### **exportJSON**

```typescript
exportJSON(): SerializedMentionNode {
  return {
    ...super.exportJSON(),
    mentionName: this.__mention,
    userId: this.__userId,
    type: 'mention',
    version: 1,
  };
}
```

### **importJSON**

```typescript
static importJSON(serializedNode: SerializedMentionNode): MentionNode {
  const node = $createMentionNode(
    serializedNode.mentionName,
    serializedNode.userId,
  );
  node.setTextContent(serializedNode.text);
  node.setFormat(serializedNode.format);
  node.setDetail(serializedNode.detail);
  node.setMode(serializedNode.mode);
  node.setStyle(serializedNode.style);
  return node;
}
```

## **12. Styling**

### **CSS Classes**

* `.mention-link` – Applied to both editing and export views

### **Editing View**

```html
<span class="mention-link" data-user-id="123" data-lexical-mention="true">
  @John Doe
</span>
```

### **Exported HTML**

```html
<a href="/users/123" data-user-id="123" class="mention-link">
  @John Doe
</a>
```

## **13. Accessibility Requirements**

* **Screen Reader**: Mention text readable as link
* **Navigation**: Exported as anchor for keyboard navigation

### **Improvements Needed**

* Consider adding `aria-label` describing the mention
* May want to announce mention type to screen readers

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Missing userId | Empty href attribute | Link to `/users/` |
| Invalid HTML on import | Returns null | Node not created |
| Missing data-lexical-mention | Import skipped | Regular link preserved |

## **15. Performance Notes**

* **Immutable**: Mention text cannot be edited in place
* **Segmented Mode**: Treated as single character for selection
* **Directionless**: No text direction applied

## **16. Usage Examples**

### **Creating a Mention Node**

```typescript
import { $createMentionNode, $isMentionNode } from '../nodes/MentionNode';

editor.update(() => {
  const mention = $createMentionNode('@John Doe', '123');
  selection.insertNodes([mention]);
});
```

### **Checking if Node is Mention**

```typescript
if ($isMentionNode(node)) {
  console.log('User ID:', node.__userId);
  console.log('Display:', node.__mention);
}
```

### **Registering Node with Editor**

```typescript
const initialConfig = {
  namespace: 'MyEditor',
  nodes: [MentionNode], // Include in nodes array
  // ...
};
```

## **17. Features Summary**

* Extends TextNode for text-like behaviour
* Stores user ID for profile linking
* Exports as anchor element with profile URL
* Imports from HTML with data attribute detection
* JSON serialization for persistence
* Prevented text insertion before/after
* Single-unit selection behaviour

## **18. Testing Considerations**

### **Unit Tests**

* Node creation with factory function
* Type guard returns correct result
* createDOM produces correct attributes
* exportDOM creates anchor with href
* importDOM converts from HTML
* JSON round-trip preserves data
* canInsertText methods return false

### **Mocking**

* Lexical internals for node testing

### **Edge Cases**

* Special characters in name
* Very long names
* Numeric user IDs
* Missing user ID

## **19. Out of Scope / Non-Goals**

* **User data fetching**: Only stores ID
* **Avatar display**: Handled by display components
* **Mention editing**: Cannot modify after creation
* **Click handling**: Uses standard anchor behaviour

## **20. Related Components & System Context**

### **Created By**

* `MentionsPlugin` – Creates nodes on selection

### **Display Components**

* `RichContent` – Renders as styled link
* `RichContentWithMentions` – Adds hover cards

### **Type System**

* `SerializedMentionNode` – JSON type

### **Converter Function**

* `convertMentionElement` – DOM to node conversion

## **21. Open Questions / Notes**

* Consider storing user name separately from display text
* May want to validate user ID exists
* Could add mention update mechanism if user name changes

## **22. Storybook Mapping**

### **Notes**

MentionNode is a Lexical node class, not a React component. It cannot be directly rendered in Storybook.

### **Testing in Storybook**

Test via parent components:

* `LexicalEditor` stories with mentions
* `MentionsPlugin` stories
* `RichContent` stories with mention HTML

### **Visual Testing**

* Verify mention styling in editor
* Check exported HTML renders correctly
* Test hover cards in RichContentWithMentions

### **Data Attributes**

Verify these attributes in DOM:

* `data-user-id` – User ID value
* `data-lexical-mention` – Identifies as mention
* `href` – Profile URL format
