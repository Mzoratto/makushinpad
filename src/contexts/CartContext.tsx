/**
 * Cart Context for Medusa.js Integration
 * This context manages cart state and provides cart operations throughout the app
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import medusaClient, { MedusaCart, MedusaLineItem } from '../services/medusaClient';

interface CartContextType {
  cart: MedusaCart | null;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (variantId: string, quantity?: number, metadata?: Record<string, any>) => Promise<void>;
  updateCartItem: (lineItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
  completeCart: () => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<MedusaCart | null>(null);
  const [itemCount, setItemCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Calculate item count from cart
   */
  const calculateItemCount = (cartData: MedusaCart | null): number => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce((total, item) => total + item.quantity, 0);
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
   * Load cart from Medusa backend
   */
  const loadCart = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { cart: cartData } = await medusaClient.getCart();
      setCart(cartData);
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
    quantity: number = 1, 
    metadata?: Record<string, any>
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const { cart: updatedCart } = await medusaClient.addToCart(variantId, quantity, metadata);
      setCart(updatedCart);
      
      // Show success message (you can customize this)
      console.log('Item added to cart successfully');
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
      throw err; // Re-throw so components can handle it
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update cart item quantity
   */
  const updateCartItem = async (lineItemId: string, quantity: number): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const { cart: updatedCart } = await medusaClient.updateCartItem(lineItemId, quantity);
      setCart(updatedCart);
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
  const removeFromCart = async (lineItemId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const { cart: updatedCart } = await medusaClient.removeFromCart(lineItemId);
      setCart(updatedCart);
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
    medusaClient.clearCart();
    setCart(null);
    setItemCount(0);
  };

  /**
   * Refresh cart data
   */
  const refreshCart = async (): Promise<void> => {
    await loadCart();
  };

  /**
   * Complete cart and create order
   */
  const completeCart = async (): Promise<any> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await medusaClient.completeCart();
      
      // Clear cart state after successful order
      setCart(null);
      setItemCount(0);
      
      return result;
    } catch (err) {
      console.error('Failed to complete cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete order');
      throw err;
    } finally {
      setIsLoading(false);
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
    completeCart,
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
