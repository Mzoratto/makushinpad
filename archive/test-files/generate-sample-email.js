#!/usr/bin/env node

/**
 * Generate a sample email to preview the template design
 */

const { generateOrderEmailHTML, generateOrderEmailText } = require('./netlify/functions/templates/orderEmailTemplate');
const fs = require('fs');

// Sample order data that represents a typical custom shin pad order
const sampleOrderData = {
  orderId: 'SHIN-2024-001',
  orderDate: 'January 15, 2024 at 2:30 PM CET',
  customerInfo: {
    name: 'Jan Novák',
    email: 'jan.novak@email.cz',
    phone: '+420 123 456 789',
    address: 'Wenceslas Square 1, Prague 1, 110 00, Czech Republic'
  },
  shippingInfo: {
    name: 'Jan Novák',
    address: 'Sportovní 15, Prague 6, 160 00, Czech Republic'
  },
  orderTotal: '1,124 CZK',
  paymentMethod: 'Credit Card (Visa ending in 4242)',
  customizedItems: [
    {
      name: 'Custom Shin Pad - Premium',
      quantity: 1,
      price: '999 CZK',
      customizations: {
        'Size': 'M',
        'Player Number': '10',
        'Left Shin Text': 'SPARTA',
        'Right Shin Text': 'PRAHA',
        'Additional Text': 'NEVER GIVE UP',
        'Text Color': '#DC143C',
        'Text Font': 'Arial Bold',
        'Backdrop Color': '#FFFFFF',
        'Additional Requirements': 'Please make the text extra bold and ensure high contrast. This is for a professional player in the Czech First League.',
        'Uploaded Image': 'sparta-logo.png'
      }
    },
    {
      name: 'Custom Shin Pad - Youth',
      quantity: 1,
      price: '125 CZK',
      customizations: {
        'Size': 'S',
        'Player Number': '7',
        'Left Shin Text': 'JUNIOR',
        'Right Shin Text': '2024',
        'Text Color': '#0066CC',
        'Text Font': 'Times New Roman',
        'Backdrop Color': '#F0F8FF',
        'Additional Requirements': 'Simple design for youth player, age 12'
      }
    }
  ]
};

/**
 * Generate and save sample emails
 */
function generateSampleEmails() {
  console.log('📧 Generating Sample Email Templates\n');
  
  try {
    // Generate HTML email
    console.log('🎨 Generating HTML email...');
    const htmlContent = generateOrderEmailHTML(sampleOrderData);
    fs.writeFileSync('sample-email.html', htmlContent);
    console.log('✅ HTML email saved as: sample-email.html');
    console.log(`📄 Size: ${(htmlContent.length / 1024).toFixed(1)} KB`);
    
    // Generate text email
    console.log('\n📝 Generating text email...');
    const textContent = generateOrderEmailText(sampleOrderData);
    fs.writeFileSync('sample-email.txt', textContent);
    console.log('✅ Text email saved as: sample-email.txt');
    console.log(`📄 Size: ${(textContent.length / 1024).toFixed(1)} KB`);
    
    console.log('\n🎉 Sample emails generated successfully!');
    console.log('\n📋 Preview Instructions:');
    console.log('1. Open sample-email.html in your web browser to see the design');
    console.log('2. Open sample-email.txt to see the plain text version');
    console.log('3. Test the responsive design by resizing your browser window');
    
    console.log('\n✨ Email Template Features:');
    console.log('✅ Professional branding with "The Shin Shop" header');
    console.log('✅ Responsive design that works on mobile and desktop');
    console.log('✅ Color-coded sections for easy scanning');
    console.log('✅ Complete customer and order information');
    console.log('✅ Detailed customization specifications');
    console.log('✅ Visual indicators for colors and images');
    console.log('✅ Clear next steps for order fulfillment');
    console.log('✅ Professional styling with modern fonts');
    
    console.log('\n🎨 Design Elements:');
    console.log('• Blue gradient header with white text');
    console.log('• Green section for customer information');
    console.log('• Yellow section for customization details');
    console.log('• Pink section for order summary');
    console.log('• Gray footer with action items');
    
  } catch (error) {
    console.error('❌ Error generating sample emails:', error);
    process.exit(1);
  }
}

// Run the generator
if (require.main === module) {
  generateSampleEmails();
}

module.exports = { generateSampleEmails, sampleOrderData };
