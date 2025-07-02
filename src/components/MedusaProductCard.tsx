/**
 * Medusa Product Card Component
 * Displays products from Medusa.js backend with proper pricing and add to cart functionality
 */

import React, { useState } from 'react';
import { Link, useTranslation } from 'gatsby-plugin-react-i18next';
import { useCurrency } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';
import { formatMedusaPrice, parseMedusaPrice } from '../utils/priceUtils';
import type { MedusaProduct, MedusaVariant } from '../services/medusaClient';

interface MedusaProductCardProps {
  product: MedusaProduct;
  showAddToCart?: boolean;
  className?: string;
}

const MedusaProductCard: React.FC<MedusaProductCardProps> = ({
  product,
  showAddToCart = true,
  className = '',
}) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const { addToCart, isLoading } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<MedusaVariant | null>(
    product.variants?.[0] || null
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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
   * Handle add to cart
   */
  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    try {
      setIsAddingToCart(true);
      
      // Basic metadata - can be extended for customization
      const metadata = {
        product_title: product.title,
        variant_title: selectedVariant.title,
      };

      await addToCart(selectedVariant.id, 1, metadata);
      
      // Show success feedback (you can customize this)
      console.log('Product added to cart successfully');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      // Show error feedback (you can customize this)
    } finally {
      setIsAddingToCart(false);
    }
  };

  /**
   * Handle variant selection
   */
  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.find(v => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  /**
   * Get product tier from metadata
   */
  const getProductTier = () => {
    return product.metadata?.tier || 'standard';
  };

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
  const tier = getProductTier();

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}>
      {/* Product Image */}
      <div className="h-64 overflow-hidden relative">
        {product.thumbnail ? (
          <img 
            src={product.thumbnail} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">{t('common:product.noImage')}</span>
          </div>
        )}
        
        {/* Tier Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getTierBadgeColor(tier)}`}>
          {tier.toUpperCase()}
        </div>

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
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || isLoading || selectedVariant.inventory_quantity <= 0}
                className="btn btn-primary text-sm py-1 px-3 disabled:opacity-50"
              >
                {isAddingToCart ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('common:buttons.adding')}
                  </span>
                ) : selectedVariant.inventory_quantity <= 0 ? (
                  t('common:buttons.outOfStock')
                ) : (
                  t('common:buttons.addToCart')
                )}
              </button>
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
    </div>
  );
};

export default MedusaProductCard;
