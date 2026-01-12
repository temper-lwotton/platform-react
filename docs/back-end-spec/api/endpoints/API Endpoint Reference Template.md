# **API Endpoint Reference Template**

*(Precise, mechanical, implementation-facing)*

**Purpose:** Provides exact request/response details for individual endpoints.

**Audience:** Frontend developers, backend implementers, API consumers

**This document should be:**

* Precise  
* Boring  
* Automatable

## **Endpoint: `<METHOD> /api/path`**

### **Summary**

One-sentence description of what this endpoint does.

## **Authentication**

* Required: Yes / No  
* Scope / Role (if applicable)

## **Permissions**

* Who can call this endpoint  
* Ownership rules  
* Admin-only behaviour

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
| :---: | :---: | :---: | :---: |

### **Query Parameters**

| Name | Type | Required | Description |
| :---: | :---: | :---: | :---: |

### **Headers**

| Header | Required | Description |
| :---: | :---: | :---: |

### **Request Body**

`{`

  `"field": "value"`

`}`

#### **Validation Rules**

* Required fields  
* Allowed values  
* Length / format constraints

## **Response**

### **Success Response**

**Status:** `200 OK` (or `201`, etc.)

`{`

  `"success": true,`

  `"data": {}`

`}`

### **Error Responses**

| Status | Code | When |
| ----- | ----- | ----- |
| 401 | UNAUTHENTICATED | User not logged in |
| 403 | FORBIDDEN | No permission |
| 404 | NOT\_FOUND | Resource missing |
| 422 | VALIDATION\_ERROR | Invalid input |

`{`

  `"success": false,`

  `"error": {`

    `"code": "VALIDATION_ERROR",`

    `"message": "Explanation"`

  `}`

`}`

## **Side Effects**

* Events emitted  
* Notifications triggered  
* Feed updates  
* Cache invalidation

## **Idempotency**

* Is this endpoint idempotent? Yes / No  
* Retry-safe? Yes / No

## **Pagination (If Applicable)**

* Strategy (offset / cursor)  
* Parameters  
* Response metadata

## **Rate Limiting (If Applicable)**

* Limits  
* Reset behaviour

## **Related Endpoints**

* List related endpoints in same workflow

## **Frontend Notes (Optional)**

* How this endpoint is typically consumed  
* UI assumptions  
* Common pitfalls