# Frontend Migration Guide: Snipcart to Medusa.js

This guide walks you through migrating your Gatsby frontend from Snipcart to Medusa.js integration.

## 🎯 Migration Overview

### What's Changing
- **E-commerce Backend**: Snipcart → Medusa.js API
- **Cart Management**: Snipcart widgets → React Context + Components
- **Product Data**: Static markdown → Dynamic API calls
- **Checkout Flow**: Snipcart hosted → Custom implementation

### What's Staying
- **Frontend Framework**: Gatsby.js (no changes)
- **Styling**: Tailwind CSS (no changes)
- **Internationalization**: react-i18next (no changes)
- **Currency Support**: CZK/EUR (enhanced)

## 📋 Migration Checklist

### ✅ Completed Components

#### Backend Integration
- [x] **Medusa Client** (`src/services/medusaClient.ts`)
- [x] **Cart Context** (`src/contexts/CartContext.tsx`)
- [x] **Price Utils** (`src/utils/priceUtils.ts` - enhanced)

#### UI Components
- [x] **Cart Button** (`src/components/CartButton.tsx`)
- [x] **Cart Sidebar** (`src/components/MedusaCart.tsx`)
- [x] **Product Card** (`src/components/MedusaProductCard.tsx`)
- [x] **Layout Updates** (`src/components/Layout.tsx`)

#### Translations
- [x] **English Translations** (`src/locales/en/common.json`)
- [x] **Czech Translations** (`src/locales/cz/common.json`)

### 🔄 In Progress

#### Pages to Update
- [ ] **Products Page** (`src/pages/products.tsx`)
- [ ] **Product Template** (`src/templates/product-template.tsx`)
- [ ] **Customize Page** (`src/pages/customize.tsx`)
- [ ] **Homepage** (`src/pages/index.tsx`)

#### New Pages to Create
- [ ] **Checkout Page** (`src/pages/checkout.tsx`)
- [ ] **Order Confirmation** (`src/pages/order-confirmation.tsx`)
- [ ] **Cart Page** (`src/pages/cart.tsx`) - optional

## 🔧 Implementation Steps

### Step 1: Environment Configuration

Add Medusa backend URL to your environment:

```bash
# .env.development
GATSBY_MEDUSA_BACKEND_URL=http://localhost:9000

# .env.production
GATSBY_MEDUSA_BACKEND_URL=https://your-medusa-backend.railway.app
```

### Step 2: Update gatsby-config.js

Add environment variable support:

```javascript
// gatsby-config.js
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  // ... existing config
  plugins: [
    // ... existing plugins
    {
      resolve: 'gatsby-plugin-env-variables',
      options: {
        allowList: ["GATSBY_MEDUSA_BACKEND_URL"]
      },
    },
  ],
}
```

### Step 3: Update Products Page

Replace static product queries with Medusa API calls:

```typescript
// src/pages/products.tsx
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import MedusaProductCard from '../components/MedusaProductCard';
import medusaClient, { MedusaProduct } from '../services/medusaClient';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { products } = await medusaClient.getProducts();
        setProducts(products);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>
        
        {loading ? (
          <div className="text-center">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <MedusaProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductsPage;
```

### Step 4: Create Checkout Page

```typescript
// src/pages/checkout.tsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useCart } from '../contexts/CartContext';
import { navigate } from 'gatsby';

const CheckoutPage: React.FC = () => {
  const { cart, completeCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/products');
    }
  }, [cart]);

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      const { order } = await completeCart();
      navigate(`/order-confirmation?order=${order.display_id}`);
    } catch (error) {
      console.error('Checkout failed:', error);
      // Handle error
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {/* Cart Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {/* Cart items display */}
        </div>

        {/* Checkout Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          {/* Checkout form */}
          
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full btn btn-primary mt-6"
          >
            {isProcessing ? 'Processing...' : 'Complete Order'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
```

### Step 5: Update Customize Page

Integrate with Medusa product variants:

```typescript
// src/pages/customize.tsx - Key changes
import { useCart } from '../contexts/CartContext';
import medusaClient from '../services/medusaClient';

// In your customize component:
const handleAddToCart = async (customizationData: any) => {
  try {
    // Get the customizable product variant
    const { product } = await medusaClient.getProductByHandle('custom-shin-pad-premium');
    const variant = product.variants[0]; // or selected variant

    // Add to cart with customization metadata
    await addToCart(variant.id, 1, {
      ...customizationData,
      customized: true,
    });

    // Navigate to cart or show success
    navigate('/cart');
  } catch (error) {
    console.error('Failed to add customized product:', error);
  }
};
```

## 🔄 Migration Strategy

### Phase 1: Parallel Implementation
1. **Keep Snipcart working** while implementing Medusa components
2. **Test Medusa components** on development environment
3. **Gradual replacement** of Snipcart components

### Phase 2: Feature Parity
1. **Ensure all Snipcart features** are replicated in Medusa
2. **Test checkout flow** end-to-end
3. **Verify email notifications** work correctly

### Phase 3: Switch Over
1. **Remove Snipcart scripts** from Layout
2. **Update all product pages** to use Medusa components
3. **Deploy and monitor** for issues

## 🧪 Testing Checklist

### Frontend Testing
- [ ] **Product listing** loads from Medusa API
- [ ] **Product details** display correctly
- [ ] **Add to cart** functionality works
- [ ] **Cart updates** in real-time
- [ ] **Currency switching** works
- [ ] **Language switching** works
- [ ] **Customization** integrates with cart

### Integration Testing
- [ ] **Backend API** responds correctly
- [ ] **Cart persistence** across page reloads
- [ ] **Checkout flow** completes successfully
- [ ] **Email notifications** are sent
- [ ] **Payment processing** works with Mollie

### Cross-browser Testing
- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (latest)
- [ ] **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🚨 Common Issues & Solutions

### Issue: Cart not persisting
**Solution**: Check localStorage and cart context implementation

### Issue: Products not loading
**Solution**: Verify Medusa backend URL and CORS settings

### Issue: Currency not switching
**Solution**: Ensure currency context is properly integrated

### Issue: Translations missing
**Solution**: Add missing keys to locale files

## 📚 Resources

### Documentation
- **Medusa.js Docs**: https://docs.medusajs.com/
- **Gatsby.js Docs**: https://www.gatsbyjs.com/docs/
- **React Context**: https://reactjs.org/docs/context.html

### Project Files
- **Medusa Client**: [`src/services/medusaClient.ts`](../src/services/medusaClient.ts)
- **Cart Context**: [`src/contexts/CartContext.tsx`](../src/contexts/CartContext.tsx)
- **Product Card**: [`src/components/MedusaProductCard.tsx`](../src/components/MedusaProductCard.tsx)

## 🎉 Success Criteria

Migration is complete when:
- ✅ **All pages** use Medusa.js instead of Snipcart
- ✅ **Cart functionality** works seamlessly
- ✅ **Checkout process** completes successfully
- ✅ **Email notifications** are sent
- ✅ **No Snipcart dependencies** remain
- ✅ **Performance** is maintained or improved
- ✅ **All tests** pass

---

**Next Steps**: Once frontend migration is complete, update deployment configuration and go live with the new system!
