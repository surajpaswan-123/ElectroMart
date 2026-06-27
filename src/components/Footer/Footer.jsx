import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Company Info */}
        <div className="footer-section">

          <h2 className="footer-logo">
            ElectroMart
          </h2>

          <p>
            Your trusted destination for premium
            electronics, gadgets, and accessories.
            Discover the latest technology at the
            best prices.
          </p>

          <div className="social-icons">

            <a href="/">
              <FaFacebookF />
            </a>

            <a href="/">
              <FaInstagram />
            </a>

            <a href="/">
              <FaTwitter />
            </a>

            <a href="/">
              <FaLinkedinIn />
            </a>

          </div>

        </div>

        {/* Quick Links */}
        <div className="footer-section">

          <h3>Quick Links</h3>

          <ul>
            <li>Home</li>
            <li>Products</li>
            <li>Wishlist</li>
            <li>Cart</li>
            <li>Contact</li>
          </ul>

        </div>

        {/* Categories */}
        <div className="footer-section">

          <h3>Categories</h3>

          <ul>
            <li>Smartphones</li>
            <li>Laptops</li>
            <li>Gaming</li>
            <li>Audio</li>
            <li>Accessories</li>
          </ul>

        </div>

        {/* Contact Info */}
        <div className="footer-section">

          <h3>Contact Us</h3>

          <div className="contact-item">
            <FaMapMarkerAlt />
            <span>Gorakhpur, Uttar Pradesh</span>
          </div>

          <div className="contact-item">
            <FaPhoneAlt />
            <span>+91 9876543210</span>
          </div>

          <div className="contact-item">
            <FaEnvelope />
            <span>support@electromart.com</span>
          </div>

        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 ElectroMart. All Rights Reserved.
        </p>
      </div>

    </footer>
  );
}

export default Footer;