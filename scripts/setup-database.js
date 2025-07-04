#!/usr/bin/env node

/**
 * Database Setup Script for Shin Shop Supabase
 * This script helps set up the database schema and seed data
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Shin Shop Database Setup');
console.log('============================\n');

// Check if environment variables are set
const requiredEnvVars = [
  'GATSBY_SUPABASE_URL',
  'GATSBY_SUPABASE_ANON_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n💡 Please create .env.development file with your Supabase credentials.');
  console.error('   See .env.development.example for template.\n');
  process.exit(1);
}

// Read migration files
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
const seedFile = path.join(__dirname, '..', 'supabase', 'seed.sql');

console.log('📁 Reading migration files...');

try {
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  console.log(`   Found ${migrationFiles.length} migration files:`);
  migrationFiles.forEach(file => {
    console.log(`   - ${file}`);
  });

  if (fs.existsSync(seedFile)) {
    console.log('   - seed.sql');
  }

  console.log('\n📋 Next Steps:');
  console.log('==============');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Run the following files in order:\n');

  // Display migration files content
  migrationFiles.forEach((file, index) => {
    const filePath = path.join(migrationsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`${index + 1}. ${file}`);
    console.log('   Copy and paste this SQL:');
    console.log('   ========================');
    console.log(content.substring(0, 200) + '...');
    console.log('   (Full content in file)\n');
  });

  // Display seed file
  if (fs.existsSync(seedFile)) {
    console.log(`${migrationFiles.length + 1}. seed.sql`);
    console.log('   Copy and paste this SQL:');
    console.log('   ========================');
    const seedContent = fs.readFileSync(seedFile, 'utf8');
    console.log(seedContent.substring(0, 200) + '...');
    console.log('   (Full content in file)\n');
  }

  console.log('🎉 Database setup files are ready!');
  console.log('   Run each SQL file in your Supabase dashboard SQL Editor.');
  console.log('   Then verify the setup by checking the Tables section.\n');

} catch (error) {
  console.error('❌ Error reading migration files:', error.message);
  process.exit(1);
}

// Display environment info
console.log('🔧 Current Configuration:');
console.log('=========================');
console.log(`Supabase URL: ${process.env.GATSBY_SUPABASE_URL}`);
console.log(`Anon Key: ${process.env.GATSBY_SUPABASE_ANON_KEY?.substring(0, 20)}...`);
console.log(`Site URL: ${process.env.GATSBY_SITE_URL || 'http://localhost:8000'}`);
console.log(`Debug Mode: ${process.env.GATSBY_DEBUG_MODE || 'true'}\n`);

console.log('📚 For detailed setup instructions, see:');
console.log('   docs/setup/SUPABASE_SETUP_GUIDE.md\n');
