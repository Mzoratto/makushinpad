# Email Notification Testing Guide

This guide provides step-by-step instructions for testing the custom order email notification system.

## Testing Overview

The testing process involves:
1. **Unit Testing** - Test individual components
2. **Integration Testing** - Test webhook and email together
3. **End-to-End Testing** - Test complete customer flow
4. **Production Testing** - Verify in live environment

## Prerequisites

Before testing, ensure:
- ✅ Site is deployed to Netlify
- ✅ Environment variables are configured
- ✅ Snipcart webhook is configured
- ✅ Email service is set up

## Phase 1: Unit Testing

### Test 1: Webhook Endpoint Accessibility

Test if the webhook endpoint is accessible:

```bash
# Test webhook endpoint is live
curl -X GET https://your-site-name.netlify.app/.netlify/functions/snipcart-webhook

# Expected response: {"error": "Method not allowed"}
# This confirms the endpoint exists and is responding
```

### Test 2: Webhook POST Request

Test webhook with minimal payload:

```bash
curl -X POST https://your-site-name.netlify.app/.netlify/functions/snipcart-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "test.event",
    "content": {}
  }'

# Expected response: {"message": "Event not processed"}
# This confirms the webhook is processing requests
```

### Test 3: Email Service Configuration

Create a test script to verify email configuration:

```javascript
// Create file: test-email-config.js
const EmailService = require('./netlify/functions/utils/emailService');

async function testEmailConfig() {
  try {
    const emailService = new EmailService();
    console.log('✅ Email service initialized successfully');
    
    // Test with minimal data
    const testData = {
      orderId: 'TEST-CONFIG-001',
      orderDate: new Date().toLocaleString(),
      customerInfo: {
        name: 'Test Configuration',
        email: 'test@example.com',
        phone: 'N/A',
        address: 'Test Address'
      },
      orderTotal: '0 CZK',
      paymentMethod: 'Test',
      customizedItems: [{
        name: 'Configuration Test',
        quantity: 1,
        price: '0 CZK',
        customizations: {
          'Test': 'Configuration check'
        }
      }]
    };
    
    await emailService.sendCustomOrderNotification(testData);
    console.log('✅ Test email sent successfully');
    
  } catch (error) {
    console.error('❌ Email configuration test failed:', error.message);
    console.error('Full error:', error);
  }
}

testEmailConfig();
```

Run the test:
```bash
node test-email-config.js
```

## Phase 2: Integration Testing

### Test 4: Webhook with Order Data

Test webhook with realistic order data:

```bash
curl -X POST https://your-site-name.netlify.app/.netlify/functions/snipcart-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "order.completed",
    "createdOn": "2024-01-15T10:30:00.000Z",
    "content": {
      "token": "test-order-123",
      "creationDate": "2024-01-15T10:30:00.000Z",
      "email": "test-customer@example.com",
      "currency": "CZK",
      "finalGrandTotal": 999.00,
      "paymentMethod": "Credit Card",
      "billingAddress": {
        "fullName": "Test Customer",
        "address1": "123 Test Street",
        "city": "Prague",
        "country": "Czech Republic",
        "phoneNumber": "+420123456789"
      },
      "items": [
        {
          "id": "custom-shin-pad-M-custom-CZK",
          "name": "Custom Shin Pad",
          "quantity": 1,
          "totalPrice": 999.00,
          "currency": "CZK",
          "customFields": [
            {
              "name": "Size",
              "value": "M"
            },
            {
              "name": "Player Number",
              "value": "10"
            },
            {
              "name": "Left Shin Text",
              "value": "CHAMPION"
            },
            {
              "name": "Right Shin Text",
              "value": "2024"
            },
            {
              "name": "Additional Text",
              "value": "Test Order"
            },
            {
              "name": "Text Color",
              "value": "#FF0000"
            },
            {
              "name": "Backdrop Color",
              "value": "#FFFFFF"
            },
            {
              "name": "Font",
              "value": "Arial"
            },
            {
              "name": "Additional Requirements",
              "value": "This is a test order for webhook integration"
            },
            {
              "name": "Uploaded Image",
              "value": "test-image.jpg"
            }
          ]
        }
      ]
    }
  }'
```

Expected response:
```json
{
  "message": "Custom order notification sent successfully",
  "orderId": "test-order-123"
}
```

### Test 5: Verify Email Delivery

After running Test 4:
1. Check your business email inbox
2. Look for email with subject: "🎯 New Custom Shin Pad Order - test-order-123"
3. Verify email contains all order details
4. Check attachments are included

## Phase 3: End-to-End Testing

### Test 6: Snipcart Test Mode

1. **Enable Snipcart Test Mode:**
   - Go to Snipcart dashboard
   - Enable test mode
   - Note: Use test credit card numbers

2. **Place Test Order:**
   - Go to your customize page
   - Add customizations:
     - Select size
     - Add player number
     - Add custom text
     - Upload an image (optional)
     - Add additional requirements
   - Add to cart
   - Complete checkout with test data

3. **Verify Webhook Delivery:**
   - Check Snipcart webhook logs
   - Look for successful delivery (200 status)
   - Check Netlify function logs

4. **Verify Email:**
   - Check business email for notification
   - Verify all customization data is present
   - Check formatting and styling

### Test 7: Production Testing

⚠️ **Important:** Only do this after thorough testing in test mode

1. **Disable Snipcart Test Mode**
2. **Place Small Real Order** (if comfortable)
3. **Verify Complete Flow**
4. **Monitor for Issues**

## Phase 4: Monitoring and Validation

### Test 8: Log Analysis

Check various logs for issues:

1. **Netlify Function Logs:**
   ```
   Netlify Dashboard → Functions → snipcart-webhook → View logs
   ```

2. **Snipcart Webhook Logs:**
   ```
   Snipcart Dashboard → Account Settings → Webhooks → View deliveries
   ```

3. **Email Service Logs:**
   - Check for delivery confirmations
   - Monitor bounce rates
   - Watch for spam issues

### Test 9: Error Handling

Test error scenarios:

1. **Invalid Webhook Data:**
   ```bash
   curl -X POST https://your-site-name.netlify.app/.netlify/functions/snipcart-webhook \
     -H "Content-Type: application/json" \
     -d '{"invalid": "data"}'
   ```

2. **Missing Environment Variables:**
   - Temporarily remove an environment variable
   - Test webhook call
   - Verify graceful error handling
   - Restore environment variable

3. **Email Service Failure:**
   - Use invalid email credentials
   - Test webhook call
   - Verify error logging
   - Restore correct credentials

## Testing Checklist

### Pre-Testing Setup
- [ ] Site deployed to Netlify
- [ ] Environment variables configured
- [ ] Snipcart webhook configured
- [ ] Email service tested independently

### Unit Tests
- [ ] Webhook endpoint accessible
- [ ] Webhook processes POST requests
- [ ] Email service initializes correctly
- [ ] Test email sends successfully

### Integration Tests
- [ ] Webhook processes order data
- [ ] Email notification sent for custom orders
- [ ] All customization data included
- [ ] Attachments work correctly

### End-to-End Tests
- [ ] Snipcart test mode order works
- [ ] Webhook receives real order data
- [ ] Email formatting is correct
- [ ] Customer experience is smooth

### Production Validation
- [ ] Production webhook works
- [ ] Email delivery is reliable
- [ ] Performance is acceptable
- [ ] Error handling works

## Troubleshooting Common Issues

### Webhook Not Triggered
- Verify webhook URL in Snipcart
- Check webhook events are selected
- Ensure site is deployed and accessible

### Email Not Sending
- Check environment variables
- Verify email credentials
- Check spam folder
- Review function logs

### Missing Customization Data
- Verify Snipcart custom fields
- Check webhook payload structure
- Review data processing logic

### Image Attachments Not Working
- This is expected with current implementation
- Images are base64 in browser, not in webhook
- Consider cloud storage integration

## Performance Considerations

### Webhook Response Time
- Target: < 5 seconds
- Monitor function execution time
- Optimize email template generation

### Email Delivery Time
- Typical: 1-30 seconds
- Monitor for delays
- Check email provider limits

### Error Rates
- Target: < 1% error rate
- Monitor webhook failures
- Track email bounces

## Next Steps After Testing

1. **Monitor Production Usage**
2. **Collect User Feedback**
3. **Optimize Performance**
4. **Add Additional Features**
5. **Implement Image Storage** (if needed)

## Support Resources

- **Netlify Functions:** https://docs.netlify.com/functions/
- **Snipcart Webhooks:** https://docs.snipcart.com/v3/webhooks/
- **Nodemailer:** https://nodemailer.com/
- **Gmail SMTP:** https://support.google.com/mail/answer/7126229
