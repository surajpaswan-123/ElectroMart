import React, { useState } from "react";
import {
  FaHeart,
  FaStar,
  FaShoppingCart,
} from "react-icons/fa";
import API from "../../api/Api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./ProductCard.css";

import ProductQuickView from "../ProductQuickView/ProductQuickView";

function ProductCard({
  id,
  brand,
  title,
  image,
  price,
  oldPrice,
  reviews,
  badge,
  discount,
  onRemoveWishlist,
}) {
  const { addToCart, buyNow, cartItems } = useCart();
  const isAdded = cartItems.some((item) => item.id === id);
  const navigate = useNavigate();
const [wishlisted, setWishlisted] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = React.useState(false);

  const product = {
    id,
    brand,
    title,
    image,
    price,
    oldPrice,
    reviews,
    badge,
    discount,
  };

  const openQuickView = () => setQuickViewOpen(true);
  const closeQuickView = () => setQuickViewOpen(false);

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${id}`)}
      onMouseEnter={openQuickView}
      onMouseLeave={closeQuickView}
    >
      <div className="card-image">
        <span className={`badge ${badge?.toLowerCase()}`}>
          {badge}
        </span>

        {discount && <span className="discount">{discount}</span>}

       <button
  className="wishlist"
  type="button"
  onClick={async (e) => {
    e.stopPropagation();

    try {

      if (onRemoveWishlist) {

        onRemoveWishlist(id);

        return;

      }

      await API.post("/api/wishlist/add", null, {
        params: {
          productId: id,
        },
      });

      setWishlisted(true);

    } catch (err) {

      console.error(err);

    }
  }}
>

<FaHeart color={wishlisted ? "red" : ""} />

</button>

        <img src={image} alt={title} />

        {quickViewOpen && (
          <ProductQuickView
            product={product}
            isAdded={isAdded}
            onClose={closeQuickView}
            onAddToCart={(p) => addToCart(p)}
            onBuyNow={(p) => {
              buyNow(p);
              setQuickViewOpen(false);
              navigate("/checkout");
            }}
          />
        )}
      </div>

      <div className="card-body">
        <h5>{brand}</h5>

        <h3>{title}</h3>

        <div className="rating">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />

          <span>({reviews})</span>
        </div>

        <div className="price">
          <span className="new-price">₹{price}</span>
          {oldPrice && <span className="old-price">₹{oldPrice}</span>}
        </div>

        <div className="button-group">
          <button
            className={`cart-btn1 ${isAdded ? "added" : ""}`}
            disabled={isAdded}
            onClick={(e) => {
              e.stopPropagation();
              addToCart({
                id,
                brand,
                title,
                image,
                price,
              });
            }}
          >
            <FaShoppingCart />
            {isAdded ? "Added ✓" : "Add To Cart"}
          </button>

          <button
            className="buy-now-btn"
            onClick={(e) => {
              e.stopPropagation();
              buyNow({
                id,
                brand,
                title,
                image,
                price,
              });
              navigate("/checkout");
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;