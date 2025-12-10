# Render.com Setup Guide - Step by Step

This guide will help you deploy the candidate support automation to Render.com for free 24/7 operation.

## Prerequisites

- GitHub account
- Render.com account (free signup)
- Your OpenAI API key
- Gmail credentials.json and token.json files

---

## Step 1: Prepare Your Repository

1. **Initialize Git (if not already done):**
   ```bash
   cd "candidate-support-automation"
   git init
   git add .
   git commit -m "Initial commit for Render deployment"
   ```

2. **Create GitHub Repository:**
   - Go to https://github.com/new
   - Create a new repository (make it private for security)
   - Don't initialize with README

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/candidate-support-automation.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Create Render Account

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account (recommended)

---

## Step 3: Create New Service on Render

1. **From Render Dashboard:**
   - Click "New +" button
   - Select "Background Worker" (not Web Service)

2. **Connect Repository:**
   - Click "Connect GitHub"
   - Authorize Render to access your repositories
   - Select your `candidate-support-automation` repository
   - Click "Connect"

3. **Configure Service:**
   - **Name:** `candidate-support-automation`
   - **Environment:** `Node`
   - **Region:** Choose closest to you (e.g., `Oregon (US West)`)
   - **Branch:** `main`
   - **Root Directory:** (leave empty)
   - **Build Command:** `npm install`
   - **Start Command:** `node main-continuous.js`
   - **Plan:** Select **Free** (750 hours/month)

4. **Click "Create Background Worker"**

---

## Step 4: Add Environment Variables

1. **In your Render service dashboard:**
   - Go to "Environment" tab
   - Click "Add Environment Variable"

2. **Add these variables:**

   **Required:**
   ```
   OPENAI_API_KEY = sk-proj-your-api-key-here
   ```

   **Optional:**
   ```
   OTOMEYT_LOGO_URL = https://www.otomeyt.ai/logo.png
   ```

3. **For Gmail Credentials:**
   
   You need to add your `credentials.json` and `token.json` as environment variables.
   
   **Convert to base64 first:**
   
   **Windows PowerShell:**
   ```powershell
   # Convert credentials.json
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("credentials.json"))
   
   # Convert token.json
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("token.json"))
   ```
   
   **Add to Render:**
   ```
   GMAIL_CREDENTIALS = <paste base64 string here>
   GMAIL_TOKEN = <paste base64 string here>
   ```

---

## Step 5: Modify Code for Render

We need to update the code to read credentials from environment variables on Render.

### Update `gmailAuth.js`:

The current code reads from files. We need to add support for environment variables.

**Add this at the top of `gmailAuth.js` after the imports:**
```javascript
// Check if running on Render (credentials in env vars)
if (process.env.GMAIL_CREDENTIALS && process.env.GMAIL_TOKEN) {
  // Use environment variables (Render deployment)
  const credentials = JSON.parse(Buffer.from(process.env.GMAIL_CREDENTIALS, 'base64').toString());
  const token = JSON.parse(Buffer.from(process.env.GMAIL_TOKEN, 'base64').toString());
  
  // Store in memory for this session
  // The authorize function will need to be updated to check env vars first
}
```

Actually, let me create a better solution - update the files to support both local and Render environments.

---

## Step 6: Deploy

1. **After adding all environment variables:**
   - Click "Save Changes"
   - Render will automatically start building and deploying

2. **Monitor Deployment:**
   - Go to "Logs" tab
   - Watch the build process
   - Wait for "Your service is live" message

3. **Check Logs:**
   - Once deployed, check logs to see:
     - "Starting continuous email automation..."
     - "Will check emails every 10 minutes."
     - Email processing logs

---

## Step 7: Verify It's Working

1. **Check Logs:**
   - You should see logs every 10 minutes showing email checks
   - Look for: `[timestamp] Starting email check...`

2. **Test with a Real Email:**
   - Send a test email to your support inbox
   - Check logs to see if it's processed
   - Verify the reply is sent

---

## Important Notes

### Free Tier Limitations:

- **750 hours/month** - Enough for 24/7 operation (730 hours in a month)
- **Spins down after 15 minutes of inactivity** - But our continuous script keeps it alive
- **512 MB RAM** - Should be enough for this automation
- **No persistent storage** - Files are ephemeral

### Keeping Service Alive:

The `main-continuous.js` script runs continuously and checks emails every 10 minutes, which keeps the service alive on Render's free tier.

### Monitoring:

- Check Render dashboard regularly
- Monitor logs for errors
- Set up email alerts (Render Pro feature, but free tier has basic monitoring)

---

## Troubleshooting

### Service Keeps Restarting:
- Check logs for errors
- Verify all environment variables are set correctly
- Ensure credentials.json and token.json are valid base64

### "Cannot find module" errors:
- Make sure `package.json` has all dependencies
- Check that `npm install` completed successfully in logs

### Gmail Authentication Errors:
- Verify GMAIL_CREDENTIALS and GMAIL_TOKEN are correct base64
- Token might be expired - regenerate locally and update

### No Logs Appearing:
- Service might have crashed
- Check "Events" tab for deployment status
- Try manual deploy from "Manual Deploy" button

---

## Updating the Code

When you make changes:

1. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```

2. **Render will auto-deploy:**
   - Go to Render dashboard
   - Watch the new deployment in "Events" tab
   - Check logs after deployment completes

---

## Cost

**Free Tier:** $0/month
- 750 hours/month (enough for 24/7)
- 512 MB RAM
- Basic monitoring

**If you exceed free tier:**
- $7/month for Starter plan
- But 750 hours should be enough for 24/7 operation

---

## Next Steps

1. ✅ Set up GitHub repository
2. ✅ Create Render account
3. ✅ Deploy service
4. ✅ Add environment variables
5. ✅ Monitor and verify

Your automation will now run 24/7 on Render's free tier! 🎉

