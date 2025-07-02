# Medusa.js Setup Guide for Shin Shop

This guide walks you through setting up the Medusa.js backend for your shin pad e-commerce shop, replacing Snipcart with a more powerful and free solution.

## 🎯 Why Medusa.js?

### ✅ **Advantages over Snipcart:**
- **Completely Free** - No transaction fees or monthly costs
- **Mollie Integration** - Native support for your preferred payment processor
- **Full Control** - Own your data and customize everything
- **Advanced Features** - Better product variants, inventory management
- **Webhook System** - More reliable email notifications
- **Multi-currency** - Built-in CZK/EUR support

### 🔄 **Migration Benefits:**
- Keep existing Gatsby frontend (minimal changes needed)
- Maintain current email notification system
- Add advanced product management
- Better customization handling
- Scalable for future growth

## 🚀 Quick Start

### Step 1: Set Up Database

Choose one of these database options:

#### Option A: Railway (Recommended - Free)
1. Go to [Railway.app](https://railway.app/)
2. Sign up with GitHub
3. Create new project → Add PostgreSQL
4. Copy the database URL from the Connect tab

#### Option B: Supabase (Free)
1. Go to [Supabase.com](https://supabase.com/)
2. Create new project
3. Go to Settings → Database
4. Copy the connection string

#### Option C: Local PostgreSQL
```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt install postgresql  # Ubuntu

# Start PostgreSQL
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Ubuntu

# Create database
createdb medusa-store
```

### Step 2: Install and Configure Backend

```bash
# Navigate to backend directory
cd medusa-backend

# Run setup script
./setup.sh

# Update environment variables
nano .env
```

### Step 3: Configure Environment Variables

Update `.env` with your actual values:

```bash
# Database (from Step 1)
DATABASE_URL=postgres://username:password@host:port/database

# Mollie Payment
MOLLIE_API_KEY=test_your_mollie_api_key_here

# Email Notifications (reuse from existing setup)
EMAIL_PROVIDER=gmail
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
BUSINESS_EMAIL=your-business-email@gmail.com

# CORS (add your Gatsby site URL)
STORE_CORS=http://localhost:8000,https://makushinpadshop.netlify.app
```

### Step 4: Start Backend

```bash
# Development mode
npm run dev

# Production mode
npm run build && npm start
```

### Step 5: Access Admin Panel

1. Open http://localhost:7001
2. Login with: admin@shinshop.com / supersecret
3. Explore products, orders, and settings

## 🛍️ Product Configuration

### Pre-configured Products

The backend comes with two shin pad products:

1. **Premium Shin Pad** - 999 CZK (Full customization)
2. **Standard Shin Pad** - 799 CZK (Basic customization)

### Customization Fields

Both products support these fields in their metadata:

```javascript
{
  "customizable": true,
  "custom_fields": [
    "size",              // S, M, L, XL
    "player_number",     // 1-99
    "left_shin_text",    // Text for left pad
    "right_shin_text",   // Text for right pad
    "additional_text",   // Extra text
    "text_color",        // Hex color code
    "backdrop_color",    // Background color
    "font_family",       // Font selection
    "uploaded_image",    // Image file
    "additional_requirements" // Special notes
  ]
}
```

### Adding New Products

1. Go to Admin Panel → Products
2. Click "Add Product"
3. Fill in basic details
4. Add metadata for customization:
   ```json
   {
     "customizable": true,
     "custom_fields": ["size", "player_number", "text_color"]
   }
   ```
5. Create variants for different sizes
6. Set prices in CZK and EUR

## 💳 Mollie Payment Setup

### Step 1: Get Mollie API Key

1. Sign up at [Mollie.com](https://mollie.com/)
2. Go to Developers → API keys
3. Copy your test API key
4. For production, use live API key

### Step 2: Configure Webhook

1. In Mollie dashboard, go to Developers → Webhooks
2. Add webhook URL: `https://your-backend-url.com/mollie/webhooks`
3. Select all payment events

### Step 3: Test Payments

1. Use Mollie test cards in development
2. Check payment status in admin panel
3. Verify webhook delivery in Mollie dashboard

## 📧 Email Notifications

### Automatic Setup

Email notifications are automatically configured to use your existing system:

1. **Order Placed** → Email sent to business email
2. **Custom Products Only** → Only customized orders trigger emails
3. **Complete Data** → All customization details included
4. **Professional Format** → Same beautiful email template

### Configuration

The email service reuses your existing configuration:

```bash
# Same variables as before
EMAIL_PROVIDER=gmail
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
BUSINESS_EMAIL=your-business-email@gmail.com
```

### Testing Email Notifications

1. Place test order with customizations
2. Check admin panel for order details
3. Verify email notification received
4. Check email formatting and attachments

## 🔗 API Integration

### Store API Endpoints

```bash
# Base URL: http://localhost:9000

# Products
GET /store/products                    # List products
GET /store/products/:id               # Get product details

# Cart Management
POST /store/carts                     # Create cart
POST /store/carts/:id/line-items      # Add item to cart
PUT /store/carts/:id/line-items/:item_id  # Update cart item
DELETE /store/carts/:id/line-items/:item_id  # Remove item

# Checkout
POST /store/carts/:id/complete        # Complete order
GET /store/orders/:id                 # Get order details
```

### Example API Usage

```javascript
// Create cart
const cart = await fetch('http://localhost:9000/store/carts', {
  method: 'POST'
}).then(res => res.json())

// Add customized product
await fetch(`http://localhost:9000/store/carts/${cart.cart.id}/line-items`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    variant_id: 'variant_123',
    quantity: 1,
    metadata: {
      player_number: '10',
      left_shin_text: 'SPARTA',
      right_shin_text: 'PRAHA',
      text_color: '#DC143C'
    }
  })
})

// Complete order
await fetch(`http://localhost:9000/store/carts/${cart.cart.id}/complete`, {
  method: 'POST'
})
```

## 🚀 Deployment

### Railway Deployment (Recommended)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy backend:**
   ```bash
   cd medusa-backend
   railway init
   railway up
   ```

3. **Add environment variables:**
   ```bash
   railway variables set DATABASE_URL=your_postgres_url
   railway variables set MOLLIE_API_KEY=your_mollie_key
   # ... add other variables
   ```

4. **Get deployment URL:**
   ```bash
   railway domain
   ```

### Environment Variables for Production

```bash
# Database
DATABASE_URL=postgres://user:pass@host:port/db

# Mollie
MOLLIE_API_KEY=live_your_mollie_live_key
MOLLIE_WEBHOOK_URL=https://your-backend.railway.app/mollie/webhooks

# Email
EMAIL_PROVIDER=gmail
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
BUSINESS_EMAIL=your-business-email@gmail.com

# CORS
STORE_CORS=https://makushinpadshop.netlify.app
ADMIN_CORS=https://your-admin-domain.com

# Security
JWT_SECRET=your_secure_jwt_secret
COOKIE_SECRET=your_secure_cookie_secret
```

## 🔄 Migration from Snipcart

### Phase 1: Backend Setup (This Guide)
- ✅ Set up Medusa.js backend
- ✅ Configure products and payments
- ✅ Test email notifications

### Phase 2: Frontend Integration (Next)
- Update Gatsby to use Medusa API
- Replace Snipcart cart with Medusa cart
- Update customize page for Medusa

### Phase 3: Testing and Launch
- End-to-end testing
- Data migration (if needed)
- Go live with new system

## 🛠️ Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check database URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

#### Build Errors
```bash
# Clear and rebuild
rm -rf dist node_modules
npm install
npm run build
```

#### Email Not Sending
```bash
# Check environment variables
echo $EMAIL_PROVIDER
echo $BUSINESS_EMAIL

# Test email service
node -e "console.log(require('./dist/services/email'))"
```

### Debug Mode

Enable detailed logging:
```bash
DEBUG=medusa:* npm run dev
```

## 📚 Next Steps

1. **Complete this backend setup**
2. **Test all functionality**
3. **Update Gatsby frontend** (next guide)
4. **Deploy to production**
5. **Migrate from Snipcart**

## 🆘 Support

- [Medusa Discord](https://discord.gg/medusajs)
- [Medusa Documentation](https://docs.medusajs.com/)
- [GitHub Issues](https://github.com/medusajs/medusa/issues)

---

**Ready to continue?** Once your backend is running, we'll update your Gatsby frontend to use Medusa.js instead of Snipcart!
