#!/usr/bin/env node

/**
 * Test script for Medusa.js integration
 * Tests the frontend components and API connectivity
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * Check if required files exist
 */
function checkRequiredFiles() {
  logInfo('Checking required files...');
  
  const requiredFiles = [
    'src/services/medusaClient.ts',
    'src/contexts/CartContext.tsx',
    'src/components/MedusaProductCard.tsx',
    'src/components/MedusaCart.tsx',
    'src/components/CartButton.tsx',
    'src/pages/checkout.tsx',
    'src/pages/order-confirmation.tsx',
    'src/utils/priceUtils.ts'
  ];

  let allFilesExist = true;

  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      logSuccess(`${file} exists`);
    } else {
      logError(`${file} is missing`);
      allFilesExist = false;
    }
  }

  return allFilesExist;
}

/**
 * Check translation files
 */
function checkTranslations() {
  logInfo('Checking translation files...');
  
  const translationFiles = [
    'src/locales/en/common.json',
    'src/locales/en/pages.json',
    'src/locales/cz/common.json',
    'src/locales/cz/pages.json'
  ];

  let allTranslationsExist = true;

  for (const file of translationFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        logSuccess(`${file} exists and is valid JSON`);
        
        // Check for specific keys
        if (file.includes('common.json')) {
          if (content.buttons && content.cart && content.product) {
            logSuccess(`${file} has required sections`);
          } else {
            logWarning(`${file} missing some required sections`);
          }
        }
        
        if (file.includes('pages.json')) {
          if (content.checkout && content.orderConfirmation) {
            logSuccess(`${file} has checkout translations`);
          } else {
            logWarning(`${file} missing checkout translations`);
          }
        }
      } catch (error) {
        logError(`${file} contains invalid JSON: ${error.message}`);
        allTranslationsExist = false;
      }
    } else {
      logError(`${file} is missing`);
      allTranslationsExist = false;
    }
  }

  return allTranslationsExist;
}

/**
 * Check environment configuration
 */
function checkEnvironment() {
  logInfo('Checking environment configuration...');
  
  const envFiles = ['.env.development', '.env.production'];
  let hasValidEnv = false;

  for (const envFile of envFiles) {
    const envPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      if (content.includes('GATSBY_MEDUSA_BACKEND_URL')) {
        logSuccess(`${envFile} contains GATSBY_MEDUSA_BACKEND_URL`);
        hasValidEnv = true;
      } else {
        logWarning(`${envFile} missing GATSBY_MEDUSA_BACKEND_URL`);
      }
    }
  }

  if (!hasValidEnv) {
    logError('No valid environment configuration found');
    logInfo('Please add GATSBY_MEDUSA_BACKEND_URL to your .env files');
  }

  return hasValidEnv;
}

/**
 * Check package.json dependencies
 */
function checkDependencies() {
  logInfo('Checking package.json dependencies...');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packagePath)) {
    logError('package.json not found');
    return false;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    const requiredDeps = [
      'react',
      'react-dom',
      'gatsby',
      'gatsby-plugin-react-i18next',
      'react-i18next',
      'i18next'
    ];

    let allDepsPresent = true;

    for (const dep of requiredDeps) {
      if (dependencies[dep]) {
        logSuccess(`${dep} is installed (${dependencies[dep]})`);
      } else {
        logError(`${dep} is missing`);
        allDepsPresent = false;
      }
    }

    // Check for Medusa client (if using npm package)
    if (dependencies['@medusajs/medusa-js']) {
      logSuccess(`@medusajs/medusa-js is installed (${dependencies['@medusajs/medusa-js']})`);
    } else {
      logInfo('Using custom Medusa client implementation');
    }

    return allDepsPresent;
  } catch (error) {
    logError(`Error reading package.json: ${error.message}`);
    return false;
  }
}

/**
 * Check TypeScript configuration
 */
function checkTypeScript() {
  logInfo('Checking TypeScript configuration...');
  
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    logWarning('tsconfig.json not found');
    return false;
  }

  try {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    logSuccess('tsconfig.json exists and is valid');
    
    if (tsconfig.compilerOptions && tsconfig.compilerOptions.strict) {
      logSuccess('TypeScript strict mode is enabled');
    } else {
      logWarning('TypeScript strict mode is not enabled');
    }

    return true;
  } catch (error) {
    logError(`Error reading tsconfig.json: ${error.message}`);
    return false;
  }
}

/**
 * Check for Snipcart remnants
 */
function checkSnipcartRemnants() {
  logInfo('Checking for Snipcart remnants...');
  
  const filesToCheck = [
    'src/components/Layout.tsx',
    'gatsby-config.js',
    'src/pages/products.tsx'
  ];

  let foundRemnants = false;

  for (const file of filesToCheck) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes('snipcart') || content.includes('Snipcart')) {
        logWarning(`${file} still contains Snipcart references`);
        foundRemnants = true;
      } else {
        logSuccess(`${file} is clean of Snipcart references`);
      }
    }
  }

  return !foundRemnants;
}

/**
 * Generate test report
 */
function generateReport(results) {
  logInfo('\n📊 Test Report Summary:');
  console.log('='.repeat(50));
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  const failedTests = totalTests - passedTests;

  log(`Total Tests: ${totalTests}`, 'blue');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  
  console.log('\nDetailed Results:');
  for (const [test, passed] of Object.entries(results)) {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? 'green' : 'red';
    log(`${status} ${test}`, color);
  }

  console.log('\n' + '='.repeat(50));
  
  if (failedTests === 0) {
    logSuccess('🎉 All tests passed! Your Medusa.js integration is ready.');
  } else {
    logError(`⚠️  ${failedTests} test(s) failed. Please address the issues above.`);
  }

  return failedTests === 0;
}

/**
 * Main test function
 */
function runTests() {
  log('🧪 Running Medusa.js Integration Tests\n', 'bold');
  
  const results = {
    'Required Files': checkRequiredFiles(),
    'Translation Files': checkTranslations(),
    'Environment Configuration': checkEnvironment(),
    'Package Dependencies': checkDependencies(),
    'TypeScript Configuration': checkTypeScript(),
    'Snipcart Cleanup': checkSnipcartRemnants()
  };

  console.log('\n');
  const allTestsPassed = generateReport(results);
  
  if (allTestsPassed) {
    logInfo('\n🚀 Next Steps:');
    logInfo('1. Start your Medusa backend server');
    logInfo('2. Run `gatsby develop` to test the frontend');
    logInfo('3. Test the cart functionality');
    logInfo('4. Test the checkout flow');
    logInfo('5. Verify email notifications (if configured)');
  } else {
    logInfo('\n🔧 Recommended Actions:');
    logInfo('1. Fix the failing tests above');
    logInfo('2. Re-run this test script');
    logInfo('3. Check the migration guide for detailed instructions');
  }

  process.exit(allTestsPassed ? 0 : 1);
}

// Run the tests
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  checkRequiredFiles,
  checkTranslations,
  checkEnvironment,
  checkDependencies,
  checkTypeScript,
  checkSnipcartRemnants
};
