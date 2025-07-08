# 🚨 URGENT: Fix Contact Form Error

## Error Message:
```
Contact form error: [Error: Missing credentials for "PLAIN"]
```

## ⚠️ IMPORTANT: Production Deployment Notice
**Your app is being deployed to Vercel!** Environment variables from `.env.local` won't work in production. 
**See `PRODUCTION_ENV_SETUP.md` for Vercel environment variable setup.**

## 5-Minute Fix (Local Development):

### 1. Create Gmail App Password
- Go to: https://myaccount.google.com/security
- Enable 2-Factor Authentication (required)
- Click "App passwords" → Select "Mail" → Generate
- Copy the 16-character password

### 2. Update .env.local
- Open: `.env.local` file in your project
- Find: `SMTP_PASS=your-gmail-app-password-here`
- Replace with: `SMTP_PASS=your-actual-app-password`

### 3. Restart Server
```bash
npm run dev
```

### 4. Test Contact Form
- Go to: http://localhost:3000/contact
- Submit test message
- Should work without errors!

## Email Setup Checklist:
- [ ] Gmail account created: `help.algomaster@gmail.com`
- [ ] 2-Factor Authentication enabled
- [ ] App password generated
- [ ] .env.local updated with app password
- [ ] Development server restarted
- [ ] Contact form tested successfully

**Need help?** Check `CONTACT_SETUP.md` for detailed instructions.
