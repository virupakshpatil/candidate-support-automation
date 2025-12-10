# How to Create GitHub Personal Access Token

## Method 1: Direct Link (Easiest)

**Click this link to go directly to the tokens page:**
👉 https://github.com/settings/tokens/new

If that doesn't work, follow the manual steps below.

---

## Method 2: Manual Navigation

### Step-by-Step:

1. **Go to GitHub.com** and sign in
2. **Click your profile picture** (top right corner)
3. **Click "Settings"** (from the dropdown menu)
4. **Scroll down** in the left sidebar
5. **Click "Developer settings"** (at the bottom of the left menu)
6. **Click "Personal access tokens"**
7. **Click "Tokens (classic)"**
8. **Click "Generate new token"** → **"Generate new token (classic)"**

---

## Method 3: Direct URL Navigation

Copy and paste this URL in your browser:
```
https://github.com/settings/tokens/new
```

Or try:
```
https://github.com/settings/apps/tokens
```

---

## After You Get to the Token Page:

1. **Note:** Give it a name like "Render Deployment"
2. **Expiration:** Choose "90 days" or "No expiration" (for automation)
3. **Select scopes:** Check the box for **`repo`** (this gives full access to repositories)
4. **Scroll down** and click **"Generate token"**
5. **IMPORTANT:** Copy the token immediately! It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
6. **Save it somewhere safe** - you'll need it to push code

---

## What the Token Looks Like:

```
ghp_1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
```

It starts with `ghp_` followed by a long string.

---

## Alternative: Use GitHub CLI

If you have GitHub CLI installed, you can authenticate without a token:

```powershell
gh auth login
```

Then you can push normally without entering credentials.

---

## Still Can't Find It?

If you still can't access the tokens page, try:

1. **Check if you're signed in** to GitHub
2. **Try a different browser** (Chrome, Firefox, Edge)
3. **Clear browser cache** and try again
4. **Use incognito/private mode**

The direct link should work: https://github.com/settings/tokens/new

