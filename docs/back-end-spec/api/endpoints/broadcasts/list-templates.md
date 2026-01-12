# List Templates

Retrieve available broadcast templates.

## Endpoint

```
GET /api/broadcasts/templates
```

## Description

Returns a list of available broadcast templates. Includes both system-provided templates and custom templates created by administrators.

## Authentication

**Required.** Administrator role required.

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `category` | string | - | Filter by category (event, newsletter, announcement) |
| `isSystem` | boolean | - | Filter by system vs custom templates |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
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
            "content": { "text": "Event Title", "level": "h1", "align": "center" },
            "order": 1
          },
          {
            "id": "block_2",
            "type": "image",
            "content": { "src": "", "alt": "Event banner", "align": "center" },
            "order": 2
          },
          {
            "id": "block_3",
            "type": "text",
            "content": { "text": "Event description goes here..." },
            "order": 3
          },
          {
            "id": "block_4",
            "type": "button",
            "content": { "text": "Register Now", "url": "", "style": "primary", "align": "center" },
            "order": 4
          }
        ]
      },
      "category": "event",
      "thumbnail": "https://cdn.example.com/templates/event.png",
      "isSystem": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "tpl_newsletter",
      "name": "Weekly Newsletter",
      "description": "Regular newsletter with multiple sections",
      "subject": "This Week in [Community Name]",
      "preheader": "Your weekly update",
      "emailContent": {
        "blocks": [...]
      },
      "category": "newsletter",
      "thumbnail": "https://cdn.example.com/templates/newsletter.png",
      "isSystem": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "tpl_custom_1",
      "name": "EV Updates Template",
      "description": "Custom template for EV space updates",
      "subject": "EV Space Update",
      "preheader": "Latest from the EV community",
      "emailContent": {
        "blocks": [...]
      },
      "category": "newsletter",
      "thumbnail": null,
      "isSystem": false,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

## Example Request

```bash
curl -X GET "https://api.example.com/api/broadcasts/templates?category=event" \
  -H "Authorization: Bearer <token>"
```

## Notes

- System templates cannot be modified or deleted
- Custom templates can be created from existing broadcasts
- Templates provide starting content that can be customized

