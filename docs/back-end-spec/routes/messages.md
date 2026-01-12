# **Route Specification: Messages**

## **1. Route Path**

**`/messages`**

## **2. Description**

Messages placeholder page serving as the default view when no conversation is selected.

* Part of messages layout with conversation sidebar
* Displays placeholder prompting user to select or start a conversation
* Entry point to messaging functionality

## **3. Source File**

```
src/app/(protected)/messages/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying placeholder content when no conversation is selected
* Providing visual guidance to select or start a conversation
* Integrating with messages layout that includes sidebar

### **This route does not:**

* Display conversation content
* Fetch message data
* Handle message sending
* List conversations (handled by layout sidebar)

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** All authenticated users can access messaging

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

* Centered placeholder content
* Part of messages layout with sidebar

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Placeholder | Centered icon, title, and description |

## **8. Components Used**

### **Layout Components**

*Uses shared messages layout with sidebar*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Icon` | `@/components/ui/Icon` | Comment icon for placeholder |

## **9. Data Flow Overview**

1. Page renders within messages layout
2. Display static placeholder content
3. User interacts with sidebar to select conversation

## **10. Data Fetching**

*None - Static placeholder content.*

## **11. State Management**

*None - Static content.*

### **Local State**

*None*

### **Derived State**

*None*

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Always | Placeholder displayed |

## **13. User Actions**

### **UI Interactions**

*None on this page - interactions via sidebar*

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Start new conversation | Click "New" in sidebar | `/messages/new` |
| View conversation | Click conversation in sidebar | `/messages/[conversationId]` |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

*Not applicable - always shows placeholder.*

## **16. Performance & Constraints**

* **Rendering strategy:** Static content
* **Memoisation strategy:** None needed
* **Parallel vs sequential fetching:** N/A
* **Known constraints:** None

## **17. Accessibility Considerations**

* **Keyboard navigation:** Sidebar accessible via keyboard
* **Focus management:** N/A for placeholder
* **Screen reader expectations:** Placeholder text read aloud
* **Landmark roles:** Main content area

## **18. Storybook & Testing Strategy**

### **Storybook**

* Placeholder component

### **Testing**

* **Unit test focus:** Placeholder renders correctly
* **Integration test focus:** Layout integration
* **E2E test focus:** Messages entry point

## **19. Non-Goals / Out of Scope**

* Message display
* Conversation listing
* Message sending

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/messages/new` | Start new conversation |
| `/messages/[conversationId]` | View conversation |

## **21. Open Questions / Notes**

* Consider adding quick actions in placeholder

### **Placeholder Content**

* Large comment icon (48px)
* "Your Messages" title
* "Select a conversation from the sidebar or start a new one" description
