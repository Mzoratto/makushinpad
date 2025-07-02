#!/usr/bin/env node

/**
 * Interactive Environment Setup Script
 * This script helps you configure environment variables for the email notification system
 */

const readline = require('readline');
const crypto = require('crypto');

/**
 * Create readline interface for user input
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
 * Prompt for password (hidden input)
 */
function promptPassword(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    let password = '';
    
    process.stdin.on('data', function(char) {
      char = char + '';
      
      switch(char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

/**
 * Generate secure webhook secret
 */
function generateWebhookSecret() {
  return 'sk_webhook_' + crypto.randomBytes(32).toString('hex');
}

/**
 * Validate email address
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Main setup function
 */
async function setupEnvironment() {
  console.log('🔧 Shin Shop Email Notification Setup\n');
  console.log('This script will help you configure environment variables for email notifications.');
  console.log('You\'ll need to add these variables to your Netlify dashboard.\n');
  console.log('=' .repeat(60));

  const config = {};

  try {
    // Email Provider Selection
    console.log('\n📧 Email Service Configuration');
    console.log('Choose your email service provider:');
    console.log('1. Gmail (recommended - easy setup)');
    console.log('2. Custom SMTP (advanced - any email provider)');
    
    const providerChoice = await prompt('\nEnter your choice (1 or 2): ');
    
    if (providerChoice === '1') {
      config.EMAIL_PROVIDER = 'gmail';
      await setupGmail(config);
    } else if (providerChoice === '2') {
      config.EMAIL_PROVIDER = 'smtp';
      await setupSMTP(config);
    } else {
      console.log('❌ Invalid choice. Please run the script again.');
      process.exit(1);
    }

    // Business Email Configuration
    console.log('\n📬 Business Email Configuration');
    
    let businessEmail;
    do {
      businessEmail = await prompt('Enter your business email address (where notifications will be sent): ');
      if (!isValidEmail(businessEmail)) {
        console.log('❌ Invalid email format. Please try again.');
      }
    } while (!isValidEmail(businessEmail));
    
    config.BUSINESS_EMAIL = businessEmail;

    // Optional CC Email
    const ccEmail = await prompt('Enter CC email address (optional, press Enter to skip): ');
    if (ccEmail && isValidEmail(ccEmail)) {
      config.BUSINESS_CC_EMAIL = ccEmail;
    } else if (ccEmail && !isValidEmail(ccEmail)) {
      console.log('⚠️  Invalid CC email format. Skipping CC email.');
    }

    // Webhook Security
    console.log('\n🔒 Webhook Security Configuration');
    const useWebhookSecret = await prompt('Generate webhook secret for security? (recommended) [Y/n]: ');
    
    if (useWebhookSecret.toLowerCase() !== 'n') {
      config.SNIPCART_WEBHOOK_SECRET = generateWebhookSecret();
      console.log('✅ Webhook secret generated');
    }

    // Display Configuration
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 Configuration Complete!\n');
    
    console.log('📋 Environment Variables to Add to Netlify:');
    console.log('Copy and paste these into your Netlify dashboard:\n');
    
    for (const [key, value] of Object.entries(config)) {
      if (key.includes('PASSWORD') || key.includes('SECRET')) {
        console.log(`${key}=${value}`);
      } else {
        console.log(`${key}=${value}`);
      }
    }

    // Instructions
    console.log('\n📚 Next Steps:');
    console.log('1. Go to your Netlify dashboard');
    console.log('2. Navigate to Site settings → Environment variables');
    console.log('3. Add each variable above using "Add variable" button');
    console.log('4. Deploy your site to apply the new variables');
    console.log('5. Run "node validate-environment.js" to verify configuration');
    console.log('6. Configure Snipcart webhook using docs/SNIPCART_WEBHOOK_SETUP.md');

    console.log('\n🔗 Helpful Links:');
    console.log('• Netlify Dashboard: https://app.netlify.com/');
    console.log('• Gmail App Passwords: https://support.google.com/accounts/answer/185833');
    console.log('• Snipcart Dashboard: https://app.snipcart.com/');

    if (config.SNIPCART_WEBHOOK_SECRET) {
      console.log('\n🔒 Webhook Secret:');
      console.log('Add this secret to your Snipcart webhook configuration for security.');
      console.log(`Secret: ${config.SNIPCART_WEBHOOK_SECRET}`);
    }

  } catch (error) {
    console.error('\n💥 Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

/**
 * Setup Gmail configuration
 */
async function setupGmail(config) {
  console.log('\n📧 Gmail Configuration');
  console.log('You\'ll need a Gmail account with 2-Factor Authentication enabled.');
  console.log('See docs/ENVIRONMENT_SETUP.md for detailed Gmail setup instructions.\n');

  let gmailUser;
  do {
    gmailUser = await prompt('Enter your Gmail address: ');
    if (!gmailUser.endsWith('@gmail.com')) {
      console.log('❌ Please enter a valid Gmail address (ending with @gmail.com)');
    }
  } while (!gmailUser.endsWith('@gmail.com'));

  config.GMAIL_USER = gmailUser;

  console.log('\n🔑 Gmail App Password');
  console.log('You need to generate an app password for Gmail:');
  console.log('1. Go to Google Account Settings → Security → 2-Step Verification');
  console.log('2. Scroll to "App passwords" and click it');
  console.log('3. Select "Mail" and "Other (Custom name)"');
  console.log('4. Enter "Shin Shop Notifications" as the name');
  console.log('5. Copy the 16-character password\n');

  let appPassword;
  do {
    appPassword = await promptPassword('Enter your Gmail app password (16 characters): ');
    const cleanPassword = appPassword.replace(/\s/g, '');
    if (cleanPassword.length !== 16) {
      console.log('❌ App password should be exactly 16 characters. Please try again.');
    }
  } while (appPassword.replace(/\s/g, '').length !== 16);

  config.GMAIL_APP_PASSWORD = appPassword;
  console.log('✅ Gmail configuration complete');
}

/**
 * Setup SMTP configuration
 */
async function setupSMTP(config) {
  console.log('\n📧 SMTP Configuration');
  console.log('Enter your SMTP server details. Check with your email provider for these settings.\n');

  config.SMTP_HOST = await prompt('SMTP Host (e.g., smtp.gmail.com): ');
  
  let port;
  do {
    port = await prompt('SMTP Port (e.g., 587): ');
    if (isNaN(parseInt(port)) || parseInt(port) <= 0) {
      console.log('❌ Please enter a valid port number.');
    }
  } while (isNaN(parseInt(port)) || parseInt(port) <= 0);
  
  config.SMTP_PORT = port;

  const secure = await prompt('Use SSL/TLS? [y/N]: ');
  config.SMTP_SECURE = secure.toLowerCase() === 'y' ? 'true' : 'false';

  config.SMTP_USER = await prompt('SMTP Username: ');
  config.SMTP_PASSWORD = await promptPassword('SMTP Password: ');

  console.log('✅ SMTP configuration complete');
}

/**
 * Main execution
 */
if (require.main === module) {
  setupEnvironment().catch(error => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
}

module.exports = { setupEnvironment };
