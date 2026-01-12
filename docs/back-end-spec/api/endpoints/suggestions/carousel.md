# **Endpoint: `GET /api/suggestions/carousel`**

### **Summary**

Retrieves optimized suggestions for the feed carousel widget with compact response format.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* User receives suggestions based on their activity and interests

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `limit` | number | No | Max suggestions (default: 10, max: 15) |
| `types` | string | No | Comma-separated types to include |

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
      "id": "sug_123",
      "type": "user",
      "title": "Dr. Emily Chen",
      "description": "AI Research Scientist specializing in neural networks",
      "reason": "You both have interest in Machine Learning",
      "url": "/users/15",
      "image": "https://cdn.example.com/avatars/user_15.jpg",
      "metadata": {
        "mutualConnections": 12
      }
    },
    {
      "id": "sug_124",
      "type": "space",
      "title": "Quantum Computing Enthusiasts",
      "description": "A community exploring quantum computing",
      "reason": "Based on your interest in Advanced Computing",
      "url": "/spaces/45",
      "image": "https://cdn.example.com/spaces/45/cover.jpg",
      "metadata": {
        "memberCount": 234,
        "mutualMembers": 8
      }
    },
    {
      "id": "sug_125",
      "type": "event",
      "title": "AI Ethics Workshop 2024",
      "description": "Discussing ethical considerations in AI",
      "reason": "You've been discussing AI safety recently",
      "url": "/events/78",
      "image": "https://cdn.example.com/events/78/cover.jpg",
      "metadata": {
        "date": "2024-12-15",
        "isVirtual": true,
        "attendeeCount": 156
      }
    },
    {
      "id": "sug_126",
      "type": "discussion",
      "title": "Best practices for fine-tuning LLMs",
      "description": "Community discussion on LLM fine-tuning",
      "reason": "Trending in your network",
      "url": "/spaces/23/discussions/89",
      "metadata": {
        "replies": 42,
        "author": "Alex Rodriguez"
      }
    },
    {
      "id": "sug_127",
      "type": "resource",
      "title": "Introduction to Transformer Architecture",
      "description": "Comprehensive guide to transformers",
      "reason": "Related to your recent reading",
      "url": "/resources/156",
      "image": "https://cdn.example.com/resources/156/thumb.jpg",
      "metadata": {
        "type": "guide",
        "readTime": 25
      }
    }
  ]
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_TYPES` | Invalid type in types parameter |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/suggestions](./list.md) - Full suggestions list
* [POST /api/suggestions/impressions](./impressions.md) - Record impressions

## **Frontend Notes**

* Use for the horizontal scrolling carousel on the feed
* Ensure diverse mix of suggestion types
* Auto-scroll or paginate through suggestions
* Track impressions when carousel items become visible
* Consider lazy-loading images for performance
