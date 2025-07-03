/**
 * Supabase Client for Shin Shop Frontend
 * This service handles all API communication with the Supabase backend
 */

import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = process.env.GATSBY_SUPABASE_URL || ''
const supabaseAnonKey = process.env.GATSBY_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Product {
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

export interface ProductImage {
  url: string
  alt: string
}

export interface ProductVariant {
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

export interface ProductOption {
  id: string
  product_id: string
  name: string
  position: number
  values: ProductOptionValue[]
}

export interface ProductOptionValue {
  id: string
  option_id: string
  value: string
  position: number
}

export interface Cart {
  id: string
  customer_id?: string
  session_id?: string
  currency_code: string
  metadata: Record<string, any>
  items: CartItem[]
  subtotal: number
  total: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  cart_id: string
  product_variant_id: string
  quantity: number
  created_at: string
  updated_at: string
  variant?: ProductVariant & {
    product: Pick<Product, 'id' | 'title' | 'images'>
  }
}

export interface Order {
  id: string
  order_number: string
  customer_id?: string
  email: string
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  currency_code: string
  subtotal: number
  tax_total: number
  shipping_total: number
  discount_total: number
  total: number
  billing_address?: Address
  shipping_address?: Address
  payment_intent_id?: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  line_items?: OrderLineItem[]
}

export interface OrderLineItem {
  id: string
  order_id: string
  product_variant_id?: string
  title: string
  variant_title?: string
  quantity: number
  unit_price: number
  total: number
  metadata: Record<string, any>
  created_at: string
}

export interface Address {
  first_name: string
  last_name: string
  company?: string
  address_1: string
  address_2?: string
  city: string
  country_code: string
  province?: string
  postal_code: string
  phone?: string
}

/**
 * Product API functions
 */
export class ProductService {
  /**
   * Get all published products
   */
  static async getProducts(page = 1, limit = 10): Promise<{
    products: Product[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }> {
    const response = await fetch(`${supabaseUrl}/functions/v1/products?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get single product by ID or handle
   */
  static async getProduct(identifier: string): Promise<Product> {
    const response = await fetch(`${supabaseUrl}/functions/v1/products/${identifier}`, {
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`)
    }

    const data = await response.json()
    return data.product
  }

  /**
   * Get product by handle (for Gatsby page generation)
   */
  static async getProductByHandle(handle: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        variants:product_variants(*),
        options:product_options(
          *,
          values:product_option_values(*)
        )
      `)
      .eq('handle', handle)
      .eq('status', 'published')
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }

    return data
  }
}

/**
 * Cart API functions
 */
export class CartService {
  /**
   * Get cart by ID
   */
  static async getCart(cartId?: string): Promise<Cart> {
    const url = cartId 
      ? `${supabaseUrl}/functions/v1/cart/${cartId}`
      : `${supabaseUrl}/functions/v1/cart`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.statusText}`)
    }

    const data = await response.json()
    return data.cart
  }

  /**
   * Add item to cart
   */
  static async addToCart(cartId: string | undefined, variantId: string, quantity = 1): Promise<{
    item: CartItem
    cart_id: string
  }> {
    const url = cartId 
      ? `${supabaseUrl}/functions/v1/cart/${cartId}`
      : `${supabaseUrl}/functions/v1/cart`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        variant_id: variantId,
        quantity
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to add to cart: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItem(cartId: string, itemId: string, quantity: number): Promise<CartItem> {
    const response = await fetch(`${supabaseUrl}/functions/v1/cart/${cartId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        item_id: itemId,
        quantity
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to update cart item: ${response.statusText}`)
    }

    const data = await response.json()
    return data.item
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(cartId: string, itemId: string): Promise<void> {
    const response = await fetch(`${supabaseUrl}/functions/v1/cart/${cartId}/items`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        item_id: itemId
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to remove from cart: ${response.statusText}`)
    }
  }

  /**
   * Clear entire cart
   */
  static async clearCart(cartId: string): Promise<void> {
    const response = await fetch(`${supabaseUrl}/functions/v1/cart/${cartId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to clear cart: ${response.statusText}`)
    }
  }
}

export default supabase
