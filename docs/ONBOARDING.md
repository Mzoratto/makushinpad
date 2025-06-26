# Shin Shop - Team Onboarding Guide

Welcome to the Shin Shop development team! This guide will help you get up and running quickly with our Gatsby-based e-commerce platform.

## 🎯 Project Overview

Shin Shop is a modern e-commerce website for customizable shin pads built with:
- **Frontend**: Gatsby.js 5.14.x, React 18.2.0, TypeScript
- **Styling**: Tailwind CSS
- **E-commerce**: Snipcart with Stripe payments
- **Internationalization**: English (EN) and Czech (CZ) support
- **Customization**: React-Konva for interactive product customization

## 🔧 Development Environment Setup

### 1. Prerequisites Installation

**CRITICAL**: This project requires specific Node.js version for compatibility.

```bash
# Install Node Version Manager (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal or run:
source ~/.bashrc  # or ~/.zshrc

# Install and use the required Node.js version
nvm install 20.18.0
nvm use 20.18.0
nvm alias default 20.18.0

# Verify installation
node --version  # Should show: v20.18.0
npm --version   # Should show: v10.x.x
```

### 2. Project Setup

```bash
# Clone the repository
git clone <repository-url>
cd shinshop

# IMPORTANT: Use the project's Node.js version
nvm use  # This reads from .nvmrc file

# Install dependencies
npm install

# Start development server
npm run develop

# Open browser to http://localhost:8000
```

### 3. Available Scripts

```bash
npm run develop      # Start development server
npm run build        # Build for production
npm run build:prod   # Production build with npm ci
npm run serve        # Serve production build locally
npm run clean        # Clean Gatsby cache
npm run typecheck    # Run TypeScript checks
npm run audit:security  # Check for security vulnerabilities
npm run test:build   # Test production build locally
```

## 📁 Project Structure

```
shinshop/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Layout.tsx      # Main layout with i18n header
│   │   ├── LanguageSwitcher.tsx  # Language toggle
│   │   ├── ProductCard.tsx # Product display component
│   │   └── CustomizationCanvas.tsx  # React-Konva canvas
│   ├── pages/              # Gatsby pages (auto-routing)
│   │   ├── index.tsx       # Homepage
│   │   ├── products.tsx    # Product listing
│   │   ├── customize.tsx   # Customization interface
│   │   ├── about.tsx       # About page
│   │   ├── contact.tsx     # Contact form
│   │   └── 404.tsx         # Error page
│   ├── templates/          # Page templates
│   │   └── product-template.tsx  # Individual product pages
│   ├── locales/            # i18n translation files
│   │   ├── en/             # English translations
│   │   │   ├── common.json # Navigation, buttons, common UI
│   │   │   ├── pages.json  # Page-specific content
│   │   │   └── products.json  # Product-related translations
│   │   └── cz/             # Czech translations
│   │       ├── common.json
│   │       ├── pages.json
│   │       └── products.json
│   ├── styles/             # Global styles and Tailwind config
│   └── images/             # Static images
├── content/                # Markdown content
│   └── products/           # Product markdown files
│       ├── classic-black.md
│       ├── fire-dragon.md
│       ├── blue-wave.md
│       ├── pro-defender.md
│       └── cz/             # Czech product translations
│           ├── classic-black.md
│           ├── fire-dragon.md
│           ├── blue-wave.md
│           └── pro-defender.md
├── static/                 # Static assets
├── gatsby-config.js        # Gatsby configuration
├── gatsby-node.js          # Gatsby Node API (SSR config)
├── gatsby-browser.js       # Browser APIs (i18n init)
├── gatsby-ssr.js          # SSR APIs (i18n init)
├── tailwind.config.js     # Tailwind CSS configuration
├── package.json           # Dependencies and scripts
├── .nvmrc                 # Node.js version specification
├── README.md              # Project documentation
├── DEPLOYMENT.md          # Deployment guide
└── ONBOARDING.md          # This file
```

## 🌐 Internationalization (i18n)

### Language Support
- **English (EN)**: Default language, routes: `/`, `/products`, `/about`
- **Czech (CZ)**: Secondary language, routes: `/cz/`, `/cz/products`, `/cz/about`

### Working with Translations

1. **Adding New Translation Keys**:
   ```json
   // src/locales/en/common.json
   {
     "buttons": {
       "newButton": "Click Me"
     }
   }
   
   // src/locales/cz/common.json
   {
     "buttons": {
       "newButton": "Klikněte na mě"
     }
   }
   ```

2. **Using Translations in Components**:
   ```tsx
   import { useTranslation } from 'react-i18next';
   
   const MyComponent = () => {
     const { t } = useTranslation(['common', 'pages']);
     
     return (
       <button>{t('common:buttons.newButton')}</button>
     );
   };
   ```

3. **Language Switching**:
   - Language switcher is in the header
   - URLs automatically update with language prefix
   - Currency changes automatically (USD/CZK)

## 🛒 E-commerce Integration

### Snipcart Configuration
- **API Key**: Configured in Layout.tsx
- **Currency**: Automatically switches based on language
- **Products**: Defined in markdown files with frontmatter

### Adding New Products

1. **Create Product Markdown File**:
   ```markdown
   ---
   id: "shin-005"
   title: "New Shin Pad Design"
   slug: "new-design"
   sizes:
     - name: "Small"
       code: "S"
       price: 29.99
     - name: "Medium"
       code: "M"
       price: 34.99
   defaultPrice: 29.99
   image: "../../src/images/products/new-design.png"
   customizable: true
   featured: false
   ---
   
   Product description goes here...
   ```

2. **Create Czech Translation**:
   - Copy to `content/products/cz/new-design.md`
   - Translate title, description, and size names
   - Convert prices to CZK (multiply by ~25)

3. **Add Product Image**:
   - Place image in `src/images/products/`
   - Use PNG format, 400x300px recommended

## 🎨 Customization Features

### React-Konva Integration
- **Canvas Component**: `src/components/CustomizationCanvas.tsx`
- **SSR Handling**: Excluded from server-side rendering
- **Features**: Image upload, text addition, drag/resize/rotate

### Working with Customization
- Canvas is client-side only (uses @loadable/component)
- Customization data is serialized for Snipcart
- Images are processed and scaled automatically

## 🔧 Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow existing configuration
- **Prettier**: Auto-formatting on save
- **Components**: Use functional components with hooks

### Git Workflow
1. Create feature branch from `main`
2. Make changes and test locally
3. Run type checking: `npm run typecheck`
4. Run security audit: `npm run audit:security`
5. Test production build: `npm run test:build`
6. Create pull request

### Testing Checklist
- [ ] All pages load in both languages
- [ ] Language switcher works correctly
- [ ] Shopping cart functionality works
- [ ] Customization canvas loads without errors
- [ ] Forms submit successfully
- [ ] No TypeScript errors
- [ ] No security vulnerabilities

## 🚨 Common Issues & Solutions

### 1. Node.js Version Issues
**Problem**: Build fails or dependencies don't install
**Solution**: 
```bash
nvm use 20.18.0
rm -rf node_modules package-lock.json
npm install
```

### 2. i18n Not Working
**Problem**: Translations don't appear
**Solution**: 
- Check translation files exist in both languages
- Verify translation keys match exactly
- Restart development server

### 3. React-Konva SSR Errors
**Problem**: Canvas component fails during build
**Solution**: 
- Ensure component is wrapped with @loadable/component
- Check gatsby-node.js webpack configuration

### 4. Snipcart Not Loading
**Problem**: Shopping cart doesn't work
**Solution**: 
- Verify API key in Layout.tsx
- Check browser console for errors
- Ensure product data attributes are correct

## 📚 Learning Resources

### Documentation
- [Gatsby.js Documentation](https://www.gatsbyjs.com/docs/)
- [React i18next](https://react.i18next.com/)
- [Snipcart Documentation](https://docs.snipcart.com/)
- [React-Konva](https://konvajs.org/docs/react/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Team Communication
- **Issues**: Use GitHub Issues for bug reports
- **Features**: Discuss in team meetings before implementation
- **Questions**: Ask in team chat or create documentation

## 🎯 Next Steps

After completing this onboarding:
1. Set up your development environment
2. Run the project locally
3. Explore the codebase structure
4. Try making a small change (add a translation key)
5. Test the production build process
6. Review the deployment documentation

Welcome to the team! 🚀
