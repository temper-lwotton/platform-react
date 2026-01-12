# Route Documentation Index

This folder contains comprehensive documentation for all routes in the Spaces Frontend application.

## Route Categories

### Public Routes
- [/ (Home)](./home.md) - Landing page
- [/login](./login.md) - Authentication page

### Core Protected Routes
- [/feed](./feed.md) - Main activity feed
- [/calendar](./calendar.md) - Calendar view for events and tasks
- [/tasks](./tasks.md) - Task management
- [/learn](./learn.md) - Learning center
- [/my-content](./my-content.md) - User's created content
- [/notifications](./notifications.md) - Notification center
- [/preferences](./preferences.md) - User preferences
- [/suggestions](./suggestions.md) - Personalized suggestions

### Spaces Module
- [/spaces](./spaces.md) - Spaces listing
- [/spaces/new](./spaces-new.md) - Create new space
- [/spaces/[id]](./spaces-id.md) - Space detail view
- [/spaces/[id]/chat](./spaces-id-chat.md) - Space chat
- [/spaces/[id]/discussions](./spaces-id-discussions.md) - Space discussions
- [/spaces/[id]/discussions/[discussionId]](./spaces-id-discussions-discussionId.md) - Discussion detail
- [/spaces/[id]/events](./spaces-id-events.md) - Space events
- [/spaces/[id]/events/new](./spaces-id-events-new.md) - Create space event

### Events Module
- [/events](./events.md) - Events listing
- [/events/new](./events-new.md) - Create event
- [/events/[id]](./events-id.md) - Event detail

### Messages Module
- [/messages](./messages.md) - Messages listing
- [/messages/new](./messages-new.md) - New conversation
- [/messages/[conversationId]](./messages-conversationId.md) - Conversation view

### Updates Module
- [/updates](./updates.md) - Updates listing
- [/updates/new](./updates-new.md) - Create update
- [/updates/[id]](./updates-id.md) - Update detail

### Users Module
- [/users](./users.md) - User directory
- [/users/[id]](./users-id.md) - User profile
- [/users/[id]/edit](./users-id-edit.md) - Edit profile

### Forms Module
- [/forms](./forms.md) - Forms listing
- [/form-builder](./form-builder.md) - Form builder
- [/form-builder/new](./form-builder-new.md) - Create form
- [/form-builder/[id]](./form-builder-id.md) - Edit form

### Posts Module
- [/posts/new](./posts-new.md) - Create post

### Admin Routes
See [Admin Routes Index](./admin/_index.md) for complete admin documentation.

### API Routes
- [POST /api/auth/login](./api/api-auth-login.md) - Authentication endpoint
- [POST /api/discussions/analyze-engagement](./api/api-discussions-analyze-engagement.md) - AI engagement analysis
- [POST /api/discussions/generate-excerpts](./api/api-discussions-generate-excerpts.md) - AI excerpt generation

## Documentation Template

Each route document includes:
- **Description**: Purpose and context
- **URL Parameters**: Dynamic route parameters
- **Authentication**: Access requirements
- **Layout & Structure**: Page organization
- **Components Used**: All imported components
- **Data Fetching**: React Query hooks and data sources
- **State Management**: Local and persisted state
- **User Actions**: Available interactions
- **Related Routes**: Navigation connections
