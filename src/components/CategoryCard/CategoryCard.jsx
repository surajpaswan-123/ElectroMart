import React from "react";
import "./CategoryCard.css";

function CategoryCard({
  image,
  title,
  products,
}) {
  return (
    <div className="category-card">
      <div className="category-image">
        <img src={image} alt={title} />
      </div>

      <div className="category-content">
        <h3>{title}</h3>

        <span>
          {products} Products
        </span>
      </div>
    </div>
  );
}

export default CategoryCard;