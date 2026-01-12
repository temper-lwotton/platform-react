# **API Domain Specification Template**

*(Authoritative, conceptual, human-readable)*

**Purpose:** Defines what a backend domain provides, the data contracts it owns, and how it is intended to be used by the product.

**Audience:** Frontend developers, backend developers, product, architects

**This is NOT:**

* A transport-level API reference
* A Swagger replacement

---

## **Section Overview**

| Section | Required | Description |
|---------|----------|-------------|
| API Domain & Description | Yes | Name and high-level purpose |
| Domain Responsibility | Yes | What this domain owns and doesn't own |
| Owned Data Models | Yes | Core entities and their contracts |
| Enumerations | If applicable | Type definitions and allowed values |
| Relationships & Concepts | If applicable | How entities relate and domain concepts |
| Business Rules | If applicable | Domain logic and constraints |
| Authentication & Permissions | Yes | Access control rules |
| API Capabilities Overview | Yes | What the API allows (high-level) |
| Endpoint Groups | Yes | Summary table linking to endpoint docs |
| Domain Events & Side Effects | If applicable | Events emitted/consumed |
| Error Model | Yes | Domain-specific error codes |
| Frontend Usage Notes | Yes | Integration guidance |
| Performance & Constraints | If applicable | Volume, limits, trade-offs |
| Related Routes | Yes | Frontend routes using this domain |
| Related Domains | Yes | Cross-domain dependencies |
| Non-Goals / Explicit Exclusions | Yes | What this domain will never do |
| Stability & Change Policy | Yes | Versioning and deprecation approach |
| Open Questions / Notes | Optional | Unresolved items and future considerations |

---

# **API Domain Specification: `<Domain Name>`**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `<Domain Name>`**

### **Description**

> *Provide a high-level description covering:*
> - *The domain's purpose*
> - *The problems it solves*
> - *Its role within the overall system*

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Bullet list of responsibilities

### **Out of scope:**

* Explicitly list what this domain does *not* handle
* Link to other domains where appropriate (see [OtherDomain](./other.md))

*This section is **authoritative** and prevents scope creep.*

---

## **Owned Data Models**

### **Core Entities**

> *Document each entity with TypeScript interfaces. Note optional vs required fields and highlight privacy-sensitive or derived fields.*

#### **EntityName**

```typescript
interface EntityName {
  id: string;
  createdAt: string;        // ISO 8601
  requiredField: string;
  optionalField?: string;   // Optional - may be null
  derivedField?: number;    // Computed, not stored
}
```

**Notes:**
* Describe purpose of each entity
* These are **logical contracts**, not DB schemas

---

## **Enumerations**

> *Document type definitions, allowed values, and their meanings.*

### **StatusType**

| Value | Description |
|-------|-------------|
| `active` | Currently active |
| `pending` | Awaiting action |
| `archived` | No longer active |

```typescript
type StatusType = 'active' | 'pending' | 'archived';
```

---

## **Relationships & Concepts**

> *Explain how entities relate to each other, domain-specific concepts, directionality, ownership, and lifecycle. This section is narrative, not tabular.*

### **Concept Name**

Explanation of the concept...

### **Entity Relationships**

```
EntityA
├── entityB → EntityB (one-to-many)
├── entityC → EntityC (many-to-one)
└── entityD → EntityD (optional)
```

---

## **Business Rules**

> *Document domain logic, constraints, and behavioral rules.*

1. **Rule Name**: Description of the rule
2. **Another Rule**: Another description
3. **Validation Rule**: Constraints on data

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes / No
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| List items | Any authenticated user |
| View item | Any authenticated user |
| Create item | Specific role or condition |
| Update item | Owner or admin |
| Delete item | Owner or admin |

*Do **not** describe middleware or guards — only rules.*

---

## **API Capabilities Overview**

> *Describe **what the API allows**, not HTTP details. Use action-oriented language.*

The API allows consumers to:

* **List and search** items with filtering
* **Create** new items with validation
* **Update and delete** items (with permissions)
* **Manage relationships** between entities

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [CRUD](../endpoints/domain/README.md) | Core operations | X |
| [Relationships](../endpoints/domain/README.md#relationships) | Manage associations | X |

Full endpoint details in the [Endpoint Reference](../endpoints/domain/README.md).

---

## **Domain Events & Side Effects**

> *Document events emitted and consumed, plus any side effects. Use "None" if not applicable.*

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `entity.created` | New entity created | `{ entityId }` |
| `entity.updated` | Entity modified | `{ entityId, changedFields }` |
| `entity.deleted` | Entity removed | `{ entityId }` |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| `entity.created` | Notification sent to relevant users |
| `entity.deleted` | Related data cleaned up |

---

## **Error Model**

Standard error envelope (see [API Conventions](../_index.md#error-codes)):

```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    errors?: { [field: string]: string[] }  // Validation errors
  }
}
```

### **Domain-Specific Error Codes**

| Code | HTTP | Description |
|------|------|-------------|
| `ENTITY_NOT_FOUND` | 404 | Entity ID does not exist |
| `DUPLICATE_ENTRY` | 409 | Entity already exists |
| `VALIDATION_ERROR` | 422 | Invalid input data |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/entities` | Entity listing |
| `/entities/[id]` | Entity detail |
| `/entities/new` | Create entity |

### **Service Location**

```
src/lib/entities.ts
```

### **Key Functions**

| Function | Purpose |
|----------|---------|
| `getEntities(params)` | List with filters |
| `getEntity(id)` | Get single entity |
| `createEntity(data)` | Create new entity |

### **Pagination**

* Default limit: 20
* Maximum limit: 100
* Uses `page` + `limit` or cursor-based

### **Null Fields**

* List fields that may be null and how to handle them

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| List | Short TTL (1min), invalidate on create |
| Detail | Medium TTL (5min), invalidate on update |

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| List | High |
| Get | Medium |
| Create | Low |

### **Pagination Limits**

* Default page size: 20
* Maximum page size: 100

### **Rate Limiting**

Standard rate limits apply (see [API Conventions](../_index.md#rate-limiting)).

### **Known Trade-offs**

* Document any performance considerations or limitations

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/route` | Description of usage |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [DomainName](./domain.md) | How this domain relates |

---

## **Non-Goals / Explicit Exclusions**

* **Feature X** - Not supported, use [Other Domain](./other.md) instead
* **Feature Y** - Out of scope for this domain
* **Feature Z** - Will never be implemented here

---

## **Stability & Change Policy**

* **Stability:** Stable / Beta / Experimental
* **Breaking changes:** X-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* Future feature 1
* Future feature 2

---

## **Open Questions / Notes**

> *Optional section for unresolved items, technical debt, or future considerations.*

* Question or note 1
* Question or note 2
