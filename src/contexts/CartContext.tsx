/**
 * Cart Context for Supabase Integration
 * This context manages cart state and provides cart operations throughout the app
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartService, Cart, CartItem } from '../services/supabaseClient';

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [itemCount, setItemCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);

  /**
   * Calculate item count from cart
   */
  const calculateItemCount = (cartData: Cart | null): number => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Calculate cart total
   */
  const getCartTotal = (): number => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.unit_price * item.quantity), 0);
  };

  /**
   * Load cart on component mount
   */
  useEffect(() => {
    loadCart();
  }, []);

  /**
   * Update item count when cart changes
   */
  useEffect(() => {
    setItemCount(calculateItemCount(cart));
  }, [cart]);

  /**
   * Load or create cart
   */
  const loadCart = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Get cart ID from localStorage or create new
      const storedCartId = localStorage.getItem('cart_id');

      let loadedCart: Cart;
      if (storedCartId) {
        try {
          loadedCart = await CartService.getCart(storedCartId);
          setCartId(storedCartId);
        } catch (err) {
          // Cart not found, create new one
          loadedCart = await CartService.getCart();
          setCartId(loadedCart.id);
          localStorage.setItem('cart_id', loadedCart.id);
        }
      } else {
        loadedCart = await CartService.getCart();
        setCartId(loadedCart.id);
        localStorage.setItem('cart_id', loadedCart.id);
      }

      setCart(loadedCart);
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add item to cart
   */
  const addToCart = async (
    variantId: string,
    quantity: number = 1
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await CartService.addToCart(cartId || undefined, variantId, quantity);

      // Update cart ID if it was created
      if (!cartId) {
        setCartId(result.cart_id);
        localStorage.setItem('cart_id', result.cart_id);
      }

      // Refresh cart to get updated state
      await refreshCart();

      console.log('Item added to cart successfully');
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update cart item quantity
   */
  const updateCartItem = async (itemId: string, quantity: number): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!cartId) throw new Error('No cart available');

      await CartService.updateCartItem(cartId, itemId, quantity);
      await refreshCart();
    } catch (err) {
      console.error('Failed to update cart item:', err);
      setError(err instanceof Error ? err.message : 'Failed to update cart item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = async (itemId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!cartId) throw new Error('No cart available');

      await CartService.removeFromCart(cartId, itemId);
      await refreshCart();
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove item from cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear cart
   */
  const clearCart = (): void => {
    localStorage.removeItem('cart_id');
    setCart(null);
    setCartId(null);
    setItemCount(0);
  };

  /**
   * Refresh cart data
   */
  const refreshCart = async (): Promise<void> => {
    if (!cartId) return;

    try {
      const updatedCart = await CartService.getCart(cartId);
      setCart(updatedCart);
    } catch (err) {
      console.error('Failed to refresh cart:', err);
      // If cart not found, clear local state
      clearCart();
    }
  };

  const value: CartContextType = {
    cart,
    itemCount,
    isLoading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook to use cart context
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
