# Spaces Frontend - Features & Routes Overview

This document provides a comprehensive overview of all features, pages, and routes in the Spaces frontend application after the feature pruning performed in December 2025.

## Table of Contents
- [Authentication & Public Pages](#authentication--public-pages)
- [User Pages (Protected Routes)](#user-pages-protected-routes)
- [Admin Pages](#admin-pages)
- [API Endpoints](#api-endpoints)
- [Key Features & Components](#key-features--components)
- [Removed Features](#removed-features)

---

## Authentication & Public Pages

| URL | Page | Purpose |
|-----|------|---------|
| `/` | Landing Page | Public homepage with hero section and feature overview |
| `/login` | Login Page | User authentication with email/password |
| `/signup` | Registration | New user account creation |
| `/forgot-password` | Password Reset | Request password reset email |
| `/reset-password` | Reset Password | Complete password reset with token |

---

## User Pages (Protected Routes)

### Core Feed & Discovery

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/feed` | Main Feed | Aggregated activity feed from user's spaces | Infinite scroll, content type filters (discussions, events, updates), unified timeline |
| `/suggestions` | AI Suggestions | Personalized content and connection suggestions | AI-powered recommendations, engagement tips |
| `/tasks` | Task Management | Personal task list and project management | Task organization, completion tracking |
| `/calendar` | Calendar View | Event calendar and scheduling | Month/week/day views, event management |

### Spaces

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/spaces` | Spaces Directory | Browse and search all available spaces | Grid view, search, filtering |
| `/spaces/[id]` | Space Detail | Individual space homepage | Space feed, members, events, settings |
| `/spaces/[id]/about` | Space About | Space description and information | Details, guidelines, metadata |
| `/spaces/[id]/members` | Space Members | View and manage space members | Member list, roles, invitations |
| `/spaces/[id]/events` | Space Events | Events specific to this space | Event list, calendar integration |
| `/spaces/[id]/discussions` | Space Discussions | Discussion threads in space | Topic-based discussions |
| `/spaces/[id]/updates` | Space Updates | News and announcements | Update feed, pinned posts |
| `/spaces/[id]/settings` | Space Settings | Configure space (admin only) | Privacy, permissions, appearance |
| `/spaces/new` | Create Space | Create new space | Step-by-step wizard |

### Events

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/events` | Events Directory | Browse all upcoming events | List/grid view, filtering by date/category |
| `/events/[id]` | Event Detail | Individual event page | RSVP, attendees, location, schedule |
| `/events/new` | Create Event | Create new event | Form with date/time, location, capacity |
| `/events/[id]/edit` | Edit Event | Modify existing event | Update event details |

### Updates & Discussions

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/updates` | Updates Feed | All updates from followed spaces | Chronological feed, reactions |
| `/updates/[id]` | Update Detail | Individual update page | Full update view, comments, reactions |
| `/discussions` | Discussions Feed | All discussions from spaces | Discussion threads, filtering |
| `/discussions/[id]` | Discussion Detail | Individual discussion thread | Comments, replies, voting |
| `/discussions/new` | New Discussion | Start a discussion | Rich text editor, topic selection |

### Community

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/users` | Users Directory | Browse community members | Search, filter, profiles |
| `/users/[id]` | User Profile | Individual user profile | Bio, activity, spaces, connections |
| `/users/[id]/edit` | Edit Profile | Update own profile | Personal info, avatar, bio |

### Messages

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/messages` | Messages Inbox | Private messaging | Conversation list, unread indicators |
| `/messages/[id]` | Conversation | Individual message thread | Real-time chat, file sharing |

### Personal Pages

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/settings` | User Settings | Account settings and preferences | Profile, privacy, notifications, account |
| `/bookmarks` | Bookmarks | Saved content | Saved posts, events, discussions |
| `/notifications` | Notifications | Activity notifications | Mentions, replies, invitations |

### Forms

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/forms` | Forms List | View available forms | Form directory, submission status |
| `/forms/[id]` | Form Detail | Individual form view | Form fields, validation, submission |
| `/forms/[id]/submissions` | Form Submissions | View form responses (admin) | Response data, analytics |

### Media Library

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/media` | Media Library | User's uploaded media | Image/video gallery, upload management |

---

## Admin Pages

Admin routes are prefixed with `/admin` and require admin privileges.

### Dashboard

| URL | Page | Purpose |
|-----|------|---------|
| `/admin` | Admin Dashboard | Main admin overview with stats and quick actions |

### Content Management

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/admin/discussions` | Manage Discussions | Moderate and manage discussions | Bulk actions, filtering, approval |
| `/admin/events` | Manage Events | Event administration | Review, edit, feature events |
| `/admin/updates` | Manage Updates | Update administration | Moderate, pin, feature updates |

### Taxonomies

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/admin/categories` | Categories | Manage content categories | CRUD operations, hierarchy |
| `/admin/tags` | Tags | Manage content tags | Tag creation, merging, deletion |

### Templates

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/admin/templates` | Template Management | Manage reusable templates | Form templates, email templates |
| `/admin/templates/[id]` | Template Editor | Edit specific template | Visual editor, variables |

### Broadcasts

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/admin/broadcasts` | Broadcasts List | Manage system broadcasts | Create announcements, notifications |
| `/admin/broadcasts/new` | Create Broadcast | Create new broadcast | Target selection, scheduling, content |
| `/admin/broadcasts/[id]` | Broadcast Detail | View/edit broadcast | Analytics, recipient list, editing |

### Members & Community

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/admin/members` | Member Management | Manage all platform users | User list, roles, permissions, search |
| `/admin/members/[id]` | Member Detail | Individual user admin view | Edit details, manage permissions, view activity |

### Moderation

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/admin/moderation` | Moderation Queue | Review flagged content | Reports, flags, pending approvals |
| `/admin/moderation/reports` | Reports | User-submitted reports | Review reports, take action |

### System

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/admin/spaces` | Manage Spaces | Administer all spaces | Space list, settings, deletion |
| `/admin/analytics` | Analytics Dashboard | Platform analytics and insights | User growth, engagement metrics |

### Settings

| URL | Page | Purpose | Key Features |
|-----|------|---------|--------------|
| `/admin/settings` | Platform Settings | Global platform configuration | Site settings, features, integrations |

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - New user registration
- `POST /api/auth/reset-password` - Password reset request

### Users
- `GET /api/users` - List users
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Spaces
- `GET /api/spaces` - List spaces
- `GET /api/spaces/[id]` - Get space details
- `POST /api/spaces` - Create space
- `PUT /api/spaces/[id]` - Update space
- `DELETE /api/spaces/[id]` - Delete space

### Events
- `GET /api/events` - List events
- `GET /api/events/[id]` - Get event details
- `POST /api/events` - Create event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

### Discussions
- `GET /api/discussions` - List discussions
- `GET /api/discussions/[id]` - Get discussion details
- `POST /api/discussions` - Create discussion
- `PUT /api/discussions/[id]` - Update discussion
- `DELETE /api/discussions/[id]` - Delete discussion

### Updates
- `GET /api/updates` - List updates
- `GET /api/updates/[id]` - Get update details
- `POST /api/updates` - Create update
- `PUT /api/updates/[id]` - Update update
- `DELETE /api/updates/[id]` - Delete update

### Messages
- `GET /api/messages` - List conversations
- `GET /api/messages/[id]` - Get conversation
- `POST /api/messages` - Send message

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/[id]/read` - Mark as read

### Admin
- `GET /api/admin/analytics` - Platform analytics
- `GET /api/admin/moderation/reports` - Moderation reports
- `POST /api/admin/broadcasts` - Create broadcast

---

## Key Features & Components

### Navigation
- **Top Navigation** (`/src/components/ui/Navigation`): Main site navigation with authenticated/public states, dropdown menus for Collaborate and Contribute sections
- **Home Sidebar** (`/src/components/ui/HomeSidebar`): Left sidebar for authenticated users showing Feed, Suggestions, Tasks, Calendar, and user's spaces (up to 10, with "View all" link)
- **CMS Sidebar** (`/src/components/cms/layout/CMSSidebar`): Admin navigation for content management

### Content Cards
- **DiscussionCard**: Displays discussion previews with author, space, engagement metrics
- **EventCard**: Event information with date, location, RSVP status, attendees
- **UpdateCard**: Update posts with author, space, reactions, comments

### User Interactions
- **GlobalPostButton**: Quick post creation from anywhere in the app
- **NotificationDropdown**: Real-time notification center
- **MessagesDropdown**: Quick access to recent messages
- **BookmarksDropdown**: Quick access to saved content
- **UserMenu**: Account settings and profile access

### Modals & Popovers
- **SpaceSettingsPopover**: Quick settings menu for space management
- **Space Creation Wizard**: Multi-step space creation flow

### Form Builder
- Custom form builder with drag-and-drop interface
- Field types: text, textarea, select, checkbox, radio, date, file upload
- Validation settings per field
- Submission management

---

## Removed Features

The following features were removed during the December 2025 feature pruning:

### Removed (No longer available)
- **Live Webinars** - Video streaming and webinar hosting
- **JobForge** - Job application builder and tracking
- **Open Calls** - Funding and opportunity calls
- **Documents** - Document repository and publishing
- **Showcases** - Success stories and case studies
- **Resources** - Knowledge base and resource library
- **Exchanges** - Community exchange marketplace

All routes, components, API endpoints, and library functions for these features have been completely removed from the codebase.

---

## Technology Stack

- **Framework**: Next.js 16.0.3 (App Router)
- **Build Tool**: Turbopack
- **Language**: TypeScript
- **UI Library**: React 18
- **Data Fetching**: React Query (`@tanstack/react-query`)
- **Styling**: SCSS Modules
- **UI Components**: Radix UI (Popover, Separator, etc.)
- **Authentication**: Custom auth system with JWT

---

**Document Last Updated**: December 20, 2025
**Branch**: feature/admin
**Version**: Post-pruning v2.0
