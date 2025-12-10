# 🔑 Render Environment Variables - Simple Copy/Paste

Use this guide when deploying to Render. Copy each value exactly as shown.

---

## 📦 SERVICE: physicalai-backend

### Environment Variables:

**1. CORS_ORIGINS**
```
https://newhumandiod-book-wnk69segg-farhats-projects-27800a4d.vercel.app
```

**2. JWT_SECRET**
```
9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f
```

**3. JWT_ALGORITHM**
```
HS256
```

**4. ACCESS_TOKEN_EXPIRE_MINUTES**
```
15
```

**5. REFRESH_TOKEN_EXPIRE_DAYS**
```
7
```

---

## 🤖 SERVICE: physicalai-rag

### Environment Variables:

**1. QDRANT_URL**
```
https://9e1e7d11-6e54-420d-8d5c-72e1f16070cc.us-east4-0.gcp.cloud.qdrant.io:6333
```

**2. QDRANT_API_KEY**
```
YOUR_QDRANT_API_KEY_HERE
```

**3. CLAUDE_API_KEY**
```
YOUR_CLAUDE_API_KEY_HERE
```

**4. CLAUDE_MODEL**
```
claude-3-5-sonnet-20241022
```

**5. OLLAMA_URL** (optional - leave empty)
```

```

---

## 🔧 SERVICE: physicalai-agent

### Environment Variables:

**1. TRANSLATION_API_KEY** (optional - leave empty)
```

```

---

## 🗄️ SERVICE: physicalai-postgres

**NO ENVIRONMENT VARIABLES NEEDED**

Render will automatically configure this database.

---

## 📋 How to Use This

When you open the Render deployment link:

1. **For each service**, Render will show environment variable fields
2. **Copy the variable name** (e.g., `CORS_ORIGINS`)
3. **Paste the value** from above
4. **Repeat** for all variables in that service
5. Click **"Apply"** or **"Create Services"**

---

## ✅ Quick Checklist

### physicalai-backend:
- [ ] CORS_ORIGINS
- [ ] JWT_SECRET
- [ ] JWT_ALGORITHM
- [ ] ACCESS_TOKEN_EXPIRE_MINUTES
- [ ] REFRESH_TOKEN_EXPIRE_DAYS

### physicalai-rag:
- [ ] QDRANT_URL
- [ ] QDRANT_API_KEY
- [ ] CLAUDE_API_KEY
- [ ] CLAUDE_MODEL
- [ ] OLLAMA_URL (skip/empty)

### physicalai-agent:
- [ ] TRANSLATION_API_KEY (skip/empty)

### physicalai-postgres:
- [ ] No variables needed

---

## 🚀 Ready to Deploy

**Open this URL:**
```
https://render.com/deploy?repo=https://github.com/Farhat-Naz/newhumandiod-book
```

Then use this guide to fill in the environment variables!

---

Built with Claude Code.
