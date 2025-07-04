import React from "react";
import { Link } from "gatsby-plugin-react-i18next";
import { useCurrency } from "../contexts/CurrencyContext";
import { getProductPrice, formatPrice } from "../utils/priceUtils";
import { Product, ProductVariant } from "../services/supabaseClient";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showAddToCart = false,
}) => {
  const { currency } = useCurrency();

  // Get the price range from variants
  const getPriceRange = (): { minPrice: number; maxPrice: number; showFrom: boolean } => {
    if (!product.variants || product.variants.length === 0) {
      return { minPrice: 0, maxPrice: 0, showFrom: false };
    }

    const prices = product.variants.map(variant => variant.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
      minPrice,
      maxPrice,
      showFrom: minPrice !== maxPrice
    };
  };

  const { minPrice, showFrom } = getPriceRange();

  // Convert CZK to EUR if needed (25 CZK = 1 EUR)
  const displayPrice = currency === 'EUR' ? Math.round(minPrice / 25) : minPrice;
  const currencySymbol = currency === 'EUR' ? '€' : 'Kč';
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="h-64 overflow-hidden relative">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder on image error
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const placeholder = target.parentElement?.querySelector('.image-placeholder') as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="image-placeholder absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center" style={{ display: product.images && product.images.length > 0 ? 'none' : 'flex' }}>
          <span className="text-gray-500">Image Placeholder</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-primary font-bold">
            {showFrom ? 'From ' : ''}{displayPrice} {currencySymbol}
          </span>
          <Link
            to={`/products/${product.handle}`}
            className="btn btn-primary text-sm py-1"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
