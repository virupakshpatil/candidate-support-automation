# GitHub Push Guide - Fix Authentication Issues

## Option 1: Use Personal Access Token (Recommended - Easiest)

### Step 1: Create Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "Render Deployment"
4. Select scopes: Check `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### Step 2: Push Using Token

When Git asks for password, use the **token** instead of your password:

```powershell
git push -u origin master
```

**Username:** `virupakshpatil`  
**Password:** `<paste your personal access token here>`

---

## Option 2: Use GitHub CLI (Alternative)

If you have GitHub CLI installed:

```powershell
gh auth login
```

Then push normally:
```powershell
git push -u origin master
```

---

## Option 3: Configure Git Credential Manager

Windows has Git Credential Manager built-in. When you push, it will prompt for credentials:

```powershell
git push -u origin master
```

Enter:
- **Username:** `virupakshpatil`
- **Password:** Your Personal Access Token (not your GitHub password)

The credentials will be saved for future use.

---

## Quick Fix: Try Push Now

After creating your Personal Access Token, run:

```powershell
git push -u origin master
```

When prompted:
- **Username:** `virupakshpatil`
- **Password:** `<your personal access token>`

---

## For Render Deployment

Once pushed to GitHub, you can:
1. Go to Render.com
2. Connect your GitHub repository
3. Deploy automatically

The repository is already set up, you just need to authenticate to push!

