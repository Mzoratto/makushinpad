import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";
import Layout from "../components/Layout";

const AboutPage: React.FC = () => {
  const { t } = useI18next();

  return (
    <Layout>
      <Helmet>
        <title>{t('pages:about.title')}</title>
        <meta
          name="description"
          content={t('pages:about.metaDescription')}
        />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t('pages:about.pageTitle')}</h1>

        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-6">
            {t('pages:about.intro')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('pages:about.story.title')}</h2>
          <p>
            {t('pages:about.story.content')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('pages:about.mission.title')}</h2>
          <p>
            {t('pages:about.mission.content')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('pages:about.quality.title')}</h2>
          <p>
            {t('pages:about.quality.content')}
          </p>

          <div className="bg-gray-100 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-2">{t('pages:contact.info.title')}</h3>
            <p>
              {t('pages:contact.subtitle')}
            </p>
            <p className="mt-2">
              {t('pages:contact.info.email')}: info@shinshop.com
              <br />
              {t('pages:contact.info.phone')}: (123) 456-7890
              <br />
              {t('pages:contact.info.address')}: 123 Shin Guard Lane, Sports City, SC 12345
            </p>
          </div>
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

export default AboutPage;
