# **Events API Endpoints**

**Domain:** [Events](../../domains/events.md)

**Base Path:** `/api/events`

---

## **Endpoint Index**

### **Events CRUD**

| Method | Path | Description |
|--------|------|-------------|
| GET | [`/api/events`](./list.md) | List events with filters |
| GET | [`/api/events/{id}`](./get.md) | Get single event |
| POST | [`/api/events`](./create.md) | Create event |
| PATCH | [`/api/events/{id}`](./update.md) | Update event |
| DELETE | [`/api/events/{id}`](./delete.md) | Delete event |

### **RSVP**

| Method | Path | Description |
|--------|------|-------------|
| POST | [`/api/events/{id}/rsvp`](./rsvp.md) | RSVP to event |
| GET | [`/api/events/{id}/attendees`](./get-attendees.md) | Get event attendees |

---

## **Common Patterns**

### **Date Filtering**

Filter events by date range:

```
GET /api/events?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z
```

### **Photo Upload**

Event photos use multipart/form-data - do not set Content-Type header:

```typescript
const formData = new FormData();
formData.append('title', 'Event Title');
formData.append('photo', photoFile);
// ... other fields

fetch('/api/events', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData
});
```

### **RSVP Statuses**

| Status | Meaning |
|--------|---------|
| `going` | Confirmed attendance |
| `maybe` | Tentative |
| `not_going` | Declined |
