# Update Navigation Item

Update an existing navigation item.

## Endpoint

```
PUT /api/admin/navigation/{type}/items/{itemId}
```

## Description

Updates a specific navigation item within a navigation configuration. Only provided fields are updated.

## Authentication

**Required.** Admin role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Navigation type |
| `itemId` | string | Yes | Item ID to update |

## Request Body

```json
{
  "label": "Updated Label",
  "href": "/updated-path",
  "icon": "new-icon",
  "order": 3,
  "visibility": { "rule": "authenticated" },
  "target": "_blank"
}
```

### Request Fields

All fields are optional. Only provided fields are updated.

| Field | Type | Description |
|-------|------|-------------|
| `label` | string | Display label |
| `href` | string | Navigation URL |
| `icon` | string | Icon identifier |
| `order` | number | Sort order |
| `visibility` | object | Visibility rule |
| `target` | string | Link target |
| `badge` | object | Badge configuration |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "nav_item_123",
    "label": "Updated Label",
    "href": "/updated-path",
    "icon": "new-icon",
    "order": 3,
    "visibility": { "rule": "authenticated" },
    "target": "_blank",
    "updatedAt": "2024-01-21T10:00:00Z"
  }
}
```

### Error Responses

#### Item Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "Navigation item 'nav_invalid' does not exist"
  }
}
```

#### Invalid Visibility Rule (400)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_VISIBILITY_RULE",
    "message": "Invalid visibility rule format"
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
curl -X PUT "https://api.example.com/api/admin/navigation/main/items/nav_home" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Dashboard",
    "icon": "layout-dashboard"
  }'
```

## Notes

- Only provided fields are updated; others remain unchanged
- Cannot change item's parent via this endpoint; use delete and add instead
- Changes are applied immediately
