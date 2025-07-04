-- Secure Seed Data for Shin Shop E-commerce
-- This file populates the database with initial product data
-- NO HARDCODED CREDENTIALS OR SENSITIVE DATA

-- Clear existing data (development only)
TRUNCATE TABLE variant_option_values CASCADE;
TRUNCATE TABLE product_option_values CASCADE;
TRUNCATE TABLE product_options CASCADE;
TRUNCATE TABLE product_variants CASCADE;
TRUNCATE TABLE products CASCADE;

-- Insert main shin pad products with secure UUIDs
INSERT INTO products (id, title, description, handle, status, images, metadata) VALUES
(
    gen_random_uuid(),
    'Professional Shin Pads',
    'High-quality professional shin pads designed for serious athletes. Made with premium materials for maximum protection and comfort.',
    'professional-shin-pads',
    'published',
    '[
        {
            "url": "/images/products/professional-shin-pads-1.jpg",
            "alt": "Professional Shin Pads - Front View"
        },
        {
            "url": "/images/products/professional-shin-pads-2.jpg",
            "alt": "Professional Shin Pads - Side View"
        }
    ]'::jsonb,
    '{
        "category": "professional",
        "material": "premium",
        "weight": "lightweight",
        "protection_level": "high"
    }'::jsonb
),
(
    gen_random_uuid(),
    'Custom Design Shin Pads',
    'Personalized shin pads with your custom design. Upload your artwork and we will create unique shin pads just for you.',
    'custom-design-shin-pads',
    'published',
    '[
        {
            "url": "/images/products/custom-shin-pads-1.jpg",
            "alt": "Custom Design Shin Pads - Example 1"
        },
        {
            "url": "/images/products/custom-shin-pads-2.jpg",
            "alt": "Custom Design Shin Pads - Example 2"
        }
    ]'::jsonb,
    '{
        "category": "custom",
        "customizable": true,
        "upload_required": true,
        "processing_time": "5-7 days"
    }'::jsonb
);

-- Get product IDs for variants (using variables for clarity)
DO $$
DECLARE
    professional_id UUID;
    custom_id UUID;
    size_option_id UUID;
    small_value_id UUID;
    medium_value_id UUID;
BEGIN
    -- Get product IDs
    SELECT id INTO professional_id FROM products WHERE handle = 'professional-shin-pads';
    SELECT id INTO custom_id FROM products WHERE handle = 'custom-design-shin-pads';

    -- Insert product options (Size)
    INSERT INTO product_options (id, product_id, title) VALUES
    (gen_random_uuid(), professional_id, 'Size'),
    (gen_random_uuid(), custom_id, 'Size');

    -- Get size option IDs
    SELECT id INTO size_option_id FROM product_options WHERE product_id = professional_id AND title = 'Size';

    -- Insert option values
    INSERT INTO product_option_values (id, option_id, value) VALUES
    (gen_random_uuid(), size_option_id, 'Small'),
    (gen_random_uuid(), size_option_id, 'Medium');

    -- Get option value IDs
    SELECT id INTO small_value_id FROM product_option_values WHERE option_id = size_option_id AND value = 'Small';
    SELECT id INTO medium_value_id FROM product_option_values WHERE option_id = size_option_id AND value = 'Medium';

    -- Insert Professional Shin Pads variants
    INSERT INTO product_variants (id, product_id, title, sku, price, inventory_quantity, weight, metadata) VALUES
    (gen_random_uuid(), professional_id, 'Professional Shin Pads - Small', 'PROF-SHIN-S', 799, 50, 200, '{"size": "S"}'::jsonb),
    (gen_random_uuid(), professional_id, 'Professional Shin Pads - Medium', 'PROF-SHIN-M', 899, 50, 250, '{"size": "M"}'::jsonb);

    -- Insert Custom Design Shin Pads variants
    INSERT INTO product_variants (id, product_id, title, sku, price, inventory_quantity, weight, metadata) VALUES
    (gen_random_uuid(), custom_id, 'Custom Design Shin Pads - Small', 'CUSTOM-SHIN-S', 999, 100, 200, '{"size": "S", "customizable": true}'::jsonb),
    (gen_random_uuid(), custom_id, 'Custom Design Shin Pads - Medium', 'CUSTOM-SHIN-M', 999, 100, 250, '{"size": "M", "customizable": true}'::jsonb);

    -- Link variants to option values (Professional)
    INSERT INTO variant_option_values (variant_id, option_value_id)
    SELECT pv.id, small_value_id
    FROM product_variants pv
    WHERE pv.product_id = professional_id AND pv.metadata->>'size' = 'S';

    INSERT INTO variant_option_values (variant_id, option_value_id)
    SELECT pv.id, medium_value_id
    FROM product_variants pv
    WHERE pv.product_id = professional_id AND pv.metadata->>'size' = 'M';

    -- Get custom product option IDs and values
    SELECT id INTO size_option_id FROM product_options WHERE product_id = custom_id AND title = 'Size';
    SELECT id INTO small_value_id FROM product_option_values WHERE option_id = size_option_id AND value = 'Small';
    SELECT id INTO medium_value_id FROM product_option_values WHERE option_id = size_option_id AND value = 'Medium';

    -- Link variants to option values (Custom)
    INSERT INTO variant_option_values (variant_id, option_value_id)
    SELECT pv.id, small_value_id
    FROM product_variants pv
    WHERE pv.product_id = custom_id AND pv.metadata->>'size' = 'S';

    INSERT INTO variant_option_values (variant_id, option_value_id)
    SELECT pv.id, medium_value_id
    FROM product_variants pv
    WHERE pv.product_id = custom_id AND pv.metadata->>'size' = 'M';

END $$;

-- Create sample configuration data (non-sensitive)
INSERT INTO site_config (key, value, description) VALUES
('currency_default', 'CZK', 'Default currency for the store'),
('currency_supported', '["CZK", "EUR"]', 'List of supported currencies'),
('exchange_rate_czk_eur', '25', 'Exchange rate: 25 CZK = 1 EUR'),
('max_cart_items', '99', 'Maximum items per cart'),
('max_upload_size', '52428800', 'Maximum file upload size in bytes (50MB)'),
('store_name', 'The Shin Shop', 'Store display name'),
('store_description', 'Premium shin pads for athletes', 'Store description'),
('contact_email', 'info@shinshop.com', 'Store contact email (public)'),
('processing_time_custom', '5-7', 'Processing time for custom orders in days'),
('shipping_info', 'Free shipping on orders over 1500 CZK', 'Shipping information')
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();

-- Add some sample categories for future use
INSERT INTO categories (id, name, slug, description, metadata) VALUES
(gen_random_uuid(), 'Professional', 'professional', 'High-performance shin pads for serious athletes', '{"priority": 1}'::jsonb),
(gen_random_uuid(), 'Custom', 'custom', 'Personalized shin pads with custom designs', '{"priority": 2}'::jsonb),
(gen_random_uuid(), 'Youth', 'youth', 'Shin pads designed for young players', '{"priority": 3, "coming_soon": true}'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Create admin user placeholder (to be configured manually)
-- NOTE: This creates a placeholder - actual admin credentials should be set manually
INSERT INTO admin_users (id, email, role, status, metadata) VALUES
(gen_random_uuid(), 'admin@example.com', 'admin', 'inactive', '{"note": "Configure this manually with real credentials"}'::jsonb)
ON CONFLICT (email) DO NOTHING;

-- Log the seed operation
INSERT INTO audit_log (table_name, operation, new_data) VALUES
('seed_data', 'SEED', '{"operation": "initial_seed", "timestamp": "' || NOW() || '", "products_created": 2, "variants_created": 4}'::jsonb);

-- Verify data integrity
DO $$
DECLARE
    product_count INTEGER;
    variant_count INTEGER;
    option_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO product_count FROM products WHERE status = 'published';
    SELECT COUNT(*) INTO variant_count FROM product_variants;
    SELECT COUNT(*) INTO option_count FROM product_options;
    
    IF product_count != 2 THEN
        RAISE EXCEPTION 'Expected 2 products, found %', product_count;
    END IF;
    
    IF variant_count != 4 THEN
        RAISE EXCEPTION 'Expected 4 variants, found %', variant_count;
    END IF;
    
    IF option_count != 2 THEN
        RAISE EXCEPTION 'Expected 2 options, found %', option_count;
    END IF;
    
    RAISE NOTICE 'Seed data verification passed: % products, % variants, % options', product_count, variant_count, option_count;
END $$;
