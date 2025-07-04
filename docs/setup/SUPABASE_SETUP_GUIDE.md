# Supabase Setup Guide for Shin Shop

This guide walks you through setting up the Supabase backend for your shin pad e-commerce shop.

## 🎯 Why Supabase?

### ✅ **Advantages over Medusa.js:**
- **Serverless** - No backend maintenance or hosting costs
- **Built-in Auth** - User authentication and authorization out of the box
- **Real-time** - Live updates for inventory, orders, etc.
- **Global CDN** - Fast performance worldwide
- **Row Level Security** - Database-level security policies
- **Edge Functions** - Serverless functions at the edge
- **Free Tier** - Generous free tier, pay only as you scale

## 📋 Prerequisites

- Node.js 20.x LTS
- Git
- Supabase account (free at [supabase.com](https://supabase.com))

## 🚀 Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign up/sign in
2. **Click "New Project"**
3. **Choose your organization** (or create one)
4. **Project Settings:**
   - **Name**: `shin-shop-ecommerce`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: `Europe (Frankfurt)` (closest to Czech customers)
   - **Pricing Plan**: Free tier (upgrade later if needed)

5. **Wait for project creation** (takes 1-2 minutes)

## 🔑 Step 2: Get Project Credentials

Once your project is created:

1. **Go to Project Settings** → **API**
2. **Copy the following values:**
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this secret!)

## 🛠 Step 3: Configure Local Environment

1. **Create environment file:**
   ```bash
   cp .env.example .env.development
   ```

2. **Update `.env.development` with your Supabase credentials:**
   ```env
   # Supabase Configuration
   GATSBY_SUPABASE_URL=https://your-project-ref.supabase.co
   GATSBY_SUPABASE_ANON_KEY=your_anon_key_here
   
   # Site Configuration
   GATSBY_SITE_URL=http://localhost:8000
   GATSBY_DEBUG_MODE=true
   
   # Development only
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

## 🗄️ Step 4: Set Up Database

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase project dashboard**
2. **Navigate to SQL Editor**
3. **Run the migration files in order:**

   **First, run the initial schema:**
   ```sql
   -- Copy and paste the contents of supabase/migrations/20240101000000_initial_schema.sql
   ```

   **Then, run the RLS policies:**
   ```sql
   -- Copy and paste the contents of supabase/migrations/20240101000001_rls_policies.sql
   ```

   **Finally, run the seed data:**
   ```sql
   -- Copy and paste the contents of supabase/seed.sql
   ```

### Option B: Using Supabase CLI (Advanced)

1. **Login to Supabase CLI:**
   ```bash
   npx supabase login
   ```

2. **Link your project:**
   ```bash
   npx supabase link --project-ref your-project-ref
   ```

3. **Push migrations:**
   ```bash
   npx supabase db push
   ```

4. **Run seed data:**
   ```bash
   npx supabase db reset
   ```

## 🔧 Step 5: Deploy Edge Functions

1. **Deploy the products function:**
   ```bash
   npx supabase functions deploy products
   ```

2. **Deploy the cart function:**
   ```bash
   npx supabase functions deploy cart
   ```

3. **Set environment variables for functions:**
   ```bash
   npx supabase secrets set SUPABASE_URL=https://your-project-ref.supabase.co
   npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## ✅ Step 6: Verify Setup

1. **Check database tables:**
   - Go to **Table Editor** in Supabase dashboard
   - Verify you see: `products`, `product_variants`, `orders`, `carts`, etc.

2. **Check seed data:**
   - Open the `products` table
   - Verify you see "Professional Shin Pads" and "Custom Design Shin Pads"

3. **Test Edge Functions:**
   - Go to **Edge Functions** in dashboard
   - Test the `products` function
   - Should return your seeded products

## 🚀 Step 7: Start Development

1. **Start local development:**
   ```bash
   npm run develop
   ```

2. **Or start with local Supabase (if using CLI):**
   ```bash
   npm run dev:full
   ```

## 🔒 Step 8: Security Configuration

1. **Configure Authentication:**
   - Go to **Authentication** → **Settings**
   - Set **Site URL**: `http://localhost:8000` (development)
   - Add **Redirect URLs**: `https://makushinpadshop.netlify.app` (production)

2. **Configure Storage:**
   - Go to **Storage**
   - Create bucket: `product-images`
   - Set public access for product images

## 📊 Step 9: Optional Enhancements

1. **Enable Real-time:**
   - Go to **Database** → **Replication**
   - Enable real-time for `products`, `carts` tables

2. **Set up Analytics:**
   - Go to **Reports**
   - Monitor API usage and performance

## 🚨 Troubleshooting

### Common Issues:

1. **"Invalid API key"**
   - Double-check your anon key in `.env.development`
   - Make sure there are no extra spaces

2. **"Table doesn't exist"**
   - Run the migration files in the correct order
   - Check the SQL Editor for any errors

3. **"Function not found"**
   - Deploy edge functions: `npx supabase functions deploy`
   - Check function logs in dashboard

4. **CORS errors**
   - Add your domain to allowed origins in project settings

## 🎉 Next Steps

Once setup is complete:
1. Update frontend components to use Supabase
2. Implement payment processing (Stripe/Mollie)
3. Set up email notifications
4. Deploy to production

## 📞 Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/Mzoratto/makushinpad/issues)
