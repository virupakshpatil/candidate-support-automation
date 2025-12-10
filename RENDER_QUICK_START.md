# Render.com Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Prepare Credentials (2 minutes)

**Windows PowerShell:**
```powershell
cd "candidate-support-automation"
.\prepare-render.ps1
```

**Linux/Mac:**
```bash
cd candidate-support-automation
chmod +x prepare-render.sh
./prepare-render.sh
```

**Copy the two base64 strings** that are displayed.

---

### Step 2: Push to GitHub (1 minute)

```bash
git init
git add .
git commit -m "Ready for Render deployment"
git remote add origin https://github.com/YOUR_USERNAME/candidate-support-automation.git
git push -u origin main
```

---

### Step 3: Deploy on Render (2 minutes)

1. **Go to https://render.com** → Sign up/Login
2. **Click "New +"** → **"Background Worker"**
3. **Connect GitHub** → Select your repository
4. **Configure:**
   - Name: `candidate-support-automation`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node main-continuous.js`
   - Plan: **Free**
5. **Add Environment Variables:**
   - `OPENAI_API_KEY` = your OpenAI API key
   - `GMAIL_CREDENTIALS` = (paste base64 from Step 1)
   - `GMAIL_TOKEN` = (paste base64 from Step 1)
6. **Click "Create Background Worker"**

---

### Step 4: Verify (1 minute)

1. Go to **"Logs"** tab
2. Wait for deployment to complete
3. Look for: `"Starting continuous email automation..."`
4. You should see email checks every 10 minutes

---

## ✅ Done!

Your automation is now running 24/7 on Render's free tier!

**Check logs regularly** to ensure it's working properly.

---

## 📝 Important Notes

- **Free tier:** 750 hours/month (enough for 24/7)
- **Service stays alive** because `main-continuous.js` runs continuously
- **Auto-deploys** when you push to GitHub
- **Monitor logs** for any issues

---

## 🔧 Troubleshooting

**Service not starting?**
- Check logs for errors
- Verify all 3 environment variables are set
- Ensure base64 strings are correct (no extra spaces)

**No email processing?**
- Check Gmail token hasn't expired
- Verify credentials are correct
- Check logs for authentication errors

**Need help?** See `RENDER_SETUP.md` for detailed instructions.

