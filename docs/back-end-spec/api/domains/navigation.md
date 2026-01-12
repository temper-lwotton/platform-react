# **API Domain Specification: Navigation**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `Navigation`**

### **Description**

The Navigation domain manages platform navigation configuration across multiple contexts. It provides:

* Main navigation bar with dropdown support
* Homepage sidebar with static and dynamic sections
* Space-specific sidebar navigation
* User menu configuration
* Role-based visibility rules
* Dynamic badge counts for notifications

Navigation configurations are admin-managed with per-space customization support.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Retrieving navigation configurations by type
* Managing navigation items (create, update, delete, reorder)
* Providing space-specific navigation overrides
* Serving dynamic badge counts for navigation items
* Enforcing visibility rules based on authentication and roles
* Managing user menu configuration

### **Out of scope:**

* Authentication and session management (see [Authentication](./authentication.md))
* Space membership details (see [Spaces](./spaces.md))
* Notification content (see [Notifications](./notifications.md))
* User role management (see [Users](./users.md))

---

## **Owned Data Models**

### **Core Entities**

#### **NavigationConfig**

```typescript
interface NavigationConfig {
  id: string;
  type: NavigationType;
  name: string;
  description?: string;
  items: NavigationItem[];
  settings: NavigationSettings;
  createdAt: string;               // ISO 8601
  updatedAt: string;               // ISO 8601
}

interface NavigationSettings {
  showIcons: boolean;
  collapsible: boolean;            // For sidebars
  defaultCollapsed: boolean;
  maxDepth: number;                // Maximum nesting level (1-3)
  mobileBreakpoint?: number;       // For responsive behavior
}
```

#### **NavigationItem**

```typescript
interface NavigationItem {
  id: string;
  label: string;
  href?: string;                   // Optional if has children (dropdown)
  icon?: string;                   // Icon identifier
  target?: '_self' | '_blank';
  order: number;
  visibility: VisibilityRule;
  children?: NavigationItem[];     // For dropdown menus
  badge?: NavigationBadge;
  metadata?: Record<string, any>;  // Custom data
}

interface NavigationBadge {
  type: 'count' | 'dot' | 'text';
  value?: string | number;
  source?: string;                 // API endpoint for dynamic count
}
```

#### **MainNavigation**

```typescript
interface MainNavigation {
  id: string;
  type: 'main';
  items: NavigationItem[];
  logoUrl?: string;
  logoAltText?: string;
  ctaButton?: {
    label: string;
    href: string;
    variant: 'primary' | 'secondary' | 'outline';
    visibility: VisibilityRule;
  };
}
```

#### **HomeSidebar**

```typescript
interface HomeSidebar {
  id: string;
  type: 'home_sidebar';
  sections: SidebarSection[];
}

interface SidebarSection {
  id: string;
  title?: string;                  // Optional section header
  type: 'static' | 'dynamic';
  order: number;
  visibility: VisibilityRule;
  collapsible: boolean;
  defaultCollapsed: boolean;
  items?: SidebarItem[];           // For static sections
  source?: DynamicSectionSource;   // For dynamic sections
}

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  order: number;
  visibility: VisibilityRule;
  badge?: NavigationBadge;
}

interface DynamicSectionSource {
  type: 'user_spaces' | 'recent_spaces' | 'bookmarks' | 'custom';
  endpoint?: string;               // For custom sources
  limit?: number;
  showViewAll: boolean;
  viewAllHref?: string;
  emptyMessage?: string;
}
```

#### **SpaceSidebar**

```typescript
interface SpaceSidebar {
  id: string;
  spaceId: string;
  type: 'space_sidebar';
  useDefault: boolean;             // Use platform default or custom
  items: SpaceSidebarItem[];
  customSections?: SpaceCustomSection[];
}

interface SpaceSidebarItem {
  id: string;
  label: string;
  href: string;                    // Relative to space base URL
  icon: string;
  order: number;
  visibility: VisibilityRule;
  enabled: boolean;                // Can be disabled per space
  badge?: NavigationBadge;
}

interface SpaceCustomSection {
  id: string;
  title: string;
  order: number;
  visibility: VisibilityRule;
  items: SpaceSidebarItem[];
}
```

#### **UserMenu**

```typescript
interface UserMenu {
  id: string;
  type: 'user_menu';
  sections: UserMenuSection[];
}

interface UserMenuSection {
  id: string;
  items: UserMenuItem[];
}

interface UserMenuItem {
  id: string;
  label: string;
  href?: string;
  action?: string;                 // e.g., 'logout'
  icon?: string;
  visibility?: VisibilityRule;
}
```

#### **VisibilityRule**

```typescript
type VisibilityRule =
  | { rule: 'always' }
  | { rule: 'never' }
  | { rule: 'authenticated' }
  | { rule: 'unauthenticated' }
  | { rule: 'hasRole'; role: UserRole }
  | { rule: 'hasCapability'; capability: string }
  | { rule: 'spaceMember' }
  | { rule: 'spaceAdmin' }
  | { rule: 'compound'; operator: 'and' | 'or'; conditions: VisibilityRule[] }
  | { rule: 'custom'; condition: string };

type UserRole = 'admin' | 'editor' | 'author' | 'contributor' | 'viewer';
```

---

## **Enumerations**

### **NavigationType**

| Value | Description |
|-------|-------------|
| `main` | Primary top navigation bar |
| `main_mobile` | Mobile-specific main navigation |
| `home_sidebar` | Homepage sidebar navigation |
| `space_sidebar` | Space-specific sidebar navigation |
| `footer` | Footer navigation |
| `user_menu` | User dropdown menu |

```typescript
type NavigationType = 'main' | 'main_mobile' | 'home_sidebar' | 'space_sidebar' | 'footer' | 'user_menu';
```

### **SectionType**

| Value | Description |
|-------|-------------|
| `static` | Manually configured items |
| `dynamic` | Items populated from data source |

```typescript
type SectionType = 'static' | 'dynamic';
```

### **DynamicSourceType**

| Value | Description |
|-------|-------------|
| `user_spaces` | User's space memberships |
| `recent_spaces` | Recently visited spaces |
| `bookmarks` | User's bookmarked content |
| `custom` | Custom API endpoint |

```typescript
type DynamicSourceType = 'user_spaces' | 'recent_spaces' | 'bookmarks' | 'custom';
```

### **BadgeType**

| Value | Description |
|-------|-------------|
| `count` | Numeric count badge |
| `dot` | Simple indicator dot |
| `text` | Text badge (e.g., "New") |

```typescript
type BadgeType = 'count' | 'dot' | 'text';
```

### **VisibilityRuleType**

| Value | Description |
|-------|-------------|
| `always` | Always visible |
| `never` | Always hidden |
| `authenticated` | Only when logged in |
| `unauthenticated` | Only when logged out |
| `hasRole` | User has specific role |
| `hasCapability` | User has capability |
| `spaceMember` | Is member of current space |
| `spaceAdmin` | Is admin of current space |
| `compound` | Multiple conditions combined |
| `custom` | Custom condition expression |

---

## **Relationships & Concepts**

### **Navigation Hierarchy**

The platform supports multiple navigation contexts:

```
Platform Navigation
├── Main Navigation (top bar)
│   ├── Logo
│   ├── Primary Items (with optional dropdowns)
│   └── CTA Button
├── Home Sidebar
│   ├── Static Sections (Feed, Tasks, Calendar)
│   └── Dynamic Sections (My Spaces)
├── Space Sidebar (per-space)
│   ├── Default Items (Overview, Discussions, Events)
│   └── Custom Sections (external links)
├── User Menu
│   └── Profile, Settings, Logout
└── Footer Navigation
```

### **Visibility System**

Visibility rules control when navigation items appear:
* **Authentication-based**: Show/hide based on login state
* **Role-based**: Show only to users with specific roles
* **Context-based**: Show based on space membership/admin status
* **Compound rules**: Combine multiple conditions with AND/OR logic

### **Dynamic Sections**

Sidebar sections can be dynamically populated:
* User's spaces are fetched and rendered as navigation items
* Unread counts can be included via badge sources
* Empty states displayed when no items exist

### **Space Sidebar Customization**

Each space can customize its sidebar:
* Enable/disable default items
* Rename items
* Add custom sections with external links
* Reset to platform defaults

### **Badge System**

Navigation items can display dynamic badges:
* Source URL provides current count
* Polled periodically or updated via WebSocket
* Used for unread messages, pending tasks, new suggestions

---

## **Business Rules**

1. **Default Navigation**: Platform provides default navigation for all types
2. **Space Override**: Spaces can customize their sidebar or use defaults
3. **Visibility Enforcement**: Items filtered based on user context before response
4. **Order Preservation**: Items sorted by `order` field ascending
5. **Nesting Limits**: Maximum 3 levels of nesting for navigation items
6. **Admin Only Modifications**: Only admins can modify platform navigation
7. **Space Admin Modifications**: Space admins can modify their space's sidebar
8. **Badge Caching**: Badge counts cached with short TTL, invalidated on changes
9. **Reset Capability**: Space sidebars can be reset to platform defaults

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes for most endpoints, No for unauthenticated navigation items
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| Get navigation by type | Any user (filtered by visibility) |
| Get all navigation configs | Admin only |
| Update platform navigation | Admin only |
| Add/update/delete nav items | Admin only |
| Reorder navigation items | Admin only |
| Get space sidebar | Space members |
| Update space sidebar | Space admin |
| Reset space sidebar | Space admin |
| Get badge counts | Any authenticated user |
| Get user menu | Any authenticated user |

---

## **API Capabilities Overview**

The Navigation API allows consumers to:

* **Get navigation** by type with visibility filtering
* **List all navigation configs** for admin management
* **Update navigation** configurations (admin)
* **Manage navigation items** (add, update, delete, reorder)
* **Get space sidebar** with custom overrides
* **Update space sidebar** with custom items
* **Reset space sidebar** to platform defaults
* **Get badge counts** for navigation indicators
* **Get user menu** configuration

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Navigation](../endpoints/navigation/README.md) | Core navigation retrieval | 3 |
| [Navigation Admin](../endpoints/navigation/README.md#admin) | Platform navigation management | 4 |
| [Space Navigation](../endpoints/navigation/README.md#space) | Space sidebar management | 3 |
| [Badges](../endpoints/navigation/README.md#badges) | Dynamic badge counts | 2 |

Full endpoint details in the [Endpoint Reference](../endpoints/navigation/README.md).

---

## **Domain Events & Side Effects**

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `navigation.updated` | Platform navigation changed | `{ type, updatedBy }` |
| `navigation.item_added` | New item added | `{ type, itemId }` |
| `navigation.item_removed` | Item deleted | `{ type, itemId }` |
| `navigation.reordered` | Items reordered | `{ type }` |
| `space.navigation_updated` | Space sidebar changed | `{ spaceId }` |
| `space.navigation_reset` | Space sidebar reset | `{ spaceId }` |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| `navigation.updated` | Cache invalidation |
| `space.navigation_updated` | Space cache invalidation |
| Badge source change | Badge count refresh |

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
| `NAVIGATION_NOT_FOUND` | 404 | Navigation type does not exist |
| `ITEM_NOT_FOUND` | 404 | Navigation item ID does not exist |
| `SPACE_NOT_FOUND` | 404 | Space ID does not exist |
| `INVALID_TYPE` | 400 | Invalid navigation type |
| `INVALID_VISIBILITY_RULE` | 400 | Malformed visibility rule |
| `MAX_DEPTH_EXCEEDED` | 400 | Nesting exceeds maximum depth |
| `NOT_SPACE_ADMIN` | 403 | User is not space admin |
| `FORBIDDEN` | 403 | Not authorized for this action |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| All pages | Main navigation |
| `/feed`, `/` | Home sidebar |
| `/spaces/[id]/*` | Space sidebar |
| User dropdown | User menu |

### **Service Location**

```
src/lib/navigation.ts
```

### **Key Functions**

| Function | Purpose |
|----------|---------|
| `getNavigation(type)` | Get navigation by type |
| `getSpaceNavigation(spaceId)` | Get space sidebar |
| `getBadgeCounts(sources)` | Get multiple badge counts |
| `updateSpaceNavigation(spaceId, data)` | Update space sidebar |
| `resetSpaceNavigation(spaceId)` | Reset to defaults |

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| Main navigation | Long TTL (30min), invalidate on update |
| Home sidebar | Medium TTL (10min), invalidate on update |
| Space sidebar | Medium TTL (10min), invalidate on space update |
| Badge counts | Short TTL (1min), or WebSocket updates |
| User menu | Long TTL (30min), invalidate on role change |

### **Real-Time Updates**

Badge counts support real-time updates via:
* **WebSocket**: Subscribe to `navigation:badges` channel
* **SSE**: Connect to `/api/navigation/badges/stream`

```javascript
// WebSocket subscription
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'navigation:badges'
}));

// Receive updates
{
  "type": "badge_update",
  "data": {
    "source": "messages_unread",
    "count": 15
  }
}
```

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| Get navigation | Very High (every page load) |
| Get badges | High (polling or WebSocket) |
| Update navigation | Very Low (admin only) |
| Space sidebar | High (space pages) |

### **Caching**

* Navigation configs heavily cached
* Badge counts cached with short TTL
* Consider CDN caching for public navigation

### **Rate Limiting**

Standard rate limits apply (see [API Conventions](../_index.md#rate-limiting)).

### **Known Trade-offs**

* Visibility filtering happens server-side for security
* Dynamic sections require additional API calls
* Badge polling can create load; prefer WebSocket

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| All routes | Main navigation |
| `/feed` | Home sidebar |
| `/spaces/[id]/*` | Space sidebar |
| `/admin/navigation` | Navigation management |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [Authentication](./authentication.md) | Visibility rule evaluation |
| [Spaces](./spaces.md) | Space sidebar, membership |
| [Users](./users.md) | Role-based visibility |
| [Notifications](./notifications.md) | Badge count sources |
| [Tasks](./tasks.md) | Badge count sources |
| [Messaging](./messaging.md) | Badge count sources |

---

## **Non-Goals / Explicit Exclusions**

* **Content management** - Navigation links to content, doesn't manage it
* **Search functionality** - Handled by Search domain
* **Breadcrumbs** - Generated from route structure, not managed here
* **Mobile app navigation** - Native apps have separate navigation
* **Mega menus** - Limited to 3 levels of nesting

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* Mega menu support
* A/B testing for navigation
* Analytics on navigation usage
* Personalized navigation ordering
* Drag-and-drop admin interface

---

## **Open Questions / Notes**

* Consider adding navigation analytics
* May need versioning for navigation configs
* Consider A/B testing framework for navigation changes
* Mobile-specific navigation may need separate management
