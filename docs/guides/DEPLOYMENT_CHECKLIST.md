# Deployment Checklist for Email Notifications

This checklist ensures your email notification system is properly deployed and configured for production use.

## 🚀 Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All webhook function files are in place
- [ ] Email service is configured and tested locally
- [ ] File attachment handling is implemented
- [ ] Email templates are finalized
- [ ] Environment variables are documented

### ✅ Netlify Configuration
- [ ] `netlify.toml` is configured with functions directory
- [ ] Site is connected to your Git repository
- [ ] Build settings are correct (`npm run build`)
- [ ] Node.js version is set to 20.x in environment

## 🌐 Deployment Steps

### Step 1: Deploy to Netlify

1. **Commit All Changes:**
   ```bash
   git add .
   git commit -m "Add email notification system"
   git push origin main
   ```

2. **Trigger Netlify Build:**
   - Go to Netlify dashboard
   - Select your site
   - Click "Trigger deploy" → "Deploy site"
   - Wait for build to complete

3. **Verify Function Deployment:**
   - Go to "Functions" tab in Netlify
   - Confirm `snipcart-webhook` function is listed
   - Check function logs for any errors

### Step 2: Configure Environment Variables

In Netlify dashboard → Site settings → Environment variables:

**Required Variables:**
```bash
EMAIL_PROVIDER=gmail
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
BUSINESS_EMAIL=your-business-email@gmail.com
```

**Optional Variables:**
```bash
BUSINESS_CC_EMAIL=optional-cc-email@gmail.com
SNIPCART_WEBHOOK_SECRET=your-webhook-secret-key
```

**After adding variables:**
- Click "Trigger deploy" to restart with new environment

### Step 3: Test Webhook Endpoint

1. **Update verification script:**
   ```javascript
   // In verify-webhook-setup.js, update:
   siteUrl: 'https://your-actual-site-name.netlify.app'
   ```

2. **Run verification:**
   ```bash
   node verify-webhook-setup.js
   ```

3. **Expected results:**
   - Tests 1-4 should pass (200/405/500 status codes)
   - Test 5 may fail if email config needs work

## 🔧 Snipcart Configuration

### Step 1: Access Snipcart Dashboard
1. Log in to [app.snipcart.com](https://app.snipcart.com/)
2. Go to Account settings → Webhooks

### Step 2: Add Webhook
**Webhook URL:**
```
https://your-site-name.netlify.app/.netlify/functions/snipcart-webhook
```

**Settings:**
- Method: `POST`
- Content Type: `application/json`
- Events: `order.completed`
- Secret: (optional but recommended)

### Step 3: Test with Snipcart Test Mode
1. Enable test mode in Snipcart
2. Place test order with customizations
3. Verify webhook delivery in Snipcart logs
4. Check email notification received

## 🧪 Testing Checklist

### ✅ Webhook Function Tests
- [ ] Endpoint is accessible (not 404)
- [ ] GET requests are rejected (405)
- [ ] Invalid JSON is handled (500)
- [ ] Non-order events are ignored (200)
- [ ] Custom orders are processed (200/500)

### ✅ Email Integration Tests
- [ ] Email service initializes without errors
- [ ] HTML template generates correctly
- [ ] Text template generates correctly
- [ ] Attachments are prepared properly
- [ ] Test email sends successfully

### ✅ End-to-End Tests
- [ ] Snipcart test order triggers webhook
- [ ] Webhook processes order data correctly
- [ ] Email notification is sent
- [ ] All customization data is included
- [ ] Image attachments work (when available)
- [ ] Order summary is attached

## 🔍 Troubleshooting Guide

### Issue: Webhook Returns 404
**Cause:** Function not deployed or incorrect URL
**Solutions:**
- Verify site is deployed to Netlify
- Check Functions tab shows snipcart-webhook
- Confirm webhook URL matches your site name
- Test function endpoint manually

### Issue: Webhook Returns 500
**Cause:** Function error (often email configuration)
**Solutions:**
- Check Netlify function logs
- Verify environment variables are set
- Test email configuration independently
- Review function code for syntax errors

### Issue: Email Not Sending
**Cause:** Email service configuration issues
**Solutions:**
- Verify Gmail app password is correct
- Check BUSINESS_EMAIL environment variable
- Test SMTP settings independently
- Check spam folder for emails

### Issue: Missing Customization Data
**Cause:** Snipcart custom fields not configured
**Solutions:**
- Verify customize page sends data to Snipcart
- Check webhook payload structure
- Review custom field names and values
- Test with different customization options

## 📊 Monitoring Setup

### Netlify Function Monitoring
1. **Function Logs:**
   - Netlify dashboard → Functions → snipcart-webhook
   - Monitor for errors and performance

2. **Error Alerts:**
   - Set up Netlify notifications for function failures
   - Monitor function execution time

### Snipcart Webhook Monitoring
1. **Delivery Logs:**
   - Snipcart dashboard → Webhooks → View deliveries
   - Monitor success/failure rates

2. **Response Times:**
   - Check webhook response times
   - Ensure < 5 second response target

### Email Delivery Monitoring
1. **Delivery Rates:**
   - Monitor email delivery success
   - Check for bounced emails

2. **Content Verification:**
   - Verify all order data is included
   - Check attachment functionality

## 🎯 Success Criteria

Your system is ready for production when:

### ✅ Technical Requirements
- [ ] Webhook endpoint returns correct status codes
- [ ] Function logs show no errors
- [ ] Environment variables are configured
- [ ] Email service connects successfully

### ✅ Functional Requirements
- [ ] Custom orders trigger email notifications
- [ ] Regular orders are ignored
- [ ] All customization data is included
- [ ] Image attachments work properly
- [ ] Email formatting is professional

### ✅ Performance Requirements
- [ ] Webhook responds within 5 seconds
- [ ] Email delivery within 30 seconds
- [ ] Error rate < 1%
- [ ] No memory or timeout issues

## 🚀 Go Live Process

### Final Steps
1. **Disable Snipcart Test Mode**
2. **Place Small Test Order** (optional)
3. **Monitor First Few Orders** closely
4. **Document Any Issues** for quick resolution
5. **Set Up Ongoing Monitoring**

### Post-Launch Monitoring
- Check webhook logs daily for first week
- Monitor email delivery rates
- Collect customer feedback
- Optimize performance as needed

## 📞 Support Resources

### Documentation
- [Netlify Functions](https://docs.netlify.com/functions/)
- [Snipcart Webhooks](https://docs.snipcart.com/v3/webhooks/)
- [Gmail SMTP](https://support.google.com/mail/answer/7126229)

### Internal Documentation
- `docs/SNIPCART_WEBHOOK_SETUP.md` - Detailed webhook setup
- `docs/EMAIL_CONFIGURATION.md` - Email service configuration
- `docs/TESTING_GUIDE.md` - Comprehensive testing procedures

---

**Ready to deploy?** Follow this checklist step by step to ensure a smooth deployment of your email notification system!
