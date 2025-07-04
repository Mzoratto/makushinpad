/**
 * Cart Button Component for Supabase
 * Displays cart button with item count and opens cart sidebar
 */

import React, { useState } from 'react';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { useCart } from '../contexts/CartContext';
import CartSidebar from './CartSidebar';

const CartButton: React.FC = () => {
  const { t } = useTranslation();
  const { itemCount, isLoading } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  return (
    <>
      <button 
        onClick={handleCartClick}
        className="flex items-center hover:text-gray-200 relative"
        disabled={isLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {t('common:navigation.cart')} ({isLoading ? '...' : itemCount})
        
        {/* Cart item count badge */}
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={handleCartClose} />
    </>
  );
};

export default CartButton;
