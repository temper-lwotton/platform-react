# Create Template

Create a new broadcast template.

## Endpoint

```
POST /api/broadcasts/templates
```

## Description

Creates a new custom template from scratch or from an existing broadcast. Templates can be reused when creating new broadcasts.

## Authentication

**Required.** Administrator role required.

## Request Body

### Create from Scratch

```json
{
  "name": "Product Update Template",
  "description": "Announce new features and updates",
  "subject": "New Feature: [Feature Name]",
  "preheader": "Check out what's new",
  "category": "announcement",
  "emailContent": {
    "blocks": [
      {
        "id": "block_1",
        "type": "heading",
        "content": {
          "text": "New Feature Announcement",
          "level": "h1",
          "align": "center"
        },
        "order": 1
      },
      {
        "id": "block_2",
        "type": "text",
        "content": {
          "text": "We're excited to announce [feature description]..."
        },
        "order": 2
      },
      {
        "id": "block_3",
        "type": "button",
        "content": {
          "text": "Learn More",
          "url": "",
          "style": "primary",
          "align": "center"
        },
        "order": 3
      }
    ]
  }
}
```

### Create from Existing Broadcast

```json
{
  "name": "EV Updates Template",
  "description": "Based on our successful EV meetup announcement",
  "category": "event",
  "fromBroadcastId": "bc_123"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Template name |
| `description` | string | No | Template description |
| `subject` | string | No* | Email subject line |
| `preheader` | string | No | Preview text |
| `category` | string | No | Category (event, newsletter, announcement) |
| `emailContent` | object | No* | Block-based content |
| `fromBroadcastId` | string | No* | Copy content from broadcast |

*Either `emailContent` or `fromBroadcastId` required.

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "tpl_custom_2",
    "name": "Product Update Template",
    "description": "Announce new features and updates",
    "subject": "New Feature: [Feature Name]",
    "preheader": "Check out what's new",
    "emailContent": {
      "blocks": [...]
    },
    "category": "announcement",
    "thumbnail": null,
    "isSystem": false,
    "createdAt": "2024-01-21T14:00:00Z",
    "updatedAt": "2024-01-21T14:00:00Z"
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
      "name": ["Template name is required"],
      "emailContent": ["Either emailContent or fromBroadcastId is required"]
    }
  }
}
```

#### Broadcast Not Found (404)

When using `fromBroadcastId`:

```json
{
  "success": false,
  "error": {
    "code": "BROADCAST_NOT_FOUND",
    "message": "Source broadcast 'bc_invalid' does not exist"
  }
}
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/broadcasts/templates" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Update Template",
    "description": "Announce new features and updates",
    "category": "announcement",
    "fromBroadcastId": "bc_123"
  }'
```

## Notes

- Custom templates are marked with `isSystem: false`
- Use placeholder text in [brackets] for customizable fields
- Thumbnails are auto-generated (may take a few minutes)
- Templates created from broadcasts copy content at creation time

