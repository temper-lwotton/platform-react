# **Spaces API Endpoints**

**Domain:** [Spaces](../../domains/spaces.md)

**Base Path:** `/api/spaces`

---

## **Endpoint Index**

### **Spaces**

| Method | Path | Description |
|--------|------|-------------|
| GET | [`/api/spaces`](./list.md) | List spaces with search and filters |
| GET | [`/api/spaces/{id}`](./get.md) | Get single space details |

### **Tags**

| Method | Path | Description |
|--------|------|-------------|
| GET | [`/api/spaces/tags`](./get-tags.md) | Get all available space tags |

---

## **Common Patterns**

### **Tag Filtering**

Filter spaces by tags using array notation:

```
GET /api/spaces?tags[]=1&tags[]=2&matchAllTags=true
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `tags[]` | number[] | Tag IDs to filter by |
| `matchAllTags` | boolean | `true` = AND, `false` = OR (default) |

### **Space Visibility**

* Public spaces (`isPublic: true`) visible to all authenticated users
* Private spaces only visible to members
* Private spaces filtered server-side based on user membership
