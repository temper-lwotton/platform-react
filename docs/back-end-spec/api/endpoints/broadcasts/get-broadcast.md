# Get Broadcast

Retrieve a single broadcast with full details.

## Endpoint

```
GET /api/broadcasts/{id}
```

## Description

Returns complete broadcast details including email content blocks and statistics (if sent).

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
    "id": "bc_123",
    "name": "EV Meetup Announcement",
    "subject": "Don't miss: EV Industry Meetup",
    "preheader": "Feb 15th, 6PM - Innovation Hub",
    "emailContent": {
      "blocks": [
        {
          "id": "block_1",
          "type": "heading",
          "content": {
            "text": "EV Industry Meetup",
            "level": "h1",
            "align": "center"
          },
          "order": 1
        },
        {
          "id": "block_2",
          "type": "image",
          "content": {
            "src": "https://cdn.example.com/events/ev-meetup.jpg",
            "alt": "EV Meetup Banner",
            "align": "center"
          },
          "order": 2
        },
        {
          "id": "block_3",
          "type": "text",
          "content": {
            "text": "<p>Join us for an evening of networking and discussions about the future of electric transportation.</p><p><strong>When:</strong> February 15th, 2024 at 6:00 PM</p><p><strong>Where:</strong> Innovation Hub, London</p>",
            "align": "left"
          },
          "order": 3
        },
        {
          "id": "block_4",
          "type": "spacer",
          "content": {
            "height": 20
          },
          "order": 4
        },
        {
          "id": "block_5",
          "type": "button",
          "content": {
            "text": "Register Now",
            "url": "https://example.com/events/ev-meetup/register",
            "align": "center",
            "style": "primary"
          },
          "order": 5
        },
        {
          "id": "block_6",
          "type": "divider",
          "content": {
            "style": "solid"
          },
          "order": 6
        },
        {
          "id": "block_7",
          "type": "text",
          "content": {
            "text": "See you there!<br>The Transport Innovation Team",
            "align": "center"
          },
          "order": 7
        }
      ]
    },
    "status": "sent",
    "scheduledAt": null,
    "sentAt": "2024-01-15T09:00:00Z",
    "recipients": [
      {
        "type": "space",
        "spaceId": "1",
        "count": 156
      }
    ],
    "stats": {
      "sent": 156,
      "delivered": 152,
      "opened": 89,
      "clicked": 34,
      "bounced": 4,
      "unsubscribed": 2,
      "openRate": 58.5,
      "clickRate": 22.4,
      "lastUpdated": "2024-01-16T09:00:00Z"
    },
    "createdBy": "5",
    "createdAt": "2024-01-10T14:00:00Z",
    "updatedAt": "2024-01-15T09:00:00Z"
  }
}
```

### Draft Broadcast Response

```json
{
  "success": true,
  "data": {
    "id": "bc_125",
    "name": "New Feature Announcement",
    "subject": "Introducing: Status Updates",
    "preheader": "Share what you're working on",
    "emailContent": {
      "blocks": [
        {
          "id": "block_1",
          "type": "heading",
          "content": { "text": "New Feature: Status Updates", "level": "h1" },
          "order": 1
        }
      ]
    },
    "status": "draft",
    "scheduledAt": null,
    "sentAt": null,
    "recipients": [],
    "stats": null,
    "createdBy": "5",
    "createdAt": "2024-01-20T16:00:00Z",
    "updatedAt": "2024-01-20T16:00:00Z"
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

## Example Request

```bash
curl -X GET "https://api.example.com/api/broadcasts/bc_123" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Full email content included for editing purposes
- Statistics available only for sent broadcasts
- Stats may be delayed up to 1 hour

