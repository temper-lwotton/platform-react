# Backend AI Requirements - What's Missing

## Current Status (Based on API Response)

The backend is currently returning:

```javascript
{
  success: true,
  data: {
    id: 47,
    filename: 'images.jpeg',
    aiAnalysis: {
      tags: [],                    // ❌ EMPTY - No AI tags detected
      peopleCount: 0,              // ⚠️ May be working, or defaulting to 0
      dominantColors: ['#bab8bb', '#b3bbbe', ...], // ✅ WORKING
      suggestedAltTexts: ['Image uploaded to media library'], // ❌ Generic fallback
      faces: [],                   // ⚠️ May be working, or defaulting to empty
      moderationFlags: { isAdult: false, isViolent: false, confidence: 0 }
    },
    seoFilename: undefined         // ❌ NOT IMPLEMENTED
  }
}
```

## What's Working ✅

1. **Dominant Colors** - Backend is extracting color palette
2. **Basic Response Structure** - API returns correct format
3. **File Upload** - Images are being stored

## What's NOT Working ❌

### 1. AI Tags Detection (CRITICAL)

**Problem:** `tags` array is empty

**Expected:**
```javascript
tags: [
  {
    id: "tag_1",
    label: "sunset",
    confidence: 0.95,
    category: "scene"
  },
  {
    id: "tag_2",
    label: "ocean",
    confidence: 0.89,
    category: "scene"
  },
  {
    id: "tag_3",
    label: "sailboat",
    confidence: 0.82,
    category: "object"
  }
]
```

**Backend Needs:**
The backend needs to call OpenAI Vision API to detect objects/scenes in the image:

```javascript
// Backend implementation needed
const analyzeImageTags = async (imageUrl) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this image and identify key objects, people, scenes, colors, and text visible.

Return a JSON object with tags array:
{
  "tags": [
    {"label": "sunset", "confidence": 0.95, "category": "scene"},
    {"label": "ocean", "confidence": 0.89, "category": "scene"}
  ]
}

Categories: object, person, emotion, scene, color, text
Only include tags with confidence > 0.7`
          },
          {
            type: "image_url",
            image_url: { url: imageUrl }
          }
        ]
      }
    ],
    max_tokens: 500
  });

  return JSON.parse(response.choices[0].message.content);
};
```

### 2. SEO Filename Generation (CRITICAL)

**Problem:** `seoFilename` field is undefined

**Expected:**
```javascript
{
  filename: "IMG_1234.jpg",           // Original filename
  seoFilename: "golden-retriever-puppy-playing-grass.jpg"  // AI-generated SEO name
}
```

**Backend Needs:**
When the frontend sends `autoRename=true`, the backend should:

1. Analyze the image with AI
2. Generate a descriptive, SEO-friendly filename
3. Return it in the `seoFilename` field
4. Use it as the actual stored filename

```javascript
// Backend implementation needed
const generateSEOFilename = async (aiAnalysis, fileExtension, options) => {
  if (!options.autoRename) {
    return null; // User chose to keep original
  }

  if (options.customFilename) {
    return sanitizeFilename(options.customFilename) + fileExtension;
  }

  // Auto-generate from AI tags
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Generate a concise, SEO-friendly filename for this image.

Rules:
- Maximum 60 characters (excluding extension)
- Use hyphens between words
- Only lowercase letters, numbers, and hyphens
- No stop words (the, a, an, and, or, etc.)
- Focus on descriptive, searchable keywords
- Based on the AI analysis tags provided

Example: "golden-retriever-puppy-playing-grass-sunny-day"`
      },
      {
        role: "user",
        content: `AI detected tags: ${aiAnalysis.tags.map(t => t.label).join(', ')}

Generate filename (without extension):`
      }
    ],
    max_tokens: 50
  });

  const generatedName = response.choices[0].message.content.trim();
  return sanitizeFilename(generatedName) + fileExtension;
};
```

### 3. AI Alt Text Generation (IMPORTANT)

**Problem:** `suggestedAltTexts` contains generic fallback "Image uploaded to media library"

**Expected:**
```javascript
suggestedAltTexts: [
  "Golden retriever puppy playing in green grass on a sunny day",
  "Young dog running through field with blue sky background",
  "Playful golden retriever in outdoor setting"
]
```

**Backend Needs:**
Generate descriptive alt text using OpenAI Vision:

```javascript
// Backend implementation needed
const generateAltText = async (imageUrl, count = 3) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Generate ${count} alternative text descriptions for this image for accessibility.

Requirements:
- Concise but descriptive (1-2 sentences)
- Focus on what's visible, not interpretation
- Include key objects, people, actions, and setting
- Suitable for screen readers
- Different perspectives/levels of detail

Return JSON: { "suggestions": ["alt text 1", "alt text 2", ...] }`
          },
          {
            type: "image_url",
            image_url: { url: imageUrl }
          }
        ]
      }
    ],
    max_tokens: 300
  });

  const result = JSON.parse(response.choices[0].message.content);
  return result.suggestions;
};
```

### 4. People Count & Face Detection (OPTIONAL)

**Problem:** May be working, but hard to verify without test images with people

**Expected:**
```javascript
{
  peopleCount: 2,
  faces: [
    {
      x: 0.25,      // Normalized coordinates (0-1)
      y: 0.30,
      width: 0.15,
      height: 0.20,
      emotion: "happy"
    },
    {
      x: 0.65,
      y: 0.35,
      width: 0.12,
      height: 0.18,
      emotion: "neutral"
    }
  ]
}
```

**Backend Needs:**
This requires a dedicated face detection service (not just OpenAI Vision):

- Option 1: Azure Face API
- Option 2: AWS Rekognition
- Option 3: Google Cloud Vision API
- Option 4: OpenAI Vision (can detect people count, but not precise coordinates)

## Backend API Endpoint Requirements

### POST /api/media/upload

**Request (what frontend is sending):**
```
Content-Type: multipart/form-data

file: (binary)
autoRename: "true"    // ← Frontend is sending this
spaceId: "123"        // Optional
```

**Required Response:**
```json
{
  "success": true,
  "data": {
    "id": 47,
    "filename": "original-name.jpg",
    "seoFilename": "ai-generated-seo-filename.jpg",  // ← MUST BE ADDED
    "url": "https://cdn.example.com/uploads/2025/12/01/ai-generated-seo-filename.jpg",
    "thumbnailUrl": "https://cdn.example.com/thumbnails/...",
    "size": 10610,
    "width": 1920,
    "height": 1080,
    "type": "image",
    "orientation": "landscape",
    "uploadedAt": "2025-12-01T10:30:00Z",
    "uploadedBy": {
      "id": 123,
      "name": "John Doe",
      "avatar": "https://..."
    },
    "aiAnalysis": {
      "tags": [                      // ← MUST BE POPULATED
        {
          "id": "tag_1",
          "label": "sunset",
          "confidence": 0.95,
          "category": "scene"
        }
      ],
      "suggestedAltTexts": [         // ← MUST BE AI-GENERATED
        "Beautiful sunset over ocean with sailboat"
      ],
      "dominantColors": ["#FF6B35"],  // ✅ Already working
      "peopleCount": 0,
      "faces": [],
      "moderationFlags": {
        "isAdult": false,
        "isViolent": false,
        "confidence": 0.99
      }
    },
    "altText": null,
    "title": null,
    "description": null,
    "userTags": []
  }
}
```

## Implementation Priority

### HIGH Priority (Must Have)

1. **AI Tags Detection** - Core feature for search/filtering
2. **SEO Filename Generation** - Requested feature per API spec
3. **AI Alt Text Generation** - Accessibility requirement

### MEDIUM Priority (Nice to Have)

4. **Moderation Flags** - Content safety
5. **People Count** - Useful for filtering

### LOW Priority (Optional)

6. **Face Detection with Coordinates** - Advanced feature
7. **Emotion Detection** - Advanced feature

## Backend Configuration Needed

### Environment Variables

```bash
# Backend .env
OPENAI_API_KEY=sk-...your-key...

# Feature flags
AI_ANALYSIS_ENABLED=true
SEO_FILENAME_ENABLED=true

# OpenAI settings
OPENAI_MODEL_VISION=gpt-4o
OPENAI_MODEL_TEXT=gpt-4o-mini
```

### Database Schema Updates

```sql
-- Add seoFilename column if not exists
ALTER TABLE media ADD COLUMN seo_filename VARCHAR(255);

-- Ensure aiAnalysis can store full object
ALTER TABLE media MODIFY COLUMN ai_analysis JSON;
-- or for PostgreSQL:
ALTER TABLE media ALTER COLUMN ai_analysis TYPE JSONB;
```

## Testing the Backend Changes

Once implemented, test with:

```bash
# Test upload with auto-rename
curl -X POST http://localhost:8080/api/media/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test-sunset.jpg" \
  -F "autoRename=true"

# Expected response should include:
# - seoFilename: "sunset-ocean-sailboat-horizon.jpg"
# - aiAnalysis.tags: [... array with detected objects ...]
# - aiAnalysis.suggestedAltTexts: [... AI-generated descriptions ...]
```

## Cost Estimation

For each image upload with full AI:

- **Vision Analysis (tags + people):** ~$0.005 (GPT-4o)
- **SEO Filename Generation:** ~$0.001 (GPT-4o-mini)
- **Alt Text Generation:** ~$0.002 (GPT-4o)

**Total per upload:** ~$0.008 (less than 1 cent)

For 1,000 uploads/month: ~$8/month in OpenAI costs

## Summary

**What frontend is doing correctly:**
- ✅ Sending `autoRename=true` parameter
- ✅ Ready to receive and display `seoFilename`
- ✅ Ready to display AI tags, alt text, and analysis
- ✅ UI components built for all features

**What backend needs to implement:**
1. Call OpenAI Vision API to detect tags/objects
2. Generate SEO-friendly filenames using AI
3. Generate meaningful alt text descriptions
4. Return `seoFilename` field in response
5. Populate `aiAnalysis.tags` array
6. Replace generic alt text with AI-generated ones

**Next Steps:**
1. Backend team implements OpenAI Vision integration
2. Backend team implements SEO filename generation
3. Backend team adds `seoFilename` field to response
4. Test upload and verify all fields are populated
5. Frontend will automatically display the data (already implemented)
