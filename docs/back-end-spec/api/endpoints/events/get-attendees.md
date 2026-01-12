# **Endpoint: `GET /api/events/{id}/attendees`**

### **Summary**

Retrieves the list of users who have RSVPed to an event.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user with space access

## **Permissions**

* User must have access to the event's space

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

### **Request Body**

*None*

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 456,
      "name": "Jane Smith",
      "username": "janesmith",
      "avatar": "https://cdn.example.com/photos/456.jpg",
      "email": "jane@example.com"
    },
    {
      "id": 789,
      "name": "Bob Wilson",
      "username": "bobwilson",
      "avatar": "https://cdn.example.com/photos/789.jpg"
    }
  ]
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | Not a member of private space |
| 404 | `EVENT_NOT_FOUND` | Event does not exist |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

## **Pagination**

* **Not paginated** - Returns full list
* May need pagination for large events

---

## **Related Endpoints**

* [POST /api/events/{id}/rsvp](./rsvp.md) - RSVP to event
* [GET /api/events/{id}](./get.md) - Event details

## **Frontend Notes**

* Typically shows users with `going` status
* May want to group by RSVP status
* Show attendee count separately from full list
* Email may be hidden based on privacy settings
