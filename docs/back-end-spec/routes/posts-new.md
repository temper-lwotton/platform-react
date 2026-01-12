# **Route Specification: Posts New**

## **1. Route Path**

**`/posts/new`**

## **2. Description**

Multi-step discussion creation wizard with AI-powered enhancement. Step 1 captures content, Step 2 provides AI-generated excerpts and engagement analysis before publishing.

* Two-step wizard flow
* AI excerpt generation
* Engagement analysis
* Rich text editing

## **3. Source File**

```
src/app/(protected)/posts/new/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Capturing discussion content
* Generating AI excerpts
* Analyzing engagement potential
* Creating new discussions

### **This route does not:**

* Edit existing discussions
* Manage discussion listing
* Handle media uploads
* Configure space settings

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** Must be member/admin of at least one space

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `spaceId` | `string` | No | Pre-select space from URL |

* **Default behaviour:** No space pre-selected
* **Validation:** Invalid spaceId ignored

## **7. Layout & Structure**

### **Layout Overview**

* Single column wizard layout
* Step indicator header
* Form content area

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Step-dependent title, cancel link |
| Step Indicator | Visual progress (1. Content → 2. Enhance) |
| Form | Step-specific content and actions |

## **8. Components Used**

### **UI Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `LexicalEditor` | `@/components/ui/Lexical` | Rich text with @mentions |
| `ExcerptSelector` | `@/components/ui/ExcerptSelector` | AI excerpt options |
| `EngagementAnalysis` | `@/components/ui/EngagementAnalysis` | Engagement predictions |

### **Primitive Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Input` | `@/components/ui/primitives` | Title input |
| `Button` | `@/components/ui/primitives` | Form buttons |
| `Link` | `next/link` | Cancel navigation |

### **Radix UI Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Popover` | `@radix-ui/react-popover` | Space selector dropdown |
| `RadioGroup` | `@radix-ui/react-radio-group` | Space selection |

## **9. Data Flow Overview**

1. Verify user authentication
2. Load user's available spaces
3. User fills Step 1 (title, content, space)
4. Call AI for excerpt generation
5. User selects/edits excerpt in Step 2
6. Call AI for engagement analysis
7. User posts → create discussion → redirect

## **10. Data Fetching**

### **React Query Queries**

| Query Key | Function | Data Type | Dependencies |
|-----------|----------|-----------|--------------|
| `['current-user']` | `fetchCurrentUser` | User with spaces | `isClient && !!currentUserId` |
| `['user-spaces', userSpaceIds]` | `Promise.all(getSpace)` | `Space[]` | `userSpaceIds.length > 0` |

### **React Query Mutations**

| Mutation | Function | On Success |
|----------|----------|------------|
| `generateExcerptsMutation` | `POST /api/discussions/generate-excerpts` | Set excerpts, go to step 2 |
| `analyzeEngagementMutation` | `POST /api/discussions/analyze-engagement` | Set analysis data |
| `createMutation` | `createDiscussion(payload)` | Redirect to discussion |

## **11. State Management**

### **Step 1 State (useState)**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `title` | `string` | Discussion title |
| `content` | `string` | Plain text (for AI) |
| `htmlContent` | `string` | HTML (for saving) |
| `selectedSpaceId` | `string` | Target space |

### **Step 2 State (useState)**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `aiExcerpts` | `string[]` | AI-generated excerpt options |
| `selectedExcerpt` | `string` | Currently selected excerpt |
| `customExcerpt` | `string` | User's custom excerpt |
| `engagementAnalysis` | `EngagementAnalysis \| null` | AI analysis results |

### **UI State (useState)**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `currentStep` | `1 \| 2` | Current wizard step |
| `currentUserId` | `string \| null` | Current user |
| `isClient` | `boolean` | Hydration check |
| `isPopoverOpen` | `boolean` | Space selector state |

### **Derived State (useMemo)**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `mentionUsers` | `selectedSpace` | Space members for @mentions |

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Not authenticated | Returns null |
| Step 1 | Content form with space selector |
| Step 1 valid | "Next" button enabled |
| Generating excerpts | Button shows loading |
| Step 2 | Excerpt selection + analysis |
| Excerpt selected | Triggers engagement analysis |
| Analyzing | Shows loading in EngagementAnalysis |
| Posting | Button shows loading |
| API error | Shows error message box |

## **13. User Actions**

### **Step 1 Actions**

| Action | Trigger | API Endpoint |
|--------|---------|--------------|
| Select space | Click in space popover | None (local) |
| Enter title | Type in input | None (local) |
| Write content | Type in editor | None (local) |
| Generate excerpts | Click "Next: AI Enhancement" | `POST /api/discussions/generate-excerpts` |

### **Step 2 Actions**

| Action | Trigger | API Endpoint |
|--------|---------|--------------|
| Select excerpt | Click excerpt option | None (local) + triggers analysis |
| Edit custom | Modify custom excerpt | None |
| Analyze engagement | Auto on excerpt select | `POST /api/discussions/analyze-engagement` |
| Post discussion | Click "Post Discussion" | `createDiscussion` |
| Go back | Click "← Back" | None (local) |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Cancel | Click cancel link | `/` |
| View created | After successful creation | `/spaces/[spaceId]/discussions/[newId]` |

## **14. Form Validation**

### **Step 1 Validation**

```typescript
const isStep1Valid =
  title.trim() &&
  content.trim() &&
  selectedSpaceId &&
  currentUserId &&
  content.trim().length >= 50; // Minimum for AI
```

### **Step 2 Validation**

```typescript
const isStep2Valid =
  selectedExcerpt.trim() &&
  selectedExcerpt.trim().length >= 30 &&
  selectedExcerpt.trim().length <= 200;
```

## **15. AI Features**

### **Excerpt Generation**

* Sends title and content to AI
* Returns multiple excerpt options
* Auto-selects middle (most balanced) option

### **Engagement Analysis**

* Triggered automatically when excerpt selected
* Analyzes title, content, excerpt, and space context
* Returns engagement predictions and suggestions

## **16. Discussion Payload**

```typescript
{
  title: string;
  excerpt: string;
  htmlContent: string;
  author: number;
  space: number;
}
```

## **17. Error & Empty States**

* **Not authenticated:** Returns null
* **No spaces:** Cannot create (need space membership)
* **Generating excerpts:** Button shows loading
* **Analyzing engagement:** Shows loading indicator
* **Posting:** Button shows loading
* **API errors:** Shows error message box

## **18. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** useMemo for mentionUsers
* **Parallel vs sequential fetching:** Sequential (step-based)
* **Known constraints:**
  * AI processing adds latency (2-4 seconds)
  * Minimum content length required

## **19. Accessibility Considerations**

* **Keyboard navigation:** Tab through form fields
* **Focus management:** Focus in title on load
* **Screen reader expectations:** Step announcements
* **Landmark roles:** Form regions

## **20. Storybook & Testing Strategy**

### **Storybook**

* Step 1 empty state
* Step 1 filled state
* Step 2 with excerpts
* Loading states

### **Testing**

* **Unit test focus:** Form validation, state management
* **Integration test focus:** AI API integration
* **E2E test focus:** Complete creation flow

## **21. Non-Goals / Out of Scope**

* Editing existing discussions
* Media uploads
* Draft saving
* Template selection

## **22. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/spaces/[id]/discussions` | Linked from space |
| `/spaces/[id]/discussions/[discussionId]` | Created discussion |
| `/api/discussions/generate-excerpts` | Excerpt generation API |
| `/api/discussions/analyze-engagement` | Engagement analysis API |

## **23. Open Questions / Notes**

* Consider adding draft auto-save
* May need template support
* Consider adding image upload to editor
