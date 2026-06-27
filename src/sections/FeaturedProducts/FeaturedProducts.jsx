import React from "react";
import ProductCard from "../../components/ProductCard/ProductCard";

import "./FeaturedProducts.css";

function FeaturedProducts() {

  const products = [

    {
      id:1,
      title: "iPhone 15 Pro Max",
      price: 999,
      oldPrice: 1199,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    },

    {
      id:2,
      title: "MacBook Pro M3",
      price: 1899,
      oldPrice: 2099,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    },

    {
      id:3,
      title: "Sony WH-1000XM5",
      price: 299,
      oldPrice: 399,
      rating: 4,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    },

    {
      id:4,
      title: "Gaming Console",
      price: 499,
      oldPrice: 599,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800",
    },
    
  ];
  return (
    <section className="featured-products">
      <div className="featured-header">
        <h2>Featured Products</h2>
        <p>
          Discover our best-selling
          electronics
        </p>
      </div>
      <div className="products-grid">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            {...product}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;