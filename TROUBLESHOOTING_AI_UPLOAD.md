# Troubleshooting: AI Analysis & SEO Filenames Not Working

## Problem

After uploading images, the following features are not working:
- ❌ No AI tags being returned
- ❌ No people recognition data
- ❌ No SEO filename being generated
- ❌ No color analysis
- ❌ AI analysis object is null or empty

## Debugging Steps
So tis
### Step 1: Check Browser Console Logs

With the new debug logging, upload an image and check the browser console for:

```
🚀 Uploading with options: { spaceId: X, autoRename: true }
Upload API Response: { success: true, data: {...} }
Media Item: { id: X, filename: "...", ... }
AI Analysis: null  ← THIS IS THE PROBLEM
SEO Filename: undefined  ← THIS IS THE PROBLEM
✅ Upload complete. Media item: {...}
🤖 AI Analysis: null
📝 SEO Filename: undefined
```

**What to look for:**
- If `AI Analysis: null` → Backend is not processing images with AI
- If `SEO Filename: undefined` → Backend is not generating SEO filenames
- If you see a full response but analysis is missing → Backend AI integration is broken

### Step 2: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Upload an image
4. Find the request to `http://localhost:8080/api/media/upload`
5. Click on it and check:

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data
```

**Form Data:**
```
file: (binary)
autoRename: true  ← Check this is being sent
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "filename": "original.jpg",
    "seoFilename": "ai-generated-seo-name.jpg",  ← Should be present
    "aiAnalysis": {  ← Should be present
      "tags": [...],
      "suggestedAltTexts": [...],
      "dominantColors": [...],
      "peopleCount": 0,
      "faces": [],
      "moderationFlags": {...}
    },
    ...
  }
}
```

### Step 3: Test Backend Directly

Test the backend API directly with curl:

```bash
# Replace with a real image file path
curl -X POST http://localhost:8080/api/media/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/test-image.jpg" \
  -F "autoRename=true"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "seoFilename": "beach-sunset-ocean-waves.jpg",
    "aiAnalysis": {
      "tags": [
        {
          "id": "tag_1",
          "label": "sunset",
          "confidence": 0.95,
          "category": "scene"
        }
      ],
      "dominantColors": ["#FF6B35", "#F7931E"],
      "peopleCount": 0
    }
  }
}
```

**If AI analysis is missing:** The backend is not processing images properly.

### Step 4: Check Backend Logs

Look at your backend server logs when uploading. You should see:

```
[INFO] Image uploaded: sunset.jpg
[INFO] Starting AI analysis...
[INFO] OpenAI API call: vision analysis
[INFO] AI analysis complete
[INFO] Generating SEO filename...
[INFO] SEO filename generated: vibrant-sunset-ocean-horizon.jpg
```

**If you see errors:**
- `OpenAI API key missing` → Backend environment variables not set
- `OpenAI API error: 401` → Invalid API key
- `AI analysis timeout` → OpenAI API is slow/down
- `SEO generation skipped` → Feature is disabled in backend settings

### Step 5: Check Backend Environment Variables

The backend needs these environment variables:

```bash
# .env (Backend)
OPENAI_API_KEY=sk-...your-key-here...
AI_ANALYSIS_ENABLED=true
SEO_FILENAME_ENABLED=true
```

**Verify in backend:**
```bash
# SSH into backend or check logs
echo $OPENAI_API_KEY  # Should output sk-...
echo $AI_ANALYSIS_ENABLED  # Should output true
echo $SEO_FILENAME_ENABLED  # Should output true
```

### Step 6: Verify Backend API Implementation

The backend should be following this flow:

```javascript
// Backend: /api/media/upload handler

async function uploadMedia(req, res) {
  // 1. Upload file to storage
  const file = await saveFile(req.file);

  // 2. Analyze with AI (THIS MIGHT BE MISSING)
  const aiAnalysis = await analyzeImageWithAI(file.url);

  // 3. Generate SEO filename (THIS MIGHT BE MISSING)
  const seoFilename = await generateSEOFilename(aiAnalysis, req.body.autoRename);

  // 4. Save to database
  const mediaItem = await db.media.create({
    filename: file.originalName,
    seoFilename: seoFilename,  // ← Must be saved
    aiAnalysis: aiAnalysis,    // ← Must be saved
    ...
  });

  // 5. Return response
  return res.json({
    success: true,
    data: mediaItem  // Must include aiAnalysis and seoFilename
  });
}
```

**Common Backend Issues:**

1. **AI Analysis Not Called**
   - Backend might skip AI analysis by default
   - Need to enable it in settings or per-upload

2. **SEO Filename Generation Not Implemented**
   - Backend might not have SEO filename feature yet
   - Need to implement according to the API spec

3. **Database Schema Missing Fields**
   - `seoFilename` column not in database
   - `aiAnalysis` column not in database

4. **AI Analysis Runs But Not Returned**
   - Backend processes it but doesn't include in response
   - Check response serialization

## Common Solutions

### Solution 1: Backend Not Processing AI

**Problem:** Backend uploads files but doesn't analyze them

**Fix:** Backend needs to implement AI analysis:

```javascript
// Backend needs OpenAI integration
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function analyzeImageWithAI(imageUrl) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Analyze this image and provide tags, dominant colors, and people count." },
        { type: "image_url", image_url: { url: imageUrl } }
      ]
    }]
  });

  // Parse and return analysis
  return {
    tags: [...],
    dominantColors: [...],
    peopleCount: 0,
    suggestedAltTexts: [...]
  };
}
```

### Solution 2: CORS Issues

**Problem:** Frontend can't reach backend

**Fix:** See `BACKEND_CORS_SETUP.md`

```javascript
// Backend needs CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Solution 3: Missing OpenAI API Key

**Problem:** Backend can't call OpenAI API

**Fix:** Add API key to backend .env:

```bash
# Backend .env
OPENAI_API_KEY=sk-your-actual-key-here
```

Then restart backend server.

### Solution 4: Database Schema Missing

**Problem:** Backend database doesn't have AI fields

**Fix:** Run migration to add columns:

```sql
-- Add seoFilename column
ALTER TABLE media ADD COLUMN seo_filename VARCHAR(255);

-- Add aiAnalysis column (JSON)
ALTER TABLE media ADD COLUMN ai_analysis JSONB;
```

### Solution 5: Feature Disabled

**Problem:** Backend has feature but it's disabled

**Fix:** Check backend settings/config and enable:

```javascript
// Backend config
{
  "ai_analysis": {
    "enabled": true,  // ← Make sure this is true
    "provider": "openai"
  },
  "seo_filename": {
    "enabled": true,  // ← Make sure this is true
    "max_length": 60
  }
}
```

## Quick Test Checklist

Run through this checklist:

- [ ] Backend is running on `http://localhost:8080`
- [ ] CORS is configured to allow `http://localhost:3000`
- [ ] OpenAI API key is set in backend environment
- [ ] AI analysis is enabled in backend config
- [ ] SEO filename generation is enabled in backend config
- [ ] Database has `seo_filename` and `ai_analysis` columns
- [ ] Upload endpoint returns `aiAnalysis` in response
- [ ] Upload endpoint returns `seoFilename` in response
- [ ] Browser console shows upload logs (🚀, ✅, 🤖, 📝)
- [ ] Network tab shows 200 response with complete data
- [ ] No CORS errors in console
- [ ] JWT token is present and valid

## Still Not Working?

If you've checked everything above and it's still not working:

1. **Check Backend Logs** - Look for errors during upload
2. **Test Without AI** - Try uploading without `autoRename=true`
3. **Verify OpenAI Quota** - Check if you've hit API limits
4. **Check Backend Version** - Ensure backend implements the latest spec
5. **Contact Backend Team** - Share the API response and ask them to debug

## Example of Working Response

This is what you should see in the console when everything works:

```javascript
🚀 Uploading with options: { autoRename: true }

Upload API Response: {
  success: true,
  data: {
    id: 123,
    filename: "IMG_1234.jpg",
    seoFilename: "golden-retriever-puppy-playing-grass.jpg",
    url: "https://cdn.example.com/2025/12/01/golden-retriever-puppy-playing-grass.jpg",
    aiAnalysis: {
      tags: [
        { id: "tag_1", label: "dog", confidence: 0.98, category: "object" },
        { id: "tag_2", label: "puppy", confidence: 0.95, category: "object" },
        { id: "tag_3", label: "grass", confidence: 0.87, category: "scene" }
      ],
      dominantColors: ["#4CAF50", "#8BC34A", "#FFC107"],
      peopleCount: 0,
      faces: [],
      suggestedAltTexts: [
        "Golden retriever puppy playing in green grass on sunny day"
      ],
      moderationFlags: {
        isAdult: false,
        isViolent: false,
        confidence: 0.99
      }
    }
  }
}

✅ Upload complete. Media item: {...}
🤖 AI Analysis: { tags: [...], dominantColors: [...], peopleCount: 0 }
📝 SEO Filename: golden-retriever-puppy-playing-grass.jpg
```

## Next Steps

1. **Try uploading an image** and check the console logs
2. **Check the Network tab** to see the actual API response
3. **Share the console logs** with the backend team if AI data is missing
4. **Verify backend implementation** against the API spec document

The frontend is correctly configured - the issue is likely on the backend side with:
- AI analysis not being performed
- SEO filename not being generated
- Missing environment variables
- Database schema issues
- Features being disabled
