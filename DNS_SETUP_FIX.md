# 🌐 DNS Setup Fix for algomaster.app

## Current Issue
Your Vercel dashboard shows "Invalid Configuration" because the DNS records at your domain provider don't match Vercel's requirements.

## Required DNS Configuration

According to your Vercel dashboard, you need to set up these DNS records at your domain provider:

### A Record (Required)
- **Type**: A
- **Name**: @ (or leave blank for root domain)
- **Value**: 216.198.79.1
- **TTL**: 3600 (or Auto)

## Step-by-Step Fix

### 1. Find Your Domain Provider
First, identify where you purchased `algomaster.app`. Common providers include:
- GoDaddy
- Namecheap
- Cloudflare
- Google Domains
- Porkbun
- etc.

### 2. Access DNS Management
1. Log into your domain provider's dashboard
2. Navigate to DNS Management/DNS Settings
3. Look for "DNS Records" or "Zone File" section

### 3. Add/Update A Record
1. **Delete any existing A records** for the root domain (@)
2. **Add new A record**:
   - Type: A
   - Host/Name: @ (or leave blank)
   - Value/Points to: 216.198.79.1
   - TTL: 3600 or Auto

### 4. Optional: Add www Subdomain
If you want www.algomaster.app to work:
- Type: CNAME
- Host/Name: www
- Value: algomaster.app
- TTL: 3600

### 5. Save Changes
- Save/Apply the DNS changes
- **Wait 24-48 hours** for DNS propagation

## Verification

### Check DNS Propagation
Use these tools to verify your DNS is working:
- https://whatsmydns.net/
- https://dns.google/query?name=algomaster.app&type=A

### Expected Result
When working correctly, you should see:
```
algomaster.app → 216.198.79.1
```

### Vercel Dashboard
- Return to your Vercel dashboard
- Click "Refresh" button
- The "Invalid Configuration" error should disappear

## Common Issues & Solutions

### Issue: Changes not reflecting
**Solution**: DNS changes can take up to 48 hours to propagate globally.

### Issue: Domain provider doesn't allow @ symbol
**Solution**: Leave the "Name" field blank or use "algomaster.app" as the name.

### Issue: Multiple A records causing conflicts
**Solution**: Delete all existing A records before adding the new one.

### Issue: Cloudflare proxy enabled
**Solution**: If using Cloudflare, disable the proxy (grey cloud, not orange) for the A record.

## Provider-Specific Guides

### GoDaddy
1. Go to "My Products" > "DNS"
2. Click "Manage" next to your domain
3. Edit or add A record

### Namecheap
1. Go to "Domain List" > "Manage"
2. Click "Advanced DNS" tab
3. Add A record in "Host Records" section

### Cloudflare
1. Go to "DNS" > "Records"
2. Add A record
3. Ensure proxy is disabled (grey cloud)

## What Happens After DNS Fix

1. ✅ Domain will resolve to Vercel servers
2. ✅ SSL certificate will be automatically provisioned
3. ✅ Your app will be accessible at https://algomaster.app
4. ✅ Contact form will work in production
5. ✅ Ready for Google AdSense application

## Need Help?

If you're unsure about your domain provider or need help with DNS settings:
1. Check your email for domain purchase confirmation
2. Look for DNS management in your provider's dashboard
3. Contact your domain provider's support if needed

**Contact**: help.algomaster@gmail.com
