# 📚 API Reference - The Shin Shop

Complete API reference for The Shin Shop backend services.

## Base URLs

- **Development:** `http://localhost:54321/functions/v1`
- **Production:** `https://your-project.supabase.co/functions/v1`

## Authentication

All API requests require a Bearer token:

```bash
Authorization: Bearer your_supabase_anon_key
```

## Products API

### Get All Products

```http
GET /products
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**
```json
{
  "products": [
    {
      "id": "uuid",
      "title": "Professional Shin Pads",
      "description": "High-quality professional shin pads...",
      "handle": "professional-shin-pads",
      "status": "published",
      "images": [
        {
          "url": "/images/product.jpg",
          "alt": "Product image"
        }
      ],
      "variants": [
        {
          "id": "uuid",
          "title": "Professional Shin Pads - Small",
          "sku": "PROF-SHIN-S",
          "price": 799,
          "inventory_quantity": 50
        }
      ],
      "options": [
        {
          "id": "uuid",
          "title": "Size",
          "values": [
            {
              "id": "uuid",
              "value": "Small"
            }
          ]
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  }
}
```

### Get Single Product

```http
GET /products/{id}
```

**Parameters:**
- `id`: Product ID or handle

**Response:**
```json
{
  "product": {
    "id": "uuid",
    "title": "Professional Shin Pads",
    // ... full product object
  }
}
```

## Cart API

### Get Cart

```http
GET /cart/{cartId}
```

**Parameters:**
- `cartId` (optional): Cart ID. If not provided, creates new cart.

**Response:**
```json
{
  "cart": {
    "id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "items": [
      {
        "id": "uuid",
        "cart_id": "uuid",
        "variant_id": "uuid",
        "quantity": 2,
        "unit_price": 799,
        "title": "Professional Shin Pads - Small"
      }
    ]
  }
}
```

### Add to Cart

```http
POST /cart/{cartId}
```

**Request Body:**
```json
{
  "variant_id": "uuid",
  "quantity": 1
}
```

**Response:**
```json
{
  "item": {
    "id": "uuid",
    "cart_id": "uuid",
    "variant_id": "uuid",
    "quantity": 1,
    "unit_price": 799,
    "title": "Professional Shin Pads - Small"
  },
  "cart_id": "uuid"
}
```

### Update Cart Item

```http
PUT /cart/{cartId}/items/{itemId}
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true
}
```

### Remove Cart Item

```http
DELETE /cart/{cartId}/items/{itemId}
```

**Response:**
```json
{
  "success": true
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- **Development:** No limits
- **Production:** 100 requests per minute per IP

## Data Types

### Product
```typescript
interface Product {
  id: string
  title: string
  description?: string
  handle: string
  status: 'draft' | 'published' | 'archived'
  images: ProductImage[]
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  variants?: ProductVariant[]
  options?: ProductOption[]
}
```

### ProductVariant
```typescript
interface ProductVariant {
  id: string
  product_id: string
  title: string
  sku: string
  price: number
  compare_at_price?: number
  inventory_quantity: number
  weight: number
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}
```

### Cart
```typescript
interface Cart {
  id: string
  created_at: string
  updated_at: string
  items: CartItem[]
  metadata: Record<string, any>
}
```

### CartItem
```typescript
interface CartItem {
  id: string
  cart_id: string
  variant_id: string
  quantity: number
  unit_price: number
  title: string
  metadata: Record<string, any>
}
```

## Examples

### JavaScript/TypeScript

```typescript
// Get products
const response = await fetch('/functions/v1/products', {
  headers: {
    'Authorization': `Bearer ${process.env.GATSBY_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  }
})
const { products } = await response.json()

// Add to cart
const addToCart = async (cartId: string, variantId: string, quantity: number) => {
  const response = await fetch(`/functions/v1/cart/${cartId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GATSBY_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      variant_id: variantId,
      quantity
    })
  })
  return response.json()
}
```

### cURL

```bash
# Get products
curl -H "Authorization: Bearer your_anon_key" \
     https://your-project.supabase.co/functions/v1/products

# Add to cart
curl -X POST \
     -H "Authorization: Bearer your_anon_key" \
     -H "Content-Type: application/json" \
     -d '{"variant_id":"uuid","quantity":1}' \
     https://your-project.supabase.co/functions/v1/cart/cart-uuid
```

---

**For more examples, see our [GitHub repository](https://github.com/Mzoratto/makushinpad)**
