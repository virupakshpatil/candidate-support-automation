# Free 24/7 Hosting Setup Guide

This guide shows you how to run the candidate support automation 24/7 for FREE using various cloud services.

## Option 1: Railway.app (Recommended - Easiest)

**Free Tier:** 500 hours/month (enough for 24/7)

### Setup Steps:

1. **Create Railway Account:**
   - Go to https://railway.app
   - Sign up with GitHub (free)

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository (or create one)

3. **Configure Environment Variables:**
   - Go to your project → Variables
   - Add these variables:
     ```
     OPENAI_API_KEY=your-api-key
     OTOMEYT_LOGO_URL=your-logo-url (optional)
     ```

4. **Add Railway Configuration:**
   Create `railway.json` in your project root:
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "node main.js",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

5. **Add Cron Job:**
   Create `Procfile` in project root:
   ```
   worker: node main.js
   ```

6. **Deploy:**
   - Railway will auto-deploy
   - Check logs to verify it's running

**Note:** For scheduled runs every 10 minutes, you'll need to use a cron service or modify the script to run continuously with a loop.

---

## Option 2: Render.com (Free Tier)

**Free Tier:** 750 hours/month

### Setup Steps:

1. **Create Render Account:**
   - Go to https://render.com
   - Sign up (free)

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Settings:
     - **Name:** candidate-support-automation
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `node main.js`
     - **Plan:** Free

3. **Add Environment Variables:**
   - Go to Environment tab
   - Add:
     ```
     OPENAI_API_KEY=your-api-key
     ```

4. **For Scheduled Runs:**
   Create `render.yaml`:
   ```yaml
   services:
     - type: web
       name: candidate-support
       env: node
       buildCommand: npm install
       startCommand: node main.js
   cronJobs:
     - name: check-emails
       schedule: "*/10 * * * *"
       command: node main.js
   ```

**Note:** Render's free tier spins down after 15 minutes of inactivity. Use a cron service for true 24/7.

---

## Option 3: GitHub Actions (100% Free)

**Free Tier:** 2,000 minutes/month (enough for every 10 minutes)

### Setup Steps:

1. **Create GitHub Workflow:**
   Create `.github/workflows/automation.yml`:
   ```yaml
   name: Candidate Support Automation
   
   on:
     schedule:
       # Run every 10 minutes
       - cron: '*/10 * * * *'
     workflow_dispatch: # Manual trigger
   
   jobs:
     automate:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
         
         - name: Install dependencies
           run: npm install
         
         - name: Run automation
           env:
             OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
             GMAIL_CREDENTIALS: ${{ secrets.GMAIL_CREDENTIALS }}
             GMAIL_TOKEN: ${{ secrets.GMAIL_TOKEN }}
           run: node main.js
   ```

2. **Add Secrets to GitHub:**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Add secrets:
     - `OPENAI_API_KEY`
     - `GMAIL_CREDENTIALS` (base64 encoded credentials.json)
     - `GMAIL_TOKEN` (base64 encoded token.json)

3. **Convert Files to Secrets:**
   ```bash
   # Windows PowerShell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("credentials.json"))
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("token.json"))
   ```

**Pros:** Completely free, reliable
**Cons:** Requires GitHub repo, secrets management

---

## Option 4: Oracle Cloud Always Free (Best for 24/7)

**Free Tier:** Always free VPS (2 instances)

### Setup Steps:

1. **Sign up for Oracle Cloud:**
   - Go to https://www.oracle.com/cloud/free/
   - Create free account

2. **Create VM Instance:**
   - Compute → Instances → Create
   - Choose "Always Free" shape
   - OS: Ubuntu 22.04

3. **SSH into VM:**
   ```bash
   ssh ubuntu@your-vm-ip
   ```

4. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

5. **Clone and Setup:**
   ```bash
   git clone your-repo-url
   cd candidate-support-automation
   npm install
   ```

6. **Setup Environment:**
   ```bash
   nano .env
   # Add your API keys
   ```

7. **Install PM2 (Process Manager):**
   ```bash
   sudo npm install -g pm2
   pm2 start main.js --cron "*/10 * * * *"
   pm2 save
   pm2 startup
   ```

**Pros:** True 24/7, always free, full control
**Cons:** Requires server management knowledge

---

## Option 5: Local Machine with Windows Task Scheduler

If you want to run it on your Windows PC 24/7:

### Setup Steps:

1. **Create a batch file** `run-automation.bat`:
   ```batch
   @echo off
   cd /d "C:\Users\Oto-Virupakshagouda\Desktop\Candidate Support\candidate-support-automation"
   node main.js
   ```

2. **Create Scheduled Task:**
   - Open Task Scheduler (search in Windows)
   - Create Basic Task
   - Name: "Candidate Support Automation"
   - Trigger: Daily, Repeat every 10 minutes
   - Action: Start a program
   - Program: `C:\Users\Oto-Virupakshagouda\Desktop\Candidate Support\candidate-support-automation\run-automation.bat`
   - Check "Run whether user is logged on or not"

**Pros:** Free, no cloud setup
**Cons:** Requires PC to be on 24/7

---

## Option 6: Modify Script for Continuous Running

Instead of cron, make the script run continuously:

Create `main-continuous.js`:
```javascript
import dotenv from 'dotenv';
import { authorize } from './gmailAuth.js';
import { readUnreadMessages } from './gmailReader.js';
import { extractInfo } from './extractor.js';
import { classifyIssue } from './classifier.js';
import { generateStartButtonIssueResponse, getStartButtonIssueSubject } from './templates.js';
import { sendReply, markAsRead } from './reply.js';

dotenv.config();

const INTERVAL_MINUTES = 10;

async function processEmails() {
  try {
    console.log(`[${new Date().toISOString()}] Starting email check...`);
    
    const auth = await authorize();
    const unreadMessages = await readUnreadMessages(auth);

    if (unreadMessages.length === 0) {
      console.log('No unread messages.');
      return;
    }

    for (const message of unreadMessages) {
      try {
        const extracted = extractInfo(message);
        const classification = await classifyIssue(extracted.subject, extracted.issue, extracted.body);

        if (classification === 'YES') {
          const replyBody = generateStartButtonIssueResponse(extracted.candidateName);
          const replySubject = getStartButtonIssueSubject();
          
          await sendReply(
            auth,
            extracted.candidateEmail,
            replySubject,
            replyBody,
            extracted.threadId,
            ['candidatesupport@otomeyt.ai', 'hello@otomeyt.ai']
          );
        }

        await markAsRead(auth, message.id);
      } catch (error) {
        console.error(`Error processing message:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error in email processing:', error.message);
  }
}

// Run immediately, then every 10 minutes
processEmails();
setInterval(processEmails, INTERVAL_MINUTES * 60 * 1000);

console.log(`Automation started. Checking emails every ${INTERVAL_MINUTES} minutes.`);
```

Then use this with any hosting service that supports long-running processes.

---

## Recommendation

**For Easiest Setup:** Use **GitHub Actions** (Option 3)
- Completely free
- No server management
- Reliable and automatic
- Runs every 10 minutes

**For True 24/7:** Use **Oracle Cloud** (Option 4)
- Always free
- Full control
- Can run continuously

**For Quick Test:** Use **Railway** (Option 1)
- Easy setup
- Good free tier
- Auto-deploys from GitHub

Choose the option that best fits your needs!

