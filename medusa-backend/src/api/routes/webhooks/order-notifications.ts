import { Router } from "express"
import { OrderService } from "@medusajs/medusa"
import { EmailService } from "../../../services/email"

const router = Router()

/**
 * Webhook endpoint for order notifications
 * This endpoint is called when orders are placed to send email notifications
 */
router.post("/order-notifications", async (req, res) => {
  try {
    const { event, data } = req.body

    // Only process order completion events
    if (event !== "order.placed") {
      return res.status(200).json({ message: "Event not processed" })
    }

    const orderService: OrderService = req.scope.resolve("orderService")
    const emailService: EmailService = req.scope.resolve("emailService")

    // Get complete order details
    const order = await orderService.retrieve(data.id, {
      relations: [
        "items",
        "items.variant",
        "items.variant.product",
        "customer",
        "billing_address",
        "shipping_address",
        "payments",
        "region"
      ]
    })

    // Check if order contains customizable products
    const customizedItems = order.items.filter(item => {
      const product = item.variant?.product
      return product?.metadata?.customizable === true
    })

    if (customizedItems.length === 0) {
      return res.status(200).json({ message: "No customized items found" })
    }

    // Prepare email data
    const emailData = {
      orderId: order.display_id,
      orderDate: new Date(order.created_at).toLocaleString(),
      customerInfo: {
        name: `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim() || 
               order.billing_address?.first_name + ' ' + order.billing_address?.last_name,
        email: order.email,
        phone: order.billing_address?.phone || 'Not provided',
        address: formatAddress(order.billing_address)
      },
      shippingInfo: order.shipping_address ? {
        name: order.shipping_address.first_name + ' ' + order.shipping_address.last_name,
        address: formatAddress(order.shipping_address)
      } : null,
      orderTotal: `${(order.total / 100).toFixed(2)} ${order.currency_code.toUpperCase()}`,
      paymentMethod: order.payments?.[0]?.provider_id || 'Not specified',
      customizedItems: customizedItems.map(item => formatCustomizedItem(item))
    }

    // Send email notification
    await emailService.sendCustomOrderNotification(emailData)

    res.status(200).json({ 
      message: "Order notification sent successfully",
      orderId: order.display_id 
    })

  } catch (error) {
    console.error("Error processing order notification webhook:", error)
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    })
  }
})

/**
 * Format address for email display
 */
function formatAddress(address: any): string {
  if (!address) return 'Not provided'
  
  const parts = [
    address.address_1,
    address.address_2,
    address.city,
    address.province,
    address.postal_code,
    address.country_code?.toUpperCase()
  ].filter(Boolean)
  
  return parts.join(', ')
}

/**
 * Format customized item data for email
 */
function formatCustomizedItem(item: any) {
  const product = item.variant?.product
  const customizations: Record<string, any> = {}
  
  // Extract customization data from item metadata
  if (item.metadata) {
    Object.keys(item.metadata).forEach(key => {
      if (key !== 'customizable' && item.metadata[key]) {
        // Convert snake_case to Title Case for display
        const displayKey = key
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        
        customizations[displayKey] = item.metadata[key]
      }
    })
  }

  return {
    name: item.title,
    quantity: item.quantity,
    price: `${(item.total / 100).toFixed(2)} ${item.variant?.product?.region?.currency_code?.toUpperCase() || 'CZK'}`,
    customizations: customizations
  }
}

export default router
