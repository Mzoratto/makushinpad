import React from "react";
import { Link } from "gatsby-plugin-react-i18next";
import { useCurrency } from "../contexts/CurrencyContext";
import { getProductPrice, formatPrice } from "../utils/priceUtils";

interface Size {
  name: string;
  code: string;
  price: number;
}

interface ProductCardProps {
  id: string;
  slug: string;
  title: string;
  price: number; // This will be defaultPrice (legacy)
  sizes?: Size[]; // Optional sizes array
  description: string;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  slug,
  title,
  price,
  sizes,
  description,
  image,
}) => {
  const { currency } = useCurrency();

  // Calculate the display price based on current currency
  const getDisplayPrice = (): { price: number; showFrom: boolean } => {
    if (sizes && sizes.length > 0) {
      // Use the first size price and check if we should show "From"
      const firstSizePrice = getProductPrice(id, 'S', currency, 'main');
      const hasMultiplePrices = sizes.length > 1 &&
        sizes.some(size => getProductPrice(id, size.code as 'S' | 'M', currency, 'main') !== firstSizePrice);

      return {
        price: firstSizePrice,
        showFrom: hasMultiplePrices
      };
    } else {
      // Fallback to legacy price conversion
      return {
        price: getProductPrice(id, 'S', currency, 'main'),
        showFrom: false
      };
    }
  };

  const { price: displayPrice, showFrom } = getDisplayPrice();
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="h-64 overflow-hidden">
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Image Placeholder</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-primary font-bold">
            {showFrom ? 'From ' : ''}{formatPrice(displayPrice, currency)}
          </span>
          <Link
            to={`/products/${slug}`}
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
