# Shin Shop - E-commerce Website

A modern e-commerce website for customizable shin pads built with Gatsby.js, React, and Tailwind CSS with internationalization support for English and Czech.

## 🚀 Features

- **Product Catalog**: Browse through various shin pad designs
- **Customization Tool**: Interactive canvas for personalizing shin pads with images, text, and colors
- **Shopping Cart**: Integrated with Snipcart for seamless checkout
- **Payment Processing**: Secure payments through Stripe
- **Internationalization**: Full i18n support for English (EN) and Czech (CZ)
- **Language Switching**: Dynamic language toggle in header
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimized**: Built with Gatsby for fast loading times

## 🛠 Tech Stack

- **Frontend**: Gatsby.js 5.14.x, React 18.2.0, TypeScript
- **Styling**: Tailwind CSS
- **E-commerce**: Snipcart
- **Payments**: Stripe
- **Customization**: React-Konva 18.2.10, Konva.js 9.3.x
- **Internationalization**: react-i18next, gatsby-plugin-react-i18next
- **Content**: Markdown files for products

## 📋 Prerequisites

**IMPORTANT**: This project requires specific Node.js version for compatibility.

- **Node.js**: v20.x LTS (20.18.0 recommended)
- **npm**: v10.x or higher
- **nvm**: Recommended for Node.js version management

## 🚀 Getting Started

### 1. Node.js Version Setup

```bash
# Install and use Node.js 20.18.0
nvm install 20.18.0
nvm use 20.18.0
nvm alias default 20.18.0

# Verify versions
node --version  # Should show v20.18.0
npm --version   # Should show v10.x.x
```

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>
cd shinshop

# Install dependencies (use npm ci for production)
npm install

# Start the development server
npm run develop
```

### 3. Access the Application

- **Main site**: http://localhost:8000/
- **GraphiQL IDE**: http://localhost:8000/___graphql

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
src/
├── components/          # Reusable React components
│   ├── Layout.tsx      # Main layout with i18n header
│   ├── LanguageSwitcher.tsx  # Language toggle component
│   └── ...
├── pages/              # Gatsby pages
├── locales/            # i18n translation files
├── styles/             # Global styles and Tailwind config
├── images/             # Static images
└── templates/          # Page templates

content/
└── products/           # Product markdown files
```

## ⚙️ Configuration

### Snipcart Setup

1. Sign up for a Snipcart account
2. Add your public API key to the Snipcart script in `src/components/Layout.tsx`
3. Configure multi-language support in Snipcart dashboard

### Stripe Setup

1. Create a Stripe account
2. Configure your Stripe keys in Snipcart dashboard
3. Set up currency support for USD and CZK

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

```bash
# Snipcart
GATSBY_SNIPCART_API_KEY=your_snipcart_public_key

# Site URL
GATSBY_SITE_URL=https://your-domain.com
```

## 🔒 Security

- Regular dependency audits with `npm audit`
- Security overrides for vulnerable packages
- Secure payment processing via Snipcart/Stripe

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
