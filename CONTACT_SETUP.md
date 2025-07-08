# 📧 Contact Form Setup Guide - URGENT FIX NEEDED

## 🚨 CURRENT ERROR: Missing credentials for "PLAIN"

**QUICK FIX (5 minutes):**

### Step 1: Set Up Gmail App Password
1. **Create/Access Gmail:** `help.algomaster@gmail.com`
2. **Enable 2FA:** Go to https://myaccount.google.com/security
3. **Generate App Password:**
   - Click "App passwords" (only appears after 2FA)
   - Select "Mail" → Generate
   - Copy the 16-character password

### Step 2: Update .env.local
```bash
# Find this line in .env.local:
SMTP_PASS=your-gmail-app-password-here
# Replace with your actual app password:
SMTP_PASS=abcd efgh ijkl mnop
```

### Step 3: Restart Server
```bash
npm run dev
```

**✅ Contact form will work after this!**

---

## 📧 Full Email Configuration

### Environment Variables (Already Set)
The `.env.local` file already contains:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=help.algomaster@gmail.com
SMTP_PASS=your-gmail-app-password-here  # ← UPDATE THIS
CONTACT_EMAIL=help.algomaster@gmail.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Gmail Setup (Recommended)
If using Gmail:

1. **Enable 2-Step Verification** on your Google account
2. **Generate App Password**:
   - Go to Google Account → Security → 2-Step Verification
   - Click "App passwords" 
   - Select "Mail" and generate password
   - Use this password in `SMTP_PASS`

### 3. Other Email Providers
For other providers, update SMTP settings:

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

## 🚀 Features

### ✅ What's Included
- ✅ Form validation (required fields, email format)
- ✅ Input sanitization (XSS protection)
- ✅ Professional email templates
- ✅ Auto-confirmation emails to users
- ✅ Loading states and success/error messages
- ✅ Rate limiting ready
- ✅ Responsive design

### 📧 Email Features
1. **Admin Notification**: You receive formatted emails with user details
2. **User Confirmation**: Users get a thank you email
3. **Professional Design**: HTML email templates with your branding

## 🔧 API Endpoint

**URL:** `/api/contact`
**Method:** `POST`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "subject": "bug-report",
  "message": "I found a bug in the sorting algorithm..."
}
```

**Response (Success):**
```json
{
  "message": "Message sent successfully! We will get back to you within 24 hours.",
  "success": true
}
```

**Response (Error):**
```json
{
  "error": "All fields are required",
  "success": false
}
```

## 🛡️ Security Features

- **Input Validation**: All fields are validated
- **Email Validation**: Proper email format checking
- **XSS Protection**: Input sanitization 
- **Rate Limiting Ready**: Can be easily added
- **Error Handling**: Comprehensive error messages

## 📱 Form Fields

- **Name**: Required text field
- **Email**: Required email field with validation
- **Subject**: Required dropdown with predefined options:
  - Bug Report
  - Feature Request  
  - Algorithm Question
  - General Inquiry
  - Partnership/Collaboration
  - Feedback
- **Message**: Required textarea (minimum 10 characters)

## 🧪 Testing

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Test API Endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","subject":"general-inquiry","message":"This is a test message"}'
   ```

3. **Check Form at:** `http://localhost:3000/contact`

## 🚨 Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   - Check SMTP credentials
   - Use App Password for Gmail
   - Verify 2FA is enabled

2. **"Connection timeout"**
   - Check SMTP host and port
   - Verify firewall settings
   - Try different SMTP provider

3. **"Form not submitting"**
   - Check browser console for errors
   - Verify API endpoint is running
   - Check network requests in DevTools

### Debug Mode:
Check server logs in terminal for detailed error messages.

## 📞 Production Deployment

1. **Update Environment Variables** in your hosting platform
2. **Set Production URL** in `NEXT_PUBLIC_BASE_URL`
3. **Test Email Delivery** before going live
4. **Set up Monitoring** for failed email deliveries

## 🔄 Next Steps

Consider adding:
- Database logging of submissions
- Admin dashboard to view messages  
- Email templates customization
- Spam protection (reCAPTCHA)
- File attachment support

---

**📧 Contact Email: help.algomaster@gmail.com**

**Need Help?** The contact form is ready to receive messages! Users will get confirmation emails and you'll receive formatted notifications at help.algomaster@gmail.com.
