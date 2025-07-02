# Mollie Quick Start Guide

Get Mollie payments working with your Shin Shop in 5 minutes!

## 🚀 Quick Setup

### 1. Get Mollie API Key
1. Sign up at [mollie.com](https://mollie.com/)
2. Go to Developers → API keys
3. Copy your test API key (starts with `test_`)

### 2. Configure Backend
```bash
# Run the configuration helper
node configure-mollie.js

# Or manually add to .env:
echo "MOLLIE_API_KEY=test_your_api_key_here" >> .env
```

### 3. Restart Backend
```bash
npm run dev
```

### 4. Test Integration
```bash
npm run test:mollie
```

## ✅ Success Checklist

Your Mollie integration is working when:
- [ ] API key is configured in .env
- [ ] Backend starts without errors
- [ ] Admin panel shows Mollie in payment providers
- [ ] Test script passes all checks
- [ ] Test payment can be created

## 💳 Test Payment

Use these test details:
- **Card:** 4242 4242 4242 4242
- **Expiry:** 12/25
- **CVC:** 123

## 🌍 Supported Currencies

- **CZK** (Czech Koruna) - Primary
- **EUR** (Euro) - Secondary

## 📋 Payment Methods

Available for Czech customers:
- Credit/Debit Cards (Visa, Mastercard)
- PayPal
- Bank Transfer (SEPA)
- Local payment methods

## 🔗 Webhook Setup

For production, configure webhooks in Mollie dashboard:
1. Go to Developers → Webhooks
2. Add URL: `https://your-backend.com/mollie/webhooks`
3. Select all payment events

## 🛠️ Troubleshooting

### API Key Issues
```bash
# Check API key format
echo $MOLLIE_API_KEY | grep -E "^(test|live)_"

# Test API connection
curl -H "Authorization: Bearer $MOLLIE_API_KEY" \
  https://api.mollie.com/v2/methods
```

### Backend Issues
```bash
# Check if Mollie is loaded
curl http://localhost:9000/store/regions

# Check logs for errors
DEBUG=medusa:* npm run dev
```

## 📚 Documentation

- [Full Setup Guide](docs/MOLLIE_SETUP_GUIDE.md)
- [Mollie API Docs](https://docs.mollie.com/)
- [Medusa Payment Docs](https://docs.medusajs.com/modules/carts-and-checkout/payment)

## 🆘 Need Help?

1. Run the test script: `npm run test:mollie`
2. Check the full setup guide: `docs/MOLLIE_SETUP_GUIDE.md`
3. Verify your API key in Mollie dashboard
4. Make sure backend is running on port 9000

---

**Next:** Once Mollie is working, update your Gatsby frontend to use Medusa API!
