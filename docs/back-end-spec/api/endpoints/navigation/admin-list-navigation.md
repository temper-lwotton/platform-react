# List All Navigation Configs

Retrieve all navigation configurations for admin management.

## Endpoint

```
GET /api/admin/navigation
```

## Description

Returns a summary of all navigation configurations for the admin management interface.

## Authentication

**Required.** Admin role required.

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "nav_main",
      "type": "main",
      "name": "Main Navigation",
      "description": "Primary top navigation bar",
      "itemCount": 7,
      "updatedAt": "2024-01-20T10:00:00Z",
      "updatedBy": {
        "id": "user_1",
        "name": "Admin User"
      }
    },
    {
      "id": "nav_main_mobile",
      "type": "main_mobile",
      "name": "Mobile Navigation",
      "description": "Mobile-specific navigation",
      "itemCount": 5,
      "updatedAt": "2024-01-19T15:30:00Z",
      "updatedBy": {
        "id": "user_1",
        "name": "Admin User"
      }
    },
    {
      "id": "nav_home_sidebar",
      "type": "home_sidebar",
      "name": "Homepage Sidebar",
      "description": "Sidebar for authenticated homepage",
      "itemCount": 12,
      "sectionCount": 3,
      "updatedAt": "2024-01-19T15:30:00Z",
      "updatedBy": {
        "id": "user_1",
        "name": "Admin User"
      }
    },
    {
      "id": "nav_footer",
      "type": "footer",
      "name": "Footer Navigation",
      "description": "Site footer links",
      "itemCount": 8,
      "updatedAt": "2024-01-18T12:00:00Z",
      "updatedBy": {
        "id": "user_2",
        "name": "Content Admin"
      }
    },
    {
      "id": "nav_user_menu",
      "type": "user_menu",
      "name": "User Menu",
      "description": "User dropdown menu",
      "itemCount": 6,
      "sectionCount": 3,
      "updatedAt": "2024-01-17T09:00:00Z",
      "updatedBy": {
        "id": "user_1",
        "name": "Admin User"
      }
    }
  ]
}
```

### Error Responses

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
curl -X GET "https://api.example.com/api/admin/navigation" \
  -H "Authorization: Bearer <admin_token>"
```

## Notes

- Only returns platform-level navigation, not space-specific sidebars
- Space sidebars are managed via space navigation endpoints
