import { TransactionBaseService } from "@medusajs/medusa"
import nodemailer from "nodemailer"

/**
 * Email service for sending custom order notifications
 * Integrates with the existing email notification system
 */
class EmailService extends TransactionBaseService {
  private transporter: any

  constructor(container: any) {
    super(container)
    this.initializeTransporter()
  }

  /**
   * Initialize email transporter based on environment configuration
   */
  private initializeTransporter() {
    const emailProvider = process.env.EMAIL_PROVIDER || 'smtp'
    
    switch (emailProvider.toLowerCase()) {
      case 'gmail':
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
          }
        })
        break
        
      case 'smtp':
      default:
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
          }
        })
        break
    }
  }

  /**
   * Send custom order notification email
   */
  async sendCustomOrderNotification(emailData: any): Promise<any> {
    const businessEmail = process.env.BUSINESS_EMAIL
    if (!businessEmail) {
      throw new Error('BUSINESS_EMAIL environment variable not configured')
    }

    const htmlContent = this.generateOrderEmailHTML(emailData)
    const textContent = this.generateOrderEmailText(emailData)

    const mailOptions = {
      from: process.env.SMTP_USER || process.env.GMAIL_USER,
      to: businessEmail,
      cc: process.env.BUSINESS_CC_EMAIL || '',
      subject: `🎯 New Custom Shin Pad Order - ${emailData.orderId}`,
      text: textContent,
      html: htmlContent,
      attachments: this.prepareAttachments(emailData)
    }

    try {
      const result = await this.transporter.sendMail(mailOptions)
      console.log('Order notification email sent successfully:', result.messageId)
      return result
    } catch (error) {
      console.error('Failed to send order notification email:', error)
      throw error
    }
  }

  /**
   * Generate HTML email content
   */
  private generateOrderEmailHTML(emailData: any): string {
    const { orderId, orderDate, customerInfo, shippingInfo, orderTotal, customizedItems, paymentMethod } = emailData

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Custom Shin Pad Order - ${orderId}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background: #f9fafb; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .section { padding: 30px; border-bottom: 1px solid #e5e7eb; }
        .section:last-child { border-bottom: none; }
        .section-title { font-size: 20px; margin: 0 0 20px 0; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        .customer-section { background: #f0fdf4; }
        .customization-section { background: #fffbeb; }
        .summary-section { background: #fdf2f8; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .info-item { display: flex; flex-direction: column; }
        .info-item.full-width { grid-column: 1 / -1; }
        .label { font-weight: 600; color: #374151; margin-bottom: 4px; }
        .value { color: #1f2937; }
        .product-item { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .product-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f3f4f6; }
        .product-name { color: #1f2937; font-size: 18px; margin: 0; }
        .product-meta { display: flex; gap: 15px; }
        .quantity, .price { padding: 4px 12px; border-radius: 12px; font-size: 14px; font-weight: 500; }
        .quantity { background: #dbeafe; color: #1e40af; }
        .price { background: #dcfce7; color: #166534; font-weight: 600; }
        .customizations h4 { margin: 0 0 15px 0; color: #374151; }
        .customization-grid { display: grid; gap: 12px; }
        .customization-item { background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 3px solid #f59e0b; display: flex; justify-content: space-between; align-items: center; }
        .custom-label { font-weight: 600; color: #374151; min-width: 120px; }
        .custom-value { flex: 1; text-align: right; }
        .summary-grid { display: grid; gap: 15px; }
        .summary-item { display: flex; justify-content: space-between; padding: 12px 0; }
        .total-item { border-top: 2px solid #e5e7eb; padding-top: 15px; font-size: 18px; font-weight: 600; }
        .total-amount { color: #dc2626; font-size: 20px; }
        .footer { background: #f8fafc; padding: 30px; text-align: center; color: #6b7280; }
        @media (max-width: 600px) {
          .info-grid { grid-template-columns: 1fr; }
          .product-header { flex-direction: column; align-items: flex-start; gap: 10px; }
          .customization-item { flex-direction: column; align-items: flex-start; gap: 8px; }
          .custom-value { text-align: left; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 The Shin Shop</h1>
          <p>New Custom Order - ${orderId}</p>
          <p>${orderDate}</p>
        </div>

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
            <div class="info-item full-width">
              <span class="label">Shipping Address:</span>
              <span class="value">${shippingInfo.address}</span>
            </div>
            ` : ''}
          </div>
        </div>

        <div class="section customization-section">
          <h2 class="section-title">🎨 Customization Details</h2>
          ${customizedItems.map((item: any) => `
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
                ${Object.entries(item.customizations).map(([key, value]: [string, any]) => 
                  value ? `<div class="customization-item">
                    <span class="custom-label">${key}:</span>
                    <span class="custom-value">${value}</span>
                  </div>` : ''
                ).join('')}
              </div>
            </div>
          </div>
          `).join('')}
        </div>

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
        </div>

        <div class="footer">
          <p>This is an automated notification from your Shin Shop Medusa.js backend.</p>
          <p>Generated: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
    `
  }

  /**
   * Generate plain text email content
   */
  private generateOrderEmailText(emailData: any): string {
    const { orderId, orderDate, customerInfo, shippingInfo, orderTotal, customizedItems, paymentMethod } = emailData

    let text = `THE SHIN SHOP - NEW CUSTOM ORDER\n`
    text += `================================\n\n`
    text += `Order ID: ${orderId}\n`
    text += `Date: ${orderDate}\n\n`
    
    text += `CUSTOMER INFORMATION\n`
    text += `-------------------\n`
    text += `Name: ${customerInfo.name}\n`
    text += `Email: ${customerInfo.email}\n`
    text += `Phone: ${customerInfo.phone}\n`
    text += `Billing Address: ${customerInfo.address}\n`
    
    if (shippingInfo) {
      text += `Shipping Address: ${shippingInfo.address}\n`
    }
    
    text += `\nCUSTOMIZATION DETAILS\n`
    text += `====================\n`
    customizedItems.forEach((item: any, index: number) => {
      text += `\n${index + 1}. ${item.name} (Qty: ${item.quantity}) - ${item.price}\n`
      text += `   Customizations:\n`
      Object.entries(item.customizations).forEach(([key, value]: [string, any]) => {
        if (value) text += `   - ${key}: ${value}\n`
      })
    })
    
    text += `\nORDER SUMMARY\n`
    text += `============\n`
    text += `Payment Method: ${paymentMethod}\n`
    text += `Total Amount: ${orderTotal}\n\n`
    
    text += `Generated: ${new Date().toLocaleString()}`
    
    return text
  }

  /**
   * Prepare email attachments
   */
  private prepareAttachments(emailData: any): any[] {
    const attachments = []
    
    // Add order summary attachment
    const summaryContent = this.generateOrderEmailText(emailData)
    attachments.push({
      filename: `order-${emailData.orderId}-summary.txt`,
      content: summaryContent,
      contentType: 'text/plain'
    })
    
    return attachments
  }
}

export default EmailService
