# Mollie Payment Integration Guide

This guide walks you through setting up Mollie payments for your Shin Shop Medusa.js backend, providing full CZK/EUR support for your Czech customers.

## 🎯 Why Mollie?

### ✅ **Perfect for Czech Market:**
- **CZK Support** - Native Czech Koruna processing
- **Local Payment Methods** - Popular Czech payment options
- **EU Compliance** - GDPR and PSD2 compliant
- **Low Fees** - Competitive pricing for European merchants
- **Easy Integration** - Simple API and webhook system

### 💳 **Supported Payment Methods:**
- **Credit/Debit Cards** - Visa, Mastercard, Maestro
- **Bank Transfers** - SEPA, iDEAL, Bancontact
- **Digital Wallets** - PayPal, Apple Pay, Google Pay
- **Local Methods** - Przelewy24, EPS, Giropay

## 🚀 Quick Setup

### Step 1: Create Mollie Account

1. **Sign up at [Mollie.com](https://mollie.com/)**
2. **Choose business account type**
3. **Complete verification process**
4. **Add your business details**

### Step 2: Get API Keys

1. **Go to Mollie Dashboard**
2. **Navigate to Developers → API keys**
3. **Copy your API keys:**
   - **Test API Key** - For development
   - **Live API Key** - For production

### Step 3: Configure Medusa Backend

Update your `.env` file:

```bash
# Mollie Configuration
MOLLIE_API_KEY=test_your_mollie_api_key_here
MOLLIE_WEBHOOK_URL=https://your-backend-url.com/mollie/webhooks

# For production, use live key:
# MOLLIE_API_KEY=live_your_mollie_live_key_here
```

### Step 4: Restart Backend

```bash
# Stop current server (Ctrl+C)
# Restart with new configuration
npm run dev
```

### Step 5: Verify Integration

1. **Check admin panel** - Go to Settings → Payment Providers
2. **Verify Mollie is listed** - Should show as available
3. **Test API connection** - Check logs for any errors

## 🛍️ Payment Configuration

### Currency Setup

Your backend is pre-configured for:

- **Primary Currency:** CZK (Czech Koruna)
- **Secondary Currency:** EUR (Euro)
- **Exchange Rate:** Automatic via Mollie

### Regional Configuration

```javascript
// Czech Republic Region
{
  name: "Czech Republic",
  currency_code: "czk",
  tax_rate: 21,
  payment_providers: ["mollie"],
  countries: ["cz"]
}

// Europe Region  
{
  name: "Europe",
  currency_code: "eur",
  tax_rate: 20,
  payment_providers: ["mollie"],
  countries: ["sk", "de", "at"]
}
```

### Product Pricing

Products are configured with both currencies:

```javascript
// Premium Shin Pad
{
  prices: [
    { currency_code: "czk", amount: 99900 },  // 999.00 CZK
    { currency_code: "eur", amount: 3996 }    // 39.96 EUR
  ]
}
```

## 🔧 Advanced Configuration

### Webhook Setup

1. **In Mollie Dashboard:**
   - Go to Developers → Webhooks
   - Add webhook URL: `https://your-backend-url.com/mollie/webhooks`
   - Select all payment events

2. **Webhook Events:**
   - `payment.paid` - Payment successful
   - `payment.failed` - Payment failed
   - `payment.canceled` - Payment canceled
   - `payment.expired` - Payment expired

### Payment Methods Configuration

Enable specific payment methods in Mollie dashboard:

```javascript
// Recommended for Czech customers
const czechPaymentMethods = [
  'creditcard',    // Visa, Mastercard
  'banktransfer',  // SEPA transfer
  'paypal',        // PayPal
  'przelewy24',    // Popular in Czech/Poland
  'eps'            // Austrian but used in Czech
]
```

### Test Payment Methods

For development, use Mollie test cards:

```javascript
// Test Credit Cards
const testCards = {
  visa: '4242 4242 4242 4242',
  mastercard: '5555 5555 5555 4444',
  maestro: '6771 7980 2100 0008'
}

// Test Details
const testData = {
  expiry: '12/25',
  cvc: '123',
  name: 'Test Customer'
}
```

## 💰 Pricing and Fees

### Mollie Fees (as of 2024)

- **European Cards:** 1.8% + €0.25
- **Non-European Cards:** 2.8% + €0.25
- **PayPal:** 3.4% + €0.25
- **Bank Transfer:** €0.25 (fixed)

### Cost Comparison vs Snipcart

```
Order Value: 999 CZK (~40 EUR)

Snipcart: 2% + fees = ~€1.00
Mollie: 1.8% + €0.25 = ~€0.97

Savings: ~€0.03 per transaction
Plus: No monthly fees with Medusa!
```

## 🧪 Testing

### Test Payment Flow

1. **Create test order:**
   ```bash
   curl -X POST http://localhost:9000/store/carts \
     -H "Content-Type: application/json"
   ```

2. **Add product to cart:**
   ```bash
   curl -X POST http://localhost:9000/store/carts/{cart_id}/line-items \
     -H "Content-Type: application/json" \
     -d '{
       "variant_id": "variant_123",
       "quantity": 1,
       "metadata": {
         "player_number": "10",
         "text_color": "#FF0000"
       }
     }'
   ```

3. **Complete checkout:**
   ```bash
   curl -X POST http://localhost:9000/store/carts/{cart_id}/complete \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com"
     }'
   ```

### Verify Payment Processing

1. **Check Mollie Dashboard** - View test payments
2. **Check Medusa Admin** - Verify order status
3. **Check Email Notifications** - Confirm emails sent
4. **Check Webhook Logs** - Verify webhook delivery

## 🌍 Multi-Currency Support

### Automatic Currency Detection

```javascript
// Frontend currency detection
const detectCurrency = (countryCode) => {
  const currencyMap = {
    'CZ': 'czk',
    'SK': 'eur',
    'DE': 'eur',
    'AT': 'eur'
  }
  return currencyMap[countryCode] || 'czk'
}
```

### Price Display

```javascript
// Format prices for display
const formatPrice = (amount, currency) => {
  const formatters = {
    czk: new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK'
    }),
    eur: new Intl.NumberFormat('cs-CZ', {
      style: 'currency', 
      currency: 'EUR'
    })
  }
  
  return formatters[currency].format(amount / 100)
}

// Examples:
// formatPrice(99900, 'czk') → "999,00 Kč"
// formatPrice(3996, 'eur') → "39,96 €"
```

## 🔒 Security

### API Key Security

```bash
# Never commit API keys to git
echo "MOLLIE_API_KEY=*" >> .gitignore

# Use environment variables only
export MOLLIE_API_KEY=test_your_key_here

# Rotate keys regularly
# Use different keys for test/production
```

### Webhook Security

```javascript
// Verify webhook signatures (optional)
const crypto = require('crypto')

const verifyWebhook = (payload, signature, secret) => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return signature === expectedSignature
}
```

## 🚀 Production Deployment

### Environment Variables

```bash
# Production configuration
MOLLIE_API_KEY=live_your_mollie_live_key_here
MOLLIE_WEBHOOK_URL=https://your-production-backend.com/mollie/webhooks

# Database
DATABASE_URL=postgres://user:pass@prod-host:5432/medusa-prod

# Security
JWT_SECRET=your_secure_production_jwt_secret
COOKIE_SECRET=your_secure_production_cookie_secret
```

### Go Live Checklist

- [ ] Mollie account verified and approved
- [ ] Live API keys configured
- [ ] Webhook URL updated to production
- [ ] SSL certificate installed
- [ ] Payment methods tested
- [ ] Email notifications working
- [ ] Admin panel accessible
- [ ] Backup and monitoring setup

## 🛠️ Troubleshooting

### Common Issues

#### API Key Not Working
```bash
# Check API key format
echo $MOLLIE_API_KEY | grep -E "^(test|live)_"

# Test API connection
curl -H "Authorization: Bearer $MOLLIE_API_KEY" \
  https://api.mollie.com/v2/methods
```

#### Webhook Not Receiving Events
```bash
# Check webhook URL accessibility
curl -X POST https://your-backend.com/mollie/webhooks \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Check Mollie webhook logs
# Go to Mollie Dashboard → Developers → Webhooks
```

#### Payment Failures
```bash
# Check Medusa logs
DEBUG=medusa:* npm run dev

# Check Mollie payment logs
# Go to Mollie Dashboard → Payments
```

### Debug Commands

```bash
# Test Mollie API connection
node -e "
const { createMollieClient } = require('@mollie/api-client');
const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });
mollie.methods.list().then(console.log).catch(console.error);
"

# Check payment providers in Medusa
curl http://localhost:9000/store/regions
```

## 📚 Documentation

- [Mollie API Documentation](https://docs.mollie.com/)
- [Medusa Payment Providers](https://docs.medusajs.com/modules/carts-and-checkout/payment)
- [Mollie Medusa Plugin](https://github.com/medusajs/medusa/tree/master/packages/medusa-payment-mollie)

## 🎉 Success Criteria

Your Mollie integration is working when:

- ✅ API keys are configured and valid
- ✅ Payment providers show Mollie in admin
- ✅ Test payments process successfully
- ✅ Webhooks are received and processed
- ✅ Orders are created in Medusa
- ✅ Email notifications are sent
- ✅ Both CZK and EUR work correctly

---

**Ready for the next step?** Once Mollie is configured, we'll set up your shin pad product catalog!
