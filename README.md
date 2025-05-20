# Shin Shop - Customizable Shin Pads E-commerce Website

A Gatsby-based e-commerce website for customizable shin pads, built with Tailwind CSS and Snipcart integration.

## Features

- Browse a catalog of shin pad designs
- View detailed product information
- Customize shin pads with personal images and text
- Shopping cart and checkout functionality via Snipcart
- Responsive design for all device sizes

## Tech Stack

- **Frontend Framework**: Gatsby.js with TypeScript
- **Styling**: Tailwind CSS
- **E-commerce**: Snipcart (loaded via CDN)
- **Payment Processing**: Stripe (via Snipcart)
- **Image Handling**: Gatsby Image
- **Content Management**: Markdown files

## Project Structure

```text
shinshop/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route pages
│   ├── templates/        # Page templates
│   ├── styles/           # Global styles
│   ├── images/           # Static images
│   └── data/             # Product data
├── static/               # Static assets
├── content/              # Markdown content
│   └── products/         # Product markdown files
├── gatsby-config.js      # Gatsby configuration
├── gatsby-node.js        # Gatsby node API
└── netlify.toml          # Netlify configuration
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shinshop.git
   cd shinshop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run develop
   ```

4. Open your browser and navigate to `http://localhost:8000`

## Customization

### Adding New Products

1. Create a new markdown file in `content/products/` with the following frontmatter:
   ```markdown
   ---
   id: "unique-id"
   title: "Product Title"
   slug: "product-slug"
   price: 29.99
   image: "../../src/images/products/image.png"
   customizable: true
   customizationOptions:
     - "image"
     - "text"
     - "color"
   featured: true
   ---

   Product description goes here...
   ```

2. Add the product image to `src/images/products/`

### Modifying Styles

- Global styles are defined in `src/styles/global.css`
- Tailwind configuration is in `tailwind.config.js`

## Deployment

### Netlify Deployment

1. Push your repository to GitHub
2. Connect your repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `public/`

## Snipcart Configuration

### Important Note on Snipcart Integration

This project uses Snipcart loaded via CDN rather than as an npm package. The Snipcart scripts and styles are loaded in the `<head>` section of the website through the Helmet component in `src/pages/index.tsx`.

### Setting Up Snipcart

1. Sign up for a Snipcart account at [snipcart.com](https://snipcart.com)
2. From your Snipcart dashboard, get your public API key
3. The Snipcart API key has already been configured in `src/pages/index.tsx`:

   ```jsx
   <div hidden id="snipcart" data-api-key="MDBkYzU2MzItMDA1YS00ZWU3LThjM2ItZDUwMTU1MzMyMzI5NjM4ODMzNjQxODcxNzUwODcz"></div>
   ```

4. Configure your Snipcart dashboard with:
   - Product settings
   - Shipping options
   - Payment gateways (Stripe is recommended)
   - Notification emails

### Testing Snipcart Integration

Before deploying to production:

1. Use Snipcart's test mode to verify the shopping cart functionality
2. Test the complete checkout process
3. Verify that product data is correctly passed to Snipcart
4. Check that customization options are included in the cart metadata

### Detailed Snipcart Setup Guide

For a comprehensive guide on setting up and configuring Snipcart for this project, see the [Snipcart Setup Guide](docs/SNIPCART_SETUP.md).
