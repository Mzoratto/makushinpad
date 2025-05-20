const path = require("path");

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
