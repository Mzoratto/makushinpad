import React from "react";
import { Link } from "gatsby";

interface ProductCardProps {
  id: string;
  slug: string;
  title: string;
  price: number; // This will be defaultPrice
  description: string;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  slug,
  title,
  price,
  description,
  image,
}) => {
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
          <span className="text-primary font-bold">From ${price.toFixed(2)}</span>
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
