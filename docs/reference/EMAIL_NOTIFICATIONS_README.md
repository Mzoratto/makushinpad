# Custom Order Email Notifications

This system automatically sends detailed email notifications when customers complete checkout for customized shin pad orders.

## 🎯 Features

- **Automatic Notifications:** Triggered by Snipcart webhook on order completion
- **Detailed Order Information:** Complete customer and order details
- **Customization Data:** All customization specifications included
- **Professional Email Template:** Responsive HTML design with branding
- **File Attachments:** Order summary and uploaded images (when available)
- **Multiple Email Providers:** Support for Gmail and custom SMTP
- **Error Handling:** Graceful error handling with logging
- **Security:** Webhook signature verification

## 📧 Email Content

Each notification email includes:

### Order Information
- Order ID and timestamp
- Customer contact details
- Billing and shipping addresses
- Payment method and total amount

### Customization Details
- Product specifications (size, quantity, price)
- Custom text and player numbers
- Color selections and font choices
- Special requirements and notes
- Uploaded image information

### Attachments
- Order summary text file
- Uploaded images (when available)
- Error logs (if processing issues occur)

## 🚀 Quick Setup

### 1. Deploy to Netlify
Ensure your Gatsby site is deployed to Netlify with the webhook function.

### 2. Configure Email Service
Choose and configure your email provider:

**Option A: Gmail (Recommended)**
```bash
EMAIL_PROVIDER=gmail
GMAIL_USER=your-business@gmail.com
GMAIL_APP_PASSWORD=your-app-password
BUSINESS_EMAIL=your-business@gmail.com
```

**Option B: Custom SMTP**
```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-password
BUSINESS_EMAIL=your-business@domain.com
```

### 3. Configure Snipcart Webhook
In your Snipcart dashboard:
- Add webhook URL: `https://your-site.netlify.app/.netlify/functions/snipcart-webhook`
- Select event: `order.completed`
- Set method: `POST`

### 4. Test the System
```bash
node test-email-notification.js
```

## 📁 File Structure

```
netlify/functions/
├── snipcart-webhook.js          # Main webhook handler
├── utils/
│   ├── emailService.js          # Email sending service
│   └── fileHandler.js           # File attachment processing
└── templates/
    └── orderEmailTemplate.js    # HTML email template

docs/
├── EMAIL_CONFIGURATION.md      # Detailed email setup guide
├── WEBHOOK_SETUP.md            # Snipcart webhook configuration
└── TESTING_GUIDE.md            # Comprehensive testing instructions

test-email-notification.js      # Test script for email functionality
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `EMAIL_PROVIDER` | Yes | `gmail` or `smtp` |
| `BUSINESS_EMAIL` | Yes | Where notifications are sent |
| `GMAIL_USER` | Gmail only | Gmail account username |
| `GMAIL_APP_PASSWORD` | Gmail only | Gmail app password |
| `SMTP_HOST` | SMTP only | SMTP server hostname |
| `SMTP_PORT` | SMTP only | SMTP server port |
| `SMTP_USER` | SMTP only | SMTP username |
| `SMTP_PASSWORD` | SMTP only | SMTP password |
| `BUSINESS_CC_EMAIL` | Optional | Additional recipient |
| `SNIPCART_WEBHOOK_SECRET` | Optional | Webhook security |

### Email Template Customization

The email template can be customized by editing:
```javascript
netlify/functions/templates/orderEmailTemplate.js
```

Features:
- Responsive HTML design
- Professional styling
- Color-coded sections
- Mobile-friendly layout
- Plain text fallback

## 🧪 Testing

### Quick Test
```bash
# Test email configuration
node test-email-notification.js
```

### Manual Webhook Test
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/snipcart-webhook \
  -H "Content-Type: application/json" \
  -d '{"eventName":"order.completed","content":{"token":"test"}}'
```

### End-to-End Test
1. Enable Snipcart test mode
2. Place a test order with customizations
3. Complete checkout
4. Verify email notification

## 🔍 Monitoring

### Netlify Function Logs
- Go to Netlify Dashboard → Functions
- Click on `snipcart-webhook`
- Review execution logs

### Snipcart Webhook Logs
- Go to Snipcart Dashboard → Webhooks
- View delivery status and responses

### Email Delivery
- Monitor email delivery rates
- Check spam folder for test emails
- Verify all customization data is included

## 🛠️ Troubleshooting

### Common Issues

**Webhook not triggered:**
- Verify webhook URL in Snipcart
- Check Netlify function deployment
- Ensure `order.completed` event is selected

**Email not sending:**
- Check environment variables
- Verify email credentials
- Review function logs for errors
- Check spam folder

**Missing customization data:**
- Verify Snipcart custom fields configuration
- Check webhook payload structure
- Review data processing logic

**Images not attaching:**
- Current limitation: images stored as base64 in browser
- Consider cloud storage integration for full image support

### Debug Steps
1. Check Netlify function logs
2. Test webhook endpoint manually
3. Verify email configuration independently
4. Review Snipcart webhook delivery logs

## 🔒 Security

### Best Practices
- Use webhook secrets for verification
- Store credentials in environment variables only
- Monitor webhook logs for suspicious activity
- Use app passwords for Gmail (not main password)
- Keep dependencies updated

### Webhook Security
```javascript
// Webhook signature verification is implemented
const signature = event.headers['x-snipcart-requesttoken'];
if (!verifyWebhookSignature(event.body, signature)) {
  return { statusCode: 401, body: 'Unauthorized' };
}
```

## 📈 Performance

### Metrics
- **Webhook Response Time:** < 5 seconds target
- **Email Delivery:** 1-30 seconds typical
- **Error Rate:** < 1% target

### Optimization
- Efficient email template generation
- Proper error handling and logging
- Attachment size limits (10MB max)

## 🔄 Maintenance

### Regular Tasks
- Monitor email delivery rates
- Review error logs
- Update dependencies
- Test webhook functionality
- Backup email templates

### Updates
- Email template improvements
- Additional customization fields
- Enhanced error handling
- Performance optimizations

## 📚 Documentation

- **[Email Configuration Guide](EMAIL_CONFIGURATION.md)** - Detailed setup instructions
- **[Webhook Setup Guide](WEBHOOK_SETUP.md)** - Snipcart webhook configuration
- **[Testing Guide](TESTING_GUIDE.md)** - Comprehensive testing procedures
- **[Snipcart Setup](SNIPCART_SETUP.md)** - General Snipcart configuration

## 🆘 Support

### Getting Help
1. Check troubleshooting section
2. Review function logs
3. Test components independently
4. Verify configuration settings

### Resources
- [Snipcart Webhook Documentation](https://docs.snipcart.com/v3/webhooks/)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)

## 🎉 Success Criteria

The system is working correctly when:
- ✅ Webhooks are received from Snipcart
- ✅ Emails are sent for custom orders only
- ✅ All customization data is included
- ✅ Email formatting is professional
- ✅ Attachments are included when possible
- ✅ Error handling works gracefully
- ✅ Performance meets targets

---

**Need help?** Check the detailed guides in the `docs/` folder or test your configuration with the provided test script.
