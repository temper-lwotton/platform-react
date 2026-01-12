# Reorder Navigation Items

Reorder navigation items within a configuration.

## Endpoint

```
PUT /api/admin/navigation/{type}/reorder
```

## Description

Updates the order of navigation items. This endpoint allows bulk reordering of items at the same level.

## Authentication

**Required.** Admin role required.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Navigation type |

## Request Body

```json
{
  "items": [
    { "id": "nav_home", "order": 1 },
    { "id": "nav_people", "order": 2 },
    { "id": "nav_events", "order": 3 },
    { "id": "nav_learn", "order": 4 },
    { "id": "nav_contribute", "order": 5 }
  ]
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `items` | array | Yes | Array of item ID and order pairs |
| `items[].id` | string | Yes | Item ID |
| `items[].order` | number | Yes | New order value |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "reordered": true,
    "itemCount": 5
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

#### Validation Error (422)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "errors": {
      "items": ["All items must have unique order values"]
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
curl -X PUT "https://api.example.com/api/admin/navigation/main/reorder" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "id": "nav_home", "order": 1 },
      { "id": "nav_events", "order": 2 },
      { "id": "nav_people", "order": 3 }
    ]
  }'
```

## Notes

- Only items specified are reordered; others keep their current order
- Items not included may need order values adjusted to avoid conflicts
- Changes are applied immediately
