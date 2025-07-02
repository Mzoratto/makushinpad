import { EventBusService, OrderService } from "@medusajs/medusa"
import { EmailService } from "../services/email"

/**
 * Order notification subscriber
 * Automatically sends email notifications when orders are placed
 */
class OrderNotificationSubscriber {
  private orderService_: OrderService
  private emailService_: EmailService

  constructor({ orderService, emailService, eventBusService }: {
    orderService: OrderService
    emailService: EmailService
    eventBusService: EventBusService
  }) {
    this.orderService_ = orderService
    this.emailService_ = emailService

    // Subscribe to order placement events
    eventBusService.subscribe("order.placed", this.handleOrderPlaced.bind(this))
  }

  /**
   * Handle order placed event
   */
  async handleOrderPlaced(data: { id: string }): Promise<void> {
    try {
      console.log(`📧 Processing order notification for order: ${data.id}`)

      // Get complete order details
      const order = await this.orderService_.retrieve(data.id, {
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
        console.log(`⏭️  Order ${order.display_id} has no customized items, skipping email notification`)
        return
      }

      console.log(`🎨 Order ${order.display_id} contains ${customizedItems.length} customized items`)

      // Prepare email data
      const emailData = {
        orderId: order.display_id,
        orderDate: new Date(order.created_at).toLocaleString(),
        customerInfo: {
          name: this.getCustomerName(order),
          email: order.email,
          phone: order.billing_address?.phone || 'Not provided',
          address: this.formatAddress(order.billing_address)
        },
        shippingInfo: order.shipping_address ? {
          name: `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
          address: this.formatAddress(order.shipping_address)
        } : null,
        orderTotal: `${(order.total / 100).toFixed(2)} ${order.currency_code.toUpperCase()}`,
        paymentMethod: this.getPaymentMethod(order),
        customizedItems: customizedItems.map(item => this.formatCustomizedItem(item))
      }

      // Send email notification
      await this.emailService_.sendCustomOrderNotification(emailData)
      
      console.log(`✅ Email notification sent successfully for order ${order.display_id}`)

    } catch (error) {
      console.error(`❌ Failed to send email notification for order ${data.id}:`, error)
      // Don't throw error to avoid breaking the order flow
    }
  }

  /**
   * Get customer name from order
   */
  private getCustomerName(order: any): string {
    if (order.customer?.first_name && order.customer?.last_name) {
      return `${order.customer.first_name} ${order.customer.last_name}`
    }
    
    if (order.billing_address?.first_name && order.billing_address?.last_name) {
      return `${order.billing_address.first_name} ${order.billing_address.last_name}`
    }
    
    return order.email || 'Customer'
  }

  /**
   * Format address for email display
   */
  private formatAddress(address: any): string {
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
   * Get payment method from order
   */
  private getPaymentMethod(order: any): string {
    if (!order.payments || order.payments.length === 0) {
      return 'Not specified'
    }

    const payment = order.payments[0]
    const provider = payment.provider_id

    // Format provider names nicely
    const providerNames: Record<string, string> = {
      'mollie': 'Mollie',
      'stripe': 'Stripe',
      'manual': 'Manual Payment',
      'paypal': 'PayPal'
    }

    return providerNames[provider] || provider
  }

  /**
   * Format customized item data for email
   */
  private formatCustomizedItem(item: any) {
    const customizations: Record<string, any> = {}
    
    // Extract customization data from item metadata
    if (item.metadata) {
      Object.keys(item.metadata).forEach(key => {
        if (item.metadata[key] && item.metadata[key] !== 'undefined') {
          // Convert snake_case to Title Case for display
          const displayKey = key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          
          customizations[displayKey] = item.metadata[key]
        }
      })
    }

    // Also check variant metadata for customizations
    if (item.variant?.metadata) {
      Object.keys(item.variant.metadata).forEach(key => {
        if (item.variant.metadata[key] && item.variant.metadata[key] !== 'undefined') {
          const displayKey = key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          
          if (!customizations[displayKey]) {
            customizations[displayKey] = item.variant.metadata[key]
          }
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
}

export default OrderNotificationSubscriber
