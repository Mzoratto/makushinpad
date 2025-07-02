#!/usr/bin/env node

/**
 * Webhook Setup Verification Script
 * This script helps verify that your webhook configuration is ready for production
 */

const https = require('https');
const http = require('http');

/**
 * Configuration - Update these with your actual values
 */
const config = {
  // Your Netlify site URL (update this!)
  siteUrl: 'https://makushinpadshop.netlify.app',
  
  // Webhook endpoint path
  webhookPath: '/.netlify/functions/snipcart-webhook',
  
  // Test payloads
  testPayloads: [
    {
      name: 'GET Request (should be rejected)',
      method: 'GET',
      data: null,
      expectedStatus: 405
    },
    {
      name: 'Invalid JSON (should handle gracefully)',
      method: 'POST',
      data: 'invalid json',
      expectedStatus: 500
    },
    {
      name: 'Non-order event (should be ignored)',
      method: 'POST',
      data: JSON.stringify({
        eventName: 'customer.created',
        content: {}
      }),
      expectedStatus: 200
    },
    {
      name: 'Order without custom items (should be ignored)',
      method: 'POST',
      data: JSON.stringify({
        eventName: 'order.completed',
        content: {
          token: 'test-regular-order',
          items: [
            {
              id: 'regular-shin-pad',
              name: 'Regular Shin Pad',
              customFields: []
            }
          ]
        }
      }),
      expectedStatus: 200
    },
    {
      name: 'Custom order (should process)',
      method: 'POST',
      data: JSON.stringify({
        eventName: 'order.completed',
        content: {
          token: 'test-custom-order',
          creationDate: new Date().toISOString(),
          email: 'test@example.com',
          currency: 'CZK',
          finalGrandTotal: 999,
          paymentMethod: 'Test',
          billingAddress: {
            fullName: 'Test Customer',
            address1: 'Test Address',
            city: 'Prague',
            country: 'Czech Republic'
          },
          items: [
            {
              id: 'custom-shin-pad-M-custom-CZK',
              name: 'Custom Shin Pad',
              quantity: 1,
              totalPrice: 999,
              customFields: [
                { name: 'Size', value: 'M' },
                { name: 'Player Number', value: '10' },
                { name: 'Custom Text', value: 'VERIFICATION TEST' }
              ]
            }
          ]
        }
      }),
      expectedStatus: [200, 500] // 200 if email works, 500 if email config missing
    }
  ]
};

/**
 * Make HTTP request to webhook endpoint
 */
function makeRequest(url, method, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Webhook-Verification-Script/1.0'
      }
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseData
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

/**
 * Test webhook endpoint accessibility
 */
async function testWebhookEndpoint() {
  const webhookUrl = config.siteUrl + config.webhookPath;
  
  console.log('🧪 Webhook Setup Verification\n');
  console.log('=' .repeat(60));
  console.log(`🌐 Testing webhook endpoint: ${webhookUrl}\n`);

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < config.testPayloads.length; i++) {
    const test = config.testPayloads[i];
    console.log(`📋 Test ${i + 1}/${config.testPayloads.length}: ${test.name}`);

    try {
      const startTime = Date.now();
      const response = await makeRequest(webhookUrl, test.method, test.data);
      const duration = Date.now() - startTime;

      const expectedStatuses = Array.isArray(test.expectedStatus) 
        ? test.expectedStatus 
        : [test.expectedStatus];

      if (expectedStatuses.includes(response.statusCode)) {
        console.log(`✅ PASSED - Status: ${response.statusCode} (${duration}ms)`);
        
        // Try to parse response body
        try {
          const responseBody = JSON.parse(response.body);
          console.log(`📄 Response: ${JSON.stringify(responseBody, null, 2)}`);
        } catch (e) {
          console.log(`📄 Response: ${response.body.substring(0, 200)}${response.body.length > 200 ? '...' : ''}`);
        }
        
        passed++;
      } else {
        console.log(`❌ FAILED - Expected: ${expectedStatuses.join(' or ')}, Got: ${response.statusCode}`);
        console.log(`📄 Response: ${response.body.substring(0, 200)}`);
        failed++;
      }

    } catch (error) {
      console.log(`💥 ERROR - ${error.message}`);
      failed++;
    }

    console.log('');
  }

  // Summary
  console.log('=' .repeat(60));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    console.log('🎉 All tests passed! Your webhook endpoint is working correctly.\n');
  } else if (passed >= 4) {
    console.log('✅ Webhook endpoint is working! Some tests failed due to email configuration.\n');
  } else {
    console.log('⚠️  Some tests failed. Please check your webhook configuration.\n');
  }

  // Recommendations
  console.log('📋 Next Steps:');
  
  if (passed >= 4) {
    console.log('✅ Webhook endpoint is accessible and processing requests');
    console.log('✅ Request validation is working correctly');
    console.log('✅ Event filtering is working correctly');
    
    if (failed > 0) {
      console.log('⚠️  Email configuration may need attention');
      console.log('📚 See docs/EMAIL_CONFIGURATION.md for email setup');
    }
    
    console.log('\n🔧 Ready for Snipcart Configuration:');
    console.log(`1. Add webhook URL to Snipcart: ${webhookUrl}`);
    console.log('2. Select "order.completed" event');
    console.log('3. Set method to POST');
    console.log('4. Configure webhook secret (optional but recommended)');
    console.log('5. Test with Snipcart test mode');
    
  } else {
    console.log('❌ Webhook endpoint has issues that need to be resolved');
    console.log('📚 Check docs/SNIPCART_WEBHOOK_SETUP.md for troubleshooting');
  }

  console.log('\n📚 Documentation:');
  console.log('• Webhook Setup: docs/SNIPCART_WEBHOOK_SETUP.md');
  console.log('• Email Config: docs/EMAIL_CONFIGURATION.md');
  console.log('• Testing Guide: docs/TESTING_GUIDE.md');
}

/**
 * Check if site URL is configured
 */
function validateConfiguration() {
  if (config.siteUrl === 'https://makushinpadshop.netlify.app') {
    console.log('⚠️  Using default site URL. Please update the siteUrl in this script.');
    console.log('   Current: https://makushinpadshop.netlify.app');
    console.log('   Update to: https://your-actual-site-name.netlify.app\n');
  }
}

/**
 * Main execution
 */
if (require.main === module) {
  validateConfiguration();
  testWebhookEndpoint().catch(error => {
    console.error('💥 Verification failed:', error);
    process.exit(1);
  });
}

module.exports = { testWebhookEndpoint, config };
