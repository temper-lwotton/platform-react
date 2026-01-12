# **Route Specification: Space Chat**

## **1. Route Path**

**`/spaces/[id]/chat`**

## **2. Description**

Real-time messaging interface for space members.

* Provides Slack-like channel interface
* Displays status updates as messages
* Shows members sidebar
* Supports message composition and sending

## **3. Source File**

```
src/app/(protected)/spaces/[id]/chat/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Rendering the chat interface layout
* Displaying status update messages
* Providing message input functionality
* Showing space members sidebar
* Displaying channel information

### **This route does not:**

* Handle real-time message updates (future enhancement)
* Manage message moderation
* Support direct messages
* Handle file uploads in chat

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Space member or admin
* **Permission Rules:** Must have access to the space

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | The unique identifier of the space |

* **Default behaviour:** N/A - id is required
* **Validation:** Invalid id shows "Space not found"

## **7. Layout & Structure**

### **Layout Overview**

* Two-column layout
* Main chat area with sidebar

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Channel Header | Channel name (#general-chat) and description |
| Messages Container | Scrollable list of status updates |
| Chat Input | Fixed message composition area |
| Right Sidebar | Space members list |

## **8. Components Used**

### **Layout Components**

*None - custom chat layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `SpaceChatInput` | `@/components/ui/SpaceChatInput` | Message input component |
| `SpaceChatMembers` | `@/components/ui/SpaceChatMembers` | Members sidebar |
| `StatusUpdateCard` | `@/components/ui/StatusUpdateCard` | Display status update messages |
| `Icon` | `@/components/ui/Icon` | Channel and empty state icons |

## **9. Data Flow Overview**

1. Extract space ID from URL parameters
2. Fetch space data for member info
3. Get status updates for the space (synchronous)
4. Render chat interface with messages
5. User sends message → create status update → refetch
6. Messages display in chronological order

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['space', id]` | `getSpace(id)` | `Space` | `!!id` |

### **Static Data**

| Source | Description |
|--------|-------------|
| `getStatusUpdatesBySpace(id)` | Synchronous call to get status updates |

## **11. State Management**

### **Local State**

*No local state - data from queries and static sources.*

### **Derived State**

*None*

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | "Loading chat..." message |
| Space not found | "Space not found." error |
| Chat loaded (with messages) | Messages displayed in container |
| Chat loaded (no messages) | Welcome empty state with tips |
| Sending message | Input disabled while sending |
| Message sent | Message appears in list |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Send message | Submit chat input | Post status update, refresh messages |
| Scroll messages | Scroll in messages container | View older/newer messages |
| View member | Click member in sidebar | View member profile |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| View member profile | Click member in sidebar | `/users/[id]` |

### **Data Mutations**

| Action | Trigger | Result |
|--------|---------|--------|
| Send message | Submit SpaceChatInput | Create status update via API |

## **14. Infinite Scroll / Pagination**

*Not currently implemented - all messages loaded at once.*

## **15. Error & Empty States**

* **Loading:** "Loading chat..." message
* **Space not found:** "Space not found." error message
* **No messages (empty state):**
  * Large comment icon (48px)
  * "Welcome to #general-chat" title
  * Channel description
  * Tips: research, progress, collaboration, ideas

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** None currently
* **Parallel vs sequential fetching:** Single space query
* **Known constraints:**
  * No real-time updates (polling or WebSocket)
  * All messages loaded at once
  * Status updates used as messages (not optimized for chat)

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through input and members
* **Focus management:** Focus on input after sending
* **Screen reader expectations:** Messages announced, member list accessible
* **Landmark roles:** Main chat area, complementary sidebar

## **18. Storybook & Testing Strategy**

### **Storybook**

* `SpaceChatInput` component
* `SpaceChatMembers` component
* `StatusUpdateCard` component
* Empty state display

### **Testing**

* **Unit test focus:** Message rendering, input handling
* **Integration test focus:** Message sending flow
* **E2E test focus:** Full chat experience

## **19. Non-Goals / Out of Scope**

* Real-time updates
* Direct messages
* Message editing/deletion
* File uploads
* Message reactions
* Thread replies

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/spaces/[id]` | Space overview |
| `/spaces/[id]/discussions` | Space discussions |
| `/users/[id]` | Member profiles |

## **21. Open Questions / Notes**

* Consider implementing real-time updates via WebSocket
* May need message pagination for large histories
* Consider adding reactions and threads
* File sharing functionality planned for future

### **Chat Interface Structure**

* **Channel header:** Shows "#general-chat" with description
* **Messages container:** Scrollable list of StatusUpdateCard components
* **Chat input:** Fixed at bottom using SpaceChatInput
