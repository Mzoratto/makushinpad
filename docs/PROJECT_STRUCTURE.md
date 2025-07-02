# Project Structure Guide

This document explains the organized structure of the Shin Shop project after cleanup and migration to Medusa.js.

## 📁 Root Directory Structure

```
shinshop/
├── 📂 src/                     # Gatsby frontend source code
├── 📂 medusa-backend/          # Medusa.js backend
├── 📂 docs/                    # Documentation (organized)
├── 📂 archive/                 # Legacy and deprecated files
├── 📂 scripts/                 # Utility scripts
├── 📂 netlify/                 # Netlify Functions
├── 📂 content/                 # Markdown content
├── 📂 public/                  # Built frontend assets
├── 📂 node_modules/            # Frontend dependencies
├── 📄 package.json             # Frontend dependencies
├── 📄 gatsby-config.js         # Gatsby configuration
├── 📄 tailwind.config.js       # Tailwind CSS config
├── 📄 tsconfig.json            # TypeScript config
├── 📄 netlify.toml             # Netlify deployment config
└── 📄 README.md                # Main project documentation
```

## 🎨 Frontend Structure (`src/`)

```
src/
├── 📂 components/              # Reusable React components
│   ├── Layout.tsx             # Main layout with navigation
│   ├── LanguageSwitcher.tsx   # Language toggle component
│   ├── CurrencySwitcher.tsx   # Currency toggle component
│   ├── CartButton.tsx         # Medusa cart button
│   ├── MedusaCart.tsx         # Cart sidebar component
│   └── ProductCard.tsx        # Product display component
├── 📂 contexts/               # React Context providers
│   ├── CurrencyContext.tsx    # Currency state management
│   └── CartContext.tsx        # Medusa cart state management
├── 📂 services/               # API and external services
│   └── medusaClient.ts        # Medusa.js API client
├── 📂 pages/                  # Gatsby pages
│   ├── index.tsx              # Homepage
│   ├── products.tsx           # Product catalog
│   ├── customize.tsx          # Product customization
│   ├── about.tsx              # About page
│   └── contact.tsx            # Contact page
├── 📂 templates/              # Page templates
│   └── product-template.tsx   # Individual product pages
├── 📂 locales/                # Internationalization files
│   ├── en/                    # English translations
│   │   ├── common.json        # Common UI text
│   │   ├── products.json      # Product-related text
│   │   └── customize.json     # Customization page text
│   └── cz/                    # Czech translations
│       ├── common.json        # Common UI text
│       ├── products.json      # Product-related text
│       └── customize.json     # Customization page text
├── 📂 utils/                  # Utility functions
│   └── priceUtils.ts          # Price formatting utilities
├── 📂 styles/                 # Global styles
│   └── global.css             # Global CSS and Tailwind imports
└── 📂 images/                 # Static images
    └── (image files)
```

## 🛒 Backend Structure (`medusa-backend/`)

```
medusa-backend/
├── 📂 src/                    # Medusa.js source code
│   ├── 📂 api/               # Custom API routes
│   │   └── 📂 routes/        # Route handlers
│   │       └── 📂 webhooks/  # Webhook endpoints
│   ├── 📂 services/          # Custom services
│   │   └── email.ts          # Email notification service
│   └── 📂 subscribers/       # Event subscribers
│       └── order-notification.ts # Order email notifications
├── 📂 data/                  # Seed and configuration data
│   ├── seed.json             # Basic seed data
│   ├── seed-enhanced.json    # Enhanced product catalog
│   └── enhanced-shin-pad-catalog.json # Product definitions
├── 📄 package.json           # Backend dependencies
├── 📄 medusa-config.js       # Medusa configuration
├── 📄 tsconfig.json          # TypeScript configuration
├── 📄 index.js               # Server entry point
├── 📄 setup.sh               # Automated setup script
├── 📄 configure-mollie.js    # Mollie payment setup
├── 📄 manage-products.js     # Product management tool
├── 📄 test-mollie-integration.js # Mollie testing
├── 📄 seed-enhanced-products.js # Enhanced seeding
├── 📄 .env.example           # Environment variables template
└── 📄 README.md              # Backend documentation
```

## 📚 Documentation Structure (`docs/`)

```
docs/
├── 📂 setup/                 # Setup and installation guides
│   ├── MEDUSA_SETUP_GUIDE.md # Complete Medusa.js setup
│   ├── MOLLIE_SETUP_GUIDE.md # Mollie payment integration
│   └── PRODUCT_CATALOG_GUIDE.md # Product catalog setup
├── 📂 guides/                # Usage and deployment guides
│   ├── DEPLOYMENT.md         # Deployment instructions
│   ├── DEPLOYMENT_CHECKLIST.md # Pre-deployment checklist
│   └── ENVIRONMENT_SETUP.md  # Environment configuration
├── 📂 reference/             # Technical reference
│   ├── EMAIL_CONFIGURATION.md # Email setup reference
│   ├── EMAIL_NOTIFICATIONS_README.md # Email system docs
│   ├── WEBHOOK_SETUP.md      # Webhook configuration
│   └── TESTING_GUIDE.md      # Testing procedures
├── 📄 PROJECT_STRUCTURE.md  # This file
└── 📄 ONBOARDING.md          # Getting started guide
```

## 🗄️ Archive Structure (`archive/`)

```
archive/
├── 📂 snipcart-files/        # Deprecated Snipcart documentation
│   ├── SNIPCART_SETUP.md     # Old Snipcart setup guide
│   └── SNIPCART_WEBHOOK_SETUP.md # Old webhook setup
├── 📂 test-files/            # Development test files
│   ├── test-*.js             # Various test scripts
│   ├── generate-sample-email.js # Email generation test
│   └── sample-email.*        # Sample email files
└── 📂 legacy-files/          # Deprecated project files
    ├── CURRENCY_IMPLEMENTATION_SUMMARY.md
    ├── EUR_MIGRATION_SUMMARY.md
    ├── setup-environment.js
    ├── validate-environment.js
    ├── verify-webhook-setup.js
    └── shinshop/             # Old duplicate folder
```

## 🔧 Configuration Files

### Frontend Configuration
- **`gatsby-config.js`** - Gatsby plugins and site configuration
- **`tailwind.config.js`** - Tailwind CSS customization
- **`tsconfig.json`** - TypeScript compiler options
- **`package.json`** - Frontend dependencies and scripts

### Backend Configuration
- **`medusa-config.js`** - Medusa.js server configuration
- **`.env.example`** - Environment variables template
- **`package.json`** - Backend dependencies and scripts

### Deployment Configuration
- **`netlify.toml`** - Netlify deployment settings
- **`gatsby-cloud.yml`** - Gatsby Cloud configuration (if used)

## 🚀 Quick Navigation

### For Developers
- **Getting Started**: [`docs/ONBOARDING.md`](ONBOARDING.md)
- **Backend Setup**: [`docs/setup/MEDUSA_SETUP_GUIDE.md`](setup/MEDUSA_SETUP_GUIDE.md)
- **Payment Setup**: [`docs/setup/MOLLIE_SETUP_GUIDE.md`](setup/MOLLIE_SETUP_GUIDE.md)

### For Deployment
- **Deployment Guide**: [`docs/guides/DEPLOYMENT.md`](guides/DEPLOYMENT.md)
- **Environment Setup**: [`docs/guides/ENVIRONMENT_SETUP.md`](guides/ENVIRONMENT_SETUP.md)
- **Pre-deployment Checklist**: [`docs/guides/DEPLOYMENT_CHECKLIST.md`](guides/DEPLOYMENT_CHECKLIST.md)

### For Maintenance
- **Product Management**: [`docs/setup/PRODUCT_CATALOG_GUIDE.md`](setup/PRODUCT_CATALOG_GUIDE.md)
- **Email Configuration**: [`docs/reference/EMAIL_CONFIGURATION.md`](reference/EMAIL_CONFIGURATION.md)
- **Testing Guide**: [`docs/reference/TESTING_GUIDE.md`](reference/TESTING_GUIDE.md)

## 📝 File Naming Conventions

### Documentation
- **Setup guides**: `*_SETUP_GUIDE.md`
- **Reference docs**: `*_CONFIGURATION.md`, `*_README.md`
- **Deployment docs**: `DEPLOYMENT*.md`

### Code Files
- **React components**: `PascalCase.tsx`
- **Utilities**: `camelCase.ts`
- **Pages**: `lowercase.tsx`
- **Configuration**: `kebab-case.js`

### Scripts
- **Setup scripts**: `setup-*.sh`, `configure-*.js`
- **Management tools**: `manage-*.js`
- **Test scripts**: `test-*.js`

## 🔍 Finding Files

### Common Tasks
- **Add new product**: Edit `medusa-backend/data/enhanced-shin-pad-catalog.json`
- **Update translations**: Edit files in `src/locales/`
- **Modify cart behavior**: Edit `src/contexts/CartContext.tsx`
- **Change payment settings**: Edit `medusa-backend/medusa-config.js`
- **Update email templates**: Edit `medusa-backend/src/services/email.ts`

### Configuration Changes
- **Frontend styling**: `tailwind.config.js`, `src/styles/global.css`
- **Backend settings**: `medusa-backend/medusa-config.js`
- **Deployment settings**: `netlify.toml`
- **Environment variables**: `.env` files

This organized structure makes the project more maintainable and easier to navigate for both development and deployment.
