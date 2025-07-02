# Shin Pad Product Catalog Guide

This guide explains the complete product catalog structure for your Shin Shop, including all customization options and management tools.

## 🎯 Product Lineup Overview

Your shin pad catalog is designed with four distinct tiers to serve different customer segments:

### 1. **Youth Tier** - 399 CZK / 15.96 EUR
- **Target:** Young players (8-16 years)
- **Features:** Lightweight, fun customization, affordable
- **Sizes:** XXS, XS, S, M
- **Production:** 3-5 business days

### 2. **Standard Tier** - 599 CZK / 23.96 EUR  
- **Target:** Recreational players
- **Features:** Reliable protection, essential customization
- **Sizes:** XS, S, M, L
- **Production:** 3-5 business days

### 3. **Premium Tier** - 999 CZK / 39.96 EUR
- **Target:** Serious amateur players
- **Features:** High-quality materials, extensive customization
- **Sizes:** S, M, L, XL
- **Production:** 5-7 business days

### 4. **Professional Tier** - 1,499 CZK / 59.96 EUR
- **Target:** Professional and semi-professional players
- **Features:** Carbon fiber, maximum protection, unlimited customization
- **Sizes:** XS, S, M, L, XL, XXL
- **Production:** 7-10 business days

## 🎨 Customization Matrix

### Youth Tier Customization
```
✅ Size selection
✅ Player number (1-99)
✅ Left shin text (max 12 chars)
✅ Right shin text (max 12 chars)
✅ Favorite color
✅ Team name
✅ Additional requirements
```

### Standard Tier Customization
```
✅ Size selection
✅ Player number (1-99)
✅ Left shin text (max 15 chars)
✅ Right shin text (max 15 chars)
✅ Text color (hex)
✅ Additional requirements
```

### Premium Tier Customization
```
✅ Size selection
✅ Player number (1-99)
✅ Left shin text (max 20 chars)
✅ Right shin text (max 20 chars)
✅ Additional text
✅ Text color (hex)
✅ Backdrop color (hex)
✅ Font family selection
✅ Uploaded image (50MB max)
✅ Additional requirements
```

### Professional Tier Customization
```
✅ Size selection
✅ Player number (1-99)
✅ Left shin text (max 25 chars)
✅ Right shin text (max 25 chars)
✅ Additional text
✅ Text color (hex)
✅ Backdrop color (hex)
✅ Font family selection
✅ Font size selection
✅ Text style (bold, italic, etc.)
✅ Uploaded image (100MB max)
✅ Logo placement options
✅ Special finish options
✅ Additional requirements
```

## 📦 Product Management

### View Current Catalog
```bash
# Interactive product management
npm run products:manage

# View products via API
curl http://localhost:9000/store/products
```

### Load Enhanced Catalog
```bash
# Prepare enhanced seed data
npm run products:seed-enhanced

# Load enhanced products into database
npm run products:seed-enhanced-run
```

### Product Data Structure

Each product includes:

```javascript
{
  "title": "Custom Shin Pad - Professional",
  "subtitle": "Premium customizable shin pad for professional players",
  "description": "Detailed product description...",
  "handle": "custom-shin-pad-professional",
  "status": "published",
  "metadata": {
    "customizable": true,
    "tier": "professional",
    "protection_level": "maximum",
    "custom_fields": [...],
    "max_text_length": 25,
    "supported_image_formats": ["jpg", "png", "svg", "pdf"],
    "max_image_size": "100MB",
    "production_time": "7-10 business days",
    "features": [...]
  },
  "variants": [
    {
      "title": "Professional Shin Pad - M",
      "sku": "SHIN-PRO-M-CZK",
      "prices": [
        { "currency_code": "czk", "amount": 149900 },
        { "currency_code": "eur", "amount": 5996 }
      ]
    }
  ]
}
```

## 🏷️ SKU Convention

SKUs follow this pattern: `SHIN-{TIER}-{SIZE}-{CURRENCY}`

Examples:
- `SHIN-YOUTH-S-CZK` - Youth Small in CZK
- `SHIN-PRO-XL-CZK` - Professional XL in CZK
- `SHIN-STD-M-CZK` - Standard Medium in CZK

## 💰 Pricing Strategy

### Tier-Based Pricing
```
Youth:        399 CZK (15.96 EUR)
Standard:     599 CZK (23.96 EUR)  
Premium:      999 CZK (39.96 EUR)
Professional: 1,499 CZK (59.96 EUR)
```

### Currency Conversion
- **Base Currency:** CZK (Czech Koruna)
- **Secondary Currency:** EUR (Euro)
- **Exchange Rate:** ~25 CZK = 1 EUR (built into pricing)

### Competitive Analysis
```
Market Position:
Youth:        Entry-level, family-friendly
Standard:     Competitive with basic brands
Premium:      Premium market positioning
Professional: High-end, professional grade
```

## 📏 Size Guide

### Size Chart
```
XXS: Ages 6-8   (Youth only)
XS:  Ages 8-10  (Youth, Standard, Professional)
S:   Ages 10-12 (All tiers)
M:   Ages 12-14 (All tiers)
L:   Ages 14+   (Standard, Premium, Professional)
XL:  Adult      (Premium, Professional)
XXL: Adult+     (Professional only)
```

### Inventory Levels
```
High Demand: S, M, L (150+ units each)
Medium Demand: XS, XL (100 units each)
Low Demand: XXS, XXL (50 units each)
```

## 🎨 Customization Guidelines

### Text Limitations
- **Youth:** 12 characters max (simple, fun text)
- **Standard:** 15 characters max (basic customization)
- **Premium:** 20 characters max (advanced options)
- **Professional:** 25 characters max (unlimited creativity)

### Image Requirements
- **Formats:** JPG, PNG, SVG (PDF for Professional)
- **Size Limits:** 5MB (Youth) to 100MB (Professional)
- **Resolution:** Minimum 300 DPI for print quality
- **Color Mode:** RGB for digital, CMYK for print

### Font Options
```
Youth:        Basic fonts (Arial, Comic Sans)
Standard:     Standard fonts (Arial, Times)
Premium:      Extended fonts (Arial, Times, Helvetica, Impact)
Professional: Full font library + custom fonts
```

## 🔧 Management Tools

### Product Management Script
```bash
npm run products:manage
```

Features:
- View current catalog
- Product detail inspection
- Pricing comparison
- Customization analysis
- Enhanced catalog preview

### Enhanced Seeding
```bash
npm run products:seed-enhanced
```

Features:
- Validates product data
- Generates statistics
- Creates enhanced seed file
- Provides seeding instructions

## 📊 Analytics & Reporting

### Key Metrics to Track
- **Sales by Tier:** Which tiers are most popular
- **Size Distribution:** Most common sizes ordered
- **Customization Usage:** Which fields are used most
- **Production Time:** Actual vs. estimated delivery
- **Customer Satisfaction:** Reviews by tier

### Recommended Reports
1. **Monthly Sales by Tier**
2. **Customization Field Usage**
3. **Size Demand Analysis**
4. **Production Efficiency**
5. **Customer Feedback Summary**

## 🚀 Future Enhancements

### Planned Features
- **Seasonal Collections:** Limited edition designs
- **Team Packages:** Bulk orders with team branding
- **3D Preview:** Real-time customization preview
- **Size Recommendation:** AI-powered size suggestions
- **Express Production:** Rush orders for premium tiers

### Expansion Opportunities
- **Goalkeeper Gloves:** Complementary product line
- **Socks & Accessories:** Complete player kit
- **International Markets:** Expand beyond Czech Republic
- **B2B Sales:** Team and club partnerships

## 🛠️ Troubleshooting

### Common Issues

#### Products Not Showing
```bash
# Check if products are seeded
curl http://localhost:9000/store/products

# Reseed if needed
npm run seed
```

#### Customization Fields Missing
```bash
# Verify product metadata
npm run products:manage
# Select option 2 to view product details
```

#### Pricing Issues
```bash
# Check currency configuration
curl http://localhost:9000/store/regions
```

### Debug Commands
```bash
# View all products with details
npm run products:manage

# Check product validation
npm run products:seed-enhanced

# Test API endpoints
curl http://localhost:9000/store/products
curl http://localhost:9000/store/regions
```

## 📚 Documentation

- **[Medusa Product Guide](https://docs.medusajs.com/modules/products/overview)**
- **[Product Variants](https://docs.medusajs.com/modules/products/products#product-variants)**
- **[Product Metadata](https://docs.medusajs.com/modules/products/products#metadata)**

## 🎉 Success Criteria

Your product catalog is ready when:
- ✅ All four tiers are properly configured
- ✅ Customization metadata is complete
- ✅ Pricing is set for both CZK and EUR
- ✅ Size variants are available
- ✅ Products appear in admin panel
- ✅ API endpoints return product data
- ✅ Customization fields are properly defined

---

**Next Step:** Once your product catalog is set up, update your Gatsby frontend to use the new Medusa API!
