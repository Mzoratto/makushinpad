#!/usr/bin/env node

/**
 * Enhanced Product Seeding Script
 * This script loads the enhanced shin pad catalog into your Medusa backend
 */

const fs = require('fs');
const path = require('path');

/**
 * Load and merge enhanced products with existing seed data
 */
function createEnhancedSeedData() {
  try {
    console.log('📦 Creating enhanced seed data...');
    
    // Load base seed data
    const baseSeedPath = path.join(__dirname, 'data', 'seed.json');
    const baseSeed = JSON.parse(fs.readFileSync(baseSeedPath, 'utf8'));
    
    // Load enhanced catalog
    const enhancedCatalogPath = path.join(__dirname, 'data', 'enhanced-shin-pad-catalog.json');
    const enhancedCatalog = JSON.parse(fs.readFileSync(enhancedCatalogPath, 'utf8'));
    
    // Replace products in base seed with enhanced products
    const enhancedSeed = {
      ...baseSeed,
      products: enhancedCatalog.products
    };
    
    // Save enhanced seed data
    const enhancedSeedPath = path.join(__dirname, 'data', 'seed-enhanced.json');
    fs.writeFileSync(enhancedSeedPath, JSON.stringify(enhancedSeed, null, 2));
    
    console.log('✅ Enhanced seed data created successfully');
    console.log(`📄 File: ${enhancedSeedPath}`);
    console.log(`📦 Products: ${enhancedCatalog.products.length}`);
    
    // Display product summary
    console.log('\n📋 Product Summary:');
    enhancedCatalog.products.forEach((product, index) => {
      const metadata = product.metadata || {};
      const tier = metadata.tier || 'unknown';
      const variants = product.variants?.length || 0;
      const customFields = metadata.custom_fields?.length || 0;
      
      console.log(`${index + 1}. ${product.title}`);
      console.log(`   Tier: ${tier.toUpperCase()}`);
      console.log(`   Variants: ${variants}`);
      console.log(`   Custom Fields: ${customFields}`);
      
      // Show pricing
      if (product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0];
        const czkPrice = firstVariant.prices?.find(p => p.currency_code === 'czk');
        const eurPrice = firstVariant.prices?.find(p => p.currency_code === 'eur');
        
        if (czkPrice) {
          console.log(`   Price: ${(czkPrice.amount / 100).toFixed(2)} CZK`);
        }
        if (eurPrice) {
          console.log(`   Price: ${(eurPrice.amount / 100).toFixed(2)} EUR`);
        }
      }
      console.log('');
    });
    
    return enhancedSeedPath;
    
  } catch (error) {
    console.error('❌ Failed to create enhanced seed data:', error.message);
    throw error;
  }
}

/**
 * Validate product data
 */
function validateProducts(products) {
  console.log('🔍 Validating product data...');
  
  const errors = [];
  const warnings = [];
  
  products.forEach((product, index) => {
    const productNum = index + 1;
    
    // Required fields
    if (!product.title) {
      errors.push(`Product ${productNum}: Missing title`);
    }
    
    if (!product.handle) {
      errors.push(`Product ${productNum}: Missing handle`);
    }
    
    if (!product.variants || product.variants.length === 0) {
      errors.push(`Product ${productNum}: No variants defined`);
    }
    
    // Validate variants
    if (product.variants) {
      product.variants.forEach((variant, vIndex) => {
        if (!variant.sku) {
          errors.push(`Product ${productNum}, Variant ${vIndex + 1}: Missing SKU`);
        }
        
        if (!variant.prices || variant.prices.length === 0) {
          errors.push(`Product ${productNum}, Variant ${vIndex + 1}: No prices defined`);
        }
        
        // Check for both CZK and EUR prices
        if (variant.prices) {
          const hasCZK = variant.prices.some(p => p.currency_code === 'czk');
          const hasEUR = variant.prices.some(p => p.currency_code === 'eur');
          
          if (!hasCZK) {
            warnings.push(`Product ${productNum}, Variant ${vIndex + 1}: Missing CZK price`);
          }
          
          if (!hasEUR) {
            warnings.push(`Product ${productNum}, Variant ${vIndex + 1}: Missing EUR price`);
          }
        }
      });
    }
    
    // Validate customization metadata
    const metadata = product.metadata || {};
    
    if (metadata.customizable && (!metadata.custom_fields || metadata.custom_fields.length === 0)) {
      warnings.push(`Product ${productNum}: Marked as customizable but no custom fields defined`);
    }
    
    if (metadata.custom_fields && metadata.custom_fields.includes('size') && !product.options?.some(opt => opt.title === 'Size')) {
      warnings.push(`Product ${productNum}: Has size custom field but no Size option`);
    }
  });
  
  // Display validation results
  if (errors.length > 0) {
    console.log('❌ Validation Errors:');
    errors.forEach(error => console.log(`  • ${error}`));
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  Validation Warnings:');
    warnings.forEach(warning => console.log(`  • ${warning}`));
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All products validated successfully');
  }
  
  return { errors, warnings };
}

/**
 * Generate product statistics
 */
function generateStatistics(products) {
  console.log('\n📊 Product Statistics:');
  console.log('=' .repeat(40));
  
  // Count by tier
  const tierCounts = {};
  const sizeCounts = {};
  const customFieldCounts = {};
  
  let totalVariants = 0;
  let totalCustomFields = 0;
  let customizableProducts = 0;
  
  products.forEach(product => {
    const metadata = product.metadata || {};
    const tier = metadata.tier || 'unknown';
    
    // Count tiers
    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    
    // Count variants and sizes
    if (product.variants) {
      totalVariants += product.variants.length;
      
      product.variants.forEach(variant => {
        const sizeOption = variant.options?.find(opt => opt.value);
        if (sizeOption) {
          const size = sizeOption.value;
          sizeCounts[size] = (sizeCounts[size] || 0) + 1;
        }
      });
    }
    
    // Count custom fields
    if (metadata.custom_fields) {
      totalCustomFields += metadata.custom_fields.length;
      
      metadata.custom_fields.forEach(field => {
        customFieldCounts[field] = (customFieldCounts[field] || 0) + 1;
      });
    }
    
    if (metadata.customizable) {
      customizableProducts++;
    }
  });
  
  console.log(`Total Products: ${products.length}`);
  console.log(`Total Variants: ${totalVariants}`);
  console.log(`Customizable Products: ${customizableProducts}`);
  console.log(`Average Custom Fields per Product: ${(totalCustomFields / products.length).toFixed(1)}`);
  
  console.log('\nProducts by Tier:');
  Object.entries(tierCounts).forEach(([tier, count]) => {
    console.log(`  ${tier.toUpperCase()}: ${count}`);
  });
  
  console.log('\nVariants by Size:');
  Object.entries(sizeCounts).sort().forEach(([size, count]) => {
    console.log(`  ${size}: ${count}`);
  });
  
  console.log('\nMost Common Custom Fields:');
  Object.entries(customFieldCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([field, count]) => {
      console.log(`  ${field}: ${count} products`);
    });
}

/**
 * Main function
 */
async function main() {
  console.log('🎯 Enhanced Product Seeding for Shin Shop\n');
  
  try {
    // Create enhanced seed data
    const enhancedSeedPath = createEnhancedSeedData();
    
    // Load and validate the enhanced data
    const enhancedSeed = JSON.parse(fs.readFileSync(enhancedSeedPath, 'utf8'));
    const validation = validateProducts(enhancedSeed.products);
    
    if (validation.errors.length > 0) {
      console.log('\n❌ Cannot proceed with seeding due to validation errors');
      console.log('Please fix the errors and try again');
      return;
    }
    
    // Generate statistics
    generateStatistics(enhancedSeed.products);
    
    console.log('\n🚀 Ready to Seed Enhanced Products');
    console.log('=' .repeat(50));
    console.log('To load these products into your Medusa backend:');
    console.log('');
    console.log('1. Make sure your backend is running:');
    console.log('   npm run dev');
    console.log('');
    console.log('2. Run the enhanced seed command:');
    console.log('   npm run seed -- -f ./data/seed-enhanced.json');
    console.log('');
    console.log('3. Or use the standard seed with enhanced data:');
    console.log('   cp data/seed-enhanced.json data/seed.json');
    console.log('   npm run seed');
    console.log('');
    console.log('4. Verify products in admin panel:');
    console.log('   http://localhost:7001');
    console.log('');
    
    if (validation.warnings.length > 0) {
      console.log('⚠️  Note: There are validation warnings above');
      console.log('These won\'t prevent seeding but should be reviewed');
    }
    
  } catch (error) {
    console.error('💥 Seeding preparation failed:', error.message);
    process.exit(1);
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

module.exports = { createEnhancedSeedData, validateProducts, generateStatistics };
