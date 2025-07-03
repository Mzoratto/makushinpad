-- Seed data for Shin Shop E-commerce
-- This file populates the database with initial product data

-- Insert main shin pad products
INSERT INTO products (id, title, description, handle, status, images, metadata) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
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
    ]',
    '{
        "features": ["Premium materials", "Maximum protection", "Comfortable fit"],
        "production_time": "3-5 business days",
        "weight": "150g",
        "material": "High-density foam with carbon fiber shell"
    }'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
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
    ]',
    '{
        "features": ["Custom design", "High-quality printing", "Durable materials"],
        "production_time": "7-10 business days",
        "weight": "160g",
        "material": "Premium synthetic with custom print overlay",
        "customizable": true
    }'
);

-- Insert product options (Size)
INSERT INTO product_options (id, product_id, name, position) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Size', 1),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Size', 1);

-- Insert option values (Small, Medium, Large)
INSERT INTO product_option_values (id, option_id, value, position) VALUES
-- Professional Shin Pads sizes
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Small', 1),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'Medium', 2),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 'Large', 3),
-- Custom Design Shin Pads sizes
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440002', 'Small', 1),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440002', 'Medium', 2),
('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440002', 'Large', 3);

-- Insert product variants with Czech pricing
INSERT INTO product_variants (id, product_id, title, sku, price, inventory_quantity, weight, metadata) VALUES
-- Professional Shin Pads variants
(
    '850e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'Small',
    'PROF-SHIN-S',
    799.00, -- 799 CZK
    50,
    140.0,
    '{"size": "Small", "dimensions": "18cm x 12cm"}'
),
(
    '850e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    'Medium',
    'PROF-SHIN-M',
    899.00, -- 899 CZK
    75,
    150.0,
    '{"size": "Medium", "dimensions": "20cm x 13cm"}'
),
(
    '850e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440001',
    'Large',
    'PROF-SHIN-L',
    999.00, -- 999 CZK
    40,
    160.0,
    '{"size": "Large", "dimensions": "22cm x 14cm"}'
),
-- Custom Design Shin Pads variants
(
    '850e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440002',
    'Small',
    'CUSTOM-SHIN-S',
    1199.00, -- 1199 CZK (premium for customization)
    25,
    150.0,
    '{"size": "Small", "dimensions": "18cm x 12cm", "customizable": true}'
),
(
    '850e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440002',
    'Medium',
    'CUSTOM-SHIN-M',
    1299.00, -- 1299 CZK
    30,
    160.0,
    '{"size": "Medium", "dimensions": "20cm x 13cm", "customizable": true}'
),
(
    '850e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440002',
    'Large',
    'CUSTOM-SHIN-L',
    1399.00, -- 1399 CZK
    20,
    170.0,
    '{"size": "Large", "dimensions": "22cm x 14cm", "customizable": true}'
);

-- Link variants to option values
INSERT INTO variant_option_values (variant_id, option_value_id) VALUES
-- Professional Shin Pads
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001'), -- Small
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002'), -- Medium
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003'), -- Large
-- Custom Design Shin Pads
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440004'), -- Small
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440005'), -- Medium
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440006'); -- Large

-- Create an admin user (you'll need to update this with real credentials)
-- Note: This is just for development. In production, create admin users through Supabase Auth
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '950e8400-e29b-41d4-a716-446655440000',
    'authenticated',
    'authenticated',
    'admin@shinshop.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "admin", "name": "Admin User"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- Insert admin identity
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
) VALUES (
    '950e8400-e29b-41d4-a716-446655440000',
    '950e8400-e29b-41d4-a716-446655440000',
    '{"sub": "950e8400-e29b-41d4-a716-446655440000", "email": "admin@shinshop.com"}',
    'email',
    NOW(),
    NOW(),
    NOW()
);
