import React from "react";
import { graphql, PageProps } from "gatsby";
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
          };
          excerpt: string;
        };
      }>;
    };
  };
}

const ProductsPage: React.FC<ProductsPageProps> = ({ data }) => {
  const products = data.allMarkdownRemark.edges;

  return (
    <Layout>
      <Helmet>
        <title>Products | Shin Shop</title>
        <meta name="description" content="Browse our collection of customizable shin pads" />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Our Shin Pad Collection</h1>
        <p className="text-gray-600">
          Browse our selection of high-quality, customizable shin pads. Each design can be personalized with your own images and text.
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
  query {
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
          }
        }
      }
    }
  }
`;

export default ProductsPage;
