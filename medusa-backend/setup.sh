#!/bin/bash

# Shin Shop Medusa.js Backend Setup Script
# This script helps you set up the Medusa.js backend for your shin pad shop

echo "🎯 Setting up Shin Shop Medusa.js Backend"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PostgreSQL is available
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. You'll need to:"
    echo "   1. Install PostgreSQL locally, or"
    echo "   2. Use a cloud database service like:"
    echo "      - Railway (https://railway.app/)"
    echo "      - Supabase (https://supabase.com/)"
    echo "      - Neon (https://neon.tech/)"
    echo ""
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ PostgreSQL detected"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "🔧 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created from .env.example"
    echo "⚠️  Please update .env with your actual database URL and API keys"
else
    echo "✅ .env file already exists"
fi

# Generate JWT and Cookie secrets
echo ""
echo "🔐 Generating secure secrets..."

# Generate random secrets
JWT_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
COOKIE_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

# Update .env file with generated secrets
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/JWT_SECRET=some_jwt_secret/JWT_SECRET=$JWT_SECRET/" .env
    sed -i '' "s/COOKIE_SECRET=some_cookie_secret/COOKIE_SECRET=$COOKIE_SECRET/" .env
else
    # Linux
    sed -i "s/JWT_SECRET=some_jwt_secret/JWT_SECRET=$JWT_SECRET/" .env
    sed -i "s/COOKIE_SECRET=some_cookie_secret/COOKIE_SECRET=$COOKIE_SECRET/" .env
fi

echo "✅ Secure secrets generated and added to .env"

# Check database connection
echo ""
echo "🗄️  Checking database configuration..."

# Read DATABASE_URL from .env
DATABASE_URL=$(grep "^DATABASE_URL=" .env | cut -d'=' -f2-)

if [[ $DATABASE_URL == *"localhost"* ]] || [[ $DATABASE_URL == *"postgres://username:password"* ]]; then
    echo "⚠️  Default database URL detected. Please update DATABASE_URL in .env"
    echo "   Example: postgres://username:password@localhost:5432/medusa-store"
    echo ""
    echo "📚 Database Setup Options:"
    echo "   1. Local PostgreSQL:"
    echo "      - Install PostgreSQL"
    echo "      - Create database: createdb medusa-store"
    echo "      - Update .env with connection string"
    echo ""
    echo "   2. Cloud Database (Recommended):"
    echo "      - Railway: https://railway.app/ (free tier)"
    echo "      - Supabase: https://supabase.com/ (free tier)"
    echo "      - Neon: https://neon.tech/ (free tier)"
    echo ""
    read -p "Press Enter to continue once you've configured the database..."
fi

# Run migrations
echo ""
echo "🔄 Running database migrations..."
npm run migrate

if [ $? -ne 0 ]; then
    echo "❌ Database migration failed. Please check your DATABASE_URL in .env"
    echo "💡 Make sure your database is running and accessible"
    exit 1
fi

echo "✅ Database migrations completed"

# Seed initial data
echo ""
echo "🌱 Seeding initial data..."
npm run seed

if [ $? -ne 0 ]; then
    echo "⚠️  Seeding failed, but this is often okay for first setup"
    echo "💡 You can add products manually through the admin panel"
else
    echo "✅ Initial data seeded successfully"
fi

# Build the project
echo ""
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Project built successfully"

# Final instructions
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📋 Next Steps:"
echo "1. Update .env with your actual values:"
echo "   - DATABASE_URL (if not done already)"
echo "   - MOLLIE_API_KEY (get from Mollie dashboard)"
echo "   - Email configuration for notifications"
echo ""
echo "2. Configure Mollie payments (optional):"
echo "   node configure-mollie.js"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. Access your applications:"
echo "   🛍️  Store API: http://localhost:9000"
echo "   📊 Admin Panel: http://localhost:7001"
echo "   👤 Default admin: admin@shinshop.com / supersecret"
echo ""
echo "5. Test Mollie integration:"
echo "   npm run test:mollie"
echo ""
echo "6. Test the setup:"
echo "   curl http://localhost:9000/store/products"
echo ""
echo "📚 Documentation:"
echo "   - Medusa.js: https://docs.medusajs.com/"
echo "   - Mollie: https://docs.mollie.com/"
echo ""
echo "🆘 Need help? Check the README.md file for troubleshooting tips."
