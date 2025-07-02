import React, { useEffect, useState } from "react";
import { PageProps } from "gatsby";
import { useI18next, useTranslation } from "gatsby-plugin-react-i18next";
import Layout from "../components/Layout";
import MedusaProductCard from "../components/MedusaProductCard";
import { LoadingCards, LoadingInline } from "../components/LoadingStates";
import { Helmet } from "react-helmet";
import { useCurrency } from "../contexts/CurrencyContext";
import medusaClient, { MedusaProduct } from "../services/medusaClient";

interface ProductsPageProps extends PageProps {
  data: {
    allMarkdownRemark: {
      edges: Array<{
        node: {
          id: string;
          frontmatter: {
            id: string;
            title: string;
            slug: string;
            defaultPrice: number;
            image: any;
            customizable: boolean;
            language?: string;
          };
          excerpt: string;
          fileAbsolutePath: string;
        };
      }>;
    };
  };
}

const ProductsPage: React.FC<ProductsPageProps> = () => {
  const { t, i18n } = useI18next();
  const { currency } = useCurrency();
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products from Medusa API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { products } = await medusaClient.getProducts();
        setProducts(products);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>{t('pages:products.title')}</title>
        <meta name="description" content={t('pages:products.metaDescription')} />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('pages:products.pageTitle')}</h1>
        <p className="text-gray-600">
          {t('pages:products.subtitle')}
        </p>
      </div>

      <div>
        {loading ? (
          <LoadingCards count={6} />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-semibold mb-2">{t('common:status.error')}</h2>
              <p className="text-gray-600">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              {t('common:buttons.retry')}
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">{t('pages:products.noProducts')}</h2>
            <p className="text-gray-600">{t('pages:products.noProductsDescription')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <MedusaProductCard
                key={product.id}
                product={product}
                showAddToCart={true}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

// GraphQL query removed - now using Medusa.js API

export default ProductsPage;
