# Email Notification Configuration Guide

This guide explains how to configure email notifications for custom shin pad orders in your Shin Shop e-commerce website.

## Overview

When customers complete checkout for customized products, the system automatically:
1. Receives a webhook from Snipcart
2. Processes the order and customization data
3. Sends a detailed email notification to your business email
4. Includes all customization details and attempts to attach uploaded images

## Configuration Methods

You can configure email notifications using two methods:

### Method 1: Gmail (Recommended)
- ✅ Easy to set up
- ✅ Reliable delivery
- ✅ Free for business use
- ✅ Good spam filtering

### Method 2: Custom SMTP
- ✅ Use your own email provider
- ✅ More control over settings
- ✅ Works with any SMTP service
- ⚠️ Requires more configuration

## Method 1: Gmail Configuration

### Step 1: Prepare Gmail Account
1. Use a dedicated Gmail account for your business (recommended)
2. Enable 2-Factor Authentication (required for app passwords)

### Step 2: Generate App Password
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Click **Select app** → **Mail**
5. Click **Select device** → **Other (Custom name)**
6. Enter "Shin Shop Notifications"
7. Click **Generate**
8. Copy the 16-character app password (save it securely)

### Step 3: Configure Environment Variables
Add these variables to your Netlify site:

```bash
EMAIL_PROVIDER=gmail
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
BUSINESS_EMAIL=your-business-email@gmail.com
BUSINESS_CC_EMAIL=optional-cc-email@gmail.com
```

## Method 2: Custom SMTP Configuration

### Step 1: Get SMTP Settings
Get SMTP settings from your email provider:

**Common Providers:**
- **Outlook/Hotmail:** smtp-mail.outlook.com, port 587
- **Yahoo:** smtp.mail.yahoo.com, port 587
- **Custom Domain:** Check with your hosting provider

### Step 2: Configure Environment Variables
Add these variables to your Netlify site:

```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@your-domain.com
SMTP_PASSWORD=your-email-password
BUSINESS_EMAIL=your-business-email@your-domain.com
BUSINESS_CC_EMAIL=optional-cc-email@your-domain.com
```

## Netlify Environment Variables Setup

### Step 1: Access Netlify Dashboard
1. Log in to [Netlify](https://app.netlify.com/)
2. Select your Shin Shop site
3. Go to **Site settings** → **Environment variables**

### Step 2: Add Variables
Click **Add variable** for each required variable:

**Required Variables:**
- `EMAIL_PROVIDER` (gmail or smtp)
- `BUSINESS_EMAIL` (where notifications are sent)

**Gmail Method:**
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`

**SMTP Method:**
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASSWORD`

**Optional Variables:**
- `BUSINESS_CC_EMAIL` (additional recipient)
- `SNIPCART_WEBHOOK_SECRET` (webhook security)

### Step 3: Deploy Changes
After adding environment variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete

## Email Template Customization

### Default Email Content
The system sends professional HTML emails containing:
- Order information and customer details
- Complete customization specifications
- Product details and pricing
- Next steps for order fulfillment

### Customizing Email Template
To modify the email template:
1. Edit `netlify/functions/templates/orderEmailTemplate.js`
2. Modify HTML structure, styling, or content
3. Test changes in development
4. Deploy to production

### Email Features
- **Responsive Design:** Works on desktop and mobile
- **Professional Styling:** Clean, branded appearance
- **Color-coded Sections:** Easy to scan information
- **Attachment Support:** Includes order summary and images
- **Plain Text Fallback:** For email clients that don't support HTML

## Testing Email Configuration

### Step 1: Test Email Service
Create a test file to verify email configuration:

```javascript
// test-email.js
const EmailService = require('./netlify/functions/utils/emailService');

const testData = {
  orderId: 'TEST-001',
  orderDate: new Date().toLocaleString(),
  customerInfo: {
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '+420123456789',
    address: 'Test Address, Prague, Czech Republic'
  },
  orderTotal: '999 CZK',
  paymentMethod: 'Credit Card',
  customizedItems: [{
    name: 'Custom Shin Pad',
    quantity: 1,
    price: '999 CZK',
    customizations: {
      'Size': 'M',
      'Player Number': '10',
      'Custom Text': 'TEST ORDER'
    }
  }]
};

const emailService = new EmailService();
emailService.sendCustomOrderNotification(testData)
  .then(() => console.log('Test email sent successfully'))
  .catch(err => console.error('Test email failed:', err));
```

### Step 2: Test with Snipcart
1. Enable Snipcart test mode
2. Place a test order with customizations
3. Complete checkout
4. Check your email for notification
5. Verify all information is correct

## Troubleshooting

### Common Issues

#### Gmail Authentication Errors
**Error:** "Invalid login" or "Authentication failed"
**Solutions:**
- Verify 2FA is enabled on Gmail account
- Use app password, not regular password
- Check app password is entered correctly (no spaces)
- Try generating a new app password

#### SMTP Connection Errors
**Error:** "Connection timeout" or "ECONNREFUSED"
**Solutions:**
- Verify SMTP host and port are correct
- Check if SMTP_SECURE should be true/false
- Test SMTP settings with email client first
- Check firewall/network restrictions

#### Emails Not Received
**Possible Causes:**
- Check spam/junk folder
- Verify BUSINESS_EMAIL is correct
- Check email provider limits
- Review Netlify function logs for errors

#### Environment Variables Not Working
**Solutions:**
- Verify variables are set in Netlify dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy site after adding variables
- Check for typos in variable values

### Debugging Steps
1. **Check Netlify Function Logs:**
   - Go to Netlify dashboard → Functions
   - Click on snipcart-webhook function
   - Review recent invocations and logs

2. **Test Webhook Endpoint:**
   ```bash
   curl -X POST https://your-site.netlify.app/.netlify/functions/snipcart-webhook \
     -H "Content-Type: application/json" \
     -d '{"eventName":"order.completed","content":{"token":"test"}}'
   ```

3. **Verify Email Configuration:**
   - Test email settings with a simple script
   - Check environment variables are accessible
   - Verify email provider settings

## Security Best Practices

1. **Use App Passwords:** Never use your main Gmail password
2. **Secure Environment Variables:** Keep credentials in Netlify only
3. **Monitor Email Logs:** Check for suspicious activity
4. **Webhook Security:** Use SNIPCART_WEBHOOK_SECRET
5. **Regular Updates:** Keep dependencies updated

## Email Delivery Best Practices

1. **Professional From Address:** Use business email as sender
2. **Clear Subject Lines:** Include order ID for easy tracking
3. **Consistent Formatting:** Use professional email template
4. **Attachment Limits:** Keep attachments under 10MB
5. **Backup Notifications:** Consider CC to additional email

## Support

If you need help with email configuration:
1. Check this troubleshooting guide
2. Review Netlify function logs
3. Test email settings independently
4. Verify Snipcart webhook configuration
5. Check email provider documentation

For Gmail-specific issues:
- [Gmail App Passwords Help](https://support.google.com/accounts/answer/185833)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)

For SMTP issues:
- Check your email provider's SMTP documentation
- Test settings with an email client first
- Verify port and security settings
