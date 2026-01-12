# Get All Badge Counts

Retrieve counts for multiple badge sources in a single request.

## Endpoint

```
GET /api/navigation/badges
```

## Description

Returns current counts for specified badge sources. This endpoint is optimized for fetching multiple badge counts efficiently.

## Authentication

**Required.**

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sources` | string | Yes | Comma-separated list of badge source identifiers |

## Badge Sources

| Source | Description |
|--------|-------------|
| `suggestions` | New suggestion count |
| `tasks_pending` | Pending tasks count |
| `messages_unread` | Unread messages count |
| `notifications_unread` | Unread notifications count |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "suggestions": 3,
    "tasks_pending": 7,
    "messages_unread": 12,
    "notifications_unread": 5
  }
}
```

### Error Responses

#### Invalid Source (400)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_SOURCE",
    "message": "Unknown badge source: 'invalid_source'"
  }
}
```

#### Unauthorized (401)

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

## Caching

- Short TTL (1 minute) recommended
- Consider WebSocket/SSE for real-time updates

## Example Request

```bash
curl -X GET "https://api.example.com/api/navigation/badges?sources=suggestions,tasks_pending,messages_unread" \
  -H "Authorization: Bearer <token>"
```

## Real-Time Updates

For real-time badge updates, use WebSocket or SSE:

### WebSocket

```javascript
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'navigation:badges'
}));

// Receive updates
{
  "type": "badge_update",
  "data": {
    "source": "messages_unread",
    "count": 15
  }
}
```

### Server-Sent Events

```
GET /api/navigation/badges/stream
```

```
event: badge_update
data: {"source": "messages_unread", "count": 15}

event: badge_update
data: {"source": "tasks_pending", "count": 8}
```

## Notes

- Returns 0 for sources with no items
- Unknown sources are ignored in the response
- Consider batching badge requests on page load
