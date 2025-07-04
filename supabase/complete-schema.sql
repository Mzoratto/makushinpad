-- The Shin Shop Complete Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PRODUCTS SYSTEM
-- =============================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  handle TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  images JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sku TEXT UNIQUE,
  price INTEGER NOT NULL, -- Price in cents (CZK)
  compare_at_price INTEGER,
  inventory_quantity INTEGER DEFAULT 0,
  weight INTEGER DEFAULT 0,
  size TEXT, -- S, M
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CART SYSTEM
-- =============================================

-- Carts table
CREATE TABLE IF NOT EXISTS carts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- =============================================
-- ORDERS SYSTEM
-- =============================================

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  currency TEXT DEFAULT 'CZK',
  subtotal INTEGER NOT NULL, -- In cents
  tax_total INTEGER DEFAULT 0,
  shipping_total INTEGER DEFAULT 0,
  total INTEGER NOT NULL, -- In cents
  shipping_address JSONB,
  billing_address JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id),
  title TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL, -- In cents
  total INTEGER NOT NULL, -- In cents
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_handle ON products(handle);

-- Product variants indexes
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);

-- Cart items indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_variant_id ON cart_items(variant_id);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products policies (public read for published products)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (status = 'published');

CREATE POLICY "Product variants are viewable by everyone" ON product_variants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_variants.product_id 
      AND products.status = 'published'
    )
  );

-- Cart policies (public access for anonymous users)
CREATE POLICY "Carts are accessible by everyone" ON carts
  FOR ALL USING (true);

CREATE POLICY "Cart items are accessible by everyone" ON cart_items
  FOR ALL USING (true);

-- Orders policies (restrict access - will be updated when auth is implemented)
CREATE POLICY "Orders are private" ON orders
  FOR ALL USING (false);

CREATE POLICY "Order items are private" ON order_items
  FOR ALL USING (false);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SEED DATA
-- =============================================

-- Insert sample products
INSERT INTO products (title, description, handle, status, images, metadata) VALUES
('Professional Shin Pads', 'High-quality professional shin pads for serious athletes. Lightweight yet durable protection for competitive sports.', 'professional-shin-pads', 'published',
 '[{"url": "/images/professional-shin-pads.jpg", "alt": "Professional Shin Pads"}]',
 '{"featured": true, "category": "professional"}'),

('Custom Design Shin Pads', 'Personalized shin pads with your own design. Upload your artwork and we will create unique shin pads just for you.', 'custom-design-shin-pads', 'published',
 '[{"url": "/images/custom-shin-pads.jpg", "alt": "Custom Design Shin Pads"}]',
 '{"featured": true, "category": "custom", "customizable": true}')
ON CONFLICT (handle) DO NOTHING;

-- Insert product variants for Professional Shin Pads
INSERT INTO product_variants (product_id, title, sku, price, inventory_quantity, size, metadata)
SELECT
  p.id,
  'Professional Shin Pads - Small',
  'PROF-SHIN-S',
  79900, -- 799 CZK in cents
  50,
  'S',
  '{"size_code": "S", "weight": 200}'
FROM products p WHERE p.handle = 'professional-shin-pads'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, title, sku, price, inventory_quantity, size, metadata)
SELECT
  p.id,
  'Professional Shin Pads - Medium',
  'PROF-SHIN-M',
  79900, -- 799 CZK in cents
  50,
  'M',
  '{"size_code": "M", "weight": 250}'
FROM products p WHERE p.handle = 'professional-shin-pads'
ON CONFLICT (sku) DO NOTHING;

-- Insert product variants for Custom Design Shin Pads
INSERT INTO product_variants (product_id, title, sku, price, inventory_quantity, size, metadata)
SELECT
  p.id,
  'Custom Design Shin Pads - Small',
  'CUSTOM-SHIN-S',
  99900, -- 999 CZK in cents
  25,
  'S',
  '{"size_code": "S", "weight": 200, "customizable": true}'
FROM products p WHERE p.handle = 'custom-design-shin-pads'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, title, sku, price, inventory_quantity, size, metadata)
SELECT
  p.id,
  'Custom Design Shin Pads - Medium',
  'CUSTOM-SHIN-M',
  99900, -- 999 CZK in cents
  25,
  'M',
  '{"size_code": "M", "weight": 250, "customizable": true}'
FROM products p WHERE p.handle = 'custom-design-shin-pads'
ON CONFLICT (sku) DO NOTHING;
