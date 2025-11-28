# 🚀 Deployment Guide

## GitHub Setup

### 1. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Ad-Free Video Player"
```

### 2. Connect to GitHub

```bash
git remote add origin https://github.com/WasimKhan0786/addfrre.git
git branch -M main
git push -u origin main
```

### 3. Update Repository (Future Changes)

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

---

## 🌐 Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import `WasimKhan0786/addfrre`
5. Click "Deploy"
6. Done! Your site will be live in 2-3 minutes

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Your site will be live at:** `https://addfrre.vercel.app`

---

## 🔧 Deploy to Netlify

### Via Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select `WasimKhan0786/addfrre`
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy"

### Via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

## 📦 Deploy to GitHub Pages (Static Export)

### 1. Update `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

### 2. Add deployment script to `package.json`

```json
{
  "scripts": {
    "deploy": "next build && touch out/.nojekyll && git add out/ && git commit -m 'Deploy' && git subtree push --prefix out origin gh-pages"
  }
}
```

### 3. Deploy

```bash
npm run build
npm run deploy
```

### 4. Enable GitHub Pages

1. Go to repository settings
2. Pages → Source → `gh-pages` branch
3. Save

**Your site will be live at:** `https://wasimkhan0786.github.io/addfrre`

---

## 🐳 Deploy with Docker

### 1. Create `Dockerfile`

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Build and Run

```bash
# Build image
docker build -t ad-free-video-player .

# Run container
docker run -p 3000:3000 ad-free-video-player
```

---

## 🔐 Environment Variables (Optional)

If you need API keys in future:

### Vercel
1. Go to Project Settings → Environment Variables
2. Add variables
3. Redeploy

### Netlify
1. Site settings → Environment variables
2. Add variables
3. Redeploy

---

## 📊 Performance Tips

### 1. Enable Caching
Already configured in `next.config.js`

### 2. Optimize Images
Using Next.js Image component (already implemented)

### 3. Enable Compression
Vercel/Netlify handle this automatically

---

## 🔄 Continuous Deployment

### Automatic Deployment on Push

Both Vercel and Netlify automatically deploy when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Your site will automatically rebuild and deploy! ✨

---

## 📱 Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as shown

### Netlify
1. Site settings → Domain management
2. Add custom domain
3. Update DNS records

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### Git Issues
```bash
# Reset to last commit
git reset --hard HEAD

# Force push (use carefully)
git push -f origin main
```

---

## 📞 Support

- **Developer:** Wasim Khan
- **Location:** Bhada Kalan, Siwan, Bihar
- **GitHub:** [WasimKhan0786](https://github.com/WasimKhan0786)

---

Made with ❤️ in Bihar
