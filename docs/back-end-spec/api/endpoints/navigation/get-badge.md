# Get Single Badge Count

Retrieve the count for a specific badge source.

## Endpoint

```
GET /api/navigation/badges/{source}
```

## Description

Returns the current count for a single badge source.

## Authentication

**Required.**

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `source` | string | Yes | Badge source identifier |

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
    "count": 5
  }
}
```

### Error Responses

#### Source Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "SOURCE_NOT_FOUND",
    "message": "Badge source 'invalid' does not exist"
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
- Invalidate when related data changes

## Example Request

```bash
curl -X GET "https://api.example.com/api/navigation/badges/messages_unread" \
  -H "Authorization: Bearer <token>"
```

## Notes

- For fetching multiple badge counts, use [Get All Badge Counts](./get-badges.md) instead
- Returns 0 if no items exist for the source
