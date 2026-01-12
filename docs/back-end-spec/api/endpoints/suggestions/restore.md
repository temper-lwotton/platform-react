# **Endpoint: `DELETE /api/suggestions/{id}/dismiss`**

### **Summary**

Restores a previously dismissed suggestion so it appears again in suggestion lists.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* User can only restore their own dismissed suggestions

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

### **Request Body**

*None*

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "restored": true,
    "suggestionId": "sug_123"
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 404 | `SUGGESTION_NOT_FOUND` | Suggestion does not exist |
| 404 | `NOT_DISMISSED` | Suggestion was not dismissed |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Suggestion visible | Re-appears in suggestion lists |
| Dismissal removed | Removed from dismissed list |
| `suggestion.restored` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** Yes (restoring again returns success)
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [POST /api/suggestions/{id}/dismiss](./dismiss.md) - Dismiss suggestion
* [GET /api/suggestions/dismissed](./list-dismissed.md) - List dismissed

## **Frontend Notes**

* Use in dismissed suggestions management view
* Update UI to remove from dismissed list
* Refresh main suggestions list after restore
