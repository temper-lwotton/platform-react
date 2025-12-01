# Backend CORS Configuration Required

## Problem

The frontend at `http://localhost:3000` is being blocked by CORS policy when making requests to `http://localhost:8080/api/media`.

**Error:**
```
Access to fetch at 'http://localhost:8080/api/media?sortOrder=desc' from origin 'http://localhost:3000'
has been blocked by CORS policy: Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solution

The backend needs to add CORS middleware to allow requests from the frontend origin.

### Required CORS Headers

The backend must send these headers in responses:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### Implementation Examples

#### Node.js / Express

Install the `cors` package:

```bash
npm install cors
```

Add CORS middleware:

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000',  // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Your routes...
app.use('/api/media', mediaRoutes);
```

#### Node.js / Fastify

Install the `@fastify/cors` plugin:

```bash
npm install @fastify/cors
```

Add CORS plugin:

```javascript
const fastify = require('fastify')();

// Register CORS
await fastify.register(require('@fastify/cors'), {
  origin: 'http://localhost:3000',  // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Your routes...
fastify.register(mediaRoutes, { prefix: '/api/media' });
```

#### Go / Gin

Install the CORS middleware:

```bash
go get github.com/gin-contrib/cors
```

Add CORS middleware:

```go
package main

import (
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

func main() {
    r := gin.Default()

    // Configure CORS
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Content-Type", "Authorization"},
        AllowCredentials: true,
    }))

    // Your routes...
    r.Group("/api/media")
}
```

#### Python / Flask

Install Flask-CORS:

```bash
pip install flask-cors
```

Add CORS support:

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Your routes...
```

#### Python / FastAPI

FastAPI has built-in CORS middleware:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Your routes...
```

### Production Configuration

For production, replace `http://localhost:3000` with your actual frontend domain(s):

```javascript
// Example for multiple environments
const allowedOrigins = [
  'http://localhost:3000',           // Development
  'https://yourdomain.com',          // Production
  'https://staging.yourdomain.com'   // Staging
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Environment Variables

Consider using environment variables for configuration:

```bash
# .env
FRONTEND_URL=http://localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

```javascript
// Load from environment
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Testing CORS

After implementing CORS, verify it works:

### Test with curl

```bash
# Test preflight request
curl -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  -i http://localhost:8080/api/media

# Should return:
# Access-Control-Allow-Origin: http://localhost:3000
# Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
# Access-Control-Allow-Headers: Content-Type, Authorization
```

### Test with browser

1. Open browser DevTools (F12)
2. Go to Network tab
3. Reload the `/media-library` page
4. Look for the request to `http://localhost:8080/api/media`
5. Check the Response Headers for `Access-Control-Allow-Origin`

## Troubleshooting

### Still seeing CORS errors?

1. **Restart your backend server** after adding CORS configuration
2. **Clear browser cache** (Ctrl+Shift+R / Cmd+Shift+R)
3. **Check CORS middleware order** - CORS must be added BEFORE routes
4. **Verify the origin** matches exactly (no trailing slash)
5. **Check for multiple CORS middleware** - only configure once

### Common Mistakes

❌ Adding CORS middleware AFTER routes
```javascript
app.use('/api/media', mediaRoutes);
app.use(cors());  // Too late! Move this before routes
```

✅ Correct order
```javascript
app.use(cors());  // First
app.use('/api/media', mediaRoutes);  // Then routes
```

❌ Wrong origin format
```javascript
origin: 'http://localhost:3000/'  // Don't include trailing slash
```

✅ Correct format
```javascript
origin: 'http://localhost:3000'  // No trailing slash
```

## Summary

**Action Required:** Backend team needs to add CORS middleware to allow requests from `http://localhost:3000`.

**Quick Fix (Express):**
```bash
npm install cors
```

```javascript
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
```

**Then restart the backend server!**
