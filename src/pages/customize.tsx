import React, { useState, useRef, useEffect } from "react";
import { Link, graphql, useStaticQuery } from "gatsby";
import { Helmet } from "react-helmet";
import Layout from "../components/Layout";

interface Size {
  name: string;
  code: string;
  price: number;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  defaultPrice: number;
  sizes: Size[];
}

const CustomizePage: React.FC = () => {
  const [selectedProductSlug, setSelectedProductSlug] = useState("");
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [customText, setCustomText] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [textFont, setTextFont] = useState("Arial");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all products data
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              id
              title
              slug
              defaultPrice
              sizes {
                name
                code
                price
              }
            }
          }
        }
      }
    }
  `);

  // Transform the data into a more usable format
  const products: Product[] = data.allMarkdownRemark.edges.map(
    ({ node }: any) => ({
      id: node.frontmatter.id,
      title: node.frontmatter.title,
      slug: node.frontmatter.slug,
      defaultPrice: node.frontmatter.defaultPrice,
      sizes: node.frontmatter.sizes || [],
    })
  );

  // Get the currently selected product
  const selectedProduct = products.find(p => p.slug === selectedProductSlug);

  // When product changes, reset the selected size to the first available size
  useEffect(() => {
    if (selectedProduct && selectedProduct.sizes && selectedProduct.sizes.length > 0) {
      setSelectedSize(selectedProduct.sizes[0]);
    } else {
      setSelectedSize(null);
    }
  }, [selectedProductSlug]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductSlug(e.target.value);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sizeCode = e.target.value;
    if (selectedProduct) {
      const size = selectedProduct.sizes.find(s => s.code === sizeCode) || null;
      setSelectedSize(size);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomText(e.target.value);
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTextFont(e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Customize Your Shin Pads | Shin Shop</title>
        <meta
          name="description"
          content="Create your own custom shin pads with personalized images and text."
        />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Customize Your Shin Pads</h1>
        <p className="text-gray-600">
          Make your shin pads uniquely yours by adding custom images and text.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customization Options */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Customization Options</h2>

          <div className="mb-6">
            <label
              htmlFor="product"
              className="block text-gray-700 font-medium mb-2"
            >
              Select Product <span className="text-red-500">*</span>
            </label>
            <select
              id="product"
              value={selectedProductSlug}
              onChange={handleProductChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.slug} value={product.slug}>
                  {product.title} (From ${product.defaultPrice.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="mb-6">
              <label
                htmlFor="size"
                className="block text-gray-700 font-medium mb-2"
              >
                Size <span className="text-red-500">*</span>
              </label>
              <select
                id="size"
                value={selectedSize?.code || ""}
                onChange={handleSizeChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                {selectedProduct.sizes.map((size) => (
                  <option key={size.code} value={size.code}>
                    {size.name} (${size.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="image"
              className="block text-gray-700 font-medium mb-2"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {uploadedImage && (
              <div className="mt-2">
                <button
                  onClick={handleRemoveImage}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="text"
              className="block text-gray-700 font-medium mb-2"
            >
              Custom Text
            </label>
            <input
              type="text"
              id="text"
              value={customText}
              onChange={handleTextChange}
              placeholder="Enter your text"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="font"
                className="block text-gray-700 font-medium mb-2"
              >
                Font
              </label>
              <select
                id="font"
                value={textFont}
                onChange={handleFontChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="color"
                className="block text-gray-700 font-medium mb-2"
              >
                Text Color
              </label>
              <input
                type="color"
                id="color"
                value={textColor}
                onChange={handleTextColorChange}
                className="w-full h-10 border border-gray-300 rounded px-1"
              />
            </div>
          </div>

          <button
            className="btn btn-primary w-full snipcart-add-item"
            disabled={!selectedProduct || !selectedSize}
            data-item-id={selectedProduct && selectedSize ? `${selectedProduct.id}-${selectedSize.code}-custom` : ""}
            data-item-price={selectedSize ? selectedSize.price : 0}
            data-item-url={`/customize`}
            data-item-description={selectedProduct ? `Customized ${selectedProduct.title}` : ""}
            data-item-image={uploadedImage || ""}
            data-item-name={selectedProduct ? `Custom ${selectedProduct.title}` : ""}
            data-item-custom1-name="Size"
            data-item-custom1-value={selectedSize ? selectedSize.name : ""}
            data-item-custom2-name="Custom Text"
            data-item-custom2-value={customText || "None"}
            data-item-custom3-name="Text Color"
            data-item-custom3-value={textColor}
            data-item-custom4-name="Font"
            data-item-custom4-value={textFont}
          >
            {selectedProduct && selectedSize ? `Add to Cart - $${selectedSize.price.toFixed(2)}` : "Please select product and size"}
          </button>
        </div>

        {/* Preview */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
          <div className="bg-gray-100 rounded-lg p-4 h-80 flex items-center justify-center">
            {selectedProduct ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="bg-gray-300 w-64 h-48 rounded-lg mx-auto relative">
                  {/* This would be replaced with actual product image */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                    <div>{selectedProduct.title} Preview</div>
                    {selectedSize && (
                      <div className="text-sm mt-1">Size: {selectedSize.name} - ${selectedSize.price.toFixed(2)}</div>
                    )}
                  </div>

                  {uploadedImage && (
                    <div
                      className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${uploadedImage})` }}
                    ></div>
                  )}

                  {customText && (
                    <div
                      className="absolute bottom-4 left-0 right-0 text-center"
                      style={{
                        color: textColor,
                        fontFamily: textFont,
                      }}
                    >
                      {customText}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center">
                Select a product to see the preview
              </div>
            )}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Note: This is a simplified preview. The actual product may vary
              slightly from what is shown here.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomizePage;
