#!/usr/bin/env node

/**
 * Product Management Script for Shin Shop
 * This script helps you manage your shin pad product catalog
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

/**
 * Configuration
 */
const config = {
  medusaBaseUrl: process.env.MEDUSA_URL || 'http://localhost:9000',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@shinshop.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'supersecret'
};

/**
 * Create readline interface
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Prompt user for input
 */
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Authenticate with Medusa admin
 */
async function authenticateAdmin() {
  try {
    const response = await fetch(`${config.medusaBaseUrl}/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: config.adminEmail,
        password: config.adminPassword
      })
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('❌ Admin authentication failed:', error.message);
    throw error;
  }
}

/**
 * Get all products
 */
async function getProducts() {
  try {
    const response = await fetch(`${config.medusaBaseUrl}/store/products`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('❌ Failed to fetch products:', error.message);
    throw error;
  }
}

/**
 * Display product catalog
 */
function displayProducts(products) {
  console.log('\n📦 Current Product Catalog:');
  console.log('=' .repeat(80));

  if (products.length === 0) {
    console.log('No products found. Run seed data first: npm run seed');
    return;
  }

  products.forEach((product, index) => {
    const metadata = product.metadata || {};
    const tier = metadata.tier || 'unknown';
    const customizable = metadata.customizable ? '🎨' : '📦';
    
    console.log(`\n${index + 1}. ${customizable} ${product.title}`);
    console.log(`   Handle: ${product.handle}`);
    console.log(`   Tier: ${tier.toUpperCase()}`);
    console.log(`   Status: ${product.status}`);
    console.log(`   Variants: ${product.variants?.length || 0}`);
    
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants[0].prices || [];
      const czkPrice = prices.find(p => p.currency_code === 'czk');
      const eurPrice = prices.find(p => p.currency_code === 'eur');
      
      if (czkPrice) {
        console.log(`   Price: ${(czkPrice.amount / 100).toFixed(2)} CZK`);
      }
      if (eurPrice) {
        console.log(`   Price: ${(eurPrice.amount / 100).toFixed(2)} EUR`);
      }
    }
    
    if (metadata.custom_fields) {
      console.log(`   Custom Fields: ${metadata.custom_fields.length}`);
    }
  });
}

/**
 * Display product details
 */
function displayProductDetails(product) {
  const metadata = product.metadata || {};
  
  console.log('\n📋 Product Details:');
  console.log('=' .repeat(50));
  console.log(`Title: ${product.title}`);
  console.log(`Subtitle: ${product.subtitle || 'N/A'}`);
  console.log(`Handle: ${product.handle}`);
  console.log(`Status: ${product.status}`);
  console.log(`Description: ${product.description || 'N/A'}`);
  
  console.log('\n🏷️  Metadata:');
  console.log(`Customizable: ${metadata.customizable ? 'Yes' : 'No'}`);
  console.log(`Tier: ${metadata.tier || 'N/A'}`);
  console.log(`Protection Level: ${metadata.protection_level || 'N/A'}`);
  console.log(`Production Time: ${metadata.production_time || 'N/A'}`);
  
  if (metadata.custom_fields) {
    console.log('\n🎨 Custom Fields:');
    metadata.custom_fields.forEach(field => {
      console.log(`  • ${field}`);
    });
  }
  
  if (metadata.features) {
    console.log('\n✨ Features:');
    metadata.features.forEach(feature => {
      console.log(`  • ${feature}`);
    });
  }
  
  console.log('\n📏 Variants:');
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(variant => {
      console.log(`  • ${variant.title}`);
      console.log(`    SKU: ${variant.sku}`);
      console.log(`    Inventory: ${variant.inventory_quantity}`);
      
      if (variant.prices) {
        variant.prices.forEach(price => {
          console.log(`    Price: ${(price.amount / 100).toFixed(2)} ${price.currency_code.toUpperCase()}`);
        });
      }
    });
  } else {
    console.log('  No variants found');
  }
}

/**
 * Load enhanced catalog
 */
async function loadEnhancedCatalog() {
  try {
    console.log('📦 Loading enhanced shin pad catalog...');
    
    const catalogPath = path.join(__dirname, 'data', 'enhanced-shin-pad-catalog.json');
    
    if (!fs.existsSync(catalogPath)) {
      throw new Error('Enhanced catalog file not found');
    }
    
    const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    
    console.log(`✅ Found ${catalogData.products.length} enhanced products`);
    console.log('\n📋 Enhanced Products:');
    
    catalogData.products.forEach((product, index) => {
      const metadata = product.metadata || {};
      console.log(`${index + 1}. ${product.title} (${metadata.tier || 'unknown'} tier)`);
      console.log(`   Variants: ${product.variants?.length || 0}`);
      console.log(`   Custom Fields: ${metadata.custom_fields?.length || 0}`);
    });
    
    return catalogData.products;
  } catch (error) {
    console.error('❌ Failed to load enhanced catalog:', error.message);
    throw error;
  }
}

/**
 * Compare pricing across tiers
 */
function comparePricing(products) {
  console.log('\n💰 Pricing Comparison:');
  console.log('=' .repeat(60));
  
  const tiers = ['youth', 'standard', 'premium', 'professional'];
  
  tiers.forEach(tier => {
    const tierProducts = products.filter(p => p.metadata?.tier === tier);
    
    if (tierProducts.length > 0) {
      const product = tierProducts[0];
      const variant = product.variants?.[0];
      
      if (variant?.prices) {
        const czkPrice = variant.prices.find(p => p.currency_code === 'czk');
        const eurPrice = variant.prices.find(p => p.currency_code === 'eur');
        
        console.log(`${tier.toUpperCase().padEnd(12)} | ${czkPrice ? (czkPrice.amount / 100).toFixed(2) + ' CZK' : 'N/A'.padEnd(10)} | ${eurPrice ? (eurPrice.amount / 100).toFixed(2) + ' EUR' : 'N/A'}`);
      }
    }
  });
}

/**
 * Analyze customization options
 */
function analyzeCustomization(products) {
  console.log('\n🎨 Customization Analysis:');
  console.log('=' .repeat(60));
  
  const allCustomFields = new Set();
  const tierCustomization = {};
  
  products.forEach(product => {
    const metadata = product.metadata || {};
    const tier = metadata.tier || 'unknown';
    const customFields = metadata.custom_fields || [];
    
    customFields.forEach(field => allCustomFields.add(field));
    
    if (!tierCustomization[tier]) {
      tierCustomization[tier] = new Set();
    }
    customFields.forEach(field => tierCustomization[tier].add(field));
  });
  
  console.log(`Total unique custom fields: ${allCustomFields.size}`);
  console.log('\nCustom fields by tier:');
  
  Object.entries(tierCustomization).forEach(([tier, fields]) => {
    console.log(`\n${tier.toUpperCase()}:`);
    Array.from(fields).forEach(field => {
      console.log(`  • ${field}`);
    });
  });
}

/**
 * Main menu
 */
async function showMainMenu() {
  console.log('\n🛍️  Shin Shop Product Management');
  console.log('=' .repeat(40));
  console.log('1. View current products');
  console.log('2. View product details');
  console.log('3. Load enhanced catalog');
  console.log('4. Compare pricing');
  console.log('5. Analyze customization');
  console.log('6. Exit');
  console.log('');
  
  const choice = await prompt('Select an option (1-6): ');
  return choice;
}

/**
 * Main function
 */
async function main() {
  console.log('🎯 Shin Shop Product Management Tool\n');
  
  try {
    // Test connection to Medusa
    console.log('🔌 Testing connection to Medusa backend...');
    const products = await getProducts();
    console.log(`✅ Connected successfully. Found ${products.length} products.`);
    
    let running = true;
    
    while (running) {
      const choice = await showMainMenu();
      
      switch (choice) {
        case '1':
          const currentProducts = await getProducts();
          displayProducts(currentProducts);
          break;
          
        case '2':
          const allProducts = await getProducts();
          if (allProducts.length === 0) {
            console.log('❌ No products found');
            break;
          }
          
          console.log('\nSelect a product:');
          allProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.title}`);
          });
          
          const productIndex = await prompt('\nEnter product number: ');
          const selectedProduct = allProducts[parseInt(productIndex) - 1];
          
          if (selectedProduct) {
            displayProductDetails(selectedProduct);
          } else {
            console.log('❌ Invalid product selection');
          }
          break;
          
        case '3':
          const enhancedProducts = await loadEnhancedCatalog();
          comparePricing(enhancedProducts);
          analyzeCustomization(enhancedProducts);
          break;
          
        case '4':
          const pricingProducts = await getProducts();
          if (pricingProducts.length > 0) {
            comparePricing(pricingProducts);
          } else {
            console.log('❌ No products found for pricing comparison');
          }
          break;
          
        case '5':
          const customProducts = await getProducts();
          if (customProducts.length > 0) {
            analyzeCustomization(customProducts);
          } else {
            console.log('❌ No products found for customization analysis');
          }
          break;
          
        case '6':
          running = false;
          console.log('👋 Goodbye!');
          break;
          
        default:
          console.log('❌ Invalid option. Please try again.');
      }
      
      if (running) {
        await prompt('\nPress Enter to continue...');
      }
    }
    
  } catch (error) {
    console.error('💥 Application error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Make sure Medusa backend is running: npm run dev');
    }
  } finally {
    rl.close();
  }
}

/**
 * Main execution
 */
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

module.exports = { main };
