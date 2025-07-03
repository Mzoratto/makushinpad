-- Row Level Security Policies for Shin Shop E-commerce
-- This file sets up security policies to control data access

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_option_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_option_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;

-- Products: Public read access for published products, admin write access
CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT 
USING (status = 'published');

CREATE POLICY "Products are manageable by admins" 
ON products FOR ALL 
USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);

-- Product variants: Public read access, admin write access
CREATE POLICY "Product variants are viewable by everyone" 
ON product_variants FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM products 
        WHERE products.id = product_variants.product_id 
        AND products.status = 'published'
    )
);

CREATE POLICY "Product variants are manageable by admins" 
ON product_variants FOR ALL 
USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);

-- Product options: Public read access, admin write access
CREATE POLICY "Product options are viewable by everyone" 
ON product_options FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM products 
        WHERE products.id = product_options.product_id 
        AND products.status = 'published'
    )
);

CREATE POLICY "Product options are manageable by admins" 
ON product_options FOR ALL 
USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);

-- Product option values: Public read access, admin write access
CREATE POLICY "Product option values are viewable by everyone" 
ON product_option_values FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM product_options po
        JOIN products p ON p.id = po.product_id
        WHERE po.id = product_option_values.option_id 
        AND p.status = 'published'
    )
);

CREATE POLICY "Product option values are manageable by admins" 
ON product_option_values FOR ALL 
USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);

-- Variant option values: Public read access, admin write access
CREATE POLICY "Variant option values are viewable by everyone" 
ON variant_option_values FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM product_variants pv
        JOIN products p ON p.id = pv.product_id
        WHERE pv.id = variant_option_values.variant_id 
        AND p.status = 'published'
    )
);

CREATE POLICY "Variant option values are manageable by admins" 
ON variant_option_values FOR ALL 
USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);

-- Orders: Users can view their own orders, admins can view all
CREATE POLICY "Users can view own orders" 
ON orders FOR SELECT 
USING (
    auth.uid() = customer_id OR 
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);

CREATE POLICY "Users can create orders" 
ON orders FOR INSERT 
WITH CHECK (
    auth.uid() = customer_id OR 
    customer_id IS NULL -- Allow anonymous orders
);

CREATE POLICY "Admins can manage all orders" 
ON orders FOR ALL 
USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);

-- Order line items: Users can view their own order items, admins can view all
CREATE POLICY "Users can view own order line items" 
ON order_line_items FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_line_items.order_id 
        AND (orders.customer_id = auth.uid() OR 
             auth.jwt() ->> 'role' = 'admin' OR 
             auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin')
    )
);

CREATE POLICY "Users can create order line items for their orders" 
ON order_line_items FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_line_items.order_id 
        AND (orders.customer_id = auth.uid() OR orders.customer_id IS NULL)
    )
);

CREATE POLICY "Admins can manage all order line items" 
ON order_line_items FOR ALL 
USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);

-- Carts: Users can manage their own carts
CREATE POLICY "Users can view own carts" 
ON carts FOR SELECT 
USING (
    auth.uid() = customer_id OR 
    (customer_id IS NULL AND session_id IS NOT NULL) -- Anonymous carts
);

CREATE POLICY "Users can create and update own carts" 
ON carts FOR ALL 
USING (
    auth.uid() = customer_id OR 
    (customer_id IS NULL AND session_id IS NOT NULL) -- Anonymous carts
);

-- Cart line items: Users can manage their own cart items
CREATE POLICY "Users can view own cart line items" 
ON cart_line_items FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM carts 
        WHERE carts.id = cart_line_items.cart_id 
        AND (carts.customer_id = auth.uid() OR 
             (carts.customer_id IS NULL AND carts.session_id IS NOT NULL))
    )
);

CREATE POLICY "Users can manage own cart line items" 
ON cart_line_items FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM carts 
        WHERE carts.id = cart_line_items.cart_id 
        AND (carts.customer_id = auth.uid() OR 
             (carts.customer_id IS NULL AND carts.session_id IS NOT NULL))
    )
);

-- Customer addresses: Users can manage their own addresses
CREATE POLICY "Users can view own addresses" 
ON customer_addresses FOR SELECT 
USING (auth.uid() = customer_id);

CREATE POLICY "Users can manage own addresses" 
ON customer_addresses FOR ALL 
USING (auth.uid() = customer_id);

-- Create admin role function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.jwt() ->> 'role' = 'admin' OR 
        auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
