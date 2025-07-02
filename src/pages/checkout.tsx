/**
 * Checkout Page for Medusa.js Integration
 * Handles the complete checkout flow with Mollie payments
 */

import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatMedusaPrice } from '../utils/priceUtils';

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  sameAsShipping: boolean;
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddress1: string;
  shippingAddress2: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  shippingPhone: string;
}

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const { cart, isLoading: cartLoading } = useCart();
  const { currency } = useCurrency();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    country: 'CZ',
    phone: '',
    sameAsShipping: true,
    shippingFirstName: '',
    shippingLastName: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingPostalCode: '',
    shippingCountry: 'CZ',
    shippingPhone: '',
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && (!cart || cart.items.length === 0)) {
      navigate('/products');
    }
  }, [cart, cartLoading]);

  /**
   * Handle form input changes
   */
  const handleInputChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Handle same as shipping checkbox
   */
  const handleSameAsShipping = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sameAsShipping: checked,
      ...(checked ? {
        shippingFirstName: prev.firstName,
        shippingLastName: prev.lastName,
        shippingAddress1: prev.address1,
        shippingAddress2: prev.address2,
        shippingCity: prev.city,
        shippingPostalCode: prev.postalCode,
        shippingCountry: prev.country,
        shippingPhone: prev.phone,
      } : {}),
    }));
  };

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const required = ['email', 'firstName', 'lastName', 'address1', 'city', 'postalCode', 'phone'];
    
    for (const field of required) {
      if (!formData[field as keyof CheckoutFormData]) {
        alert(t('pages:checkout.validation.required', { field: t(`pages:checkout.form.${field}`) }));
        return false;
      }
    }

    if (!formData.sameAsShipping) {
      const shippingRequired = ['shippingFirstName', 'shippingLastName', 'shippingAddress1', 'shippingCity', 'shippingPostalCode'];
      for (const field of shippingRequired) {
        if (!formData[field as keyof CheckoutFormData]) {
          alert(t('pages:checkout.validation.required', { field: t(`pages:checkout.form.${field}`) }));
          return false;
        }
      }
    }

    return true;
  };

  /**
   * Handle checkout submission
   */
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsProcessing(true);
      
      // For now, redirect to a simple order confirmation
      // In a full implementation, you would:
      // 1. Update cart with customer info
      // 2. Create payment session with Mollie
      // 3. Redirect to Mollie payment page
      // 4. Handle payment completion webhook
      
      console.log('Checkout data:', { formData, cart });
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to order confirmation
      navigate('/order-confirmation?status=success');
      
    } catch (error) {
      console.error('Checkout failed:', error);
      alert(t('pages:checkout.error.general'));
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <Layout>
      <Helmet>
        <title>{t('pages:checkout.title')}</title>
        <meta name="description" content={t('pages:checkout.metaDescription')} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('pages:checkout.pageTitle')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">{t('pages:checkout.sections.contact')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('pages:checkout.form.email')} *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('pages:checkout.form.phone')} *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">{t('pages:checkout.sections.billing')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('pages:checkout.form.firstName')} *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('pages:checkout.form.lastName')} *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('pages:checkout.form.address1')} *
                    </label>
                    <input
                      type="text"
                      value={formData.address1}
                      onChange={(e) => handleInputChange('address1', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('pages:checkout.form.address2')}
                    </label>
                    <input
                      type="text"
                      value={formData.address2}
                      onChange={(e) => handleInputChange('address2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('pages:checkout.form.city')} *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('pages:checkout.form.postalCode')} *
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{t('pages:checkout.sections.shipping')}</h2>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sameAsShipping}
                      onChange={(e) => handleSameAsShipping(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">{t('pages:checkout.form.sameAsBilling')}</span>
                  </label>
                </div>

                {!formData.sameAsShipping && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Shipping form fields - similar to billing */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('pages:checkout.form.firstName')} *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingFirstName}
                        onChange={(e) => handleInputChange('shippingFirstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    {/* Add other shipping fields as needed */}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('pages:checkout.buttons.processing')}
                  </span>
                ) : (
                  t('pages:checkout.buttons.completeOrder')
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">{t('pages:checkout.sections.orderSummary')}</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.title}</h3>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      {item.metadata && Object.keys(item.metadata).length > 0 && (
                        <div className="text-xs text-gray-500">
                          {Object.entries(item.metadata).slice(0, 2).map(([key, value]) => (
                            <div key={key}>{key}: {String(value)}</div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {formatMedusaPrice(item.total, cart.currency_code)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('common:cart.subtotal')}</span>
                  <span>{formatMedusaPrice(cart.subtotal, cart.currency_code)}</span>
                </div>
                
                {cart.shipping_total > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>{t('common:cart.shipping')}</span>
                    <span>{formatMedusaPrice(cart.shipping_total, cart.currency_code)}</span>
                  </div>
                )}
                
                {cart.tax_total > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>{t('common:cart.tax')}</span>
                    <span>{formatMedusaPrice(cart.tax_total, cart.currency_code)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>{t('common:cart.total')}</span>
                  <span>{formatMedusaPrice(cart.total, cart.currency_code)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
