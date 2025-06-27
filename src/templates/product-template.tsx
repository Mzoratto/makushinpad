import React, { useState } from "react";
import { graphql } from "gatsby";
import { useI18next, Link } from "gatsby-plugin-react-i18next";
import Layout from "../components/Layout";
import { useCurrency } from "../contexts/CurrencyContext";
import { getProductPrice, formatPrice } from "../utils/priceUtils";

interface Size {
  name: string;
  code: string;
  price: number;
}

interface ProductTemplateProps {
  data: {
    markdownRemark: {
      frontmatter: {
        id: string;
        title: string;
        defaultPrice: number;
        sizes: Size[];
        image: string;
        customizable: boolean;
        customizationOptions: string[];
      };
      html: string;
    };
  };
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({ data }) => {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  const { currency } = useCurrency();
  const { t } = useI18next();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<Size | null>(
    frontmatter.sizes && frontmatter.sizes.length > 0 ? frontmatter.sizes[0] : null
  );

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sizeCode = e.target.value;
    const size = frontmatter.sizes.find(s => s.code === sizeCode) || null;
    setSelectedSize(size);
  };

  // Get the current price based on selected size and currency
  const getCurrentPrice = (): number => {
    if (selectedSize) {
      return getProductPrice(frontmatter.id, selectedSize.code as 'S' | 'M', currency, 'main');
    }
    return getProductPrice(frontmatter.id, 'S', currency, 'main');
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/products" className="text-primary hover:underline flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t('common:navigation.backToProducts')}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="rounded-lg shadow-md w-full h-80 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Image Placeholder</span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{frontmatter.title}</h1>
          <p className="text-2xl text-primary font-bold mb-4">
            {formatPrice(getCurrentPrice(), currency)}
          </p>

          <div
            className="prose prose-lg mb-6"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {frontmatter.sizes && frontmatter.sizes.length > 0 && (
            <div className="mb-6">
              <label htmlFor="size" className="block text-gray-700 font-medium mb-2">
                {t('common:product.size')} <span className="text-red-500">*</span>
              </label>
              <select
                id="size"
                value={selectedSize?.code || ""}
                onChange={handleSizeChange}
                className="w-full md:w-1/3 border border-gray-300 rounded px-3 py-2"
                required
              >
                {frontmatter.sizes.map((size) => (
                  <option key={size.code} value={size.code}>
                    {size.name} ({formatPrice(getProductPrice(frontmatter.id, size.code as 'S' | 'M', currency, 'main'), currency)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="quantity" className="block text-gray-700 mb-2">
              {t('common:product.quantity')}
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-20 border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex space-x-4">
            <button
              className="btn btn-primary px-6 py-3 snipcart-add-item"
              data-item-id={`${frontmatter.id}-${selectedSize?.code || "S"}-${currency}`}
              data-item-price={getCurrentPrice()}
              data-item-url={`/products/${frontmatter.id}`}
              data-item-description={frontmatter.title}
              data-item-image={frontmatter.image}
              data-item-name={frontmatter.title}
              data-item-quantity={quantity}
              data-item-custom1-name="Size"
              data-item-custom1-value={selectedSize ? selectedSize.name : "Small"}
              data-item-custom2-name="Currency"
              data-item-custom2-value={currency}
              disabled={!selectedSize}
            >
              {selectedSize ? t('common:buttons.addToCart') : t('common:buttons.selectSize')}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query ProductQuery($id: String!, $language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        id
        title
        defaultPrice
        sizes {
          name
          code
          price
        }
        image
      }
    }
  }
`;

export default ProductTemplate;
