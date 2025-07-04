import React from "react";
import { HeadFC, PageProps, graphql } from "gatsby";
import { useI18next, Link } from "gatsby-plugin-react-i18next";
import Layout from "../components/Layout";
import { Helmet } from "react-helmet";

const NotFoundPage: React.FC<PageProps> = () => {
  const { t } = useI18next();

  return (
    <Layout>
      <Helmet>
        <title>{t('pages:404.title')}</title>
        <meta name="description" content={t('pages:404.message')} />
      </Helmet>

      <div className="text-center py-16">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6">{t('pages:404.heading')}</h2>
        <p className="text-xl text-gray-600 mb-8">
          {t('pages:404.message')}
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/" className="btn btn-primary">
            {t('pages:404.backHome')}
          </Link>
          <Link to="/products" className="btn btn-secondary">
            {t('common:navigation.products')}
          </Link>
        </div>
      </div>
    </Layout>
  );
};

// GraphQL query temporarily removed for Phase 1
// export const query = graphql`
//   query ($language: String!) {
//     locales: allLocale(filter: {language: {eq: $language}}) {
//       edges {
//         node {
//           ns
//           data
//           language
//         }
//       }
//     }
//   }
// `;

export default NotFoundPage;

export const Head: HeadFC = () => <title>Not found</title>;
