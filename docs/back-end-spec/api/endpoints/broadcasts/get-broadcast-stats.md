# Get Broadcast Stats

Retrieve delivery and engagement statistics for a broadcast.

## Endpoint

```
GET /api/broadcasts/{id}/stats
```

## Description

Returns detailed delivery and engagement statistics for a sent broadcast. Statistics are updated periodically and may be delayed up to 1 hour.

## Authentication

**Required.** Administrator role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Broadcast ID |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "broadcastId": "bc_123",
    "sent": 156,
    "delivered": 152,
    "opened": 89,
    "clicked": 34,
    "bounced": 4,
    "unsubscribed": 2,
    "openRate": 58.55,
    "clickRate": 22.37,
    "bounceRate": 2.56,
    "unsubscribeRate": 1.32,
    "lastUpdated": "2024-01-16T09:00:00Z",
    "timeline": [
      {
        "hour": "2024-01-15T09:00:00Z",
        "sent": 156,
        "delivered": 120,
        "opened": 45,
        "clicked": 12
      },
      {
        "hour": "2024-01-15T10:00:00Z",
        "sent": 156,
        "delivered": 148,
        "opened": 72,
        "clicked": 25
      },
      {
        "hour": "2024-01-15T11:00:00Z",
        "sent": 156,
        "delivered": 152,
        "opened": 89,
        "clicked": 34
      }
    ],
    "topLinks": [
      {
        "url": "https://example.com/events/ev-meetup/register",
        "clicks": 28,
        "uniqueClicks": 24
      },
      {
        "url": "https://example.com/events/ev-meetup",
        "clicks": 12,
        "uniqueClicks": 10
      }
    ]
  }
}
```

### Sending In Progress Response

```json
{
  "success": true,
  "data": {
    "broadcastId": "bc_124",
    "sent": 89,
    "delivered": 45,
    "opened": 0,
    "clicked": 0,
    "bounced": 2,
    "unsubscribed": 0,
    "openRate": 0,
    "clickRate": 0,
    "bounceRate": 4.44,
    "unsubscribeRate": 0,
    "lastUpdated": "2024-01-21T12:05:00Z",
    "status": "sending",
    "progress": {
      "total": 156,
      "processed": 89,
      "percentComplete": 57.05
    }
  }
}
```

### Error Responses

#### Broadcast Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "BROADCAST_NOT_FOUND",
    "message": "Broadcast 'bc_invalid' does not exist"
  }
}
```

#### No Stats Available (400)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATUS",
    "message": "Statistics not available for draft broadcasts"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `sent` | number | Total emails sent |
| `delivered` | number | Successfully delivered |
| `opened` | number | Unique opens |
| `clicked` | number | Unique clicks |
| `bounced` | number | Hard and soft bounces |
| `unsubscribed` | number | Unsubscribes from this email |
| `openRate` | number | Percentage opened (0-100) |
| `clickRate` | number | Percentage clicked (0-100) |
| `bounceRate` | number | Percentage bounced (0-100) |
| `unsubscribeRate` | number | Percentage unsubscribed (0-100) |
| `lastUpdated` | string | When stats were last refreshed |
| `timeline` | array | Hourly breakdown of metrics |
| `topLinks` | array | Most clicked links |

## Example Request

```bash
curl -X GET "https://api.example.com/api/broadcasts/bc_123/stats" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Statistics may be delayed up to 1 hour
- Open tracking requires images to be loaded
- Click tracking only works for links in the email
- Timeline data available for 30 days after sending

