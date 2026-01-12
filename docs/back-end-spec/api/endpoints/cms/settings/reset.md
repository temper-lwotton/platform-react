# **Endpoint: `POST /api/cms/settings/reset`**

### **Summary**

Resets all settings to factory defaults.

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

### **Request Body**

*None*

---

## **Response**

### **Success Response**

**Status:** `200 OK`

Returns all settings with default values:

```json
{
  "success": true,
  "data": {
    "general": {
      "siteName": "My CMS Site",
      "siteDescription": "Just another CMS site",
      "timezone": "America/New_York"
    },
    "media": {
      "maxUploadSize": 10,
      "enableAIAnalysis": true
    },
    "theme": {
      "platformTheme": "innovation-spectrum",
      "defaultColorMode": "light"
    }
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `INSUFFICIENT_ROLE` | Not an Admin |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| All settings reset | Replaces all custom settings |
| Browser events | Theme change event dispatched |

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/cms/settings](./get-all.md) - Verify reset

## **Frontend Notes**

* Use `resetSettings()` from `@/services/cms/api/settings`
* Requires confirmation dialog - destructive action
* Refresh UI after reset
