# **Endpoint: `POST /api/suggestions/{id}/dismiss`**

### **Summary**

Dismisses a suggestion so it no longer appears in the user's suggestion lists.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* User can only dismiss their own suggestions

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Suggestion ID |

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
  "reason": "not_interested"
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `reason` | Optional, one of: not_interested, already_know, not_relevant, seen_before, other |

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "dismissed": true,
    "suggestionId": "sug_123"
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_REASON` | Invalid dismiss reason |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 404 | `SUGGESTION_NOT_FOUND` | Suggestion does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Suggestion hidden | Excluded from future suggestion lists |
| Dismissal recorded | Stored for analytics and restoration |
| `suggestion.dismissed` event | Emitted for tracking |
| Algorithm updated | Dismissal reason influences future suggestions |

## **Idempotency**

* **Idempotent:** Yes (dismissing again has no effect)
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [DELETE /api/suggestions/{id}/dismiss](./restore.md) - Restore dismissed
* [GET /api/suggestions/dismissed](./list-dismissed.md) - List dismissed

## **Frontend Notes**

* Provide dismiss button with optional reason selection
* Remove from UI immediately on dismiss
* Show "undo" option briefly after dismissal
* Update suggestion counts after dismissal
