import React from "react";
import { Helmet } from "react-helmet";
import Layout from "../components/Layout";

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>About Us | Shin Shop</title>
        <meta
          name="description"
          content="Learn about Shin Shop, our mission, and our commitment to quality customizable shin pads."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Shin Shop</h1>

        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-6">
            At Shin Shop, we're passionate about combining protection with
            personal expression. Our mission is to provide athletes with
            high-quality shin pads that not only offer superior protection but
            also allow them to showcase their unique style.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
          <p>
            Shin Shop was founded in 2023 by a group of sports enthusiasts who
            were tired of boring, generic shin pads. We believed that protective
            gear should be both functional and expressive, allowing athletes to
            stand out on the field while staying safe.
          </p>
          <p>
            What started as a small workshop has grown into a specialized
            e-commerce business, serving athletes across all sports that require
            shin protection. Our commitment to quality and customization has
            never wavered, and we continue to innovate with new designs and
            personalization options.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Products</h2>
          <p>
            Every pair of shin pads we offer is crafted with premium materials
            that provide excellent protection without sacrificing comfort. Our
            base designs are created by talented artists, and our customization
            technology allows you to add your personal touch.
          </p>
          <p>
            Whether you're looking for a bold design to intimidate opponents or
            a personalized pair with your name and number, Shin Shop has you
            covered. We offer a wide range of designs suitable for soccer,
            hockey, baseball, and other sports requiring shin protection.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Our Commitment to Quality
          </h2>
          <p>
            We believe that protective gear should never compromise on safety.
            That's why all our shin pads meet or exceed industry standards for
            impact protection. We regularly test our products to ensure they
            provide the protection athletes need during intense gameplay.
          </p>
          <p>
            Our customization process is designed to maintain the integrity of
            the protective elements while allowing for personalization. Your
            safety is our top priority, followed closely by your satisfaction
            with the design.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Environmental Responsibility
          </h2>
          <p>
            We're committed to reducing our environmental footprint. Our
            packaging is made from recycled materials, and we're constantly
            looking for ways to make our production process more sustainable.
            We're also exploring eco-friendly material options for future
            product lines.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Join Our Team</h2>
          <p>
            We're always looking for passionate individuals to join our growing
            team. If you're interested in sports, design, or e-commerce, check
            out our careers page for current openings.
          </p>

          <div className="bg-gray-100 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
            <p>
              Have questions about our products or customization options? We'd
              love to hear from you!
            </p>
            <p className="mt-2">
              Email: info@shinshop.com
              <br />
              Phone: (123) 456-7890
              <br />
              Address: 123 Shin Guard Lane, Sports City, SC 12345
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
