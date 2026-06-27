import React from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import "./Categories.css";

function Categories() {
  const navigate = useNavigate();

  const categories = [
    {
      id: 101,
      price: 49999,
      title: "Smartphones",
      products: 250,
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    },

    {
      id: 102,
      price: 49999,
      title: "Laptops",
      products: 180,
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    },

    {
      id: 103,
      price: 49999,
      title: "Gaming",
      products: 120,
      image:
        "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800",
    },

    {
      id: 104,
      price: 49999,
      title: "Audio",
      products: 300,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    },
  ];

  return (
    <section className="categories">
      <div className="section-header">

        <h2>Shop By Category</h2>

        <button className="view-all-btn">
          View All →
        </button>

      </div>

      <div className="categories-grid">
        {categories.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              navigate(
                `/products?category=${item.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`
              )
            }
            style={{ cursor: "pointer" }}
          >
            <CategoryCard
              title={item.title}
              products={item.products}
              image={item.image}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;