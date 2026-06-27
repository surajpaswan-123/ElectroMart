import React from "react";
import "./About.css";

function About() {
  return (
    <section className="about-page">

      <div className="about-hero">

        <h1>About ElectroMart</h1>

        <p>
          Your trusted destination for premium
          electronics, innovative gadgets, and
          cutting-edge technology products.
        </p>

      </div>

      <div className="about-container">

        <div className="about-content">

          <h2>Who We Are</h2>

          <p>
            ElectroMart is a modern electronics
            marketplace dedicated to providing
            customers with the latest smartphones,
            laptops, gaming accessories, smart home
            devices, and premium electronic products.
          </p>

          <p>
            Our mission is to make technology
            accessible, affordable, and reliable
            for everyone. We focus on quality,
            customer satisfaction, and fast delivery.
          </p>

        </div>

        <div className="about-image">

          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000"
            alt="About ElectroMart"
          />

        </div>

      </div>

      <div className="stats-section">

        <div className="stat-card">
          <h3>50K+</h3>
          <p>Happy Customers</p>
        </div>

        <div className="stat-card">
          <h3>10K+</h3>
          <p>Products Available</p>
        </div>

        <div className="stat-card">
          <h3>100+</h3>
          <p>Top Brands</p>
        </div>

        <div className="stat-card">
          <h3>24/7</h3>
          <p>Customer Support</p>
        </div>

      </div>

      <div className="mission-section">

        <h2>Our Mission</h2>

        <p>
          To deliver world-class electronics and
          technology solutions while providing an
          exceptional shopping experience for every
          customer.
        </p>

      </div>

    </section>
  );
}

export default About;