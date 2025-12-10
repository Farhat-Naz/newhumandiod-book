# 🚀 Quick Start Guide

Your Physical AI & Humanoid Robotics Learning Platform is ready to deploy!

## ✅ What's Been Done

1. ✅ **Code Pushed to GitHub**: https://github.com/Farhat-Naz/newhumandiod-book
2. ✅ **Environment Variables Set Up**: Local `.env` file created with secure JWT secret
3. ✅ **Deployment Configuration**: Ready for Vercel and Render
4. ✅ **Documentation**: Complete guides for setup and deployment

## 🔑 Next Step: Add Your Claude API Key

You need to add your Claude API key to start using the platform.

### Option 1: Quick Manual Edit (30 seconds)

1. Open the file: `D:\quarterr 4\new-book\book-assignment\.env`
2. Find line 34: `CLAUDE_API_KEY=sk-ant-api03-YOUR_ACTUAL_CLAUDE_API_KEY_HERE`
3. Replace with your actual key from: https://console.anthropic.com/
4. Save the file

### Option 2: Interactive Setup Script

**Windows (PowerShell)**:
```powershell
cd book-assignment
.\setup-env.ps1
# Choose option 1 for Local Development
# Enter your Claude API key when prompted
```

**Linux/Mac**:
```bash
cd book-assignment
bash setup-env.sh
# Choose option 1 for Local Development
# Enter your Claude API key when prompted
```

---

## 🏃 Start Local Development (After Adding API Key)

### 1. Start All Services
```bash
cd book-assignment
docker-compose up
```

This starts:
- 🌐 **Website**: http://localhost:3000
- ⚙️ **Backend API**: http://localhost:8000/docs
- 🤖 **RAG Service**: http://localhost:8001/health
- 🗄️ **PostgreSQL**: localhost:5432
- 🔍 **Qdrant**: http://localhost:6333/dashboard

### 2. Initialize Database (First Time Only)
```bash
# In a new terminal:
docker-compose exec backend alembic upgrade head
docker-compose exec backend python scripts/seed_roles.py
```

### 3. Open Your Browser
- **Website**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **Qdrant Dashboard**: http://localhost:6333/dashboard

---

## ☁️ Deploy to Production

Follow these guides in order:

### Quick Deployment (15-20 minutes)
📄 **DEPLOY-NOW.md** - Step-by-step deployment guide
- Deploy website to Vercel (2 min)
- Deploy services to Render (5 min)
- Set up Qdrant Cloud (3 min)
- Configure and verify (5 min)

### Environment Variables Reference
📄 **ENV-SETUP.md** - Complete environment variables guide
- All variables explained
- Security best practices
- Troubleshooting tips

### Full Deployment Documentation
📄 **DEPLOYMENT.md** - Comprehensive deployment guide
- Architecture overview
- Multiple hosting options
- Monitoring and maintenance
- Cost estimates

---

## 📋 Deployment Checklist

### Prerequisites
- [ ] Claude API key (from console.anthropic.com)
- [ ] Vercel account (sign up at vercel.com)
- [ ] Render account (sign up at render.com)
- [ ] Qdrant Cloud account (optional, or use local)

### Deployment Steps
- [ ] Deploy website to Vercel
- [ ] Set up Qdrant Cloud (or local instance)
- [ ] Deploy backend to Render
- [ ] Deploy RAG service to Render
- [ ] Deploy agent service to Render
- [ ] Configure environment variables across services
- [ ] Run database migrations
- [ ] Index course content
- [ ] Test all services

---

## 🆘 Quick Help

### I don't have a Claude API key yet
1. Go to: https://console.anthropic.com/
2. Sign up or log in
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-api03-`)

### Docker not installed?
**Windows**: https://docs.docker.com/desktop/install/windows-install/
**Mac**: https://docs.docker.com/desktop/install/mac-install/
**Linux**: https://docs.docker.com/engine/install/

### Services won't start?
```bash
# Check Docker is running
docker --version
docker-compose --version

# View service logs
docker-compose logs backend
docker-compose logs website
docker-compose logs rag

# Restart services
docker-compose down
docker-compose up --build
```

### Frontend can't connect to backend?
Check CORS settings in `.env`:
```bash
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env` | Your local environment variables (never commit!) |
| `.env.local.template` | Template for local development |
| `.env.production.template` | Template for production deployment |
| `docker-compose.yml` | Local development orchestration |
| `QUICKSTART.md` | This file - quick start guide |
| `DEPLOY-NOW.md` | Fast deployment guide |
| `ENV-SETUP.md` | Complete environment setup guide |
| `DEPLOYMENT.md` | Full deployment documentation |
| `README.md` | Project overview and features |

---

## 🎯 What to Do Next

### For Local Development:
1. **Add Claude API key** to `.env` file (see above)
2. **Start Docker Compose**: `docker-compose up`
3. **Initialize database**: Run migrations and seed data
4. **Start coding**: Edit files, changes auto-reload

### For Production Deployment:
1. **Read DEPLOY-NOW.md** for step-by-step instructions
2. **Deploy to Vercel** (website) - takes 2 minutes
3. **Deploy to Render** (backend services) - takes 10 minutes
4. **Configure environment variables** on each platform
5. **Test your live application**

---

## 🌟 Key Features of Your Platform

- 📚 **Interactive Learning Website** - Docusaurus with beautiful docs
- 🤖 **AI-Powered RAG Chatbot** - Answer questions with Claude
- 🔐 **Secure Authentication** - JWT-based auth with RBAC
- 🌍 **Multilingual Support** - EN, UR, AR, ZH translations
- 🐳 **Docker Compose** - One command to start everything
- 🚀 **CI/CD Ready** - GitHub Actions for auto-deployment
- 📊 **Vector Search** - Qdrant for semantic search
- 🎨 **Modern UI** - Dark mode, mobile-responsive

---

## 💡 Pro Tips

1. **Use the setup scripts** - They generate secure secrets automatically
2. **Check the logs** - Most issues show up in Docker logs
3. **Start simple** - Get local development working first
4. **Test each service** - Verify backend, RAG, and website separately
5. **Read the docs** - DEPLOY-NOW.md has detailed troubleshooting

---

## 📞 Need Help?

- **GitHub Issues**: https://github.com/Farhat-Naz/newhumandiod-book/issues
- **Documentation**: Check DEPLOYMENT.md and ENV-SETUP.md
- **Logs**: Use `docker-compose logs <service-name>`

---

**Ready to get started?** Add your Claude API key and run `docker-compose up`! 🚀

Built with Claude Code.
