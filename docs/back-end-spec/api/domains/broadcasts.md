# **API Domain Specification: Broadcasts**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `Broadcasts`**

### **Description**

The Broadcasts domain manages email broadcasting capabilities for promoting content and communicating with platform members. It provides:

* Email campaign creation with visual block-based editor
* Template system for consistent messaging
* Audience targeting by space, segment, or all users
* Scheduling for future delivery
* Delivery and engagement analytics

Broadcasts enable administrators to reach members with announcements, event promotions, newsletters, and other communications.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Creating and managing broadcast campaigns
* Block-based email content composition
* Audience selection and targeting
* Scheduling and sending broadcasts
* Tracking delivery and engagement metrics
* Managing broadcast templates

### **Out of scope:**

* Transactional emails (password reset, etc.) - Infrastructure concern
* User notification preferences (see [Notifications](./notifications.md))
* Email verification - Infrastructure concern
* Individual direct messages (see [Messaging](./messaging.md))
* Push notifications (see [Notifications](./notifications.md))

---

## **Owned Data Models**

### **Core Entities**

#### **Broadcast**

A complete broadcast campaign with content and targeting.

```typescript
interface Broadcast {
  id: string;
  name: string;                      // Internal campaign name
  subject: string;                   // Email subject line
  preheader: string;                 // Preview text
  emailContent: {
    blocks: EmailBlock[];
  };
  status: BroadcastStatus;
  scheduledAt?: string;              // ISO 8601
  sentAt?: string;                   // ISO 8601
  recipients: BroadcastRecipient[];
  stats?: BroadcastStats;
  createdBy: string;                 // User ID
  createdAt: string;                 // ISO 8601
  updatedAt: string;                 // ISO 8601
}
```

#### **EmailBlock**

Individual content blocks within an email.

```typescript
interface EmailBlock {
  id: string;
  type: EmailBlockType;
  content: EmailBlockContent;
  order: number;
}

type EmailBlockContent =
  | HeadingBlockContent
  | TextBlockContent
  | ImageBlockContent
  | ButtonBlockContent
  | DividerBlockContent
  | SpacerBlockContent;

interface HeadingBlockContent {
  text: string;
  level: 'h1' | 'h2' | 'h3';
  align?: 'left' | 'center' | 'right';
}

interface TextBlockContent {
  text: string;                      // HTML or markdown
  align?: 'left' | 'center' | 'right';
}

interface ImageBlockContent {
  src: string;
  alt: string;
  width?: number;
  link?: string;
  align?: 'left' | 'center' | 'right';
}

interface ButtonBlockContent {
  text: string;
  url: string;
  align?: 'left' | 'center' | 'right';
  style?: 'primary' | 'secondary' | 'outline';
}

interface DividerBlockContent {
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
}

interface SpacerBlockContent {
  height: number;                    // Pixels
}
```

#### **BroadcastRecipient**

Target audience specification for a broadcast.

```typescript
interface BroadcastRecipient {
  type: RecipientType;
  spaceId?: string;                  // For space targeting
  segmentId?: string;                // For segment targeting
  count?: number;                    // Estimated recipient count
}
```

#### **BroadcastStats**

Delivery and engagement statistics.

```typescript
interface BroadcastStats {
  sent: number;                      // Total emails sent
  delivered: number;                 // Successfully delivered
  opened: number;                    // Unique opens
  clicked: number;                   // Unique clicks
  bounced: number;                   // Hard/soft bounces
  unsubscribed: number;              // Unsubscribes from this email
  openRate: number;                  // Percentage (0-100)
  clickRate: number;                 // Percentage (0-100)
  lastUpdated: string;               // ISO 8601
}
```

#### **BroadcastTemplate**

Reusable email template for common broadcast types.

```typescript
interface BroadcastTemplate {
  id: string;
  name: string;
  description?: string;
  subject: string;
  preheader: string;
  emailContent: {
    blocks: EmailBlock[];
  };
  category?: string;                 // e.g., 'event', 'newsletter', 'announcement'
  thumbnail?: string;                // Preview image URL
  isSystem: boolean;                 // Platform-provided vs user-created
  createdAt: string;
  updatedAt: string;
}
```

---

## **Enumerations**

### **BroadcastStatus**

| Value | Description |
|-------|-------------|
| `draft` | Being composed, not ready to send |
| `scheduled` | Approved and scheduled for future delivery |
| `sending` | Currently being processed |
| `sent` | Delivery complete |
| `failed` | Delivery failed |
| `cancelled` | Cancelled before sending |

```typescript
type BroadcastStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled';
```

### **EmailBlockType**

| Value | Description |
|-------|-------------|
| `heading` | Header text (h1, h2, h3) |
| `text` | Rich text paragraph |
| `image` | Image with optional link |
| `button` | Call-to-action button |
| `divider` | Horizontal line separator |
| `spacer` | Vertical spacing |

```typescript
type EmailBlockType = 'heading' | 'text' | 'image' | 'button' | 'divider' | 'spacer';
```

### **RecipientType**

| Value | Description |
|-------|-------------|
| `all` | All platform members |
| `space` | Members of a specific space |
| `segment` | Custom user segment |

```typescript
type RecipientType = 'all' | 'space' | 'segment';
```

---

## **Relationships & Concepts**

### **Broadcast Lifecycle**

```
Create Draft
    ↓
Edit Content & Recipients
    ↓
Preview/Test Send
    ↓
Schedule or Send Now
    ↓
[scheduled] ──→ [sending] ──→ [sent]
                   ↓
              [failed] (partial)
```

### **Email Block Composition**

The block-based editor allows composing emails from reusable components:

* Blocks are ordered by `order` field
* Each block type has specific content schema
* Blocks can be added, removed, reordered in draft state
* Content is converted to HTML for delivery

### **Audience Targeting**

Recipients can be targeted using:

1. **All Users** - Platform-wide broadcast
2. **Space Members** - Only members of specified space(s)
3. **Segments** - Custom-defined user segments (future)

### **Template System**

Templates provide starting points for common broadcasts:

* System templates for events, announcements, newsletters
* Custom templates created by administrators
* Templates can be used as starting point, then customized

### **Delivery Process**

1. Validate recipient list
2. Render email HTML from blocks
3. Queue for batch delivery
4. Track delivery status per recipient
5. Record bounces and failures
6. Update aggregate statistics

---

## **Business Rules**

1. **Draft Only Edits**: Only broadcasts in `draft` status can be edited
2. **Recipient Required**: At least one recipient target required before scheduling
3. **Subject Required**: Subject line required (max 200 characters)
4. **Send Cancellation**: Scheduled broadcasts can be cancelled until sending begins
5. **Admin Only**: Only administrators can create and send broadcasts
6. **Unsubscribe Link**: All broadcasts must include unsubscribe link (auto-added)
7. **Rate Limits**: Maximum broadcasts per day to prevent abuse
8. **Batch Processing**: Large broadcasts sent in batches to ensure deliverability
9. **Test Send**: Test sends limited to 5 recipients

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes (all endpoints)
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| List broadcasts | Platform administrators |
| View broadcast | Platform administrators |
| Create broadcast | Platform administrators |
| Edit draft broadcast | Platform administrators |
| Delete broadcast | Platform administrators |
| Schedule broadcast | Platform administrators |
| Send broadcast | Platform administrators |
| View statistics | Platform administrators |
| Manage templates | Platform administrators |

---

## **API Capabilities Overview**

The Broadcasts API allows consumers to:

* **List broadcasts** with filtering by status
* **View broadcast** details including content and statistics
* **Create broadcast** with block-based content
* **Update broadcast** content and recipients (draft only)
* **Delete broadcast** (draft only)
* **Schedule broadcast** for future delivery
* **Send broadcast** immediately
* **Cancel broadcast** (scheduled only)
* **Get statistics** for sent broadcasts
* **Send test email** before scheduling
* **List templates** for starting new broadcasts
* **Create templates** from existing broadcasts

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Broadcasts](../endpoints/broadcasts/README.md) | Campaign management | 8 |
| [Templates](../endpoints/broadcasts/README.md#templates) | Template management | 3 |

Full endpoint details in the [Endpoint Reference](../endpoints/broadcasts/README.md).

---

## **Domain Events & Side Effects**

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `broadcast.created` | New broadcast created | `{ broadcastId, createdBy }` |
| `broadcast.scheduled` | Broadcast scheduled | `{ broadcastId, scheduledAt }` |
| `broadcast.sending` | Delivery started | `{ broadcastId, recipientCount }` |
| `broadcast.sent` | Delivery complete | `{ broadcastId, stats }` |
| `broadcast.failed` | Delivery failed | `{ broadcastId, error }` |
| `broadcast.cancelled` | Broadcast cancelled | `{ broadcastId }` |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| `broadcast.sending` | Emails queued for delivery |
| `broadcast.sent` | Statistics aggregated |
| Email opened | Increment `opened` count |
| Link clicked | Increment `clicked` count |
| Email bounced | Increment `bounced` count, mark address |

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
| `BROADCAST_NOT_FOUND` | 404 | Broadcast does not exist |
| `TEMPLATE_NOT_FOUND` | 404 | Template does not exist |
| `INVALID_STATUS` | 400 | Operation not allowed in current status |
| `NO_RECIPIENTS` | 400 | No recipients specified |
| `SUBJECT_REQUIRED` | 400 | Missing email subject |
| `CONTENT_REQUIRED` | 400 | No email content blocks |
| `ALREADY_SENT` | 400 | Cannot modify sent broadcast |
| `SEND_IN_PROGRESS` | 400 | Broadcast is currently sending |
| `SCHEDULE_IN_PAST` | 400 | Scheduled time is in the past |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many broadcasts today |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/admin/broadcasts` | Broadcast list and management |
| `/admin/broadcasts/new` | Create new broadcast |
| `/admin/broadcasts/[id]` | Edit/view broadcast details |
| `/admin/broadcasts/[id]/stats` | View engagement statistics |

### **Service Location**

```
src/lib/broadcasts.ts
```

### **Key Functions**

| Function | Purpose |
|----------|---------|
| `getBroadcasts(filters)` | List broadcasts with filtering |
| `getBroadcast(id)` | Get broadcast details |
| `createBroadcast(data)` | Create new broadcast |
| `updateBroadcast(id, data)` | Update draft broadcast |
| `deleteBroadcast(id)` | Delete broadcast |
| `scheduleBroadcast(id, date)` | Schedule for future |
| `sendBroadcast(id)` | Send immediately |
| `cancelBroadcast(id)` | Cancel scheduled broadcast |
| `getBroadcastStats(id)` | Get delivery statistics |
| `sendTestEmail(id, emails)` | Send test to specific addresses |
| `getTemplates()` | List available templates |

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| Broadcast list | Short TTL (30s), invalidate on changes |
| Broadcast details | No cache (frequent edits) |
| Statistics | Short TTL (60s) |
| Templates | Medium TTL (5min) |

### **Null Fields**

* `scheduledAt` - Null if not scheduled
* `sentAt` - Null if not yet sent
* `stats` - Null for draft broadcasts
* `template.description` - Optional
* `template.thumbnail` - Optional

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| List broadcasts | Low (admin only) |
| Get broadcast | Low |
| Send broadcast | Very Low (batch operation) |
| Get statistics | Medium (polling) |

### **Pagination**

* Broadcast list: Cursor-based
* Default limit: 20

### **Rate Limiting**

| Endpoint | Limit |
|----------|-------|
| Create broadcast | 10/hour |
| Send broadcast | 5/day |
| Test send | 20/day |

### **Known Trade-offs**

* Statistics may be delayed up to 1 hour
* Bounce detection depends on email provider
* Large broadcasts processed in batches (may take hours)

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/broadcasts` | Management interface |
| `/admin/spaces/[id]` | Space member targeting |
| `/unsubscribe` | Unsubscribe handling |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [Users](./users.md) | Recipient information |
| [Spaces](./spaces.md) | Space-based targeting |
| [Notifications](./notifications.md) | User preferences |
| [Media](./media.md) | Image uploads for emails |

---

## **Non-Goals / Explicit Exclusions**

* **Transactional emails** - System emails like password reset
* **A/B testing** - Future enhancement
* **Advanced segmentation** - Basic space targeting only
* **Email templates HTML editing** - Block editor only
* **Delivery provider management** - Infrastructure concern
* **Bounce management automation** - Manual review required

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* A/B testing for subject lines and content
* Advanced user segmentation
* Automated drip campaigns
* Rich analytics dashboard
* Integration with external ESP providers
* Template marketplace

---

## **Open Questions / Notes**

* Consider adding email preview rendering endpoint
* May need support for recurring scheduled broadcasts
* Consider integration with calendar for event promotions
* Evaluate need for per-recipient personalization

