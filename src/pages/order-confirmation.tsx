/**
 * Order Confirmation Page
 * Displays order success/failure status after checkout
 */

import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';

interface OrderConfirmationProps {
  location?: {
    search?: string;
  };
}

const OrderConfirmationPage: React.FC<OrderConfirmationProps> = ({ location }) => {
  const { t } = useTranslation();
  const [orderStatus, setOrderStatus] = useState<'success' | 'failed' | 'pending' | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(location?.search || window.location.search);
    const status = urlParams.get('status') as 'success' | 'failed' | 'pending';
    const order = urlParams.get('order');

    setOrderStatus(status);
    setOrderNumber(order);

    // If no status provided, redirect to products
    if (!status) {
      navigate('/products');
    }
  }, [location]);

  const getStatusIcon = () => {
    switch (orderStatus) {
      case 'success':
        return (
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'failed':
        return (
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'pending':
        return (
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (orderStatus) {
      case 'success':
        return {
          title: t('pages:orderConfirmation.success.title'),
          message: t('pages:orderConfirmation.success.message'),
          description: t('pages:orderConfirmation.success.description'),
        };
      case 'failed':
        return {
          title: t('pages:orderConfirmation.failed.title'),
          message: t('pages:orderConfirmation.failed.message'),
          description: t('pages:orderConfirmation.failed.description'),
        };
      case 'pending':
        return {
          title: t('pages:orderConfirmation.pending.title'),
          message: t('pages:orderConfirmation.pending.message'),
          description: t('pages:orderConfirmation.pending.description'),
        };
      default:
        return {
          title: '',
          message: '',
          description: '',
        };
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <Layout>
      <Helmet>
        <title>{t('pages:orderConfirmation.title')}</title>
        <meta name="description" content={t('pages:orderConfirmation.metaDescription')} />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          {getStatusIcon()}
          
          <h1 className="text-3xl font-bold mb-4">{statusMessage.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{statusMessage.message}</p>
          
          {orderNumber && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">{t('pages:orderConfirmation.orderNumber')}</p>
              <p className="text-lg font-semibold">{orderNumber}</p>
            </div>
          )}
          
          <p className="text-gray-600 mb-8">{statusMessage.description}</p>

          <div className="space-y-4">
            {orderStatus === 'success' && (
              <>
                <button
                  onClick={() => navigate('/products')}
                  className="w-full btn btn-primary"
                >
                  {t('pages:orderConfirmation.buttons.continueShopping')}
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full btn btn-secondary"
                >
                  {t('pages:orderConfirmation.buttons.contactSupport')}
                </button>
              </>
            )}

            {orderStatus === 'failed' && (
              <>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full btn btn-primary"
                >
                  {t('pages:orderConfirmation.buttons.tryAgain')}
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full btn btn-secondary"
                >
                  {t('pages:orderConfirmation.buttons.contactSupport')}
                </button>
              </>
            )}

            {orderStatus === 'pending' && (
              <>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full btn btn-primary"
                >
                  {t('pages:orderConfirmation.buttons.checkStatus')}
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full btn btn-secondary"
                >
                  {t('pages:orderConfirmation.buttons.contactSupport')}
                </button>
              </>
            )}
          </div>

          {orderStatus === 'success' && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                {t('pages:orderConfirmation.nextSteps.title')}
              </h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• {t('pages:orderConfirmation.nextSteps.emailConfirmation')}</li>
                <li>• {t('pages:orderConfirmation.nextSteps.processing')}</li>
                <li>• {t('pages:orderConfirmation.nextSteps.shipping')}</li>
                <li>• {t('pages:orderConfirmation.nextSteps.tracking')}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmationPage;
