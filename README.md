# Shin Shop - E-commerce Website

A modern e-commerce website for customizable shin pads built with Gatsby.js and Medusa.js, featuring internationalization, custom product configurator, and integrated shopping cart with Mollie payments.

## 🚀 Features

- **Product Catalog**: Browse through tiered shin pad designs (Youth, Standard, Premium, Professional)
- **Customization Tool**: Interactive canvas for personalizing shin pads with images, text, and colors
- **Shopping Cart**: Powered by Medusa.js for complete e-commerce control
- **Payment Processing**: Secure payments through Mollie (CZK/EUR support)
- **Internationalization**: Full i18n support for English (EN) and Czech (CZ)
- **Language Switching**: Dynamic language toggle in header
- **Currency Support**: CZK (primary) and EUR with automatic conversion
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimized**: Built with Gatsby for fast loading times
- **Email Notifications**: Automated custom order notifications

## 🛠 Tech Stack

### Frontend
- **Framework**: Gatsby.js 5.14.x, React 18.2.0, TypeScript
- **Styling**: Tailwind CSS 3.x
- **Customization**: React-Konva 18.2.10, Konva.js 9.3.x
- **Internationalization**: react-i18next, gatsby-plugin-react-i18next
- **State Management**: React Context API

### Backend
- **E-commerce**: Medusa.js (headless commerce platform)
- **Database**: PostgreSQL
- **Payments**: Mollie (CZK/EUR support)
- **Email**: Nodemailer with Gmail/SMTP

### Deployment
- **Frontend**: Netlify (https://makushinpadshop.netlify.app/)
- **Backend**: Render (Medusa.js API)
- **Content**: Markdown files for products

## 📋 Prerequisites

**IMPORTANT**: This project requires specific Node.js version for compatibility.

- **Node.js**: v20.x LTS (20.18.0 recommended)
- **npm**: v10.x or higher
- **PostgreSQL**: For Medusa.js backend (or cloud database)
- **nvm**: Recommended for Node.js version management

## 🚀 Quick Start

### Option 1: Frontend Only (Demo Mode)

```bash
# Clone and setup frontend
git clone <repository-url>
cd shinshop
nvm use 20  # Use Node.js 20.x LTS
npm install
npm run develop
```

**Access**: <http://localhost:8000> (limited functionality without backend)

### Option 2: Full Stack Setup

```bash
# 1. Setup backend first
cd medusa-backend
./setup.sh  # Follow the interactive setup

# 2. Start backend
npm run dev  # Backend: http://localhost:9000

# 3. Setup frontend (new terminal)
cd ..
npm install
npm run develop  # Frontend: http://localhost:8000
```

**Access**:
- **Frontend**: <http://localhost:8000>
- **Backend API**: <http://localhost:9000>
- **Admin Panel**: <http://localhost:7001>

### 📚 Setup Guides
- **Complete Setup**: [`docs/setup/MEDUSA_SETUP_GUIDE.md`](docs/setup/MEDUSA_SETUP_GUIDE.md)
- **Payment Setup**: [`docs/setup/MOLLIE_SETUP_GUIDE.md`](docs/setup/MOLLIE_SETUP_GUIDE.md)
- **Product Catalog**: [`docs/setup/PRODUCT_CATALOG_GUIDE.md`](docs/setup/PRODUCT_CATALOG_GUIDE.md)

## 📜 Available Scripts

- `npm run develop` - Start the development server
- `npm run build` - Build the project for production
- `npm run serve` - Serve the production build locally
- `npm run clean` - Clean the Gatsby cache and public folder
- `npm run typecheck` - Run TypeScript type checking

## 🌐 Internationalization

The site supports English (default) and Czech languages:

- **English URLs**: `/` (default), `/products`, `/about`, etc.
- **Czech URLs**: `/cz/`, `/cz/products`, `/cz/about`, etc.
- **Language Switcher**: Available in the header navigation

### Translation Files

```
src/locales/
├── en/
│   ├── common.json     # Navigation, buttons, common UI
│   ├── pages.json      # Page-specific content
│   └── products.json   # Product-related translations
└── cz/
    ├── common.json     # Czech translations
    ├── pages.json      # Czech page content
    └── products.json   # Czech product translations
```

## 📁 Project Structure

```
shinshop/
├── 📂 src/                     # Gatsby frontend source
├── 📂 medusa-backend/          # Medusa.js backend
├── 📂 docs/                    # Organized documentation
│   ├── setup/                 # Setup guides
│   ├── guides/                # Usage guides
│   └── reference/             # Technical reference
├── 📂 archive/                 # Legacy files
├── 📂 netlify/                 # Netlify Functions
├── 📂 content/                 # Markdown content
└── 📄 README.md                # This file
```

**Detailed Structure**: [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md)

## 🔄 Migration Status

This project has been **migrated from Snipcart to Medusa.js** for better control and cost savings.

### ✅ Completed
- **E-commerce Platform**: Snipcart → Medusa.js
- **Payment Processing**: Stripe → Mollie (CZK/EUR)
- **Backend Architecture**: Serverless → Full backend
- **Documentation**: Scattered → Organized structure
- **Project Cleanup**: Legacy files moved to `archive/`

### 🚀 Benefits
- **Cost Savings**: No transaction fees (Snipcart was 2% + fees)
- **Full Control**: Own your data and customize everything
- **Better Features**: Advanced product variants, inventory management
- **Czech Market**: Native CZK support with Mollie

### 📚 Documentation
- **Setup Guides**: [`docs/setup/`](docs/setup/)
- **Migration Notes**: [`archive/`](archive/) (legacy files)
- **Project Structure**: [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md)

## 🔧 Development Notes

### Dependency Management

- React versions are pinned to 18.2.0 for stability
- Security overrides are in place for vulnerable packages
- Use `npm ci` for production deployments

### Known Issues & Solutions

- **Node.js v22+**: Not compatible, use Node.js v20.x LTS
- **React-Konva SSR**: Handled via gatsby-node.js webpack config
- **i18n Routes**: Managed by gatsby-plugin-react-i18next

## 🚀 Deployment

The site can be deployed to any static hosting service:

- **Netlify**: Recommended for automatic deployments
- **Vercel**: Good performance and easy setup
- **GitHub Pages**: Free option for open source projects

### Environment Variables

**Frontend (.env):**
```bash
# Medusa API
GATSBY_MEDUSA_API_URL=https://your-backend-url.render.com

# Site URL
GATSBY_SITE_URL=https://makushinpadshop.netlify.app
```

**Backend (medusa-backend/.env):**
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Security
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret

# CORS
STORE_CORS=https://makushinpadshop.netlify.app
ADMIN_CORS=http://localhost:7001

# Email (optional)
EMAIL_PROVIDER=gmail
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
BUSINESS_EMAIL=your-business@email.com
```

## 📁 Project Structure

```
shin-shop/
├── 📂 src/                    # Frontend source code
│   ├── 📂 components/         # React components
│   ├── 📂 contexts/           # React Context providers
│   ├── 📂 pages/              # Gatsby pages
│   ├── 📂 services/           # API services
│   └── 📂 utils/              # Utility functions
├── 📂 medusa-backend/         # Medusa.js backend
│   ├── 📂 src/                # Backend source code
│   ├── 📂 data/               # Seed data
│   └── 📄 render.yaml         # Render deployment config
├── 📂 docs/                   # Documentation
├── 📂 deployment/             # Deployment scripts
├── 📂 archive/                # Archived files
└── 📄 netlify.toml           # Netlify deployment config
```

## 🔒 Security

- Regular dependency audits with `npm audit`
- Security overrides for vulnerable packages
- Secure payment processing via Mollie
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
