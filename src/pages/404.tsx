import React from "react";
import { Link, HeadFC, PageProps } from "gatsby";
import Layout from "../components/Layout";
import { Helmet } from "react-helmet";

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <Helmet>
        <title>Page Not Found | Shin Shop</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>
      
      <div className="text-center py-16">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link to="/products" className="btn btn-secondary">
            Browse Products
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => <title>Not found</title>;
