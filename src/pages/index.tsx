import React from "react";
import { Link, PageProps, graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { useI18next } from "gatsby-plugin-react-i18next";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";

interface IndexPageProps extends PageProps {
  data: {
    featured: {
      edges: Array<{
        node: {
          id: string;
          frontmatter: {
            id: string;
            title: string;
            slug: string;
            price: number;
            image: any;
            featured: boolean;
          };
          excerpt: string;
        };
      }>;
    };
  };
}

const IndexPage: React.FC<IndexPageProps> = ({ data }) => {
  const featuredProducts = data.featured.edges;
  const { t } = useI18next();

  return (
    <Layout>
      <Helmet>
        <title>{t('pages:home.title')}</title>
        <meta name="description" content={t('pages:home.metaDescription')} />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-xl mb-12 overflow-hidden">
        <div className="container-custom py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t('pages:home.hero.title')}
              </h1>
              <p className="text-lg mb-6">
                {t('pages:home.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn bg-white text-primary hover:bg-gray-100">
                  {t('common:buttons.shopCollection')}
                </Link>
                <Link to="/customize" className="btn bg-accent text-white hover:bg-opacity-90">
                  {t('common:buttons.startCustomizing')}
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              {/* Placeholder for hero image */}
              <div className="bg-white p-4 rounded-lg shadow-inner">
                <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('pages:home.featuredProducts')}</h2>
          <Link to="/products" className="text-primary hover:underline">
            {t('common:buttons.viewAll')}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map(({ node }) => (
            <ProductCard
              key={node.id}
              id={node.frontmatter.id}
              slug={node.frontmatter.slug}
              title={node.frontmatter.title}
              price={node.frontmatter.defaultPrice}
              description={node.excerpt}
              image={node.frontmatter.image}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('pages:home.features.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('pages:home.features.quality.title')}</h3>
            <p className="text-gray-600">
              {t('pages:home.features.quality.description')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('pages:home.features.customization.title')}</h3>
            <p className="text-gray-600">
              {t('pages:home.features.customization.description')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('pages:home.features.fast.title')}</h3>
            <p className="text-gray-600">
              {t('pages:home.features.fast.description')}
            </p>
          </div>
        </div>
      </div>


    </Layout>
  );
};

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    featured: allMarkdownRemark(
      filter: { frontmatter: { featured: { eq: true } } }
      limit: 3
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 120)
          frontmatter {
            id
            title
            slug
            defaultPrice
            featured
            image
          }
        }
      }
    }
  }
`;

export default IndexPage;
