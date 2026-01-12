# Add Navigation Item

Add a new item to a navigation configuration.

## Endpoint

```
POST /api/admin/navigation/{type}/items
```

## Description

Adds a new navigation item to the specified navigation type. Items can be added at the root level or as children of existing items.

## Authentication

**Required.** Admin role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Navigation type |

## Request Body

```json
{
  "label": "New Section",
  "href": "/new-section",
  "icon": "star",
  "order": 5,
  "visibility": { "rule": "authenticated" },
  "parentId": null,
  "target": "_self",
  "badge": {
    "type": "dot",
    "value": null
  }
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | Yes | Display label |
| `href` | string | No | Navigation URL (optional if has children) |
| `icon` | string | No | Icon identifier |
| `order` | number | Yes | Sort order |
| `visibility` | object | Yes | Visibility rule |
| `parentId` | string | No | Parent item ID for nesting |
| `target` | string | No | Link target (`_self`, `_blank`) |
| `badge` | object | No | Badge configuration |

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "nav_item_456",
    "label": "New Section",
    "href": "/new-section",
    "icon": "star",
    "order": 5,
    "visibility": { "rule": "authenticated" },
    "parentId": null,
    "target": "_self",
    "createdAt": "2024-01-21T09:00:00Z"
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

#### Parent Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "Parent item 'nav_invalid' does not exist"
  }
}
```

#### Max Depth Exceeded (400)

```json
{
  "success": false,
  "error": {
    "code": "MAX_DEPTH_EXCEEDED",
    "message": "Adding this item would exceed maximum nesting depth of 3"
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
      "label": ["Label is required"],
      "order": ["Order must be a positive number"]
    }
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
curl -X POST "https://api.example.com/api/admin/navigation/main/items" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Resources",
    "href": "/resources",
    "icon": "folder",
    "order": 6,
    "visibility": { "rule": "authenticated" }
  }'
```

## Adding Nested Items

To add an item as a child of an existing item:

```bash
curl -X POST "https://api.example.com/api/admin/navigation/main/items" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Sub Item",
    "href": "/parent/sub",
    "icon": "file",
    "order": 1,
    "visibility": { "rule": "authenticated" },
    "parentId": "nav_parent_item"
  }'
```

## Notes

- Item IDs are auto-generated if not provided
- Order determines display sequence within the same level
- Maximum 3 levels of nesting allowed
