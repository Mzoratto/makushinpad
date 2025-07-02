# Snipcart Webhook Configuration for Custom Order Notifications

This guide explains how to configure Snipcart webhooks to automatically send email notifications when customers complete custom shin pad orders.

## Overview

The webhook system works as follows:
1. Customer completes checkout for a customized product
2. Snipcart sends a webhook to your Netlify function
3. The function processes the order data and sends an email notification
4. You receive a detailed email with all customization information and attachments

## Prerequisites

Before configuring webhooks, ensure you have:
- ✅ Deployed your Gatsby site to Netlify
- ✅ Netlify Functions are working (the webhook endpoint is available)
- ✅ Environment variables are configured (see Environment Variables section)
- ✅ Email service is configured and tested

## Step 1: Configure Snipcart Webhook Settings

### 1.1 Access Snipcart Dashboard
1. Log in to your [Snipcart Dashboard](https://app.snipcart.com/)
2. Navigate to **Account Settings** → **Webhooks**

### 1.2 Add Webhook Endpoint
1. Click **"Add webhook"**
2. Configure the webhook with these settings:

**Webhook URL:**
```
https://your-site-name.netlify.app/.netlify/functions/snipcart-webhook
```
Replace `your-site-name` with your actual Netlify site name.

**Events to listen for:**
- ✅ `order.completed` (Required - triggers email notifications)
- ✅ `order.status.changed` (Optional - for order status updates)

**HTTP Method:** `POST`

**Content Type:** `application/json`

### 1.3 Configure Webhook Security (Recommended)
1. Generate a webhook secret key (use a strong random string)
2. Add the secret to your webhook configuration in Snipcart
3. Add the same secret to your Netlify environment variables (see below)

## Step 2: Environment Variables Configuration

Configure these environment variables in your Netlify dashboard:

### 2.1 Access Netlify Environment Variables
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**

### 2.2 Required Environment Variables

```bash
# Email Configuration (Choose one method)

# Method 1: Gmail (Recommended for simplicity)
EMAIL_PROVIDER=gmail
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# Method 2: Custom SMTP
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password

# Business Configuration
BUSINESS_EMAIL=your-business-email@gmail.com
BUSINESS_CC_EMAIL=optional-cc-email@gmail.com

# Webhook Security (Recommended)
SNIPCART_WEBHOOK_SECRET=your-webhook-secret-key
```

### 2.3 Gmail App Password Setup (If using Gmail)
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings → Security → App passwords
3. Generate an app password for "Mail"
4. Use this app password (not your regular password) in `GMAIL_APP_PASSWORD`

## Step 3: Test Webhook Configuration

### 3.1 Test Webhook Endpoint
You can test if your webhook endpoint is accessible:

```bash
curl -X POST https://your-site-name.netlify.app/.netlify/functions/snipcart-webhook \
  -H "Content-Type: application/json" \
  -d '{"eventName": "test", "content": {}}'
```

Expected response: `{"error": "Event not processed"}` (this is normal for test events)

### 3.2 Test with Snipcart Test Mode
1. Enable Snipcart test mode in your dashboard
2. Place a test order with customizations
3. Complete the checkout process
4. Check your email for the notification
5. Check Netlify function logs for any errors

### 3.3 Verify Webhook Delivery
In your Snipcart dashboard:
1. Go to **Account Settings** → **Webhooks**
2. Click on your webhook to view delivery logs
3. Check for successful deliveries (200 status codes)
4. Review any failed deliveries and error messages

## Step 4: Troubleshooting

### Common Issues and Solutions

#### 4.1 Webhook Not Receiving Data
**Problem:** No webhook calls are being made
**Solutions:**
- Verify webhook URL is correct and accessible
- Check that `order.completed` event is selected
- Ensure your site is deployed and functions are working
- Test webhook URL manually with curl

#### 4.2 Email Not Sending
**Problem:** Webhook receives data but email doesn't send
**Solutions:**
- Check Netlify function logs for errors
- Verify email environment variables are correct
- Test Gmail app password or SMTP credentials
- Check spam folder for emails

#### 4.3 Images Not Attaching
**Problem:** Email sends but images are missing
**Solutions:**
- This is expected with current implementation
- Images are stored as base64 in browser, not sent to Snipcart
- Consider implementing cloud storage for images (see Advanced Setup)

#### 4.4 Webhook Authentication Errors
**Problem:** 401 Unauthorized errors
**Solutions:**
- Verify `SNIPCART_WEBHOOK_SECRET` matches Snipcart configuration
- Check webhook secret is properly configured in both places
- Temporarily disable webhook authentication for testing

### 4.5 Checking Logs
To debug issues, check these logs:
1. **Netlify Function Logs:** Netlify dashboard → Functions → View logs
2. **Snipcart Webhook Logs:** Snipcart dashboard → Webhooks → View deliveries
3. **Browser Console:** For frontend issues during checkout

## Step 5: Advanced Configuration (Optional)

### 5.1 Custom Email Templates
You can customize the email template by modifying:
```
netlify/functions/templates/orderEmailTemplate.js
```

### 5.2 Additional Webhook Events
You can listen for additional events:
- `order.status.changed` - Order status updates
- `order.refunded` - Refund notifications
- `order.notification.sent` - Email confirmations

### 5.3 Image Storage Integration
For proper image attachments, consider integrating:
- **Cloudinary** - Image management service
- **AWS S3** - File storage
- **Firebase Storage** - Google's file storage

## Security Considerations

1. **Always use HTTPS** for webhook URLs
2. **Configure webhook secrets** to verify request authenticity
3. **Validate webhook payloads** before processing
4. **Use environment variables** for sensitive configuration
5. **Monitor webhook logs** for suspicious activity

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Netlify function logs
3. Test webhook endpoint manually
4. Verify Snipcart webhook configuration
5. Check email service configuration

For additional help, refer to:
- [Snipcart Webhook Documentation](https://docs.snipcart.com/v3/webhooks/introduction)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Nodemailer Documentation](https://nodemailer.com/about/)

## Webhook Payload Example

Here's what a typical `order.completed` webhook payload looks like:

```json
{
  "eventName": "order.completed",
  "createdOn": "2024-01-15T10:30:00.000Z",
  "content": {
    "token": "order-token-123",
    "creationDate": "2024-01-15T10:30:00.000Z",
    "email": "customer@example.com",
    "currency": "CZK",
    "finalGrandTotal": 999.00,
    "billingAddress": {
      "fullName": "John Doe",
      "address1": "123 Main St",
      "city": "Prague",
      "country": "Czech Republic",
      "phoneNumber": "+420123456789"
    },
    "items": [
      {
        "id": "custom-shin-pad-S-custom-CZK",
        "name": "Custom Shin Pad",
        "quantity": 1,
        "totalPrice": 999.00,
        "customFields": [
          {
            "name": "Size",
            "value": "S"
          },
          {
            "name": "Player Number",
            "value": "10"
          },
          {
            "name": "Uploaded Image",
            "value": "custom-design.jpg"
          }
        ]
      }
    ]
  }
}
```
