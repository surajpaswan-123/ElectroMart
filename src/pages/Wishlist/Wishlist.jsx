import React, { useCallback, useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import API from "../../api/Api";
import "./Wishlist.css";

function Wishlist() {
  const [wishlistProducts, setWishlistProducts] = useState([]);

  const fetchWishlist = useCallback(async () => {
    const res = await API.get("/api/wishlist");

    // Backend returns: [{ id: <wishlistId>, product: <Product> }, ...]
    // ProductCard expects: { id, brand, title, image, price, oldPrice, reviews, badge, discount }
    const mapped = (res.data || []).map((item) => {
      const product = item?.product || {};
      return {
        wishlistId: item?.id,
        id: product?.id,
        brand: product?.brand,
        title: product?.title,
        image: product?.image,
        price: product?.price,
        oldPrice: product?.oldPrice,
        rating: product?.rating,
        reviews: product?.reviews,
      };
    });

    setWishlistProducts(mapped);
  }, []);

  useEffect(() => {
    fetchWishlist().catch(() => {
      // Keep UI unchanged; just avoid crashing.
    });
  }, [fetchWishlist]);

 const removeWishlistItem = useCallback(
  async (productId) => {
    if (!productId) return;

    try {
      await API.delete(`/api/wishlist/remove/${productId}`);
      await fetchWishlist();
    } catch (error) {
      console.error("Failed to remove wishlist item:", error);
    }
  },
  [fetchWishlist]
);
  return (
    <section className="wishlist-page">

      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>
          Save your favorite products and buy them later.
        </p>
      </div>

      <div className="wishlist-grid">
        {wishlistProducts.map((product) => (
          <div key={product.wishlistId || product.id}>
           <ProductCard
  {...product}
  onRemoveWishlist={() => removeWishlistItem(product.id)}
/>
          </div>
        ))}
      </div>

    </section>
  );
}

export default Wishlist;
