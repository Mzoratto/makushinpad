const crypto = require('crypto');
const EmailService = require('./utils/emailService');

/**
 * Netlify Function to handle Snipcart webhooks for custom order notifications
 * This function processes order completion events and sends email notifications
 * for customized shin pad orders with all customization details.
 */
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the webhook payload
    const body = JSON.parse(event.body);
    
    // Verify webhook signature for security
    const signature = event.headers['x-snipcart-requesttoken'];
    if (!verifyWebhookSignature(event.body, signature)) {
      console.error('Invalid webhook signature');
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    // Check if this is an order completion event
    if (body.eventName !== 'order.completed') {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Event not processed' })
      };
    }

    const order = body.content;
    
    // Check if this order contains customized products
    const customizedItems = order.items.filter(item => 
      item.id.includes('-custom-') || 
      item.customFields?.some(field => field.name === 'Uploaded Image' && field.value)
    );

    if (customizedItems.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No customized items found' })
      };
    }

    // Process the custom order and send email notification
    await processCustomOrder(order, customizedItems);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Custom order notification sent successfully',
        orderId: order.token 
      })
    };

  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

/**
 * Verify Snipcart webhook signature for security
 */
function verifyWebhookSignature(payload, signature) {
  const webhookSecret = process.env.SNIPCART_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn('SNIPCART_WEBHOOK_SECRET not configured');
    return true; // Allow in development, but should be configured in production
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'base64'),
    Buffer.from(expectedSignature, 'base64')
  );
}

/**
 * Process custom order and send email notification
 */
async function processCustomOrder(order, customizedItems) {
  const emailData = {
    orderId: order.token,
    orderDate: new Date(order.creationDate).toLocaleString(),
    customerInfo: {
      name: `${order.billingAddress.fullName}`,
      email: order.email,
      phone: order.billingAddress.phoneNumber || 'Not provided',
      address: formatAddress(order.billingAddress)
    },
    shippingInfo: order.shippingAddress ? {
      name: order.shippingAddress.fullName,
      address: formatAddress(order.shippingAddress)
    } : null,
    orderTotal: `${order.finalGrandTotal} ${order.currency}`,
    customizedItems: customizedItems.map(item => formatCustomizedItem(item)),
    paymentMethod: order.paymentMethod || 'Not specified'
  };

  // Send email notification
  await sendOrderNotificationEmail(emailData);
}

/**
 * Format address for email display
 */
function formatAddress(address) {
  const parts = [
    address.address1,
    address.address2,
    address.city,
    address.province,
    address.postalCode,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
}

/**
 * Format customized item data for email
 */
function formatCustomizedItem(item) {
  const customizations = {};
  
  // Extract custom fields
  if (item.customFields) {
    item.customFields.forEach(field => {
      customizations[field.name] = field.value;
    });
  }

  return {
    name: item.name,
    quantity: item.quantity,
    price: `${item.totalPrice} ${item.currency || 'CZK'}`,
    customizations: customizations
  };
}

/**
 * Send order notification email using EmailService
 */
async function sendOrderNotificationEmail(emailData) {
  try {
    const emailService = new EmailService();
    const result = await emailService.sendCustomOrderNotification(emailData);
    console.log('Order notification email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send order notification email:', error);
    throw error;
  }
}
