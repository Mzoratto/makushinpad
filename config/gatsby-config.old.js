const config = {
  siteMetadata: {
    title: `Shin Shop`,
    description: `Custom shin pads for sports enthusiasts`,
    author: `@shinshop`,
    siteUrl: process.env.GATSBY_SITE_URL || `https://www.shinshop.com`,
  },
  graphqlTypegen: true,
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locale`,
        languages: [`en`, `cz`],
        defaultLanguage: `en`,
        siteUrl: process.env.GATSBY_SITE_URL || `https://www.shinshop.com`,
        generateDefaultLanguagePage: true,
        redirect: true,
        i18nextOptions: {
          interpolation: {
            escapeValue: false,
          },
          keySeparator: '.',
          nsSeparator: ':',
          debug: false,
          fallbackLng: 'en',
          supportedLngs: ['en', 'cz'],
          defaultNS: 'common',
          ns: ['common', 'pages', 'products'],
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `locale`,
        path: `${__dirname}/src/locales`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `products`,
        path: `${__dirname}/content/products`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [],
      },
    },
  ],
}

module.exports = config
