import React from 'react';

interface PlaceholderProps {
  width: number;
  height: number;
  productName?: string;
  productSize?: string;
}

const CustomizationPlaceholder: React.FC<PlaceholderProps> = ({
  width,
  height,
  productName,
  productSize
}) => {
  return (
    <div 
      className="bg-gray-200 rounded-lg flex flex-col items-center justify-center"
      style={{ width, height }}
    >
      <div className="text-center p-4">
        <div className="text-lg font-semibold mb-2">Interactive Preview</div>
        {productName && (
          <div className="mb-1">{productName}</div>
        )}
        {productSize && (
          <div className="text-sm mb-3">Size: {productSize}</div>
        )}
        <div className="text-sm text-gray-600 max-w-xs">
          <p>The interactive customization canvas will load in your browser.</p>
          <p className="mt-2">You'll be able to:</p>
          <ul className="list-disc list-inside text-left mt-1">
            <li>Add custom text and images</li>
            <li>Drag elements to position them</li>
            <li>Resize and rotate using handles</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPlaceholder;
