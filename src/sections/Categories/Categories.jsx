import React from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import "./Categories.css";

function Categories() {
  const navigate = useNavigate();

  const categories = [
    {
      id: 101,
      title: "Smartphones",
      products: 250,
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    },
    {
      id: 102,
      title: "Laptops",
      products: 180,
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    },
    {
      id: 103,
      title: "Gaming",
      products: 120,
      image:
        "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800",
    },
    {
      id: 104,
      title: "Audio",
      products: 300,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    },
  ];

  const openCategory = (title) => {
    navigate(
      `/products?category=${title.toLowerCase().replace(/\s+/g, "-")}`
    );
  };

  return (
    <section className="categories">
      <div className="section-header">
        <div className="category-heading">
          <span className="section-eyebrow">FIND YOUR NEXT FAVOURITE</span>
          <h2>Shop by Category</h2>
        </div>

        <button
          className="view-all-btn"
          type="button"
          onClick={() => navigate("/products")}
        >
          View All <span aria-hidden="true">›</span>
        </button>
      </div>

      <div className="categories-grid">
        {categories.map((item) => (
          <button
            className="category-item"
            key={item.id}
            type="button"
            onClick={() => openCategory(item.title)}
            aria-label={`Shop ${item.title}`}
          >
            <CategoryCard
              title={item.title}
              products={item.products}
              image={item.image}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

export default Categories;