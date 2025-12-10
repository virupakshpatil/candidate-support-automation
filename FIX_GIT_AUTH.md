# Fix Git Authentication Issue

## Problem
Git is using cached credentials for the wrong account (`Vrukshpatil` instead of `virupakshpatil`).

## Solution: Clear Cached Credentials

### Step 1: Clear Windows Credential Manager

**Option A: Using Command Prompt (as Administrator)**
```cmd
cmdkey /list
cmdkey /delete:git:https://github.com
```

**Option B: Using Windows Credential Manager GUI**
1. Press `Windows Key + R`
2. Type: `control /name Microsoft.CredentialManager`
3. Press Enter
4. Go to "Windows Credentials"
5. Find any entries with "git:https://github.com"
6. Click on them and click "Remove"

### Step 2: Push with Token

After clearing credentials, run:
```powershell
git push -u origin master
```

When prompted:
- **Username:** `virupakshpatil`
- **Password:** `<paste your personal access token here>`

---

## Alternative: Use Token in URL (One-time)

You can also embed the token in the URL for this push:

```powershell
git remote set-url origin https://virupakshpatil:YOUR_TOKEN_HERE@github.com/virupakshpatil/candidate-support-automation.git
git push -u origin master
```

Replace `YOUR_TOKEN_HERE` with your actual token.

**Note:** After pushing, change it back to the regular URL for security:
```powershell
git remote set-url origin https://github.com/virupakshpatil/candidate-support-automation.git
```

---

## Quick Fix Script

Run this in PowerShell:

```powershell
# Clear GitHub credentials
cmdkey /delete:git:https://github.com 2>$null
cmdkey /delete:LegacyGeneric:target=git:https://github.com 2>$null

# Push (will prompt for credentials)
git push -u origin master
```

Then enter:
- Username: `virupakshpatil`
- Password: `<your token>`

