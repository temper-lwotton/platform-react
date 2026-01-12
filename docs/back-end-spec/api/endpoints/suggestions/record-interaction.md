# **Endpoint: `POST /api/suggestions/{id}/interactions`**

### **Summary**

Records a user interaction with a suggestion for analytics and algorithm improvement.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* User can record interactions with their suggestions

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
  "action": "clicked",
  "metadata": {
    "position": 3,
    "context": "carousel",
    "timeToAction": 2.5
  }
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `action` | Required, one of: viewed, clicked, dismissed, converted, ignored |
| `metadata.position` | Optional, position in list (0-indexed) |
| `metadata.context` | Optional, one of: feed, carousel, page |
| `metadata.timeToAction` | Optional, seconds from display to action |

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_ACTION` | Invalid action type |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 404 | `SUGGESTION_NOT_FOUND` | Suggestion does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Interaction logged | Stored for analytics |
| Algorithm feedback | Used to improve suggestions |
| `suggestion.interaction` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** No (creates new interaction record)
* **Retry-safe:** No (may create duplicates)

---

## **Related Endpoints**

* [POST /api/suggestions/impressions](./impressions.md) - Bulk record impressions
* [POST /api/suggestions/{id}/dismiss](./dismiss.md) - Dismiss suggestion

## **Frontend Notes**

* Call when user clicks on a suggestion
* Track "converted" when user completes suggested action (e.g., joins space)
* Use "ignored" for suggestions that scroll out of view without interaction
* Include position and context for A/B testing
