# Reset Space Sidebar

Reset a space's sidebar navigation to platform defaults.

## Endpoint

```
POST /api/spaces/{spaceId}/navigation/reset
```

## Description

Resets the space's sidebar navigation to the platform default configuration. This removes all customizations including custom labels, disabled items, and custom sections.

## Authentication

**Required.** User must be a space admin.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spaceId` | string | Yes | Space ID |

## Request Body

No request body required.

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "spaceId": "space_123",
    "useDefault": true,
    "items": [
      {
        "id": "overview",
        "label": "Overview",
        "href": "",
        "icon": "home",
        "order": 1,
        "visibility": { "rule": "always" },
        "enabled": true
      },
      {
        "id": "discussions",
        "label": "Discussions",
        "href": "/discussions",
        "icon": "message-square",
        "order": 2,
        "visibility": { "rule": "always" },
        "enabled": true
      },
      {
        "id": "events",
        "label": "Events",
        "href": "/events",
        "icon": "calendar",
        "order": 3,
        "visibility": { "rule": "always" },
        "enabled": true
      },
      {
        "id": "members",
        "label": "Members",
        "href": "/members",
        "icon": "users",
        "order": 4,
        "visibility": { "rule": "always" },
        "enabled": true
      },
      {
        "id": "settings",
        "label": "Settings",
        "href": "/settings",
        "icon": "settings",
        "order": 99,
        "visibility": { "rule": "spaceAdmin" },
        "enabled": true
      }
    ],
    "customSections": [],
    "resetAt": "2024-01-21T10:00:00Z",
    "resetBy": {
      "id": "user_5",
      "name": "Space Admin"
    }
  }
}
```

### Error Responses

#### Space Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "SPACE_NOT_FOUND",
    "message": "Space 'invalid_space' does not exist"
  }
}
```

#### Not Space Admin (403)

```json
{
  "success": false,
  "error": {
    "code": "NOT_SPACE_ADMIN",
    "message": "Only space admins can reset navigation"
  }
}
```

## Example Request

```bash
curl -X POST "https://api.example.com/api/spaces/space_123/navigation/reset" \
  -H "Authorization: Bearer <admin_token>"
```

## Notes

- This action cannot be undone
- All custom sections are removed
- All item customizations (labels, order, enabled status) are reset
- The space will use platform default navigation going forward
