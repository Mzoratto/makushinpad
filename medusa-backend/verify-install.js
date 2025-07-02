#!/usr/bin/env node

/**
 * Verify Installation Script
 * Checks that all required dependencies are installed correctly
 */

console.log('🔍 Verifying Medusa.js installation...');

const requiredPackages = [
  '@medusajs/medusa',
  '@medusajs/admin',
  'medusa-fulfillment-manual',
  'medusa-interfaces',
  'medusa-payment-stripe',
  '@mollie/api-client',
  'express',
  'cors',
  'dotenv',
  'typeorm'
];

const problematicPackages = [
  'medusa-payment-mollie'
];

let allGood = true;

console.log('\n✅ Checking required packages...');
for (const pkg of requiredPackages) {
  try {
    require.resolve(pkg);
    console.log(`✅ ${pkg} - OK`);
  } catch (error) {
    console.log(`❌ ${pkg} - MISSING`);
    allGood = false;
  }
}

console.log('\n🚫 Checking for problematic packages...');
for (const pkg of problematicPackages) {
  try {
    require.resolve(pkg);
    console.log(`❌ ${pkg} - FOUND (should not be installed)`);
    allGood = false;
  } catch (error) {
    console.log(`✅ ${pkg} - NOT FOUND (good)`);
  }
}

console.log('\n📋 Installation Summary:');
if (allGood) {
  console.log('✅ All checks passed! Installation is clean and ready.');
  process.exit(0);
} else {
  console.log('❌ Some issues found. Check the output above.');
  process.exit(1);
}
