# 🚀 Setup Guide - The Shin Shop

Complete setup guide for The Shin Shop e-commerce platform.

## Prerequisites

- **Node.js 20.x LTS** (required for Gatsby 5.x compatibility)
- **npm** or **yarn** package manager
- **Supabase account** (free tier available)
- **Git** for version control

## 1. Environment Setup

### Clone Repository
```bash
git clone https://github.com/Mzoratto/makushinpad.git
cd shinshop
```

### Install Dependencies
```bash
# Using npm (recommended)
npm install

# Or using yarn
yarn install
```

### Environment Variables
```bash
# Copy example environment file
cp .env.development.example .env.development

# Edit with your actual values
nano .env.development
```

Required environment variables:
```bash
# Supabase Configuration
GATSBY_SUPABASE_URL=https://your-project.supabase.co
GATSBY_SUPABASE_ANON_KEY=your_anon_key_here

# Site Configuration
GATSBY_SITE_URL=http://localhost:8000
GATSBY_DEBUG_MODE=true

# Currency Configuration
GATSBY_DEFAULT_CURRENCY=CZK
GATSBY_SUPPORTED_CURRENCIES=CZK,EUR

# Upload Configuration
GATSBY_MAX_UPLOAD_SIZE=52428800
```

## 2. Supabase Setup

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and anon key

### Database Setup
```bash
# Link to your Supabase project
npx supabase link --project-ref your-project-ref

# Run migrations
npx supabase db push

# Seed initial data
npx supabase db reset
```

### Edge Functions
```bash
# Deploy functions
npx supabase functions deploy products
npx supabase functions deploy cart
```

## 3. Development Server

### Start Development
```bash
npm run develop
```

Visit `http://localhost:8000` to see your site!

### Available Scripts
```bash
npm run develop          # Start development server
npm run build           # Build for production
npm run serve           # Serve production build
npm run clean           # Clean Gatsby cache
npm run type-check      # TypeScript type checking
npm run lint            # ESLint code linting
```

## 4. Testing

### Test Supabase Connection
```bash
node scripts/test-supabase-connection.js
```

### Run Tests
```bash
npm run test
npm run test:security
```

## 5. Production Deployment

### Netlify Setup
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `public/`
4. Add environment variables

### Environment Variables for Production
```bash
GATSBY_SUPABASE_URL=your_production_url
GATSBY_SUPABASE_ANON_KEY=your_production_key
GATSBY_SITE_URL=https://your-domain.com
GATSBY_DEBUG_MODE=false
GATSBY_ENVIRONMENT=production
```

## 6. Troubleshooting

### Common Issues

**Build Errors:**
```bash
# Clear cache and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install
```

**Supabase Connection Issues:**
```bash
# Check environment variables
echo $GATSBY_SUPABASE_URL
echo $GATSBY_SUPABASE_ANON_KEY

# Test connection
node scripts/test-supabase-connection.js
```

**TypeScript Errors:**
```bash
# Check types
npm run type-check

# Update TypeScript
npm update typescript
```

### Getting Help

- Check [Troubleshooting Guide](../guides/TROUBLESHOOTING.md)
- Review [Security Guide](../SECURITY_GUIDE.md)
- Open an issue on GitHub

## Next Steps

1. ✅ Complete setup
2. 📖 Read [API Reference](../reference/API_REFERENCE.md)
3. 🔒 Review [Security Guide](../SECURITY_GUIDE.md)
4. 🚀 Deploy to production

---

**Need help? Check our [troubleshooting guide](../guides/TROUBLESHOOTING.md) or open an issue!**
