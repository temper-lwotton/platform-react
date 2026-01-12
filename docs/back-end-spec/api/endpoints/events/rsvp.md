# **Endpoint: `POST /api/events/{id}/rsvp`**

### **Summary**

Sets or updates the user's RSVP status for an event.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user with space access

## **Permissions**

* User must have access to the event's space
* User can update their own RSVP at any time

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | number | Yes | Event ID |

### **Query Parameters**

*None*

### **Headers**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <token>` |
| `Content-Type` | Yes | `application/json` |

### **Request Body**

```json
{
  "status": "going"
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `status` | Required, one of: `going`, `maybe`, `not_going` |

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "RSVP updated"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_STATUS` | Status not one of allowed values |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | Not a member of private space |
| 404 | `EVENT_NOT_FOUND` | Event does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `event.rsvp` event | Emitted for tracking |
| Attendee list updated | User added/updated in attendees |

## **Idempotency**

* **Idempotent:** Yes (same status = same result)
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/events/{id}/attendees](./get-attendees.md) - View attendees
* [GET /api/events/{id}](./get.md) - Event details

## **Frontend Notes**

* Update UI optimistically
* Show confirmation for status changes
* `not_going` effectively removes from attendee list display
* User can change RSVP multiple times
