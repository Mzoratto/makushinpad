# Shin Shop - Production Deployment Guide

This guide provides comprehensive instructions for deploying the Shin Shop e-commerce website to production environments.

## 🔧 Prerequisites

### Required Software Versions
- **Node.js**: v20.18.0 LTS (REQUIRED - do not use v22+)
- **npm**: v10.x or higher
- **Git**: Latest version

### Environment Setup
```bash
# Install and use the correct Node.js version
nvm install 20.18.0
nvm use 20.18.0
nvm alias default 20.18.0

# Verify versions
node --version  # Should output: v20.18.0
npm --version   # Should output: v10.x.x
```

## 🚀 Deployment Process

### 1. Pre-deployment Checklist
- [ ] Verify Node.js version is 20.18.0
- [ ] Run security audit: `npm run audit:security`
- [ ] Test production build locally: `npm run test:build`
- [ ] Verify all i18n routes work in both languages
- [ ] Check Snipcart API key is configured
- [ ] Ensure all environment variables are set

### 2. Production Build
```bash
# Clone the repository
git clone <repository-url>
cd shinshop

# Use the correct Node.js version
nvm use

# Install dependencies (use npm ci for production)
npm ci

# Run production build
npm run build:prod
```

### 3. Environment Variables
Create a `.env.production` file with the following variables:

```bash
# Snipcart Configuration
GATSBY_SNIPCART_API_KEY=MDBkYzU2MzItMDA1YS00ZWU3LThjM2ItZDUwMTU1MzMyMzI5NjM4ODMzNjQxODcxNzUwODcz

# Site Configuration
GATSBY_SITE_URL=https://your-domain.com

# Optional: Analytics
GATSBY_GOOGLE_ANALYTICS_ID=your-ga-id
```

## 🌐 Platform-Specific Deployment

### Netlify (Recommended)
1. **Build Settings**:
   - Build command: `npm run build:prod`
   - Publish directory: `public`
   - Node version: `20.18.0`

2. **Environment Variables**:
   - Add all variables from `.env.production`
   - Set `NODE_VERSION=20.18.0`

3. **Build Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build:prod"
  publish = "public"

[build.environment]
  NODE_VERSION = "20.18.0"
  NPM_VERSION = "10.8.2"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel
1. **Build Settings**:
   - Framework Preset: Gatsby
   - Build Command: `npm run build:prod`
   - Output Directory: `public`
   - Node.js Version: `20.x`

2. **Environment Variables**:
   - Add all variables from `.env.production`

### GitHub Pages
1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20.18.0'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          GATSBY_SNIPCART_API_KEY: ${{ secrets.GATSBY_SNIPCART_API_KEY }}
          GATSBY_SITE_URL: ${{ secrets.GATSBY_SITE_URL }}
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

## 🔒 Security Considerations

### 1. Dependency Security
```bash
# Run security audit before deployment
npm audit --audit-level=moderate

# Fix vulnerabilities if found
npm audit fix
```

### 2. Environment Variables
- Never commit `.env` files to version control
- Use platform-specific environment variable settings
- Rotate API keys regularly

### 3. Content Security Policy
Add CSP headers for enhanced security:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.snipcart.com; style-src 'self' 'unsafe-inline' https://cdn.snipcart.com; img-src 'self' data: https:; connect-src 'self' https://app.snipcart.com;
```

## 🌍 Internationalization (i18n) Deployment

### Supported Languages
- **English (EN)**: Default language, routes: `/`, `/products`, `/about`, etc.
- **Czech (CZ)**: Secondary language, routes: `/cz/`, `/cz/products`, `/cz/about`, etc.

### Currency Configuration
- **English**: USD currency
- **Czech**: CZK currency (automatically configured via Snipcart)

### SEO Considerations
- Each language has separate meta tags and descriptions
- Proper hreflang tags are generated automatically
- Sitemap includes all language variants

## 📊 Performance Optimization

### Build Optimization
- Static site generation (SSG) for all pages
- Automatic code splitting
- Image optimization with Gatsby Image
- CSS and JavaScript minification

### CDN Configuration
- Configure CDN for static assets
- Enable gzip compression
- Set appropriate cache headers

## 🔍 Monitoring & Analytics

### Performance Monitoring
- Set up Lighthouse CI for performance monitoring
- Monitor Core Web Vitals
- Track build times and bundle sizes

### Error Tracking
- Configure error tracking (Sentry, LogRocket, etc.)
- Monitor 404 errors and broken links
- Track JavaScript errors

## 🚨 Troubleshooting

### Common Issues

1. **Node.js Version Mismatch**
   ```bash
   # Solution: Use the correct Node.js version
   nvm use 20.18.0
   ```

2. **Build Failures**
   ```bash
   # Solution: Clean cache and rebuild
   npm run clean
   npm ci
   npm run build
   ```

3. **i18n Routes Not Working**
   - Verify translation files exist in `src/locales/`
   - Check gatsby-config.js i18n configuration
   - Ensure all pages use translation hooks

4. **Snipcart Not Loading**
   - Verify API key is correct
   - Check network requests in browser dev tools
   - Ensure Snipcart domain is whitelisted

### Support Contacts
- **Technical Issues**: Create GitHub issue
- **Snipcart Support**: https://snipcart.com/support
- **Deployment Help**: Check platform-specific documentation

## 📋 Post-Deployment Checklist
- [ ] All pages load correctly in both languages
- [ ] Language switcher works on all pages
- [ ] Shopping cart functionality works
- [ ] Contact forms submit successfully
- [ ] Customization canvas loads without errors
- [ ] All product pages display correctly
- [ ] 404 page works for invalid routes
- [ ] Performance scores are acceptable (Lighthouse > 90)
- [ ] SEO meta tags are correct for both languages
