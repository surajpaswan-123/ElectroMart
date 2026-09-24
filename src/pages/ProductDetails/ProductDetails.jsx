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
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

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

  useEffect(() => {
    if (!id) return;
    API.get(`/api/products/${id}/reviews`).then((res) => setReviews(res.data || [])).catch(() => setReviews([]));
    API.get(`/api/products/${id}/reviews/mine`).then((res) => {
      if (res.status === 200 && res.data) {
        setMyReview(res.data);
        setReviewRating(res.data.rating);
        setReviewComment(res.data.comment || "");
      }
    }).catch(() => setMyReview(null));
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim() || reviewLoading) return;
    setReviewLoading(true);
    try {
      const res = await API.post(`/api/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setMyReview(res.data);
      setReviews((items) => [res.data, ...items.filter((item) => item.id !== res.data.id)]);
      setReviewComment(res.data.comment || "");
      const productRes = await API.get(`/api/products/${id}`);
      setProduct(productRes.data);
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setReviewLoading(false);
    }
  };

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
            <span>({resolvedProduct.rating ? Number(resolvedProduct.rating).toFixed(1) : "0.0"} · {resolvedProduct.reviews || reviews.length} Reviews)</span>
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

      <section className="reviews-section">\n        <h2>Customer Reviews</h2>\n        <form onSubmit={submitReview} className="review-form">\n          <label>Rating</label>\n          <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>\n            <option value={5}>5 - Excellent</option><option value={4}>4 - Good</option><option value={3}>3 - Average</option><option value={2}>2 - Poor</option><option value={1}>1 - Very poor</option>\n          </select>\n          <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} minLength={3} maxLength={2000} placeholder="Share your experience..." required />\n          <button type="submit" disabled={reviewLoading}>{reviewLoading ? "Saving..." : myReview ? "Update Review" : "Submit Review"}</button>\n        </form>\n        <div className="reviews-list">\n          {reviews.length === 0 ? <p>No reviews yet. Be the first to review this product.</p> : reviews.map((review) => (\n            <article key={review.id} className="review-item">\n              <strong>{review.userName || "Customer"}</strong>\n              <div>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>\n              <p>{review.comment}</p>\n            </article>\n          ))}\n        </div>\n      </section>\n\n      {/* Description Section */}
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

