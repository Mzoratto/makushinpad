#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * This script validates that all required environment variables are properly configured
 */

/**
 * Environment variable definitions
 */
const environmentConfig = {
  required: {
    'EMAIL_PROVIDER': {
      description: 'Email service provider (gmail or smtp)',
      validValues: ['gmail', 'smtp'],
      example: 'gmail'
    },
    'BUSINESS_EMAIL': {
      description: 'Business email address where notifications are sent',
      validation: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      example: 'orders@yourshop.com'
    }
  },
  
  conditional: {
    gmail: {
      'GMAIL_USER': {
        description: 'Gmail account username',
        validation: (value) => /^[^\s@]+@gmail\.com$/.test(value),
        example: 'business@gmail.com'
      },
      'GMAIL_APP_PASSWORD': {
        description: 'Gmail app password (16 characters)',
        validation: (value) => value && value.replace(/\s/g, '').length === 16,
        example: 'abcd efgh ijkl mnop'
      }
    },
    
    smtp: {
      'SMTP_HOST': {
        description: 'SMTP server hostname',
        validation: (value) => value && value.length > 0,
        example: 'smtp.gmail.com'
      },
      'SMTP_PORT': {
        description: 'SMTP server port',
        validation: (value) => !isNaN(parseInt(value)) && parseInt(value) > 0,
        example: '587'
      },
      'SMTP_SECURE': {
        description: 'Use SSL/TLS (true/false)',
        validValues: ['true', 'false'],
        example: 'false'
      },
      'SMTP_USER': {
        description: 'SMTP username',
        validation: (value) => value && value.length > 0,
        example: 'user@domain.com'
      },
      'SMTP_PASSWORD': {
        description: 'SMTP password',
        validation: (value) => value && value.length > 0,
        example: 'password123'
      }
    }
  },
  
  optional: {
    'BUSINESS_CC_EMAIL': {
      description: 'Additional email recipient (optional)',
      validation: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      example: 'manager@yourshop.com'
    },
    'SNIPCART_WEBHOOK_SECRET': {
      description: 'Webhook security secret (optional but recommended)',
      validation: (value) => !value || value.length >= 16,
      example: 'sk_webhook_abc123def456...'
    }
  }
};

/**
 * Validate a single environment variable
 */
function validateVariable(name, config, value) {
  const result = {
    name,
    value: value ? '***' : undefined, // Hide actual values for security
    status: 'unknown',
    message: '',
    hasValue: !!value
  };

  if (!value) {
    result.status = 'missing';
    result.message = `Missing required variable: ${config.description}`;
    return result;
  }

  // Check valid values
  if (config.validValues && !config.validValues.includes(value)) {
    result.status = 'invalid';
    result.message = `Invalid value. Must be one of: ${config.validValues.join(', ')}`;
    return result;
  }

  // Check custom validation
  if (config.validation && !config.validation(value)) {
    result.status = 'invalid';
    result.message = `Invalid format. Expected: ${config.example}`;
    return result;
  }

  result.status = 'valid';
  result.message = 'Valid configuration';
  return result;
}

/**
 * Validate all environment variables
 */
function validateEnvironment() {
  console.log('🔍 Environment Variables Validation\n');
  console.log('=' .repeat(60));

  const results = {
    valid: 0,
    invalid: 0,
    missing: 0,
    warnings: 0,
    details: []
  };

  // Validate required variables
  console.log('\n📋 Required Variables:');
  for (const [name, config] of Object.entries(environmentConfig.required)) {
    const value = process.env[name];
    const result = validateVariable(name, config, value);
    results.details.push(result);

    const icon = result.status === 'valid' ? '✅' : result.status === 'missing' ? '❌' : '⚠️';
    console.log(`  ${icon} ${name}: ${result.message}`);

    if (result.status === 'valid') results.valid++;
    else if (result.status === 'missing') results.missing++;
    else results.invalid++;
  }

  // Validate conditional variables based on EMAIL_PROVIDER
  const emailProvider = process.env.EMAIL_PROVIDER;
  if (emailProvider && environmentConfig.conditional[emailProvider]) {
    console.log(`\n📧 ${emailProvider.toUpperCase()} Configuration:`);
    
    for (const [name, config] of Object.entries(environmentConfig.conditional[emailProvider])) {
      const value = process.env[name];
      const result = validateVariable(name, config, value);
      results.details.push(result);

      const icon = result.status === 'valid' ? '✅' : result.status === 'missing' ? '❌' : '⚠️';
      console.log(`  ${icon} ${name}: ${result.message}`);

      if (result.status === 'valid') results.valid++;
      else if (result.status === 'missing') results.missing++;
      else results.invalid++;
    }
  }

  // Validate optional variables
  console.log('\n🔧 Optional Variables:');
  for (const [name, config] of Object.entries(environmentConfig.optional)) {
    const value = process.env[name];
    const result = validateVariable(name, config, value);
    
    if (value) {
      results.details.push(result);
      const icon = result.status === 'valid' ? '✅' : '⚠️';
      console.log(`  ${icon} ${name}: ${result.message}`);
      
      if (result.status === 'valid') results.valid++;
      else results.warnings++;
    } else {
      console.log(`  ⬜ ${name}: Not configured (optional)`);
    }
  }

  return results;
}

/**
 * Test email service initialization
 */
async function testEmailService() {
  console.log('\n🧪 Email Service Test:');
  
  try {
    const EmailService = require('./netlify/functions/utils/emailService');
    const emailService = new EmailService();
    console.log('  ✅ Email service initialized successfully');
    return true;
  } catch (error) {
    console.log(`  ❌ Email service initialization failed: ${error.message}`);
    return false;
  }
}

/**
 * Generate configuration template
 */
function generateConfigTemplate() {
  console.log('\n📝 Configuration Template:');
  console.log('Copy these variables to your Netlify environment settings:\n');

  // Required variables
  console.log('# Required Variables');
  for (const [name, config] of Object.entries(environmentConfig.required)) {
    console.log(`${name}=${config.example}  # ${config.description}`);
  }

  // Gmail configuration
  console.log('\n# Gmail Configuration (if EMAIL_PROVIDER=gmail)');
  for (const [name, config] of Object.entries(environmentConfig.conditional.gmail)) {
    console.log(`${name}=${config.example}  # ${config.description}`);
  }

  // SMTP configuration
  console.log('\n# SMTP Configuration (if EMAIL_PROVIDER=smtp)');
  for (const [name, config] of Object.entries(environmentConfig.conditional.smtp)) {
    console.log(`${name}=${config.example}  # ${config.description}`);
  }

  // Optional variables
  console.log('\n# Optional Variables');
  for (const [name, config] of Object.entries(environmentConfig.optional)) {
    console.log(`${name}=${config.example}  # ${config.description}`);
  }
}

/**
 * Main validation function
 */
async function runValidation() {
  const results = validateEnvironment();
  const emailServiceWorks = await testEmailService();

  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Validation Summary:');
  console.log(`✅ Valid: ${results.valid}`);
  console.log(`❌ Missing: ${results.missing}`);
  console.log(`⚠️  Invalid: ${results.invalid}`);
  console.log(`🔧 Warnings: ${results.warnings}`);

  // Overall status
  console.log('\n🎯 Overall Status:');
  if (results.missing === 0 && results.invalid === 0 && emailServiceWorks) {
    console.log('✅ Configuration is complete and working!');
    console.log('🚀 Ready for production deployment');
  } else if (results.missing === 0 && results.invalid === 0) {
    console.log('⚠️  Configuration looks good but email service has issues');
    console.log('🔧 Check email credentials and network connectivity');
  } else {
    console.log('❌ Configuration is incomplete or has errors');
    console.log('📋 Please fix the issues above before deploying');
  }

  // Next steps
  console.log('\n📋 Next Steps:');
  if (results.missing > 0 || results.invalid > 0) {
    console.log('1. Fix missing or invalid environment variables');
    console.log('2. Add variables to Netlify dashboard');
    console.log('3. Redeploy site with new variables');
    console.log('4. Run this validation script again');
  } else {
    console.log('1. Deploy to Netlify with environment variables');
    console.log('2. Configure Snipcart webhook');
    console.log('3. Test with Snipcart test mode');
    console.log('4. Monitor email delivery');
  }

  // Show template if needed
  if (results.missing > 0) {
    generateConfigTemplate();
  }

  console.log('\n📚 Documentation:');
  console.log('• Environment Setup: docs/ENVIRONMENT_SETUP.md');
  console.log('• Email Configuration: docs/EMAIL_CONFIGURATION.md');
  console.log('• Deployment Guide: docs/DEPLOYMENT_CHECKLIST.md');
}

/**
 * Main execution
 */
if (require.main === module) {
  runValidation().catch(error => {
    console.error('💥 Validation failed:', error);
    process.exit(1);
  });
}

module.exports = { validateEnvironment, testEmailService, environmentConfig };
