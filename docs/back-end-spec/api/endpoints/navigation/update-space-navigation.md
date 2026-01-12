# Update Space Sidebar

Update the sidebar navigation for a space.

## Endpoint

```
PUT /api/spaces/{spaceId}/navigation
```

## Description

Updates the space's sidebar navigation configuration. Space admins can customize labels, enable/disable items, reorder items, and add custom sections.

## Authentication

**Required.** User must be a space admin.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spaceId` | string | Yes | Space ID |

## Request Body

```json
{
  "useDefault": false,
  "items": [
    {
      "id": "overview",
      "label": "Overview",
      "enabled": true,
      "order": 1
    },
    {
      "id": "chat",
      "label": "Team Chat",
      "enabled": true,
      "order": 2
    },
    {
      "id": "discussions",
      "label": "Discussions",
      "enabled": true,
      "order": 3
    },
    {
      "id": "events",
      "label": "Events",
      "enabled": true,
      "order": 4
    },
    {
      "id": "articles",
      "label": "Resources",
      "enabled": true,
      "order": 5
    },
    {
      "id": "downloads",
      "label": "Files",
      "enabled": true,
      "order": 6
    },
    {
      "id": "members",
      "enabled": true,
      "order": 7
    },
    {
      "id": "files",
      "enabled": false
    }
  ],
  "customSections": [
    {
      "title": "Quick Links",
      "order": 10,
      "visibility": { "rule": "spaceMember" },
      "items": [
        {
          "label": "Project Board",
          "href": "https://external-tool.com/board",
          "icon": "external-link",
          "order": 1
        },
        {
          "label": "Documentation",
          "href": "https://docs.example.com",
          "icon": "book",
          "order": 2
        }
      ]
    }
  ]
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `useDefault` | boolean | No | Reset to platform defaults |
| `items` | array | No | Default item customizations |
| `customSections` | array | No | Custom sections with external links |

### Item Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Default item identifier |
| `label` | string | No | Custom label (optional override) |
| `enabled` | boolean | No | Enable/disable the item |
| `order` | number | No | Custom sort order |

### Custom Section Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Section header |
| `order` | number | Yes | Section order |
| `visibility` | object | No | Visibility rule |
| `items` | array | Yes | Section items |

### Custom Section Item Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | Yes | Item label |
| `href` | string | Yes | URL (can be external) |
| `icon` | string | No | Icon identifier |
| `order` | number | Yes | Item order |

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
    "items": [...],
    "customSections": [...],
    "updatedAt": "2024-01-21T10:00:00Z",
    "updatedBy": {
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
    "message": "Only space admins can modify navigation"
  }
}
```

#### Validation Error (422)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "errors": {
      "customSections[0].items[0].label": ["Label is required"]
    }
  }
}
```

## Example Request

```bash
curl -X PUT "https://api.example.com/api/spaces/space_123/navigation" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "useDefault": false,
    "items": [
      { "id": "discussions", "label": "Forum", "enabled": true, "order": 1 },
      { "id": "events", "enabled": true, "order": 2 },
      { "id": "members", "enabled": true, "order": 3 }
    ],
    "customSections": []
  }'
```

## Disabling Items

To disable a default item:

```json
{
  "items": [
    { "id": "chat", "enabled": false },
    { "id": "files", "enabled": false }
  ]
}
```

## Notes

- Default items can be customized but not removed entirely
- Custom sections support external links
- Changes are applied immediately
- Use `useDefault: true` to reset to platform defaults
