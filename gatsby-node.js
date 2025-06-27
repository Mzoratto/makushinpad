const path = require("path");

/**
 * @type {import('gatsby').GatsbyNode['onCreateWebpackConfig']}
 */
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html" || stage === "develop-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            // Exclude Konva and react-konva from SSR
            test: /konva|react-konva/,
            use: loaders.null(),
          },
          {
            // Also exclude our CustomizationCanvas component that uses Konva
            test: /CustomizationCanvas\.tsx$/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const productTemplate = path.resolve(`src/templates/product-template.tsx`);

  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            id
            frontmatter {
              slug
              language
            }
            fileAbsolutePath
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  // Create product pages - these will be processed by gatsby-plugin-react-i18next
  // Only create pages for English products (avoid duplicates)
  const products = result.data.allMarkdownRemark.edges;
  const englishProducts = products.filter(({ node }) => {
    // Only create pages for English products (no language field and not in /cz/ directory)
    return !node.frontmatter.language && !node.fileAbsolutePath.includes('/cz/');
  });

  englishProducts.forEach(({ node }) => {
    createPage({
      path: `/products/${node.frontmatter.slug}`,
      component: productTemplate,
      context: {
        id: node.id,
      },
    });
  });
};
