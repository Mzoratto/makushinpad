#!/usr/bin/env node

/**
 * Test Supabase Connection for Shin Shop
 * This script tests the database connection and verifies the product data
 */

require('dotenv').config({ path: '.env.development' });
const { createClient } = require('@supabase/supabase-js');

console.log('🧪 Testing Supabase Connection');
console.log('===============================\n');

// Check environment variables
const supabaseUrl = process.env.GATSBY_SUPABASE_URL;
const supabaseKey = process.env.GATSBY_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('   Make sure .env.development is configured correctly');
  process.exit(1);
}

console.log('🔧 Configuration:');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);
console.log('');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test 1: Fetch products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'published');

    if (productsError) {
      throw new Error(`Products query failed: ${productsError.message}`);
    }

    console.log(`✅ Products table: Found ${products.length} published products`);
    products.forEach(product => {
      console.log(`   - ${product.title} (${product.handle})`);
    });
    console.log('');

    // Test 2: Fetch product variants with pricing
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select(`
        *,
        product:products(title)
      `);

    if (variantsError) {
      throw new Error(`Variants query failed: ${variantsError.message}`);
    }

    console.log(`✅ Product variants: Found ${variants.length} variants`);
    variants.forEach(variant => {
      console.log(`   - ${variant.product.title} - ${variant.title}: ${variant.price} CZK`);
    });
    console.log('');

    // Test 3: Test product options
    const { data: options, error: optionsError } = await supabase
      .from('product_options')
      .select(`
        *,
        values:product_option_values(*)
      `);

    if (optionsError) {
      throw new Error(`Options query failed: ${optionsError.message}`);
    }

    console.log(`✅ Product options: Found ${options.length} option types`);
    options.forEach(option => {
      console.log(`   - ${option.name}: ${option.values.map(v => v.value).join(', ')}`);
    });
    console.log('');

    // Test 4: Test variant-option relationships
    const { data: relationships, error: relationshipsError } = await supabase
      .from('variant_option_values')
      .select('*');

    if (relationshipsError) {
      throw new Error(`Relationships query failed: ${relationshipsError.message}`);
    }

    console.log(`✅ Variant-option relationships: Found ${relationships.length} links`);
    console.log('');

    console.log('🎉 All tests passed! Supabase is configured correctly.');
    console.log('');
    console.log('📋 Summary:');
    console.log(`   - ${products.length} products ready for sale`);
    console.log(`   - ${variants.length} product variants with pricing`);
    console.log(`   - ${options.length} product option types`);
    console.log(`   - ${relationships.length} variant-option relationships`);
    console.log('');
    console.log('🚀 Ready to start development!');
    console.log('   Run: npm run develop');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   1. Check your .env.development file');
    console.error('   2. Verify your Supabase project is active');
    console.error('   3. Make sure all SQL migrations were run successfully');
    process.exit(1);
  }
}

testConnection();
