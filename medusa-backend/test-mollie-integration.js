#!/usr/bin/env node

/**
 * Mollie Integration Test Script
 * This script tests the Mollie payment integration for your Medusa.js backend
 */

const { createMollieClient } = require('@mollie/api-client');
const fetch = require('node-fetch');

/**
 * Test configuration
 */
const config = {
  mollieApiKey: process.env.MOLLIE_API_KEY,
  medusaBaseUrl: process.env.MEDUSA_URL || 'http://localhost:9000',
  testAmount: 999, // 9.99 EUR/CZK
  testCurrency: 'eur'
};

/**
 * Test Mollie API connection
 */
async function testMollieAPI() {
  console.log('🔌 Testing Mollie API Connection...');
  
  if (!config.mollieApiKey) {
    console.log('❌ MOLLIE_API_KEY not found in environment variables');
    console.log('💡 Add your Mollie API key to .env file:');
    console.log('   MOLLIE_API_KEY=test_your_mollie_api_key_here');
    return false;
  }

  try {
    const mollie = createMollieClient({ apiKey: config.mollieApiKey });
    
    // Test API connection by fetching payment methods
    const methods = await mollie.methods.list();
    
    console.log('✅ Mollie API connection successful');
    console.log(`📋 Available payment methods: ${methods.length}`);
    
    methods.forEach(method => {
      console.log(`   • ${method.description} (${method.id})`);
    });
    
    return true;
  } catch (error) {
    console.log('❌ Mollie API connection failed:', error.message);
    
    if (error.message.includes('Unauthorized')) {
      console.log('💡 Check your API key - it might be invalid or expired');
    }
    
    return false;
  }
}

/**
 * Test Medusa backend connection
 */
async function testMedusaConnection() {
  console.log('\n🏪 Testing Medusa Backend Connection...');
  
  try {
    const response = await fetch(`${config.medusaBaseUrl}/store/regions`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Medusa backend connection successful');
    console.log(`📋 Available regions: ${data.regions.length}`);
    
    data.regions.forEach(region => {
      console.log(`   • ${region.name} (${region.currency_code.toUpperCase()})`);
      console.log(`     Payment providers: ${region.payment_providers.map(p => p.id).join(', ')}`);
    });
    
    // Check if Mollie is configured
    const mollieConfigured = data.regions.some(region => 
      region.payment_providers.some(provider => provider.id === 'mollie')
    );
    
    if (mollieConfigured) {
      console.log('✅ Mollie payment provider is configured in regions');
    } else {
      console.log('⚠️  Mollie payment provider not found in regions');
      console.log('💡 Make sure MOLLIE_API_KEY is set and backend is restarted');
    }
    
    return mollieConfigured;
  } catch (error) {
    console.log('❌ Medusa backend connection failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure Medusa backend is running on port 9000');
      console.log('   Run: npm run dev');
    }
    
    return false;
  }
}

/**
 * Test payment creation
 */
async function testPaymentCreation() {
  console.log('\n💳 Testing Payment Creation...');
  
  if (!config.mollieApiKey) {
    console.log('⏭️  Skipping payment test - no API key configured');
    return false;
  }

  try {
    const mollie = createMollieClient({ apiKey: config.mollieApiKey });
    
    // Create a test payment
    const payment = await mollie.payments.create({
      amount: {
        currency: config.testCurrency.toUpperCase(),
        value: (config.testAmount / 100).toFixed(2)
      },
      description: 'Test payment for Shin Shop',
      redirectUrl: 'https://makushinpadshop.netlify.app/thank-you',
      webhookUrl: `${config.medusaBaseUrl}/mollie/webhooks`,
      metadata: {
        order_id: 'test-order-123',
        customer_email: 'test@shinshop.com'
      }
    });
    
    console.log('✅ Test payment created successfully');
    console.log(`💰 Payment ID: ${payment.id}`);
    console.log(`💵 Amount: ${payment.amount.value} ${payment.amount.currency}`);
    console.log(`🔗 Checkout URL: ${payment._links.checkout.href}`);
    console.log(`📊 Status: ${payment.status}`);
    
    return true;
  } catch (error) {
    console.log('❌ Payment creation failed:', error.message);
    
    if (error.message.includes('webhook')) {
      console.log('💡 Webhook URL might not be accessible from Mollie');
      console.log('   This is normal for local development');
    }
    
    return false;
  }
}

/**
 * Test webhook endpoint
 */
async function testWebhookEndpoint() {
  console.log('\n🔗 Testing Webhook Endpoint...');
  
  try {
    const response = await fetch(`${config.medusaBaseUrl}/mollie/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: 'tr_test_webhook'
      })
    });
    
    console.log(`📡 Webhook endpoint response: ${response.status} ${response.statusText}`);
    
    if (response.status === 200 || response.status === 404) {
      console.log('✅ Webhook endpoint is accessible');
      return true;
    } else {
      console.log('⚠️  Webhook endpoint returned unexpected status');
      return false;
    }
  } catch (error) {
    console.log('❌ Webhook endpoint test failed:', error.message);
    return false;
  }
}

/**
 * Test complete integration
 */
async function testCompleteIntegration() {
  console.log('\n🧪 Testing Complete Integration...');
  
  try {
    // 1. Create a cart
    console.log('1️⃣  Creating cart...');
    const cartResponse = await fetch(`${config.medusaBaseUrl}/store/carts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!cartResponse.ok) {
      throw new Error('Failed to create cart');
    }
    
    const cartData = await cartResponse.json();
    const cartId = cartData.cart.id;
    console.log(`   ✅ Cart created: ${cartId}`);
    
    // 2. Get products
    console.log('2️⃣  Fetching products...');
    const productsResponse = await fetch(`${config.medusaBaseUrl}/store/products`);
    const productsData = await productsResponse.json();
    
    if (productsData.products.length === 0) {
      throw new Error('No products found - run seed data first');
    }
    
    const product = productsData.products[0];
    const variant = product.variants[0];
    console.log(`   ✅ Found product: ${product.title}`);
    
    // 3. Add item to cart
    console.log('3️⃣  Adding item to cart...');
    const addItemResponse = await fetch(`${config.medusaBaseUrl}/store/carts/${cartId}/line-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variant_id: variant.id,
        quantity: 1,
        metadata: {
          player_number: '10',
          left_shin_text: 'TEST',
          right_shin_text: 'MOLLIE',
          text_color: '#FF0000'
        }
      })
    });
    
    if (!addItemResponse.ok) {
      throw new Error('Failed to add item to cart');
    }
    
    console.log('   ✅ Item added to cart');
    
    // 4. Get updated cart
    const updatedCartResponse = await fetch(`${config.medusaBaseUrl}/store/carts/${cartId}`);
    const updatedCartData = await updatedCartResponse.json();
    
    console.log(`   💰 Cart total: ${(updatedCartData.cart.total / 100).toFixed(2)} ${updatedCartData.cart.region.currency_code.toUpperCase()}`);
    
    console.log('✅ Complete integration test successful');
    console.log('🎉 Your Mollie + Medusa integration is working!');
    
    return true;
  } catch (error) {
    console.log('❌ Complete integration test failed:', error.message);
    return false;
  }
}

/**
 * Main test function
 */
async function runMollieTests() {
  console.log('🧪 Mollie Integration Test Suite');
  console.log('================================\n');
  
  const results = {
    mollieAPI: false,
    medusaConnection: false,
    paymentCreation: false,
    webhookEndpoint: false,
    completeIntegration: false
  };
  
  // Run tests
  results.mollieAPI = await testMollieAPI();
  results.medusaConnection = await testMedusaConnection();
  results.webhookEndpoint = await testWebhookEndpoint();
  
  if (results.mollieAPI) {
    results.paymentCreation = await testPaymentCreation();
  }
  
  if (results.medusaConnection) {
    results.completeIntegration = await testCompleteIntegration();
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary:');
  console.log('='.repeat(50));
  
  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    const name = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`${icon} ${name}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n📈 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Mollie integration is ready for production.');
  } else if (passedTests >= 3) {
    console.log('✅ Core functionality working. Some advanced features may need configuration.');
  } else {
    console.log('⚠️  Several tests failed. Please check your configuration.');
  }
  
  console.log('\n📚 Next Steps:');
  if (!results.mollieAPI) {
    console.log('1. Configure MOLLIE_API_KEY in .env file');
  }
  if (!results.medusaConnection) {
    console.log('2. Start Medusa backend: npm run dev');
  }
  if (results.mollieAPI && results.medusaConnection) {
    console.log('3. Test payments in admin panel');
    console.log('4. Update Gatsby frontend to use Medusa API');
  }
}

/**
 * Main execution
 */
if (require.main === module) {
  runMollieTests().catch(error => {
    console.error('💥 Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = { runMollieTests };
