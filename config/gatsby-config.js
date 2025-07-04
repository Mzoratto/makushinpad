/**
 * Gatsby Configuration
 * Main configuration file for The Shin Shop
 */

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `The Shin Shop`,
    description: `Premium shin pads for athletes - Professional and custom design options`,
    author: `@shinshop`,
    siteUrl: process.env.GATSBY_SITE_URL || `http://localhost:8000`,
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'cz'],
    defaultCurrency: 'CZK',
    supportedCurrencies: ['CZK', 'EUR'],
  },
  plugins: [
    // Essential Gatsby plugins
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    
    // TypeScript support
    `gatsby-plugin-typescript`,
    
    // Styling
    `gatsby-plugin-postcss`,
    
    // File system
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/../src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/../content`,
      },
    },
    
    // Internationalization - Temporarily disabled for deployment
    // TODO: Fix path-to-regexp compatibility issue
    // {
    //   resolve: `gatsby-plugin-react-i18next`,
    //   options: {
    //     localeJsonSourceName: `locale`,
    //     languages: [`en`, `cz`],
    //     defaultLanguage: `en`,
    //     siteUrl: process.env.GATSBY_SITE_URL || `http://localhost:8000`,
    //     i18nextOptions: {
    //       interpolation: {
    //         escapeValue: false,
    //       },
    //       keySeparator: false,
    //       nsSeparator: false,
    //     },
    //     pages: [
    //       {
    //         matchPath: '/:lang?/products/:slug',
    //         getLanguageFromPath: true,
    //       },
    //     ],
    //   },
    // },
    
    // Markdown processing
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
              quality: 90,
            },
          },
        ],
      },
    },
    
    // PWA features
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `The Shin Shop`,
        short_name: `ShinShop`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#1f2937`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`,
      },
    },
    
    // Performance optimizations can be added later
  ],
  
  // Development server configuration
  developMiddleware: app => {
    app.use('/api', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      next()
    })
  },
}
