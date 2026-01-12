# **Route Specification: Messages New**

## **1. Route Path**

**`/messages/new`**

## **2. Description**

New conversation creation page for starting direct message conversations.

* Search and select recipients from user list
* Compose initial message
* Start new conversation thread

## **3. Source File**

```
src/app/(protected)/messages/new/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Providing recipient search and selection
* Composing initial message content
* Creating new conversation via API
* Redirecting to created conversation

### **This route does not:**

* Display existing conversations
* Handle conversation replies
* Manage group conversations beyond initial setup

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** Can message any user in the system

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `recipientId` | `string` | No | Pre-select recipient user |

* **Default behaviour:** No recipient pre-selected
* **Validation:** Invalid recipientId ignored

## **7. Layout & Structure**

### **Layout Overview**

* Single column form layout
* Part of messages layout with sidebar

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Title | "New Message" header |
| Recipients Field | Tag-style input with search suggestions |
| Message Field | Textarea for initial message |
| Submit Button | "Send Message" action |

## **8. Components Used**

### **Layout Components**

*Uses shared messages layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Input` | `@/components/ui/primitives` | Recipient search input |
| `Textarea` | `@/components/ui/primitives` | Message composition |
| `Button` | `@/components/ui/primitives` | Submit button |

## **9. Data Flow Overview**

1. Fetch all users for recipient search
2. User searches and selects recipients
3. User composes message content
4. On submit: create conversation → redirect to thread

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['users']` | `getUsers()` | `User[]` | Always enabled |

### **Mutations**

| Mutation | Function | On Success |
|----------|----------|------------|
| `createMutation` | `startConversation({ content, sender, recipients })` | Invalidate conversations, redirect |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `selectedUsers` | `User[]` | Selected recipient users |
| `message` | `string` | Message content |
| `searchQuery` | `string` | User search input |

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `filteredUsers` | `users, searchQuery, selectedUsers, currentUserId` | Users matching search, excluding current and selected |

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Not authenticated | "Please log in to start a conversation" |
| No recipients selected | Submit button disabled |
| No message content | Submit button disabled |
| Valid form | Submit button enabled |
| Submitting | Button shows loading state |
| Success | Redirect to `/messages/[newId]` |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Search users | Type in recipient field | Filter suggestions |
| Select recipient | Click user from suggestions | Add to selectedUsers |
| Remove recipient | Click × on recipient tag | Remove from selectedUsers |
| Compose message | Type in message textarea | Update message state |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| View created | Successful submission | `/messages/[newId]` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Send message | Form submit | `startConversation` | Redirect to conversation |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Not authenticated:** "Please log in to start a conversation"
* **No search results:** No suggestions shown
* **Submission error:** Error message displayed

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Filtered users on search change
* **Parallel vs sequential fetching:** Single users query
* **Known constraints:**
  * All users loaded for search
  * Max 5 suggestions shown

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through form elements
* **Focus management:** Focus on recipient field on load
* **Screen reader expectations:** Recipient selection announced
* **Landmark roles:** Form with proper labeling

## **18. Storybook & Testing Strategy**

### **Storybook**

* Recipient search component
* Selected recipients display
* Form states

### **Testing**

* **Unit test focus:** User filtering, selection logic
* **Integration test focus:** Conversation creation flow
* **E2E test focus:** Complete new message journey

## **19. Non-Goals / Out of Scope**

* Group conversation management
* Rich text messages
* Message drafts
* Recipient validation

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/messages` | Messages listing |
| `/messages/[conversationId]` | Created conversation |

## **21. Open Questions / Notes**

* Consider adding group conversation support
* May need rich text editor
* Consider draft saving functionality

### **User Search Filtering**

```typescript
// Excludes:
// - Current user
// - Already selected users
// Matches on:
// - Full name
// - First + Last name
// - Email
```

### **User Display**

Each suggestion shows:
- Avatar (photo or initial placeholder)
- Display name
- Email address
