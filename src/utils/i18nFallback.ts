/**
 * Temporary i18n fallback for Phase 1
 * This provides basic translation functionality while we fix the i18n plugin
 */

import React from 'react';

// Simple translation strings for English (default)
const translations = {
  // Common
  'common:site.title': 'The Shin Shop',
  'common:navigation.home': 'Home',
  'common:navigation.products': 'Products',
  'common:navigation.customize': 'Customize',
  'common:navigation.about': 'About',
  'common:navigation.contact': 'Contact',
  'common:navigation.cart': 'Cart',
  'common:footer.copyright': 'All rights reserved.',
  'common:status.loading': 'Loading...',
  
  // Currency
  'currency.czech': 'Czech Crown (CZK)',
  'currency.euro': 'Euro (EUR)',
  
  // Language
  'language.english': 'English',
  'language.czech': 'Czech',
  
  // Cart
  'cart.addToCart': 'Add to Cart',
  'cart.adding': 'Adding...',
  'cart.itemAdded': 'Item Added',
  'cart.itemAddedMessage': 'Item added to cart successfully',
  'cart.addError': 'Error',
  'cart.outOfStock': 'Out of Stock',
  
  // Pages
  'pages:home.title': 'Premium Shin Pads',
  'pages:home.metaDescription': 'Premium customizable shin pads for sports enthusiasts',
  'pages:products.title': 'Our Products',
  'pages:products.metaDescription': 'Browse our collection of premium shin pads',
  'pages:about.title': 'About Us',
  'pages:about.metaDescription': 'Learn about The Shin Shop and our mission',
  'pages:contact.title': 'Contact Us',
  'pages:contact.metaDescription': 'Get in touch with The Shin Shop team',
  'pages:customize.title': 'Customize Your Shin Pads',
  'pages:customize.metaDescription': 'Create your own custom shin pad design',
  'pages:404.title': 'Page Not Found',
  'pages:404.message': 'The page you are looking for does not exist',
  'pages:404.backHome': 'Back to Home',
  'pages:404.browseProducts': 'Browse Products',
  
  // Contact form
  'pages:contact.form.name': 'Name',
  'pages:contact.form.email': 'Email',
  'pages:contact.form.message': 'Message',
  'pages:contact.form.namePlaceholder': 'Your name',
  'pages:contact.form.emailPlaceholder': 'your.email@example.com',
  'pages:contact.form.messagePlaceholder': 'Your message...',
  'pages:contact.form.send': 'Send Message',
  
  // Checkout
  'pages:checkout.title': 'Checkout',
  'pages:checkout.metaDescription': 'Complete your order',
  'pages:checkout.loading': 'Loading checkout...',
  'pages:checkout.buttons.processing': 'Processing...',
  'pages:checkout.success.message': 'Redirecting to confirmation page...',
  'pages:checkout.error.general': 'An error occurred during checkout',
  
  // Order confirmation
  'pages:orderConfirmation.title': 'Order Confirmation',
  'pages:orderConfirmation.metaDescription': 'Your order has been confirmed',
};

// Simple translation function
export const t = (key: string, fallback?: string): string => {
  return translations[key] || fallback || key;
};

// Mock useTranslation hook
export const useTranslation = () => {
  return { t };
};

// Mock Link component (temporary)
export const Link = ({ to, children, className, ...props }: any) => {
  if (typeof window !== 'undefined') {
    // Client-side: use anchor tag
    return React.createElement('a', { href: to, className, ...props }, children);
  }
  // Server-side: return span to avoid hydration issues
  return React.createElement('span', { className, ...props }, children);
};

// Mock useI18next hook
export const useI18next = () => {
  return {
    language: 'en',
    languages: ['en'],
    changeLanguage: (lang: string) => console.log('Language change to:', lang),
  };
};
