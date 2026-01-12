# Create Broadcast

Create a new broadcast campaign.

## Endpoint

```
POST /api/broadcasts
```

## Description

Creates a new broadcast in draft status. The broadcast can then be edited, scheduled, or sent.

## Authentication

**Required.** Administrator role required.

## Request Body

```json
{
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
        "type": "text",
        "content": {
          "text": "Join us for networking and discussions about the future of electric transportation.",
          "align": "left"
        },
        "order": 2
      },
      {
        "id": "block_3",
        "type": "button",
        "content": {
          "text": "Register Now",
          "url": "https://example.com/register",
          "align": "center",
          "style": "primary"
        },
        "order": 3
      }
    ]
  },
  "recipients": [
    { "type": "space", "spaceId": "1" }
  ]
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Internal campaign name |
| `subject` | string | No | Email subject line (max 200 chars) |
| `preheader` | string | No | Preview text |
| `emailContent` | object | No | Block-based content |
| `emailContent.blocks` | array | No | Array of email blocks |
| `recipients` | array | No | Target audience |
| `templateId` | string | No | Start from template |

### Email Block Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique block ID |
| `type` | string | Yes | Block type |
| `content` | object | Yes | Type-specific content |
| `order` | number | Yes | Display order |

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "bc_126",
    "name": "EV Meetup Announcement",
    "subject": "Don't miss: EV Industry Meetup",
    "preheader": "Feb 15th, 6PM - Innovation Hub",
    "emailContent": {
      "blocks": [...]
    },
    "status": "draft",
    "scheduledAt": null,
    "sentAt": null,
    "recipients": [
      { "type": "space", "spaceId": "1", "count": 156 }
    ],
    "stats": null,
    "createdBy": "5",
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-21T10:00:00Z"
  }
}
```

### Error Responses

#### Validation Error (400)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "errors": {
      "name": ["Name is required"],
      "subject": ["Subject must be 200 characters or less"]
    }
  }
}
```

#### Rate Limit Exceeded (429)

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Maximum 10 broadcasts per hour"
  }
}
```

## Creating from Template

To start from a template:

```json
{
  "name": "February Newsletter",
  "templateId": "tpl_newsletter"
}
```

This copies the template's content, which can then be customized.

## Example Request

```bash
curl -X POST "https://api.example.com/api/broadcasts" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "EV Meetup Announcement",
    "subject": "Don't miss: EV Industry Meetup",
    "preheader": "Feb 15th, 6PM - Innovation Hub",
    "emailContent": {
      "blocks": [
        {
          "id": "block_1",
          "type": "heading",
          "content": { "text": "EV Industry Meetup", "level": "h1" },
          "order": 1
        }
      ]
    }
  }'
```

## Notes

- Created broadcasts start in `draft` status
- Subject and content can be added later
- Recipient counts are estimated when recipients are specified
- Rate limited to 10 broadcasts per hour

