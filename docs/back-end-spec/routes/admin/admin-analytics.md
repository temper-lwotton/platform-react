# **Route Specification: Admin Analytics**

## **1. Route Path**

**`/admin/analytics`**

## **2. Description**

Comprehensive analytics dashboard showing platform metrics, user engagement, content performance, and trends over time.

* User growth and retention metrics
* Content engagement data
* Space activity statistics
* Time-series visualizations

## **3. Source File**

```
src/app/(protected)/admin/analytics/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying platform-wide analytics
* Showing user growth metrics
* Visualizing content engagement trends
* Providing data export options

### **This route does not:**

* Manage individual users
* Edit content
* Handle settings
* Process member-specific analytics (see admin-members-analytics)

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `from` | `string` | No | Start date for date range |
| `to` | `string` | No | End date for date range |
| `metric` | `string` | No | Specific metric to focus on |

* **Default behaviour:** Show last 30 days
* **Validation:** Invalid dates default to standard range

## **7. Layout & Structure**

### **Layout Overview**

* Full AnalyticsDashboard component rendering
* Charts, metrics, filters, exports

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Date Range Filter | Time period selection |
| Overview Cards | Key metric summaries |
| Charts Area | Trend visualizations |
| Data Table | Detailed breakdowns |
| Export Actions | Data export options |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `AnalyticsDashboard` | `@/components/cms/analytics/AnalyticsDashboard` | Complete analytics interface |

### **UI / Feature Components**

*All handled within AnalyticsDashboard component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Parse date range from URL or use defaults
3. Fetch analytics data for selected period
4. Render charts and metrics
5. User changes filters → refetch data
6. User exports → generate download

## **10. Data Fetching**

*Handled within AnalyticsDashboard component. Typically includes:*
- User growth metrics
- Content engagement data
- Space activity statistics
- Time-series data for trends

## **11. State Management**

### **Local State**

*Handled within AnalyticsDashboard component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Charts show loading skeletons |
| Data loaded | Full analytics display |
| No data for period | "No data available" message |
| Export in progress | Export button shows loading |

## **13. User Actions**

### **UI Interactions**

*Handled by AnalyticsDashboard component:*
- Filter by date range
- Select specific metrics
- View detailed breakdowns
- Export data
- Compare periods

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Back to dashboard | Click back link | `/admin` |
| Member analytics | Click link | `/admin/members/analytics` |
| Moderation analytics | Click link | `/admin/moderation/analytics` |

### **Data Mutations**

*None - read-only analytics*

## **14. Infinite Scroll / Pagination**

*Not applicable - date-range based data*

## **15. Error & Empty States**

* **Loading:** Chart loading skeletons
* **Error:** "Failed to load analytics data"
* **No data:** "No data available for selected period"

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within AnalyticsDashboard
* **Parallel vs sequential fetching:** Multiple metrics in parallel
* **Known constraints:**
  * Large date ranges may be slow
  * Real-time data has slight delay

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through filters and controls
* **Focus management:** Handled by AnalyticsDashboard
* **Screen reader expectations:** Data tables accessible
* **Landmark roles:** Main analytics area

## **18. Storybook & Testing Strategy**

### **Storybook**

* Analytics dashboard with various data states
* Chart components
* Date range picker

### **Testing**

* **Unit test focus:** Chart rendering, data formatting
* **Integration test focus:** Filter interactions
* **E2E test focus:** Analytics exploration flow

## **19. Non-Goals / Out of Scope**

* Individual user analytics
* Real-time streaming data
* Custom dashboard creation
* Scheduled reports

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin` | Admin dashboard |
| `/admin/members/analytics` | Member-specific analytics |
| `/admin/moderation/analytics` | Moderation analytics |

## **21. Open Questions / Notes**

* Consider adding scheduled report emails
* May need custom dashboard builder
* Consider adding comparison features

### **Analytics Features**

The AnalyticsDashboard component typically provides:
- User metrics (registrations, active users, retention)
- Content metrics (posts, discussions, events)
- Engagement metrics (likes, comments, shares)
- Space metrics (activity, membership)
- Time range filtering
- Chart visualizations
- Data export options
