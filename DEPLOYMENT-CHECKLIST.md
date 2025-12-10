# 🚀 Production Deployment Checklist

Use this checklist to track your deployment progress.

## 📋 Pre-Deployment

- [ ] Claude API Key obtained from console.anthropic.com
- [ ] Vercel account created (vercel.com)
- [ ] Render account created (render.com)
- [ ] GitHub repository: https://github.com/Farhat-Naz/newhumandiod-book

---

## 1️⃣ Deploy Website to Vercel

**URL**: https://vercel.com/new

### Steps:
- [ ] Clicked "Import Project"
- [ ] Selected GitHub repository: `Farhat-Naz/newhumandiod-book`
- [ ] ⚠️ **Changed Root Directory to: `website`**
- [ ] Added environment variable: `NODE_ENV=production`
- [ ] Clicked "Deploy"
- [ ] ✅ Deployment successful

### Save Your URL:
```
Vercel Website URL: https://________________________________.vercel.app
```

**Test**: Open the URL - you should see your website homepage!

---

## 2️⃣ Set Up Qdrant Cloud

**URL**: https://cloud.qdrant.io/signup

### Steps:
- [ ] Signed up for free account
- [ ] Clicked "Create Cluster"
- [ ] Selected "Free Tier" (1GB)
- [ ] Chose cluster name: `physicalai-vectors`
- [ ] Clicked "Create"
- [ ] Copied Cluster URL
- [ ] Created API Key
- [ ] ✅ Qdrant Cloud ready

### Save Your Credentials:
```
Qdrant URL: https://________________________________.qdrant.io:6333

Qdrant API Key: ________________________________________
```

---

## 3️⃣ Deploy Backend to Render

**URL**: https://render.com/deploy?repo=https://github.com/Farhat-Naz/newhumandiod-book

### Steps:
- [ ] Connected GitHub account
- [ ] Authorized Render access
- [ ] Reviewed 4 services to be created:
  - [ ] physicalai-postgres (Database)
  - [ ] physicalai-backend (API)
  - [ ] physicalai-rag (Chatbot)
  - [ ] physicalai-agent (Translation)

### Environment Variables Entered:

**Backend Service:**
- [ ] `CORS_ORIGINS` = [Your Vercel URL]

**RAG Service:**
- [ ] `QDRANT_URL` = [Your Qdrant URL]
- [ ] `QDRANT_API_KEY` = [Your Qdrant API Key]
- [ ] `CLAUDE_API_KEY` = [Your Claude API Key]

**Agent Service:**
- [ ] (Optional) `TRANSLATION_API_KEY`

- [ ] Clicked "Apply" to create services
- [ ] Waited for all services to deploy (5-10 min)
- [ ] ✅ All services deployed successfully

### Save Your URLs:
```
Backend URL: https://physicalai-backend.________________________________.com

RAG URL: https://physicalai-rag.________________________________.com

Agent URL: https://physicalai-agent.________________________________.com
```

**Test Backend**: Visit `https://physicalai-backend.onrender.com/docs` - should see Swagger UI

**Test RAG**: Visit `https://physicalai-rag.onrender.com/health` - should return `{"status": "healthy"}`

---

## 4️⃣ Update Vercel Environment Variables

**URL**: Go to your Vercel project → Settings → Environment Variables

### Steps:
- [ ] Opened Vercel project settings
- [ ] Clicked "Environment Variables"
- [ ] Added `BACKEND_API_URL` = [Your Backend URL]
- [ ] Added `RAG_WS_URL` = wss://physicalai-rag.[your-domain].com
- [ ] Clicked "Save"
- [ ] Triggered redeploy (Deployments → Redeploy)
- [ ] ✅ Vercel redeployed with new variables

---

## 5️⃣ Initialize Database

**URL**: Render Dashboard → physicalai-backend → Shell

### Run These Commands:

```bash
# 1. Run database migrations
alembic upgrade head

# 2. Seed initial roles
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
    print('Roles seeded successfully!')
"
```

### Checklist:
- [ ] Opened Render dashboard
- [ ] Found `physicalai-backend` service
- [ ] Clicked "Shell" tab
- [ ] Ran migration command
- [ ] Saw success message
- [ ] Ran seed roles command
- [ ] Saw "Roles seeded successfully!"
- [ ] ✅ Database initialized

---

## 6️⃣ Initialize Qdrant Collection

**URL**: Render Dashboard → physicalai-rag → Shell

### Run This Command:

```bash
python -c "
from src.core.qdrant_client import get_qdrant_client
from qdrant_client.models import Distance, VectorParams

client = get_qdrant_client()
client.create_collection(
    collection_name='course_chapters',
    vectors_config=VectorParams(size=1024, distance=Distance.COSINE)
)
print('✓ Collection created successfully!')
"
```

### Checklist:
- [ ] Opened Render dashboard
- [ ] Found `physicalai-rag` service
- [ ] Clicked "Shell" tab
- [ ] Ran collection creation command
- [ ] Saw success message
- [ ] ✅ Qdrant collection created

---

## 7️⃣ Final Verification

### Test All Services:

**Website:**
- [ ] Opened: [Your Vercel URL]
- [ ] Homepage loads correctly
- [ ] Can navigate to documentation
- [ ] Dark/light mode works
- [ ] ✅ Website working

**Backend API:**
- [ ] Opened: `https://physicalai-backend.onrender.com/docs`
- [ ] Swagger UI loads
- [ ] Tried `/health` endpoint - returns 200
- [ ] ✅ Backend API working

**RAG Service:**
- [ ] Opened: `https://physicalai-rag.onrender.com/health`
- [ ] Returns: `{"status": "healthy"}`
- [ ] ✅ RAG service working

**Authentication:**
- [ ] Tried signing up on website
- [ ] User created successfully
- [ ] Can log in
- [ ] ✅ Authentication working

**RAG Chatbot (if website integrated):**
- [ ] Opened chatbot on website
- [ ] Asked a test question
- [ ] Received AI response
- [ ] ✅ Chatbot working

---

## 🎉 Deployment Complete!

### Your Live Platform:

```
🌐 Website: https://________________________________.vercel.app
⚙️ Backend: https://physicalai-backend.________________________________.com
🤖 RAG API: https://physicalai-rag.________________________________.com
🔍 API Docs: https://physicalai-backend.________________________________.com/docs
```

---

## 🔄 Post-Deployment Tasks

### Optional but Recommended:

- [ ] Set up custom domain (Vercel → Domains)
- [ ] Enable Vercel Analytics
- [ ] Set up Render alerts
- [ ] Configure monitoring (Sentry, LogRocket)
- [ ] Index full course content in Qdrant
- [ ] Set up backup strategy
- [ ] Add team members

---

## 🐛 Troubleshooting

### Website won't load:
- Check Vercel deployment logs
- Verify Root Directory is set to `website`
- Ensure build completed successfully

### Backend returns 500 errors:
- Check Render logs for backend service
- Verify DATABASE_URL is set (auto-generated)
- Check JWT_SECRET is set (auto-generated)

### RAG chatbot not working:
- Verify CLAUDE_API_KEY is valid
- Check QDRANT_URL and QDRANT_API_KEY
- Ensure collection was created
- Check Render logs for RAG service

### CORS errors in browser console:
- Verify CORS_ORIGINS includes your Vercel URL
- Must include https:// protocol
- Restart backend service after changing

### Database connection failed:
- Check PostgreSQL service is running
- Verify DATABASE_URL in backend env vars
- Check Render database status

---

## 📊 Service Status Dashboard

Use these URLs to monitor your services:

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com/
- **Qdrant Dashboard**: https://cloud.qdrant.io/

---

## 💰 Cost Estimate

**Monthly costs** (based on free/starter tiers):

- Vercel: **$0** (Hobby tier)
- Render:
  - PostgreSQL: **$7** (Starter)
  - 3 web services: **$21** ($7 each)
- Qdrant Cloud: **$0** (Free 1GB)
- Anthropic Claude API: **~$5-20** (usage-based)

**Total: ~$33-48/month** for moderate traffic

---

## 🎯 Next Steps

1. **Test everything thoroughly**
2. **Add real course content**
3. **Index content in Qdrant**
4. **Invite beta testers**
5. **Set up monitoring**
6. **Configure custom domain** (optional)
7. **Plan scaling strategy**

---

**Congratulations! Your Physical AI & Humanoid Robotics Learning Platform is now live!** 🎉

---

Built with Claude Code.
