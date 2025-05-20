import React, { useState } from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";

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
          Back to Products
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
            ${selectedSize ? selectedSize.price.toFixed(2) : frontmatter.defaultPrice.toFixed(2)}
          </p>

          <div
            className="prose prose-lg mb-6"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {frontmatter.sizes && frontmatter.sizes.length > 0 && (
            <div className="mb-6">
              <label htmlFor="size" className="block text-gray-700 font-medium mb-2">
                Size <span className="text-red-500">*</span>
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
                    {size.name} (${size.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="quantity" className="block text-gray-700 mb-2">
              Quantity
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
              data-item-id={`${frontmatter.id}-${selectedSize?.code || "S"}`}
              data-item-price={selectedSize ? selectedSize.price : frontmatter.defaultPrice}
              data-item-url={`/products/${frontmatter.id}`}
              data-item-description={frontmatter.title}
              data-item-image={frontmatter.image}
              data-item-name={frontmatter.title}
              data-item-quantity={quantity}
              data-item-custom1-name="Size"
              data-item-custom1-value={selectedSize ? selectedSize.name : "Small"}
              data-item-custom1-options={frontmatter.sizes.map(size => `${size.name}[+${(size.price - frontmatter.sizes[0].price).toFixed(2)}]`).join('|')}
              disabled={!selectedSize}
            >
              {selectedSize ? "Add to Cart" : "Please select a size"}
            </button>

            {frontmatter.customizable && (
              <Link
                to={`/customize/${frontmatter.id}${selectedSize ? `?size=${selectedSize.code}` : ""}`}
                className={`btn btn-secondary px-6 py-3 ${!selectedSize ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={e => !selectedSize && e.preventDefault()}
              >
                Customize
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query ProductQuery($id: String!) {
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
        customizable
        customizationOptions
        image
      }
    }
  }
`;

export default ProductTemplate;
