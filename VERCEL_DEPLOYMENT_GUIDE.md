# 🚀 Vercel Deployment Management Guide

## 📋 **Current Deployment Status**
- **Live Site**: https://algomaster-alpha.vercel.app/
- **Repository**: Connected to GitHub (algorithm-automata-simulator)
- **Auto-Deploy**: ✅ Enabled (deploys on every push to main branch)
- **Build Status**: ✅ Working (ESLint/TypeScript errors disabled)

## 🔄 **How to Deploy Changes**

### **Method 1: Automatic Deployment (Current Setup)**
Your repository is connected to Vercel for automatic deployments:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main
```

**What happens:**
1. Vercel detects the GitHub push
2. Starts building your Next.js app
3. Deploys to https://algomaster-alpha.vercel.app/
4. Takes 2-3 minutes total

### **Method 2: Manual Redeploy via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Find "algorithm-automata-simulator" project
3. Click "Deployments" tab
4. Click "Redeploy" on latest deployment

### **Method 3: Force Deploy Without Code Changes**
```bash
# Create empty commit to trigger deployment
git commit --allow-empty -m "Force redeploy"
git push origin main
```

## ⚙️ **Vercel Dashboard Navigation**

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Find project: `algorithm-automata-simulator`
   - Click on the project

2. **Navigate to Settings:**
   - Click **Settings** tab
   - Click **Environment Variables** in left sidebar

3. **Add Each Variable:**
   Click **Add New** and enter:

   ```
   Name: SMTP_HOST
   Value: smtp.gmail.com
   Environment: Production
   ```

   ```
   Name: SMTP_PORT
   Value: 587
   Environment: Production
   ```

   ```
   Name: SMTP_USER
   Value: help.algomaster@gmail.com
   Environment: Production
   ```

   ```
   Name: SMTP_PASS
   Value: rjik ogzq ngno igmz
   Environment: Production
   ```

   ```
   Name: CONTACT_EMAIL
   Value: help.algomaster@gmail.com
   Environment: Production
   ```

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Set environment variables
vercel env add SMTP_HOST production
# When prompted, enter: smtp.gmail.com

vercel env add SMTP_PORT production
# When prompted, enter: 587

vercel env add SMTP_USER production
# When prompted, enter: help.algomaster@gmail.com

vercel env add SMTP_PASS production
# When prompted, enter: rjik ogzq ngno igmz

vercel env add CONTACT_EMAIL production
# When prompted, enter: help.algomaster@gmail.com
```

## 🚀 STEP 3: Redeploy Application

After setting environment variables:

### Via Dashboard:
1. Go to **Deployments** tab
2. Click **"..."** next to latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (faster)

### Via CLI:
```bash
vercel --prod
```

### Via Git Push:
```bash
git add .
git commit -m "Add production environment variables"
git push origin main
```

## 🚀 STEP 4: Test Production Contact Form

Once redeployment completes:

1. **Get your live URL** (something like `https://algorithm-automata-simulator-xxx.vercel.app`)
2. **Visit contact page:** `https://your-url.vercel.app/contact`
3. **Submit test message**
4. **Check for errors in browser console**

## ⚠️ SECURITY RECOMMENDATIONS

### Immediate Security Actions:

1. **Regenerate Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Delete current app password: `rjik ogzq ngno igmz`
   - Generate new app password
   - Update both `.env.local` and Vercel environment variables

2. **Update .env.local:**
   ```bash
   SMTP_PASS=your-new-app-password-here
   ```

3. **Update Vercel Environment Variable:**
   - Dashboard → Settings → Environment Variables
   - Edit `SMTP_PASS` variable
   - Enter new app password

## 📊 Verification Checklist

- [ ] Build completed successfully on Vercel
- [ ] Environment variables added to Vercel
- [ ] Application redeployed
- [ ] Contact form tested on live URL
- [ ] Gmail app password regenerated for security
- [ ] Local `.env.local` updated with new password

## 🎯 Expected Timeline

- **Build completion:** 2-5 minutes
- **Environment variable setup:** 3-5 minutes  
- **Redeployment:** 1-3 minutes
- **Total time:** ~10 minutes

## 📞 Troubleshooting

### If contact form still fails in production:

1. **Check Vercel Function Logs:**
   - Dashboard → Functions tab
   - Look for `/api/contact` errors

2. **Verify Environment Variables:**
   - Settings → Environment Variables
   - Ensure all variables are set for "Production"

3. **Test Gmail Credentials:**
   ```bash
   # Test SMTP connection locally first
   npm run dev
   # Try contact form at localhost:3000/contact
   ```

## 🎉 Success Indicators

✅ **Build Status:** "Ready" on Vercel Dashboard  
✅ **Contact Form:** Submits without errors  
✅ **Email Receipt:** Test emails received in Gmail  
✅ **No Console Errors:** Clean browser console on contact page  

Your algorithm learning platform will be fully live and contact-ready! 🚀

---

# 🚀 Vercel Deployment Management Guide (Extended)

## 📋 **Current Deployment Status**
- **Live Site**: https://algomaster-alpha.vercel.app/
- **Repository**: Connected to GitHub (algorithm-automata-simulator)
- **Auto-Deploy**: ✅ Enabled (deploys on every push to main branch)
- **Build Status**: ✅ Working (ESLint/TypeScript errors disabled)

## 🔄 **How to Deploy Changes**

### **Method 1: Automatic Deployment (Current Setup)**
Your repository is connected to Vercel for automatic deployments:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main
```

**What happens:**
1. Vercel detects the GitHub push
2. Starts building your Next.js app
3. Deploys to https://algomaster-alpha.vercel.app/
4. Takes 2-3 minutes total

### **Method 2: Manual Redeploy via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Find "algorithm-automata-simulator" project
3. Click "Deployments" tab
4. Click "Redeploy" on latest deployment

### **Method 3: Force Deploy Without Code Changes**
```bash
# Create empty commit to trigger deployment
git commit --allow-empty -m "Force redeploy"
git push origin main
```

## ⚙️ **Vercel Dashboard Navigation**

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Find project: `algorithm-automata-simulator`
   - Click on the project

2. **Navigate to Settings:**
   - Click **Settings** tab
   - Click **Environment Variables** in left sidebar

3. **Add Each Variable:**
   Click **Add New** and enter:

   ```
   Name: SMTP_HOST
   Value: smtp.gmail.com
   Environment: Production
   ```

   ```
   Name: SMTP_PORT
   Value: 587
   Environment: Production
   ```

   ```
   Name: SMTP_USER
   Value: help.algomaster@gmail.com
   Environment: Production
   ```

   ```
   Name: SMTP_PASS
   Value: rjik ogzq ngno igmz
   Environment: Production
   ```

   ```
   Name: CONTACT_EMAIL
   Value: help.algomaster@gmail.com
   Environment: Production
   ```

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Set environment variables
vercel env add SMTP_HOST production
# When prompted, enter: smtp.gmail.com

vercel env add SMTP_PORT production
# When prompted, enter: 587

vercel env add SMTP_USER production
# When prompted, enter: help.algomaster@gmail.com

vercel env add SMTP_PASS production
# When prompted, enter: rjik ogzq ngno igmz

vercel env add CONTACT_EMAIL production
# When prompted, enter: help.algomaster@gmail.com
```

## 🚀 STEP 3: Redeploy Application

After setting environment variables:

### Via Dashboard:
1. Go to **Deployments** tab
2. Click **"..."** next to latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (faster)

### Via CLI:
```bash
vercel --prod
```

### Via Git Push:
```bash
git add .
git commit -m "Add production environment variables"
git push origin main
```

## 🚀 STEP 4: Test Production Contact Form

Once redeployment completes:

1. **Get your live URL** (something like `https://algorithm-automata-simulator-xxx.vercel.app`)
2. **Visit contact page:** `https://your-url.vercel.app/contact`
3. **Submit test message**
4. **Check for errors in browser console**

## ⚠️ SECURITY RECOMMENDATIONS

### Immediate Security Actions:

1. **Regenerate Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Delete current app password: `rjik ogzq ngno igmz`
   - Generate new app password
   - Update both `.env.local` and Vercel environment variables

2. **Update .env.local:**
   ```bash
   SMTP_PASS=your-new-app-password-here
   ```

3. **Update Vercel Environment Variable:**
   - Dashboard → Settings → Environment Variables
   - Edit `SMTP_PASS` variable
   - Enter new app password

## 📊 Verification Checklist

- [ ] Build completed successfully on Vercel
- [ ] Environment variables added to Vercel
- [ ] Application redeployed
- [ ] Contact form tested on live URL
- [ ] Gmail app password regenerated for security
- [ ] Local `.env.local` updated with new password

## 🎯 Expected Timeline

- **Build completion:** 2-5 minutes
- **Environment variable setup:** 3-5 minutes  
- **Redeployment:** 1-3 minutes
- **Total time:** ~10 minutes

## 📞 Troubleshooting

### If contact form still fails in production:

1. **Check Vercel Function Logs:**
   - Dashboard → Functions tab
   - Look for `/api/contact` errors

2. **Verify Environment Variables:**
   - Settings → Environment Variables
   - Ensure all variables are set for "Production"

3. **Test Gmail Credentials:**
   ```bash
   # Test SMTP connection locally first
   npm run dev
   # Try contact form at localhost:3000/contact
   ```

## 🎉 Success Indicators

✅ **Build Status:** "Ready" on Vercel Dashboard  
✅ **Contact Form:** Submits without errors  
✅ **Email Receipt:** Test emails received in Gmail  
✅ **No Console Errors:** Clean browser console on contact page  

Your algorithm learning platform will be fully live and contact-ready! 🚀

---

# 🚀 Vercel Deployment Management Guide (Extended)

## 📋 **Current Deployment Status**
- **Live Site**: https://algomaster-alpha.vercel.app/
- **Repository**: Connected to GitHub (algorithm-automata-simulator)
- **Auto-Deploy**: ✅ Enabled (deploys on every push to main branch)
- **Build Status**: ✅ Working (ESLint/TypeScript errors disabled)

## 🔄 **How to Deploy Changes**

### **Method 1: Automatic Deployment (Current Setup)**
Your repository is connected to Vercel for automatic deployments:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main
```

**What happens:**
1. Vercel detects the GitHub push
2. Starts building your Next.js app
3. Deploys to https://algomaster-alpha.vercel.app/
4. Takes 2-3 minutes total

### **Method 2: Manual Redeploy via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Find "algorithm-automata-simulator" project
3. Click "Deployments" tab
4. Click "Redeploy" on latest deployment

### **Method 3: Force Deploy Without Code Changes**
```bash
# Create empty commit to trigger deployment
git commit --allow-empty -m "Force redeploy"
git push origin main
```

## ⚙️ **Vercel Dashboard Navigation**

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Find project: `algorithm-automata-simulator`
   - Click on the project

2. **Navigate to Settings:**
   - Click **Settings** tab
   - Click **Environment Variables** in left sidebar

3. **Add Each Variable:**
   Click **Add New** and enter:

   ```
   Name: SMTP_HOST
   Value: smtp.gmail.com
   Environment: Production
   ```

   ```
   Name: SMTP_PORT
   Value: 587
   Environment: Production
   ```

   ```
   Name: SMTP_USER
   Value: help.algomaster@gmail.com
   Environment: Production
   ```

   ```
   Name: SMTP_PASS
   Value: rjik ogzq ngno igmz
   Environment: Production
   ```

   ```
   Name: CONTACT_EMAIL
   Value: help.algomaster@gmail.com
   Environment: Production
   ```

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Set environment variables
vercel env add SMTP_HOST production
# When prompted, enter: smtp.gmail.com

vercel env add SMTP_PORT production
# When prompted, enter: 587

vercel env add SMTP_USER production
# When prompted, enter: help.algomaster@gmail.com

vercel env add SMTP_PASS production
# When prompted, enter: rjik ogzq ngno igmz

vercel env add CONTACT_EMAIL production
# When prompted, enter: help.algomaster@gmail.com
```

## 🚀 STEP 3: Redeploy Application

After setting environment variables:

### Via Dashboard:
1. Go to **Deployments** tab
2. Click **"..."** next to latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (faster)

### Via CLI:
```bash
vercel --prod
```

### Via Git Push:
```bash
git add .
git commit -m "Add production environment variables"
git push origin main
```

## 🚀 STEP 4: Test Production Contact Form

Once redeployment completes:

1. **Get your live URL** (something like `https://algorithm-automata-simulator-xxx.vercel.app`)
2. **Visit contact page:** `https://your-url.vercel.app/contact`
3. **Submit test message**
4. **Check for errors in browser console**

## ⚠️ SECURITY RECOMMENDATIONS

### Immediate Security Actions:

1. **Regenerate Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Delete current app password: `rjik ogzq ngno igmz`
   - Generate new app password
   - Update both `.env.local` and Vercel environment variables

2. **Update .env.local:**
   ```bash
   SMTP_PASS=your-new-app-password-here
   ```

3. **Update Vercel Environment Variable:**
   - Dashboard → Settings → Environment Variables
   - Edit `SMTP_PASS` variable
   - Enter new app password

## 📊 Verification Checklist

- [ ] Build completed successfully on Vercel
- [ ] Environment variables added to Vercel
- [ ] Application redeployed
- [ ] Contact form tested on live URL
- [ ] Gmail app password regenerated for security
- [ ] Local `.env.local` updated with new password

## 🎯 Expected Timeline

- **Build completion:** 2-5 minutes
- **Environment variable setup:** 3-5 minutes  
- **Redeployment:** 1-3 minutes
- **Total time:** ~10 minutes

## 📞 Troubleshooting

### If contact form still fails in production:

1. **Check Vercel Function Logs:**
   - Dashboard → Functions tab
   - Look for `/api/contact` errors

2. **Verify Environment Variables:**
   - Settings → Environment Variables
   - Ensure all variables are set for "Production"

3. **Test Gmail Credentials:**
   ```bash
   # Test SMTP connection locally first
   npm run dev
   # Try contact form at localhost:3000/contact
   ```

## 🎉 Success Indicators

✅ **Build Status:** "Ready" on Vercel Dashboard  
✅ **Contact Form:** Submits without errors  
✅ **Email Receipt:** Test emails received in Gmail  
✅ **No Console Errors:** Clean browser console on contact page  

Your algorithm learning platform will be fully live and contact-ready! 🚀

---

# 🚀 Vercel Deployment Management Guide (Extended)

## 📋 **Current Deployment Status**
- **Live Site**: https://algomaster-alpha.vercel.app/
- **Repository**: Connected to GitHub (algorithm-automata-simulator)
- **Auto-Deploy**: ✅ Enabled (deploys on every push to main branch)
- **Build Status**: ✅ Working (ESLint/TypeScript errors disabled)

## 🔄 **How to Deploy Changes**

### **Method 1: Automatic Deployment (Current Setup)**
Your repository is connected to Vercel for automatic deployments:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main
```

**What happens:**
1. Vercel detects the GitHub push
2. Starts building your Next.js app
3. Deploys to https://algomaster-alpha.vercel.app/
4. Takes 2-3 minutes total

### **Method 2: Manual Redeploy via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Find "algorithm-automata-simulator" project
3. Click "Deployments" tab
4. Click "Redeploy" on latest deployment

### **Method 3: Force Deploy Without Code Changes**
```bash
# Create empty commit to trigger deployment
git commit --allow-empty -m "Force redeploy"
git push origin main
```

## ⚙️ **Vercel Dashboard Navigation**

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Find project: `algorithm-automata-simulator`
   - Click on the project

2. **Navigate to Settings:**
   - Click **Settings** tab
   - Click **Environment Variables** in left sidebar

3. **Add Each Variable:**
   Click **Add New** and enter:

   ```
   Name: SMTP_HOST
   Value: smtp.gmail.com
   Environment: Production
   ```

   ```
   Name: SMTP_PORT
   Value: 587
   Environment: Production
   ```

   ```
   Name: SMTP_USER
   Value: help.algomaster@gmail.com
   Environment: Production
   ```

   ```
   Name: SMTP_PASS
   Value: rjik ogzq ngno igmz
   Environment: Production
   ```

   ```
   Name: CONTACT_EMAIL
   Value: help.algomaster@gmail.com
   Environment: Production
   ```

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Set environment variables
vercel env add SMTP_HOST production
# When prompted, enter: smtp.gmail.com

vercel env add SMTP_PORT production
# When prompted, enter: 587

vercel env add SMTP_USER production
# When prompted, enter: help.algomaster@gmail.com

vercel env add SMTP_PASS production
# When prompted, enter: rjik ogzq ngno igmz

vercel env add CONTACT_EMAIL production
# When prompted, enter: help.algomaster@gmail.com
```

## 🚀 STEP 3: Redeploy Application

After setting environment variables:

### Via Dashboard:
1. Go to **Deployments** tab
2. Click **"..."** next to latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (faster)

### Via CLI:
```bash
vercel --prod
```

### Via Git Push:
```bash
git add .
git commit -m "Add production environment variables"
git push origin main
```

## 🚀 STEP 4: Test Production Contact Form

Once redeployment completes:

1. **Get your live URL** (something like `https://algorithm-automata-simulator-xxx.vercel.app`)
2. **Visit contact page:** `https://your-url.vercel.app/contact`
3. **Submit test message**
4. **Check for errors in browser console**

## ⚠️ SECURITY RECOMMENDATIONS

### Immediate Security Actions:

1. **Regenerate Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Delete current app password: `rjik ogzq ngno igmz`
   - Generate new app password
   - Update both `.env.local` and Vercel environment variables

2. **Update .env.local:**
   ```bash
   SMTP_PASS=your-new-app-password-here
   ```

3. **Update Vercel Environment Variable:**
   - Dashboard → Settings → Environment Variables
   - Edit `SMTP_PASS` variable
   - Enter new app password

## 📊 Verification Checklist

- [ ] Build completed successfully on Vercel
- [ ] Environment variables added to Vercel
- [ ] Application redeployed
- [ ] Contact form tested on live URL
- [ ] Gmail app password regenerated for security
- [ ] Local `.env.local` updated with new password

## 🎯 Expected Timeline

- **Build completion:** 2-5 minutes
- **Environment variable setup:** 3-5 minutes  
- **Redeployment:** 1-3 minutes
- **Total time:** ~10 minutes

## 📞 Troubleshooting

### If contact form still fails in production:

1. **Check Vercel Function Logs:**
   - Dashboard → Functions tab
   - Look for `/api/contact` errors

2. **Verify Environment Variables:**
   - Settings → Environment Variables
   - Ensure all variables are set for "Production"

3. **Test Gmail Credentials:**
   ```bash
   # Test SMTP connection locally first
   npm run dev
   # Try contact form at localhost:3000/contact
   ```

## 🎉 Success Indicators

✅ **Build Status:** "Ready" on Vercel Dashboard  
✅ **Contact Form:** Submits without errors  
✅ **Email Receipt:** Test emails received in Gmail  
✅ **No Console Errors:** Clean browser console on contact page  

Your algorithm learning platform will be fully live and contact-ready! 🚀

---

# 🚀 Vercel Deployment Management Guide (Extended)

## 📋 **Current Deployment Status**
- **Live Site**: https://algomaster-alpha.vercel.app/
- **Repository**: Connected to GitHub (algorithm-automata-simulator)
- **Auto-Deploy**: ✅ Enabled (deploys on every push to main branch)
- **Build Status**: ✅ Working (ESLint/TypeScript errors disabled)

## 🔄 **How to Deploy Changes**

### **Method 1: Automatic Deployment (Current Setup)**
Your repository is connected to Vercel for automatic deployments:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main
```

**What happens:**
1. Vercel detects the GitHub push
2. Starts building your Next.js app
3. Deploys to https://algomaster-alpha.vercel.app/
4. Takes 2-3 minutes total

### **Method 2: Manual Redeploy via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Find "algorithm-automata-simulator" project
3. Click "Deployments" tab
4. Click "Redeploy" on latest deployment

### **Method 3: Force Deploy Without Code Changes**
```bash
# Create empty commit to trigger deployment
git commit --allow-empty -m "Force redeploy"
git push origin main
```

## ⚙️ **Vercel Dashboard Navigation**

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Find project: `algorithm-automata-simulator`
   - Click on the project

2. **Navigate to Settings:**
   - Click **Settings** tab
   - Click **Environment Variables** in left sidebar

3. **Add Each Variable:**
   Click **Add New** and enter:

   ```
   Name: SMTP_HOST
   Value: smtp.gmail.com
   Environment: Production
   ```

   ```
   Name: SMTP_PORT
   Value: 587
   Environment: Production
   ```

   ```
   Name: SMTP_USER
   Value: help.algomaster@gmail.com
   Environment: Production
   ```

   ```
   Name: SMTP_PASS
   Value: rjik ogzq ngno igmz
   Environment: Production
   ```

   ```
   Name: CONTACT_EMAIL
   Value: help.algomaster@gmail.com
   Environment: Production
   ```

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Set environment variables
vercel env add SMTP_HOST production
# When prompted, enter: smtp.gmail.com

vercel env add SMTP_PORT production
# When prompted, enter: 587

vercel env add SMTP_USER production
# When prompted, enter: help.algomaster@gmail.com

vercel env add SMTP_PASS production
# When prompted, enter: rjik ogzq ngno igmz

vercel env add CONTACT_EMAIL production
# When prompted, enter: help.algomaster@gmail.com
```

## 🚀 STEP 3: Redeploy Application

After setting environment variables:

### Via Dashboard:
1. Go to **Deployments** tab
2. Click **"..."** next to latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (faster)

### Via CLI:
```bash
vercel --prod
```

### Via Git Push:
```bash
git add .
git commit -m "Add production environment variables"
git push origin main
```

## 🚀 STEP 4: Test Production Contact Form

Once redeployment completes:

1. **Get your live URL** (something like `https://algorithm-automata-simulator-xxx.vercel.app`)
2. **Visit contact page:** `https://your-url.vercel.app/contact`
3. **Submit test message**
4. **Check for errors in browser console**

## ⚠️ SECURITY RECOMMENDATIONS

### Immediate Security Actions:

1. **Regenerate Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Delete current app password: `rjik ogzq ngno igmz`
   - Generate new app password
   - Update both `.env.local` and Vercel environment variables

2. **Update .env.local:**
   ```bash
   SMTP_PASS=your-new-app-password-here
   ```

3. **Update Vercel Environment Variable:**
   - Dashboard → Settings → Environment Variables
   - Edit `SMTP_PASS` variable
   - Enter new app password

## 📊 Verification Checklist

- [ ] Build completed successfully on Vercel
- [ ] Environment variables added to Vercel
- [ ] Application redeployed
- [ ] Contact form tested on live URL
- [ ] Gmail app password regenerated for security
- [ ] Local `.env.local` updated with new password

## 🎯 Expected Timeline

- **Build completion:** 2-5 minutes
- **Environment variable setup:** 3-5 minutes  
- **Redeployment:** 1-3 minutes
- **Total time:** ~10 minutes

## 📞 Troubleshooting

### If contact form still fails in production:

1. **Check Vercel Function Logs:**
   - Dashboard → Functions tab
   - Look for `/api/contact` errors

2. **Verify Environment Variables:**
   - Settings → Environment Variables
   - Ensure all variables are set for "Production"

3. **Test Gmail Credentials:**
   ```bash
   # Test SMTP connection locally first
   npm run dev
   # Try contact form at localhost:3000/contact
   ```

## 🎉 Success Indicators

✅ **Build Status:** "Ready" on Vercel Dashboard  
✅ **Contact Form:** Submits without errors  
✅ **Email Receipt:** Test emails received in Gmail  
✅ **No Console Errors:** Clean browser console on contact page  

Your algorithm learning platform will be fully live and contact-ready! 🚀

---

# 🚀 Vercel Deployment Management Guide (Extended)

## 📋 **Current Deployment Status**
- **Live Site**: https://algomaster-alpha.vercel.app/
- **Repository**: Connected to GitHub (algorithm-automata-simulator)
- **Auto-Deploy**: ✅ Enabled (deploys on every push to main branch)
- **Build Status**: ✅ Working (ESLint/TypeScript errors disabled)

## 🔄 **How to Deploy Changes**

### **Method 1: Automatic Deployment (Current Setup)**
Your repository is connected to Vercel for automatic deployments:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main
```

**What happens:**
1. Vercel detects the GitHub push
2. Starts building your Next.js app
3. Deploys to https://algomaster-alpha.vercel.app/
4. Takes 2-3 minutes total

### **Method 2: Manual Redeploy via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Find "algorithm-automata-simulator" project
3. Click "Deployments" tab
4. Click "Redeploy" on latest deployment

### **Method 3: Force Deploy Without Code Changes**
```bash
# Create empty commit to trigger deployment
git commit --allow-empty -m "Force redeploy"
git push origin main
```

## ⚙️ **Vercel Dashboard Navigation**

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Find project: `algorithm-automata-simulator`
   - Click on the project

2. **Navigate to Settings:**
   - Click **Settings** tab
   - Click **Environment Variables** in left sidebar

3. **Add Each Variable:**
   Click **Add New** and enter:

   ```
   Name: SMTP_HOST
   Value: smtp.gmail.com
   Environment: Production
   ```

   ```
   Name: SMTP_PORT
   Value: 587
   Environment: Production
   ```

   ```
   Name: SMTP_USER
   Value: help.algomaster@gmail.com
   Environment: Production
   ```

   ```
   Name: SMTP_PASS
   Value: rjik ogzq ngno igmz
   Environment: Production
   ```

   ```
   Name: CONTACT_EMAIL
   Value: help.algomaster@gmail.com
   Environment: Production
   ```

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Set environment variables
vercel env add SMTP_HOST production
# When prompted, enter: smtp.gmail.com

vercel env add SMTP_PORT production
# When prompted, enter: 587

vercel env add SMTP_USER production
# When prompted, enter: help.algomaster@gmail.com

vercel env add SMTP_PASS production
# When prompted, enter: rjik ogzq ngno igmz

vercel env add CONTACT_EMAIL production
# When prompted, enter: help.algomaster@gmail.com
```

## 🚀 STEP 3: Redeploy Application

After setting environment variables:

### Via Dashboard:
1. Go to **Deployments** tab
2. Click **"..."** next to latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (faster)

### Via CLI:
```bash
vercel --prod
```

### Via Git Push:
```bash
git add .
git commit -m "Add production environment variables"
git push origin main
```

## 🚀 STEP 4: Test Production Contact Form

Once redeployment completes:

1. **Get your live URL** (something like `https://algorithm-automata-simulator-xxx.vercel.app`)
2. **Visit contact page:** `https://your-url.vercel.app/contact`
3. **Submit test message**
4. **Check for errors in browser console**

## ⚠️ SECURITY RECOMMENDATIONS

### Immediate Security Actions:

1. **Regenerate Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Delete current app password: `rjik ogzq ngno igmz`
   - Generate new app password
   - Update both `.env.local` and Vercel environment variables

2. **Update .env.local:**
   ```bash
   SMTP_PASS=your-new-app-password-here
   ```

3. **Update Vercel Environment Variable:**
   - Dashboard → Settings → Environment Variables
   - Edit `SMTP_PASS` variable
   - Enter new app password

## 📊 Verification Checklist

- [ ] Build completed successfully on Vercel
- [ ] Environment variables added to Vercel
- [ ] Application redeployed
- [ ] Contact form tested on live URL
- [ ] Gmail app password regenerated for security
- [ ] Local `.env.local` updated with new password

## 🎯 Expected Timeline

- **Build completion:** 2-5 minutes
- **Environment variable setup:** 3-5 minutes  
- **Redeployment:** 1-3 minutes
- **Total time:** ~10 minutes

## 📞 Troubleshooting

### If contact form still fails in production:

1. **Check Vercel Function Logs:**
   - Dashboard → Functions tab
   - Look for `/api/contact` errors

2. **Verify Environment Variables:**
   - Settings → Environment Variables
   - Ensure all variables are set for "Production"

3. **Test Gmail Credentials:**
   ```bash
   # Test SMTP connection locally first
   npm run dev
   # Try contact form at localhost:3000/contact
   ```

## 🎉 Success Indicators

✅ **Build Status:** "Ready" on Vercel Dashboard  
✅ **Contact Form:** Submits without errors  
✅ **Email Receipt:** Test emails received in Gmail  
✅ **No Console Errors:** Clean browser console on contact page  

Your algorithm learning platform will be fully live and contact-ready! 🚀

---

# 🚀 Vercel Deployment Management Guide (Extended)

## 📋 **Current Deployment Status**
- **Live Site**: https://algomaster-alpha.vercel.app/
- **Repository**: Connected to GitHub (algorithm-automata-simulator)
- **Auto-Deploy**: ✅ Enabled (deploys on every push to main branch)
- **Build Status**: ✅ Working (ESLint/TypeScript errors disabled)

## 🔄 **How to Deploy Changes**

### **Method 1: Automatic Deployment (Current Setup)**
Your repository is connected to Vercel for automatic deployments:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main
```

**What happens:**
1. Vercel detects the GitHub push
2. Starts building your Next.js app
3. Deploys to https://algomaster-alpha.vercel.app/
4. Takes 2-3 minutes total

### **Method 2: Manual Redeploy via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Find "algorithm-automata-simulator" project
3. Click "Deployments" tab
4. Click "Redeploy" on latest deployment

### **Method 3: Force Deploy Without Code Changes**
```bash
# Create empty commit to trigger deployment
git commit --allow-empty -m "Force redeploy"
git push origin main
```

## ⚙️ **Vercel Dashboard Navigation**

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Find project: `algorithm-automata-simulator`
   - Click on the project

2. **Navigate to Settings:**
   - Click **Settings** tab
   - Click **Environment Variables** in left sidebar

3. **Add Each Variable:**
   Click **Add New** and enter:

   ```
   Name: SMTP_HOST
   Value: smtp.gmail.com
   Environment: Production
   ```

   ```
   Name: SMTP_PORT
   Value: 587
   Environment: Production
   ```

   ```
   Name: SMTP_USER
   Value: help.algomaster@gmail.com
   Environment: Production
   ```

   ```
   Name: SMTP_PASS
   Value: rjik ogzq ngno igmz
   Environment: Production
   ```

   ```
   Name: CONTACT_EMAIL
   Value: help.algomaster@gmail.com
   Environment: Production
   ```

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Set environment variables
vercel env add SMTP_HOST production
# When prompted, enter: smtp.gmail.com

vercel env add SMTP_PORT production
# When prompted, enter: 587

vercel env add SMTP_USER production
# When prompted, enter: help.algomaster@gmail.com

vercel env add SMTP_PASS production
# When prompted, enter: rjik ogzq ngno igmz

vercel env add CONTACT_EMAIL production
# When prompted, enter: help.algomaster@gmail.com
```

## 🚀 STEP 3: Redeploy Application

After setting environment variables:

### Via Dashboard:
1. Go to **Deployments** tab
2. Click **"..."** next to latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (faster)

### Via CLI:
```bash
vercel --prod
```

### Via Git Push:
```bash
git add .
git commit -m "Add production environment variables"
git push origin main
```

## 🚀 STEP 4: Test Production Contact Form

Once redeployment completes:

1. **Get your live URL** (something like `https://algorithm-automata-simulator-xxx.vercel.app`)
2. **Visit contact page:** `https://your-url.vercel.app/contact`
3. **Submit test message**
4. **Check for errors in browser console**

## ⚠️ SECURITY RECOMMENDATIONS

### Immediate Security Actions:

1. **Regenerate Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Delete current app password: `rjik ogzq ngno igmz`
   - Generate new app password
   - Update both `.env.local` and Vercel environment variables

2. **Update .env.local:**
   ```bash
   SMTP_PASS=your-new-app-password-here
   ```

3. **Update Vercel Environment Variable:**
   - Dashboard → Settings → Environment Variables
   - Edit `SMTP_PASS` variable
   - Enter new app password

## 📊 Verification Checklist

- [ ] Build completed successfully on Vercel
- [ ] Environment variables added to Vercel
- [ ] Application redeployed
- [ ] Contact form tested on live URL
- [ ] Gmail app password regenerated for security
- [ ] Local `.env.local` updated with new password

## 🎯 Expected Timeline

- **Build completion:** 2-5 minutes
- **Environment variable setup:** 3-5 minutes  
- **Redeployment:** 1-3 minutes
- **Total time:** ~10 minutes

## 📞 Troubleshooting

### If contact form still fails in production:

1. **Check Vercel Function Logs:**
   - Dashboard → Functions tab
   - Look for `/api/contact` errors

2. **Verify Environment Variables:**
   - Settings → Environment Variables
   - Ensure all variables are set for "Production"

3. **Test Gmail Credentials:**
   ```bash
   # Test SMTP connection locally first
   npm run dev
   # Try contact form at localhost:3000/contact
   ```

## 🎉 Success Indicators

✅ **Build Status:** "Ready" on Vercel Dashboard  
✅ **Contact Form:** Submits without errors  
✅ **Email Receipt:** Test emails received in Gmail  
✅ **No Console Errors:** Clean browser console on contact page  

Your algorithm learning platform will be fully live and contact-ready! 🚀
