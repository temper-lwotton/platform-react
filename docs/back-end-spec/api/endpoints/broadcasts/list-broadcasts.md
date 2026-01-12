# List Broadcasts

Retrieve a list of broadcast campaigns.

## Endpoint

```
GET /api/broadcasts
```

## Description

Returns a paginated list of broadcast campaigns. Supports filtering by status.

## Authentication

**Required.** Administrator role required.

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | - | Filter by status (draft, scheduled, sent, etc.) |
| `limit` | number | 20 | Max items to return |
| `cursor` | string | - | Pagination cursor |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "bc_123",
      "name": "EV Meetup Announcement",
      "subject": "Don't miss: EV Industry Meetup",
      "status": "sent",
      "scheduledAt": null,
      "sentAt": "2024-01-15T09:00:00Z",
      "recipients": [
        { "type": "space", "spaceId": "1", "count": 156 }
      ],
      "stats": {
        "sent": 156,
        "delivered": 152,
        "opened": 89,
        "clicked": 34
      },
      "createdBy": "5",
      "createdAt": "2024-01-10T14:00:00Z",
      "updatedAt": "2024-01-15T09:00:00Z"
    },
    {
      "id": "bc_124",
      "name": "Weekly Newsletter",
      "subject": "This Week in Transport Innovation",
      "status": "scheduled",
      "scheduledAt": "2024-01-22T09:00:00Z",
      "sentAt": null,
      "recipients": [
        { "type": "all", "count": 1250 }
      ],
      "stats": null,
      "createdBy": "5",
      "createdAt": "2024-01-18T10:00:00Z",
      "updatedAt": "2024-01-18T10:00:00Z"
    },
    {
      "id": "bc_125",
      "name": "New Feature Announcement",
      "subject": "Introducing: Status Updates",
      "status": "draft",
      "scheduledAt": null,
      "sentAt": null,
      "recipients": [],
      "stats": null,
      "createdBy": "5",
      "createdAt": "2024-01-20T16:00:00Z",
      "updatedAt": "2024-01-20T16:00:00Z"
    }
  ],
  "meta": {
    "nextCursor": "eyJpZCI6ImJjXzEyNSJ9",
    "hasMore": true
  }
}
```

### Empty Response

```json
{
  "success": true,
  "data": [],
  "meta": {
    "nextCursor": null,
    "hasMore": false
  }
}
```

### Error Responses

#### Unauthorized (403)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Administrator access required"
  }
}
```

## Example Request

```bash
curl -X GET "https://api.example.com/api/broadcasts?status=draft&limit=10" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Only administrators can access broadcasts
- Results ordered by `updatedAt` descending (most recent first)
- Stats included only for sent broadcasts
- Recipient counts are estimates

