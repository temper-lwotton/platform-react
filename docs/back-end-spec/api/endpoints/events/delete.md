# **Endpoint: `DELETE /api/events/{id}`**

### **Summary**

Deletes an event. Only the author or space admin can delete.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Event author or space admin

## **Permissions**

* Event author can delete their own events
* Space admins can delete any event in their space

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

**Status:** `204 No Content`

*No response body*

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_AUTHOR` | Not author and not space admin |
| 404 | `EVENT_NOT_FOUND` | Event does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `event.deleted` event | Emitted for tracking |
| RSVPs removed | All RSVPs for event deleted |
| Notifications | May notify attendees of cancellation |

## **Idempotency**

* **Idempotent:** Yes (subsequent calls return 404)
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/events](./list.md) - List events
* [GET /api/events/{id}](./get.md) - Get event

## **Frontend Notes**

* Requires confirmation dialog
* Redirect to events list after deletion
* Consider notifying RSVPed users
