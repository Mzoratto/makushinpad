import React from "react";
import { PageProps, graphql } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { Helmet } from "react-helmet";

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

const ProductsPage: React.FC<ProductsPageProps> = ({ data }) => {
  const { t, i18n } = useI18next();
  const currentLanguage = i18n.language || 'en';

  // Filter products based on current language
  const products = data.allMarkdownRemark.edges.filter(({ node }) => {
    if (currentLanguage === 'en') {
      // For English, show products that don't have language field or have language !== 'cz'
      // Also filter by file path to exclude files in /cz/ directory
      return !node.frontmatter.language && !node.fileAbsolutePath.includes('/cz/');
    } else {
      // For Czech, show products that have language: 'cz' or are in /cz/ directory
      return node.frontmatter.language === 'cz' || node.fileAbsolutePath.includes('/cz/');
    }
  });

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(({ node }) => (
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
    allMarkdownRemark(sort: { frontmatter: { title: ASC } }) {
      edges {
        node {
          id
          excerpt(pruneLength: 120)
          frontmatter {
            id
            title
            slug
            defaultPrice
            customizable
            image
            language
          }
          fileAbsolutePath
        }
      }
    }
  }
`;

export default ProductsPage;
