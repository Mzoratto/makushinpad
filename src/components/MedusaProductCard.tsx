/**
 * Medusa Product Card Component
 * Displays products from Medusa.js backend with proper pricing and add to cart functionality
 * Enhanced with accessibility, error handling, and performance optimizations
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Link, useTranslation } from 'gatsby-plugin-react-i18next';
import { useCurrency } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';
import { useNotifications } from './NotificationSystem';
import { LoadingButton } from './LoadingStates';
import { formatMedusaPrice, parseMedusaPrice } from '../utils/priceUtils';
import type { MedusaProduct, MedusaVariant } from '../services/medusaClient';

interface MedusaProductCardProps {
  product: MedusaProduct;
  showAddToCart?: boolean;
  className?: string;
  onAddToCart?: (product: MedusaProduct, variant: MedusaVariant) => void;
  priority?: boolean; // For image loading priority
}

const MedusaProductCard: React.FC<MedusaProductCardProps> = ({
  product,
  showAddToCart = true,
  className = '',
  onAddToCart,
  priority = false,
}) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const { addToCart, isLoading } = useCart();
  const { success, error: showError } = useNotifications();

  // Memoize initial variant selection
  const initialVariant = useMemo(() =>
    product.variants?.[0] || null,
    [product.variants]
  );

  const [selectedVariant, setSelectedVariant] = useState<MedusaVariant | null>(initialVariant);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  /**
   * Get the price for the current currency
   */
  const getCurrentPrice = (variant: MedusaVariant) => {
    const price = variant.prices.find(p => p.currency_code === currency.toLowerCase());
    return price ? price.amount : 0;
  };

  /**
   * Get the lowest price for "From" pricing
   */
  const getLowestPrice = () => {
    if (!product.variants || product.variants.length === 0) return 0;
    
    const prices = product.variants.map(variant => getCurrentPrice(variant));
    return Math.min(...prices);
  };

  /**
   * Check if we should show "From" pricing
   */
  const shouldShowFromPrice = () => {
    if (!product.variants || product.variants.length <= 1) return false;
    
    const prices = product.variants.map(variant => getCurrentPrice(variant));
    return new Set(prices).size > 1;
  };

  /**
   * Handle add to cart with proper error handling and user feedback
   */
  const handleAddToCart = useCallback(async () => {
    if (!selectedVariant) {
      showError(
        t('common:errors.noVariantSelected', 'No variant selected'),
        t('common:errors.selectVariantFirst', 'Please select a product variant first.')
      );
      return;
    }

    try {
      setIsAddingToCart(true);

      // Basic metadata - can be extended for customization
      const metadata = {
        product_title: product.title,
        variant_title: selectedVariant.title,
        tier: tier,
      };

      await addToCart(selectedVariant.id, 1, metadata);

      // Call optional callback
      if (onAddToCart) {
        onAddToCart(product, selectedVariant);
      }

      // Show success feedback
      success(
        t('common:cart.itemAdded', 'Added to cart'),
        t('common:cart.itemAddedMessage', '{{product}} has been added to your cart.', {
          product: product.title
        })
      );
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      showError(
        t('common:errors.addToCartFailed', 'Failed to add to cart'),
        error instanceof Error ? error.message : t('common:errors.tryAgainLater', 'Please try again later.')
      );
    } finally {
      setIsAddingToCart(false);
    }
  }, [selectedVariant, product, tier, addToCart, onAddToCart, success, showError, t]);

  /**
   * Handle variant selection
   */
  const handleVariantChange = useCallback((variantId: string) => {
    const variant = product.variants.find(v => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
    }
  }, [product.variants]);

  /**
   * Handle image error
   */
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  /**
   * Get product image URL with fallback
   */
  const getImageUrl = useMemo(() => {
    if (imageError) return null;
    return product.thumbnail || product.images?.[0]?.url || null;
  }, [product.thumbnail, product.images, imageError]);

  /**
   * Check if product is out of stock
   */
  const isOutOfStock = useMemo(() => {
    return !selectedVariant || !selectedVariant.inventory_quantity || selectedVariant.inventory_quantity <= 0;
  }, [selectedVariant]);

  /**
   * Get product tier from metadata (memoized)
   */
  const productTier = useMemo(() => {
    return product.metadata?.tier || 'standard';
  }, [product.metadata?.tier]);

  /**
   * Get tier badge color
   */
  const getTierBadgeColor = (tier: string) => {
    const colors = {
      youth: 'bg-green-100 text-green-800',
      standard: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      professional: 'bg-red-100 text-red-800',
    };
    return colors[tier as keyof typeof colors] || colors.standard;
  };

  const displayPrice = selectedVariant ? getCurrentPrice(selectedVariant) : getLowestPrice();
  const showFrom = shouldShowFromPrice() && !selectedVariant;
  const imageUrl = getImageUrl;

  return (
    <article
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}
      role="article"
      aria-labelledby={`product-title-${product.id}`}
    >
      {/* Product Image */}
      <div className="h-64 overflow-hidden relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={t('common:product.imageAlt', 'Product image for {{title}}', { title: product.title })}
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading={priority ? 'eager' : 'lazy'}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-500 text-sm">{t('common:product.noImage')}</span>
            </div>
          </div>
        )}

        {/* Tier Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${tierBadgeColor}`}>
          {productTier.toUpperCase()}
        </div>

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
            {t('common:buttons.outOfStock')}
          </div>
        )}

        {/* Customizable Badge */}
        {product.metadata?.customizable && (
          <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
            🎨 {t('common:product.customizable')}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.title}</h3>
        
        {product.subtitle && (
          <p className="text-sm text-gray-600 mb-2">{product.subtitle}</p>
        )}
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description || t('common:product.noDescription')}
        </p>

        {/* Variant Selection */}
        {product.variants && product.variants.length > 1 && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('common:product.size')}:
            </label>
            <select
              value={selectedVariant?.id || ''}
              onChange={(e) => handleVariantChange(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.options?.[0]?.value || variant.title} - {formatMedusaPrice(getCurrentPrice(variant), currency.toLowerCase())}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-primary font-bold text-lg">
              {showFrom ? `${t('common:product.from')} ` : ''}
              {formatMedusaPrice(displayPrice, currency.toLowerCase())}
            </span>
            
            {/* Production Time */}
            {product.metadata?.production_time && (
              <span className="text-xs text-gray-500">
                {t('common:product.productionTime')}: {product.metadata.production_time}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            {/* View Details Button */}
            <Link
              to={`/products/${product.handle}`}
              className="btn btn-outline text-sm py-1 px-3"
            >
              {t('common:buttons.viewDetails')}
            </Link>

            {/* Add to Cart Button */}
            {showAddToCart && selectedVariant && (
              <LoadingButton
                isLoading={isAddingToCart || isLoading}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                loadingText={t('common:buttons.adding')}
                className="btn-primary text-sm py-1 px-3"
                aria-label={t('common:buttons.addToCartAria', 'Add {{product}} to cart', { product: product.title })}
              >
                {isOutOfStock ? t('common:buttons.outOfStock') : t('common:buttons.addToCart')}
              </LoadingButton>
            )}
          </div>
        </div>

        {/* Stock Warning */}
        {selectedVariant && selectedVariant.inventory_quantity <= 5 && selectedVariant.inventory_quantity > 0 && (
          <div className="mt-2 text-xs text-orange-600">
            {t('common:product.lowStock', { count: selectedVariant.inventory_quantity })}
          </div>
        )}
      </div>
    </article>
  );
};

export default MedusaProductCard;
