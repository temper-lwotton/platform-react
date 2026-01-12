# **API Domain Specification: Events**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `Events`**

### **Description**

The Events domain manages community events within spaces. Events support both online and in-person gatherings with RSVP functionality, attendee tracking, and rich content descriptions. It provides:

* Event CRUD operations
* RSVP management (going/maybe/not going)
* Attendee listing
* Photo uploads for event imagery
* Space-scoped organization

Events are always associated with a space and authored by a user.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Creating, reading, updating, and deleting events
* Managing event RSVPs and attendee lists
* Handling event photo uploads
* Providing event feeds (all, by space, by date range)
* Managing event metadata (tags, location, online status)

### **Out of scope:**

* Space management (see [Spaces](./spaces.md))
* User profiles (see [Users](./users.md))
* Calendar integrations (future enhancement)
* Event reminders/notifications (see [Notifications](./notifications.md))

---

## **Owned Data Models**

### **Core Entities**

#### **Event**

```typescript
interface Event {
  id: number;
  createdAt: string;           // ISO 8601
  externalId?: number;         // External system ID
  title: string;
  slug: string;                // URL-friendly identifier
  htmlContent: string;         // Rich text description
  jsonContent: any;            // Lexical JSON representation
  eventStart: string;          // ISO 8601
  eventEnd: string;            // ISO 8601
  isOnline: boolean;           // Online vs in-person
  location?: string;           // Physical location (if !isOnline)
  link?: string;               // Meeting URL or registration link
  photo?: string;              // Event image URL
  space: EventSpace;
  author: EventUser;
  tags: EventTag[];
}

interface EventSpace {
  id: number;
  name: string;
  slug: string;
  description: string;
  photo?: string;
  privacy: string;
  memberCount?: number;
  discussionCount?: number;
}

interface EventUser {
  id: number;
  name: string;
  username: string;
  avatar?: string;
  email?: string;
  bio?: string;
}

interface EventTag {
  id: number;
  name: string;
  slug: string;
}
```

#### **EventPayload (Create/Update)**

```typescript
interface EventPayload {
  title: string;
  space: number;               // Space ID
  startDateTime: string;       // ISO 8601
  endDateTime: string;         // ISO 8601
  htmlContent: string;
  jsonContent: any;
  isOnline: boolean;
  location?: string;           // Only for in-person events
  link?: string;               // Meeting URL or registration
  tagIds?: number[];
  // Note: author auto-populated from JWT
  // Note: photo uploaded separately via multipart/form-data
}
```

#### **RSVP Status**

```typescript
type RSVPStatus = 'going' | 'maybe' | 'not_going';
```

### **EventTiming**

| Value | Condition | Description |
|-------|-----------|-------------|
| `upcoming` | `eventStart > now` | Event hasn't started |
| `ongoing` | `eventStart <= now <= eventEnd` | Event in progress |
| `past` | `eventEnd < now` | Event has concluded |

```typescript
type EventTiming = 'upcoming' | 'ongoing' | 'past';
```

---

## **Relationships & Concepts**

### **Event Ownership**

* Every event belongs to exactly one **space**
* Every event has exactly one **author**
* Events can have multiple **tags** for categorization

### **Event Types**

| Type | `isOnline` | Required Fields |
|------|------------|-----------------|
| Online | `true` | `link` (meeting URL) |
| In-Person | `false` | `location` |

### **RSVP System**

Users can RSVP to events with one of three statuses:
* `going` - Confirmed attendance
* `maybe` - Tentative
* `not_going` - Declined

RSVPs are unique per user per event - subsequent RSVPs update the status.

### **Event Timing**

Events have explicit start and end times:
* `eventStart` - When event begins
* `eventEnd` - When event concludes

Helper functions classify events as:
* **Upcoming** - `eventStart > now`
* **Ongoing** - `eventStart <= now <= eventEnd`
* **Past** - `eventEnd < now`

---

## **Business Rules**

1. **Space Required**: Every event must belong to exactly one space
2. **Author Required**: Every event must have exactly one author
3. **Valid Date Range**: `eventEnd` must be after `eventStart`
4. **Location or Link**: Online events require `link`; in-person require `location`
5. **Space Membership**: Only space members can create events in that space
6. **Author Edit/Delete**: Only the author or space admin can edit or delete an event
7. **Single RSVP**: Each user has one RSVP per event; subsequent RSVPs update status
8. **Photo Upload**: Event photos uploaded separately via multipart/form-data
9. **Author Auto-Set**: Author is automatically set from JWT on creation

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes (all endpoints)
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| List events | Any authenticated user (respects space access) |
| View event | Any authenticated user (respects space access) |
| Create event | Space members |
| Update event | Author or space admin |
| Delete event | Author or space admin |
| RSVP | Any authenticated user with space access |
| View attendees | Any authenticated user with space access |

---

## **API Capabilities Overview**

The Events API allows consumers to:

* **List events** globally or by space with filtering
* **Create events** with rich content and photo upload
* **Update and delete** events (with permissions)
* **RSVP to events** with status tracking
* **View attendees** for event planning

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Events CRUD](../endpoints/events/README.md) | Core event operations | 5 |
| [RSVP](../endpoints/events/README.md#rsvp) | Attendance management | 2 |

Full endpoint details in the [Endpoint Reference](../endpoints/events/README.md).

---

## **Domain Events & Side Effects**

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `event.created` | New event | `{ eventId, spaceId, authorId }` |
| `event.updated` | Event edited | `{ eventId }` |
| `event.deleted` | Event removed | `{ eventId }` |
| `event.rsvp` | User RSVPs | `{ eventId, userId, status }` |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| `event.created` | Notification to space members |
| `event.rsvp` | May update attendee counts |
| Event approaching | Reminder notifications (future) |

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
| `EVENT_NOT_FOUND` | 404 | Event ID does not exist |
| `NOT_AUTHOR` | 403 | User is not the author (for edit/delete) |
| `NOT_SPACE_MEMBER` | 403 | User is not a member of the space |
| `INVALID_DATE_RANGE` | 400 | End date before start date |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/events` | Event listing/calendar |
| `/spaces/[id]/events` | Space events |
| `/events/[id]` | Event detail |
| `/events/new` | Create event |

### **Service File**

```
src/lib/events.ts
```

### **Key Functions**

| Function | Purpose |
|----------|---------|
| `getEvents(params)` | List events with filters |
| `getEvent(id)` | Get single event |
| `createEvent(data)` | Create event (JSON) |
| `createEventWithPhoto(data, file)` | Create with photo |
| `updateEvent(id, data)` | Update event |
| `deleteEvent(id)` | Delete event |
| `rsvpToEvent(id, status)` | RSVP to event |
| `getEventAttendees(id)` | Get attendee list |

### **Photo Upload**

Photo uploads use `multipart/form-data`:
* Do NOT set Content-Type header manually
* Browser sets boundary automatically
* Use `createEventWithPhoto()` helper

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| Event list | Short TTL (1min), invalidate on create |
| Event detail | Medium TTL (5min), invalidate on update |
| Attendees | Short TTL (1min), invalidate on RSVP |

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| List events | High (calendar views) |
| Get event | Medium (detail views) |
| RSVP | Medium |
| Attendees | Low |

### **Pagination**

* List endpoints use `offset` + `limit`
* Default limit: 20

### **Known Constraints**

* Photo upload size limits apply
* Large attendee lists not paginated

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/events` | Event listing |
| `/spaces/[id]/events` | Space events |
| `/events/[id]` | Event detail |
| `/calendar` | Calendar view |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [Spaces](./spaces.md) | Event container |
| [Users](./users.md) | Authors and attendees |
| [Media](./media.md) | Event photos |
| [Notifications](./notifications.md) | Event reminders |

---

## **Non-Goals / Explicit Exclusions**

* **Calendar sync** - No iCal/Google Calendar integration
* **Recurring events** - Single instances only
* **Ticketing** - No payment/ticket management
* **Video conferencing** - Link to external services only

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* Recurring events
* Calendar integrations
* Event reminders
* Waitlist support
* Capacity limits

---

## **Open Questions / Notes**

* Consider adding event capacity/waitlist
* May need recurring event support
* Consider calendar export (iCal)
* Video conferencing integration TBD
