# Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd candidate-support-automation
npm install
```

## Step 2: Gmail API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Gmail API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"
4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: **Desktop app**
   - Name it (e.g., "Candidate Support Automation")
   - Click "Create"
   - Download the JSON file
   - Rename it to `credentials.json` and place it in the project root

## Step 3: First-Time Authorization

Run the main script once to authorize:

```bash
node main.js
```

When prompted:
1. Visit the authorization URL shown in the console
2. Sign in with the Gmail account you want to use
3. Grant permissions
4. Copy the authorization code from the redirect URL
5. Paste it into the terminal

The token will be saved to `token.json` automatically.

## Step 4: Configure OpenAI API Key

**RECOMMENDED: Create a `.env` file**

1. Create a file named `.env` in the `candidate-support-automation` folder
2. Add the following line (replace with your actual API key):
```
OPENAI_API_KEY=sk-your-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

**Alternative: Set environment variable**

**Windows PowerShell:**
```powershell
$env:OPENAI_API_KEY="sk-your-api-key-here"
```

**Windows CMD:**
```cmd
set OPENAI_API_KEY=sk-your-api-key-here
```

**Linux/Mac:**
```bash
export OPENAI_API_KEY="sk-your-api-key-here"
```

**Note:** The `.env` file method is recommended as it persists across sessions and is automatically loaded by the application.

## Step 5: Test Run

Run manually to test:

```bash
node main.js
```

## Step 6: Automation

The system is configured to run every 10 minutes via `.cursor/task.json`. Cursor will automatically execute the script on schedule.

## Troubleshooting

### "credentials.json not found"
- Ensure you've downloaded the OAuth credentials from Google Cloud Console
- Rename the file to exactly `credentials.json`
- Place it in the `candidate-support-automation` folder

### "Token expired"
- Delete `token.json` and run `node main.js` again to re-authorize

### "OPENAI_API_KEY environment variable is missing"
- **Solution 1 (Recommended):** Create a `.env` file in the project root with:
  ```
  OPENAI_API_KEY=sk-your-api-key-here
  ```
- **Solution 2:** Set the environment variable in your terminal before running:
  - PowerShell: `$env:OPENAI_API_KEY="sk-your-api-key-here"`
  - CMD: `set OPENAI_API_KEY=sk-your-api-key-here`
  - Linux/Mac: `export OPENAI_API_KEY="sk-your-api-key-here"`

### "OpenAI API error"
- Verify your API key is set correctly
- Check that you have credits/quota available
- Ensure the API key has access to GPT models
- Make sure you've run `npm install` to install the `dotenv` package

### "No unread messages"
- This is normal if there are no unread emails
- The script will exit gracefully

