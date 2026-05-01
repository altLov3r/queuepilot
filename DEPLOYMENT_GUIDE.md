# 🚀 QueuePilot Deployment Guide

## Quick Overview

**Frontend:** Vercel (Free, 5 minutes)
**Backend:** Railway (Free tier, 10 minutes)
**AI:** OpenRouter.ai (Free API key)

Total time: **15-20 minutes**
Total cost: **$0** (all free tiers)

---

## Step 1: Get OpenRouter.ai API Key (2 minutes)

### Why OpenRouter?
- ✅ **FREE** - No credit card required
- ✅ Access to real AI models (Llama 3.2, GPT-4, Claude)
- ✅ Free tier includes 10 requests/minute
- ✅ Perfect for hackathon demos

### Get Your Key:
1. Go to https://openrouter.ai/
2. Click "Sign In" (top right)
3. Sign in with Google/GitHub
4. Go to https://openrouter.ai/keys
5. Click "Create Key"
6. Copy your API key (starts with `sk-or-v1-...`)

**Save this key - you'll need it for deployment!**

---

## Step 2: Deploy Backend to Railway (10 minutes)

### Why Railway?
- ✅ Free $5/month credit (enough for hackathon)
- ✅ Automatic HTTPS
- ✅ Easy environment variables
- ✅ GitHub integration

### Deploy Steps:

1. **Go to Railway**
   - Visit https://railway.app/
   - Click "Start a New Project"
   - Sign in with GitHub

2. **Deploy from GitHub**
   - Click "Deploy from GitHub repo"
   - Select `queuepilot` repository
   - Railway will detect it's a Node.js app

3. **Configure Settings**
   - Click on your deployment
   - Go to "Settings" tab
   - Set **Root Directory:** `server`
   - Set **Start Command:** `node src/server.js`

4. **Add Environment Variables**
   - Go to "Variables" tab
   - Click "New Variable"
   - Add these:

   ```
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   PORT=3001
   NODE_ENV=production
   ```

5. **Deploy!**
   - Railway will automatically deploy
   - Wait 2-3 minutes
   - Get your backend URL (looks like: `queuepilot-production.up.railway.app`)

6. **Test Backend**
   ```bash
   curl https://your-backend-url.railway.app/api/health
   ```
   Should return: `{"status":"healthy",...}`

---

## Step 3: Deploy Frontend to Vercel (5 minutes)

### Why Vercel?
- ✅ Completely free for personal projects
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Perfect for React apps

### Deploy Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to Client**
   ```bash
   cd client
   ```

3. **Update API URL**
   Before deploying, update the API URL in your frontend code.
   
   Create `client/.env.production`:
   ```env
   VITE_API_URL=https://your-backend-url.railway.app
   ```

   Or update API calls to use your Railway URL.

4. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

5. **Follow Prompts**
   - Set up and deploy? **Y**
   - Which scope? (your account)
   - Link to existing project? **N**
   - Project name? **queuepilot**
   - Directory? **./  ** (current directory)
   - Override settings? **N**

6. **Get Your URL**
   - Vercel will give you a URL like: `queuepilot.vercel.app`
   - Visit it to test!

---

## Step 4: Update Frontend to Use Railway Backend

### Option A: Environment Variable (Recommended)

1. **Create `client/.env.production`:**
   ```env
   VITE_API_URL=https://your-backend-url.railway.app
   ```

2. **Update API calls in components:**
   
   Find all `http://localhost:3001` and replace with:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
   
   // Then use:
   fetch(`${API_URL}/api/analyze`, ...)
   ```

3. **Redeploy:**
   ```bash
   cd client
   vercel --prod
   ```

### Option B: Direct URL (Quick & Dirty)

Just replace `http://localhost:3001` with your Railway URL in:
- `client/src/App.jsx`
- `client/src/components/TicketInput.jsx`
- `client/src/components/ConnectedInbox.jsx`

Then redeploy.

---

## Step 5: Test Your Deployment

### Test Checklist:
- [ ] Visit your Vercel URL
- [ ] Click "⚡ Judge Demo Mode"
- [ ] Verify tickets load and analyze
- [ ] Check browser console for errors
- [ ] Test "Try Demo" button
- [ ] Test "Connected Inbox"
- [ ] Test export functionality
- [ ] Verify OpenRouter.ai is being used (check metadata)

### Check AI Status:
Open browser console and look for:
```json
{
  "metadata": {
    "analyzer": "OpenRouter.ai (Real AI - Llama 3.2)",
    "openrouterAvailable": true
  }
}
```

---

## Troubleshooting

### Backend Issues

**Problem:** Railway deployment fails
- **Solution:** Check `server/package.json` has correct start script
- **Solution:** Verify Root Directory is set to `server`

**Problem:** API returns 500 errors
- **Solution:** Check Railway logs (click "View Logs")
- **Solution:** Verify OPENROUTER_API_KEY is set correctly

**Problem:** CORS errors
- **Solution:** Add your Vercel URL to CORS whitelist in `server/src/server.js`

### Frontend Issues

**Problem:** Can't connect to backend
- **Solution:** Check API URL is correct
- **Solution:** Verify Railway backend is running
- **Solution:** Check browser console for CORS errors

**Problem:** Judge Demo Mode doesn't work
- **Solution:** Check backend /api/demo-tickets/crisis endpoint
- **Solution:** Verify backend is accessible

### OpenRouter Issues

**Problem:** "OpenRouter API error"
- **Solution:** Verify API key is correct
- **Solution:** Check you haven't exceeded free tier limits
- **Solution:** App will fall back to local analyzer automatically

---

## Environment Variables Reference

### Backend (Railway)
```env
OPENROUTER_API_KEY=sk-or-v1-...     # Required for real AI
PORT=3001                            # Optional, Railway sets automatically
NODE_ENV=production                  # Recommended
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.railway.app  # Your Railway URL
```

---

## Cost Breakdown

### Free Tier Limits:
- **Railway:** $5/month credit (plenty for hackathon)
- **Vercel:** Unlimited for personal projects
- **OpenRouter:** 10 requests/minute free

### Estimated Usage:
- **Demo:** ~5 requests
- **Judge testing:** ~20 requests
- **Total:** Well within free limits!

---

## Update README with Live URLs

Add this to your README.md:

```markdown
## 🌐 Live Demo

**Frontend:** https://queuepilot.vercel.app
**Backend API:** https://queuepilot-production.up.railway.app

Try the Judge Demo Mode for instant impressive demo!
```

---

## Quick Deploy Commands

### Deploy Backend:
```bash
# Already done via Railway dashboard
# Just push to GitHub and Railway auto-deploys
```

### Deploy Frontend:
```bash
cd client
vercel --prod
```

### Update Both:
```bash
# Backend: Push to GitHub
git add .
git commit -m "Update backend"
git push

# Frontend: Redeploy
cd client
vercel --prod
```

---

## Success Checklist

- [ ] OpenRouter.ai API key obtained
- [ ] Backend deployed to Railway
- [ ] Environment variables set
- [ ] Backend health check passes
- [ ] Frontend deployed to Vercel
- [ ] Frontend connects to backend
- [ ] Judge Demo Mode works
- [ ] Real AI analysis working
- [ ] URLs added to README
- [ ] Everything tested end-to-end

---

## 🎉 You're Live!

Your QueuePilot is now:
- ✅ Deployed and accessible worldwide
- ✅ Using real AI (OpenRouter.ai)
- ✅ Professional and impressive
- ✅ Ready for hackathon judges

**Share your live URL in your hackathon submission!**

---

## Support

**Issues?**
- Check Railway logs
- Check Vercel deployment logs
- Check browser console
- Verify environment variables

**Still stuck?**
- Railway docs: https://docs.railway.app/
- Vercel docs: https://vercel.com/docs
- OpenRouter docs: https://openrouter.ai/docs

---

**Good luck with your deployment! 🚀**