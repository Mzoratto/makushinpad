/**
 * Secure Supabase Client for Shin Shop Frontend
 * This service handles all API communication with proper security measures
 */

import { createClient } from '@supabase/supabase-js'

// Environment variables with validation
const supabaseUrl = process.env.GATSBY_SUPABASE_URL
const supabaseAnonKey = process.env.GATSBY_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables. Please check your .env file.')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch {
  throw new Error('Invalid GATSBY_SUPABASE_URL format')
}

// Create Supabase client with security options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'shin-shop-frontend'
    }
  }
})

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
  title: string
  values: ProductOptionValue[]
}

export interface ProductOptionValue {
  id: string
  option_id: string
  value: string
}

export interface Cart {
  id: string
  created_at: string
  updated_at: string
  items: CartItem[]
  metadata: Record<string, any>
}

export interface CartItem {
  id: string
  cart_id: string
  variant_id: string
  quantity: number
  unit_price: number
  title: string
  metadata: Record<string, any>
}

export interface Order {
  id: string
  cart_id: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  currency: string
  customer_email: string
  shipping_address: Record<string, any>
  billing_address: Record<string, any>
  created_at: string
  updated_at: string
}

/**
 * API Response wrapper for consistent error handling
 */
class ApiResponse<T> {
  constructor(
    public data: T | null,
    public error: string | null = null,
    public status: number = 200
  ) {}

  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponse(data, null, 200)
  }

  static error<T>(message: string, status: number = 400): ApiResponse<T> {
    return new ApiResponse(null, message, status)
  }
}

/**
 * Secure API call wrapper with error handling
 */
async function secureApiCall<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'X-Client-Info': 'shin-shop-frontend',
        ...options.headers
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      return ApiResponse.error(`API Error: ${response.status} - ${errorText}`, response.status)
    }

    const data = await response.json()
    return ApiResponse.success(data)
  } catch (error) {
    console.error('API call failed:', error)
    return ApiResponse.error(
      error instanceof Error ? error.message : 'Unknown API error'
    )
  }
}

/**
 * Product API functions with proper error handling
 */
export class ProductService {
  private static readonly baseUrl = `${supabaseUrl}/functions/v1`

  /**
   * Get all published products with pagination
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
    const response = await secureApiCall<{
      products: Product[]
      pagination: any
    }>(`${this.baseUrl}/products?page=${page}&limit=${limit}`)

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data!
  }

  /**
   * Get single product by ID or handle
   */
  static async getProduct(identifier: string): Promise<Product> {
    const response = await secureApiCall<{ product: Product }>(
      `${this.baseUrl}/products/${identifier}`
    )

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data!.product
  }
}

/**
 * Cart API functions with security measures
 */
export class CartService {
  private static readonly baseUrl = `${supabaseUrl}/functions/v1`

  /**
   * Get cart by ID or create new one
   */
  static async getCart(cartId?: string): Promise<Cart> {
    const url = cartId 
      ? `${this.baseUrl}/cart/${cartId}`
      : `${this.baseUrl}/cart`

    const response = await secureApiCall<{ cart: Cart }>(url)

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data!.cart
  }

  /**
   * Add item to cart with validation
   */
  static async addToCart(
    cartId: string | undefined, 
    variantId: string, 
    quantity = 1
  ): Promise<{ item: CartItem; cart_id: string }> {
    // Validate inputs
    if (!variantId) {
      throw new Error('Variant ID is required')
    }
    if (quantity < 1 || quantity > 99) {
      throw new Error('Quantity must be between 1 and 99')
    }

    const url = cartId 
      ? `${this.baseUrl}/cart/${cartId}`
      : `${this.baseUrl}/cart`

    const response = await secureApiCall<{ item: CartItem; cart_id: string }>(url, {
      method: 'POST',
      body: JSON.stringify({
        variant_id: variantId,
        quantity
      })
    })

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data!
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItem(
    cartId: string, 
    itemId: string, 
    quantity: number
  ): Promise<void> {
    if (quantity < 1 || quantity > 99) {
      throw new Error('Quantity must be between 1 and 99')
    }

    const response = await secureApiCall(
      `${this.baseUrl}/cart/${cartId}/items/${itemId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      }
    )

    if (response.error) {
      throw new Error(response.error)
    }
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(cartId: string, itemId: string): Promise<void> {
    const response = await secureApiCall(
      `${this.baseUrl}/cart/${cartId}/items/${itemId}`,
      { method: 'DELETE' }
    )

    if (response.error) {
      throw new Error(response.error)
    }
  }
}

export default supabase
