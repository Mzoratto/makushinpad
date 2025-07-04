# 🚀 Complete Deployment Guide - The Shin Shop

## 📋 Prerequisites

- ✅ Refactored codebase (completed)
- ✅ Development server working (completed)
- 🔄 Supabase project (we'll create this)
- 🔄 Netlify account (for deployment)

## 🗄️ Step 1: Create Supabase Project

### **1.1 Create New Project**
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click **"New Project"**
4. Fill in details:
   - **Organization**: Choose or create one
   - **Project Name**: `shin-shop`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start

### **1.2 Get Your Credentials**
1. Wait for project creation (1-2 minutes)
2. Go to **Settings → API**
3. Copy your **Project URL** (looks like: `https://abc123.supabase.co`)
4. Copy your **anon/public key** (starts with `eyJ...`)

### **1.3 Update Environment Variables**
Replace the credentials in `.env.development`:

```bash
# Replace these with your actual values
GATSBY_SUPABASE_URL=https://your-project-ref.supabase.co
GATSBY_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

## 🗄️ Step 2: Set Up Database Schema

### **2.1 Run Schema Script**
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `supabase/complete-schema.sql`
4. Paste it into the SQL editor
5. Click **"Run"** to execute

This will create:
- ✅ All necessary tables (products, variants, carts, orders)
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Sample products with variants
- ✅ Triggers for automatic timestamps

### **2.2 Verify Setup**
1. Go to **Table Editor** in Supabase
2. You should see tables: `products`, `product_variants`, `carts`, `cart_items`, `orders`, `order_items`
3. Check the `products` table - should have 2 sample products
4. Check the `product_variants` table - should have 4 variants (2 sizes × 2 products)

## 🧪 Step 3: Test Connection

Run the connection test:
```bash
npm run test:connection
```

Expected output:
```
✅ Supabase connection successful!
✅ Products table: Found 2 published products
   - Professional Shin Pads (professional-shin-pads)
   - Custom Design Shin Pads (custom-design-shin-pads)
✅ Product variants: Found 4 variants
✅ Cart functionality working
```

## 🌐 Step 4: Deploy to Netlify

### **4.1 Prepare for Deployment**
1. Commit all changes:
```bash
git add .
git commit -m "Complete refactoring and Supabase setup"
git push origin main
```

### **4.2 Create Netlify Site**
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Click **"New site from Git"**
4. Connect your GitHub account
5. Select your repository: `makushinpad`
6. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `public`
   - **Node version**: `20.x`

### **4.3 Set Environment Variables**
In Netlify dashboard → Site settings → Environment variables, add:

```bash
GATSBY_SUPABASE_URL=https://your-project-ref.supabase.co
GATSBY_SUPABASE_ANON_KEY=your_actual_anon_key_here
GATSBY_SITE_URL=https://your-site-name.netlify.app
GATSBY_DEBUG_MODE=false
GATSBY_DEFAULT_CURRENCY=CZK
GATSBY_SUPPORTED_CURRENCIES=CZK,EUR
GATSBY_MAX_UPLOAD_SIZE=52428800
NODE_VERSION=20.17.0
```

### **4.4 Deploy**
1. Click **"Deploy site"**
2. Wait for build to complete (5-10 minutes)
3. Your site will be available at `https://your-site-name.netlify.app`

## ✅ Step 5: Verify Production Deployment

### **5.1 Test Core Functionality**
1. Visit your live site
2. Check homepage loads correctly
3. Navigate to products page
4. Test cart functionality:
   - Add items to cart
   - Update quantities
   - Remove items
5. Test language switching (EN/CZ)
6. Test currency switching (CZK/EUR)

### **5.2 Test E-commerce Flow**
1. Add products to cart
2. Proceed to checkout
3. Verify Supabase data is being saved
4. Test custom design upload (if implemented)

## 🔧 Step 6: Optional Enhancements

### **6.1 Custom Domain**
1. In Netlify: Site settings → Domain management
2. Add your custom domain
3. Configure DNS settings
4. Enable HTTPS (automatic)

### **6.2 Performance Optimization**
1. Enable Netlify's asset optimization
2. Configure caching headers
3. Set up analytics
4. Monitor Core Web Vitals

## 🚨 Troubleshooting

### **Build Fails**
```bash
# Check Node version
node --version  # Should be 20.x

# Clear cache and rebuild
npm run clean
npm install
npm run build
```

### **Supabase Connection Issues**
```bash
# Test locally first
npm run test:connection

# Check environment variables in Netlify
# Verify API key is correct
# Ensure RLS policies allow public access
```

### **i18n Issues**
```bash
# If i18n plugin causes issues, temporarily disable it
# Comment out gatsby-plugin-react-i18next in gatsby-config.js
```

## 📊 Success Metrics

After deployment, you should have:
- ✅ **Live website** at your Netlify URL
- ✅ **Working e-commerce** with cart functionality
- ✅ **Database integration** with Supabase
- ✅ **Multi-language support** (EN/CZ)
- ✅ **Multi-currency support** (CZK/EUR)
- ✅ **Secure architecture** with RLS policies
- ✅ **Performance optimized** build

## 🎉 You're Live!

Congratulations! The Shin Shop is now live with:
- 🛡️ **Enterprise-grade security**
- 🌍 **Multi-language support**
- 💰 **Multi-currency functionality**
- 🛒 **Complete e-commerce features**
- 📱 **Responsive design**
- ⚡ **High performance**

---

**Need help? Check the troubleshooting section or open an issue on GitHub.**
