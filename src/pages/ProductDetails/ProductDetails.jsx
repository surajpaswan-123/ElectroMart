import React, { useEffect, useMemo, useState } from "react";
import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";
import "./ProductDetails.css";
import { useCart } from "../../context/CartContext";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/Api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const { addToCart, buyNow } = useCart();

  useEffect(() => {
    if (!id) return;

    API.get(`/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch(() => {
        setProduct(null);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    API.get(`/api/wishlist/check/${id}`)
      .then((res) => setWishlisted(Boolean(res.data)))
      .catch(() => setWishlisted(false));
  }, [id]);

  const increaseQty = () => {
    setQuantity((q) => q + 1);
  };

  const decreaseQty = () => {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  };

  const resolvedProduct = useMemo(() => {
    if (product) return product;
    return {
      id: id,
      title: "",
      brand: "",
      imageUrl: "",
      price: 0,
      oldPrice: null,
      category: null,
    };
  }, [product, id]);

  const addProductToCart = () => {
    const p = resolvedProduct;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: p.id,
        brand: p.brand,
        title: p.title,
        image: p.imageUrl,
        price: p.price,
      });
    }
  };

  const toggleWishlist = async () => {
    if (!id || wishlistLoading) return;
    setWishlistLoading(true);
    try {
      const res = await API.post("/api/wishlist/toggle", null, {
        params: { productId: id },
      });
      setWishlisted(Boolean(res.data));
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const buyProductNow = () => {
    const p = resolvedProduct;
    buyNow({
      id: p.id,
      brand: p.brand,
      title: p.title,
      image: p.imageUrl,
      price: p.price,
    });
    navigate("/checkout");
  };

  return (
    <section className="product-details">
      <div className="product-container">
        {/* Left Side */}
        <div className="product-image-section">
          <img
            src={resolvedProduct.imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000"}
            alt={resolvedProduct.title || "Product"}
            className="main-product-image"
          />
        </div>

        {/* Right Side */}
        <div className="product-info">
          <span className="product-category">
            {resolvedProduct.category?.name || "Smartphones"}
          </span>

          <h1>{resolvedProduct.title || "Product"}</h1>

          <div className="rating-box">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <span>(125 Reviews)</span>
          </div>

          <div className="price-section">
            <span className="current-price">${resolvedProduct.price || 0}</span>
            <span className="old-price">${resolvedProduct.oldPrice || "1199"}</span>
          </div>

          <p className="product-description">
            {resolvedProduct.description ||
              "Experience the latest innovation with the best specs and performance."}
          </p>

          {/* Quantity */}
          <div className="quantity-wrapper">
            <button onClick={decreaseQty}>-</button>
            <span>{quantity}</span>
            <button onClick={increaseQty}>+</button>
          </div>

          {/* Buttons */}
          <div className="action-buttons">
            <button
              className="add-cart-btn"
              onClick={addProductToCart}
            >
              <FaShoppingCart />
              Add To Cart
            </button>

            <button
              className="buy-now-btn"
              onClick={buyProductNow}
            >
              Buy Now
            </button>

            <button className="wishlist-btn-details">
              <FaHeart />
              Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="description-section">
        <h2>Product Description</h2>
        <p>
          {resolvedProduct.description ||
            "No additional description available."}
        </p>
      </div>
    </section>
  );
}

export default ProductDetails;

