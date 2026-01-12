# **Route Specification: Admin Members Analytics**

## **1. Route Path**

**`/admin/members/analytics`**

## **2. Description**

Member analytics dashboard showing membership trends, engagement metrics, retention data, and member behavior patterns.

* Growth charts
* Retention metrics
* Engagement analysis
* Export capabilities

## **3. Source File**

```
src/app/(protected)/admin/members/analytics/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying membership growth
* Showing engagement metrics
* Analyzing retention patterns
* Providing data export

### **This route does not:**

* Manage individual members
* Send broadcasts
* Configure settings

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `from` | `string` | No | Start date |
| `to` | `string` | No | End date |

* **Default behaviour:** Last 30 days
* **Validation:** Invalid dates use defaults

## **7. Layout & Structure**

### **Layout Overview**

* Full MemberAnalytics component rendering
* Charts, metrics, filters

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Date Filter | Time period selection |
| Metric Cards | Key statistics |
| Charts | Trend visualizations |
| Data Table | Detailed breakdowns |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `MemberAnalytics` | `@/components/cms/members/MemberAnalytics` | Member analytics interface |

### **UI / Feature Components**

*All handled within MemberAnalytics component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Parse date range from URL or defaults
3. Fetch analytics data
4. Display charts and metrics
5. User changes filters → refetch

## **10. Data Fetching**

*Handled within MemberAnalytics component. Typically includes:*
- Membership growth data
- Engagement metrics
- Retention statistics
- Activity patterns

## **11. State Management**

### **Local State**

*Handled within MemberAnalytics component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Charts loading skeleton |
| Data loaded | Full analytics display |
| No data | "No data for period" message |
| Export in progress | Export button loading |

## **13. User Actions**

### **UI Interactions**

*Handled by MemberAnalytics component:*
- Filter by date range
- Select metrics to view
- Export reports
- Compare periods
- Drill down into data

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Back to members | Click back | `/admin/members` |
| Platform analytics | Click link | `/admin/analytics` |

### **Data Mutations**

*None - read-only analytics*

## **14. Infinite Scroll / Pagination**

*Not applicable - date-range based data*

## **15. Error & Empty States**

* **Loading:** Charts skeleton
* **Error:** "Failed to load analytics"
* **No data:** "No data available for selected period"

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within MemberAnalytics
* **Parallel vs sequential fetching:** Multiple metrics in parallel
* **Known constraints:**
  * Large date ranges may be slow
  * Real-time data has slight delay

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through controls
* **Focus management:** Handled by MemberAnalytics
* **Screen reader expectations:** Data tables accessible
* **Landmark roles:** Main analytics area

## **18. Storybook & Testing Strategy**

### **Storybook**

* MemberAnalytics with various data
* Different date ranges
* Export states

### **Testing**

* **Unit test focus:** Data formatting
* **Integration test focus:** Filter interactions
* **E2E test focus:** Analytics exploration

## **19. Non-Goals / Out of Scope**

* Member management
* Segment creation
* Broadcast sending

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/members` | Members directory |
| `/admin/analytics` | Platform analytics |

## **21. Open Questions / Notes**

* Consider adding scheduled reports
* May need custom date ranges
* Consider adding cohort comparison

### **Metrics Typically Shown**

- New members over time
- Active member rate
- Retention by cohort
- Engagement distribution
- Top performing segments
- Churn rate

### **Member Analytics Features**

The MemberAnalytics component typically provides:
- Growth charts (new registrations, active users)
- Retention metrics (cohort analysis)
- Engagement scores
- Activity heatmaps
- Churn analysis
- Top contributors
- Export capabilities
