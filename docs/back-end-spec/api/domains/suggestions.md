# **API Domain Specification: Suggestions**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `Suggestions`**

### **Description**

The Suggestions domain provides a personalized recommendation engine that analyzes user behavior, interests, and social connections to generate relevant suggestions across multiple content types. It provides:

* Multi-type suggestions (users, spaces, events, discussions, resources, showcases)
* Contextual reasoning explaining why items are recommended
* Activity-based learning that improves over time
* User dismissal and feedback mechanisms
* Configurable scoring and weighting

Each suggestion includes human-readable reasoning to help users understand why content is relevant to them.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Generating personalized suggestions based on user signals
* Scoring and ranking suggestions by relevance
* Managing user dismissals and preferences
* Tracking suggestion impressions and interactions
* Providing suggestion feeds for different contexts (carousel, page)
* Admin configuration of suggestion weights

### **Out of scope:**

* Content creation (see respective content domains)
* User profiles and preferences storage (see [Users](./users.md))
* Activity event generation (handled by source domains)
* Real-time notification of new suggestions (see [Notifications](./notifications.md))

---

## **Owned Data Models**

### **Core Entities**

#### **Suggestion**

```typescript
interface Suggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  reason: string;                    // Primary human-readable reason
  reasonDetails?: SuggestionReason;  // Detailed reason data
  image?: string;
  url: string;
  score: number;                     // Relevance score (0-100)
  createdAt: string;                 // ISO 8601
  expiresAt?: string;                // When suggestion becomes stale
  entityId: string;                  // Reference to actual entity
  entityType: SuggestionType;
  metadata?: SuggestionMetadata;     // Type-specific metadata
}
```

#### **SuggestionReason**

```typescript
interface SuggestionReason {
  category: ReasonCategory;
  text: string;                      // Human-readable reason
  signals: string[];                 // IDs of contributing signals
  confidence: number;                // 0-1 confidence score
  relatedEntities?: {
    type: 'user' | 'space' | 'topic' | 'content';
    id: string;
    name: string;
  }[];
}
```

#### **DismissedSuggestion**

```typescript
interface DismissedSuggestion {
  id: string;
  userId: string;
  suggestionId: string;
  entityType: SuggestionType;
  entityId: string;
  dismissedAt: string;               // ISO 8601
  reason?: DismissReason;
}
```

#### **SuggestionInteraction**

```typescript
interface SuggestionInteraction {
  id: string;
  userId: string;
  suggestionId: string;
  action: InteractionAction;
  timestamp: string;
  metadata?: {
    timeToAction?: number;           // Seconds from display to action
    position?: number;               // Position in list when clicked
    context?: 'feed' | 'carousel' | 'page';
  };
}
```

#### **SuggestionSignal**

```typescript
interface SuggestionSignal {
  id: string;
  userId: string;
  type: SignalType;
  entityType?: string;
  entityId?: string;
  value?: string | number;
  weight: number;                    // Signal importance (0-1)
  createdAt: string;
  expiresAt?: string;                // When signal becomes stale
}
```

**Notes:**
* Suggestions are pre-computed in background jobs, not generated on-demand
* `score` is calculated using the scoring algorithm with signal weights
* `metadata` contains type-specific fields for rich display

---

## **Enumerations**

### **SuggestionType**

| Value | Description | Display Label |
|-------|-------------|---------------|
| `user` | People to connect with | Person |
| `space` | Communities to join | Space |
| `event` | Events to attend | Event |
| `discussion` | Discussions to participate in | Discussion |
| `resource` | Learning resources | Resource |
| `showcase` | Success stories and case studies | Success Story |

```typescript
type SuggestionType = 'user' | 'space' | 'event' | 'discussion' | 'resource' | 'showcase';
```

### **ReasonCategory**

| Value | Description | Example |
|-------|-------------|---------|
| `shared_interests` | Common topics or skills | "You both have interest in Machine Learning" |
| `network_activity` | Activity in user's network | "5 people in your network discussing this" |
| `similar_content` | Related to consumed content | "Related to your recent reading" |
| `similar_behavior` | Based on similar actions | "You attended similar events" |
| `community_match` | Based on community membership | "Similar to communities you've joined" |
| `trending_network` | Popular in user's network | "Popular among developers in your network" |
| `topic_match` | Matches declared interests | "Matches your interest in Real-time Systems" |
| `recent_activity` | Based on recent actions | "You've been discussing AI safety" |

```typescript
type ReasonCategory =
  | 'shared_interests'
  | 'network_activity'
  | 'similar_content'
  | 'similar_behavior'
  | 'community_match'
  | 'trending_network'
  | 'topic_match'
  | 'recent_activity';
```

### **DismissReason**

| Value | Description |
|-------|-------------|
| `not_interested` | User not interested in this topic |
| `already_know` | User already knows this person/content |
| `not_relevant` | Suggestion doesn't match interests |
| `seen_before` | User has seen this before |
| `other` | Other reason |

```typescript
type DismissReason = 'not_interested' | 'already_know' | 'not_relevant' | 'seen_before' | 'other';
```

### **InteractionAction**

| Value | Description |
|-------|-------------|
| `viewed` | Suggestion was displayed |
| `clicked` | User clicked to view |
| `dismissed` | User dismissed |
| `converted` | User took suggested action |
| `ignored` | Displayed but not interacted with |

```typescript
type InteractionAction = 'viewed' | 'clicked' | 'dismissed' | 'converted' | 'ignored';
```

### **Signal Weights**

| Signal Type | Base Weight | Decay Period |
|-------------|-------------|--------------|
| Connected/Followed | 0.9 | 30 days |
| Joined space | 0.85 | 60 days |
| RSVP/Attended event | 0.8 | 14 days |
| Created content | 0.75 | 30 days |
| Liked/Commented | 0.6 | 7 days |
| Viewed content | 0.3 | 3 days |
| Searched | 0.4 | 1 day |
| Browsed | 0.2 | 1 day |

---

## **Relationships & Concepts**

### **Signal-Based Generation**

Suggestions are generated from user activity signals:
* Content interactions (views, likes, comments, shares)
* Social actions (connections, follows, messages)
* Community engagement (space joins, discussions)
* Event participation (RSVPs, attendance)
* Profile updates (interests, skills)
* Search and browse behavior

### **Scoring Algorithm**

```
finalScore = Σ(signalWeight × signalDecay × typeWeight) × diversityBonus
```

Where:
- `signalWeight`: Base importance of the signal
- `signalDecay`: Time-based decay factor
- `typeWeight`: Configurable weight for content type
- `diversityBonus`: Boost for underrepresented types

### **Diversity Requirements**

* No more than 3 consecutive suggestions of the same type
* At least 2 different types in the top 10 suggestions
* Balance between high-score and discovery suggestions

### **Dismissal Behavior**

* Dismissed suggestions excluded from results by default
* Users can view and restore dismissed suggestions
* Dismissal reasons improve future recommendations
* Dismissed entities may reappear after significant changes

---

## **Business Rules**

1. **Background Generation**: Suggestions generated in background jobs, not on-demand
2. **Caching**: Pre-computed suggestions cached per user
3. **Regeneration Triggers**: New suggestions after significant activity, followed user content, matching events, or scheduled (every 6 hours)
4. **Dismissal Permanence**: Dismissed suggestions stay dismissed until restored
5. **Score Threshold**: Only suggestions above minimum score (default 30) are shown
6. **Rate Limiting**: Refresh endpoint rate limited per user
7. **Diversity Enforcement**: Algorithm enforces type diversity in results

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes (all endpoints)
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| List suggestions | Any authenticated user (own suggestions) |
| Dismiss suggestion | Any authenticated user (own suggestions) |
| Restore dismissed | Any authenticated user (own suggestions) |
| Record interaction | Any authenticated user |
| Refresh suggestions | Any authenticated user (rate limited) |
| View metrics | Admin only |
| Configure weights | Admin only |

---

## **API Capabilities Overview**

The Suggestions API allows consumers to:

* **List suggestions** with filtering by type and score
* **Get carousel suggestions** optimized for feed widget
* **Get suggestions by type** for dedicated pages
* **Dismiss and restore** suggestions
* **Record interactions** for algorithm improvement
* **Bulk record impressions** for analytics
* **Refresh suggestions** (rate limited)
* **Admin: View metrics** and configure weights

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Suggestions](../endpoints/suggestions/README.md) | Core suggestion operations | 10 |
| [Admin](../endpoints/suggestions/README.md#admin) | Metrics and configuration | 2 |

Full endpoint details in the [Endpoint Reference](../endpoints/suggestions/README.md).

---

## **Domain Events & Side Effects**

### **Events Consumed**

| Event | Source Domain | Effect |
|-------|---------------|--------|
| `user.connected` | Users | Creates social signal |
| `space.joined` | Spaces | Creates community signal |
| `discussion.created` | Discussions | Creates content signal |
| `event.rsvp` | Events | Creates event signal |
| `content.viewed` | Various | Creates browse signal |

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `suggestion.dismissed` | User dismisses | `{ suggestionId, userId, reason }` |
| `suggestion.restored` | User restores | `{ suggestionId, userId }` |
| `suggestion.interaction` | User interacts | `{ suggestionId, action }` |
| `suggestions.refreshed` | User refreshes | `{ userId, newCount }` |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| Signals accumulated | Triggers background regeneration |
| Dismissal recorded | Improves future suggestions |
| Interaction recorded | Updates algorithm feedback |

---

## **Error Model**

Standard error envelope (see [API Conventions](../_index.md#error-codes)):

```typescript
{
  success: false,
  error: {
    code: string,
    message: string
  }
}
```

### **Domain-Specific Error Codes**

| Code | HTTP | Description |
|------|------|-------------|
| `SUGGESTION_NOT_FOUND` | 404 | Suggestion ID does not exist |
| `INVALID_TYPE` | 400 | Invalid suggestion type |
| `INVALID_SCORE` | 400 | Score out of range (0-100) |
| `RATE_LIMITED` | 429 | Too many refresh requests |
| `NOT_DISMISSED` | 404 | Cannot restore non-dismissed suggestion |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/feed` | Suggestion carousel widget |
| `/suggestions` | Full suggestions page |
| `/suggestions/[type]` | Type-specific suggestions |
| `/settings` | Dismissed suggestions management |

### **Service Location**

```
src/lib/suggestions.ts (to be created)
```

### **Pagination**

* Cursor-based using `cursor` parameter
* Ordered by score descending, then by creation date
* Default limit: 20, max: 50

### **Null Fields**

* `image` - null if no image available
* `expiresAt` - null if no expiration
* `reasonDetails` - null for simplified responses
* `metadata` - type-specific, fields vary

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| Suggestion list | Short TTL (5min), invalidate on dismiss |
| Suggestion count | Short TTL (5min), invalidate on dismiss |
| Carousel | Medium TTL (10min) |

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| List suggestions | High (feed loading) |
| Carousel | Very High (homepage) |
| Dismiss | Low |
| Impressions | Medium (batched) |

### **Pagination Limits**

* Default page size: 20
* Maximum page size: 50
* Carousel limit: 15

### **Rate Limiting**

* Refresh endpoint: 1 request per hour per user

### **Known Trade-offs**

* Background generation means slight delay for new users
* High-frequency signals may overwhelm less common ones
* Diversity requirements may lower average relevance score

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/feed` | Carousel integration |
| `/suggestions` | Main suggestions page |
| `/users/[id]` | User suggestions |
| `/spaces` | Space suggestions |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [Users](./users.md) | User suggestions, signal source |
| [Spaces](./spaces.md) | Space suggestions, signal source |
| [Events](./events.md) | Event suggestions, signal source |
| [Discussions](./discussions.md) | Discussion suggestions, signal source |

---

## **Non-Goals / Explicit Exclusions**

* **Real-time generation** - Suggestions are pre-computed, not on-demand
* **User-to-user recommendations** - Not a matchmaking service
* **Content moderation** - Suggestions respect content visibility only
* **Notification delivery** - Suggestions are pull-based, not pushed
* **A/B testing framework** - Algorithm tuning is manual via admin config

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* Real-time suggestion updates via WebSocket
* Machine learning model integration
* A/B testing framework
* Personalized refresh frequency
* Collaborative filtering

---

## **Open Questions / Notes**

* Consider adding WebSocket for real-time new suggestion notifications
* May need more granular reason categories
* Algorithm transparency for users (explain scoring?)
* Cold start problem for new users
