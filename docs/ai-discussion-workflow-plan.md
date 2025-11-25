# Multi-Step Discussion Creation Workflow with AI Assistance

## Plan Overview

This document outlines a comprehensive multi-step workflow for creating discussions with AI assistance to improve content quality and user experience.

---

## Workflow Overview

**Step 1: Initial Content** → **Step 2: AI Enhancement** → **Step 3: Review & Publish**

---

## Step 1: Initial Content (Current)

**Fields:**
- Space selector
- Title
- Content (main discussion body)

**Action:** Click "Next" → Sends to AI processing

---

## Step 2: AI Enhancement (NEW)

This is where AI helps the user refine and enhance their discussion.

### 2.1 Excerpt Generation ✅

**UI Design:**
```
┌─────────────────────────────────────────────────────┐
│ Choose an Excerpt                                    │
├─────────────────────────────────────────────────────┤
│ ○ Exploring sustainable transportation solutions    │
│   for urban environments                             │
├─────────────────────────────────────────────────────┤
│ ○ Discussion on eco-friendly transit options and    │
│   their impact on cities                             │
├─────────────────────────────────────────────────────┤
│ ● How can we improve public transportation while    │
│   reducing carbon emissions?                         │
├─────────────────────────────────────────────────────┤
│ ✏️  Write your own                                   │
│   [Custom excerpt input]                             │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Radio group with 3 AI-generated options
- "Write your own" option with text input
- Selected by default: Most balanced option
- Character count indicator (e.g., "85/150 chars")

---

### 2.2 Tag Suggestions ✅ (High Value)

**Why Important:**
- Improves discoverability
- Helps categorize discussions
- Users often forget to add tags

**UI Design:**
```
┌─────────────────────────────────────────────────────┐
│ Suggested Tags                                       │
├─────────────────────────────────────────────────────┤
│ ✓ Transportation   ✓ Sustainability   ○ Urban       │
│ ○ Public Transit   ○ Climate Change   ○ Innovation  │
├─────────────────────────────────────────────────────┤
│ Add custom tag: [____________] + Add                 │
└─────────────────────────────────────────────────────┘
```

**Implementation:**
- AI analyzes title + content
- Suggests 6-8 relevant tags
- Checkboxes for quick selection
- Allow custom tag input
- Show tag popularity (e.g., "🔥 Popular")

**Backend:**
```json
POST /api/discussions/suggest-tags
{
  "title": "...",
  "content": "...",
  "spaceId": 123
}

Response:
{
  "tags": [
    { "id": 1, "name": "Transportation", "score": 0.95 },
    { "id": 2, "name": "Sustainability", "score": 0.88 },
    // ... or new tags to create
    { "name": "EV Infrastructure", "isNew": true }
  ]
}
```

---

### 2.3 Content Improvements ✅ (High Value)

**Why Important:**
- Helps users write clearer discussions
- Improves readability
- Catches common issues

**Types of Suggestions:**

#### A. Tone Adjustments
```
┌─────────────────────────────────────────────────────┐
│ Tone: Detected as "Casual" → Suggested: "Professional" │
│                                                         │
│ ○ Keep original tone                                   │
│ ○ Make more professional                               │
│ ○ Make more casual/friendly                            │
└─────────────────────────────────────────────────────┘
```

#### B. Clarity Improvements
```
┌─────────────────────────────────────────────────────┐
│ ⚠️  Clarity Issues Found (3)                         │
├─────────────────────────────────────────────────────┤
│ 1. Paragraph 2 is very long (450 words)              │
│    → Suggest: Break into 3 shorter paragraphs        │
│                                                       │
│ 2. Complex sentence detected                         │
│    Original: "The implementation of sustainable..."  │
│    Suggested: "We can implement sustainable..."      │
│                                                       │
│ 3. Technical jargon: "modal shift paradigm"          │
│    → Consider explaining this term                   │
└─────────────────────────────────────────────────────┘
```

#### C. Structure Suggestions
```
┌─────────────────────────────────────────────────────┐
│ 💡 Structure Suggestions                             │
├─────────────────────────────────────────────────────┤
│ ✓ Add section headers                                │
│   AI can break your content into sections with       │
│   headers like "Background", "Problem", "Solution"   │
│                                                       │
│ ✓ Add a question                                     │
│   Discussions with questions get 3x more engagement  │
│   Suggested: "What's your experience with public     │
│   transportation in your city?"                      │
└─────────────────────────────────────────────────────┘
```

---

### 2.4 SEO/Engagement Optimization 🟡 (Medium Value)

**Title Improvements:**
```
┌─────────────────────────────────────────────────────┐
│ Title Optimization                                   │
├─────────────────────────────────────────────────────┤
│ Current: "Transportation thoughts"                   │
│                                                       │
│ ○ Keep current title                                 │
│ ○ "How Can We Make Public Transportation Sustainable?"│
│   (More specific, includes question)                 │
│ ○ "5 Ways to Improve Urban Transportation Systems"   │
│   (Numbered list format - higher engagement)         │
└─────────────────────────────────────────────────────┘
```

**Engagement Predictions:**
```
┌─────────────────────────────────────────────────────┐
│ 📊 Engagement Predictions                            │
├─────────────────────────────────────────────────────┤
│ Clarity Score:      ████████░░ 80%                   │
│ Engagement Potential: ████████░░ 75%                 │
│                                                       │
│ Tips to improve:                                     │
│ • Add 1-2 questions to encourage responses           │
│ • Include an image or link                           │
│ • Keep paragraphs under 200 words                    │
└─────────────────────────────────────────────────────┘
```

---

### 2.5 Sentiment Analysis 🟡 (Medium Value)

```
┌─────────────────────────────────────────────────────┐
│ Tone Check                                           │
├─────────────────────────────────────────────────────┤
│ Detected tone: Slightly Negative                     │
│                                                       │
│ ⚠️  This might limit engagement. Consider:           │
│ • Framing as a question instead of criticism         │
│ • Adding constructive solutions                      │
│ • Acknowledging different perspectives               │
└─────────────────────────────────────────────────────┘
```

---

### 2.6 Related Discussions 🟡 (Medium Value)

**Why Important:**
- Prevents duplicate discussions
- Encourages users to join existing conversations
- Shows context

```
┌─────────────────────────────────────────────────────┐
│ 🔍 Similar Discussions Found                         │
├─────────────────────────────────────────────────────┤
│ • "EV Charging Infrastructure Challenges" (14 replies)│
│   Posted 3 days ago by @john                         │
│   → Consider adding your thoughts there?             │
│                                                       │
│ • "Urban Transportation Future" (28 replies)         │
│   Posted 1 week ago by @sarah                        │
│                                                       │
│ [ Continue with new discussion ]                     │
└─────────────────────────────────────────────────────┘
```

---

### 2.7 Image/Media Suggestions 🔵 (Low Priority)

```
┌─────────────────────────────────────────────────────┐
│ 📸 Add Visual Content                                │
├─────────────────────────────────────────────────────┤
│ Discussions with images get 2x more engagement       │
│                                                       │
│ Suggested images based on your content:              │
│ [🖼️ Urban Transit] [🖼️ Bus Lane] [🖼️ Bike Lanes]   │
│                                                       │
│ Or upload your own: [Choose File]                    │
└─────────────────────────────────────────────────────┘
```

---

## Step 3: Review & Publish

**Final Review Screen:**
```
┌─────────────────────────────────────────────────────┐
│ Review Your Discussion                               │
├─────────────────────────────────────────────────────┤
│ Space: Innovation Space                              │
│ Title: How Can We Make Public Transportation...      │
│ Excerpt: Exploring sustainable transportation...     │
│ Tags: Transportation, Sustainability, Urban (3)      │
│                                                       │
│ [📝 Preview] Shows how discussion will appear        │
│                                                       │
│ [ ← Back to Edit ]    [ Publish Discussion → ]      │
└─────────────────────────────────────────────────────┘
```

---

## Implementation Priority

### Phase 1 (MVP - High Value) 🟢
1. ✅ **Excerpt Generation** (3 AI options)
2. ✅ **Tag Suggestions** (AI-powered)
3. ✅ **Multi-step workflow** (Step 1 → Step 2 → Publish)

### Phase 2 (Enhanced Experience) 🟡
4. **Title Optimization** (Alternative titles)
5. **Content Structure Suggestions** (Headers, formatting)
6. **Related Discussions** (Duplicate prevention)

### Phase 3 (Advanced Features) 🔵
7. **Clarity Improvements** (Grammar, readability)
8. **Tone Analysis** (Sentiment check)
9. **Engagement Predictions** (Score + tips)
10. **Image Suggestions** (Visual content)

---

## Technical Architecture

### Frontend Components

```
/posts/new/
├── page.tsx (Main container)
├── Step1Content.tsx (Space, Title, Content)
├── Step2Enhancement.tsx (AI suggestions)
│   ├── ExcerptSelector.tsx
│   ├── TagSelector.tsx
│   ├── ContentImprovements.tsx
│   └── TitleOptimizer.tsx
└── Step3Review.tsx (Final review)
```

### State Management

```typescript
interface DiscussionDraft {
  // Step 1
  spaceId: string;
  title: string;
  content: string;

  // Step 2 (AI-generated)
  selectedExcerpt: string;
  customExcerpt?: string;
  selectedTags: number[];
  customTags: string[];

  // Optional enhancements
  improvedTitle?: string;
  improvedContent?: string;

  // Metadata
  currentStep: 1 | 2 | 3;
  aiSuggestions?: AISuggestions;
}

interface AISuggestions {
  excerpts: string[];
  tags: Tag[];
  titleAlternatives?: string[];
  contentImprovements?: ContentSuggestion[];
  relatedDiscussions?: Discussion[];
  engagementScore?: number;
}
```

### Backend API Endpoints

```typescript
// Generate all AI suggestions in one call
POST /api/discussions/enhance
{
  spaceId: number,
  title: string,
  content: string
}
Response: {
  excerpts: string[],
  tags: Tag[],
  titleAlternatives?: string[],
  contentSuggestions?: Suggestion[],
  relatedDiscussions?: Discussion[]
}

// Or separate endpoints for granular control
POST /api/discussions/generate-excerpts
POST /api/discussions/suggest-tags
POST /api/discussions/optimize-title
POST /api/discussions/analyze-content
POST /api/discussions/find-similar
```

---

## Backend Implementation

### OpenAI Integration Endpoint

```
POST /api/discussions/generate-excerpt
Authorization: Bearer {token}

Request Body:
{
  "title": "Discussion about transportation",
  "content": "Long discussion content here..."
}

Response:
{
  "excerpts": [
    "Brief summary option 1 (50-100 chars)",
    "Brief summary option 2 (50-100 chars)",
    "Brief summary option 3 (50-100 chars)"
  ]
}
```

**Backend Implementation Considerations:**
- Use OpenAI API (GPT-4 or GPT-3.5-turbo)
- Set system prompt to generate concise summaries
- Limit excerpt length (e.g., 50-150 characters)
- Handle rate limiting and errors
- Add authentication check
- Consider caching to avoid duplicate API calls

**Example Prompt:**
```
System: You are a helpful assistant that creates brief, engaging summaries.
Generate 3 different excerpt options (50-100 characters each) that summarize
the following discussion. Each excerpt should be concise, clear, and enticing.

User: Title: {title}
Content: {content}
```

---

## UX Considerations

### Loading States
```
Step 1 → Click "Next"
  ↓
[⏳ Analyzing your discussion with AI...
    This takes about 5-10 seconds]
  ↓
Step 2 → AI Suggestions Ready
```

### Skip Option
```
[ Skip AI Suggestions → Publish Now ]
(For users who want to post quickly)
```

### Save Draft
```
💾 Draft auto-saved at 2:34 PM
[ Continue later ]
```

---

## Cost Optimization

**OpenAI API Costs:**
- GPT-4: ~$0.03 per request (expensive)
- GPT-3.5-turbo: ~$0.002 per request (affordable)

**Strategies:**
1. **Batch Requests**: Send one prompt that generates all suggestions
2. **Caching**: Cache suggestions for 10 minutes if user goes back
3. **Rate Limiting**: Limit to 10 AI enhancements per user per day
4. **Smart Triggers**: Only run AI if content is > 100 words
5. **Model Selection**: Use GPT-3.5 for tags/excerpts, GPT-4 for complex analysis

---

## Recommended MVP Scope

**Phase 1: Start Here**
1. ✅ **Excerpt Generation** (3 options + custom)
2. ✅ **Tag Suggestions** (6-8 tags with selection)
3. ✅ **2-Step Workflow** (Content → Enhancement → Publish)

**Why This Makes Sense:**
- High user value (saves time, improves quality)
- Manageable scope (~2-3 days work)
- Can measure impact before adding more features
- Tests AI integration infrastructure

---

## Success Metrics

**Measure Impact:**
- % of users who use AI suggestions vs skip
- Which excerpt option is selected most often
- Tag adoption rate (AI suggested vs custom)
- Discussion engagement rate (with AI vs without)
- Time saved in content creation
- User satisfaction scores

---

## Future Enhancements

After Phase 1 is stable, consider:
- Real-time AI suggestions as user types
- Personalized suggestions based on user history
- A/B testing different AI models
- Multi-language support
- Voice-to-text with AI enhancement
- Collaborative editing with AI assistance

---

*Document created: 2025*
*Last updated: 2025*
