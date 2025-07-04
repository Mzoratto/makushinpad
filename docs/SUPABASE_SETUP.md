# 🚀 Supabase Setup Guide - The Shin Shop

## 📋 Current Status

✅ **Refactoring Complete** - All code organization and security fixes implemented  
✅ **Technical Issues Resolved** - i18n and dependency conflicts fixed  
⚠️ **Supabase Setup Required** - Need valid credentials to test functionality  

## 🔧 Setup Options

### **Option A: Create New Supabase Project (Recommended)**

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** to your account
3. **Create New Project**
   - Project name: `shin-shop`
   - Database password: (choose a strong password)
   - Region: Choose closest to your users

4. **Get Your Credentials**
   - Go to Settings → API
   - Copy your Project URL
   - Copy your `anon` `public` key

5. **Update Environment Variables**
   ```bash
   # Edit .env.development
   GATSBY_SUPABASE_URL=https://your-project-ref.supabase.co
   GATSBY_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### **Option B: Use Existing Project**

If you already have a Supabase project:

1. **Find Your Project**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Select your project

2. **Get Credentials**
   - Settings → API
   - Copy Project URL and anon key

3. **Update Environment**
   - Edit `.env.development` with your credentials

## 🗄️ Database Schema Setup

Once you have valid credentials, set up the database schema:

### **1. Products Table**
```sql
-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  handle TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  images JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (status = 'published');
```

### **2. Product Variants Table**
```sql
-- Create product variants table
CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sku TEXT UNIQUE,
  price INTEGER NOT NULL, -- Price in cents
  compare_at_price INTEGER,
  inventory_quantity INTEGER DEFAULT 0,
  weight INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product variants are viewable by everyone" ON product_variants
  FOR SELECT USING (true);
```

### **3. Carts Table**
```sql
-- Create carts table
CREATE TABLE carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Create RLS policies
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Carts are viewable by everyone" ON carts
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create carts" ON carts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update carts" ON carts
  FOR UPDATE USING (true);
```

### **4. Cart Items Table**
```sql
-- Create cart items table
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL, -- Price in cents
  title TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cart_id, variant_id)
);

-- Create RLS policies
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cart items are viewable by everyone" ON cart_items
  FOR SELECT USING (true);

CREATE POLICY "Anyone can manage cart items" ON cart_items
  FOR ALL USING (true);
```

## 🌱 Seed Data

After creating the schema, add some sample products:

```sql
-- Insert sample products
INSERT INTO products (title, description, handle, status, images) VALUES
('Professional Shin Pads', 'High-quality professional shin pads for serious athletes', 'professional-shin-pads', 'published', '[{"url": "/images/professional-shin-pads.jpg", "alt": "Professional Shin Pads"}]'),
('Custom Design Shin Pads', 'Personalized shin pads with your own design', 'custom-design-shin-pads', 'published', '[{"url": "/images/custom-shin-pads.jpg", "alt": "Custom Design Shin Pads"}]');

-- Insert product variants
INSERT INTO product_variants (product_id, title, sku, price, inventory_quantity) 
SELECT 
  p.id,
  p.title || ' - Small',
  'SHIN-' || UPPER(LEFT(p.handle, 4)) || '-S',
  79900, -- 799 CZK in cents
  50
FROM products p WHERE p.handle = 'professional-shin-pads';

INSERT INTO product_variants (product_id, title, sku, price, inventory_quantity) 
SELECT 
  p.id,
  p.title || ' - Medium',
  'SHIN-' || UPPER(LEFT(p.handle, 4)) || '-M',
  79900, -- 799 CZK in cents
  50
FROM products p WHERE p.handle = 'professional-shin-pads';

-- Repeat for custom design shin pads
INSERT INTO product_variants (product_id, title, sku, price, inventory_quantity) 
SELECT 
  p.id,
  p.title || ' - Small',
  'SHIN-' || UPPER(LEFT(p.handle, 4)) || '-S',
  99900, -- 999 CZK in cents
  25
FROM products p WHERE p.handle = 'custom-design-shin-pads';

INSERT INTO product_variants (product_id, title, sku, price, inventory_quantity) 
SELECT 
  p.id,
  p.title || ' - Medium',
  'SHIN-' || UPPER(LEFT(p.handle, 4)) || '-M',
  99900, -- 999 CZK in cents
  25
FROM products p WHERE p.handle = 'custom-design-shin-pads';
```

## 🧪 Testing

After setup, test the connection:

```bash
# Test Supabase connection
npm run test:connection

# Start development server
npm run develop

# Visit http://localhost:8000
```

## 🚀 Next Steps

1. ✅ **Set up Supabase project**
2. ✅ **Configure environment variables**
3. ✅ **Create database schema**
4. ✅ **Add seed data**
5. ✅ **Test connection**
6. ✅ **Start development server**
7. ✅ **Test all functionality**
8. ✅ **Deploy to production**

---

**Once you have valid Supabase credentials, the application will be fully functional!**
