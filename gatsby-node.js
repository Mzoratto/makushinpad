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
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  // Create product pages
  const products = result.data.allMarkdownRemark.edges;
  products.forEach(({ node }) => {
    createPage({
      path: `/products/${node.frontmatter.slug}`,
      component: productTemplate,
      context: {
        id: node.id,
      },
    });
  });
};
