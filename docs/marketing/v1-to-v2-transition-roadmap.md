# V1 to V2 Transition Roadmap

## Executive Summary

This document outlines the feature roadmap for transitioning the Spaces platform from V1 to V2. The transition represents a fundamental shift from a space-centric to a user-centric experience, along with the introduction of AI capabilities, advanced admin tools, and modern content management.

---

## Current State (V1) Summary

| Area | V1 Status |
|------|-----------|
| **User Experience** | Space-siloed, no central feed |
| **Content Creation** | Old editor, space-bound only |
| **Spaces** | Admin-created only, articles/discussions/downloads/videos |
| **Profiles** | Basic (bio, tags, photo) |
| **Messaging** | Rudimentary private messaging |
| **Discovery** | Basic search for spaces/users |
| **AI** | None |
| **Admin Tools** | Minimal |

---

## V2 Vision Summary

| Area | V2 Target |
|------|-----------|
| **User Experience** | User-centric, centralized feed |
| **Content Creation** | Global publish button, modern editor (Lexical) |
| **Spaces** | Enhanced with channels, better structure |
| **Profiles** | Rich profiles with activity, analytics |
| **Messaging** | Full messaging with mentions |
| **Discovery** | AI-powered suggestions, matching |
| **AI** | Throughout (content, moderation, matching) |
| **Admin Tools** | Full CMS, broadcasts, moderation, workflows |

---

## Transition Phases

### Phase 0: Technical Foundation
*Invisible to users - enables everything else*

| Work Item | Purpose | Dependencies |
|-----------|---------|--------------|
| New permissions/roles system | Foundation for all features | None |
| API restructuring | Support user-centric data fetching | None |
| Lexical editor integration | Replace old editor | None |
| Notification infrastructure | Support real-time updates | None |
| Analytics event tracking | Enable AI and insights later | None |

**Why first:** These are the pipes and wiring. Nothing visible changes, but everything after depends on this.

---

### Phase 1: The Big Shift - User-Centric Core
*This is the paradigm change users will feel*

| Feature | What Changes | Migration Notes |
|---------|--------------|-----------------|
| **Centralized Feed** | Users see content from ALL their spaces in one place | Biggest UX shift - needs onboarding |
| **New Navigation** | Home/Feed becomes primary, spaces become secondary | Users need to learn new mental model |
| **Global Publish Button** | Create content from anywhere, choose destination | Replaces "go to space then create" flow |
| **New Editor (Lexical)** | Modern block-based editing | Migrate existing content or render legacy |
| **Enhanced Notifications** | Centralized notification center | Upgrade from basic alerts |

**User Communication Required:**
- Onboarding tour for existing users
- "What's new in V2" messaging
- Help documentation updates

**Risk Mitigation:** Users accustomed to space-first navigation may be confused. Consider optional "classic view" toggle initially.

---

### Phase 2: Enhanced Profiles & Discovery
*Building on user-centric foundation*

| Feature | What Changes | V1 to V2 Delta |
|---------|--------------|---------------|
| **Rich User Profiles** | Activity feed, content showcase, stats | From: bio + tags + photo |
| **Profile Editing** | Better UX for profile management | Modernized UI |
| **User Directory** | Browse/filter all members | New capability |
| **Improved Search** | Unified search across content/users/spaces | From: basic search |
| **Suggestions (non-AI)** | "Popular in your spaces" recommendations | New capability |

**Why here:** Now that users have a central home, they need better ways to discover and connect.

---

### Phase 3: Content & Editor Enhancements
*Requires: Lexical editor in place*

| Feature | What It Adds | Notes |
|---------|--------------|-------|
| **Post Types** | Articles, Updates, Discussions as distinct types | Structure the content model |
| **Categories & Tags** | Better organization | Build on v1 tags concept |
| **Featured Images** | Proper media handling | New for articles |
| **SEO Panel** | Meta descriptions, previews | New capability |
| **Content Drafts** | Auto-save, draft management | Improvement over v1 |
| **Mentions** | @mention users in content | New capability |

**Migration Note:** Existing v1 content (articles, discussions, downloads, videos) needs to map to new content types.

---

### Phase 4: Messaging Upgrade
*Requires: Phase 1 notifications infrastructure*

| Feature | What Changes | V1 to V2 Delta |
|---------|--------------|---------------|
| **Conversation Threads** | Proper threaded messaging | From: rudimentary DMs |
| **Group Conversations** | Multi-person chats | New capability |
| **Mentions in Messages** | @mention with hover cards | New capability |
| **Message Search** | Search message history | New capability |
| **Read Receipts** | Seen indicators | New capability |

**Why here:** Messaging is user-facing and benefits from the new UI foundation.

---

### Phase 5: Admin Foundation - CMS Core
*First admin capabilities beyond basic*

| Feature | What It Adds | Notes |
|---------|--------------|-------|
| **Admin Dashboard** | Central admin home with stats | New - v1 has minimal admin |
| **Content Dashboard** | View/manage all content | New capability |
| **Settings Management** | General, reading, writing, media settings | Structured admin settings |
| **Media Library** | Centralized media management | New capability |
| **Basic Analytics** | Content performance, member counts | New capability |

**Why here:** Admins need tools to manage the growing platform. This is foundational for later admin features.

---

### Phase 6: Spaces Enhancement
*Upgrade the v1 spaces model*

| Feature | What Changes | V1 to V2 Delta |
|---------|--------------|---------------|
| **Space Creation Wizard** | Guided setup with templates | From: admin-only creation |
| **User-Created Spaces** | Members can create spaces (if permitted) | New capability |
| **Space Branding** | Icons, covers, colors | Enhanced from v1 |
| **Privacy Controls** | Public/private/unlisted with join settings | More granular than v1 |
| **Channels** | Organize content within spaces | New structure |
| **Space Events** | Events tied to spaces | New capability |

**Migration:** Existing v1 spaces continue working, new features are additive.

---

### Phase 7: Member Management
*Admin tools for managing community*

| Feature | What It Adds | Notes |
|---------|--------------|-------|
| **Member Directory (Admin)** | View all members with filters | New admin tool |
| **Lifecycle Stages** | Auto-categorize: new, active, at-risk, etc. | New capability |
| **Member Segments** | Create rule-based groups | Foundation for broadcasts |
| **Bulk Actions** | Mass email, role changes, exports | New capability |
| **Member Profiles (Admin View)** | See member activity, history | Enhanced visibility |

**Why here:** Before broadcasts and advanced features, admins need to understand and organize their members.

---

### Phase 8: Calendar & Scheduling
*Requires: Content system, events*

| Feature | What It Adds | Notes |
|---------|--------------|-------|
| **Event Calendar** | Visual calendar for events | New UI |
| **Content Calendar** | Schedule content publishing | New admin tool |
| **Scheduled Publishing** | Set future publish dates | New capability |
| **Task Management** | Personal tasks for users | New capability |

**Why here:** Scheduling requires content and events to exist. Enables later content versioning.

---

### Phase 9: Broadcasts & Communications
*Requires: Member segments (Phase 7)*

| Feature | What It Adds | Notes |
|---------|--------------|-------|
| **Email Editor** | Block-based email builder | New capability |
| **Broadcast Dashboard** | View campaign performance | New capability |
| **Campaign Composer** | Create targeted campaigns | New capability |
| **Segment Targeting** | Send to specific member groups | Requires segments |
| **Scheduled Sends** | Time broadcasts | New capability |

**Why here:** Broadcasts are powerful but need segments to be meaningful.

---

### Phase 10: Form Builder
*Relatively independent*

| Feature | What It Adds | Notes |
|---------|--------------|-------|
| **Drag-Drop Form Builder** | Create custom forms | New capability |
| **Field Types** | Comprehensive input options | New capability |
| **Conditional Logic** | Dynamic form behavior | New capability |
| **Form Templates** | Reusable form designs | New capability |

**Why here:** Forms are useful across many scenarios but not blocking other features.

---

### Phase 11: Moderation Suite
*Requires: Content exists, member management*

| Feature | What It Adds | Notes |
|---------|--------------|-------|
| **Moderation Queue** | Centralized flagged content | New admin tool |
| **Inline Moderation** | Moderate without leaving context | New capability |
| **User Warnings** | Warn users before bans | New capability |
| **Auto-Moderation Rules** | Keyword filters, spam detection | New capability |
| **Appeals Queue** | Handle moderation appeals | New capability |
| **Moderation Analytics** | Track moderation activity | New capability |

**Why here:** Moderation becomes important as community scales. Needs content and members first.

---

### Phase 12: Advanced Content
*Requires: Content calendar, editor mature*

| Feature | What It Adds | Notes |
|---------|--------------|-------|
| **Content Versioning** | Multiple versions per post | New capability |
| **Version Comparison** | Diff between versions | New capability |
| **Scheduled Version Switching** | Auto-switch versions | New capability |
| **Block Templates** | Reusable content blocks | New capability |

**Why here:** Versioning is advanced functionality that builds on stable content foundation.

---

### Phase 13: Automation & Workflows
*Requires: Most systems exist*

| Feature | What It Adds | Notes |
|---------|--------------|-------|
| **Workflow Builder** | Visual automation creator | New capability |
| **Triggers** | Content, user, time-based triggers | New capability |
| **Actions** | Notifications, emails, role changes, etc. | New capability |
| **Workflow Templates** | Pre-built automations | New capability |

**Why here:** Automation connects systems. Most systems need to exist first.

---

### Phase 14: AI Layer
*Can be introduced progressively starting Phase 5+*

| Feature | Can Add After | What It Enhances |
|---------|---------------|------------------|
| **AI Content Analysis** | Phase 3 | Editor - engagement scoring |
| **AI Suggestions (Users)** | Phase 2 | Discovery - "people you might know" |
| **AI Suggestions (Content)** | Phase 3 | Feed - "you might like" |
| **AI Moderation Assist** | Phase 11 | Moderation - toxicity detection |
| **AI Segment Suggestions** | Phase 7 | Members - auto-segment ideas |
| **AI Workflow Suggestions** | Phase 13 | Automation - suggested workflows |
| **AI Publishing Insights** | Phase 8 | Calendar - optimal times |

**Approach:** AI features enhance existing capabilities. Introduce incrementally rather than all at once.

---

### Phase 15: Advanced Analytics
*Requires: Data flowing through all systems*

| Feature | What It Adds | Notes |
|---------|--------------|-------|
| **Space Health Score** | Overall community health | Requires history |
| **Predictive Analytics** | Forward-looking insights | Requires data |
| **Member Analytics Dashboard** | Deep member insights | Requires activity data |
| **Engagement Analytics** | Content performance deep-dive | Requires engagement data |

**Why last:** Analytics need data. Data comes from usage of all the other features.

---

## Visual Timeline

```
V1 ─────────────────────────────────────────────────────────────────────► V2

Phase 0   │ Phase 1        │ Phase 2-4      │ Phase 5-7       │ Phase 8-15
Foundation│ THE BIG SHIFT  │ User Features  │ Admin Foundation│ Advanced
──────────┼────────────────┼────────────────┼─────────────────┼───────────
Technical │ * Central Feed │ * Rich Profiles│ * CMS Dashboard │ * Calendar
Invisible │ * New Nav      │ * Discovery    │ * Spaces+       │ * Broadcasts
          │ * Global Pub   │ * Editor+      │ * Members Mgmt  │ * Forms
          │ * New Editor   │ * Messaging+   │                 │ * Moderation
          │                │                │                 │ * Versioning
          │                │                │                 │ * Workflows
          │                │                │                 │ * AI Layer
          │                │                │                 │ * Analytics
          │                │                │                 │
          │ ◄── BIG BANG ──►              ◄─── INCREMENTAL ──────────────►
```

---

## Migration Considerations

| V1 Element | V2 Treatment |
|------------|--------------|
| Existing users | Seamless login, onboarding tour for new UI |
| Existing spaces | Continue working, enhanced features additive |
| Existing articles | Map to new "Article" post type |
| Existing discussions | Map to new "Discussion" post type |
| Existing downloads | Map to new document/media handling |
| Existing videos | Map to new media handling |
| Existing messages | Migrate to new messaging system |
| Existing profiles | Migrate data, new fields optional |

---

## Feature Categories Summary

### 1. AI-Powered Content & Moderation
- AI Content Analysis
- AI Engagement Predictions
- AI-Powered Moderation
- Auto-Moderation Rules
- AI Segment Suggestions
- AI Workflow Suggestions
- AI Publishing Insights

### 2. Advanced Content Management
- Content Version Manager
- Scheduled Version Switching
- Content Calendar
- Content Dashboard
- Rich Text Editor (Lexical)
- Post Types & Taxonomies
- Block Templates
- SEO Panel

### 3. Email Broadcasts & Campaigns
- Broadcast Dashboard
- Campaign Composer
- Block Email Editor
- Segment-Based Targeting
- Scheduled Sends
- Test Email Sending

### 4. Member Management & Analytics
- Member Directory
- Lifecycle Stages
- Member Segments
- Onboarding Flows
- Member Analytics
- Bulk Actions

### 5. Moderation Suite
- Moderation Queue
- Appeals Queue
- Moderation Analytics
- Inline Moderation
- User Warnings & Bans
- Floating Moderation Panel

### 6. Automation & Workflows
- Workflow Builder
- Content Triggers
- User Triggers
- Scheduled Triggers
- Actions Library
- Workflow Templates
- Execution Analytics

### 7. Form Builder
- Drag-and-Drop Builder
- Field Types
- Conditional Logic
- Field Sections
- Form Templates
- Keyboard Shortcuts
- Form Preview

### 8. Spaces (Community Hubs)
- Space Creation Wizard
- Space Templates
- Custom Branding
- Privacy Controls
- Channel Structure
- Member Invites
- Space Discussions & Chat
- Space Events

### 9. Permissions & Roles
- Role Management
- Permissions Matrix
- Capability Groups
- Role Assignment

### 10. Analytics Dashboard
- Space Health Score
- Actionable Insights
- Weekly Wins
- Predictive Analytics
- Engagement Metrics
- User Metrics

### 11. Core User Experience
- Activity Feed
- Calendar View
- Task Management
- Learning Center
- Suggestions
- Notifications
- Messages
- User Profiles

---

## Total Feature Count

This roadmap covers approximately **80+ distinct features** across 11 major categories, transitioning from a basic V1 platform to a comprehensive V2 community platform with AI capabilities.

---

*Document generated: January 2026*
