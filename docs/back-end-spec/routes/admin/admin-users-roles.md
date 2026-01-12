# **Route Specification: Admin Users Roles**

## **1. Route Path**

**`/admin/users/roles`**

## **2. Description**

User roles and permissions management page allowing admins to configure role-based access control and view the complete permissions matrix.

* Role management
* Permissions matrix
* Role assignment
* Permission categories

## **3. Source File**

```
src/app/(protected)/admin/users/roles/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Managing user roles
* Configuring permissions
* Viewing permissions matrix
* Assigning permissions to roles

### **This route does not:**

* Manage individual users
* Handle user profiles
* Configure system settings

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only (superadmin preferred)
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

* UserRolesManager at top
* PermissionsMatrix below
* Shared admin layout

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Role Manager | Role list and editor |
| Permissions Matrix | Visual permissions grid |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `UserRolesManager` | `@/components/cms/permissions/UserRolesManager` | Role management interface |
| `PermissionsMatrix` | `@/components/cms/permissions/PermissionsMatrix` | Visual permissions grid |

### **UI / Feature Components**

*All handled within child components*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Fetch roles and permissions
3. Display role manager and matrix
4. User edits roles → update permissions
5. User saves → persist → reflect in matrix

## **10. Data Fetching**

*Handled within child components. Typically includes:*
- List of available roles
- Role definitions with permissions
- User role assignments
- Permission categories

## **11. State Management**

### **Local State**

*Handled within child components*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Roles loading skeleton |
| Data loaded | Role manager and matrix |
| Editing role | Role editor shown |
| Saving | Save button loading |
| Permission toggled | Matrix updates |

## **13. User Actions**

### **Role Management**

| Action | Description |
|--------|-------------|
| Create role | Add new custom role with permissions |
| Edit role | Modify role name, description, permissions |
| Delete role | Remove custom role (reassign users first) |
| Clone role | Duplicate role as starting point |

### **Permission Assignment**

| Action | Description |
|--------|-------------|
| Toggle permission | Enable/disable permission for role |
| Bulk enable | Enable all permissions in category |
| Bulk disable | Disable all permissions in category |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Members directory | Click link | `/admin/members` |
| Settings | Click link | `/admin/settings` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Create role | Save new | Create API | Add to list |
| Update role | Save edit | Update API | Update matrix |
| Delete role | Delete button | Delete API | Remove |
| Update permission | Toggle | Update API | Update matrix |

## **14. Infinite Scroll / Pagination**

*Not applicable*

## **15. Error & Empty States**

* **Loading:** Skeleton for both sections
* **Error:** "Failed to load roles and permissions"

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within child components
* **Parallel vs sequential fetching:** Roles and permissions in parallel
* **Known constraints:**
  * Built-in roles cannot be deleted
  * Some permissions are restricted

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through roles and matrix
* **Focus management:** Focus on first element
* **Screen reader expectations:** Role names and permissions announced
* **Landmark roles:** Main roles area

## **18. Storybook & Testing Strategy**

### **Storybook**

* UserRolesManager with various states
* PermissionsMatrix visualization
* Role editor

### **Testing**

* **Unit test focus:** Permission logic
* **Integration test focus:** Role management
* **E2E test focus:** Complete RBAC configuration

## **19. Non-Goals / Out of Scope**

* User management
* Profile editing
* System settings

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/members` | User directory |
| `/admin/members/[id]` | User profile |
| `/admin/settings` | Settings overview |

## **21. Open Questions / Notes**

* Consider adding role hierarchy
* May need permission inheritance
* Consider adding audit log for changes

### **Built-in Roles (Typical)**

- **Administrator**: Full access to all features
- **Editor**: Can create and edit content, manage users
- **Author**: Can create and publish own content
- **Contributor**: Can create content, requires approval
- **Subscriber**: Basic read access, profile management

### **Permission Categories (Typical)**

- Content Management (posts, pages, media)
- User Management (create, edit, delete users)
- Settings (site configuration)
- Moderation (flagged content, reports)
- Analytics (view statistics)
- System (updates, maintenance)

### **UserRolesManager Features**

The UserRolesManager component typically provides:
- List of existing roles
- Create new roles
- Edit role names/descriptions
- Assign permissions to roles
- Delete custom roles
- Clone existing roles

### **PermissionsMatrix Features**

The PermissionsMatrix component typically provides:
- Grid view of all permissions
- Roles as columns, permissions as rows
- Visual checkmarks/toggles
- Permission categories grouping
- Quick enable/disable actions
- Role comparison view
