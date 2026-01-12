# Update Navigation Config

Update a navigation configuration.

## Endpoint

```
PUT /api/admin/navigation/{type}
```

## Description

Updates the complete navigation configuration for a specific type. This replaces all items and settings.

## Authentication

**Required.** Admin role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Navigation type to update |

## Request Body

```json
{
  "name": "Main Navigation",
  "description": "Primary top navigation bar",
  "items": [
    {
      "id": "nav_home",
      "label": "Home",
      "href": "/feed",
      "icon": "home",
      "order": 1,
      "visibility": { "rule": "authenticated" }
    },
    {
      "id": "nav_people",
      "label": "People",
      "href": "/users",
      "icon": "users",
      "order": 2,
      "visibility": { "rule": "authenticated" }
    },
    {
      "id": "nav_events",
      "label": "Events",
      "href": "/events",
      "icon": "calendar",
      "order": 3,
      "visibility": { "rule": "authenticated" }
    }
  ],
  "settings": {
    "showIcons": true,
    "maxDepth": 2,
    "collapsible": false,
    "defaultCollapsed": false
  },
  "logoUrl": "/images/logo.svg",
  "logoAltText": "Platform Logo",
  "ctaButton": {
    "label": "Join Now",
    "href": "/register",
    "variant": "primary",
    "visibility": { "rule": "unauthenticated" }
  }
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | Display name for admin |
| `description` | string | No | Description for admin |
| `items` | array | Yes | Navigation items |
| `settings` | object | No | Navigation settings |
| `logoUrl` | string | No | Logo URL (main nav only) |
| `logoAltText` | string | No | Logo alt text |
| `ctaButton` | object | No | CTA button config |

### Item Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique item identifier |
| `label` | string | Yes | Display label |
| `href` | string | No | Navigation URL |
| `icon` | string | No | Icon identifier |
| `order` | number | Yes | Sort order |
| `visibility` | object | Yes | Visibility rule |
| `target` | string | No | Link target (`_self`, `_blank`) |
| `children` | array | No | Nested items |
| `badge` | object | No | Badge configuration |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "nav_main",
    "type": "main",
    "name": "Main Navigation",
    "items": [...],
    "settings": {...},
    "updatedAt": "2024-01-21T09:00:00Z",
    "updatedBy": {
      "id": "user_1",
      "name": "Admin User"
    }
  }
}
```

### Error Responses

#### Navigation Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "NAVIGATION_NOT_FOUND",
    "message": "Navigation type 'invalid' does not exist"
  }
}
```

#### Invalid Visibility Rule (400)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_VISIBILITY_RULE",
    "message": "Invalid visibility rule format",
    "errors": {
      "items[2].visibility": ["Invalid rule type 'unknown'"]
    }
  }
}
```

#### Max Depth Exceeded (400)

```json
{
  "success": false,
  "error": {
    "code": "MAX_DEPTH_EXCEEDED",
    "message": "Navigation items exceed maximum nesting depth of 3"
  }
}
```

#### Forbidden (403)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Admin access required"
  }
}
```

## Example Request

```bash
curl -X PUT "https://api.example.com/api/admin/navigation/main" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "id": "nav_home",
        "label": "Home",
        "href": "/feed",
        "icon": "home",
        "order": 1,
        "visibility": { "rule": "authenticated" }
      }
    ],
    "settings": {
      "showIcons": true,
      "maxDepth": 2
    }
  }'
```

## Notes

- This endpoint replaces the entire configuration
- For partial updates, use the item-specific endpoints
- Changes are applied immediately
- Consider implementing a preview/publish workflow for production
