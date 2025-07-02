/**
 * Professional email template for custom shin pad orders
 * Provides clean, responsive HTML email formatting
 */

/**
 * Generate complete HTML email template
 * @param {Object} emailData - Order and customization data
 * @returns {string} - Complete HTML email
 */
function generateOrderEmailHTML(emailData) {
  const { orderId, orderDate, customerInfo, shippingInfo, orderTotal, customizedItems, paymentMethod } = emailData;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Custom Shin Pad Order - ${orderId}</title>
  <style>
    ${getEmailStyles()}
  </style>
</head>
<body>
  <div class="email-container">
    ${generateHeader(orderId, orderDate)}
    ${generateCustomerSection(customerInfo, shippingInfo)}
    ${generateCustomizationSection(customizedItems)}
    ${generateOrderSummary(orderTotal, paymentMethod)}
    ${generateFooter()}
  </div>
</body>
</html>`;
}

/**
 * Generate email header section
 */
function generateHeader(orderId, orderDate) {
  return `
  <div class="header">
    <div class="logo-section">
      <h1>🎯 The Shin Shop</h1>
      <p class="tagline">Custom Shin Pad Order Notification</p>
    </div>
    <div class="order-info">
      <div class="order-badge">
        <strong>Order #${orderId}</strong>
      </div>
      <p class="order-date">${orderDate}</p>
    </div>
  </div>`;
}

/**
 * Generate customer information section
 */
function generateCustomerSection(customerInfo, shippingInfo) {
  return `
  <div class="section customer-section">
    <h2 class="section-title">👤 Customer Information</h2>
    <div class="info-grid">
      <div class="info-item">
        <span class="label">Name:</span>
        <span class="value">${customerInfo.name}</span>
      </div>
      <div class="info-item">
        <span class="label">Email:</span>
        <span class="value"><a href="mailto:${customerInfo.email}">${customerInfo.email}</a></span>
      </div>
      <div class="info-item">
        <span class="label">Phone:</span>
        <span class="value">${customerInfo.phone}</span>
      </div>
      <div class="info-item full-width">
        <span class="label">Billing Address:</span>
        <span class="value">${customerInfo.address}</span>
      </div>
      ${shippingInfo ? `
      <div class="info-item full-width shipping-info">
        <span class="label">Shipping Address:</span>
        <span class="value">${shippingInfo.address}</span>
      </div>
      ` : ''}
    </div>
  </div>`;
}

/**
 * Generate customization details section
 */
function generateCustomizationSection(customizedItems) {
  return `
  <div class="section customization-section">
    <h2 class="section-title">🎨 Customization Details</h2>
    ${customizedItems.map((item, index) => `
    <div class="product-item">
      <div class="product-header">
        <h3 class="product-name">${item.name}</h3>
        <div class="product-meta">
          <span class="quantity">Qty: ${item.quantity}</span>
          <span class="price">${item.price}</span>
        </div>
      </div>
      <div class="customizations">
        <h4>Customization Specifications:</h4>
        <div class="customization-grid">
          ${generateCustomizationItems(item.customizations)}
        </div>
      </div>
    </div>
    `).join('')}
  </div>`;
}

/**
 * Generate individual customization items
 */
function generateCustomizationItems(customizations) {
  return Object.entries(customizations)
    .filter(([key, value]) => value && value.trim() !== '')
    .map(([key, value]) => {
      const isImage = key.toLowerCase().includes('image');
      const isColor = key.toLowerCase().includes('color');
      
      return `
      <div class="customization-item ${isImage ? 'image-item' : ''} ${isColor ? 'color-item' : ''}">
        <span class="custom-label">${key}:</span>
        <span class="custom-value">
          ${isColor ? `<span class="color-preview" style="background-color: ${value}"></span>` : ''}
          ${value}
          ${isImage ? ' <span class="image-indicator">📎 Image attached</span>' : ''}
        </span>
      </div>`;
    }).join('');
}

/**
 * Generate order summary section
 */
function generateOrderSummary(orderTotal, paymentMethod) {
  return `
  <div class="section summary-section">
    <h2 class="section-title">💰 Order Summary</h2>
    <div class="summary-grid">
      <div class="summary-item">
        <span class="label">Payment Method:</span>
        <span class="value">${paymentMethod}</span>
      </div>
      <div class="summary-item total-item">
        <span class="label">Total Amount:</span>
        <span class="value total-amount">${orderTotal}</span>
      </div>
    </div>
  </div>`;
}

/**
 * Generate email footer
 */
function generateFooter() {
  return `
  <div class="footer">
    <div class="action-items">
      <h3>📋 Next Steps:</h3>
      <ul>
        <li>Review all customization details carefully</li>
        <li>Contact customer if clarification is needed</li>
        <li>Begin production process</li>
        <li>Send production updates to customer</li>
      </ul>
    </div>
    <div class="footer-note">
      <p>This is an automated notification from your Shin Shop e-commerce system.</p>
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    </div>
  </div>`;
}

/**
 * CSS styles for the email template
 */
function getEmailStyles() {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f9fafb;
    }
    
    .email-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      padding: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo-section h1 {
      font-size: 28px;
      margin-bottom: 5px;
    }
    
    .tagline {
      opacity: 0.9;
      font-size: 14px;
    }
    
    .order-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 16px;
      border-radius: 20px;
      text-align: center;
      margin-bottom: 8px;
    }
    
    .order-date {
      text-align: center;
      opacity: 0.9;
      font-size: 14px;
    }
    
    .section {
      padding: 30px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .section-title {
      font-size: 20px;
      margin-bottom: 20px;
      color: #1f2937;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
    }
    
    .customer-section {
      background: #f0fdf4;
    }
    
    .customization-section {
      background: #fffbeb;
    }
    
    .summary-section {
      background: #fdf2f8;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
    }
    
    .info-item.full-width {
      grid-column: 1 / -1;
    }
    
    .label {
      font-weight: 600;
      color: #374151;
      margin-bottom: 4px;
    }
    
    .value {
      color: #1f2937;
    }
    
    .value a {
      color: #2563eb;
      text-decoration: none;
    }
    
    .product-item {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .product-name {
      color: #1f2937;
      font-size: 18px;
    }
    
    .product-meta {
      display: flex;
      gap: 15px;
    }
    
    .quantity {
      background: #dbeafe;
      color: #1e40af;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
    }
    
    .price {
      background: #dcfce7;
      color: #166534;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
    }
    
    .customizations h4 {
      margin-bottom: 15px;
      color: #374151;
    }
    
    .customization-grid {
      display: grid;
      gap: 12px;
    }
    
    .customization-item {
      background: #f8fafc;
      padding: 12px;
      border-radius: 6px;
      border-left: 3px solid #f59e0b;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .custom-label {
      font-weight: 600;
      color: #374151;
      min-width: 120px;
    }
    
    .custom-value {
      flex: 1;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
    }
    
    .color-preview {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid #e5e7eb;
      display: inline-block;
    }
    
    .image-indicator {
      background: #fef3c7;
      color: #92400e;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 12px;
    }
    
    .summary-grid {
      display: grid;
      gap: 15px;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
    }
    
    .total-item {
      border-top: 2px solid #e5e7eb;
      padding-top: 15px;
      font-size: 18px;
      font-weight: 600;
    }
    
    .total-amount {
      color: #dc2626;
      font-size: 20px;
    }
    
    .footer {
      background: #f8fafc;
      padding: 30px;
    }
    
    .action-items {
      margin-bottom: 20px;
    }
    
    .action-items h3 {
      margin-bottom: 10px;
      color: #374151;
    }
    
    .action-items ul {
      list-style: none;
      padding-left: 0;
    }
    
    .action-items li {
      padding: 5px 0;
      padding-left: 20px;
      position: relative;
    }
    
    .action-items li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #10b981;
      font-weight: bold;
    }
    
    .footer-note {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
      padding-top: 20px;
    }
    
    @media (max-width: 600px) {
      .header {
        flex-direction: column;
        text-align: center;
        gap: 20px;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
      }
      
      .product-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      
      .customization-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      
      .custom-value {
        justify-content: flex-start;
      }
    }
  `;
}

/**
 * Generate plain text version of the email
 */
function generateOrderEmailText(emailData) {
  const { orderId, orderDate, customerInfo, shippingInfo, orderTotal, customizedItems, paymentMethod } = emailData;

  let text = `THE SHIN SHOP - CUSTOM ORDER NOTIFICATION\n`;
  text += `==========================================\n\n`;
  text += `Order ID: ${orderId}\n`;
  text += `Date: ${orderDate}\n\n`;
  
  text += `CUSTOMER INFORMATION\n`;
  text += `-------------------\n`;
  text += `Name: ${customerInfo.name}\n`;
  text += `Email: ${customerInfo.email}\n`;
  text += `Phone: ${customerInfo.phone}\n`;
  text += `Billing Address: ${customerInfo.address}\n`;
  
  if (shippingInfo) {
    text += `Shipping Address: ${shippingInfo.address}\n`;
  }
  
  text += `\nCUSTOMIZATION DETAILS\n`;
  text += `====================\n`;
  customizedItems.forEach((item, index) => {
    text += `\n${index + 1}. ${item.name} (Qty: ${item.quantity}) - ${item.price}\n`;
    text += `   Customizations:\n`;
    Object.entries(item.customizations).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        text += `   - ${key}: ${value}\n`;
      }
    });
  });
  
  text += `\nORDER SUMMARY\n`;
  text += `============\n`;
  text += `Payment Method: ${paymentMethod}\n`;
  text += `Total Amount: ${orderTotal}\n\n`;
  
  text += `NEXT STEPS:\n`;
  text += `----------\n`;
  text += `- Review all customization details carefully\n`;
  text += `- Contact customer if clarification is needed\n`;
  text += `- Begin production process\n`;
  text += `- Send production updates to customer\n\n`;
  
  text += `This is an automated notification from your Shin Shop e-commerce system.\n`;
  text += `Generated: ${new Date().toLocaleString()}`;
  
  return text;
}

module.exports = {
  generateOrderEmailHTML,
  generateOrderEmailText
};
