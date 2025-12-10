# Quick Deployment Guide - Do This Now!

Follow these steps in order. Each should take 2-5 minutes.

---

## Step 1: Deploy Website to Vercel (2 minutes)

### Open This URL:
**https://vercel.com/new**

### Instructions:
1. Click "Import Project"
2. Select "Import Git Repository"
3. Paste: `https://github.com/Farhat-Naz/newhumandiod-book`
4. Click "Import"

### Configuration:
- **Framework Preset**: Docusaurus (auto-detected)
- **Root Directory**: `website` ← **IMPORTANT: Click "Edit" and change this!**
- **Build Command**: `npm run build` (default is fine)
- **Output Directory**: `build` (default is fine)
- **Install Command**: `npm install` (default is fine)

### Environment Variables (Add These):
Click "Environment Variables" and add:
```
NODE_ENV=production
```

5. Click **"Deploy"**
6. Wait 2-3 minutes for build
7. **SAVE THE URL** (e.g., `https://your-app-xyz.vercel.app`)

---

## Step 2: Deploy to Render (One-Click) (5 minutes)

### Open This URL:
**https://render.com/deploy?repo=https://github.com/Farhat-Naz/newhumandiod-book**

This will use the `render.yaml` file to create all services automatically!

### What Render Will Create:
- ✅ PostgreSQL Database (free tier)
- ✅ Backend API Service
- ✅ RAG Service
- ✅ Agent Service

### Required Environment Variables:

After clicking "Deploy", Render will ask for these:

#### For RAG Service:
```
QDRANT_URL = (we'll add this in Step 3)
QDRANT_API_KEY = (we'll add this in Step 3)
CLAUDE_API_KEY = sk-ant-api03-... (your Claude API key)
```

#### For Backend:
```
CORS_ORIGINS = https://your-vercel-url.vercel.app (from Step 1)
```

**Note**: Database URL and JWT_SECRET will be auto-generated!

5. Click **"Apply"**
6. Wait 5-10 minutes for all services to deploy
7. **SAVE THE URLs** for:
   - Backend: `https://physicalai-backend.onrender.com`
   - RAG: `https://physicalai-rag.onrender.com`

---

## Step 3: Set Up Qdrant Cloud (3 minutes)

### Open This URL:
**https://cloud.qdrant.io/signup**

### Instructions:
1. Sign up for free account (no credit card required)
2. Click "Create Cluster"
3. Choose **Free Tier** (1GB storage)
4. Select region closest to you
5. Click "Create"

### Get Your Credentials:
After cluster is created:
1. Click on your cluster name
2. Copy **"Cluster URL"** (e.g., `https://xyz.qdrant.io`)
3. Click "API Keys" → "Create API Key"
4. Copy the API key

### Update Render Environment Variables:
1. Go back to Render dashboard
2. Find "physicalai-rag" service
3. Click "Environment" tab
4. Update:
   ```
   QDRANT_URL = https://xyz.qdrant.io
   QDRANT_API_KEY = your-api-key-here
   ```
5. Click "Save Changes" (service will auto-redeploy)

---

## Step 4: Update Vercel Environment Variables (1 minute)

Go back to your Vercel project:
1. Go to Project Settings → Environment Variables
2. Add:
   ```
   BACKEND_API_URL=https://physicalai-backend.onrender.com
   RAG_WS_URL=wss://physicalai-rag.onrender.com
   ```
3. Redeploy: Go to "Deployments" → Click "..." → "Redeploy"

---

## Step 5: Run Database Setup (2 minutes)

### In Render Dashboard:

1. Go to "physicalai-backend" service
2. Click "Shell" tab
3. Run these commands:

```bash
# Run database migrations
alembic upgrade head

# Seed initial roles
python -c "
from src.core.database import engine, Base
from src.models import Role
from sqlalchemy.orm import Session

Base.metadata.create_all(engine)

with Session(engine) as session:
    roles = [
        Role(name='student', description='Student role'),
        Role(name='instructor', description='Instructor role'),
        Role(name='admin', description='Administrator role')
    ]
    for role in roles:
        existing = session.query(Role).filter_by(name=role.name).first()
        if not existing:
            session.add(role)
    session.commit()
    print('Roles seeded successfully')
"
```

---

## Step 6: Index Course Content in Qdrant (3 minutes)

### In Render Dashboard:

1. Go to "physicalai-rag" service
2. Click "Shell" tab
3. Run:

```bash
# Create a simple indexing script
python -c "
from src.core.qdrant_client import get_qdrant_client
from qdrant_client.models import Distance, VectorParams

# Create collection
client = get_qdrant_client()
client.create_collection(
    collection_name='course_chapters',
    vectors_config=VectorParams(size=1024, distance=Distance.COSINE)
)
print('Collection created successfully!')
"
```

**Note**: Full content indexing will be done via a separate script later.

---

## Step 7: Verify Everything Works! ✅

### Test Your Website:
1. Go to your Vercel URL: `https://your-app.vercel.app`
2. Should see the Physical AI & Robotics homepage
3. Try navigating to docs

### Test Backend API:
1. Go to: `https://physicalai-backend.onrender.com/docs`
2. Should see FastAPI Swagger UI
3. Try the `/health` endpoint

### Test RAG Service:
1. Go to: `https://physicalai-rag.onrender.com/health`
2. Should return: `{"status": "healthy"}`

---

## 🎉 You're Live!

Your platform is now deployed:

- **Website**: https://your-vercel-url.vercel.app
- **Backend API**: https://physicalai-backend.onrender.com
- **RAG Service**: https://physicalai-rag.onrender.com

### Next Steps:
- [ ] Add custom domain (optional)
- [ ] Set up monitoring/alerts
- [ ] Index all course chapters
- [ ] Invite test users

---

## Troubleshooting

### Vercel build fails:
- Check that Root Directory is set to `website`
- Verify Node.js version in logs (should be 18+)

### Render services won't start:
- Check environment variables are set correctly
- View logs in the "Logs" tab
- Ensure PostgreSQL is running first

### RAG returns errors:
- Verify CLAUDE_API_KEY is valid
- Check QDRANT_URL and API key
- Ensure collection was created

---

## Need Help?

If you run into issues:
1. Check service logs in Render dashboard
2. Check build logs in Vercel
3. Verify all environment variables are set

---

**Total Time: ~15-20 minutes**

Built with Claude Code.
