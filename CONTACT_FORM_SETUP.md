# 📧 Contact Form Setup Instructions

## Quick Setup Guide

### 1. Create Gmail Account
Create the Gmail account: `help.algomaster@gmail.com`

### 2. Enable App Password
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **Security** → **2-Step Verification** (enable if not already)
3. Go to **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter "AlgoMaster Contact Form"
6. Copy the generated 16-character password

### 3. Set Environment Variables
Create `.env.local` file in your project root:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=help.algomaster@gmail.com
SMTP_PASS=your-16-character-app-password

# Contact Form
CONTACT_EMAIL=help.algomaster@gmail.com

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Analytics & AdSense (update after approval)
NEXT_PUBLIC_GA_ID=GA_MEASUREMENT_ID
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

### 4. Install Dependencies
```bash
npm install nodemailer @types/nodemailer
```

### 5. Test Contact Form
1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/contact`
3. Fill and submit the form
4. Check `help.algomaster@gmail.com` for incoming messages

## 🎯 How It Works

### User Journey
1. **User submits form** → Validation & sanitization
2. **Email sent to you** → `help.algomaster@gmail.com`
3. **Confirmation sent to user** → Professional thank you email
4. **You respond** → Direct reply to user's email

### Email Features
- ✅ **Professional Templates**: HTML-formatted emails
- ✅ **Automatic Replies**: Users get instant confirmation
- ✅ **Security**: Input sanitization and validation
- ✅ **Responsive**: Works on all devices

## 🔧 Troubleshooting

### Common Issues

**"Invalid login credentials"**
- Check app password is correct (16 characters, no spaces)
- Ensure 2-step verification is enabled
- Use app password, not regular Gmail password

**"Connection timeout"**
- Check SMTP settings (host: smtp.gmail.com, port: 587)
- Verify internet connection
- Check firewall settings

**"Email not received"**
- Check spam folder
- Verify CONTACT_EMAIL in .env.local
- Check Gmail account quota

### Testing Commands
```bash
# Check if API endpoint works
curl -X GET http://localhost:3000/api/contact

# Test with sample data
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","subject":"Test","message":"This is a test message"}'
```

## 🚀 Production Deployment

### For Vercel/Netlify
Add environment variables in your deployment platform:
- Go to Project Settings → Environment Variables
- Add all variables from `.env.local`
- Redeploy your application

### Update Base URL
After deployment, update:
```env
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

## 📊 Monitoring

### Email Logs
The contact form logs successful submissions to console:
```javascript
console.log('Contact form submission:', {
  name: 'User Name',
  email: 'user@email.com', 
  subject: 'Subject',
  timestamp: '2025-01-08T10:30:00.000Z'
});
```

### Success Metrics
Track these metrics:
- Form submission rate
- Email delivery success
- User response satisfaction
- Common inquiry types

---

**🎯 Your contact form is now ready to receive inquiries at help.algomaster@gmail.com!**
