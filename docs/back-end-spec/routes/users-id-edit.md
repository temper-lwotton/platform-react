# **Route Specification: User Edit**

## **1. Route Path**

**`/users/[id]/edit`**

## **2. Description**

Profile editing page for updating personal information.

* Only accessible for the user's own profile
* Supports editing name, email, bio, location, website, avatar
* Redirects unauthorized users to view-only profile

## **3. Source File**

```
src/app/(protected)/users/[id]/edit/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Rendering profile edit form
* Validating user has permission to edit
* Handling form submission
* Redirecting unauthorized users

### **This route does not:**

* Edit other users' profiles
* Manage account settings (password, etc.)
* Handle avatar uploads (URL only)
* Manage user permissions

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Profile owner only
* **Permission Rules:** Cannot edit other users' profiles (redirects to view)

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | The unique identifier of the user |

* **Default behaviour:** N/A - id is required
* **Validation:** Non-owner redirected to view profile

## **7. Layout & Structure**

### **Layout Overview**

* Single column form layout (max-width 800px)
* Back link, title, form, action buttons

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Back Link | Return to profile |
| Title | "Edit Profile" header |
| Form | Profile fields |
| Actions | Save and Cancel buttons |

## **8. Components Used**

### **Layout Components**

*None - form layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Button` | `@/components/ui/primitives/Button` | Form buttons |
| `Input` | `@/components/ui/primitives/Input` | Text inputs |
| `Icon` | `@/components/ui/Icon` | Back arrow icon |
| `Link` | `next/link` | Navigation |

## **9. Data Flow Overview**

1. Verify current user matches profile ID
2. Redirect unauthorized users to view profile
3. Fetch existing user data
4. Populate form with current values
5. User edits form fields
6. On submit: validate → update → redirect to profile

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['user', id]` | `getUser(id)` | `User` | `!!id && currentUserId === id` |

### **Mutations**

| Mutation | Function | On Success |
|----------|----------|------------|
| `updateMutation` | `updateUser(id, data)` | Invalidate user, redirect to profile |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `formData.fullName` | `string` | User's full name |
| `formData.email` | `string` | Email address |
| `formData.bio` | `string` | Biography text |
| `formData.location` | `string` | Location (city, country) |
| `formData.website` | `string` | Website URL |
| `formData.avatar` | `string` | Avatar image URL |

### **Form Initialization**

Form data is populated from user query when data loads.

### **Derived State**

*None*

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | "Loading..." |
| Access denied | "Access denied" message |
| Form loaded | Form fields populated |
| Saving | Button shows "Saving..." |
| Save success | Redirect to `/users/[id]` |
| Save error | "Error updating profile" message |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Edit full name | Type in field | Update `formData.fullName` |
| Edit email | Type in field | Update `formData.email` |
| Edit bio | Type in textarea | Update `formData.bio` |
| Edit location | Type in field | Update `formData.location` |
| Edit website | Type in field | Update `formData.website` |
| Edit avatar URL | Type in field | Update `formData.avatar` |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Back to profile | Click back button | `/users/[id]` |
| Cancel | Click cancel button | `/users/[id]` |
| View updated | Successful save | `/users/[id]` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Save changes | Form submit | `updateUser(id, formData)` | Redirect to profile |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Loading:** "Loading..."
* **Access denied:** "Access denied. You can only edit your own profile."
* **Save error:** "Error updating profile. Please try again."
* **Saving:** Button shows "Saving..."

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** None needed
* **Parallel vs sequential fetching:** Single user query
* **Known constraints:**
  * Avatar is URL only (no file upload)
  * No real-time validation

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through form fields
* **Focus management:** Focus on first field on load
* **Screen reader expectations:** Labels associated with inputs
* **Landmark roles:** Form with proper structure

## **18. Storybook & Testing Strategy**

### **Storybook**

* Form in various states
* Field validation states

### **Testing**

* **Unit test focus:** Access control redirect
* **Integration test focus:** Form submission flow
* **E2E test focus:** Complete profile editing journey

## **19. Non-Goals / Out of Scope**

* Editing other users
* Password/account management
* Avatar file upload
* Email verification
* Profile field validation

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/users/[id]` | User profile view |

## **21. Open Questions / Notes**

* Consider adding avatar file upload
* May need email verification
* Consider adding profile field validation

### **Access Control**

```typescript
useEffect(() => {
  if (currentUserId && currentUserId !== id) {
    router.push(`/users/${id}`);
  }
}, [currentUserId, id, router]);
```

### **Form Fields**

| Field | Type | Label | Placeholder |
|-------|------|-------|-------------|
| `fullName` | `text` | Full Name | "Enter your full name" |
| `email` | `email` | Email | "your@email.com" |
| `bio` | `textarea` | Bio | "Tell us about yourself..." |
| `location` | `text` | Location | "City, Country" |
| `website` | `url` | Website | "https://yourwebsite.com" |
| `avatar` | `url` | Avatar URL | "https://example.com/avatar.jpg" |
