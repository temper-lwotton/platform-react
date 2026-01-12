# **Route Specification: Discussion Detail**

## **1. Route Path**

**`/spaces/[id]/discussions/[discussionId]`**

## **2. Description**

Discussion detail page with full content, comments, and interaction capabilities.

* Displays complete discussion content with rich text
* Shows threaded comments with nested replies
* Supports likes, replies, and moderation
* Provides @mention functionality in comments

## **3. Source File**

```
src/app/(protected)/spaces/[id]/discussions/[discussionId]/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying full discussion content
* Rendering threaded comment tree
* Handling like/unlike interactions
* Supporting comment creation with @mentions
* Providing moderation controls for admins

### **This route does not:**

* Edit the discussion (separate functionality)
* Delete the discussion
* Manage discussion settings
* Handle notifications

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Space member or admin
* **Permission Rules:** Must have access to the space

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | The unique identifier of the space |
| `discussionId` | `string` | Yes | The unique identifier of the discussion |

* **Default behaviour:** N/A - both params required
* **Validation:** Invalid params show error state

## **7. Layout & Structure**

### **Layout Overview**

* Single column layout
* Back link, article, comments section

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Back Link | Return to discussions list |
| Article | Discussion header, content, footer with stats |
| Comments Section | Comment form and threaded comment list |

## **8. Components Used**

### **Layout Components**

*None - custom article layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Icon` | `@/components/ui/Icon` | Comment icon in stats |
| `LikesDisplay` | `@/components/ui/LikesDisplay` | Like button and count |
| `LexicalCommentEditor` | `@/components/ui/Lexical` | Rich text editor for comments |
| `RichContent` | `@/components/ui/RichContent` | Render discussion HTML |
| `RichContentWithMentions` | `@/components/ui/RichContentWithMentions` | Render content with @mentions |
| `Button` | `@/components/ui/primitives` | Form submission buttons |
| `InlineModerationControls` | `@/components/cms/moderation/InlineModerationControls` | Moderation actions for admins |
| `Link` | `next/link` | Back navigation |

## **9. Data Flow Overview**

1. Extract space ID and discussion ID from URL parameters
2. Fetch discussion, comments, and space data in parallel
3. Build nested comment tree from flat comments
4. Derive mention users from space members
5. Render discussion article and comment section
6. User interacts (like, comment) → mutation → invalidate queries

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['discussion', discussionId]` | `getDiscussion(discussionId)` | `Discussion` | `!!discussionId` |
| `['discussion-comments', discussionId]` | `getDiscussionComments(discussionId)` | `Comment[]` | `!!discussionId` |
| `['space', spaceId]` | `getSpace(spaceId)` | `Space` | `!!spaceId` |

### **Mutations**

| Mutation | Function | On Success |
|----------|----------|------------|
| `commentMutation` | `createComment(discussionId, payload)` | Invalidate comments and discussion queries |
| `likeMutation` | `likeDiscussion` / `unlikeDiscussion` | Invalidate discussion query |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `replyContent` | `string` | Plain text reply content |
| `replyHtmlContent` | `string` | HTML reply content with mentions |
| `clearEditor` | `number` | Counter to trigger editor clear |

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `mentionUsers` | `space` | Deduplicated list of space members for @mentions |
| `isAdmin` | `currentUserId, space.admins` | Check if user is admin |
| `commentTree` | `comments` | Transform flat comments to nested structure |

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | "Loading discussion..." message |
| Error / Not found | Error message with back link |
| Discussion loaded | Article and comments displayed |
| No comments | "No comments yet. Be the first to comment!" |
| Comment posting | Form disabled, loading indicator |
| Comment error | "Failed to post reply" inline message |
| Like/unlike | Optimistic update, then server response |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Write reply | Use Lexical editor | Update reply state |
| Post reply | Submit reply form | Create comment via API |
| Like/unlike | Click LikesDisplay | Toggle like state via API |
| Reply to comment | Click reply on comment | Show nested reply form |
| Edit comment | Click edit (if author) | Show edit form |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Back to discussions | Click back link | `/spaces/[id]/discussions` |
| Login to reply | Click login link (if not auth) | `/login` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Like/unlike | Click LikesDisplay | `likeDiscussion` / `unlikeDiscussion` | Refresh discussion |
| Post reply | Submit reply form | `createComment` | Refresh comments, clear editor |
| Reply to comment | Submit nested reply | `createComment` with parentId | Refresh comments |

## **14. Infinite Scroll / Pagination**

*Not applicable - all comments loaded at once.*

## **15. Error & Empty States**

* **Loading:** "Loading discussion..." message
* **Error / Not found:** Error message with back link
* **Comment error:** "Failed to post reply" inline message
* **Empty comments:** "No comments yet. Be the first to comment!"

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** `useMemo` for mentionUsers, isAdmin, commentTree
* **Parallel vs sequential fetching:** Discussion, comments, space fetched in parallel
* **Known constraints:**
  * All comments loaded at once
  * Deep nesting may affect performance
  * @mention search is client-side

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through content and forms
* **Focus management:** Focus on reply form after submit
* **Screen reader expectations:** Discussion content and comments announced
* **Landmark roles:** Article with proper structure, form for comments

## **18. Storybook & Testing Strategy**

### **Storybook**

* Discussion article component
* Comment thread component
* `LexicalCommentEditor` component
* `LikesDisplay` component

### **Testing**

* **Unit test focus:** Comment tree building, mention user deduplication
* **Integration test focus:** Like/unlike flow, comment posting
* **E2E test focus:** Full discussion reading and commenting experience

## **19. Non-Goals / Out of Scope**

* Discussion editing
* Discussion deletion
* Comment deletion (admin only via moderation)
* Real-time comment updates
* Comment reactions

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/spaces/[id]/discussions` | Discussions listing |
| `/login` | For unauthenticated users |

## **21. Open Questions / Notes**

* Consider real-time comment updates
* May need comment pagination for very active discussions
* Consider comment reactions feature
* Thread collapse/expand for deep nesting

### **CommentItem Component**

Nested component for rendering individual comments with:
- Author avatar and info
- Comment content with mentions
- Reply and edit buttons
- Moderation controls (admin only)
- Nested replies (recursive)

### **Comment State**

| State | Type | Purpose |
|-------|------|---------|
| `isReplying` | `boolean` | Show reply form |
| `isEditing` | `boolean` | Show edit form |
| `replyText` / `replyHtml` | `string` | Reply content |
| `editText` / `editHtml` | `string` | Edit content |
