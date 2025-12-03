# Form Builder API Specification

## Overview

This document provides a complete specification for the Symfony backend API that supports the Form Builder application. The API handles forms, form fields, sections, templates, conditional logic, and all related operations with user-based access control and performance optimization.

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Performance Optimizations](#performance-optimizations)
5. [Security Considerations](#security-considerations)
6. [Error Handling](#error-handling)
7. [Testing Recommendations](#testing-recommendations)

---

## Authentication & Authorization

### Authentication
- **Method**: JWT (JSON Web Tokens)
- **Token Location**: `Authorization: Bearer {token}` header
- **Token Expiry**: Configurable (recommended: 1 hour for access, 7 days for refresh)
- **Refresh Mechanism**: `/api/auth/refresh` endpoint

### Authorization
- **User-Based Access Control**: All forms and templates are owned by users
- **Public Templates**: Templates can be marked as public for sharing
- **Ownership Validation**: Symfony Voters for resource-level access control

---

## Database Schema

### 1. User Entity
Already exists in your Symfony installation. Reference user ID for relationships.

### 2. Form Entity

```sql
CREATE TABLE form (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    settings JSON NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_updated_at (updated_at),

    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Settings JSON Structure**:
```json
{
  "submitButtonText": "Submit",
  "successMessage": "Form submitted successfully!",
  "allowMultipleSubmissions": true,
  "customCss": "..."
}
```

### 3. FormSection Entity

```sql
CREATE TABLE form_section (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    form_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_collapsible BOOLEAN NOT NULL DEFAULT false,
    is_collapsed_by_default BOOLEAN NOT NULL DEFAULT false,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    INDEX idx_form_id (form_id),
    INDEX idx_display_order (display_order),

    FOREIGN KEY (form_id) REFERENCES form(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 4. FormField Entity

```sql
CREATE TABLE form_field (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    form_id BIGINT NOT NULL,
    section_id BIGINT NULL,
    type VARCHAR(50) NOT NULL,
    label VARCHAR(255) NOT NULL,
    placeholder VARCHAR(255) NULL,
    help_text TEXT NULL,
    is_required BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    config JSON NOT NULL,
    validation_rules JSON NULL,
    conditional_logic JSON NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    INDEX idx_form_id (form_id),
    INDEX idx_section_id (section_id),
    INDEX idx_type (type),
    INDEX idx_display_order (display_order),

    FOREIGN KEY (form_id) REFERENCES form(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES form_section(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Config JSON Structure** (varies by field type):
```json
{
  "options": ["Option 1", "Option 2"],
  "allowMultiple": true,
  "maxLength": 500,
  "minValue": 0,
  "maxValue": 100,
  "step": 1,
  "dateFormat": "YYYY-MM-DD",
  "minDate": "2024-01-01",
  "maxDate": "2024-12-31",
  "accept": ".jpg,.png,.pdf",
  "maxFileSize": 5242880,
  "maxFiles": 3
}
```

**Validation Rules JSON Structure**:
```json
{
  "minLength": 5,
  "maxLength": 100,
  "pattern": "^[A-Za-z]+$",
  "customMessage": "Please enter only letters",
  "min": 0,
  "max": 100,
  "email": true,
  "url": true,
  "customValidator": "validatePhoneNumber"
}
```

**Conditional Logic JSON Structure**:
```json
{
  "show": true,
  "when": "all",
  "conditions": [
    {
      "fieldId": "field-123",
      "operator": "equals",
      "value": "Yes"
    }
  ]
}
```

### 5. FormTemplate Entity

```sql
CREATE TABLE form_template (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    is_public BOOLEAN NOT NULL DEFAULT false,
    form_title VARCHAR(255) NOT NULL,
    form_description TEXT NULL,
    template_data JSON NOT NULL,
    usage_count INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    INDEX idx_user_id (user_id),
    INDEX idx_is_public (is_public),
    INDEX idx_created_at (created_at),
    INDEX idx_usage_count (usage_count),

    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Template Data JSON Structure**:
```json
{
  "fields": [
    {
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your name",
      "isRequired": true,
      "config": {},
      "validationRules": {}
    }
  ],
  "sections": [
    {
      "title": "Personal Information",
      "description": "Tell us about yourself",
      "isCollapsible": false,
      "isCollapsedByDefault": false
    }
  ],
  "sectionFieldMapping": [
    {
      "sectionIndex": 0,
      "fieldIndices": [0, 1, 2]
    }
  ]
}
```

### 6. FormSubmission Entity (Future)

```sql
CREATE TABLE form_submission (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    form_id BIGINT NOT NULL,
    user_id BIGINT NULL,
    submission_data JSON NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    submitted_at DATETIME NOT NULL,

    INDEX idx_form_id (form_id),
    INDEX idx_user_id (user_id),
    INDEX idx_submitted_at (submitted_at),

    FOREIGN KEY (form_id) REFERENCES form(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## API Endpoints

### Base URL
```
https://api.yourapp.com/api
```

All endpoints require authentication unless otherwise specified.

---

### Forms

#### 1. List User Forms

**Endpoint**: `GET /forms`

**Query Parameters**:
- `page` (int, default: 1)
- `limit` (int, default: 20, max: 100)
- `sort` (string, default: "created_at", options: "created_at", "updated_at", "title")
- `order` (string, default: "desc", options: "asc", "desc")
- `search` (string, optional): Search in title and description

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "title": "Contact Form",
      "description": "Main website contact form",
      "settings": {
        "submitButtonText": "Send Message",
        "successMessage": "Thank you for contacting us!"
      },
      "fieldCount": 5,
      "sectionCount": 2,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 94,
    "itemsPerPage": 20
  }
}
```

#### 2. Get Single Form

**Endpoint**: `GET /forms/{id}`

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Contact Form",
  "description": "Main website contact form",
  "settings": {
    "submitButtonText": "Send Message",
    "successMessage": "Thank you for contacting us!",
    "allowMultipleSubmissions": true
  },
  "fields": [
    {
      "id": 101,
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your name",
      "helpText": null,
      "isRequired": true,
      "displayOrder": 0,
      "sectionId": 201,
      "config": {
        "maxLength": 100
      },
      "validationRules": {
        "minLength": 2,
        "pattern": "^[A-Za-z\\s]+$",
        "customMessage": "Please enter a valid name"
      },
      "conditionalLogic": null
    }
  ],
  "sections": [
    {
      "id": 201,
      "title": "Personal Information",
      "description": "Tell us about yourself",
      "displayOrder": 0,
      "isCollapsible": false,
      "isCollapsedByDefault": false,
      "fieldIds": [101, 102, 103]
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:45:00Z"
}
```

**Response** (404 Not Found):
```json
{
  "error": "Form not found",
  "code": "FORM_NOT_FOUND"
}
```

**Response** (403 Forbidden):
```json
{
  "error": "Access denied",
  "code": "ACCESS_DENIED"
}
```

#### 3. Create Form

**Endpoint**: `POST /forms`

**Request Body**:
```json
{
  "title": "New Contact Form",
  "description": "Contact form for support inquiries",
  "settings": {
    "submitButtonText": "Submit",
    "successMessage": "Form submitted successfully!",
    "allowMultipleSubmissions": true
  },
  "fields": [
    {
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your name",
      "isRequired": true,
      "displayOrder": 0,
      "config": {},
      "validationRules": {}
    }
  ],
  "sections": [
    {
      "title": "Contact Details",
      "description": "How we can reach you",
      "displayOrder": 0,
      "isCollapsible": false,
      "isCollapsedByDefault": false,
      "fieldIndices": [0, 1]
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "title": "New Contact Form",
  "description": "Contact form for support inquiries",
  "settings": {
    "submitButtonText": "Submit",
    "successMessage": "Form submitted successfully!",
    "allowMultipleSubmissions": true
  },
  "fields": [
    {
      "id": 105,
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your name",
      "isRequired": true,
      "displayOrder": 0,
      "sectionId": 202,
      "config": {},
      "validationRules": {}
    }
  ],
  "sections": [
    {
      "id": 202,
      "title": "Contact Details",
      "description": "How we can reach you",
      "displayOrder": 0,
      "isCollapsible": false,
      "isCollapsedByDefault": false,
      "fieldIds": [105, 106]
    }
  ],
  "createdAt": "2024-01-21T09:15:00Z",
  "updatedAt": "2024-01-21T09:15:00Z"
}
```

**Response** (400 Bad Request):
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "title": ["This value should not be blank"],
    "fields[0].type": ["Invalid field type"]
  }
}
```

#### 4. Update Form

**Endpoint**: `PUT /forms/{id}`

**Request Body**: Same as Create Form

**Response** (200 OK): Same structure as Get Single Form

**Response** (404 Not Found / 403 Forbidden): Same as Get Single Form

#### 5. Delete Form

**Endpoint**: `DELETE /forms/{id}`

**Response** (204 No Content): Empty body

**Response** (404 Not Found / 403 Forbidden): Same as Get Single Form

#### 6. Duplicate Form

**Endpoint**: `POST /forms/{id}/duplicate`

**Request Body**:
```json
{
  "title": "Copy of Contact Form"
}
```

**Response** (201 Created): Same structure as Get Single Form with new ID

---

### Form Fields

#### 7. Add Field to Form

**Endpoint**: `POST /forms/{formId}/fields`

**Request Body**:
```json
{
  "type": "email",
  "label": "Email Address",
  "placeholder": "your@email.com",
  "isRequired": true,
  "displayOrder": 2,
  "sectionId": 201,
  "config": {},
  "validationRules": {
    "email": true
  },
  "conditionalLogic": null
}
```

**Response** (201 Created):
```json
{
  "id": 107,
  "type": "email",
  "label": "Email Address",
  "placeholder": "your@email.com",
  "isRequired": true,
  "displayOrder": 2,
  "sectionId": 201,
  "config": {},
  "validationRules": {
    "email": true
  },
  "conditionalLogic": null
}
```

#### 8. Update Field

**Endpoint**: `PUT /forms/{formId}/fields/{fieldId}`

**Request Body**: Same as Add Field

**Response** (200 OK): Updated field object

#### 9. Delete Field

**Endpoint**: `DELETE /forms/{formId}/fields/{fieldId}`

**Response** (204 No Content): Empty body

#### 10. Reorder Fields

**Endpoint**: `PATCH /forms/{formId}/fields/reorder`

**Request Body**:
```json
{
  "fieldOrders": [
    { "id": 101, "displayOrder": 0 },
    { "id": 102, "displayOrder": 1 },
    { "id": 103, "displayOrder": 2 }
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Fields reordered successfully"
}
```

#### 11. Bulk Update Fields

**Endpoint**: `PATCH /forms/{formId}/fields/bulk-update`

**Request Body**:
```json
{
  "fieldIds": [101, 102, 103],
  "updates": {
    "isRequired": true,
    "sectionId": 202
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "updatedCount": 3,
  "fields": [...]
}
```

#### 12. Bulk Delete Fields

**Endpoint**: `DELETE /forms/{formId}/fields/bulk-delete`

**Request Body**:
```json
{
  "fieldIds": [101, 102, 103]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "deletedCount": 3
}
```

---

### Form Sections

#### 13. Add Section to Form

**Endpoint**: `POST /forms/{formId}/sections`

**Request Body**:
```json
{
  "title": "Payment Information",
  "description": "Enter your payment details",
  "displayOrder": 1,
  "isCollapsible": true,
  "isCollapsedByDefault": false
}
```

**Response** (201 Created):
```json
{
  "id": 203,
  "title": "Payment Information",
  "description": "Enter your payment details",
  "displayOrder": 1,
  "isCollapsible": true,
  "isCollapsedByDefault": false,
  "fieldIds": []
}
```

#### 14. Update Section

**Endpoint**: `PUT /forms/{formId}/sections/{sectionId}`

**Request Body**: Same as Add Section

**Response** (200 OK): Updated section object

#### 15. Delete Section

**Endpoint**: `DELETE /forms/{formId}/sections/{sectionId}`

**Query Parameters**:
- `moveFieldsTo` (int, optional): ID of section to move fields to, or omit to delete fields

**Response** (204 No Content): Empty body

#### 16. Reorder Sections

**Endpoint**: `PATCH /forms/{formId}/sections/reorder`

**Request Body**:
```json
{
  "sectionOrders": [
    { "id": 201, "displayOrder": 0 },
    { "id": 202, "displayOrder": 1 }
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Sections reordered successfully"
}
```

---

### Form Templates

#### 17. List User Templates

**Endpoint**: `GET /templates`

**Query Parameters**:
- `page` (int, default: 1)
- `limit` (int, default: 20, max: 100)
- `includePublic` (bool, default: true): Include public templates from other users
- `sort` (string, default: "updated_at")
- `order` (string, default: "desc")

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "name": "Contact Form Template",
      "description": "Basic contact form with validation",
      "isPublic": false,
      "isOwner": true,
      "formTitle": "Contact Us",
      "formDescription": "Get in touch with our team",
      "fieldCount": 5,
      "sectionCount": 2,
      "usageCount": 12,
      "createdAt": "2024-01-10T08:00:00Z",
      "updatedAt": "2024-01-18T16:30:00Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 47,
    "itemsPerPage": 20
  }
}
```

#### 18. Get Single Template

**Endpoint**: `GET /templates/{id}`

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Contact Form Template",
  "description": "Basic contact form with validation",
  "isPublic": false,
  "isOwner": true,
  "formTitle": "Contact Us",
  "formDescription": "Get in touch with our team",
  "templateData": {
    "fields": [...],
    "sections": [...],
    "sectionFieldMapping": [...]
  },
  "usageCount": 12,
  "createdAt": "2024-01-10T08:00:00Z",
  "updatedAt": "2024-01-18T16:30:00Z"
}
```

**Response** (403 Forbidden): If template is private and user is not owner

#### 19. Create Template

**Endpoint**: `POST /templates`

**Request Body**:
```json
{
  "name": "Registration Form Template",
  "description": "User registration with validation",
  "isPublic": false,
  "formTitle": "Create Account",
  "formDescription": "Sign up for a new account",
  "templateData": {
    "fields": [
      {
        "type": "text",
        "label": "Username",
        "isRequired": true,
        "config": {},
        "validationRules": {}
      }
    ],
    "sections": [
      {
        "title": "Account Details",
        "isCollapsible": false
      }
    ],
    "sectionFieldMapping": [
      {
        "sectionIndex": 0,
        "fieldIndices": [0, 1, 2]
      }
    ]
  }
}
```

**Response** (201 Created): Template object with generated ID

#### 20. Update Template

**Endpoint**: `PUT /templates/{id}`

**Request Body**: Same as Create Template

**Response** (200 OK): Updated template object

**Response** (403 Forbidden): If user is not owner

#### 21. Delete Template

**Endpoint**: `DELETE /templates/{id}`

**Response** (204 No Content): Empty body

**Response** (403 Forbidden): If user is not owner

#### 22. Load Template into Form

**Endpoint**: `POST /templates/{id}/load`

**Response** (200 OK):
```json
{
  "formTitle": "Contact Us",
  "formDescription": "Get in touch with our team",
  "fields": [
    {
      "type": "text",
      "label": "Full Name",
      "isRequired": true,
      "displayOrder": 0,
      "config": {},
      "validationRules": {}
    }
  ],
  "sections": [
    {
      "title": "Personal Information",
      "displayOrder": 0,
      "isCollapsible": false,
      "fieldIndices": [0, 1, 2]
    }
  ]
}
```

**Note**: This endpoint returns the template data structure ready to be used in the form builder. The frontend will generate new IDs.

---

### Import/Export

#### 23. Export Form as JSON

**Endpoint**: `GET /forms/{id}/export`

**Response** (200 OK):
```json
{
  "version": "1.0",
  "exportDate": "2024-01-21T10:00:00Z",
  "form": {
    "title": "Contact Form",
    "description": "Main website contact form",
    "settings": {...},
    "fields": [...],
    "sections": [...]
  }
}
```

**Headers**:
- `Content-Type: application/json`
- `Content-Disposition: attachment; filename="form-contact-form.json"`

#### 24. Import Form from JSON

**Endpoint**: `POST /forms/import`

**Request Body**: Same structure as Export response

**Response** (201 Created): Full form object with generated IDs

**Response** (400 Bad Request):
```json
{
  "error": "Invalid import format",
  "code": "INVALID_IMPORT",
  "details": {
    "version": ["Unsupported version"],
    "form.fields": ["At least one field is required"]
  }
}
```

---

## Performance Optimizations

### 1. Database Indexing

All suggested indexes are included in the schema above:
- **Foreign Keys**: Indexed for JOIN performance
- **User ID**: For ownership queries
- **Display Order**: For sorting fields and sections
- **Created/Updated Dates**: For sorting and filtering
- **Public Flag**: For public template queries
- **Usage Count**: For popular templates sorting

### 2. Query Optimization

**Eager Loading**:
```php
// When fetching a form, eager load related entities
$form = $formRepository->find($id, [
    'fields' => true,
    'sections' => true
]);
```

**Partial Hydration**:
```php
// List endpoint only needs summary data
SELECT f.id, f.title, f.description, f.created_at, f.updated_at,
       COUNT(DISTINCT ff.id) as field_count,
       COUNT(DISTINCT fs.id) as section_count
FROM form f
LEFT JOIN form_field ff ON ff.form_id = f.id
LEFT JOIN form_section fs ON fs.form_id = f.id
WHERE f.user_id = :userId
GROUP BY f.id
```

### 3. Caching Strategy

**Redis/Memcached Integration**:
- Cache full form objects: TTL 1 hour
- Cache user template lists: TTL 30 minutes
- Cache public templates: TTL 6 hours
- Invalidate on update/delete

**Example Cache Keys**:
```
form:{formId}
user:{userId}:forms:list:page:{page}
user:{userId}:templates:list
templates:public:list:page:{page}
```

### 4. Pagination

- Default: 20 items per page
- Maximum: 100 items per page
- Use cursor-based pagination for large datasets (forms with 1000+ fields)

### 5. Batch Operations

Endpoints for bulk operations reduce HTTP overhead:
- Bulk field updates
- Bulk field deletion
- Bulk reordering

### 6. JSON Compression

For large template data and form exports:
- Use gzip compression on responses
- Consider JSON minification for storage

### 7. Database Connection Pooling

Configure Doctrine DBAL with connection pooling for concurrent requests.

### 8. Read Replicas (Production)

Route read-only queries (GET requests) to read replicas to reduce load on primary database.

---

## Security Considerations

### 1. Authorization with Voters

**FormVoter**:
```php
// Checks:
// - VIEW: User owns form OR form is shared
// - EDIT: User owns form
// - DELETE: User owns form
```

**TemplateVoter**:
```php
// Checks:
// - VIEW: User owns template OR template is public
// - EDIT: User owns template
// - DELETE: User owns template
// - LOAD: User owns template OR template is public
```

### 2. Input Validation

**Required Validations**:
- Form title: max 255 chars, not blank
- Field type: must be valid enum value
- Field label: max 255 chars, not blank
- JSON fields: validate structure and max size (1MB)
- Conditional logic: validate field references exist
- Section field mapping: validate indices are in range

**Symfony Validation**:
```php
use Symfony\Component\Validator\Constraints as Assert;

class CreateFormRequest
{
    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    public string $title;

    #[Assert\Valid]
    public array $fields = [];
}
```

### 3. Rate Limiting

**Recommended Limits**:
- Forms endpoints: 100 requests per minute per user
- Template load: 20 requests per minute per user
- Import endpoint: 10 requests per minute per user
- Export endpoint: 30 requests per minute per user

**Implementation**:
```php
use Symfony\Component\RateLimiter\RateLimiterFactory;

#[RateLimit(
    limiter: 'form_api',
    limit: 100,
    interval: '1 minute'
)]
```

### 4. SQL Injection Prevention

- Use Doctrine ORM/DBAL with parameterized queries
- Never concatenate user input into SQL
- Validate all input types

### 5. XSS Prevention

- JSON responses are safe by default
- If rendering user content, sanitize HTML
- Use Content-Security-Policy headers

### 6. CSRF Protection

- Not needed for API (stateless JWT)
- If using session-based auth, implement CSRF tokens

### 7. CORS Configuration

```php
// config/packages/nelmio_cors.yaml
nelmio_cors:
    defaults:
        origin_regex: true
        allow_origin: ['^https://app\.yourapp\.com$']
        allow_methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
        allow_headers: ['Content-Type', 'Authorization']
        max_age: 3600
```

### 8. File Upload Security (Future)

When implementing file field uploads:
- Validate MIME types
- Scan for malware
- Use signed URLs for downloads
- Store outside web root
- Implement file size limits

### 9. Sensitive Data

- Never log request bodies containing user data
- Mask sensitive fields in logs
- Use HTTPS only

### 10. Ownership Validation

**Critical**: Every write operation must verify ownership:
```php
public function updateForm(int $formId, User $user): void
{
    $form = $this->formRepository->find($formId);

    if (!$form || $form->getUserId() !== $user->getId()) {
        throw new AccessDeniedException();
    }

    // Proceed with update
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Human-readable error message",
  "code": "MACHINE_READABLE_CODE",
  "details": {
    "field1": ["Error message 1", "Error message 2"],
    "field2": ["Error message"]
  }
}
```

### Error Codes

**General**:
- `UNAUTHORIZED` (401): Missing or invalid JWT token
- `ACCESS_DENIED` (403): User doesn't have permission
- `NOT_FOUND` (404): Resource doesn't exist
- `VALIDATION_ERROR` (400): Input validation failed
- `RATE_LIMIT_EXCEEDED` (429): Too many requests

**Form-Specific**:
- `FORM_NOT_FOUND` (404)
- `FORM_VALIDATION_FAILED` (400)
- `INVALID_FIELD_TYPE` (400)
- `FIELD_NOT_FOUND` (404)
- `SECTION_NOT_FOUND` (404)
- `CIRCULAR_DEPENDENCY` (400): Conditional logic creates infinite loop
- `INVALID_FIELD_REFERENCE` (400): Conditional logic references non-existent field

**Template-Specific**:
- `TEMPLATE_NOT_FOUND` (404)
- `TEMPLATE_ACCESS_DENIED` (403): Private template, not owner
- `INVALID_TEMPLATE_DATA` (400)

**Import/Export**:
- `INVALID_IMPORT_FORMAT` (400)
- `UNSUPPORTED_VERSION` (400)
- `IMPORT_SIZE_EXCEEDED` (413): File too large

### HTTP Status Codes

- `200 OK`: Successful GET/PUT/PATCH
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Not authorized
- `404 Not Found`: Resource doesn't exist
- `413 Payload Too Large`: Request body too large
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## Testing Recommendations

### 1. Unit Tests

**Test Coverage**:
- Entity validation rules
- Service layer business logic
- Voter authorization logic
- JSON schema validation
- Helper methods

**Example**:
```php
public function testFormTitleValidation(): void
{
    $form = new Form();
    $form->setTitle('');

    $violations = $this->validator->validate($form);
    $this->assertCount(1, $violations);
}
```

### 2. Integration Tests

**Test Coverage**:
- Repository queries
- Database constraints
- Cascade deletes
- Transaction rollbacks

**Example**:
```php
public function testDeleteFormCascadesToFields(): void
{
    $form = $this->createForm();
    $field = $this->createField($form);

    $this->formRepository->delete($form);

    $this->assertNull($this->fieldRepository->find($field->getId()));
}
```

### 3. API Tests (Functional)

**Test Coverage**:
- All endpoints with valid inputs
- All endpoints with invalid inputs
- Authorization checks
- Pagination
- Sorting and filtering
- Error responses

**Example**:
```php
public function testCreateFormRequiresAuthentication(): void
{
    $client = static::createClient();
    $client->request('POST', '/api/forms', [], [], [], json_encode([
        'title' => 'Test Form'
    ]));

    $this->assertResponseStatusCodeSame(401);
}

public function testUserCanOnlyAccessOwnForms(): void
{
    $user1 = $this->createUser();
    $user2 = $this->createUser();
    $form = $this->createForm($user1);

    $client = static::createClient();
    $client->loginUser($user2);
    $client->request('GET', "/api/forms/{$form->getId()}");

    $this->assertResponseStatusCodeSame(403);
}
```

### 4. Performance Tests

**Test Coverage**:
- Query count (N+1 detection)
- Response times under load
- Cache hit rates
- Database connection pooling

**Tools**:
- Symfony Profiler for query analysis
- Apache JMeter or Locust for load testing

### 5. Security Tests

**Test Coverage**:
- SQL injection attempts
- XSS attempts in JSON fields
- CSRF protection
- Rate limiting
- Authorization bypass attempts

---

## Deployment Checklist

### Environment Variables

```env
DATABASE_URL="mysql://user:pass@localhost:3306/formbuilder"
JWT_SECRET_KEY="%kernel.project_dir%/config/jwt/private.pem"
JWT_PUBLIC_KEY="%kernel.project_dir%/config/jwt/public.pem"
JWT_PASSPHRASE="your-passphrase"
REDIS_URL="redis://localhost:6379"
CORS_ALLOW_ORIGIN="^https://app\.yourapp\.com$"
```

### Production Optimizations

1. **Enable OPcache**: PHP opcode caching
2. **Enable APCu**: For Doctrine metadata and query caching
3. **Use Redis**: For session storage and application cache
4. **Enable HTTP/2**: For better performance
5. **Configure CDN**: For static assets
6. **Database Tuning**: MySQL query cache, buffer pool size
7. **Connection Pooling**: pgBouncer for PostgreSQL or ProxySQL for MySQL
8. **Monitoring**: New Relic, DataDog, or Sentry for error tracking

### Database Migrations

Use Doctrine Migrations for version control:
```bash
php bin/console doctrine:migrations:diff
php bin/console doctrine:migrations:migrate
```

### Health Check Endpoint

```php
// GET /api/health
{
  "status": "healthy",
  "database": "connected",
  "cache": "connected",
  "version": "1.0.0"
}
```

---

## API Versioning

### Strategy

Use URL versioning for major changes:
```
/api/v1/forms
/api/v2/forms
```

### Version 1.0 (Current)

All endpoints described in this document.

### Future Versions

- v1.1: Add form submissions endpoint
- v1.2: Add form analytics endpoint
- v2.0: Breaking changes (if needed)

---

## Additional Notes

### Field Types

Supported field types (validate in API):
- `text`
- `email`
- `number`
- `textarea`
- `select`
- `radio`
- `checkbox`
- `date`
- `time`
- `file`
- `url`
- `tel`

### Conditional Logic Operators

Supported operators (validate in API):
- `equals`
- `not_equals`
- `contains`
- `not_contains`
- `greater_than`
- `less_than`
- `is_empty`
- `is_not_empty`

### Template Sharing

Currently only public/private flag. Future enhancements:
- Share with specific users
- Share with teams/organizations
- Template marketplace

### Analytics (Future)

Track template usage:
- Increment `usage_count` when template is loaded
- Track which templates are most popular
- Allow sorting by `usage_count`

---

## Support & Feedback

For questions about this specification:
1. Review the implementation examples in frontend code
2. Check Symfony documentation for best practices
3. Consult with the frontend team about data structure expectations

**Last Updated**: 2024-01-21
**Version**: 1.0
**Author**: Form Builder Development Team
