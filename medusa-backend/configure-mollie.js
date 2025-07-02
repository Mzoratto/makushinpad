#!/usr/bin/env node

/**
 * Mollie Configuration Helper
 * This script helps you configure Mollie payments for your Medusa.js backend
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

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
 * Validate Mollie API key format
 */
function validateMollieApiKey(apiKey) {
  const testKeyPattern = /^test_[a-zA-Z0-9]{30,}$/;
  const liveKeyPattern = /^live_[a-zA-Z0-9]{30,}$/;
  
  return testKeyPattern.test(apiKey) || liveKeyPattern.test(apiKey);
}

/**
 * Update .env file with Mollie configuration
 */
function updateEnvFile(mollieConfig) {
  const envPath = path.join(__dirname, '.env');
  
  try {
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add Mollie configuration
    const updates = {
      'MOLLIE_API_KEY': mollieConfig.apiKey,
      'MOLLIE_WEBHOOK_URL': mollieConfig.webhookUrl
    };
    
    Object.entries(updates).forEach(([key, value]) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      
      if (regex.test(envContent)) {
        // Update existing line
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        // Add new line
        envContent += `\n${key}=${value}`;
      }
    });
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated successfully');
    
  } catch (error) {
    console.error('❌ Failed to update .env file:', error.message);
    throw error;
  }
}

/**
 * Test Mollie API key
 */
async function testMollieApiKey(apiKey) {
  try {
    const { createMollieClient } = require('@mollie/api-client');
    const mollie = createMollieClient({ apiKey });
    
    // Test API connection
    await mollie.methods.list();
    return true;
  } catch (error) {
    console.log(`❌ API key test failed: ${error.message}`);
    return false;
  }
}

/**
 * Main configuration function
 */
async function configureMollie() {
  console.log('🔧 Mollie Payment Configuration for Shin Shop\n');
  console.log('This script will help you configure Mollie payments for your Medusa.js backend.');
  console.log('You\'ll need a Mollie account and API key to proceed.\n');
  console.log('=' .repeat(60));

  try {
    // Check if dependencies are installed
    try {
      require('@mollie/api-client');
    } catch (error) {
      console.log('❌ Mollie API client not installed');
      console.log('💡 Run: npm install @mollie/api-client');
      process.exit(1);
    }

    // Step 1: Mollie Account Setup
    console.log('\n📋 Step 1: Mollie Account Setup');
    console.log('If you don\'t have a Mollie account yet:');
    console.log('1. Go to https://mollie.com/');
    console.log('2. Sign up for a business account');
    console.log('3. Complete the verification process');
    console.log('4. Go to Developers → API keys');
    console.log('');

    const hasAccount = await prompt('Do you have a Mollie account with API keys? (y/N): ');
    if (hasAccount.toLowerCase() !== 'y') {
      console.log('\n📚 Please set up your Mollie account first, then run this script again.');
      console.log('🔗 Mollie signup: https://mollie.com/');
      process.exit(0);
    }

    // Step 2: API Key Configuration
    console.log('\n🔑 Step 2: API Key Configuration');
    console.log('You can find your API keys in the Mollie Dashboard:');
    console.log('• Developers → API keys');
    console.log('• Use TEST key for development');
    console.log('• Use LIVE key for production');
    console.log('');

    let apiKey;
    let isValidKey = false;

    while (!isValidKey) {
      apiKey = await prompt('Enter your Mollie API key: ');
      
      if (!apiKey) {
        console.log('❌ API key is required');
        continue;
      }

      if (!validateMollieApiKey(apiKey)) {
        console.log('❌ Invalid API key format');
        console.log('💡 API key should start with "test_" or "live_" followed by 30+ characters');
        continue;
      }

      console.log('🧪 Testing API key...');
      isValidKey = await testMollieApiKey(apiKey);
      
      if (!isValidKey) {
        console.log('💡 Please check your API key and try again');
      }
    }

    const keyType = apiKey.startsWith('test_') ? 'TEST' : 'LIVE';
    console.log(`✅ ${keyType} API key validated successfully`);

    // Step 3: Webhook Configuration
    console.log('\n🔗 Step 3: Webhook Configuration');
    console.log('Webhooks allow Mollie to notify your backend about payment status changes.');
    console.log('');

    const defaultWebhookUrl = 'https://your-backend-url.com/mollie/webhooks';
    const webhookUrl = await prompt(`Enter your webhook URL [${defaultWebhookUrl}]: `) || defaultWebhookUrl;

    if (webhookUrl === defaultWebhookUrl) {
      console.log('⚠️  You\'re using the default webhook URL');
      console.log('💡 Update this with your actual backend URL after deployment');
    }

    // Step 4: Save Configuration
    console.log('\n💾 Step 4: Save Configuration');
    
    const mollieConfig = {
      apiKey,
      webhookUrl
    };

    updateEnvFile(mollieConfig);

    // Step 5: Next Steps
    console.log('\n🎉 Mollie Configuration Complete!');
    console.log('=' .repeat(60));
    console.log('');
    console.log('📋 Configuration Summary:');
    console.log(`• API Key Type: ${keyType}`);
    console.log(`• Webhook URL: ${webhookUrl}`);
    console.log('');
    console.log('📚 Next Steps:');
    console.log('1. Restart your Medusa backend:');
    console.log('   npm run dev');
    console.log('');
    console.log('2. Test the integration:');
    console.log('   npm run test:mollie');
    console.log('');
    console.log('3. Configure webhooks in Mollie Dashboard:');
    console.log('   • Go to Developers → Webhooks');
    console.log(`   • Add webhook URL: ${webhookUrl}`);
    console.log('   • Select all payment events');
    console.log('');
    console.log('4. Test payments in admin panel:');
    console.log('   http://localhost:7001');
    console.log('');

    if (keyType === 'TEST') {
      console.log('🧪 Test Payment Information:');
      console.log('• Test Card: 4242 4242 4242 4242');
      console.log('• Expiry: 12/25');
      console.log('• CVC: 123');
      console.log('');
    }

    console.log('📖 Documentation:');
    console.log('• Mollie Setup Guide: docs/MOLLIE_SETUP_GUIDE.md');
    console.log('• Mollie API Docs: https://docs.mollie.com/');
    console.log('• Medusa Payment Docs: https://docs.medusajs.com/modules/carts-and-checkout/payment');

  } catch (error) {
    console.error('\n💥 Configuration failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

/**
 * Main execution
 */
if (require.main === module) {
  configureMollie().catch(error => {
    console.error('💥 Configuration script failed:', error);
    process.exit(1);
  });
}

module.exports = { configureMollie };
