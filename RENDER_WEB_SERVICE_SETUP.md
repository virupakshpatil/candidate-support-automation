# Render Web Service + Uptime Robot Setup Guide

This guide shows you how to deploy the automation as a **Web Service** on Render and use **Uptime Robot** (free) to keep it alive 24/7.

## Why Web Service + Uptime Robot?

- **Render Web Service:** Free tier with 750 hours/month
- **Uptime Robot:** Free monitoring service that pings your app every 5 minutes
- **Result:** Service stays alive 24/7 without spinning down

---

## Step 1: Deploy on Render as Web Service

### 1.1 Go to Render.com
- Visit: https://render.com
- Sign up/Login with GitHub

### 1.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. **Connect GitHub** → Select your repository: `virupakshpatil/candidate-support-automation`
3. **Configure:**
   - **Name:** `candidate-support-automation`
   - **Environment:** `Node`
   - **Region:** Choose closest to you
   - **Branch:** `master`
   - **Root Directory:** (leave empty)
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** **Free**

### 1.3 Add Environment Variables
Click **"Add Environment Variable"** and add:

1. **OPENAI_API_KEY**
   - Value: Your OpenAI API key

2. **GMAIL_CREDENTIALS**
   - Value: (Run `.\prepare-render.ps1` to get this)

3. **GMAIL_TOKEN**
   - Value: (Run `.\prepare-render.ps1` to get this)

### 1.4 Deploy
- Click **"Create Web Service"**
- Wait for deployment to complete
- **Copy your service URL** (e.g., `https://candidate-support-automation.onrender.com`)

---

## Step 2: Setup Uptime Robot (Free)

### 2.1 Create Uptime Robot Account
1. Go to: https://uptimerobot.com
2. Click **"Sign Up"** (100% free)
3. Create account (email verification required)

### 2.2 Add New Monitor
1. After login, click **"+ Add New Monitor"**
2. **Monitor Type:** Select **"HTTP(s)"**
3. **Friendly Name:** `Candidate Support Automation`
4. **URL (or IP):** Paste your Render service URL
   - Example: `https://candidate-support-automation.onrender.com`
5. **Monitoring Interval:** Select **"Every 5 minutes"** (free tier)
6. Click **"Create Monitor"**

### 2.3 Verify It's Working
- Uptime Robot will ping your service every 5 minutes
- This keeps Render from spinning down your service
- Check status should show **"Up"** (green)

---

## Step 3: Verify Everything Works

### 3.1 Check Render Logs
1. Go to your Render dashboard
2. Click on your service
3. Go to **"Logs"** tab
4. You should see:
   ```
   Server running on port 3000
   Health check: http://localhost:3000/
   Starting email automation server...
   Will check emails every 10 minutes.
   ```

### 3.2 Check Uptime Robot
1. Go to Uptime Robot dashboard
2. Your monitor should show **"Up"** status
3. Click on it to see ping history

### 3.3 Test Health Endpoint
Visit your service URL in browser:
```
https://your-app.onrender.com/
```

You should see:
```json
{
  "status": "ok",
  "service": "Candidate Support Automation",
  "timestamp": "2025-12-10T...",
  "uptime": 123.45
}
```

---

## How It Works

1. **Render Web Service** runs `server.js` which:
   - Starts an Express web server (responds to HTTP requests)
   - Runs email automation every 10 minutes
   - Provides health check endpoint

2. **Uptime Robot** pings your service every 5 minutes:
   - Sends HTTP GET request to your service
   - Keeps the service "active" so Render doesn't spin it down
   - Monitors uptime and alerts if service goes down

3. **Result:** Service runs 24/7 on free tier!

---

## Monitoring & Alerts

### Uptime Robot Alerts (Free)
- Email alerts when service goes down
- Can add SMS alerts (paid feature)
- Dashboard shows uptime history

### Render Monitoring
- Check logs in Render dashboard
- See email processing activity
- Monitor resource usage

---

## Troubleshooting

### Service Keeps Spinning Down
- **Check Uptime Robot:** Is it pinging successfully?
- **Verify URL:** Make sure Uptime Robot has the correct URL
- **Check Interval:** Uptime Robot should ping every 5 minutes (free tier max)

### Health Check Not Responding
- Check Render logs for errors
- Verify `server.js` is the start command
- Check if port is set correctly (Render sets PORT automatically)

### Emails Not Processing
- Check Render logs for errors
- Verify environment variables are set
- Check Gmail token hasn't expired

### Uptime Robot Shows "Down"
- Verify your Render service URL is correct
- Check if Render service is actually running
- Wait a few minutes (first deployment can take time)

---

## Cost

**Total Cost: $0/month**

- **Render:** Free tier (750 hours/month)
- **Uptime Robot:** Free forever (50 monitors, 5-minute intervals)

---

## Alternative: Without Uptime Robot

If you don't want to use Uptime Robot, you can:
1. Use **Background Worker** instead (runs continuously)
2. Or accept that Web Service spins down after 15 minutes of inactivity
3. First request after spin-down takes ~30 seconds to wake up

But with Uptime Robot, it's truly 24/7 with no spin-down!

---

## Next Steps

1. ✅ Deploy on Render as Web Service
2. ✅ Setup Uptime Robot monitor
3. ✅ Verify health check works
4. ✅ Monitor logs for email processing
5. ✅ Test with a real email

Your automation is now running 24/7! 🎉

