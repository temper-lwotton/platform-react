# **Endpoint: `PUT /api/admin/suggestions/config`**

### **Summary**

Configures suggestion algorithm weights and parameters. Changes affect all users.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Admin only

## **Permissions**

* Must have admin role
* Changes affect entire suggestion system

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
  "signalWeights": {
    "connected_with_user": 0.9,
    "followed_user": 0.85,
    "joined_space": 0.85,
    "rsvp_event": 0.8,
    "attended_event": 0.8,
    "created_discussion": 0.75,
    "liked_content": 0.6,
    "commented_on_content": 0.65,
    "viewed_content": 0.3,
    "searched_term": 0.4,
    "browsed_category": 0.2
  },
  "typeWeights": {
    "user": 1.0,
    "space": 0.9,
    "event": 0.85,
    "discussion": 0.8,
    "resource": 0.75,
    "showcase": 0.7
  },
  "decayRates": {
    "connected_with_user": 30,
    "joined_space": 60,
    "rsvp_event": 14,
    "liked_content": 7,
    "viewed_content": 3,
    "searched_term": 1,
    "browsed_category": 1
  },
  "minScoreThreshold": 30,
  "maxSuggestionsPerType": 20,
  "diversitySettings": {
    "maxConsecutiveSameType": 3,
    "minTypesInTop10": 2,
    "discoveryBoostFactor": 1.2
  }
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `signalWeights.*` | 0-1 range |
| `typeWeights.*` | 0-1 range |
| `decayRates.*` | Positive integer (days) |
| `minScoreThreshold` | 0-100 |
| `maxSuggestionsPerType` | 1-100 |
| `diversitySettings.maxConsecutiveSameType` | 1-10 |
| `diversitySettings.minTypesInTop10` | 1-6 |
| `diversitySettings.discoveryBoostFactor` | 1.0-2.0 |

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "updated": true,
    "effectiveAt": "2024-01-20T12:00:00Z",
    "config": {
      "signalWeights": {
        "connected_with_user": 0.9,
        "followed_user": 0.85,
        "joined_space": 0.85
      },
      "typeWeights": {
        "user": 1.0,
        "space": 0.9,
        "event": 0.85
      },
      "decayRates": {
        "connected_with_user": 30,
        "joined_space": 60,
        "rsvp_event": 14
      },
      "minScoreThreshold": 30,
      "maxSuggestionsPerType": 20,
      "diversitySettings": {
        "maxConsecutiveSameType": 3,
        "minTypesInTop10": 2,
        "discoveryBoostFactor": 1.2
      }
    }
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_WEIGHT` | Weight value out of range |
| 400 | `INVALID_DECAY` | Invalid decay rate |
| 400 | `VALIDATION_ERROR` | Other validation failures |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `FORBIDDEN` | Not an admin |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Config updated | New weights applied |
| Cache invalidated | All user suggestion caches cleared |
| Regeneration queued | Background jobs triggered for all users |
| `suggestions.config_updated` event | Emitted for tracking |
| Audit logged | Configuration change recorded |

## **Idempotency**

* **Idempotent:** Yes (same config produces same result)
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/admin/suggestions/metrics](./admin-metrics.md) - View metrics to inform config changes

## **Frontend Notes**

* Provide admin UI with sliders for weights
* Show current values with ability to reset to defaults
* Preview expected impact before saving
* Require confirmation for significant changes
* Display when changes will take effect
* Show history of configuration changes
