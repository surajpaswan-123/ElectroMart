import React from "react";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-container">

        <div className="hero-left">

          <div className="sale-badge">
            ⚡ SUMMER TECH SALE — UP TO 40% OFF
          </div>

          <h1>
            Next-Gen
            <span> Electronics </span>
            At Your Fingertips
          </h1>

          <p>
            Discover the latest smartphones, laptops,
            audio gear, and more — all with fast
            shipping and expert support.
          </p>

          <div className="hero-buttons">
            <button className="shop-btn">
              Shop Now →
            </button>

            <button className="deal-btn">
              View Deals
            </button>
          </div>

        </div>

        <div className="hero-right">

          <div className="image-card">

            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
              alt="phone"
            />

            <div className="price-tag">
              <span>Starting from</span>
              <h3>RS 199</h3>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;