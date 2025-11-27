
📋 Proposed Content Types (12 Total)

High Priority (Core to innovation workflow):

1. Idea/Innovation Proposal
   - Structured pitches with problem statements, solutions, and metrics
   - Stage tracking (Draft → Pitched → In Review → Approved)
   - Voting/endorsement system
   - Perfect for: Pitching new sustainable transport solutions, proposing improvements
2. Showcase/Case Study
   - Rich media format for completed projects and success stories
   - Before/after comparisons, impact metrics, lessons learned
   - Perfect for: Sharing pilot program results, highlighting ROI from innovations
3. Update/Announcement Post
   - Short-form news, milestones, and announcements
   - Pinning capability, urgency flags, cross-posting
   - Perfect for: "New innovation fund open", policy updates, quick wins
4. Resource Collection/Playlist
   - Curated bundles of existing content around themes
   - Progress tracking, collaborative editing
   - Perfect for: "Essential Reading for New Managers", onboarding playlists

Medium Priority (Significant value-adds):

5. Challenge/Call for Solutions
   - Time-bound competitions with submissions and judging
   - Community voting, prizes, winner showcase
   - Perfect for: "30-day carbon reduction challenge", hackathons
6. Learning Path/Course Series
   - Multi-module structured learning with progress tracking
   - Videos, articles, quizzes, certificates
   - Perfect for: "Design Thinking Fundamentals", "Innovation Metrics 101"
7. Poll/Survey
   - Interactive feedback gathering with multiple question types
   - Real-time results, anonymous options, data export
   - Perfect for: Community needs assessment, topic voting
8. Resource/Knowledge Base Article
   - Evergreen reference content with versioning
   - Templates, guides, best practices, documentation
   - Perfect for: "Innovation Proposal Template", API docs, how-to guides

Lower Priority (Future expansion):

9. Project/Initiative Hub
   - Comprehensive workspace for ongoing collaborative projects
   - Integrated tasks, documents, timeline, team roles
   - Perfect for: Multi-month digital transformation initiatives
10. Expert Q&A / AMA
    - Scheduled sessions with subject matter experts
    - Pre-submitted questions, upvoting, live answers
    - Perfect for: "AMA with Chief Innovation Officer", expert deep-dives
11. Milestone/Achievement
    - Recognition content with badges and certificates
    - Personal, team, or community achievements
    - Perfect for: "50 hours learning completed", anniversary celebrations
12. Live Session/Webinar
    - Real-time streaming with integrated chat and polls
    - Recording availability, attendance tracking
    - Perfect for: Monthly showcases, training webinars, town halls
      Implementation Plan: Three New Content Types

Based on my analysis of your codebase, here's a comprehensive implementation plan for Updates/Announcements, Showcases, and Resources.

  ---
📊 Architecture Analysis

Current Patterns Identified:
- TypeScript interfaces in /src/lib/*.ts
- API client using apiFetch helper
- React Query for data fetching
- Card components for display (DiscussionCard, EventCard)
- Detail pages with comments/interactions
- Create/edit forms with Lexical editor
- Feed system that merges different content types

  ---
🎯 Implementation Strategy

I recommend implementing all three content types in parallel using a shared foundation, since they have significant overlap. This approach:
- Reduces code duplication
- Ensures consistency
- Allows for easier maintenance
- Enables unified feed display

  ---
📋 Detailed Implementation Plan

Phase 1: Backend API & Data Models (Backend work - coordinate with backend team)

1.1 Database Schema

// Shared fields across all content types
interface BaseContent {
id: string;
createdAt: string;
updatedAt: string;
title: string;
htmlContent: string;
jsonContent?: object;
author: User;
space: Space;
tags?: Tag[];
likedBy?: User[];
followedBy?: User[];
likesCount?: number;
commentsCount?: number;
isPinned?: boolean;
isLiked?: boolean;
isFollowing?: boolean;
}

// Update/Announcement specific
interface Update extends BaseContent {
type: 'update';
priority: 'low' | 'normal' | 'high' | 'urgent';
category: 'news' | 'milestone' | 'policy' | 'announcement' | 'other';
expiresAt?: string; // Optional expiry for time-sensitive content
pinUntil?: string;  // Auto-unpin after this date
}

// Showcase specific
interface Showcase extends BaseContent {
type: 'showcase';
projectStart?: string;
projectEnd?: string;
teamMembers?: User[]; // Contributors
impactMetrics?: {
label: string;
value: string;
icon?: string;
}[];
media?: {
type: 'image' | 'video';
url: string;
caption?: string;
}[];
relatedLinks?: {
label: string;
url: string;
}[];
}

// Resource specific
interface Resource extends BaseContent {
type: 'resource';
resourceType: 'guide' | 'template' | 'documentation' | 'best-practice' | 'tool';
difficulty?: 'beginner' | 'intermediate' | 'advanced';
estimatedTime?: number; // in minutes
attachments?: {
name: string;
url: string;
size: number;
type: string;
}[];
version?: string;
lastReviewed?: string;
relatedResources?: string[]; // IDs of related resources
viewCount?: number;
downloadCount?: number;
helpfulCount?: number; // "Was this helpful?" votes
}

API Endpoints needed:

POST   /api/updates              - Create update
GET    /api/updates              - List updates (with filters)
GET    /api/updates/:id          - Get single update
PATCH  /api/updates/:id          - Update
DELETE /api/updates/:id          - Delete
POST   /api/updates/:id/like     - Like
DELETE /api/updates/:id/unlike   - Unlike

POST   /api/showcases            - Create showcase
GET    /api/showcases            - List showcases
GET    /api/showcases/:id        - Get single
PATCH  /api/showcases/:id        - Update
DELETE /api/showcases/:id        - Delete
POST   /api/showcases/:id/like   - Like
DELETE /api/showcases/:id/unlike - Unlike

POST   /api/resources            - Create resource
GET    /api/resources            - List resources
GET    /api/resources/:id        - Get single
PATCH  /api/resources/:id        - Update
DELETE /api/resources/:id        - Delete
POST   /api/resources/:id/helpful - Mark as helpful
POST   /api/resources/:id/download - Track download

  ---
Phase 2: Frontend Type Definitions & API Client (Week 1)

Tasks:
1. Create /src/lib/updates.ts (like discussions.ts)
2. Create /src/lib/showcases.ts
3. Create /src/lib/resources.ts

Example structure (updates.ts):

import { apiFetch } from './api-client';

export interface Update {
id: string;
createdAt: string;
updatedAt: string;
title: string;
htmlContent: string;
priority: 'low' | 'normal' | 'high' | 'urgent';
category: 'news' | 'milestone' | 'policy' | 'announcement' | 'other';
expiresAt?: string;
pinUntil?: string;
author: { /* ... */ };
space: { /* ... */ };
tags?: Tag[];
likesCount?: number;
commentsCount?: number;
isPinned?: boolean;
isLiked?: boolean;
}

export interface CreateUpdateData {
title: string;
htmlContent: string;
priority: string;
category: string;
space: number;
expiresAt?: string;
tags?: number[];
}

export function getUpdates(params?): Promise<Update[]> { /* ... */ }
export function getUpdate(id: string): Promise<Update> { /* ... */ }
export function createUpdate(data: CreateUpdateData): Promise<Update> { /* ... */ }
export function updateUpdate(id: string, data: Partial<Update>): Promise<Update> { /* ... */ }
export function deleteUpdate(id: string): Promise<void> { /* ... */ }
export function likeUpdate(id: string): Promise<void> { /* ... */ }
export function unlikeUpdate(id: string): Promise<void> { /* ... */ }

  ---
Phase 3: Card Components (Week 1)

Create display cards for the feed:

Tasks:
1. /src/components/ui/UpdateCard.tsx
2. /src/components/ui/ShowcaseCard.tsx
3. /src/components/ui/ResourceCard.tsx

Example (UpdateCard.tsx):

interface UpdateCardProps {
update: Update;
}

export function UpdateCard({ update }: UpdateCardProps) {
return (
<Link href={`/updates/${update.id}`}>
<article className="update-card">
{/* Priority badge */}
{update.priority !== 'normal' && (
<span className={`priority-badge priority-${update.priority}`}>
{update.priority}
</span>
)}

          {/* Category */}
          <span className="category-badge">{update.category}</span>

          {/* Title */}
          <h3>{update.title}</h3>

          {/* Excerpt */}
          <div className="update-excerpt">
            {/* First 200 chars of htmlContent stripped */}
          </div>

          {/* Metadata */}
          <div className="metadata">
            <span>{update.author.name}</span>
            <span>{formatDate(update.createdAt)}</span>
            <span>{update.likesCount} likes</span>
            <span>{update.commentsCount} comments</span>
          </div>

          {/* Expiry indicator */}
          {update.expiresAt && isNearExpiry(update.expiresAt) && (
            <span className="expiry-warning">
              Expires {formatRelativeDate(update.expiresAt)}
            </span>
          )}
        </article>
      </Link>
    );
}

  ---
Phase 4: Detail Pages (Week 2)

Create full-page views for each content type:

Tasks:
1. /src/app/(protected)/updates/[id]/page.tsx
2. /src/app/(protected)/showcases/[id]/page.tsx
3. /src/app/(protected)/resources/[id]/page.tsx

Structure (similar to discussions detail page):
- Rich content display with mentions
- Like/follow buttons
- Comments section with Lexical editor
- Metadata sidebar
- Related content
- Share functionality

  ---
Phase 5: Create/Edit Forms (Week 2-3)

Create forms for content creation:

Tasks:
1. /src/app/(protected)/updates/new/page.tsx
2. /src/app/(protected)/showcases/new/page.tsx
3. /src/app/(protected)/resources/new/page.tsx

Update Form Fields:
- Title (required)
- Content (Lexical editor with mentions)
- Priority (dropdown)
- Category (dropdown)
- Space (space selector)
- Expiry date (optional date picker)
- Tags (multi-select)

Showcase Form Fields:
- Title (required)
- Content (Lexical editor)
- Project dates (date range)
- Team members (multi-select users)
- Impact metrics (dynamic fields)
- Media gallery (file upload)
- Related links (dynamic URL fields)
- Space, tags

Resource Form Fields:
- Title (required)
- Content (Lexical editor)
- Resource type (dropdown)
- Difficulty level (dropdown)
- Estimated time (number input)
- Attachments (file upload)
- Version (text input)
- Space, tags

  ---
Phase 6: Feed Integration (Week 3)

Update the feed to include new content types:

File: /src/app/(protected)/feed/page.tsx

Changes:
1. Update FeedItem type:
   type FeedItem = {
   type: 'discussion' | 'event' | 'update' | 'showcase' | 'resource';
   data: Discussion | Event | Update | Showcase | Resource;
   createdAt: string;
   };

2. Fetch all content types:
   const { data: updatesData } = useInfiniteQuery({
   queryKey: ['feed-updates'],
   queryFn: ({ pageParam = 0 }) => getUpdates({ limit: 10, offset: pageParam }),
   // ...
   });
   // Similar for showcases and resources

3. Merge and sort all feed items
4. Update filter dropdown:
   const [contentType, setContentType] = useState<
   'all' | 'discussions' | 'events' | 'updates' | 'showcases' | 'resources'
>('all');

5. Render appropriate card based on type:
   {item.type === 'update' && <UpdateCard update={item.data as Update} />}
   {item.type === 'showcase' && <ShowcaseCard showcase={item.data as Showcase} />}
   {item.type === 'resource' && <ResourceCard resource={item.data as Resource} />}

  ---
Phase 7: Navigation & Discovery (Week 3-4)

Tasks:
1. Add links to main navigation sidebar
2. Create dedicated browse pages:
   - /src/app/(protected)/updates/page.tsx - All updates
   - /src/app/(protected)/showcases/page.tsx - Showcase gallery
   - /src/app/(protected)/resources/page.tsx - Resource library
3. Add quick links in space pages:
   <Link href={`/spaces/${spaceId}/updates`}>Updates</Link>
   <Link href={`/spaces/${spaceId}/showcases`}>Showcases</Link>
   <Link href={`/spaces/${spaceId}/resources`}>Resources</Link>

  ---
Phase 8: Advanced Features (Week 4-5)

Updates:
- Auto-unpinning based on pinUntil date
- Push notifications for high-priority updates
- Read/unread tracking

Showcases:
- Before/after image sliders
- Impact metrics visualization (charts)
- Team member attribution with links to profiles
- Export as PDF/presentation

Resources:
- "Was this helpful?" feedback system
- Download tracking
- Version history
- Related resources recommendation engine
- Print-friendly view

  ---
🎨 CSS Architecture

Create modular stylesheets in /src/app/globals.css:

/* ============================================
Update Cards & Pages
============================================ */
.update-card { /* ... */ }
.priority-badge { /* ... */ }
.priority-urgent { /* ... */ }
.category-badge { /* ... */ }
.expiry-warning { /* ... */ }

/* ============================================
Showcase Cards & Pages
============================================ */
.showcase-card { /* ... */ }
.impact-metrics { /* ... */ }
.team-attribution { /* ... */ }
.media-gallery { /* ... */ }

/* ============================================
Resource Cards & Pages
============================================ */
.resource-card { /* ... */ }
.resource-type-badge { /* ... */ }
.difficulty-indicator { /* ... */ }
.helpful-votes { /* ... */ }

  ---
📅 Timeline Summary

| Phase   | Duration     | Deliverables                   |
  |---------|--------------|--------------------------------|
| Phase 1 | Backend team | API endpoints, database schema |
| Phase 2 | 3 days       | Type definitions, API clients  |
| Phase 3 | 3 days       | Card components for feed       |
| Phase 4 | 5 days       | Detail pages with comments     |
| Phase 5 | 7 days       | Create/edit forms              |
| Phase 6 | 4 days       | Feed integration               |
| Phase 7 | 5 days       | Navigation & browse pages      |
| Phase 8 | 7 days       | Advanced features              |

Total Frontend Estimate: 4-5 weeks

  ---
🔄 Recommended Order of Implementation

Option A: Iterative (Safest)
1. Week 1: Complete Updates (Phases 2-4)
2. Week 2: Complete Showcases (Phases 2-4)
3. Week 3: Complete Resources (Phases 2-4)
4. Week 4: Forms & Feed integration (Phases 5-6)
5. Week 5: Navigation & Polish (Phases 7-8)

Option B: Parallel (Faster, requires coordination)
1. Week 1: All Phase 2 & 3 work (types + cards)
2. Week 2: All Phase 4 work (detail pages)
3. Week 3: All Phase 5 work (forms)
4. Week 4: Phases 6-7 (feed + navigation)
5. Week 5: Phase 8 (advanced features)

  ---
✅ Testing Checklist

For each content type:
- Create content successfully
- View content in feed
- View detail page
- Edit content
- Delete content
- Like/unlike
- Comment on content
- Reply to comments
- Mention users in content and comments
- Filter by space
- Search functionality
- Mobile responsive
- Dark mode support

  ---
🎯 Success Metrics

After implementation, track:
- Content creation rates (updates vs showcases vs resources)
- Engagement rates (likes, comments per type)
- Time on page for each content type
- Search/filter usage
- Most popular resource types
- Update priority distribution