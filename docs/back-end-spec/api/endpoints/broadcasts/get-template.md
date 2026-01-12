# Get Template

Retrieve a single broadcast template.

## Endpoint

```
GET /api/broadcasts/templates/{id}
```

## Description

Returns complete template details including email content blocks.

## Authentication

**Required.** Administrator role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Template ID |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "tpl_event",
    "name": "Event Announcement",
    "description": "Announce upcoming events with registration link",
    "subject": "[Event Name] - [Date]",
    "preheader": "Don't miss this upcoming event",
    "emailContent": {
      "blocks": [
        {
          "id": "block_1",
          "type": "heading",
          "content": {
            "text": "Event Title",
            "level": "h1",
            "align": "center"
          },
          "order": 1
        },
        {
          "id": "block_2",
          "type": "image",
          "content": {
            "src": "",
            "alt": "Event banner",
            "align": "center"
          },
          "order": 2
        },
        {
          "id": "block_3",
          "type": "text",
          "content": {
            "text": "<p><strong>Date:</strong> [Event Date]</p><p><strong>Time:</strong> [Event Time]</p><p><strong>Location:</strong> [Event Location]</p><p>[Event description goes here...]</p>"
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
            "url": "",
            "style": "primary",
            "align": "center"
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
            "text": "We look forward to seeing you there!",
            "align": "center"
          },
          "order": 7
        }
      ]
    },
    "category": "event",
    "thumbnail": "https://cdn.example.com/templates/event.png",
    "isSystem": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Error Responses

#### Template Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "TEMPLATE_NOT_FOUND",
    "message": "Template 'tpl_invalid' does not exist"
  }
}
```

## Example Request

```bash
curl -X GET "https://api.example.com/api/broadcasts/templates/tpl_event" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Placeholder text in templates indicated by [brackets]
- Empty URLs in buttons should be filled when creating broadcast
- Use template ID when creating broadcast to start from template

