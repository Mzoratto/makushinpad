/**
 * Medusa.js Client for Shin Shop Frontend
 * This service handles all API communication with the Medusa.js backend
 */

export interface MedusaProduct {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  handle: string;
  thumbnail?: string;
  status: string;
  metadata?: Record<string, any>;
  variants: MedusaVariant[];
  options: MedusaOption[];
  tags?: MedusaTag[];
}

export interface MedusaVariant {
  id: string;
  title: string;
  sku: string;
  inventory_quantity: number;
  prices: MedusaPrice[];
  options: MedusaVariantOption[];
  metadata?: Record<string, any>;
}

export interface MedusaPrice {
  id: string;
  currency_code: string;
  amount: number;
  variant_id: string;
}

export interface MedusaOption {
  id: string;
  title: string;
  values: MedusaOptionValue[];
}

export interface MedusaOptionValue {
  id: string;
  value: string;
  option_id: string;
}

export interface MedusaVariantOption {
  option_id: string;
  value: string;
}

export interface MedusaTag {
  id: string;
  value: string;
}

export interface MedusaCart {
  id: string;
  email?: string;
  billing_address?: MedusaAddress;
  shipping_address?: MedusaAddress;
  items: MedusaLineItem[];
  region: MedusaRegion;
  currency_code: string;
  total: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  created_at: string;
  updated_at: string;
}

export interface MedusaLineItem {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  quantity: number;
  unit_price: number;
  total: number;
  variant: MedusaVariant;
  metadata?: Record<string, any>;
}

export interface MedusaAddress {
  id?: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  country_code: string;
  province?: string;
  postal_code: string;
  phone?: string;
}

export interface MedusaRegion {
  id: string;
  name: string;
  currency_code: string;
  countries: MedusaCountry[];
  payment_providers: MedusaPaymentProvider[];
}

export interface MedusaCountry {
  id: string;
  iso_2: string;
  iso_3: string;
  name: string;
}

export interface MedusaPaymentProvider {
  id: string;
  is_installed: boolean;
}

export interface MedusaOrder {
  id: string;
  display_id: number;
  status: string;
  email: string;
  currency_code: string;
  total: number;
  items: MedusaLineItem[];
  billing_address: MedusaAddress;
  shipping_address?: MedusaAddress;
  created_at: string;
}

/**
 * Medusa API Client
 */
class MedusaClient {
  private baseUrl: string;
  private cartId: string | null = null;

  constructor(baseUrl: string = process.env.GATSBY_MEDUSA_BACKEND_URL || 'http://localhost:9000') {
    this.baseUrl = baseUrl;
    this.loadCartFromStorage();
  }

  /**
   * Load cart ID from localStorage
   */
  private loadCartFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.cartId = localStorage.getItem('medusa_cart_id');
    }
  }

  /**
   * Save cart ID to localStorage
   */
  private saveCartToStorage(cartId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medusa_cart_id', cartId);
      this.cartId = cartId;
    }
  }

  /**
   * Clear cart from storage
   */
  private clearCartFromStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('medusa_cart_id');
      this.cartId = null;
    }
  }

  /**
   * Make API request to Medusa backend
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get all products
   */
  async getProducts(): Promise<{ products: MedusaProduct[] }> {
    return this.request<{ products: MedusaProduct[] }>('/store/products');
  }

  /**
   * Get product by handle
   */
  async getProductByHandle(handle: string): Promise<{ product: MedusaProduct }> {
    const products = await this.getProducts();
    const product = products.products.find(p => p.handle === handle);
    
    if (!product) {
      throw new Error(`Product not found: ${handle}`);
    }

    return { product };
  }

  /**
   * Get all regions
   */
  async getRegions(): Promise<{ regions: MedusaRegion[] }> {
    return this.request<{ regions: MedusaRegion[] }>('/store/regions');
  }

  /**
   * Create a new cart
   */
  async createCart(regionId?: string): Promise<{ cart: MedusaCart }> {
    const body: any = {};
    
    if (regionId) {
      body.region_id = regionId;
    }

    const result = await this.request<{ cart: MedusaCart }>('/store/carts', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    this.saveCartToStorage(result.cart.id);
    return result;
  }

  /**
   * Get current cart
   */
  async getCart(): Promise<{ cart: MedusaCart }> {
    if (!this.cartId) {
      return this.createCart();
    }

    try {
      return await this.request<{ cart: MedusaCart }>(`/store/carts/${this.cartId}`);
    } catch (error) {
      // If cart doesn't exist, create a new one
      console.warn('Cart not found, creating new cart');
      return this.createCart();
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(variantId: string, quantity: number = 1, metadata?: Record<string, any>): Promise<{ cart: MedusaCart }> {
    const cart = await this.getCart();

    const body: any = {
      variant_id: variantId,
      quantity,
    };

    if (metadata) {
      body.metadata = metadata;
    }

    return this.request<{ cart: MedusaCart }>(`/store/carts/${cart.cart.id}/line-items`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * Update cart item
   */
  async updateCartItem(lineItemId: string, quantity: number): Promise<{ cart: MedusaCart }> {
    const cart = await this.getCart();

    return this.request<{ cart: MedusaCart }>(`/store/carts/${cart.cart.id}/line-items/${lineItemId}`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(lineItemId: string): Promise<{ cart: MedusaCart }> {
    const cart = await this.getCart();

    return this.request<{ cart: MedusaCart }>(`/store/carts/${cart.cart.id}/line-items/${lineItemId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Complete cart (create order)
   */
  async completeCart(): Promise<{ order: MedusaOrder }> {
    const cart = await this.getCart();

    const result = await this.request<{ order: MedusaOrder }>(`/store/carts/${cart.cart.id}/complete`, {
      method: 'POST',
    });

    // Clear cart after successful order
    this.clearCartFromStorage();
    
    return result;
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    try {
      const { cart } = await this.getCart();
      return cart.items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Clear current cart
   */
  clearCart(): void {
    this.clearCartFromStorage();
  }
}

// Create singleton instance
const medusaClient = new MedusaClient();

export default medusaClient;
