const nodemailer = require('nodemailer');
const { generateOrderEmailHTML, generateOrderEmailText } = require('../templates/orderEmailTemplate');
const { prepareImageAttachments, createOrderSummaryAttachment } = require('./fileHandler');

/**
 * Email service for sending custom order notifications
 * Supports multiple email providers and handles attachments
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  /**
   * Initialize email transporter based on environment configuration
   */
  initializeTransporter() {
    const emailProvider = process.env.EMAIL_PROVIDER || 'smtp';
    
    switch (emailProvider.toLowerCase()) {
      case 'gmail':
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD // Use App Password, not regular password
          }
        });
        break;
        
      case 'smtp':
      default:
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
          }
        });
        break;
    }
  }

  /**
   * Send custom order notification email
   * @param {Object} emailData - Order and customization data
   * @returns {Promise} - Email sending result
   */
  async sendCustomOrderNotification(emailData) {
    const businessEmail = process.env.BUSINESS_EMAIL;
    if (!businessEmail) {
      throw new Error('BUSINESS_EMAIL environment variable not configured');
    }

    const htmlContent = generateOrderEmailHTML(emailData);
    const textContent = generateOrderEmailText(emailData);

    const mailOptions = {
      from: process.env.SMTP_USER || process.env.GMAIL_USER,
      to: businessEmail,
      cc: process.env.BUSINESS_CC_EMAIL || '', // Optional CC email
      subject: `🎯 New Custom Shin Pad Order - ${emailData.orderId}`,
      text: textContent,
      html: htmlContent,
      attachments: await this.prepareAttachments(emailData)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Order notification email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Failed to send order notification email:', error);
      throw error;
    }
  }



  /**
   * Prepare email attachments (for uploaded images and order summary)
   * @param {Object} emailData - Order data
   * @returns {Array} - Attachment array
   */
  async prepareAttachments(emailData) {
    const attachments = [];

    try {
      // Process uploaded images
      const imageAttachments = await prepareImageAttachments(emailData.customizedItems);
      attachments.push(...imageAttachments);

      // Add order summary attachment
      const summaryAttachment = createOrderSummaryAttachment(emailData.customizedItems, emailData);
      attachments.push(summaryAttachment);

      console.log(`Prepared ${attachments.length} attachments for order ${emailData.orderId}`);

    } catch (error) {
      console.error('Error preparing attachments:', error);

      // Add error information as attachment
      attachments.push({
        filename: `attachment-error-${emailData.orderId}.txt`,
        content: `Error preparing attachments: ${error.message}\n\nPlease contact the customer directly for any uploaded images.`,
        contentType: 'text/plain'
      });
    }

    return attachments;
  }
}

module.exports = EmailService;
