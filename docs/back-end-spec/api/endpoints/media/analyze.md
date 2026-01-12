# **Endpoint: `POST /api/media/{id}/analyze`**

### **Summary**

Re-runs AI analysis on an existing media item. Useful if analysis was incomplete or to get updated results.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Media owner or space admin

## **Permissions**

* User must be the uploader, OR
* User must be admin of the media's space

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | number | Yes | Media item ID |

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
    "aiAnalysis": {
      "tags": [
        { "id": "t1", "label": "people", "confidence": 0.98, "category": "object" },
        { "id": "t2", "label": "office", "confidence": 0.85, "category": "scene" },
        { "id": "t3", "label": "meeting", "confidence": 0.76, "category": "scene" }
      ],
      "suggestedAltTexts": [
        "Group of professionals in an office meeting",
        "Team gathered around conference table"
      ],
      "dominantColors": ["#2C3E50", "#ECF0F1", "#3498DB"],
      "peopleCount": 8,
      "faces": [
        { "x": 100, "y": 50, "width": 80, "height": 80, "emotion": "neutral" }
      ],
      "moderationFlags": {
        "isAdult": false,
        "isViolent": false,
        "confidence": 0.99
      }
    }
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_OWNER` | Not uploader or space admin |
| 404 | `MEDIA_NOT_FOUND` | Media does not exist |
| 500 | `ANALYSIS_FAILED` | AI analysis service error |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| AI analysis updated | Previous analysis replaced |
| `media.analyzed` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** No (may produce different results)
* **Retry-safe:** Yes (safe to retry on failure)

---

## **Related Endpoints**

* [GET /api/media/{id}](./get.md) - View updated analysis
* [POST /api/media/generate-alt-text](./generate-alt-text.md) - Alt text only

## **Frontend Notes**

* Use `reanalyzeImage(id)` from `@/lib/media-api`
* Show loading state during analysis
* Analysis may take a few seconds
* Useful when initial analysis seems incorrect
