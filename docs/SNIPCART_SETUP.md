# Snipcart Integration Guide for Shin Shop

This document provides detailed instructions for setting up and configuring Snipcart in the Shin Shop e-commerce website.

## Overview

Shin Shop uses Snipcart for its shopping cart and checkout functionality. Snipcart is loaded via CDN rather than as an npm package, which is a common approach for integrating Snipcart with static site generators like Gatsby.

## Implementation Details

### Current Implementation

1. **Script and Style Loading**:
   - Snipcart's JavaScript and CSS are loaded in the `<head>` section via the Helmet component in `src/pages/index.tsx`:
   ```jsx
   <Helmet>
     <title>Shin Shop - Customizable Shin Pads</title>
     <meta name="description" content="Premium customizable shin pads for sports enthusiasts. Express yourself with our unique designs and personalization options." />
     <script src="https://cdn.snipcart.com/themes/v3.3.1/default/snipcart.js"></script>
     <link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.3.1/default/snipcart.css" />
   </Helmet>
   ```

2. **Snipcart Container**:
   - The Snipcart container div is added at the bottom of the page in `src/pages/index.tsx`:
   ```jsx
   <div hidden id="snipcart" data-api-key="YOUR_SNIPCART_PUBLIC_API_KEY"></div>
   ```

3. **Cart Button**:
   - The cart button is implemented in the `Layout.tsx` component:
   ```jsx
   <button className="snipcart-checkout flex items-center hover:text-gray-200">
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
     </svg>
     Cart (<span className="snipcart-items-count">0</span>)
   </button>
   ```

4. **Product Data Attributes**:
   - Product data is passed to Snipcart via HTML data attributes in the `ProductCard.tsx` component:
   ```jsx
   <button
     className="btn btn-primary text-sm py-1 snipcart-add-item"
     data-item-id={id}
     data-item-price={price}
     data-item-url={`/products/${slug}`}
     data-item-description={description}
     data-item-image={image}
     data-item-name={title}
   >
     Add to Cart
   </button>
   ```

## Setup Instructions

### 1. Create a Snipcart Account

1. Go to [Snipcart's website](https://snipcart.com/) and sign up for an account
2. Complete the registration process
3. Verify your email address

### 2. Get Your API Key

1. Log in to your Snipcart dashboard
2. Navigate to **Account > API Keys**
3. Copy your **Public API Key**

### 3. Update the Project

1. Open `src/pages/index.tsx`
2. The API key has already been configured with your Snipcart public API key:
   ```jsx
   <div hidden id="snipcart" data-api-key="MDBkYzU2MzItMDA1YS00ZWU3LThjM2ItZDUwMTU1MzMyMzI5NjM4ODMzNjQxODcxNzUwODcz"></div>
   ```

### 4. Configure Snipcart Dashboard

1. **Domain Settings**:
   - In your Snipcart dashboard, go to **Store Setup > Domains & URLs**
   - Add your website domain (for development, you can use `localhost:8000`)

2. **Payment Gateway**:
   - Go to **Store Setup > Payment Gateways**
   - Configure your preferred payment processor (Stripe is recommended)

3. **Shipping**:
   - Go to **Store Setup > Shipping**
   - Set up your shipping zones and rates

4. **Taxes**:
   - Go to **Store Setup > Taxes**
   - Configure tax rates based on your business requirements

5. **Email Templates**:
   - Go to **Store Setup > Email Templates**
   - Customize the order confirmation and other notification emails

### 5. Testing Your Integration

1. **Test Mode**:
   - Snipcart provides a test mode for development
   - In test mode, you can simulate purchases without processing real payments
   - To enable test mode, add `data-config-modal-style="side"` to your Snipcart div

2. **Test Checkout Process**:
   - Add products to your cart
   - Proceed to checkout
   - Use Snipcart's test credit card: `4242 4242 4242 4242` (expiry: any future date, CVC: any 3 digits)
   - Complete the purchase

3. **Verify Order Data**:
   - Check your Snipcart dashboard to ensure orders are being recorded correctly
   - Verify that product details, including customization options, are properly captured

## Customization Options

### Product Metadata

For the shin pad customization features, you'll need to pass additional metadata to Snipcart:

```jsx
<button
  className="snipcart-add-item"
  data-item-id={id}
  data-item-price={price}
  data-item-url={`/products/${slug}`}
  data-item-description={description}
  data-item-image={image}
  data-item-name={title}
  data-item-custom1-name="Custom Text"
  data-item-custom1-value={customText}
  data-item-custom2-name="Text Color"
  data-item-custom2-value={textColor}
  data-item-custom3-name="Font"
  data-item-custom3-value={textFont}
>
  Add to Cart
</button>
```

### Handling Image Uploads

For image uploads, you'll need to:

1. Upload the image to your server or a cloud storage service
2. Pass the image URL as custom data to Snipcart
3. Store the association between the order and the uploaded image

## Troubleshooting

### Common Issues

1. **Cart Not Showing**:
   - Ensure the Snipcart scripts are properly loaded
   - Check browser console for any JavaScript errors
   - Verify your API key is correct

2. **Products Not Adding to Cart**:
   - Ensure all required data attributes are present
   - Check that product URLs are accessible
   - Verify price format (should be a number without currency symbol)

3. **Customization Data Not Saving**:
   - Ensure custom data attributes are properly formatted
   - Check that custom data is being passed correctly to Snipcart

## Resources

- [Snipcart Documentation](https://docs.snipcart.com/)
- [Snipcart + Gatsby Integration Guide](https://snipcart.com/blog/gatsby-ecommerce-tutorial)
- [Snipcart API Reference](https://docs.snipcart.com/v3/api-reference/introduction)
