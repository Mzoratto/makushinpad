/**
 * File handling utilities for processing uploaded images from custom orders
 * Handles base64 image data and prepares attachments for email notifications
 */

/**
 * Process uploaded image data and prepare email attachments
 * @param {Array} customizedItems - Array of customized items with potential image uploads
 * @returns {Array} - Array of email attachment objects
 */
async function prepareImageAttachments(customizedItems) {
  const attachments = [];
  
  for (let i = 0; i < customizedItems.length; i++) {
    const item = customizedItems[i];
    const customizations = item.customizations;
    
    // Check for uploaded image data
    if (customizations['Uploaded Image'] && customizations['Uploaded Image'] !== 'undefined') {
      const imageFileName = customizations['Uploaded Image'];
      
      // Look for base64 image data in other custom fields
      // Snipcart might store the actual image data in a different field
      const imageDataField = findImageDataField(customizations);
      
      if (imageDataField) {
        try {
          const attachment = await processBase64Image(imageDataField, imageFileName, i + 1);
          if (attachment) {
            attachments.push(attachment);
          }
        } catch (error) {
          console.error(`Error processing image attachment for item ${i + 1}:`, error);
          // Add a placeholder attachment to indicate there was an image
          attachments.push({
            filename: `custom-image-${i + 1}-error.txt`,
            content: `Image attachment failed to process: ${imageFileName}\nError: ${error.message}`,
            contentType: 'text/plain'
          });
        }
      } else {
        // Add a note that an image was uploaded but data wasn't found
        attachments.push({
          filename: `custom-image-${i + 1}-info.txt`,
          content: `Customer uploaded image: ${imageFileName}\nNote: Image data not available in webhook payload. You may need to contact the customer for the image file.`,
          contentType: 'text/plain'
        });
      }
    }
  }
  
  return attachments;
}

/**
 * Find the field containing base64 image data
 * @param {Object} customizations - Customization data object
 * @returns {string|null} - Base64 image data or null if not found
 */
function findImageDataField(customizations) {
  // Look for fields that might contain base64 image data
  const possibleImageFields = [
    'Image Data',
    'Uploaded Image Data',
    'Custom Image',
    'Image Content',
    'Custom Image Data'
  ];
  
  for (const fieldName of possibleImageFields) {
    if (customizations[fieldName] && isBase64Image(customizations[fieldName])) {
      return customizations[fieldName];
    }
  }
  
  // Check all fields for base64 image data
  for (const [key, value] of Object.entries(customizations)) {
    if (typeof value === 'string' && isBase64Image(value)) {
      return value;
    }
  }
  
  return null;
}

/**
 * Check if a string is base64 image data
 * @param {string} data - String to check
 * @returns {boolean} - True if it's base64 image data
 */
function isBase64Image(data) {
  if (typeof data !== 'string') return false;
  
  // Check for data URL format
  const dataUrlPattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/i;
  if (dataUrlPattern.test(data)) return true;
  
  // Check for raw base64 that might be an image (basic heuristic)
  if (data.length > 100 && /^[A-Za-z0-9+/]+=*$/.test(data)) {
    // Additional check: base64 images are typically quite long
    return data.length > 1000;
  }
  
  return false;
}

/**
 * Process base64 image data and create email attachment
 * @param {string} base64Data - Base64 image data
 * @param {string} originalFileName - Original filename from upload
 * @param {number} itemIndex - Index of the item for unique naming
 * @returns {Object|null} - Email attachment object or null if processing fails
 */
async function processBase64Image(base64Data, originalFileName, itemIndex) {
  try {
    let imageBuffer;
    let mimeType;
    let fileExtension;
    
    if (base64Data.startsWith('data:image/')) {
      // Handle data URL format
      const matches = base64Data.match(/^data:image\/([^;]+);base64,(.+)$/);
      if (!matches) {
        throw new Error('Invalid data URL format');
      }
      
      mimeType = `image/${matches[1]}`;
      fileExtension = getFileExtension(matches[1]);
      imageBuffer = Buffer.from(matches[2], 'base64');
    } else {
      // Handle raw base64
      imageBuffer = Buffer.from(base64Data, 'base64');
      
      // Try to detect image type from buffer
      const imageType = detectImageType(imageBuffer);
      if (!imageType) {
        throw new Error('Could not detect image type');
      }
      
      mimeType = `image/${imageType}`;
      fileExtension = getFileExtension(imageType);
    }
    
    // Generate filename
    const baseFileName = originalFileName ? 
      originalFileName.replace(/\.[^/.]+$/, '') : // Remove extension
      `custom-image-${itemIndex}`;
    
    const fileName = `${baseFileName}${fileExtension}`;
    
    // Validate image size (limit to 10MB for email)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageBuffer.length > maxSize) {
      throw new Error(`Image too large: ${(imageBuffer.length / 1024 / 1024).toFixed(2)}MB (max 10MB)`);
    }
    
    return {
      filename: fileName,
      content: imageBuffer,
      contentType: mimeType,
      encoding: 'base64'
    };
    
  } catch (error) {
    console.error('Error processing base64 image:', error);
    throw error;
  }
}

/**
 * Get file extension for image type
 * @param {string} imageType - Image type (jpeg, png, etc.)
 * @returns {string} - File extension with dot
 */
function getFileExtension(imageType) {
  const extensions = {
    'jpeg': '.jpg',
    'jpg': '.jpg',
    'png': '.png',
    'gif': '.gif',
    'webp': '.webp',
    'bmp': '.bmp',
    'tiff': '.tiff'
  };
  
  return extensions[imageType.toLowerCase()] || '.jpg';
}

/**
 * Detect image type from buffer
 * @param {Buffer} buffer - Image buffer
 * @returns {string|null} - Image type or null if not detected
 */
function detectImageType(buffer) {
  if (buffer.length < 4) return null;
  
  // Check magic numbers for common image formats
  const header = buffer.toString('hex', 0, 4).toUpperCase();
  
  if (header.startsWith('FFD8')) return 'jpeg';
  if (header.startsWith('8950')) return 'png';
  if (header.startsWith('4749')) return 'gif';
  if (header.startsWith('5249')) return 'webp';
  if (header.startsWith('424D')) return 'bmp';
  
  return null;
}

/**
 * Create a summary attachment with all customization details
 * @param {Array} customizedItems - Array of customized items
 * @param {Object} orderInfo - Order information
 * @returns {Object} - Text attachment with order summary
 */
function createOrderSummaryAttachment(customizedItems, orderInfo) {
  let summary = `CUSTOM SHIN PAD ORDER SUMMARY\n`;
  summary += `============================\n\n`;
  summary += `Order ID: ${orderInfo.orderId}\n`;
  summary += `Date: ${orderInfo.orderDate}\n`;
  summary += `Customer: ${orderInfo.customerInfo.name}\n`;
  summary += `Email: ${orderInfo.customerInfo.email}\n\n`;
  
  summary += `CUSTOMIZATION DETAILS:\n`;
  summary += `---------------------\n`;
  
  customizedItems.forEach((item, index) => {
    summary += `\n${index + 1}. ${item.name} (Qty: ${item.quantity})\n`;
    summary += `   Price: ${item.price}\n`;
    summary += `   Customizations:\n`;
    
    Object.entries(item.customizations).forEach(([key, value]) => {
      if (value && value.trim() !== '' && value !== 'undefined') {
        // Truncate very long values (like base64 data)
        const displayValue = value.length > 100 ? 
          `${value.substring(0, 100)}... [truncated]` : 
          value;
        summary += `     - ${key}: ${displayValue}\n`;
      }
    });
  });
  
  summary += `\nTotal: ${orderInfo.orderTotal}\n`;
  summary += `Payment Method: ${orderInfo.paymentMethod}\n`;
  
  return {
    filename: `order-${orderInfo.orderId}-summary.txt`,
    content: summary,
    contentType: 'text/plain'
  };
}

module.exports = {
  prepareImageAttachments,
  createOrderSummaryAttachment,
  isBase64Image,
  processBase64Image
};
