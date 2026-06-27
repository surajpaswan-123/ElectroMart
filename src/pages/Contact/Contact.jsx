import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

import "./Contact.css";

function Contact() {
  return (
    <section className="contact-page">

      <div className="contact-header">

        <h1>Contact Us</h1>

        <p>
          We'd love to hear from you. Get in touch
          with our team for support, inquiries,
          or feedback.
        </p>

      </div>

      <div className="contact-container">

        {/* Contact Information */}

        <div className="contact-info">

          <h2>Get In Touch</h2>

          <div className="info-item">
            <FaMapMarkerAlt />
            <span>
              Gorakhpur, Uttar Pradesh, India
            </span>
          </div>

          <div className="info-item">
            <FaPhoneAlt />
            <span>
              +91 9876543210
            </span>
          </div>

          <div className="info-item">
            <FaEnvelope />
            <span>
              support@electromart.com
            </span>
          </div>

          <div className="info-item">
            <FaClock />
            <span>
              Mon - Sat : 9:00 AM - 8:00 PM
            </span>
          </div>

        </div>

        {/* Contact Form */}

        <div className="contact-form-box">

          <h2>Send Message</h2>

          <form className="contact-form">

            <input
              type="text"
              placeholder="Full Name"
            />

            <input
              type="email"
              placeholder="Email Address"
            />

            <input
              type="text"
              placeholder="Subject"
            />

            <textarea
              rows="6"
              placeholder="Write your message..."
            ></textarea>

            <button type="submit">
              Send Message
            </button>

          </form>

        </div>

      </div>

    </section>
  );
}

export default Contact;