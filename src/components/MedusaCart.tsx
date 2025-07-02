/**
 * Medusa Cart Component
 * Replaces Snipcart with Medusa.js cart functionality
 */

import React, { useState } from 'react';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatPrice } from '../utils/priceUtils';

interface MedusaCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const MedusaCart: React.FC<MedusaCartProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { cart, itemCount, isLoading, updateCartItem, removeFromCart } = useCart();
  const { currency } = useCurrency();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  /**
   * Handle quantity update
   */
  const handleQuantityUpdate = async (lineItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemoveItem(lineItemId);
      return;
    }

    try {
      setUpdatingItems(prev => new Set(prev).add(lineItemId));
      await updateCartItem(lineItemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(lineItemId);
        return newSet;
      });
    }
  };

  /**
   * Handle item removal
   */
  const handleRemoveItem = async (lineItemId: string) => {
    try {
      setUpdatingItems(prev => new Set(prev).add(lineItemId));
      await removeFromCart(lineItemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(lineItemId);
        return newSet;
      });
    }
  };

  /**
   * Handle checkout
   */
  const handleCheckout = () => {
    // Navigate to checkout page (you'll implement this)
    window.location.href = '/checkout';
  };

  /**
   * Format price for display
   */
  const formatCartPrice = (amount: number, currencyCode: string) => {
    return formatPrice(amount / 100, currencyCode.toLowerCase() as 'czk' | 'eur');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {t('common:cart.title')} ({itemCount})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>{t('common:cart.empty')}</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 border-b pb-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    {item.thumbnail ? (
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">IMG</span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">{item.title}</h3>
                    
                    {/* Show customization metadata */}
                    {item.metadata && Object.keys(item.metadata).length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {Object.entries(item.metadata).map(([key, value]) => (
                          <div key={key}>
                            {key}: {String(value)}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                          disabled={updatingItems.has(item.id)}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="text-sm w-8 text-center">
                          {updatingItems.has(item.id) ? '...' : item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                          disabled={updatingItems.has(item.id)}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {formatCartPrice(item.total, cart.currency_code)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={updatingItems.has(item.id)}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Totals and Checkout */}
        {cart && cart.items.length > 0 && (
          <div className="border-t p-4 space-y-3">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('common:cart.subtotal')}</span>
                <span>{formatCartPrice(cart.subtotal, cart.currency_code)}</span>
              </div>
              
              {cart.shipping_total > 0 && (
                <div className="flex justify-between text-sm">
                  <span>{t('common:cart.shipping')}</span>
                  <span>{formatCartPrice(cart.shipping_total, cart.currency_code)}</span>
                </div>
              )}
              
              {cart.tax_total > 0 && (
                <div className="flex justify-between text-sm">
                  <span>{t('common:cart.tax')}</span>
                  <span>{formatCartPrice(cart.tax_total, cart.currency_code)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>{t('common:cart.total')}</span>
                <span>{formatCartPrice(cart.total, cart.currency_code)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full btn btn-primary py-3 disabled:opacity-50"
            >
              {isLoading ? t('common:buttons.loading') : t('common:buttons.checkout')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MedusaCart;
