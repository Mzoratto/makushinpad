import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image, Text, Transformer, Rect } from 'react-konva';
import Konva from 'konva';

// Ensure this component only runs in the browser
if (typeof window === 'undefined') {
  throw new Error('CustomizationCanvas should only be rendered in the browser');
}

// Define interfaces for our component
export interface CustomElement {
  id: string;
  type: 'image' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  content: string; // image URL or text content
  fontFamily?: string;
  fontSize?: number;
  fill?: string;
}

export interface CanvasProps {
  productImage: string | null;
  canvasWidth: number;
  canvasHeight: number;
  elements: CustomElement[];
  onElementsChange: (elements: CustomElement[]) => void;
  onElementSelect: (id: string | null) => void;
  selectedId: string | null;
}

// Helper component for rendering images
const CustomImage: React.FC<{
  element: CustomElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newProps: Partial<CustomElement>) => void;
}> = ({ element, isSelected, onSelect, onChange }) => {
  const imageRef = useRef<Konva.Image>(null);
  const [image] = useState(() => {
    const img = new window.Image();
    img.src = element.content;
    return img;
  });

  useEffect(() => {
    if (image) {
      image.onload = () => {
        if (imageRef.current) {
          imageRef.current.getLayer()?.batchDraw();
        }
      };
    }
  }, [image]);

  return (
    <Image
      ref={imageRef}
      image={image}
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
        onChange({
          x: e.target.x(),
          y: e.target.y()
        });
      }}
      onTransformEnd={(e: Konva.KonvaEventObject<Event>) => {
        const node = e.target;
        onChange({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY()
        });
      }}
    />
  );
};

// Helper component for rendering text
const CustomText: React.FC<{
  element: CustomElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newProps: Partial<CustomElement>) => void;
}> = ({ element, isSelected, onSelect, onChange }) => {
  return (
    <Text
      id={element.id}
      text={element.content}
      x={element.x}
      y={element.y}
      fontSize={element.fontSize || 20}
      fontFamily={element.fontFamily || 'Arial'}
      fill={element.fill || '#000000'}
      rotation={element.rotation}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
        onChange({
          x: e.target.x(),
          y: e.target.y()
        });
      }}
      onTransformEnd={(e: Konva.KonvaEventObject<Event>) => {
        const node = e.target;
        onChange({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY()
        });
      }}
    />
  );
};

// The main canvas component
const CustomizationCanvas: React.FC<CanvasProps> = ({
  productImage,
  canvasWidth,
  canvasHeight,
  elements,
  onElementsChange,
  onElementSelect,
  selectedId
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [productImg, setProductImg] = useState<HTMLImageElement | null>(null);

  // Load product image
  useEffect(() => {
    if (productImage) {
      const img = new window.Image();
      img.src = productImage;
      img.onload = () => {
        setProductImg(img);
      };
    } else {
      setProductImg(null);
    }
  }, [productImage]);

  // Update transformer when selected element changes
  useEffect(() => {
    if (selectedId && transformerRef.current && stageRef.current) {
      const selectedNode = stageRef.current.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode as Konva.Node]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId]);

  // Handle element transformation
  const handleElementChange = (id: string, newProps: Partial<CustomElement>) => {
    onElementsChange(
      elements.map(el => (el.id === id ? { ...el, ...newProps } : el))
    );
  };

  // Handle stage click (deselect when clicking on empty space)
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onElementSelect(null);
    }
  };

  return (
    <Stage
      width={canvasWidth}
      height={canvasHeight}
      ref={stageRef}
      onClick={handleStageClick}
      onTap={handleStageClick}
      className="mx-auto border border-gray-300 bg-white"
      style={{ maxWidth: '100%', maxHeight: '100%' }}
    >
      <Layer>
        {/* Product base image */}
        {productImg && (
          <Image
            image={productImg}
            width={canvasWidth}
            height={canvasHeight}
            opacity={0.7}
          />
        )}

        {/* Printable area indicator */}
        <Rect
          x={canvasWidth * 0.1}
          y={canvasHeight * 0.1}
          width={canvasWidth * 0.8}
          height={canvasHeight * 0.8}
          stroke="#aaa"
          strokeWidth={1}
          dash={[5, 5]}
          fill="transparent"
        />

        {/* Custom elements (images and text) */}
        {elements.map((element) => {
          const isSelected = selectedId === element.id;

          if (element.type === 'image') {
            return (
              <CustomImage
                key={element.id}
                element={element}
                isSelected={isSelected}
                onSelect={() => onElementSelect(element.id)}
                onChange={(newProps) => handleElementChange(element.id, newProps)}
              />
            );
          } else if (element.type === 'text') {
            return (
              <CustomText
                key={element.id}
                element={element}
                isSelected={isSelected}
                onSelect={() => onElementSelect(element.id)}
                onChange={(newProps) => handleElementChange(element.id, newProps)}
              />
            );
          }
          return null;
        })}

        {/* Transformer for selected element */}
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize to within stage bounds
            if (
              newBox.width < 10 ||
              newBox.height < 10 ||
              newBox.x < 0 ||
              newBox.y < 0 ||
              newBox.x + newBox.width > canvasWidth ||
              newBox.y + newBox.height > canvasHeight
            ) {
              return oldBox;
            }
            return newBox;
          }}
        />
      </Layer>
    </Stage>
  );
};

export default CustomizationCanvas;
