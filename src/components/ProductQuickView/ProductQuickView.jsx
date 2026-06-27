import React from "react";
import { FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
import "./ProductQuickView.css";

function ProductQuickView({
  product,
  onAddToCart,
  onBuyNow,
  onClose,
  isAdded,
}) {
  if (!product) return null;

  return (
    <div
      className="pv-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="pv-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="pv-close" onClick={onClose}>
          ×
        </button>

        <div className="pv-grid pv-grid--quick">
          <div className="pv-image-wrap pv-image-wrap--quick">
            <img src={product.image} alt={product.title} />
          </div>

          <div className="pv-content pv-content--quick">
            <div className="pv-badge-row pv-badge-row--quick">
              {product.badge && (
                <span
                  className={`pv-badge ${
                    String(product.badge).toLowerCase()
                  }`}
                >
                  {product.badge}
                </span>
              )}
              {product.discount && (
                <span className="pv-discount">{product.discount}</span>
              )}
            </div>

            <h4 className="pv-brand">{product.brand}</h4>
            <h2 className="pv-title pv-title--quick">{product.title}</h2>

            <div className="pv-price pv-price--quick">
              <span className="pv-new">₹{product.price}</span>
              {product.oldPrice && (
                <span className="pv-old">₹{product.oldPrice}</span>
              )}
            </div>

            <div className="pv-actions pv-actions--quick">
              <button
                className={`pv-cart ${isAdded ? "added" : ""}`}
                disabled={isAdded}
                onClick={() => onAddToCart(product)}
              >
                <FaShoppingCart />
                {isAdded ? "Added ✓" : "Add"}
              </button>

              <button
                className="pv-buy"
                onClick={() => onBuyNow(product)}
              >
                Buy Now
              </button>
            </div>

            <div className="pv-tabs pv-tabs--quick">
              <div className="pv-tab-label">Specification</div>
              <div className="pv-tab-label">Reviews</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductQuickView;

