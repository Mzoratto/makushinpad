#!/usr/bin/env node

/**
 * Test script for email notification system
 * This script helps test the email functionality without going through Snipcart
 * 
 * Usage:
 * node test-email-notification.js
 */

const path = require('path');

// Mock environment variables for testing (replace with your actual values)
const testEnvVars = {
  EMAIL_PROVIDER: 'gmail', // or 'smtp'
  GMAIL_USER: 'your-business-email@gmail.com',
  GMAIL_APP_PASSWORD: 'your-gmail-app-password',
  BUSINESS_EMAIL: 'your-business-email@gmail.com',
  BUSINESS_CC_EMAIL: '', // optional
  
  // Alternative SMTP configuration (if not using Gmail)
  // SMTP_HOST: 'smtp.your-provider.com',
  // SMTP_PORT: '587',
  // SMTP_SECURE: 'false',
  // SMTP_USER: 'your-smtp-username',
  // SMTP_PASSWORD: 'your-smtp-password',
};

// Set environment variables for testing
Object.keys(testEnvVars).forEach(key => {
  if (testEnvVars[key] && !process.env[key]) {
    process.env[key] = testEnvVars[key];
  }
});

// Import the email service
const EmailService = require('./netlify/functions/utils/emailService');

/**
 * Sample test data that mimics a real custom order
 */
const sampleOrderData = {
  orderId: `TEST-${Date.now()}`,
  orderDate: new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }),
  customerInfo: {
    name: 'John Doe',
    email: 'customer@example.com',
    phone: '+420 123 456 789',
    address: '123 Main Street, Prague 1, 110 00, Czech Republic'
  },
  shippingInfo: {
    name: 'John Doe',
    address: '456 Shipping Avenue, Prague 2, 120 00, Czech Republic'
  },
  orderTotal: '1,124 CZK',
  paymentMethod: 'Credit Card (Visa ending in 1234)',
  customizedItems: [
    {
      name: 'Custom Shin Pad - Premium',
      quantity: 1,
      price: '999 CZK',
      customizations: {
        'Size': 'M',
        'Player Number': '10',
        'Left Shin Text': 'CHAMPION',
        'Right Shin Text': '2024',
        'Additional Text': 'NEVER GIVE UP',
        'Text Color': '#FF0000',
        'Text Font': 'Arial Bold',
        'Backdrop Color': '#FFFFFF',
        'Additional Requirements': 'Please make the text extra bold and ensure high contrast. This is for a professional player.',
        'Uploaded Image': 'team-logo.png'
      }
    },
    {
      name: 'Custom Shin Pad - Standard',
      quantity: 1,
      price: '125 CZK',
      customizations: {
        'Size': 'S',
        'Player Number': '7',
        'Left Shin Text': 'ROOKIE',
        'Right Shin Text': 'YEAR 1',
        'Text Color': '#0000FF',
        'Text Font': 'Times New Roman',
        'Backdrop Color': '#F0F0F0',
        'Additional Requirements': 'Simple design for youth player'
      }
    }
  ]
};

/**
 * Test scenarios
 */
const testScenarios = [
  {
    name: 'Basic Order Test',
    description: 'Test with standard customization data',
    data: sampleOrderData
  },
  {
    name: 'Minimal Order Test',
    description: 'Test with minimal customization data',
    data: {
      orderId: `MIN-TEST-${Date.now()}`,
      orderDate: new Date().toLocaleString(),
      customerInfo: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: 'Not provided',
        address: 'Basic Address, Prague, Czech Republic'
      },
      orderTotal: '799 CZK',
      paymentMethod: 'PayPal',
      customizedItems: [
        {
          name: 'Basic Custom Shin Pad',
          quantity: 1,
          price: '799 CZK',
          customizations: {
            'Size': 'L',
            'Player Number': '99'
          }
        }
      ]
    }
  },
  {
    name: 'Complex Order Test',
    description: 'Test with multiple items and complex customizations',
    data: {
      ...sampleOrderData,
      orderId: `COMPLEX-TEST-${Date.now()}`,
      orderTotal: '2,247 CZK',
      customizedItems: [
        ...sampleOrderData.customizedItems,
        {
          name: 'Custom Shin Pad - Deluxe',
          quantity: 2,
          price: '1,248 CZK',
          customizations: {
            'Size': 'XL',
            'Player Number': '1',
            'Left Shin Text': 'CAPTAIN',
            'Right Shin Text': 'LEADER',
            'Additional Text': 'TEAM SPIRIT',
            'Text Color': '#FFD700',
            'Text Font': 'Impact',
            'Backdrop Color': '#000080',
            'Additional Requirements': 'Gold text on navy background, maximum impact design for team captain',
            'Uploaded Image': 'captain-badge.svg'
          }
        }
      ]
    }
  }
];

/**
 * Main test function
 */
async function runTests() {
  console.log('🧪 Starting Email Notification Tests\n');
  console.log('=' .repeat(50));
  
  // Check environment variables
  console.log('📋 Checking Configuration...');
  const requiredVars = ['EMAIL_PROVIDER', 'BUSINESS_EMAIL'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    console.error('Please update the testEnvVars object in this script with your actual values.');
    process.exit(1);
  }
  
  if (process.env.EMAIL_PROVIDER === 'gmail') {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('❌ Gmail configuration incomplete. Need GMAIL_USER and GMAIL_APP_PASSWORD.');
      process.exit(1);
    }
  } else if (process.env.EMAIL_PROVIDER === 'smtp') {
    const smtpVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD'];
    const missingSmtpVars = smtpVars.filter(varName => !process.env[varName]);
    if (missingSmtpVars.length > 0) {
      console.error('❌ SMTP configuration incomplete. Missing:', missingSmtpVars.join(', '));
      process.exit(1);
    }
  }
  
  console.log('✅ Configuration looks good!');
  console.log(`📧 Email Provider: ${process.env.EMAIL_PROVIDER}`);
  console.log(`📬 Business Email: ${process.env.BUSINESS_EMAIL}`);
  console.log('');
  
  // Initialize email service
  let emailService;
  try {
    emailService = new EmailService();
    console.log('✅ Email service initialized successfully\n');
  } catch (error) {
    console.error('❌ Failed to initialize email service:', error.message);
    process.exit(1);
  }
  
  // Run test scenarios
  for (let i = 0; i < testScenarios.length; i++) {
    const scenario = testScenarios[i];
    console.log(`🧪 Test ${i + 1}/${testScenarios.length}: ${scenario.name}`);
    console.log(`📝 ${scenario.description}`);
    
    try {
      const startTime = Date.now();
      await emailService.sendCustomOrderNotification(scenario.data);
      const duration = Date.now() - startTime;
      
      console.log(`✅ Test passed! Email sent in ${duration}ms`);
      console.log(`📧 Check your email for order: ${scenario.data.orderId}`);
      
    } catch (error) {
      console.error(`❌ Test failed:`, error.message);
      console.error('Full error:', error);
    }
    
    console.log('');
    
    // Wait between tests to avoid rate limiting
    if (i < testScenarios.length - 1) {
      console.log('⏳ Waiting 2 seconds before next test...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('=' .repeat(50));
  console.log('🎉 All tests completed!');
  console.log('');
  console.log('📋 Next Steps:');
  console.log('1. Check your email inbox for test notifications');
  console.log('2. Verify email formatting and content');
  console.log('3. Test webhook integration with Snipcart');
  console.log('4. Configure production environment variables');
  console.log('');
  console.log('📚 For more information, see:');
  console.log('- docs/EMAIL_CONFIGURATION.md');
  console.log('- docs/WEBHOOK_SETUP.md');
  console.log('- docs/TESTING_GUIDE.md');
}

/**
 * Handle script execution
 */
if (require.main === module) {
  // Check if required files exist
  const requiredFiles = [
    './netlify/functions/utils/emailService.js',
    './netlify/functions/templates/orderEmailTemplate.js'
  ];
  
  const missingFiles = requiredFiles.filter(file => {
    try {
      require.resolve(file);
      return false;
    } catch (e) {
      return true;
    }
  });
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:', missingFiles.join(', '));
    console.error('Please ensure all email notification files are in place.');
    process.exit(1);
  }
  
  // Run tests
  runTests().catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { runTests, testScenarios, sampleOrderData };
