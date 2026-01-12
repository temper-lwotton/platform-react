# **API Domain Specification: Users**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `Users`**

### **Description**

The Users domain manages user accounts, profiles, and social relationships within the Spaces platform. It handles:

* User identity and profile information
* Bi-directional connections (mutual relationships requiring acceptance)
* One-way following (subscribe to another user's activity)
* User activity statistics and content aggregation

This domain is central to the platform's social features, enabling members to discover, connect with, and follow other professionals in their industry.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Creating, reading, updating, and deleting user accounts
* Managing user profile information (name, company, bio, photo, etc.)
* Managing bi-directional connections (request → accept/decline → connected)
* Managing one-way following relationships
* Providing user activity statistics
* Searching and filtering users by various criteria

### **Out of scope:**

* Authentication and session management (see [Authentication](./authentication.md))
* User permissions and roles (handled per-domain)
* Space membership (see [Spaces](./spaces.md))
* Content creation (see [Discussions](./discussions.md), [Events](./events.md))
* Notification delivery (see [Notifications](./notifications.md))

---

## **Owned Data Models**

### **Core Entities**

#### **User**

```typescript
interface User {
  id: string;
  createdAt: string;              // ISO 8601
  externalId?: string;            // External system ID (SSO)
  email: string;
  profile: UserProfile;
  adminSpaces: UserSpace[];       // Spaces user administers
  memberSpaces: UserSpace[];      // Spaces user is member of
  connectionStatus?: ConnectionStatus; // Relative to requesting user
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  fullName?: string;              // Computed or overridden
  companyName?: string;
  jobTitle?: string;
  dob?: string;                   // Date of birth (ISO 8601 date)
  telephone?: string;
  companyType?: string;           // e.g., "Operator", "Supplier"
  linkedInProfile?: string;       // LinkedIn URL
  trigProjectTitle?: string;      // Project association
  transportModesOfInterest?: string;
  photo?: string;                 // Avatar URL
  bio?: string;                   // Free-text biography
  interests?: string[];           // Tag-like interests
}

interface UserSpace {
  id: string;
  title: string;
}

type ConnectionStatus = 'none' | 'pending' | 'connected';
```

**Notes:**
* `connectionStatus` is computed relative to the authenticated user making the request
* `fullName` may be computed from `firstName` + `lastName` or set explicitly
* Profile fields are all optional to support progressive profile completion

#### **ConnectionRequest**

```typescript
interface ConnectionRequest {
  id: number;
  sender: ConnectionRequestUser;
  recipient: ConnectionRequestUser;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;              // "Y-m-d H:i:s" format
  closedAt: string | null;        // When accepted/declined
}

interface ConnectionRequestUser {
  id: number;
  name: string;
  email: string;
  photo: string | null;
}
```

#### **UserStats**

```typescript
interface UserStats {
  discussionsStarted: number;
  repliesMade: number;
  eventsCreated: number;
  resourcesShared: number;
  showcasesPublished: number;
  updatesPosted: number;
  totalConnections: number;
  spacesJoined: number;
  spacesAdministered: number;
  likesGiven: number;
  likesReceived: number;
  memberSince: string;            // ISO 8601
  lastActive: string;             // ISO 8601
  mostActiveSpace?: {
    id: string;
    title: string;
  };
}
```

---

## **Enumerations**

### **ConnectionStatus**

| Value | Description |
|-------|-------------|
| `none` | No relationship exists |
| `pending` | Request sent or received, awaiting response |
| `connected` | Mutual connection established |

```typescript
type ConnectionStatus = 'none' | 'pending' | 'connected';
```

### **ConnectionRequestStatus**

| Value | Description |
|-------|-------------|
| `PENDING` | Request awaiting response |
| `ACCEPTED` | Request accepted by recipient |
| `DECLINED` | Request declined by recipient |

```typescript
type ConnectionRequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';
```

---

## **Relationships & Concepts**

### **Connections vs Following**

The Users domain supports two distinct types of social relationships:

| Relationship | Direction | Requires Acceptance | Use Case |
|--------------|-----------|---------------------|----------|
| **Connection** | Bi-directional | Yes | Professional networking, mutual relationship |
| **Following** | One-way | No | Subscribe to someone's activity |

**Connection Flow:**
1. User A sends connection request to User B
2. User B receives notification of pending request
3. User B accepts or declines
4. If accepted, both users are now "connected"
5. Either user can remove the connection later

**Following Flow:**
1. User A follows User B
2. User A sees User B's activity in their feed
3. User B may or may not follow back (independent)
4. User A can unfollow at any time

### **Connection Status**

When fetching users, the `connectionStatus` field indicates the relationship between the authenticated user and each returned user:

* `'none'` - No relationship (can send connection request)
* `'pending'` - Request sent or received, awaiting response
* `'connected'` - Mutual connection established

### **Space Membership**

Users have two levels of space membership:
* `adminSpaces` - Spaces where user has admin privileges
* `memberSpaces` - Spaces where user is a regular member

This is denormalized onto the User entity for convenience but is managed by the Spaces domain.

---

## **Business Rules**

1. **Unique Email**: Each user must have a unique email address
2. **Self-Connection Prevention**: Users cannot send connection requests to themselves
3. **Self-Follow Prevention**: Users cannot follow themselves
4. **Single Connection**: Only one connection or pending request can exist between two users
5. **Recipient Only**: Only the recipient can accept or decline a connection request
6. **Either Party Disconnect**: Either connected user can remove the connection
7. **Independent Following**: Following is independent - A can follow B without B following A
8. **Profile Fields Optional**: All profile fields except email are optional
9. **Connection Status Computed**: `connectionStatus` is computed per-request relative to the authenticated user

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes (all endpoints)
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| List users | Any authenticated user |
| View user profile | Any authenticated user |
| Create user | Admin only |
| Update own profile | User themselves |
| Update any profile | Admin only |
| Delete user | Admin only |
| Send connection request | Any authenticated user |
| Accept/decline request | Request recipient only |
| Remove connection | Either connected user |
| Follow user | Any authenticated user |
| Unfollow user | The follower only |

**Privacy Considerations:**
* Email addresses may be hidden based on user preferences
* Some profile fields may be restricted to connections only
* Connection/follower lists respect privacy settings

---

## **API Capabilities Overview**

The Users API allows consumers to:

* **List and search users** with filters for company type, transport mode, and free text
* **Retrieve user profiles** with full profile data and space memberships
* **Manage user accounts** (admin-only CRUD operations)
* **Send and manage connection requests** with accept/decline workflow
* **Follow and unfollow users** for one-way activity subscriptions
* **View connections and followers** for any user
* **Retrieve user activity statistics** (discussions, events, etc.)

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Users CRUD](../endpoints/users/README.md) | Core user management | 5 |
| [Following](../endpoints/users/README.md#following) | One-way follow relationships | 4 |
| [Connections](../endpoints/users/README.md#connections) | Bi-directional relationships | 7 |
| [Stats](../endpoints/users/README.md#stats) | Activity statistics | 2 |

Full endpoint details in the [Endpoint Reference](../endpoints/users/README.md).

---

## **Domain Events & Side Effects**

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `user.created` | New user account | `{ userId }` |
| `user.updated` | Profile changes | `{ userId, changedFields }` |
| `user.deleted` | Account deletion | `{ userId }` |
| `connection.requested` | New connection request | `{ requestId, senderId, recipientId }` |
| `connection.accepted` | Request accepted | `{ requestId, senderId, recipientId }` |
| `connection.declined` | Request declined | `{ requestId, senderId, recipientId }` |
| `connection.removed` | Connection removed | `{ userId, connectionId }` |
| `user.followed` | New follower | `{ followerId, followeeId }` |
| `user.unfollowed` | Follower removed | `{ followerId, followeeId }` |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| `connection.requested` | Notification sent to recipient |
| `connection.accepted` | Notification sent to sender |
| `user.followed` | Notification sent to followee (if enabled) |
| `user.deleted` | All connections removed, content anonymized |

---

## **Error Model**

Standard error envelope (see [API Conventions](../_index.md#error-codes)):

```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    errors?: { [field: string]: string[] }
  }
}
```

### **Domain-Specific Error Codes**

| Code | HTTP | Description |
|------|------|-------------|
| `USER_NOT_FOUND` | 404 | User ID does not exist |
| `EMAIL_ALREADY_EXISTS` | 409 | Email address already registered |
| `CANNOT_CONNECT_SELF` | 400 | Cannot send connection request to yourself |
| `CONNECTION_EXISTS` | 409 | Connection or pending request already exists |
| `REQUEST_NOT_FOUND` | 404 | Connection request ID does not exist |
| `NOT_REQUEST_RECIPIENT` | 403 | Only recipient can accept/decline |
| `CANNOT_FOLLOW_SELF` | 400 | Cannot follow yourself |
| `ALREADY_FOLLOWING` | 409 | Already following this user |
| `NOT_FOLLOWING` | 400 | Cannot unfollow user you're not following |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/users` | User directory listing |
| `/users/[id]` | User profile page |
| `/users/[id]/edit` | Profile editing |
| `/feed` | User activity, connections |
| `/suggestions` | Suggested connections |

### **Components**

| Component | API Usage |
|-----------|-----------|
| `UserCard` | Display user summary |
| `UserProfile` | Full profile display |
| `ConnectionButton` | Send/accept/decline connections |
| `FollowButton` | Follow/unfollow toggle |
| `UserDirectory` | Search and filter users |

### **Pagination**

User listing supports pagination:
* Default limit: 20
* Maximum limit: 100
* Use `page` + `limit` parameters

### **Null Fields**

Profile fields may be null/undefined:
* Handle missing `photo` with placeholder avatar
* Handle missing `bio` gracefully
* `connectionStatus` only present when authenticated user differs from viewed user

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| User list | Short TTL (30s), invalidate on follow/connect |
| User profile | Medium TTL (5min), invalidate on update |
| Connections list | Short TTL (1min), invalidate on connect/disconnect |
| User stats | Medium TTL (5min) |

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| List users | High (directory browsing) |
| Get user | High (profile views) |
| Connection requests | Medium |
| Follow/unfollow | Medium |

### **Pagination Limits**

* Default page size: 20
* Maximum page size: 100
* Connection lists: no pagination (typically < 500)

### **Rate Limiting**

Standard rate limits apply (see [API Conventions](../_index.md#rate-limiting)).

### **Known Trade-offs**

* `connectionStatus` requires additional queries to compute - consider caching
* User stats are currently mocked - will require aggregation queries
* Large connection lists returned in full - may need pagination for power users

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/users` | User directory |
| `/users/[id]` | Profile view |
| `/users/[id]/edit` | Profile editor |
| `/feed` | Activity feed |
| `/suggestions` | Connection suggestions |
| `/messages` | Direct messaging (uses connections) |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [Authentication](./authentication.md) | User identity and tokens |
| [Spaces](./spaces.md) | Space membership |
| [Discussions](./discussions.md) | User-authored discussions |
| [Events](./events.md) | User-created events |
| [Notifications](./notifications.md) | Connection/follow notifications |

---

## **Non-Goals / Explicit Exclusions**

* **Password management** - Handled by Authentication domain
* **Role-based access control** - Each domain manages its own permissions
* **Activity feed generation** - Handled by Feed service
* **Direct messaging** - Separate Messages domain
* **User blocking** - Not currently supported

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* User blocking/muting
* Privacy settings API
* Profile completion score
* User verification badges

---

## **Open Questions / Notes**

* Consider adding cursor-based pagination for large connection lists
* Stats endpoint is currently mocked - needs backend implementation
* Consider adding "mutual connections" endpoint for networking features
* Privacy settings for profile field visibility not yet implemented
