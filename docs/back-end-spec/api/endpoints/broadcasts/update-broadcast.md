# Update Broadcast

Update a broadcast campaign.

## Endpoint

```
PATCH /api/broadcasts/{id}
```

## Description

Updates broadcast details including content, recipients, and metadata. Only broadcasts in `draft` status can be updated.

## Authentication

**Required.** Administrator role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Broadcast ID |

## Request Body

```json
{
  "name": "EV Meetup Announcement - Updated",
  "subject": "You're Invited: EV Industry Meetup",
  "preheader": "Join us Feb 15th at Innovation Hub",
  "emailContent": {
    "blocks": [
      {
        "id": "block_1",
        "type": "heading",
        "content": {
          "text": "You're Invited!",
          "level": "h1",
          "align": "center"
        },
        "order": 1
      },
      {
        "id": "block_2",
        "type": "image",
        "content": {
          "src": "https://cdn.example.com/events/ev-banner.jpg",
          "alt": "EV Meetup",
          "align": "center"
        },
        "order": 2
      }
    ]
  },
  "recipients": [
    { "type": "space", "spaceId": "1" },
    { "type": "space", "spaceId": "2" }
  ]
}
```

### Request Fields

All fields are optional. Only specified fields are updated.

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Internal campaign name |
| `subject` | string | Email subject line |
| `preheader` | string | Preview text |
| `emailContent` | object | Block-based content (replaces entire content) |
| `recipients` | array | Target audience (replaces entire list) |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "bc_123",
    "name": "EV Meetup Announcement - Updated",
    "subject": "You're Invited: EV Industry Meetup",
    "preheader": "Join us Feb 15th at Innovation Hub",
    "emailContent": {
      "blocks": [...]
    },
    "status": "draft",
    "scheduledAt": null,
    "sentAt": null,
    "recipients": [
      { "type": "space", "spaceId": "1", "count": 156 },
      { "type": "space", "spaceId": "2", "count": 89 }
    ],
    "stats": null,
    "createdBy": "5",
    "createdAt": "2024-01-10T14:00:00Z",
    "updatedAt": "2024-01-21T11:00:00Z"
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

#### Invalid Status (400)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATUS",
    "message": "Cannot update broadcast in 'sent' status"
  }
}
```

#### Already Sent (400)

```json
{
  "success": false,
  "error": {
    "code": "ALREADY_SENT",
    "message": "Cannot modify a sent broadcast"
  }
}
```

## Example Request

```bash
curl -X PATCH "https://api.example.com/api/broadcasts/bc_123" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Updated Subject Line",
    "recipients": [
      { "type": "all" }
    ]
  }'
```

## Notes

- Only `draft` broadcasts can be updated
- Content updates replace the entire email content
- Recipient updates replace the entire recipient list
- To cancel a scheduled broadcast, use the cancel endpoint first

