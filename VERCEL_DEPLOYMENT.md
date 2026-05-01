# 🚀 Vercel Deployment Guide

## Quick Deploy (15 Minutes)

### Prerequisites
- Git installed
- Vercel account (free, no credit card needed)
- Code committed to Git

---

## Step 1: Install Vercel CLI (2 minutes)

```bash
npm install -g vercel
```

---

## Step 2: Deploy Backend (5 minutes)

```bash
cd server
vercel --prod
```

**Follow the prompts:**
- Set up and deploy? → **Y**
- Which scope? → **(select your account)**
- Link to existing project? → **N**
- Project name? → **queuepilot-backend**
- Directory? → **./** (press Enter)
- Override settings? → **N**

**Your backend URL will be:** `https://queuepilot-backend.vercel.app`

**Copy this URL!** You'll need it in Step 3.

---

## Step 3: Update Frontend Configuration (3 minutes)

Edit `client/.env.production`:

```env
VITE_API_URL=https://queuepilot-backend.vercel.app
```

Replace with YOUR actual backend URL from Step 2.

---

## Step 4: Deploy Frontend (5 minutes)

```bash
cd client
vercel --prod
```

**Follow the prompts:**
- Set up and deploy? → **Y**
- Which scope? → **(select your account)**
- Link to existing project? → **N**
- Project name? → **queuepilot**
- Directory? → **./** (press Enter)
- Override settings? → **N**

**Your frontend URL will be:** `https://queuepilot.vercel.app`

---

## Step 5: Test Your Live App! ✅

1. Visit your frontend URL: `https://queuepilot.vercel.app`
2. Click **"⚡ Judge Demo Mode"**
3. Verify the analysis works!

---

## Troubleshooting

### Backend not responding?
- Check Vercel dashboard: https://vercel.com/dashboard
- View logs for errors
- Ensure `server/vercel.json` exists

### Frontend can't connect to backend?
- Verify `client/.env.production` has correct backend URL
- Check browser console for CORS errors
- Redeploy frontend: `cd client && vercel --prod`

### Need to redeploy?
```bash
# Backend
cd server && vercel --prod

# Frontend
cd client && vercel --prod
```

---

## Environment Variables (Optional)

If you want to enable OpenRouter.ai:

1. Go to Vercel dashboard
2. Select your backend project
3. Go to Settings → Environment Variables
4. Add: `OPENROUTER_API_KEY` = `your-key-here`
5. Redeploy backend

---

## Custom Domain (Optional)

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain
5. Follow DNS instructions

---

## 🎉 Done!

Your QueuePilot app is now live and accessible worldwide!

**Share your demo:**
- Frontend: https://queuepilot.vercel.app
- Backend API: https://queuepilot-backend.vercel.app/api/health

**Update your README.md** with these live URLs!