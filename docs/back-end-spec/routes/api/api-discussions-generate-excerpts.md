# **Route Specification: API Discussions Generate Excerpts**

## **1. Route Path**

**`POST /api/discussions/generate-excerpts`**

## **2. Description**

AI-powered excerpt generation endpoint using OpenAI GPT-3.5. Generates three different excerpt options for a discussion post, each with a different style or focus.

* Multiple excerpt options
* Style variation
* Length validation
* Quality assurance

## **3. Source File**

```
src/app/api/discussions/generate-excerpts/route.ts
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Generating excerpt options
* Providing style variety
* Validating excerpt quality
* Ensuring length requirements

### **This route does not:**

* Create discussions
* Save excerpts
* Modify content
* Analyze engagement

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** User must be authenticated

## **6. URL Parameters & Query Params**

*None*

## **7. Request Structure**

### **Method**

`POST`

### **Headers**

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | `application/json` | Yes |

### **Request Body**

```typescript
interface GenerateExcerptsRequest {
    title: string;   // Discussion post title
    content: string; // Full post content (minimum 50 characters)
}
```

### **Example Request**

```json
{
    "title": "The Future of Remote Work",
    "content": "As we navigate the post-pandemic landscape, remote work has evolved from a temporary solution to a permanent fixture in many organizations. This shift brings both opportunities and challenges that we need to address thoughtfully..."
}
```

## **8. Response Structure**

### **Success Response (200 OK)**

```typescript
interface GenerateExcerptsResponse {
    excerpts: string[]; // Array of 3 excerpt options (50-150 chars each)
}
```

### **Example Response**

```json
{
    "excerpts": [
        "Explore how remote work is reshaping organizational culture and what it means for the future of employment.",
        "From pandemic necessity to permanent practice: understanding the evolution of distributed teams.",
        "Navigating opportunities and challenges in the new era of flexible work arrangements."
    ]
}
```

### **Error Responses**

| Status | Description | Body |
|--------|-------------|------|
| 400 | Invalid request body | `{ "error": "Invalid request body" }` |
| 400 | Missing required fields | `{ "error": "Title and content are required" }` |
| 400 | Content too short | `{ "error": "Content is too short to generate excerpts" }` |
| 500 | OpenAI API key not configured | `{ "error": "OpenAI API key not configured" }` |
| 500 | Invalid API key | `{ "error": "Invalid OpenAI API key" }` |
| 500 | Generation failed | `{ "error": "Failed to generate excerpts" }` |
| 500 | Invalid AI response format | `{ "error": "Failed to generate valid excerpts" }` |
| 500 | Excerpt length validation failed | `{ "error": "Generated excerpts did not meet length requirements" }` |

## **9. Data Flow Overview**

1. Receive POST request with title and content
2. Validate request body structure
3. Check content meets minimum length
4. Call OpenAI GPT-3.5 for generation
5. Parse and validate AI response
6. Verify excerpt length requirements
7. Return excerpt options to client

## **10. AI Model Configuration**

### **Model Details**

| Setting | Value |
|---------|-------|
| Model | `gpt-3.5-turbo` |
| Temperature | 0.7 |
| Max tokens | 300 |

## **11. Content Requirements**

### **Input Validation**

| Requirement | Value |
|-------------|-------|
| Minimum content length | 50 characters |
| Recommended content length | 100+ characters |

### **Output Validation**

| Requirement | Value |
|-------------|-------|
| Excerpt count | Exactly 3 (or at least 2 for partial success) |
| Excerpt length | 30-200 characters each |

## **12. Behaviour Matrix**

| Condition | Response |
|-----------|----------|
| Valid request + AI success | 200 with 3 excerpts |
| Content too short | 400 error |
| Missing fields | 400 error |
| No API key | 500 error |
| Invalid API key | 500 error |
| AI returns invalid format | 500 error |
| Excerpts wrong length | 500 error |

## **13. Excerpt Characteristics**

Each generated excerpt is:

* **Concise and clear** (50-150 characters)
* **Engaging and enticing** to read
* **Different in style** or focus from others
* **Suitable as preview/summary** for the content

## **14. Environment Variables**

| Variable | Purpose | Required |
|----------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API authentication | Yes |

## **15. Performance & Constraints**

* **Rendering strategy:** Server-side API route
* **Caching:** None (unique per content)
* **Known constraints:**
  * OpenAI API latency (1-2 seconds)
  * Rate limits on OpenAI API
  * Content length affects quality

## **16. Response Processing**

### **AI Response Handling**

* Strips markdown code fences from AI response
* Parses JSON array of strings
* Validates array length and item lengths

## **17. Testing Strategy**

### **Unit Tests**

* Request validation
* Content length checking
* Response validation

### **Integration Tests**

* OpenAI API integration
* Error handling

### **E2E Tests**

* Complete generation flow

## **18. Non-Goals / Out of Scope**

* Excerpt storage
* Content modification
* Style customization
* User preferences

## **19. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/spaces/[id]/discussions` | Discussions listing |
| `/posts/new` | Create post |

## **20. Open Questions / Notes**

* Consider adding style preference parameter
* May need retry logic for AI failures
* Consider caching for identical content
