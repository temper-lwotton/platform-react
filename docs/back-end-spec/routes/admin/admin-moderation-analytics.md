# **Route Specification: Admin Moderation Analytics**

## **1. Route Path**

**`/admin/moderation/analytics`**

## **2. Description**

Moderation analytics dashboard showing moderation volume, response times, decision patterns, and moderator performance metrics.

* Volume charts
* Response time metrics
* Decision breakdown
* Moderator performance

## **3. Source File**

```
src/app/(protected)/admin/moderation/analytics/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying moderation volume trends
* Showing response time metrics
* Analyzing decision patterns
* Viewing moderator performance

### **This route does not:**

* Process moderation queue
* Handle appeals
* Configure rules

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

* Full ModerationAnalytics component rendering
* Charts, metrics, breakdowns

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Date Filter | Time period selection |
| Metric Cards | Key statistics |
| Charts | Trend visualizations |
| Moderator Table | Performance by moderator |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `ModerationAnalytics` | `@/components/cms/moderation/ModerationAnalytics` | Moderation analytics interface |

### **UI / Feature Components**

*All handled within ModerationAnalytics component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Parse date range from URL or defaults
3. Fetch analytics data
4. Display charts and metrics
5. User changes filters → refetch

## **10. Data Fetching**

*Handled within ModerationAnalytics component. Typically includes:*
- Moderation action statistics
- Response time metrics
- Volume trends
- Moderator activity

## **11. State Management**

### **Local State**

*Handled within ModerationAnalytics component*

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

*Handled by ModerationAnalytics component:*
- Filter by date range
- View specific metrics
- Compare periods
- Export reports
- Drill down by moderator

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Back to moderation | Click back | `/admin/moderation` |
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
* **Memoisation strategy:** Handled within ModerationAnalytics
* **Parallel vs sequential fetching:** Multiple metrics in parallel
* **Known constraints:**
  * Large date ranges may be slow
  * Real-time data has slight delay

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through controls
* **Focus management:** Handled by ModerationAnalytics
* **Screen reader expectations:** Data tables accessible
* **Landmark roles:** Main analytics area

## **18. Storybook & Testing Strategy**

### **Storybook**

* ModerationAnalytics with various data
* Different date ranges
* Export states

### **Testing**

* **Unit test focus:** Data formatting
* **Integration test focus:** Filter interactions
* **E2E test focus:** Analytics exploration

## **19. Non-Goals / Out of Scope**

* Queue processing
* Appeals handling
* Rule configuration

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/moderation` | Moderation queue |
| `/admin/analytics` | Platform analytics |

## **21. Open Questions / Notes**

* Consider adding moderator leaderboards
* May need scheduled reports
* Consider adding SLA tracking

### **Metrics Typically Shown**

- Reports received over time
- Average response time
- Resolution rate
- Appeals rate
- Auto-moderation effectiveness
- Top flagged content types
- Moderator workload distribution

### **Moderation Analytics Features**

The ModerationAnalytics component typically provides:
- Volume charts (reports, actions taken)
- Response time metrics
- Decision breakdown (approved/rejected)
- Moderator performance
- Rule effectiveness
- Trend analysis
