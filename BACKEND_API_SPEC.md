# Backend API Specification for AI-Powered Media Library

## Overview

This document outlines the backend API requirements for the AI-powered media upload and analysis system. The frontend is built with Next.js and expects these endpoints to be available.

---

## Required Environment Variables

Your backend system needs these environment variables configured:

```bash
# OpenAI (for image analysis)
OPENAI_API_KEY=sk-proj-...

# AWS S3 (already configured)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Optional: For signed URLs
S3_BUCKET_URL=https://your-bucket.s3.amazonaws.com
# OR if using CloudFront
CLOUDFRONT_URL=https://d123456.cloudfront.net
```

---

## API Endpoints Required

### 1. Upload & Analyze Image

**Endpoint:** `POST /api/media/upload`

**Purpose:** Accept image upload, perform AI analysis, store in S3, return complete metadata

**Request Format:**
- Content-Type: `multipart/form-data`
- Max file size: 10MB (configurable)
- Accepted formats: JPEG, PNG, WebP, GIF

**Request Body:**
```typescript
{
  file: File, // Binary file data
  spaceId?: string, // Optional: associate with a space
  userId: string, // User uploading the file
}
```

**Processing Steps:**
1. Validate file type and size
2. Generate unique filename (use UUID or similar)
3. Perform AI analysis (see Analysis Spec below)
4. Extract dominant colors locally
5. Upload to S3 with metadata
6. Return complete analysis + S3 URL

**Response Format:**
```typescript
{
  success: true,
  data: {
    id: string, // Unique media ID
    filename: string, // Original filename
    url: string, // S3 URL or CloudFront URL
    thumbnailUrl: string, // Smaller version URL
    size: number, // File size in bytes
    width: number, // Image width in pixels
    height: number, // Image height in pixels
    type: "image", // Media type
    orientation: "portrait" | "landscape" | "square",
    uploadedAt: string, // ISO timestamp
    uploadedBy: {
      id: string,
      name: string,
      avatar: string
    },
    aiAnalysis: {
      tags: [
        {
          id: string,
          label: string,
          confidence: number, // 0-1
          category: "object" | "person" | "emotion" | "scene" | "color" | "text"
        }
      ],
      suggestedAltTexts: string[], // 3-5 suggestions, best first
      dominantColors: string[], // Array of hex colors
      peopleCount: number,
      faces?: [
        {
          x: number, // 0-1 normalized coordinates
          y: number,
          width: number,
          height: number,
          emotion?: string
        }
      ],
      moderationFlags?: {
        isAdult: boolean,
        isViolent: boolean,
        confidence: number
      }
    }
  }
}
```

**Error Response:**
```typescript
{
  success: false,
  error: {
    code: string, // "INVALID_FILE_TYPE" | "FILE_TOO_LARGE" | "AI_ANALYSIS_FAILED" | "S3_UPLOAD_FAILED"
    message: string,
    details?: any
  }
}
```

---

### 2. Analyze Existing Image (Optional but Recommended)

**Endpoint:** `POST /api/media/analyze`

**Purpose:** Re-analyze an existing image (for regenerating AI analysis)

**Request:**
```typescript
{
  imageUrl: string, // URL of image to analyze
  // OR
  imageId: string, // ID of existing media item
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    aiAnalysis: { /* Same structure as upload response */ }
  }
}
```

---

### 3. Generate Alt Text (Optional - Standalone)

**Endpoint:** `POST /api/media/generate-alt-text`

**Purpose:** Generate alt text suggestions for an image

**Request:**
```typescript
{
  imageUrl: string,
  // OR
  imageId: string,
  count?: number // Number of suggestions (default: 3)
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    suggestions: [
      "A detailed description of the image...",
      "An alternative description...",
      "Another perspective..."
    ]
  }
}
```

---

### 4. Update Media Metadata

**Endpoint:** `PATCH /api/media/:id`

**Purpose:** Update media item metadata (alt text, tags, etc.)

**Request:**
```typescript
{
  altText?: string,
  tags?: string[], // User-added tags
  title?: string,
  description?: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string,
    altText: string,
    tags: string[],
    // ... updated fields
  }
}
```

---

### 5. Get Media Library

**Endpoint:** `GET /api/media`

**Purpose:** Retrieve media items with filtering

**Query Parameters:**
```typescript
?spaceId=xyz          // Filter by space
&userId=abc           // Filter by uploader
&type=image           // Filter by type
&orientation=portrait // Filter by orientation
&tags=nature,outdoor  // Filter by tags (comma-separated)
&search=query         // Full-text search
&limit=20             // Pagination
&offset=0
&sortBy=uploadedAt    // Sort field
&sortOrder=desc       // asc or desc
```

**Response:**
```typescript
{
  success: true,
  data: {
    items: [/* Array of media items */],
    total: number,
    limit: number,
    offset: number
  }
}
```

---

## AI Analysis Implementation

### Using OpenAI GPT-4o Vision API

**Recommended Approach:**

```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function analyzeImage(imageBuffer) {
  // Convert image to base64
  const base64Image = imageBuffer.toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64Image}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o", // or "gpt-4o-mini" for lower cost
    messages: [
      {
        role: "system",
        content: `You are an expert image analyzer. Analyze images and return ONLY valid JSON with this exact structure:
{
  "tags": [{"id": "uuid-here", "label": "string", "confidence": 0.0-1.0, "category": "object|person|emotion|scene|color|text"}],
  "peopleCount": 0,
  "dominantColors": ["#hex1", "#hex2", "#hex3"],
  "suggestedAltTexts": ["text1", "text2", "text3"],
  "faces": [{"x": 0.0-1.0, "y": 0.0-1.0, "width": 0.0-1.0, "height": 0.0-1.0, "emotion": "string"}],
  "moderationFlags": {"isAdult": false, "isViolent": false, "confidence": 0.0-1.0}
}

Guidelines:
- Provide 5-15 relevant tags with accurate confidence scores
- Tags should include objects, people, emotions, scenes, and colors detected
- Order alt texts by quality (most descriptive and accessible first)
- Alt texts should be max 125 characters, descriptive but concise
- Face coordinates are normalized 0-1 relative to image dimensions
- Dominant colors should be the 3-5 most prominent hex colors
- Set moderation flags conservatively - only flag clearly inappropriate content`
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this image and provide detailed metadata in JSON format."
          },
          {
            type: "image_url",
            image_url: { url: dataUrl }
          }
        ]
      }
    ],
    max_tokens: 1000,
    temperature: 0.3, // Lower temperature for more consistent results
  });

  // Parse the response
  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const analysis = JSON.parse(jsonMatch[0]);

  return analysis;
}
```

**Error Handling:**
- Wrap in try-catch
- Return partial results if analysis fails
- Log errors for debugging
- Implement retry logic with exponential backoff

---

## Color Extraction Implementation

### Using node-vibrant (Recommended)

**Installation:**
```bash
npm install node-vibrant
```

**Implementation:**
```javascript
const Vibrant = require('node-vibrant');

async function extractColors(imageBuffer) {
  const vibrant = new Vibrant(imageBuffer);
  const palette = await vibrant.getPalette();

  // Extract dominant colors
  const colors = [];
  if (palette.Vibrant) colors.push(palette.Vibrant.getHex());
  if (palette.DarkVibrant) colors.push(palette.DarkVibrant.getHex());
  if (palette.LightVibrant) colors.push(palette.LightVibrant.getHex());
  if (palette.Muted) colors.push(palette.Muted.getHex());
  if (palette.DarkMuted) colors.push(palette.DarkMuted.getHex());

  return colors.slice(0, 5); // Return top 5 colors
}
```

---

## S3 Upload Implementation

### Using AWS SDK v3

**Installation:**
```bash
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
```

**Implementation:**
```javascript
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const sharp = require('sharp');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadToS3(fileBuffer, filename, contentType) {
  // Generate thumbnail
  const thumbnailBuffer = await sharp(fileBuffer)
    .resize(400, 400, { fit: 'inside' })
    .jpeg({ quality: 85 })
    .toBuffer();

  // Upload original
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `media/originals/${filename}`,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: 'public-read', // or 'private' with signed URLs
    Metadata: {
      uploadedAt: new Date().toISOString(),
    },
  };

  await s3Client.send(new PutObjectCommand(uploadParams));

  // Upload thumbnail
  const thumbnailParams = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `media/thumbnails/${filename}`,
    Body: thumbnailBuffer,
    ContentType: 'image/jpeg',
    ACL: 'public-read',
  };

  await s3Client.send(new PutObjectCommand(thumbnailParams));

  // Return URLs
  const baseUrl = process.env.CLOUDFRONT_URL ||
                  `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`;

  return {
    url: `${baseUrl}/media/originals/${filename}`,
    thumbnailUrl: `${baseUrl}/media/thumbnails/${filename}`,
  };
}
```

---

## Image Processing

### Using Sharp

**Installation:**
```bash
npm install sharp
```

**Get Image Dimensions and Metadata:**
```javascript
const sharp = require('sharp');

async function getImageMetadata(imageBuffer) {
  const metadata = await sharp(imageBuffer).metadata();

  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: imageBuffer.length,
    orientation: metadata.width > metadata.height ? 'landscape' :
                 metadata.width < metadata.height ? 'portrait' : 'square',
  };
}
```

---

## Complete Upload Flow Example

```javascript
const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

app.post('/api/media/upload', upload.single('file'), async (req, res) => {
  try {
    const { buffer, originalname, mimetype } = req.file;
    const { userId, spaceId } = req.body;

    // 1. Generate unique filename
    const fileId = uuidv4();
    const ext = originalname.split('.').pop();
    const filename = `${fileId}.${ext}`;

    // 2. Get image metadata
    const metadata = await getImageMetadata(buffer);

    // 3. Perform AI analysis in parallel with color extraction
    const [aiAnalysis, colors] = await Promise.all([
      analyzeImage(buffer),
      extractColors(buffer),
    ]);

    // 4. Combine colors into AI analysis
    aiAnalysis.dominantColors = colors;

    // 5. Upload to S3
    const { url, thumbnailUrl } = await uploadToS3(buffer, filename, mimetype);

    // 6. Save to database (your implementation)
    const mediaItem = await saveToDatabase({
      id: fileId,
      filename: originalname,
      url,
      thumbnailUrl,
      ...metadata,
      aiAnalysis,
      userId,
      spaceId,
      uploadedAt: new Date(),
    });

    // 7. Return response
    res.json({
      success: true,
      data: mediaItem,
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: error.code || 'UPLOAD_FAILED',
        message: error.message,
      },
    });
  }
});
```

---

## Security Considerations

### 1. File Validation
```javascript
// Validate file type by checking file signature (magic numbers)
const fileType = require('file-type');

async function validateFileType(buffer) {
  const type = await fileType.fromBuffer(buffer);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!type || !allowedTypes.includes(type.mime)) {
    throw new Error('Invalid file type');
  }

  return type;
}
```

### 2. File Size Limits
- Enforce at multer level: 10MB max
- Additional check in route handler
- Return clear error messages

### 3. Sanitize Filenames
```javascript
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase();
}
```

### 4. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 uploads per 15 minutes
  message: 'Too many uploads, please try again later',
});

app.post('/api/media/upload', uploadLimiter, upload.single('file'), ...);
```

### 5. Authentication
- Verify JWT token or session
- Check user permissions
- Associate uploads with authenticated user

### 6. S3 Security
- Use IAM roles with minimal permissions
- Enable bucket versioning
- Set up CORS properly
- Consider using signed URLs instead of public-read ACL

---

## Performance Optimization

### 1. Caching
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour

// Cache AI analysis results by image hash
const crypto = require('crypto');

function getImageHash(buffer) {
  return crypto.createHash('md5').update(buffer).digest('hex');
}

async function analyzeImageWithCache(buffer) {
  const hash = getImageHash(buffer);
  const cached = cache.get(hash);

  if (cached) {
    return cached;
  }

  const analysis = await analyzeImage(buffer);
  cache.set(hash, analysis);

  return analysis;
}
```

### 2. Queue System (for batch uploads)
```javascript
const Bull = require('bull');

const imageQueue = new Bull('image-processing', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// Add to queue
imageQueue.add('analyze', { imageId, buffer });

// Process queue
imageQueue.process('analyze', async (job) => {
  const { imageId, buffer } = job.data;
  const analysis = await analyzeImage(buffer);
  await updateDatabase(imageId, { aiAnalysis: analysis });
});
```

### 3. Concurrent Processing
- Use `Promise.all()` for parallel AI + color extraction
- Set OpenAI timeout to 30 seconds
- Implement retry logic with exponential backoff

---

## Database Schema Recommendations

```sql
CREATE TABLE media_items (
  id UUID PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  size INTEGER,
  width INTEGER,
  height INTEGER,
  type VARCHAR(50),
  orientation VARCHAR(20),

  -- AI Analysis (stored as JSONB for flexibility)
  ai_analysis JSONB,

  -- User metadata
  alt_text TEXT,
  user_tags TEXT[],
  title VARCHAR(255),
  description TEXT,

  -- Relations
  user_id UUID NOT NULL,
  space_id UUID,

  -- Timestamps
  uploaded_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Indexes
  INDEX idx_user_id (user_id),
  INDEX idx_space_id (space_id),
  INDEX idx_uploaded_at (uploaded_at),
  INDEX idx_ai_tags USING GIN ((ai_analysis->'tags'))
);
```

---

## Testing

### Sample Test Cases

1. **Valid Image Upload**
   - Upload JPEG, PNG, WebP, GIF
   - Verify AI analysis returned
   - Verify S3 URLs are accessible

2. **Invalid File Type**
   - Upload PDF, TXT, etc.
   - Expect 400 error with clear message

3. **File Too Large**
   - Upload > 10MB file
   - Expect 413 error

4. **AI Analysis Failure**
   - Mock OpenAI timeout
   - Verify graceful degradation

5. **S3 Upload Failure**
   - Mock S3 error
   - Verify error handling

---

## Monitoring & Logging

### Recommended Metrics

1. **Upload Success Rate**
   - Track successful vs failed uploads
   - Alert if < 95%

2. **AI Analysis Latency**
   - Track p50, p95, p99 response times
   - Alert if p95 > 5 seconds

3. **S3 Upload Latency**
   - Monitor upload times
   - Alert if consistently slow

4. **Error Rates by Type**
   - File validation errors
   - AI analysis errors
   - S3 errors

### Logging Example
```javascript
const logger = require('winston');

logger.info('Image upload started', {
  userId,
  filename: originalname,
  size: buffer.length,
});

logger.info('AI analysis completed', {
  userId,
  fileId,
  tagsCount: aiAnalysis.tags.length,
  processingTimeMs: Date.now() - startTime,
});

logger.error('Upload failed', {
  userId,
  error: error.message,
  stack: error.stack,
});
```

---

## Cost Estimation

### OpenAI Vision API
- **Model:** gpt-4o (recommended)
- **Cost:** ~$0.01 per high-res image
- **Processing time:** 2-5 seconds average

### Alternative: gpt-4o-mini
- **Cost:** ~$0.003 per image (70% cheaper)
- **Trade-off:** Slightly less detailed analysis
- **Recommended for:** High-volume use cases

### Node Vibrant (Color Extraction)
- **Cost:** Free (local processing)
- **Processing time:** < 100ms

### S3 Storage
- **Storage:** $0.023 per GB/month
- **Requests:** $0.005 per 1,000 PUT requests
- **Transfer:** First 100GB free/month

---

## Support & Resources

### OpenAI Documentation
- [Vision API Guide](https://platform.openai.com/docs/guides/vision)
- [Error Handling](https://platform.openai.com/docs/guides/error-codes)
- [Rate Limits](https://platform.openai.com/docs/guides/rate-limits)

### AWS S3 Documentation
- [SDK v3 Guide](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-examples.html)
- [Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html)

### Libraries
- [Sharp](https://sharp.pixelplumbing.com/) - Image processing
- [node-vibrant](https://github.com/Vibrant-Colors/node-vibrant) - Color extraction
- [multer](https://github.com/expressjs/multer) - File upload handling

---

## Questions?

Contact the frontend team for:
- TypeScript type definitions
- API response format clarifications
- Frontend integration requirements

---

**Document Version:** 1.0
**Last Updated:** 2025-01-30
**Maintained By:** Frontend Team
