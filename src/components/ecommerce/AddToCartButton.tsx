/**
 * Add to Cart Button Component
 * Handles adding products to cart with proper error handling and user feedback
 */

import React, { useState } from 'react';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { useCart } from '../../contexts/CartContext';
import { useNotifications } from '../NotificationSystem';
import { Button } from '../ui';
import { ProductVariant } from '../../services/supabaseClient';

interface AddToCartButtonProps {
  variant: ProductVariant;
  quantity?: number;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  variant,
  quantity = 1,
  size = 'md',
  fullWidth = false,
  className = '',
  onSuccess,
  onError,
}) => {
  const { t } = useTranslation();
  const { addToCart, isLoading } = useCart();
  const { showNotification } = useNotifications();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      await addToCart(variant.id, quantity);
      
      showNotification({
        type: 'success',
        title: t('cart.itemAdded'),
        message: t('cart.itemAddedMessage', { 
          item: variant.title,
          quantity 
        }),
      });
      
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
      
      showNotification({
        type: 'error',
        title: t('cart.addError'),
        message: errorMessage,
      });
      
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsAdding(false);
    }
  };

  const isDisabled = isLoading || isAdding || variant.inventory_quantity <= 0;
  
  const getButtonText = () => {
    if (isAdding) return t('cart.adding');
    if (variant.inventory_quantity <= 0) return t('cart.outOfStock');
    return t('cart.addToCart');
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isDisabled}
      isLoading={isAdding}
      loadingText={t('cart.adding')}
      size={size}
      fullWidth={fullWidth}
      className={className}
      leftIcon={
        !isAdding && variant.inventory_quantity > 0 ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ) : undefined
      }
    >
      {getButtonText()}
    </Button>
  );
};

export default AddToCartButton;
