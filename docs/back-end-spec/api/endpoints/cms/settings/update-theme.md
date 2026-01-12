# **Endpoint: `PATCH /api/cms/settings/theme`**

### **Summary**

Updates theme settings including colors and color mode.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Admin only

## **Permissions**

* Must have Admin role

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

*None*

### **Headers**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <token>` |
| `Content-Type` | Yes | `application/json` |

### **Request Body**

Partial update - only include fields to change:

```json
{
  "platformTheme": "deep-focus",
  "defaultColorMode": "dark",
  "allowUserOverride": true,
  "primaryColor": "#7c3aed",
  "ctaColor": "#ea580c"
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `platformTheme` | One of: `innovation-spectrum`, `deep-focus`, `bright-studio`, `coastal-fusion`, `custom` |
| `defaultColorMode` | One of: `light`, `dark`, `system` |
| `allowUserOverride` | Boolean |
| `primaryColor` | Valid hex color |
| `infoColor` | Valid hex color |
| `ctaColor` | Valid hex color |
| `accentColor` | Valid hex color |

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "platformTheme": "deep-focus",
    "defaultColorMode": "dark",
    "allowUserOverride": true,
    "primaryColor": "#7c3aed",
    "infoColor": "#3b82f6",
    "ctaColor": "#ea580c",
    "accentColor": "#C0F23C"
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_COLOR` | Invalid hex color format |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `INSUFFICIENT_ROLE` | Not an Admin |
| 422 | `VALIDATION_ERROR` | Invalid settings value |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Browser event | `platform-theme-change` event dispatched |
| CSS variables updated | Theme colors applied immediately |

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/cms/settings/theme](./get-category.md) - Get theme settings
* [POST /api/cms/settings/reset](./reset.md) - Reset to defaults

## **Frontend Notes**

* Use `updateThemeSettings(updates)` from `@/services/cms/api/settings`
* Listen for `platform-theme-change` event for live updates
* Show color picker for custom colors
* Preview changes before saving
