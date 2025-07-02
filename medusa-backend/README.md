# Shin Shop Medusa.js Backend

This is the Medusa.js backend for The Shin Shop - a custom shin pad e-commerce platform with full customization capabilities and Mollie payment integration.

## 🎯 Features

- **Custom Shin Pad Products** - Full customization support with metadata
- **Mollie Payment Integration** - CZK/EUR currency support
- **Multi-region Support** - Czech Republic and Europe
- **Admin Panel** - Easy product and order management
- **Webhook Support** - Email notifications for custom orders
- **File Upload Support** - Handle custom images and designs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Mollie account (for payments)

### Installation

1. **Run the setup script:**
   ```bash
   ./setup.sh
   ```

2. **Update environment variables:**
   ```bash
   # Edit .env file with your actual values
   nano .env
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access applications:**
   - Store API: http://localhost:9000
   - Admin Panel: http://localhost:7001
   - Default admin: admin@shinshop.com / supersecret

## 🔧 Configuration

### Database Setup

#### Option 1: Local PostgreSQL
```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt install postgresql  # Ubuntu

# Create database
createdb medusa-store

# Update .env
DATABASE_URL=postgres://username:password@localhost:5432/medusa-store
```

#### Option 2: Cloud Database (Recommended)
- **Railway**: https://railway.app/ (free tier)
- **Supabase**: https://supabase.com/ (free tier)  
- **Neon**: https://neon.tech/ (free tier)

### Mollie Payment Setup

1. **Get Mollie API key:**
   - Sign up at https://mollie.com/
   - Go to Developers → API keys
   - Copy your test/live API key

2. **Update .env:**
   ```bash
   MOLLIE_API_KEY=test_your_mollie_api_key_here
   MOLLIE_WEBHOOK_URL=https://your-backend-url.com/mollie/webhooks
   ```

### Email Notifications

Configure email settings for order notifications:

```bash
# Gmail configuration
EMAIL_PROVIDER=gmail
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
BUSINESS_EMAIL=your-business-email@gmail.com
```

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run migrate      # Run database migrations
npm run seed         # Seed initial data

# Testing
npm test            # Run tests
```

## 🛍️ Product Configuration

### Shin Pad Products

The backend comes pre-configured with two shin pad products:

1. **Premium Shin Pad** (999 CZK / 39.96 EUR)
   - Full customization options
   - Professional quality
   - Sizes: S, M, L, XL

2. **Standard Shin Pad** (799 CZK / 31.96 EUR)
   - Basic customization options
   - Good quality
   - Sizes: S, M, L

### Custom Fields

Both products support these customization fields:

- `size` - Product size (S, M, L, XL)
- `player_number` - Player number (1-99)
- `left_shin_text` - Text for left shin pad
- `right_shin_text` - Text for right shin pad
- `additional_text` - Extra text
- `text_color` - Text color (hex code)
- `backdrop_color` - Background color (hex code)
- `font_family` - Font selection
- `uploaded_image` - Custom image file
- `additional_requirements` - Special instructions

## 🌍 Multi-Currency & Regions

### Supported Currencies
- **CZK** (Czech Koruna) - Primary
- **EUR** (Euro) - Secondary

### Supported Regions
- **Czech Republic** (CZK, 21% VAT)
- **Europe** (EUR, 20% VAT)

### Shipping Options
- Standard Shipping CZ: 125 CZK
- Express Shipping CZ: 250 CZK
- Standard Shipping EU: 8 EUR

## 🔗 API Endpoints

### Store API (Port 9000)

```bash
# Products
GET /store/products                    # List all products
GET /store/products/:id               # Get product details

# Cart
POST /store/carts                     # Create cart
POST /store/carts/:id/line-items      # Add item to cart
PUT /store/carts/:id/line-items/:item_id  # Update cart item

# Checkout
POST /store/carts/:id/complete        # Complete order
```

### Admin API (Port 7001)

Access the admin panel at http://localhost:7001 for:
- Product management
- Order management
- Customer management
- Analytics and reports

## 🔄 Webhooks

### Order Webhooks

Configure webhooks for email notifications:

```javascript
// Example webhook handler
app.post('/webhooks/orders', (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'order.placed') {
    // Send email notification
    sendCustomOrderEmail(data);
  }
  
  res.status(200).send('OK');
});
```

### Mollie Webhooks

Mollie payment webhooks are automatically handled at:
```
POST /mollie/webhooks
```

## 🚀 Deployment

### Railway Deployment

1. **Connect to Railway:**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   ```

2. **Add environment variables:**
   ```bash
   railway variables set DATABASE_URL=your_postgres_url
   railway variables set MOLLIE_API_KEY=your_mollie_key
   # ... add other variables
   ```

3. **Deploy:**
   ```bash
   railway up
   ```

### Netlify Functions Integration

The backend can work alongside your existing Gatsby + Netlify setup:

1. Deploy backend to Railway/Heroku
2. Update Gatsby frontend to use Medusa API
3. Keep existing Netlify Functions for webhooks

## 🛠️ Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check database URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

#### Migration Failures
```bash
# Reset database
npm run migrate -- --reset

# Run migrations again
npm run migrate
```

#### Build Errors
```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Debug Mode

Enable debug logging:
```bash
DEBUG=medusa:* npm run dev
```

## 📚 Documentation

- [Medusa.js Documentation](https://docs.medusajs.com/)
- [Mollie API Documentation](https://docs.mollie.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🆘 Support

- Check the [Medusa Discord](https://discord.gg/medusajs)
- Review [GitHub Issues](https://github.com/medusajs/medusa/issues)
- Consult the troubleshooting section above

## 📄 License

This project is licensed under the MIT License.
