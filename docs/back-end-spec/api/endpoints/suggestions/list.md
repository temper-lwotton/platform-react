# **Endpoint: `GET /api/suggestions`**

### **Summary**

Retrieves personalized suggestions across all content types with optional filtering and pagination.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* User receives suggestions based on their activity and interests
* Suggestions respect visibility settings of underlying entities

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | string | No | Filter by type (user, space, event, discussion, resource, showcase) |
| `limit` | number | No | Max suggestions to return (default: 20, max: 50) |
| `cursor` | string | No | Pagination cursor |
| `minScore` | number | No | Minimum relevance score (0-100) |
| `excludeDismissed` | boolean | No | Exclude dismissed suggestions (default: true) |

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
      "description": "AI Research Scientist specializing in neural networks and deep learning",
      "reason": "You both have interest in Machine Learning and Neural Networks",
      "url": "/users/15",
      "image": "https://cdn.example.com/avatars/user_15.jpg",
      "entityId": "user_15",
      "entityType": "user",
      "score": 87,
      "createdAt": "2024-01-20T10:00:00Z",
      "metadata": {
        "jobTitle": "AI Research Scientist",
        "company": "TechCorp",
        "mutualConnections": 12,
        "sharedInterests": ["Machine Learning", "Neural Networks", "Python"]
      }
    },
    {
      "id": "sug_124",
      "type": "space",
      "title": "Quantum Computing Enthusiasts",
      "description": "A community exploring the frontiers of quantum computing and its applications",
      "reason": "Based on your interest in Advanced Computing and Physics",
      "url": "/spaces/45",
      "image": "https://cdn.example.com/spaces/45/cover.jpg",
      "entityId": "space_45",
      "entityType": "space",
      "score": 82,
      "createdAt": "2024-01-20T09:30:00Z",
      "metadata": {
        "memberCount": 234,
        "recentActivityCount": 47,
        "mutualMembers": 8,
        "topics": ["Quantum Computing", "Physics", "Research"]
      }
    },
    {
      "id": "sug_125",
      "type": "event",
      "title": "AI Ethics Workshop 2024",
      "description": "Discussing ethical considerations in AI development and deployment",
      "reason": "You've been discussing AI safety in recent conversations",
      "url": "/events/78",
      "entityId": "event_78",
      "entityType": "event",
      "score": 79,
      "createdAt": "2024-01-20T09:00:00Z",
      "metadata": {
        "date": "2024-12-15",
        "time": "14:00",
        "isVirtual": true,
        "attendeeCount": 156,
        "mutualAttendees": 5
      }
    },
    {
      "id": "sug_126",
      "type": "discussion",
      "title": "Best practices for fine-tuning LLMs",
      "description": "Community discussion on effective strategies for fine-tuning large language models",
      "reason": "You and 5 others in your network are discussing this topic",
      "url": "/spaces/23/discussions/89",
      "entityId": "discussion_89",
      "entityType": "discussion",
      "score": 75,
      "createdAt": "2024-01-20T08:30:00Z",
      "metadata": {
        "replies": 42,
        "author": "Alex Rodriguez",
        "authorId": "user_89",
        "spaceName": "ML Engineers",
        "spaceId": "space_23",
        "participantCount": 18
      }
    }
  ],
  "meta": {
    "nextCursor": "eyJzY29yZSI6NzUsImlkIjoic3VnXzEyNiJ9",
    "hasMore": true,
    "totalAvailable": 47
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_TYPE` | Invalid suggestion type specified |
| 400 | `INVALID_SCORE` | minScore out of range (0-100) |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

## **Pagination**

* Cursor-based using `cursor` parameter
* Ordered by score descending, then by creation date

---

## **Related Endpoints**

* [GET /api/suggestions/carousel](./carousel.md) - Carousel-optimized suggestions
* [GET /api/suggestions/{type}](./list-by-type.md) - Suggestions by type
* [POST /api/suggestions/{id}/dismiss](./dismiss.md) - Dismiss suggestion

## **Frontend Notes**

* Display reason prominently to explain relevance
* Implement infinite scroll with cursor pagination
* Show type-specific metadata (e.g., mutual connections for users)
* Track impressions when suggestions are displayed
