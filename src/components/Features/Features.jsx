import React from "react";
import {
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaUndo,
} from "react-icons/fa";

import "./Features.css";

function Features() {
  const features = [
    {
      icon: <FaTruck />,
      title: "Free Shipping",
      description: "Free delivery on orders over $100",
    },
    {
      icon: <FaShieldAlt />,
      title: "2 Year Warranty",
      description: "Extended protection on electronics",
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      description: "Expert customer assistance",
    },
    {
      icon: <FaUndo />,
      title: "Easy Returns",
      description: "30 day return guarantee",
    },
  ];

  return (
    <section className="features">
      <div className="features-container">
        {features.map((item, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;