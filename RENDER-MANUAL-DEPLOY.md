# 🚀 Render Manual Deployment Guide - Step by Step

The blueprint failed, so we'll deploy each service manually. It's actually easier!

---

## 📋 What We'll Deploy (in order):

1. PostgreSQL Database (2 min)
2. Backend Service (3 min)
3. RAG Service (3 min)
4. Agent Service (3 min)

**Total time: ~15 minutes**

---

## STEP 1: Create PostgreSQL Database

### 1. Go to Render Dashboard
```
https://dashboard.render.com/
```

### 2. Click "New +" Button (top right)

Select **"PostgreSQL"**

### 3. Configure Database

Fill in these values:

| Field | Value |
|-------|-------|
| **Name** | `physicalai-postgres` |
| **Database** | `physicalai_db` |
| **User** | `physicalai` |
| **Region** | Choose closest to you (e.g., Oregon USA) |
| **PostgreSQL Version** | 15 (default) |
| **Datadog API Key** | Leave empty |
| **Plan** | **Free** |

### 4. Click "Create Database"

Wait ~2 minutes for it to be created.

### 5. Save Connection String

After creation, you'll see:
- **Internal Database URL**: Copy this! Looks like:
  ```
  postgresql://physicalai:xxx@dpg-xxx.oregon-postgres.render.com/physicalai_db
  ```

**Save this URL - you'll need it for the backend!**

✅ **Database Created!**

---

## STEP 2: Create Backend Service

### 1. Click "New +" Button

Select **"Web Service"**

### 2. Connect Repository

- Click **"Connect a repository"** or **"Public Git repository"**
- Paste: `https://github.com/Farhat-Naz/newhumandiod-book`
- Click **"Connect"**

### 3. Configure Service

Fill in these values:

| Field | Value |
|-------|-------|
| **Name** | `physicalai-backend` |
| **Region** | Same as database (e.g., Oregon) |
| **Branch** | `master` |
| **Root Directory** | `backend` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn src.main:app --host 0.0.0.0 --port $PORT` |
| **Plan** | **Free** |

### 4. Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these **6 variables** one by one:

**Variable 1:**
```
Key: DATABASE_URL
Value: [Paste your PostgreSQL Internal Database URL from Step 1]
```

**Variable 2:**
```
Key: JWT_SECRET
Value: 9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f
```

**Variable 3:**
```
Key: JWT_ALGORITHM
Value: HS256
```

**Variable 4:**
```
Key: ACCESS_TOKEN_EXPIRE_MINUTES
Value: 15
```

**Variable 5:**
```
Key: REFRESH_TOKEN_EXPIRE_DAYS
Value: 7
```

**Variable 6:**
```
Key: CORS_ORIGINS
Value: https://newhumandiod-book-wnk69segg-farhats-projects-27800a4d.vercel.app
```

### 5. Click "Create Web Service"

Wait ~3-5 minutes for deployment.

### 6. Save Your Backend URL

After deployment, copy the URL shown at the top:
```
https://physicalai-backend-xxxx.onrender.com
```

**Save this URL!**

✅ **Backend Deployed!**

---

## STEP 3: Create RAG Service

### 1. Click "New +" Button

Select **"Web Service"**

### 2. Connect Repository

- Same repo: `https://github.com/Farhat-Naz/newhumandiod-book`
- Click **"Connect"**

### 3. Configure Service

| Field | Value |
|-------|-------|
| **Name** | `physicalai-rag` |
| **Region** | Same as before |
| **Branch** | `master` |
| **Root Directory** | `rag` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn src.main:app --host 0.0.0.0 --port $PORT` |
| **Plan** | **Free** |

### 4. Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these **4 variables**:

**Variable 1:**
```
Key: QDRANT_URL
Value: https://9e1e7d11-6e54-420d-8d5c-72e1f16070cc.us-east4-0.gcp.cloud.qdrant.io:6333
```

**Variable 2:**
```
Key: QDRANT_API_KEY
Value: YOUR_QDRANT_API_KEY_HERE
```

**Variable 3:**
```
Key: CLAUDE_API_KEY
Value: YOUR_CLAUDE_API_KEY_HERE
```

**Variable 4:**
```
Key: CLAUDE_MODEL
Value: claude-3-5-sonnet-20241022
```

### 5. Click "Create Web Service"

Wait ~3-5 minutes.

### 6. Save Your RAG URL

Copy the URL:
```
https://physicalai-rag-xxxx.onrender.com
```

**Save this URL!**

✅ **RAG Service Deployed!**

---

## STEP 4: Create Agent Service (Optional but Recommended)

### 1. Click "New +" Button

Select **"Web Service"**

### 2. Connect Repository

- Same repo: `https://github.com/Farhat-Naz/newhumandiod-book`
- Click **"Connect"**

### 3. Configure Service

| Field | Value |
|-------|-------|
| **Name** | `physicalai-agent` |
| **Region** | Same as before |
| **Branch** | `master` |
| **Root Directory** | `agent` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `python src/main.py` |
| **Plan** | **Free** |

### 4. No Environment Variables Needed

Just skip the environment variables for now.

### 5. Click "Create Web Service"

Wait ~3-5 minutes.

✅ **Agent Service Deployed!**

---

## ✅ ALL DONE! Summary

You should now have:

1. ✅ **Database**: `physicalai-postgres` - Running
2. ✅ **Backend**: `https://physicalai-backend-xxxx.onrender.com` - Live
3. ✅ **RAG**: `https://physicalai-rag-xxxx.onrender.com` - Live
4. ✅ **Agent**: `physicalai-agent` - Live

---

## 📝 Save Your URLs

Write down your URLs here:

```
Backend URL: https://physicalai-backend-____________.onrender.com

RAG URL: https://physicalai-rag-____________.onrender.com
```

---

## 🔍 How to Check if Services Are Working

### Backend:
Visit: `https://physicalai-backend-xxxx.onrender.com/docs`
- You should see **Swagger UI** (API documentation)

### RAG:
Visit: `https://physicalai-rag-xxxx.onrender.com/health`
- You should see: `{"status": "healthy"}`

---

## 🐛 Troubleshooting

### Build Failed?
1. Click on the service
2. Click **"Logs"** tab
3. Look for error messages
4. Usually it's a missing environment variable or wrong directory

### Service shows "Deploying" for a long time?
- First deploy can take 5-10 minutes
- Check logs for progress

### Can't find "Root Directory" field?
- It might be under **"Advanced"** section
- Make sure you expand all sections

---

## ✅ Next Steps

Once all services show **"Live"** (green dot):

1. **Update Vercel** with your backend URLs
2. **Initialize database** (run migrations)
3. **Create Qdrant collection**
4. **Test everything**

I'll help you with these next steps!

---

## 🎯 Your Action NOW:

Start with **STEP 1** - Create the PostgreSQL database!

Go to: https://dashboard.render.com/

Tell me when you complete each step, and I'll help if you get stuck! 🚀

---

Built with Claude Code.
