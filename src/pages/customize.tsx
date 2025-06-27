import React, { useState, useRef, useEffect } from "react";
import { graphql, PageProps } from "gatsby";
import { Helmet } from "react-helmet";
import { useI18next } from "gatsby-plugin-react-i18next";
import Layout from "../components/Layout";
import CustomizationPlaceholder from "../components/CustomizationPlaceholder";
import type { CustomElement } from "../components/CustomizationCanvas";
import loadable from "@loadable/component";

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

// Using CustomElement type imported from CustomizationCanvas component

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
          };
        };
      }>;
    };
  };
}

const CustomizePage: React.FC<CustomizePageProps> = ({ data }) => {
  const { t } = useI18next();

  // State for customization options - using first customizable product by default
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [customText, setCustomText] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [textFont, setTextFont] = useState<string>("Arial");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [textPosition, setTextPosition] = useState<string>("bottom");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Canvas state
  const [elements, setElements] = useState<CustomElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stageSize, setStageSize] = useState({ width: 400, height: 300 });
  const [productImage, setProductImage] = useState<string | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transformerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  // Transform the data into a more usable format
  const products: Product[] = data.allMarkdownRemark.edges.map(
    ({ node }: any) => ({
      id: node.frontmatter.id,
      title: node.frontmatter.title,
      slug: node.frontmatter.slug,
      defaultPrice: node.frontmatter.defaultPrice,
      sizes: node.frontmatter.sizes || [],
      image: node.frontmatter.image,
    })
  );

  // Use the first customizable product (since we only have one model for customization)
  const selectedProduct = products.length > 0 ? products[0] : null;

  // Initialize with the first product and size when component mounts
  useEffect(() => {
    if (selectedProduct && selectedProduct.sizes && selectedProduct.sizes.length > 0) {
      setSelectedSize(selectedProduct.sizes[0]);
    } else {
      setSelectedSize(null);
    }

    // Create a simple shin pad template as a data URL
    const createShinPadTemplate = () => {
      const svg = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="shinPadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#f0f0f0;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#d0d0d0;stop-opacity:1" />
            </linearGradient>
          </defs>
          <!-- Shin pad outline -->
          <path d="M120 50 Q200 30 280 50 L290 120 Q295 180 285 220 L275 250 Q200 270 125 250 L115 220 Q105 180 110 120 Z"
                fill="url(#shinPadGradient)"
                stroke="#999"
                stroke-width="2"/>
          <!-- Inner padding area -->
          <path d="M140 70 Q200 55 260 70 L268 130 Q272 170 265 200 L258 225 Q200 240 142 225 L135 200 Q128 170 132 130 Z"
                fill="#e8e8e8"
                stroke="#bbb"
                stroke-width="1"/>
          <!-- Strap holes -->
          <circle cx="130" cy="100" r="8" fill="#ccc" stroke="#999" stroke-width="1"/>
          <circle cx="270" cy="100" r="8" fill="#ccc" stroke="#999" stroke-width="1"/>
          <circle cx="130" cy="180" r="8" fill="#ccc" stroke="#999" stroke-width="1"/>
          <circle cx="270" cy="180" r="8" fill="#ccc" stroke="#999" stroke-width="1"/>
          <!-- Brand area -->
          <rect x="170" y="140" width="60" height="20" fill="#f8f8f8" stroke="#ddd" stroke-width="1" rx="3"/>
          <text x="200" y="153" text-anchor="middle" font-family="Arial" font-size="10" fill="#999">CUSTOMIZE</text>
        </svg>
      `;
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

    setProductImage(createShinPadTemplate());
  }, [selectedProduct]);

  // Update transformer when selected element changes
  useEffect(() => {
    if (selectedId && transformerRef.current) {
      // Find the selected node
      const selectedNode = stageRef.current?.findOne(`#${selectedId}`);
      if (selectedNode) {
        // Attach transformer to the selected node
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else if (transformerRef.current) {
      // Clear transformer selection
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  // Remove product selection handler since we only have one model

  // Handle size selection
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sizeCode = e.target.value;
    if (selectedProduct) {
      const size = selectedProduct.sizes.find(s => s.code === sizeCode) || null;
      setSelectedSize(size);
    }
  };

  // Handle text input
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text.length <= 20) {
      setCustomText(text);
      setErrorMessage("");
    } else {
      setErrorMessage(t('products:messages.textTooLong'));
    }
  };

  // Handle text color selection
  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
  };

  // Handle font selection
  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTextFont(e.target.value);
  };

  // Handle text position selection
  const handleTextPositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTextPosition(e.target.value);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(t('products:messages.imageTooLarge'));
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Check file type
      if (!file.type.match('image.*')) {
        setErrorMessage(t('products:messages.invalidImageType'));
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setUploadedImage(imageUrl);

        // Create a new image element for the canvas
        const img = new window.Image();
        img.src = imageUrl;
        img.onload = () => {
          // Calculate scaled dimensions while maintaining aspect ratio
          const maxWidth = stageSize.width * 0.6;
          const maxHeight = stageSize.height * 0.6;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height = height * ratio;
          }

          if (height > maxHeight) {
            const ratio = maxHeight / height;
            height = maxHeight;
            width = width * ratio;
          }

          // Add image to canvas elements
          const newElement: CustomElement = {
            id: `image-${Date.now()}`,
            type: 'image',
            x: stageSize.width / 2 - width / 2,
            y: stageSize.height / 2 - height / 2,
            width,
            height,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            content: imageUrl
          };

          setElements(prev => [...prev, newElement]);
          setSelectedId(newElement.id);
        };

        setErrorMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Remove all image elements from canvas
    setElements(prev => prev.filter(el => el.type !== 'image'));
  };

  // Handle adding text to canvas
  const handleAddText = () => {
    if (!customText) return;

    const fontSize = 20;
    const newElement: CustomElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: stageSize.width / 2 - (customText.length * fontSize) / 4,
      y: textPosition === "top" ? 20 :
         textPosition === "middle" ? stageSize.height / 2 :
         stageSize.height - 40,
      width: customText.length * fontSize,
      height: fontSize * 1.5,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      content: customText,
      fontFamily: textFont,
      fontSize: fontSize,
      fill: textColor
    };

    setElements(prev => [...prev, newElement]);
    setSelectedId(newElement.id);
  };

  // Handle element selection
  const handleElementSelect = (id: string) => {
    setSelectedId(id);
  };

  // Handle element deselection
  const handleStageClick = (e: any) => {
    // Clicked on stage but not on any element
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  // Handle element transformation
  const handleElementTransform = (id: string, newProps: any) => {
    setElements(prev =>
      prev.map(el =>
        el.id === id ? { ...el, ...newProps } : el
      )
    );
  };

  // Handle element removal
  const handleElementRemove = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setSelectedId(null);
  };

  // Calculate total price
  const calculatePrice = (): number => {
    if (!selectedSize) return 0;

    // Base price from selected size
    let price = selectedSize.price;

    // Add customization fee
    if (elements.length > 0) {
      price += 5.00; // $5 customization fee
    }

    return price;
  };

  // Serialize customization data for Snipcart
  const getCustomizationData = (): string => {
    if (elements.length === 0) return "None";

    return JSON.stringify(
      elements.map(el => ({
        id: el.id,
        type: el.type,
        content: el.type === 'text' ? el.content : 'Custom Image',
        position: {
          x: Math.round(el.x),
          y: Math.round(el.y),
          rotation: Math.round(el.rotation),
          scale: {
            x: parseFloat(el.scaleX.toFixed(2)),
            y: parseFloat(el.scaleY.toFixed(2))
          }
        },
        style: el.type === 'text' ? {
          fontFamily: el.fontFamily,
          fontSize: el.fontSize,
          fill: el.fill
        } : undefined
      }))
    );
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

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('pages:customize.pageTitle')}</h1>
        <p className="text-gray-600">
          {t('pages:customize.subtitle')}
        </p>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customization Options */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Customize Your Shin Pad</h2>

          {selectedProduct && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">{selectedProduct.title}</h3>
              <div className="mb-4">
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
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="image"
              className="block text-gray-700 font-medium mb-2"
            >
              Upload Image
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Accepted formats: JPEG, PNG, GIF. Max size: 5MB.
            </p>
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
              Custom Text (Max 20 characters)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="text"
                value={customText}
                onChange={handleTextChange}
                placeholder="Enter your text"
                className="flex-1 border border-gray-300 rounded px-3 py-2"
                maxLength={20}
              />
              <button
                type="button"
                onClick={handleAddText}
                className="bg-secondary text-white px-4 py-2 rounded hover:bg-opacity-90"
                disabled={!customText}
              >
                Add Text
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {customText.length}/20 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <div>
              <label
                htmlFor="position"
                className="block text-gray-700 font-medium mb-2"
              >
                Text Position
              </label>
              <select
                id="position"
                value={textPosition}
                onChange={handleTextPositionChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="top">Top</option>
                <option value="middle">Middle</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
          </div>

          <button
            className="btn btn-primary w-full snipcart-add-item"
            disabled={!selectedProduct || !selectedSize}
            data-item-id={selectedProduct && selectedSize ? `${selectedProduct.id}-${selectedSize.code}-custom` : ""}
            data-item-price={calculatePrice()}
            data-item-url={`/customize`}
            data-item-description={selectedProduct ? `Customized ${selectedProduct.title}` : ""}
            data-item-image={uploadedImage || ""}
            data-item-name={selectedProduct ? `Custom ${selectedProduct.title}` : ""}
            data-item-custom1-name="Size"
            data-item-custom1-value={selectedSize ? selectedSize.name : ""}
            data-item-custom2-name="Customization Data"
            data-item-custom2-value={getCustomizationData()}
          >
            {selectedProduct && selectedSize
              ? `Add to Cart - $${calculatePrice().toFixed(2)}`
              : "Please select product and size"}
          </button>
        </div>

        {/* Preview */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Interactive Preview</h2>
          <div className="bg-gray-100 rounded-lg p-4 h-96 flex items-center justify-center">
            {selectedProduct ? (
              <div className="w-full h-full">
                {typeof window !== 'undefined' ? (
                  (() => {
                    // Define the loadable component inside the render function
                    // to ensure it's only created in the browser
                    const KonvaCanvas = loadable(() => import('../components/CustomizationCanvas'), {
                      fallback: (
                        <CustomizationPlaceholder
                          width={stageSize.width}
                          height={stageSize.height}
                          productName={selectedProduct.title}
                          productSize={selectedSize?.name}
                        />
                      )
                    });

                    return (
                      <KonvaCanvas
                        productImage={productImage}
                        canvasWidth={stageSize.width}
                        canvasHeight={stageSize.height}
                        elements={elements}
                        onElementsChange={setElements}
                        selectedId={selectedId}
                        onElementSelect={setSelectedId}
                      />
                    );
                  })()
                ) : (
                  <CustomizationPlaceholder
                    width={stageSize.width}
                    height={stageSize.height}
                    productName={selectedProduct.title}
                    productSize={selectedSize?.name}
                  />
                )}

                {/* Controls for selected element */}
                {selectedId && (
                  <div className="mt-2 flex justify-center">
                    <button
                      onClick={() => handleElementRemove(selectedId)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Remove Selected Element
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-center">
                Select a product to see the interactive preview
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">
                  <strong>Important Disclaimer:</strong> This preview is just to give you an idea of the final design. The actual shin pad may differ from this preview.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>Instructions:</strong> Drag to move elements. Click on an element to select it, then use the handles to resize or rotate.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
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
          }
        }
      }
    }
  }
`;

export default CustomizePage;
