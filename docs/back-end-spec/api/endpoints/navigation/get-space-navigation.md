# Get Space Sidebar

Retrieve the sidebar navigation for a specific space.

## Endpoint

```
GET /api/spaces/{spaceId}/navigation
```

## Description

Returns the sidebar navigation configuration for a space. If the space uses default navigation, returns the platform default with space context applied.

## Authentication

**Required.** User must have access to the space.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spaceId` | string | Yes | Space ID |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "nav_space_sidebar_123",
    "spaceId": "space_123",
    "type": "space_sidebar",
    "useDefault": false,
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
        "id": "chat",
        "label": "Team Chat",
        "href": "/chat",
        "icon": "message-circle",
        "order": 2,
        "visibility": { "rule": "spaceMember" },
        "enabled": true,
        "badge": {
          "type": "count",
          "source": "/api/spaces/space_123/chat/unread"
        }
      },
      {
        "id": "discussions",
        "label": "Discussions",
        "href": "/discussions",
        "icon": "message-square",
        "order": 3,
        "visibility": { "rule": "always" },
        "enabled": true
      },
      {
        "id": "events",
        "label": "Events",
        "href": "/events",
        "icon": "calendar",
        "order": 4,
        "visibility": { "rule": "always" },
        "enabled": true
      },
      {
        "id": "articles",
        "label": "Articles",
        "href": "/articles",
        "icon": "file-text",
        "order": 5,
        "visibility": { "rule": "always" },
        "enabled": true
      },
      {
        "id": "downloads",
        "label": "Downloads",
        "href": "/downloads",
        "icon": "download",
        "order": 6,
        "visibility": { "rule": "spaceMember" },
        "enabled": true
      },
      {
        "id": "members",
        "label": "Members",
        "href": "/members",
        "icon": "users",
        "order": 7,
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
    "customSections": [
      {
        "id": "custom_links",
        "title": "Quick Links",
        "order": 10,
        "visibility": { "rule": "spaceMember" },
        "items": [
          {
            "id": "custom_1",
            "label": "Project Board",
            "href": "https://external-tool.com/board/123",
            "icon": "external-link",
            "order": 1,
            "visibility": { "rule": "always" },
            "enabled": true
          },
          {
            "id": "custom_2",
            "label": "Documentation",
            "href": "https://docs.example.com",
            "icon": "book",
            "order": 2,
            "visibility": { "rule": "always" },
            "enabled": true
          }
        ]
      }
    ]
  }
}
```

### Default Navigation Response

When `useDefault: true`:

```json
{
  "success": true,
  "data": {
    "id": "nav_space_sidebar_default",
    "spaceId": "space_456",
    "type": "space_sidebar",
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
    "customSections": []
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

#### Access Denied (403)

```json
{
  "success": false,
  "error": {
    "code": "ACCESS_DENIED",
    "message": "You do not have access to this space"
  }
}
```

## URL Construction

Item `href` values are relative to the space base URL:
- Space URL: `/spaces/product-team`
- Item href: `/discussions`
- Full URL: `/spaces/product-team/discussions`

## Example Request

```bash
curl -X GET "https://api.example.com/api/spaces/space_123/navigation" \
  -H "Authorization: Bearer <token>"
```

## Notes

- Items are filtered by visibility rules based on user's space role
- Badge sources include space ID for proper scoping
- `useDefault: true` indicates no customization has been applied
