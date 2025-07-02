# Snipcart Webhook Configuration Guide

This guide provides step-by-step instructions for configuring Snipcart webhooks to automatically trigger email notifications for custom shin pad orders.

## 🎯 Overview

When configured correctly, the webhook system will:
1. **Detect Custom Orders** - Automatically identify orders with customizations
2. **Extract Order Data** - Pull customer info, customization details, and uploaded images
3. **Send Email Notifications** - Deliver professional emails with all order information
4. **Include Attachments** - Attach uploaded images and order summaries

## 📋 Prerequisites

Before configuring webhooks, ensure you have:
- ✅ Active Snipcart account with your API key
- ✅ Shin Shop website deployed to Netlify
- ✅ Netlify Functions working (webhook endpoint accessible)
- ✅ Email service configured (Gmail or SMTP)

## 🔧 Step 1: Access Snipcart Dashboard

1. **Log in to Snipcart:**
   - Go to [https://app.snipcart.com/](https://app.snipcart.com/)
   - Sign in with your Snipcart account credentials

2. **Navigate to Webhooks:**
   - Click on your profile/account menu (top right)
   - Select **"Account settings"**
   - In the left sidebar, click **"Webhooks"**

## 🌐 Step 2: Configure Webhook Endpoint

### 2.1 Add New Webhook

1. **Click "Add webhook"** button
2. **Configure webhook settings:**

**Webhook URL:**
```
https://your-site-name.netlify.app/.netlify/functions/snipcart-webhook
```
> ⚠️ **Important:** Replace `your-site-name` with your actual Netlify site name
> 
> Example: `https://makushinpadshop.netlify.app/.netlify/functions/snipcart-webhook`

**HTTP Method:** `POST`

**Content Type:** `application/json`

### 2.2 Select Events

**Required Event:**
- ✅ **`order.completed`** - This triggers email notifications when orders are completed

**Optional Events** (for future enhancements):
- ⬜ `order.status.changed` - For order status updates
- ⬜ `order.refunded` - For refund notifications

### 2.3 Webhook Security (Recommended)

1. **Generate Secret Key:**
   - Create a strong random string (32+ characters)
   - Example: `sk_webhook_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`

2. **Add Secret to Snipcart:**
   - In the webhook configuration, find "Secret" field
   - Enter your generated secret key

3. **Save Secret for Environment Variables:**
   - Copy the secret key
   - You'll need this for Netlify environment variables

## 🔒 Step 3: Configure Environment Variables

### 3.1 Access Netlify Dashboard

1. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Select your Shin Shop site
3. Navigate to **Site settings** → **Environment variables**

### 3.2 Add Required Variables

Click **"Add variable"** for each of these:

**Email Configuration:**
```bash
EMAIL_PROVIDER=gmail
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
BUSINESS_EMAIL=your-business-email@gmail.com
```

**Webhook Security:**
```bash
SNIPCART_WEBHOOK_SECRET=your-webhook-secret-key
```

**Optional Variables:**
```bash
BUSINESS_CC_EMAIL=optional-cc-email@gmail.com
```

### 3.3 Deploy Changes

After adding environment variables:
1. Go to **Deploys** tab in Netlify
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for deployment to complete

## 🧪 Step 4: Test Webhook Configuration

### 4.1 Test Webhook Endpoint

Verify your webhook endpoint is accessible:

```bash
curl -X POST https://your-site-name.netlify.app/.netlify/functions/snipcart-webhook \
  -H "Content-Type: application/json" \
  -d '{"eventName": "test", "content": {}}'
```

**Expected Response:**
```json
{"message": "Event not processed"}
```

### 4.2 Test with Snipcart Test Mode

1. **Enable Test Mode:**
   - In Snipcart dashboard, go to **Store configuration**
   - Enable **"Test mode"**

2. **Place Test Order:**
   - Go to your customize page
   - Add customizations (text, colors, upload image)
   - Complete checkout with test credit card:
     - Card: `4242 4242 4242 4242`
     - Expiry: Any future date
     - CVC: Any 3 digits

3. **Verify Webhook Delivery:**
   - In Snipcart dashboard, go to **Webhooks**
   - Click on your webhook to view delivery logs
   - Look for successful delivery (200 status code)

4. **Check Email:**
   - Check your business email inbox
   - Look for notification with subject: "🎯 New Custom Shin Pad Order - [ORDER-ID]"

## 📊 Step 5: Monitor Webhook Performance

### 5.1 Snipcart Webhook Logs

In your Snipcart dashboard:
1. Go to **Account settings** → **Webhooks**
2. Click on your webhook
3. Review **"Recent deliveries"** section
4. Check for:
   - ✅ **200 status codes** (success)
   - ❌ **4xx/5xx status codes** (errors)

### 5.2 Netlify Function Logs

In your Netlify dashboard:
1. Go to **Functions** tab
2. Click on **"snipcart-webhook"**
3. Review recent invocations
4. Check for errors or performance issues

### 5.3 Email Delivery Monitoring

Monitor your email service:
1. Check email delivery rates
2. Monitor for bounced emails
3. Verify all customization data is included
4. Ensure attachments are working

## 🛠️ Troubleshooting

### Common Issues

#### 1. Webhook Not Triggered
**Symptoms:** No webhook calls in Snipcart logs
**Solutions:**
- Verify webhook URL is correct
- Check that `order.completed` event is selected
- Ensure website is deployed and accessible
- Test webhook endpoint manually

#### 2. Webhook Returns Errors
**Symptoms:** 4xx/5xx status codes in Snipcart logs
**Solutions:**
- Check Netlify function logs for errors
- Verify environment variables are set
- Test webhook endpoint with curl
- Check for syntax errors in function code

#### 3. Email Not Sending
**Symptoms:** Webhook succeeds but no email received
**Solutions:**
- Check spam/junk folder
- Verify email environment variables
- Test email credentials independently
- Review Netlify function logs for email errors

#### 4. Missing Customization Data
**Symptoms:** Email sent but missing order details
**Solutions:**
- Verify Snipcart custom fields are configured
- Check webhook payload structure
- Review data processing logic
- Test with different customization combinations

### Debug Commands

**Test webhook endpoint:**
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/snipcart-webhook \
  -H "Content-Type: application/json" \
  -d '{"eventName":"order.completed","content":{"token":"test-123","items":[{"id":"custom-test"}]}}'
```

**Check webhook response:**
```bash
curl -v -X POST https://your-site.netlify.app/.netlify/functions/snipcart-webhook \
  -H "Content-Type: application/json" \
  -d '{"eventName":"order.completed","content":{}}'
```

## 🚀 Production Deployment

### Final Checklist

Before going live:
- [ ] Webhook URL points to production site
- [ ] All environment variables configured
- [ ] Test mode disabled in Snipcart
- [ ] Email credentials are production-ready
- [ ] Webhook secret is configured
- [ ] Test order completed successfully
- [ ] Email notification received and verified

### Go Live Steps

1. **Disable Snipcart Test Mode**
2. **Update Webhook URL** (if needed for production domain)
3. **Test with Small Real Order** (optional)
4. **Monitor Initial Orders** closely
5. **Document Any Issues** for quick resolution

## 📞 Support Resources

### Snipcart Documentation
- [Webhook Documentation](https://docs.snipcart.com/v3/webhooks/introduction)
- [API Reference](https://docs.snipcart.com/v3/api-reference/introduction)
- [Test Mode Guide](https://docs.snipcart.com/v3/setup/test-mode)

### Netlify Documentation
- [Functions Overview](https://docs.netlify.com/functions/overview/)
- [Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)
- [Function Logs](https://docs.netlify.com/functions/logs/)

### Email Service Documentation
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)

## 🎉 Success Criteria

Your webhook is working correctly when:
- ✅ Snipcart sends webhooks for completed orders
- ✅ Webhook function processes custom orders only
- ✅ Email notifications are sent automatically
- ✅ All customization data is included
- ✅ Image attachments work properly
- ✅ Order summary is attached
- ✅ No errors in logs

---

**Need Help?** Check the troubleshooting section or review the Netlify function logs for specific error messages.
