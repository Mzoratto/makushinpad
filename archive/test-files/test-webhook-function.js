#!/usr/bin/env node

/**
 * Test script for the Snipcart webhook function
 * This script simulates webhook calls to test the function locally
 */

const { handler } = require('./netlify/functions/snipcart-webhook');

/**
 * Test cases for the webhook function
 */
const testCases = [
  {
    name: 'GET Request (should be rejected)',
    event: {
      httpMethod: 'GET',
      body: '',
      headers: {}
    },
    expectedStatus: 405
  },
  {
    name: 'Invalid JSON payload',
    event: {
      httpMethod: 'POST',
      body: 'invalid json',
      headers: {}
    },
    expectedStatus: 500
  },
  {
    name: 'Non-order event (should be ignored)',
    event: {
      httpMethod: 'POST',
      body: JSON.stringify({
        eventName: 'customer.created',
        content: {}
      }),
      headers: {}
    },
    expectedStatus: 200
  },
  {
    name: 'Order without custom items',
    event: {
      httpMethod: 'POST',
      body: JSON.stringify({
        eventName: 'order.completed',
        content: {
          token: 'test-order-123',
          items: [
            {
              id: 'regular-product',
              name: 'Regular Shin Pad',
              customFields: []
            }
          ]
        }
      }),
      headers: {}
    },
    expectedStatus: 200
  },
  {
    name: 'Order with custom items (will attempt to send email)',
    event: {
      httpMethod: 'POST',
      body: JSON.stringify({
        eventName: 'order.completed',
        content: {
          token: 'test-custom-order-456',
          creationDate: new Date().toISOString(),
          email: 'test@example.com',
          currency: 'CZK',
          finalGrandTotal: 999,
          paymentMethod: 'Credit Card',
          billingAddress: {
            fullName: 'Test Customer',
            address1: '123 Test St',
            city: 'Prague',
            country: 'Czech Republic',
            phoneNumber: '+420123456789'
          },
          items: [
            {
              id: 'custom-shin-pad-M-custom-CZK',
              name: 'Custom Shin Pad',
              quantity: 1,
              totalPrice: 999,
              currency: 'CZK',
              customFields: [
                { name: 'Size', value: 'M' },
                { name: 'Player Number', value: '10' },
                { name: 'Custom Text', value: 'TEST ORDER' }
              ]
            }
          ]
        }
      }),
      headers: {}
    },
    expectedStatus: 200
  }
];

/**
 * Run webhook function tests
 */
async function runTests() {
  console.log('🧪 Testing Snipcart Webhook Function\n');
  console.log('=' .repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n📋 Test ${i + 1}/${testCases.length}: ${testCase.name}`);
    
    try {
      const result = await handler(testCase.event, {});
      
      if (result.statusCode === testCase.expectedStatus) {
        console.log(`✅ PASSED - Status: ${result.statusCode}`);
        
        // Parse and display response body
        try {
          const responseBody = JSON.parse(result.body);
          console.log(`📄 Response: ${JSON.stringify(responseBody, null, 2)}`);
        } catch (e) {
          console.log(`📄 Response: ${result.body}`);
        }
        
        passed++;
      } else {
        console.log(`❌ FAILED - Expected status: ${testCase.expectedStatus}, Got: ${result.statusCode}`);
        console.log(`📄 Response: ${result.body}`);
        failed++;
      }
      
    } catch (error) {
      console.log(`💥 ERROR - ${error.message}`);
      console.log(`📄 Full error:`, error);
      failed++;
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Webhook function is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
  }
  
  console.log('\n📝 Notes:');
  console.log('- The last test may fail if email configuration is not set up yet');
  console.log('- This is expected and will be resolved in the next tasks');
  console.log('- The webhook function structure and basic logic are being tested here');
}

/**
 * Main execution
 */
if (require.main === module) {
  runTests().catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { runTests, testCases };
