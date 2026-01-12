# **API Domain Specification: Spaces**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `Spaces`**

### **Description**

The Spaces domain manages community spaces within the platform. Spaces are collaborative areas where members can share discussions, events, resources, and other content. It provides:

* Space discovery and browsing
* Space metadata and membership information
* Tag-based categorization
* Public/private visibility control

Spaces are the primary organizational unit for community content and activity.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Listing and searching spaces
* Retrieving space details with membership
* Managing space tags for categorization
* Providing space member/admin lists
* Filtering spaces by various criteria

### **Out of scope:**

* Space creation and deletion (admin-only, not yet exposed)
* Space settings management
* Content within spaces (see [Discussions](./discussions.md), [Events](./events.md))
* User membership management (see [Users](./users.md))
* Space-specific permissions

---

## **Owned Data Models**

### **Core Entities**

#### **Space**

```typescript
interface Space {
  id: string;
  createdAt: string;       // ISO 8601
  title: string;           // Space name
  subtitle?: string;       // Short tagline
  description?: string;    // Full description (markdown)
  isPublic: boolean;       // Visibility flag
  admins: SpaceUser[];     // Space administrators
  members: SpaceUser[];    // Space members
  tags?: SpaceTag[];       // Categorization tags
}
```

#### **SpaceUser**

```typescript
interface SpaceUser {
  id: string;
  email?: string;          // May be hidden for privacy
  profile?: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    photo?: string;        // Avatar URL
  };
}
```

#### **SpaceTag**

```typescript
interface SpaceTag {
  id: number;
  name: string;            // Display name
}
```

---

## **Enumerations**

### **SpaceVisibility**

| Value | Description |
|-------|-------------|
| `public` | Visible to all authenticated users |
| `private` | Visible only to space members |

```typescript
type SpaceVisibility = 'public' | 'private';
```

### **MembershipLevel**

| Value | Description |
|-------|-------------|
| `admin` | Full control, member management |
| `member` | Regular participation rights |

```typescript
type MembershipLevel = 'admin' | 'member';
```

---

## **Relationships & Concepts**

### **Space Membership**

Each space has two membership levels:

| Level | Role | Capabilities |
|-------|------|--------------|
| **Admin** | Space administrator | Full control, member management |
| **Member** | Regular member | Post content, participate |

Membership is denormalized in both directions:
* Space → lists its admins and members
* User → lists their adminSpaces and memberSpaces

### **Space Visibility**

| Visibility | `isPublic` | Who Can See | Who Can Join |
|------------|------------|-------------|--------------|
| Public | `true` | Anyone | Self-join or request |
| Private | `false` | Members only | Invite only |

### **Tag-Based Filtering**

Spaces can be filtered by tags with two modes:

| Parameter | Behavior |
|-----------|----------|
| `matchAllTags=false` (default) | OR logic - match any tag |
| `matchAllTags=true` | AND logic - match all tags |

---

## **Business Rules**

1. **Private Space Filtering**: Private spaces only appear in listings for their members
2. **Public Space Access**: All authenticated users can view public spaces
3. **Membership Denormalization**: Membership is stored on both Space and User entities
4. **Single Title**: Each space must have a unique title
5. **Tag Association**: Spaces can have multiple tags for categorization
6. **Admin Required**: Every space must have at least one admin

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes (all endpoints)
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| List public spaces | Any authenticated user |
| List private spaces | Members of those spaces |
| View public space | Any authenticated user |
| View private space | Members only |
| List space tags | Any authenticated user |

**Note:** Private spaces only appear in listings for their members.

---

## **API Capabilities Overview**

The Spaces API allows consumers to:

* **List and search spaces** with tag and text filters
* **Retrieve space details** including members and admins
* **Get available tags** for filtering UI
* **Filter by visibility** (public spaces visible to all)

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Spaces](../endpoints/spaces/README.md) | Space listing and details | 3 |
| [Tags](../endpoints/spaces/README.md#tags) | Tag management | 1 |

Full endpoint details in the [Endpoint Reference](../endpoints/spaces/README.md).

---

## **Domain Events & Side Effects**

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `space.created` | New space | `{ spaceId }` |
| `space.updated` | Space metadata changed | `{ spaceId }` |
| `space.member.added` | User joins space | `{ spaceId, userId }` |
| `space.member.removed` | User leaves space | `{ spaceId, userId }` |

*Note: Space creation/update not currently exposed via API.*

### **Side Effects**

*Current API is read-only, no side effects.*

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
| `SPACE_NOT_FOUND` | 404 | Space ID does not exist |
| `ACCESS_DENIED` | 403 | Not a member of private space |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/` | Space listing on home |
| `/spaces/[id]` | Space detail page |
| `/spaces/[id]/discussions` | Discussions within space |
| `/spaces/[id]/events` | Events within space |

### **Service File**

```
src/lib/spaces.ts
```

### **Key Functions**

| Function | Purpose |
|----------|---------|
| `getSpaces(params)` | List spaces with filters |
| `getSpace(id)` | Get single space |
| `getSpaceTags()` | Get all available tags |

### **Pagination**

* Currently returns all spaces (no pagination)
* May need pagination for large deployments

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| Space list | Short TTL (1min), invalidate on membership change |
| Space detail | Medium TTL (5min) |
| Tags | Long TTL (30min), rarely changes |

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| List spaces | High (home page, navigation) |
| Get space | Medium (space detail views) |
| Get tags | Low (filter UI initialization) |

### **Pagination**

* Currently no pagination implemented
* Returns full list of accessible spaces
* May need pagination for scalability

### **Known Constraints**

* Member lists returned in full (may be large)
* No space creation/update via API yet
* Private space filtering happens server-side

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/` | Space listing |
| `/spaces/[id]` | Space detail |
| `/spaces/[id]/discussions` | Space discussions |
| `/spaces/[id]/events` | Space events |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [Users](./users.md) | Space membership |
| [Discussions](./discussions.md) | Content within spaces |
| [Events](./events.md) | Events within spaces |
| [Authentication](./authentication.md) | User space memberships in `/me` |

---

## **Non-Goals / Explicit Exclusions**

* **Space CRUD** - Admin-only, not exposed via API
* **Membership management** - Join/leave not yet implemented
* **Space settings** - Configuration not exposed
* **Content management** - Handled by respective domains

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* Space creation API (admin)
* Join/leave space endpoints
* Space settings management
* Pagination for large deployments
* Space search improvements

---

## **Open Questions / Notes**

* Consider adding pagination for member lists
* May need space invitation system
* Consider adding space activity metrics
* Private space discovery (how to find spaces to request access)
