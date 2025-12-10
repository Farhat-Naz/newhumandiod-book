# 🚀 Deploy Website to GitHub Pages

Deploy your Docusaurus website to GitHub Pages for free!

**Note:** GitHub Pages only hosts the frontend (website). Backend services stay on Render.

---

## 📋 Prerequisites

- ✅ GitHub repository: https://github.com/Farhat-Naz/newhumandiod-book
- ✅ Backend services on Render (or deploying now)

---

## METHOD 1: Automatic Deployment with GitHub Actions (Recommended)

### STEP 1: Configure Docusaurus for GitHub Pages

We need to update the Docusaurus config file.

#### Update `website/docusaurus.config.ts`:

Add these lines at the top of the config:

```typescript
url: 'https://farhat-naz.github.io',
baseUrl: '/newhumandiod-book/',
organizationName: 'Farhat-Naz',
projectName: 'newhumandiod-book',
deploymentBranch: 'gh-pages',
```

---

### STEP 2: Create GitHub Actions Workflow

Create a new file: `.github/workflows/deploy-gh-pages.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - master
  workflow_dispatch:

permissions:
  contents: write

jobs:
  deploy:
    name: Deploy to GitHub Pages
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
          cache-dependency-path: website/package-lock.json

      - name: Install dependencies
        run: |
          cd website
          npm ci

      - name: Build website
        run: |
          cd website
          npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./website/build
          user_name: github-actions[bot]
          user_email: github-actions[bot]@users.noreply.github.com
```

---

### STEP 3: Enable GitHub Pages

1. Go to your GitHub repository:
   ```
   https://github.com/Farhat-Naz/newhumandiod-book
   ```

2. Click **"Settings"** tab

3. Scroll down to **"Pages"** in the left sidebar

4. Under **"Source"**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`

5. Click **"Save"**

---

### STEP 4: Commit and Push

I'll create these files for you and push them to GitHub!

---

## METHOD 2: Manual Deployment (Quick Test)

If you want to test quickly without GitHub Actions:

### STEP 1: Build the website locally

```bash
cd website
npm install
npm run build
```

### STEP 2: Deploy to GitHub Pages

```bash
cd website
npm run deploy
```

This uses `gh-pages` package to deploy directly.

---

## 📍 Your Website Will Be At:

```
https://farhat-naz.github.io/newhumandiod-book/
```

---

## 🔧 Connect to Backend Services

After deploying to GitHub Pages, you need to update the website to connect to your Render backend.

### Update Environment Variables:

In `website/docusaurus.config.ts`, add:

```typescript
customFields: {
  BACKEND_API_URL: 'https://physicalai-backend-xxxxx.onrender.com',
  RAG_WS_URL: 'wss://physicalai-rag-xxxxx.onrender.com',
},
```

---

## ✅ Complete Deployment Checklist

- [ ] Update `docusaurus.config.ts` with GitHub Pages settings
- [ ] Create GitHub Actions workflow file
- [ ] Enable GitHub Pages in repository settings
- [ ] Push changes to GitHub
- [ ] Wait for GitHub Actions to build and deploy (~3 min)
- [ ] Visit: `https://farhat-naz.github.io/newhumandiod-book/`
- [ ] Update backend CORS to allow GitHub Pages URL
- [ ] Test website functionality

---

## 🔄 Update Backend CORS

After deploying to GitHub Pages, update your backend service on Render:

1. Go to Render → physicalai-backend
2. Go to **Environment** tab
3. Update `CORS_ORIGINS`:
   ```
   https://farhat-naz.github.io
   ```
4. Save (service will auto-redeploy)

---

## 🎉 Benefits of GitHub Pages

- ✅ **Free hosting**
- ✅ **Fast CDN delivery**
- ✅ **Automatic HTTPS**
- ✅ **Easy to update** (just push to GitHub)
- ✅ **No build limits**

---

## 🐛 Troubleshooting

### 404 errors on GitHub Pages:
- Make sure `baseUrl` is set to `/newhumandiod-book/`
- Check that `gh-pages` branch was created
- Verify GitHub Pages is enabled in settings

### CSS/JS not loading:
- Check `baseUrl` in `docusaurus.config.ts`
- Clear cache and hard reload browser

### Build fails in GitHub Actions:
- Check the Actions tab for error logs
- Verify `package.json` and dependencies

---

Built with Claude Code.
