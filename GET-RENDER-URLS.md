# 🔗 How to Get Your Render Service URLs

Quick guide to find your deployed service URLs.

---

## STEP 1: Go to Render Dashboard

Open:
```
https://dashboard.render.com/
```

---

## STEP 2: You'll See All Your Services

You should see a list like:
```
┌──────────────────────────────────────┐
│ physicalai-postgres     ✅ Live      │
├──────────────────────────────────────┤
│ physicalai-backend      ✅ Live      │
├──────────────────────────────────────┤
│ physicalai-rag          ✅ Live      │
├──────────────────────────────────────┤
│ physicalai-agent        ✅ Live      │
└──────────────────────────────────────┘
```

---

## STEP 3: Get Backend URL

1. **Click** on **"physicalai-backend"**
2. You'll see the URL at the **top of the page**:
   ```
   https://physicalai-backend-abc123.onrender.com
   ```
3. **Copy this entire URL** (click the copy icon 📋)

**Save it here:**
```
Backend URL: _________________________________________
```

---

## STEP 4: Get RAG URL

1. **Go back** to dashboard (click "Dashboard" or back button)
2. **Click** on **"physicalai-rag"**
3. Copy the URL at the top:
   ```
   https://physicalai-rag-xyz789.onrender.com
   ```

**Save it here:**
```
RAG URL: _________________________________________
```

---

## STEP 5: Test Your URLs

### Test Backend:
Open in browser:
```
https://physicalai-backend-abc123.onrender.com/docs
```
(Add `/docs` at the end!)

You should see **Swagger UI** (API documentation page)

### Test RAG:
Open in browser:
```
https://physicalai-rag-xyz789.onrender.com/health
```

You should see:
```json
{"status": "healthy"}
```

---

## ✅ Got Your URLs?

Once you have both URLs, follow **FINAL-DEPLOYMENT-STEPS.md** to:
1. Update Vercel with these URLs
2. Initialize database
3. Create Qdrant collection
4. Test everything

---

**Paste your URLs here in chat, and I'll help you complete the deployment!** 🚀
