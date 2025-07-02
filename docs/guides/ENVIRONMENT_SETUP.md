# Environment Variables Setup Guide

This guide explains how to configure all environment variables needed for the Shin Shop email notification system.

## 🎯 Overview

The email notification system requires several environment variables to function properly:
- **Email Service Configuration** - Gmail or SMTP settings
- **Business Information** - Where notifications are sent
- **Security Settings** - Webhook authentication
- **Site Configuration** - URLs and API keys

## 📋 Required Environment Variables

### 🔐 Email Service Configuration

Choose **ONE** of these email provider configurations:

#### Option A: Gmail (Recommended)
```bash
EMAIL_PROVIDER=gmail
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
```

#### Option B: Custom SMTP
```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
```

### 📧 Business Email Configuration
```bash
BUSINESS_EMAIL=your-business-email@gmail.com
BUSINESS_CC_EMAIL=optional-cc-email@gmail.com  # Optional
```

### 🔒 Security Configuration
```bash
SNIPCART_WEBHOOK_SECRET=your-webhook-secret-key  # Optional but recommended
```

## 🔧 Gmail Setup (Recommended Method)

### Step 1: Prepare Gmail Account
1. **Use a dedicated business Gmail account** (recommended)
2. **Enable 2-Factor Authentication** (required for app passwords)

### Step 2: Generate App Password
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Click **Select app** → **Mail**
5. Click **Select device** → **Other (Custom name)**
6. Enter "Shin Shop Email Notifications"
7. Click **Generate**
8. **Copy the 16-character password** (save it securely)

### Step 3: Configure Variables
```bash
EMAIL_PROVIDER=gmail
GMAIL_USER=your-business@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop  # The 16-character app password
BUSINESS_EMAIL=your-business@gmail.com
```

## 🌐 Netlify Environment Variables Setup

### Step 1: Access Netlify Dashboard
1. Log in to [Netlify](https://app.netlify.com/)
2. Select your Shin Shop site
3. Go to **Site settings** → **Environment variables**

### Step 2: Add Variables
Click **"Add variable"** for each required variable:

**Email Configuration (Gmail):**
- `EMAIL_PROVIDER` = `gmail`
- `GMAIL_USER` = `your-business-email@gmail.com`
- `GMAIL_APP_PASSWORD` = `your-16-character-app-password`
- `BUSINESS_EMAIL` = `your-business-email@gmail.com`

**Optional Variables:**
- `BUSINESS_CC_EMAIL` = `optional-cc-email@gmail.com`
- `SNIPCART_WEBHOOK_SECRET` = `your-webhook-secret-key`

### Step 3: Deploy with New Variables
After adding environment variables:
1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for deployment to complete

## 🧪 Testing Environment Configuration

### Test Script
Use the provided test script to verify your configuration:

```bash
# Update test script with your values
node test-email-notification.js
```

### Manual Testing
Test individual components:

1. **Email Service Test:**
   ```javascript
   const EmailService = require('./netlify/functions/utils/emailService');
   const service = new EmailService();
   // Should initialize without errors
   ```

2. **Environment Variable Check:**
   ```bash
   # In Netlify function logs, you should see:
   # "Email service initialized successfully"
   ```

## 🔒 Security Best Practices

### Gmail Security
- ✅ **Use App Passwords** - Never use your main Gmail password
- ✅ **Enable 2FA** - Required for app password generation
- ✅ **Dedicated Account** - Use separate Gmail for business
- ✅ **Monitor Access** - Check Gmail security regularly

### Environment Variables
- ✅ **Never Commit Secrets** - Keep credentials in Netlify only
- ✅ **Use Strong Secrets** - Generate random webhook secrets
- ✅ **Regular Rotation** - Update passwords periodically
- ✅ **Principle of Least Privilege** - Only necessary permissions

### Webhook Security
- ✅ **Use Webhook Secrets** - Verify request authenticity
- ✅ **HTTPS Only** - Never use HTTP for webhooks
- ✅ **Monitor Logs** - Watch for suspicious activity
- ✅ **Rate Limiting** - Implement if needed

## 🛠️ Alternative SMTP Providers

### Popular SMTP Services

#### SendGrid
```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

#### Mailgun
```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
```

#### Outlook/Hotmail
```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

## 🔍 Troubleshooting

### Common Issues

#### Gmail Authentication Errors
**Error:** "Invalid login" or "Username and Password not accepted"
**Solutions:**
- Verify 2FA is enabled on Gmail account
- Use app password, not regular password
- Check app password is entered correctly (no extra spaces)
- Try generating a new app password

#### Environment Variables Not Working
**Error:** "BUSINESS_EMAIL environment variable not configured"
**Solutions:**
- Verify variables are set in Netlify dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy site after adding variables
- Check for typos in variable values

#### SMTP Connection Errors
**Error:** "Connection timeout" or "ECONNREFUSED"
**Solutions:**
- Verify SMTP host and port are correct
- Check if SMTP_SECURE should be true/false
- Test SMTP settings with email client first
- Check firewall/network restrictions

### Debug Commands

**Check environment variables in function:**
```javascript
console.log('EMAIL_PROVIDER:', process.env.EMAIL_PROVIDER);
console.log('BUSINESS_EMAIL:', process.env.BUSINESS_EMAIL);
// Never log passwords or secrets!
```

**Test email configuration:**
```bash
node test-email-service.js
```

## 📊 Environment Variable Reference

### Required Variables
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `EMAIL_PROVIDER` | Yes | Email service type | `gmail` or `smtp` |
| `BUSINESS_EMAIL` | Yes | Where notifications are sent | `orders@yourshop.com` |

### Gmail Variables (if EMAIL_PROVIDER=gmail)
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GMAIL_USER` | Yes | Gmail account username | `business@gmail.com` |
| `GMAIL_APP_PASSWORD` | Yes | Gmail app password | `abcd efgh ijkl mnop` |

### SMTP Variables (if EMAIL_PROVIDER=smtp)
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SMTP_HOST` | Yes | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | Yes | SMTP server port | `587` |
| `SMTP_SECURE` | Yes | Use SSL/TLS | `false` |
| `SMTP_USER` | Yes | SMTP username | `user@domain.com` |
| `SMTP_PASSWORD` | Yes | SMTP password | `password123` |

### Optional Variables
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `BUSINESS_CC_EMAIL` | No | Additional recipient | `manager@yourshop.com` |
| `SNIPCART_WEBHOOK_SECRET` | No | Webhook security | `sk_webhook_abc123...` |

## ✅ Configuration Checklist

Before going live, verify:
- [ ] Email provider is configured (Gmail or SMTP)
- [ ] Business email is set and accessible
- [ ] Test email sends successfully
- [ ] Environment variables are in Netlify
- [ ] Site is redeployed with new variables
- [ ] Webhook secret is configured (if using)
- [ ] All credentials are secure and not committed to code

## 📞 Support

### Getting Help
1. Check this troubleshooting guide
2. Test email configuration independently
3. Verify environment variables in Netlify
4. Check Netlify function logs for errors

### Resources
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)

---

**Ready to configure?** Follow this guide step by step to set up your email notification environment variables!
