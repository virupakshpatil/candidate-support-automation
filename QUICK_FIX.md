# Quick Fix: OPENAI_API_KEY Error

## Problem
You're seeing this error:
```
Error classifying issue: The OPENAI_API_KEY environment variable is missing or empty
```

## Solution (Choose One)

### Option 1: Create .env File (RECOMMENDED)

1. In the `candidate-support-automation` folder, create a new file named `.env`
2. Open the `.env` file and add this line (replace with your actual API key):
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```
3. Save the file
4. Run `node main.js` again

**Get your API key:** https://platform.openai.com/api-keys

### Option 2: Set Environment Variable in PowerShell

Open PowerShell in the `candidate-support-automation` folder and run:
```powershell
$env:OPENAI_API_KEY="sk-your-api-key-here"
node main.js
```

**Note:** This only works for the current PowerShell session. Use Option 1 for a permanent solution.

### Option 3: Set Environment Variable in CMD

Open Command Prompt in the `candidate-support-automation` folder and run:
```cmd
set OPENAI_API_KEY=sk-your-api-key-here
node main.js
```

**Note:** This only works for the current CMD session. Use Option 1 for a permanent solution.

## Verify It Works

After setting up, run:
```bash
node main.js
```

You should no longer see the OPENAI_API_KEY error.

