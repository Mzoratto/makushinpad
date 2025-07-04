import React, { useState, useRef, useEffect } from "react";
import { graphql, PageProps } from "gatsby";
import { Helmet } from "react-helmet";
import { useI18next } from "gatsby-plugin-react-i18next";
import Layout from "../components/Layout";
import { useCurrency } from "../contexts/CurrencyContext";
import { getProductPrice, formatPrice } from "../utils/priceUtils";

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
  image: string;
}

interface CustomizePageProps extends PageProps {
  data: {
    locales: {
      edges: Array<{
        node: {
          ns: string;
          data: string;
          language: string;
        };
      }>;
    };
    allMarkdownRemark: {
      edges: Array<{
        node: {
          frontmatter: {
            id: string;
            title: string;
            slug: string;
            defaultPrice: number;
            sizes: Array<{
              name: string;
              code: string;
              price: number;
            }>;
            image: string;
            language?: string;
          };
          fileAbsolutePath: string;
        };
      }>;
    };
  };
}

const CustomizePage: React.FC<CustomizePageProps> = ({ data }) => {
  const { t, i18n } = useI18next();
  const { currency } = useCurrency();
  const currentLanguage = i18n.language || 'en';

  // State for customization options - using first customizable product by default
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [customText, setCustomText] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [textFont, setTextFont] = useState<string>("Arial");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [playerNumber, setPlayerNumber] = useState<string>("");
  const [leftShinText, setLeftShinText] = useState<string>("");
  const [rightShinText, setRightShinText] = useState<string>("");
  const [backdropColor, setBackdropColor] = useState<string>("#ffffff");
  const [additionalRequirements, setAdditionalRequirements] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and transform the data into a more usable format
  const products: Product[] = data.allMarkdownRemark.edges
    .filter(({ node }) => {
      if (currentLanguage === 'en') {
        // For English, show products that don't have language field or have language !== 'cz'
        // Also filter by file path to exclude files in /cz/ directory
        return !node.frontmatter.language && !node.fileAbsolutePath.includes('/cz/');
      } else {
        // For Czech, show products that have language: 'cz' or are in /cz/ directory
        return node.frontmatter.language === 'cz' || node.fileAbsolutePath.includes('/cz/');
      }
    })
    .map(({ node }: any) => ({
      id: node.frontmatter.id,
      title: node.frontmatter.title,
      slug: node.frontmatter.slug,
      defaultPrice: node.frontmatter.defaultPrice,
      sizes: node.frontmatter.sizes || [],
      image: node.frontmatter.image,
    }));

  // Use the first customizable product (since we only have one model for customization)
  const selectedProduct = products.length > 0 ? products[0] : null;

  // Initialize with the first product and size when component mounts
  useEffect(() => {
    if (selectedProduct && selectedProduct.sizes && selectedProduct.sizes.length > 0) {
      setSelectedSize(selectedProduct.sizes[0]);
    } else {
      setSelectedSize(null);
    }
  }, [selectedProduct]);

  // Remove old canvas-related code since we're using simple upload approach

  // Handle size selection
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sizeCode = e.target.value;
    if (selectedProduct) {
      const size = selectedProduct.sizes.find(s => s.code === sizeCode) || null;
      setSelectedSize(size);
    }
  };

  // Handle image upload - increased to 50MB limit
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage("Image file size must be less than 50MB");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Check file type
      if (!file.type.match('image.*')) {
        setErrorMessage("Please upload a valid image file (JPEG, PNG, GIF, etc.)");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setUploadedImage(imageUrl);
        setUploadedFileName(file.name);
        setErrorMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setUploadedImage(null);
    setUploadedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Calculate total price
  const calculatePrice = (): number => {
    if (!selectedProduct || !selectedSize) return 0;

    // Base price from selected size using currency context
    let price = getProductPrice(selectedProduct.id, selectedSize.code as 'S' | 'M', currency, 'customize');

    // Add customization fee if any customization is added
    if (uploadedImage || customText || leftShinText || rightShinText || playerNumber) {
      const customizationFee = currency === 'CZK' ? 125 : 5; // 125 CZK or $5 customization fee
      price += customizationFee;
    }

    return price;
  };

  // Serialize customization data for Snipcart
  const getCustomizationData = (): string => {
    const customizations = [];

    if (uploadedImage) customizations.push(`Image: ${uploadedFileName}`);
    if (customText) customizations.push(`Text: ${customText}`);
    if (leftShinText) customizations.push(`Left Shin: ${leftShinText}`);
    if (rightShinText) customizations.push(`Right Shin: ${rightShinText}`);
    if (playerNumber) customizations.push(`Number: ${playerNumber}`);
    if (backdropColor !== "#ffffff") customizations.push(`Backdrop: ${backdropColor}`);
    if (additionalRequirements) customizations.push(`Additional: ${additionalRequirements}`);

    return customizations.length > 0 ? customizations.join('; ') : "None";
  };

  return (
    <Layout>
      <Helmet>
        <title>{t('pages:customize.title')}</title>
        <meta
          name="description"
          content={t('pages:customize.metaDescription')}
        />
      </Helmet>

      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <span>Home</span> / <span>Customize</span> / <span className="text-gray-900">PRO Personalised Shin Pads</span>
      </div>

      {/* Force cache refresh - new design */}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Product Image */}
          <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-64 h-80 bg-white rounded-lg shadow-md flex items-center justify-center mb-4">
                <div className="text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">Shin Pad Preview</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Your customized design will be professionally printed</p>
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded border-2 border-transparent hover:border-blue-500 cursor-pointer">
                <div className="aspect-square bg-white rounded flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Details & Customization Form */}
        <div className="space-y-6">
          {/* Product Title & Price */}
          {selectedProduct && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Sale!</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.title}</h1>

              {/* Price Display */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(getProductPrice(selectedProduct.id, selectedSize?.code as 'S' | 'M' || 'S', currency, 'customize'), currency)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(getProductPrice(selectedProduct.id, selectedSize?.code as 'S' | 'M' || 'S', currency, 'customize') * 1.4, currency)}
                </span>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSize?.code || ""}
                  onChange={handleSizeChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {selectedProduct.sizes.map((size) => (
                    <option key={size.code} value={size.code}>
                      {size.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Size selection does not affect the price - all customized products are {formatPrice(getProductPrice(selectedProduct.id, 'S', currency, 'customize'), currency)}
                </p>
              </div>
            </div>
          )}

          {/* Image Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload an image</h3>
              <p className="text-sm text-gray-500 mb-4">
                Accepted formats: JPEG, PNG, GIF. Max size: 50MB.
              </p>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                Choose File
              </label>
              {uploadedFileName && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="text-sm text-green-600">✓ {uploadedFileName}</span>
                  <button
                    onClick={handleRemoveImage}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Text Customization Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Text Customization</h3>

            {/* Player Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Player Number
              </label>
              <input
                type="text"
                value={playerNumber}
                onChange={(e) => setPlayerNumber(e.target.value)}
                placeholder="e.g., 10"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={3}
              />
            </div>

            {/* Left Shin Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Left Shin Pad Text
              </label>
              <input
                type="text"
                value={leftShinText}
                onChange={(e) => setLeftShinText(e.target.value)}
                placeholder="Text for left shin pad"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={20}
              />
            </div>

            {/* Right Shin Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Right Shin Pad Text
              </label>
              <input
                type="text"
                value={rightShinText}
                onChange={(e) => setRightShinText(e.target.value)}
                placeholder="Text for right shin pad"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={20}
              />
            </div>

            {/* General Custom Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Text
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Any additional text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={30}
              />
            </div>
          </div>

          {/* Style Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Style Options</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Text Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{textColor}</span>
                </div>
              </div>

              {/* Backdrop Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backdrop Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={backdropColor}
                    onChange={(e) => setBackdropColor(e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{backdropColor}</span>
                </div>
              </div>
            </div>

            {/* Font Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Style
              </label>
              <select
                value={textFont}
                onChange={(e) => setTextFont(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
                <option value="Impact">Impact</option>
                <option value="Georgia">Georgia</option>
              </select>
            </div>
          </div>

          {/* Additional Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Requirements
            </label>
            <textarea
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              placeholder="Any special requests or instructions..."
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quantity and Add to Cart */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-4 mb-6">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button className="px-3 py-2 text-gray-600 hover:text-gray-800">−</button>
                <span className="px-4 py-2 border-x border-gray-300">1</span>
                <button className="px-3 py-2 text-gray-600 hover:text-gray-800">+</button>
              </div>
            </div>

            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors snipcart-add-item"
              disabled={!selectedProduct || !selectedSize}
              data-item-id={selectedProduct && selectedSize ? `${selectedProduct.id}-${selectedSize.code}-custom-${currency}` : ""}
              data-item-price={calculatePrice()}
              data-item-url={`/customize`}
              data-item-description={selectedProduct ? `Customized ${selectedProduct.title}` : ""}
              data-item-image={uploadedImage || ""}
              data-item-name={selectedProduct ? `Custom ${selectedProduct.title}` : ""}
              data-item-custom1-name="Size"
              data-item-custom1-value={selectedSize ? selectedSize.name : ""}
              data-item-custom2-name="Currency"
              data-item-custom2-value={currency}
              data-item-custom3-name="Player Number"
              data-item-custom3-value={playerNumber}
              data-item-custom4-name="Left Shin Text"
              data-item-custom4-value={leftShinText}
              data-item-custom5-name="Right Shin Text"
              data-item-custom5-value={rightShinText}
              data-item-custom6-name="Additional Text"
              data-item-custom6-value={customText}
              data-item-custom7-name="Text Color"
              data-item-custom7-value={textColor}
              data-item-custom8-name="Backdrop Color"
              data-item-custom8-value={backdropColor}
              data-item-custom9-name="Font"
              data-item-custom9-value={textFont}
              data-item-custom10-name="Additional Requirements"
              data-item-custom10-value={additionalRequirements}
              data-item-custom11-name="Uploaded Image"
              data-item-custom11-value={uploadedFileName}
              data-item-custom12-name="Image Data"
              data-item-custom12-value={uploadedImage || ""}
            >
              {selectedProduct && selectedSize
                ? `Add to Cart - ${formatPrice(calculatePrice(), currency)}`
                : "Please select size"}
            </button>

            {/* Product Info */}
            <div className="mt-6 text-sm text-gray-600 space-y-2">
              <p><strong>SKU:</strong> {selectedProduct?.id || 'N/A'}</p>
              <p><strong>Category:</strong> Personalised Shin Pads</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">custom shin pads</span>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">personalised shin pads</span>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">shin pads</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Product Description & Disclaimer */}
      <div className="mt-12 space-y-8">
        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">Important Notice</h3>
              <p className="text-yellow-700">
                This preview is just to give you an idea of the final design. The actual shin pad may differ from this preview.
                We will send you a design proof for approval before production begins.
              </p>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
          <p className="text-gray-700 mb-4">
            Perfectly snug and stylish, they're the ultimate companion to our Personalised Shin Pads. Available in small and medium fittings, you'll be field-ready in no time!
          </p>
          <p className="text-gray-700 mb-4">
            Introducing our top-of-the-line Shin Pad – the ultimate companion to our best-selling Personalised Shin Pads. Elevate your game and complete your gear with these sleek and stylish shin pad.
          </p>
          <p className="text-gray-700 mb-4">
            Crafted with precision and attention to detail, these shin pad will make you stand out on the field. Our shin guard sleeves are guaranteed to match your style and preference.
          </p>
          <p className="text-gray-700 mb-4">
            Available in small and medium fittings, our shin pad sleeves cater to athletes of all ages and sizes, ensuring a comfortable and secure fit that will not restrict your movement.
          </p>
          <p className="text-gray-700">
            In summary, our Shin Pad are a must-have accessory for any athlete looking to elevate their game and make a statement on the field. With their stylish design, secure fitting. So, don't wait, get your pair today and experience the difference!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(
      filter: { frontmatter: { customizable: { eq: true } } }
    ) {
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
            image
            language
          }
          fileAbsolutePath
        }
      }
    }
  }
`;

export default CustomizePage;
