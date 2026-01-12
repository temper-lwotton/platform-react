# **Endpoint: `POST /api/suggestions/impressions`**

### **Summary**

Records bulk impressions when suggestions are displayed to the user.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* User can record impressions for their suggestions

---

## **Request**

### **Path Parameters**

*None*

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
  "suggestionIds": ["sug_123", "sug_124", "sug_125", "sug_126"],
  "context": "feed",
  "viewportTime": 5000
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `suggestionIds` | Required, array of suggestion IDs (max 50) |
| `context` | Required, one of: feed, carousel, page |
| `viewportTime` | Optional, milliseconds suggestions were visible |

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "recorded": 4
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_CONTEXT` | Invalid context value |
| 400 | `TOO_MANY_IDS` | More than 50 suggestion IDs |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Impressions logged | Stored for analytics |
| CTR calculation | Used to calculate click-through rates |
| `suggestions.impressions` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** No (creates new impression records)
* **Retry-safe:** No (may create duplicates)

---

## **Related Endpoints**

* [POST /api/suggestions/{id}/interactions](./record-interaction.md) - Record individual interaction
* [GET /api/suggestions](./list.md) - List suggestions

## **Frontend Notes**

* Call when suggestions become visible in viewport
* Use Intersection Observer API for visibility tracking
* Batch impressions to reduce API calls
* Include viewport time for engagement metrics
* Debounce calls during rapid scrolling
