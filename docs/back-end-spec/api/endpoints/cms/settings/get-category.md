# **Endpoint: `GET /api/cms/settings/{category}`**

### **Summary**

Retrieves settings for a specific category.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Admin only

## **Permissions**

* Must have Admin role

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `category` | string | Yes | Settings category |

**Valid categories:** `general`, `media`, `reading`, `writing`, `discussion`, `permalinks`, `theme`

### **Query Parameters**

*None*

### **Headers**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <token>` |

### **Request Body**

*None*

---

## **Response**

### **Success Response**

**Status:** `200 OK`

Example for `theme` category:
```json
{
  "success": true,
  "data": {
    "platformTheme": "innovation-spectrum",
    "defaultColorMode": "light",
    "allowUserOverride": true,
    "primaryColor": "#8b5cf6",
    "infoColor": "#3b82f6",
    "ctaColor": "#f97316",
    "accentColor": "#C0F23C"
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_CATEGORY` | Unknown category |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `INSUFFICIENT_ROLE` | Not an Admin |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/cms/settings](./get-all.md) - Get all settings
* [PATCH /api/cms/settings/{category}](./update-theme.md) - Update category

## **Frontend Notes**

* Use `getSettingsCategory(category)` from `@/services/cms/api/settings`
* Useful for loading settings on specific admin pages
