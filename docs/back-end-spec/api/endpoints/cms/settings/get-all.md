# **Endpoint: `GET /api/cms/settings`**

### **Summary**

Retrieves all CMS settings across all categories.

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

```json
{
  "success": true,
  "data": {
    "general": {
      "siteName": "My CMS Site",
      "siteDescription": "Just another CMS site",
      "siteUrl": "https://example.com",
      "adminEmail": "admin@example.com",
      "timezone": "America/New_York",
      "dateFormat": "YYYY-MM-DD",
      "timeFormat": "HH:mm:ss",
      "language": "en",
      "weekStartsOn": 0
    },
    "media": {
      "maxUploadSize": 10,
      "allowedFileTypes": ["image/jpeg", "image/png", "image/gif"],
      "enableAIAnalysis": true,
      "autoGenerateAltText": true,
      "autoOptimizeImages": true,
      "imageSizes": [
        { "name": "thumbnail", "width": 150, "height": 150, "crop": true }
      ],
      "defaultImageQuality": 85
    },
    "reading": {
      "postsPerPage": 10,
      "feedPostsPerPage": 10,
      "feedShowSummary": true,
      "searchEngineVisibility": true,
      "defaultPostFormat": "standard"
    },
    "writing": {
      "defaultPostStatus": "draft",
      "defaultCommentStatus": "open",
      "enableAutosave": true,
      "autosaveInterval": 60,
      "enableRevisions": true,
      "maxRevisions": 10
    },
    "discussion": {
      "enableComments": true,
      "requireNameEmail": true,
      "enableThreadedComments": true,
      "threadedCommentsDepth": 5
    },
    "permalinks": {
      "structure": "post-name",
      "categoryBase": "category",
      "tagBase": "tag"
    },
    "theme": {
      "platformTheme": "innovation-spectrum",
      "defaultColorMode": "light",
      "allowUserOverride": true,
      "primaryColor": "#8b5cf6",
      "infoColor": "#3b82f6",
      "ctaColor": "#f97316",
      "accentColor": "#C0F23C"
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

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/cms/settings/{category}](./get-category.md) - Get specific category
* [POST /api/cms/settings/reset](./reset.md) - Reset to defaults

## **Frontend Notes**

* Use `getSettings()` from `@/services/cms/api/settings`
* Cache settings client-side
* Refresh on settings update
