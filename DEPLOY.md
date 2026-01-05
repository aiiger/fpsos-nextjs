# 🚀 Deployment Guide - fpsos.gg

## Prerequisites

- GitHub account (free)
- Vercel account (free) - Sign up at [vercel.com](https://vercel.com)
- Domain `fpsos.gg` (you already own this)

---

## 📋 Step-by-Step Deployment

### 1️⃣ Push to GitHub

**Option A: Using GitHub Desktop**
1. Download GitHub Desktop: [desktop.github.com](https://desktop.github.com)
2. Open GitHub Desktop → File → Add Local Repository
3. Select folder: `Y:\fpsos-nextjs`
4. Click "Create Repository" if not initialized
5. Commit all files: Enter message "Initial commit"
6. Click "Publish repository" → Make it Public
7. Repository is now on GitHub!

**Option B: Using Command Line**
```bash
cd Y:\fpsos-nextjs

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: FPsOS website"

# Create repo on GitHub (requires GitHub CLI)
gh repo create fpsos-website --public --source=. --remote=origin

# Push
git push -u origin main
```

### 2️⃣ Deploy to Vercel

**Method 1: Vercel Dashboard (Easiest)**

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Click "Add New..." → "Project"
4. Import your GitHub repository (`fpsos-website`)
5. Vercel auto-detects Next.js settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `out`
   - Install Command: `npm install`
6. Click "Deploy"
7. Wait 1-2 minutes
8. Your site is live at `https://fpsos-website-xxx.vercel.app`

**Method 2: Vercel CLI (Faster for updates)**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd Y:\fpsos-nextjs
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? [Your account]
# - Link to existing project? N
# - What's your project's name? fpsos-website
# - In which directory is your code located? ./
# - Want to override the settings? N

# Deploy to production
vercel --prod
```

### 3️⃣ Connect Custom Domain (fpsos.gg)

**In Vercel Dashboard:**

1. Go to your project → Settings → Domains
2. Add domain: `fpsos.gg`
3. Add domain: `www.fpsos.gg`
4. Vercel will show DNS instructions

**Update DNS at Your Registrar (Namecheap, GoDaddy, etc.):**

**For Root Domain (fpsos.gg):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: Automatic
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Automatic
```

**Wait for DNS Propagation:**
- Usually takes 5-30 minutes
- Can take up to 48 hours in rare cases
- Check status: [dnschecker.org](https://dnschecker.org)

**SSL Certificate:**
- Vercel automatically provisions SSL (HTTPS)
- No action needed - happens automatically once DNS propagates

### 4️⃣ Verify Deployment

Visit these URLs to confirm:
- ✅ `https://fpsos.gg` - Homepage
- ✅ `https://www.fpsos.gg` - WWW redirect
- ✅ `https://fpsos.gg/packages` - Packages page
- ✅ `https://fpsos.gg/diagnostic` - Diagnostic tool
- ✅ `https://fpsos.gg/terms` - Terms page

---

## 🔄 Updating the Website

### After Making Changes

**Method 1: Git + Vercel Auto-Deploy (Recommended)**

```bash
cd Y:\fpsos-nextjs

# Make your changes to files...

# Commit changes
git add .
git commit -m "Update: describe your changes"
git push

# Vercel automatically deploys new changes!
# No need to run vercel command again
```

**Method 2: Direct Vercel Deploy**

```bash
cd Y:\fpsos-nextjs

# Make your changes...

# Deploy immediately
vercel --prod
```

---

## 🎯 Post-Deployment Checklist

- [ ] All 4 pages load correctly
- [ ] Diagnostic tool runs browser tests
- [ ] PowerShell download works
- [ ] Calendly links open (update with your actual links)
- [ ] Social media links work (Discord, WhatsApp, Instagram)
- [ ] Mobile responsive (test on phone)
- [ ] SSL certificate active (HTTPS shows padlock)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)

---

## ⚙️ Optional: Vercel Analytics

**Free analytics included with Vercel:**

1. In Vercel Dashboard → Your Project → Analytics
2. Click "Enable Analytics"
3. View page views, visitors, performance metrics
4. No code changes needed!

---

## 🔧 Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Fix dependencies"
git push
```

**Error: "Export encountered errors"**
```bash
# Check next.config.js has:
output: 'export'

# Rebuild locally first to test
npm run build

# If succeeds locally, commit and push
```

### Domain Not Working

**DNS not propagating:**
- Wait longer (can take 24-48 hours)
- Clear browser cache (Ctrl+Shift+Del)
- Try incognito mode
- Check [dnschecker.org](https://dnschecker.org)

**Wrong DNS records:**
- Verify A record: `76.76.21.21`
- Verify CNAME: `cname.vercel-dns.com`
- Remove any old DNS records for fpsos.gg

### Site Looks Broken

**Styles not loading:**
- Hard refresh: Ctrl+Shift+R (Chrome) or Cmd+Shift+R (Mac)
- Clear cache
- Check browser console (F12) for errors

**Fonts not loading:**
- Google Fonts may be blocked in some regions
- Check `app/globals.css` font import URL
- Fonts load from Google CDN automatically

---

## 💡 Pro Tips

1. **Use Vercel Preview Deployments**
   - Every git push creates a preview URL
   - Test changes before they go live on fpsos.gg
   - Branch-specific URLs for staging

2. **Enable Branch Protection**
   - GitHub → Settings → Branches → Add rule
   - Require pull request reviews
   - Prevents accidental direct pushes to main

3. **Monitor Performance**
   - Vercel Analytics shows real user metrics
   - Lighthouse CI in Vercel checks every deploy
   - Aim for 95+ score across all metrics

4. **Set Up Alerts**
   - Vercel → Project → Settings → Notifications
   - Email alerts for failed deployments
   - Slack/Discord webhook integrations

---

## 📞 Need Help?

**Vercel Support:**
- Docs: [vercel.com/docs](https://vercel.com/docs)
- Community: [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)

**DNS Issues:**
- Your registrar's support (Namecheap, GoDaddy, etc.)
- [dnschecker.org](https://dnschecker.org) for checking propagation

---

## ✅ You're Done!

Your fpsos.gg website is now:
- ✅ Live on the internet
- ✅ Using your custom domain
- ✅ HTTPS secured
- ✅ Auto-deploying on every git push
- ✅ Free hosting forever (Vercel free tier)

Welcome to the modern web! 🎉
