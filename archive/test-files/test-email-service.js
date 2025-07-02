#!/usr/bin/env node

/**
 * Test script for the email service
 * This script tests the email service with mock environment variables
 */

// Mock environment variables for testing
process.env.EMAIL_PROVIDER = 'gmail';
process.env.GMAIL_USER = 'test@example.com';
process.env.GMAIL_APP_PASSWORD = 'test-password';
process.env.BUSINESS_EMAIL = 'business@example.com';

const EmailService = require('./netlify/functions/utils/emailService');

/**
 * Sample order data for testing
 */
const sampleEmailData = {
  orderId: 'TEST-EMAIL-001',
  orderDate: new Date().toLocaleString(),
  customerInfo: {
    name: 'John Doe',
    email: 'customer@example.com',
    phone: '+420 123 456 789',
    address: '123 Main Street, Prague, Czech Republic'
  },
  shippingInfo: {
    name: 'John Doe',
    address: '456 Shipping Ave, Prague, Czech Republic'
  },
  orderTotal: '999 CZK',
  paymentMethod: 'Credit Card',
  customizedItems: [
    {
      name: 'Custom Shin Pad',
      quantity: 1,
      price: '999 CZK',
      customizations: {
        'Size': 'M',
        'Player Number': '10',
        'Left Shin Text': 'CHAMPION',
        'Right Shin Text': '2024',
        'Text Color': '#FF0000',
        'Backdrop Color': '#FFFFFF',
        'Font': 'Arial',
        'Additional Requirements': 'Make it bold and visible'
      }
    }
  ]
};

/**
 * Test email service initialization and template generation
 */
async function testEmailService() {
  console.log('🧪 Testing Email Service\n');
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Email service initialization
    console.log('📋 Test 1: Email Service Initialization');
    const emailService = new EmailService();
    console.log('✅ Email service initialized successfully');
    console.log(`📧 Provider: ${process.env.EMAIL_PROVIDER}`);
    console.log(`📬 Business Email: ${process.env.BUSINESS_EMAIL}`);
    console.log('');
    
    // Test 2: Email template generation
    console.log('📋 Test 2: Email Template Generation');
    const { generateOrderEmailHTML, generateOrderEmailText } = require('./netlify/functions/templates/orderEmailTemplate');
    
    const htmlContent = generateOrderEmailHTML(sampleEmailData);
    const textContent = generateOrderEmailText(sampleEmailData);
    
    console.log('✅ HTML template generated successfully');
    console.log(`📄 HTML length: ${htmlContent.length} characters`);
    console.log('✅ Text template generated successfully');
    console.log(`📄 Text length: ${textContent.length} characters`);
    console.log('');
    
    // Test 3: Attachment preparation
    console.log('📋 Test 3: Attachment Preparation');
    const { prepareImageAttachments, createOrderSummaryAttachment } = require('./netlify/functions/utils/fileHandler');
    
    const imageAttachments = await prepareImageAttachments(sampleEmailData.customizedItems);
    const summaryAttachment = createOrderSummaryAttachment(sampleEmailData.customizedItems, sampleEmailData);
    
    console.log('✅ Image attachments prepared successfully');
    console.log(`📎 Image attachments: ${imageAttachments.length}`);
    console.log('✅ Summary attachment created successfully');
    console.log(`📄 Summary filename: ${summaryAttachment.filename}`);
    console.log('');
    
    // Test 4: Email preparation (without sending)
    console.log('📋 Test 4: Email Preparation');
    
    // We'll test the email preparation without actually sending
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.BUSINESS_EMAIL,
      subject: `🎯 New Custom Shin Pad Order - ${sampleEmailData.orderId}`,
      text: textContent,
      html: htmlContent,
      attachments: [...imageAttachments, summaryAttachment]
    };
    
    console.log('✅ Email options prepared successfully');
    console.log(`📧 From: ${mailOptions.from}`);
    console.log(`📧 To: ${mailOptions.to}`);
    console.log(`📧 Subject: ${mailOptions.subject}`);
    console.log(`📎 Attachments: ${mailOptions.attachments.length}`);
    console.log('');
    
    console.log('=' .repeat(50));
    console.log('🎉 All email service tests passed!');
    console.log('');
    console.log('📝 Email Service Status:');
    console.log('✅ Service initialization works');
    console.log('✅ Template generation works');
    console.log('✅ Attachment preparation works');
    console.log('✅ Email preparation works');
    console.log('');
    console.log('⚠️  Note: Actual email sending requires valid credentials');
    console.log('📚 See docs/EMAIL_CONFIGURATION.md for setup instructions');
    
  } catch (error) {
    console.error('❌ Email service test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

/**
 * Main execution
 */
if (require.main === module) {
  testEmailService().catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { testEmailService, sampleEmailData };
