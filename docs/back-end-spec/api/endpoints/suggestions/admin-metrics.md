# **Endpoint: `GET /api/admin/suggestions/metrics`**

### **Summary**

Retrieves suggestion system analytics and performance metrics for administrators.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Admin only

## **Permissions**

* Must have admin role

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `startDate` | string | No | Metrics start date (ISO format) |
| `endDate` | string | No | Metrics end date (ISO format) |
| `groupBy` | string | No | Grouping: day, week, month (default: day) |

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
    "totalGenerated": 15420,
    "totalDisplayed": 12890,
    "totalClicked": 3240,
    "totalConverted": 890,
    "totalDismissed": 1560,
    "clickThroughRate": 0.251,
    "conversionRate": 0.069,
    "dismissRate": 0.121,
    "byType": {
      "user": {
        "generated": 3500,
        "displayed": 2900,
        "clicked": 980,
        "converted": 245,
        "dismissed": 320,
        "ctr": 0.338
      },
      "space": {
        "generated": 2800,
        "displayed": 2400,
        "clicked": 756,
        "converted": 189,
        "dismissed": 280,
        "ctr": 0.315
      },
      "event": {
        "generated": 2200,
        "displayed": 1900,
        "clicked": 532,
        "converted": 156,
        "dismissed": 210,
        "ctr": 0.280
      },
      "discussion": {
        "generated": 3100,
        "displayed": 2700,
        "clicked": 540,
        "converted": 135,
        "dismissed": 350,
        "ctr": 0.200
      },
      "resource": {
        "generated": 2100,
        "displayed": 1800,
        "clicked": 288,
        "converted": 108,
        "dismissed": 250,
        "ctr": 0.160
      },
      "showcase": {
        "generated": 1720,
        "displayed": 1190,
        "clicked": 144,
        "converted": 57,
        "dismissed": 150,
        "ctr": 0.121
      }
    },
    "topReasons": [
      {
        "category": "shared_interests",
        "count": 4200,
        "ctr": 0.31,
        "conversionRate": 0.08
      },
      {
        "category": "network_activity",
        "count": 3100,
        "ctr": 0.28,
        "conversionRate": 0.07
      },
      {
        "category": "similar_behavior",
        "count": 2800,
        "ctr": 0.26,
        "conversionRate": 0.065
      },
      {
        "category": "topic_match",
        "count": 2500,
        "ctr": 0.24,
        "conversionRate": 0.06
      },
      {
        "category": "community_match",
        "count": 1820,
        "ctr": 0.22,
        "conversionRate": 0.055
      }
    ],
    "timeSeries": [
      {
        "date": "2024-01-15",
        "generated": 2100,
        "displayed": 1800,
        "clicked": 450,
        "converted": 120
      },
      {
        "date": "2024-01-16",
        "generated": 2250,
        "displayed": 1950,
        "clicked": 490,
        "converted": 135
      },
      {
        "date": "2024-01-17",
        "generated": 2180,
        "displayed": 1880,
        "clicked": 470,
        "converted": 128
      }
    ]
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_DATE_RANGE` | Invalid date parameters |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `FORBIDDEN` | Not an admin |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [PUT /api/admin/suggestions/config](./admin-config.md) - Configure suggestion weights

## **Frontend Notes**

* Display in admin dashboard with charts
* Show trends over time using time series data
* Highlight best and worst performing types
* Compare reason categories for optimization
* Export data for reporting
