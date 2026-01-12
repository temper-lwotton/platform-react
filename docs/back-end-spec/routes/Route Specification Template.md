# **Route Specification Template**

**Use this template for all non-trivial application routes/pages.**  
This document describes how a route composes components, fetches data, and behaves across states.

## **1\. Route Path**

**`/route-path`**

*Canonical URL path. Include dynamic segments if applicable.*

## **2\. Description**

A concise summary of:

* The purpose of the route  
* What problem it solves for the user  
* What type of content or interaction it provides

*Should be understandable without reading code.*

## **3\. Source File**

```
src/app/(group)/route/page.tsx
```

*Full path to the route implementation.*

4\. Route Responsibility (Required)

### **This route is responsible for:**

* Bullet list of responsibilities (data aggregation, orchestration, filtering, etc.)

### **This route does not:**

* Explicitly list out-of-scope responsibilities

*This section prevents scope creep and architectural drift.*

## **5\. Authentication & Access Control**

* **Authentication Required:** Yes / No  
* **Allowed Roles:** (e.g. authenticated user, admin)  
* **Permission Rules:**  
  Describe how content access is restricted (e.g. space membership, ownership)

*Do not describe how auth works — only what is required.*

## **6\. URL Parameters & Query Params**

| Name | Type | Required | Description |
| ----- | ----- | ----- | ----- |
|  |  |  |  |

* Default behaviour when params are missing  
* Validation or fallback behaviour

## **7\. Layout & Structure**

### **Layout Overview**

* One-column / two-column / grid / custom  
* High-level layout intent

### **Structural Regions**

| Region | Purpose |
| ----- | ----- |
| Header |  |
| Main Content |  |
| Sidebar |  |

Describe structure, not styling.

## **8\. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
| ----- | ----- | ----- |
|  |  |  |

### **UI / Feature Components**

| Component | Import Path | Purpose |
| ----- | ----- | ----- |
|  |  |  |

*Components listed here must have their own component specs.*

## **9\. Data Flow Overview (Required)**

A step-by-step explanation of how data flows through the route:

1. Resolve authenticated user  
2. Determine accessible resources  
3. Fetch initial data  
4. Initialise pagination or subscriptions  
5. Derive view models  
6. Render UI

*This is the **mental model** for the route.*

## **10\. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
| ----- | ----- | ----- | ----- |
|  |  |  |  |

### **Infinite / Paginated Queries**

| Query Key | Function | Data Type | Page Size |
| ----- | ----- | ----- | ----- |
|  |  |  |  |

*Document query dependencies and enable conditions clearly.*

## **11\. State Management**

### **Local State**

| State Variable | Type | Purpose |
| ----- | ----- | ----- |
|  |  |  |

### **Derived State**

| Variable | Dependencies | Purpose |
| ----- | ----- | ----- |
|  |  |  |

### **Refs (if applicable)**

| Ref | Purpose |
| ----- | ----- |
|  |  |

## **12\. Behaviour Matrix (Required)**

| Condition | UI Behaviour |
| ----- | ----- |
| Loading initial data |  |
| No access / empty state |  |
| Partial data loaded |  |
| Error state |  |
| End of pagination |  |

*This table is authoritative and must be implemented exactly.*

## **13\. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
| ----- | ----- | ----- |
|  |  |  |

### **Navigation Actions**

| Action | Trigger | Destination |
| ----- | ----- | ----- |
|  |  |  |

14\. Infinite Scroll / Pagination (If Applicable)

* Trigger mechanism (e.g. IntersectionObserver)  
* Fetch behaviour  
* Loading indicators  
* End-of-content behaviour  
* Failure behaviour

## **15\. Error & Empty States**

* Loading states  
* Empty data states  
* Permission-based empty states  
* End-of-content messaging

Must align with the Behaviour Matrix.

## **16\. Performance & Constraints**

* Rendering strategy (SSR / CSR / hybrid)  
* Memoisation strategy  
* Parallel vs sequential fetching  
* Known constraints or trade-offs

## **17\. Accessibility Considerations**

* Keyboard navigation across regions  
* Focus management  
* Screen reader expectations  
* Landmark roles if applicable

## **18\. Storybook & Testing Strategy**

### **Storybook**

* Components that must have stories  
* States that must be represented  
* What is *not* expected in Storybook

### **Testing**

* Unit test focus  
* Integration test focus  
* E2E test focus

19\. Non-Goals / Out of Scope

Explicitly list responsibilities that this route does not handle.

## **20\. Related Routes**

| Route | Relationship |
| ----- | ----- |
|  |  |

## **21\. Open Questions / Notes (Optional)**

* Known uncertainties  
* Follow-up decisions  
* Future enhancements