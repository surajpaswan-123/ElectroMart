import React, { useCallback, useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import API from "../../api/Api";
import "./Wishlist.css";

function Wishlist() {
  const [wishlistProducts, setWishlistProducts] = useState([]);

  const fetchWishlist = useCallback(async () => {
    const res = await API.get("/api/wishlist");
    const mapped = (res.data || []).map((item) => ({
      wishlistId: item?.id,
      id: item?.productId,
      brand: item?.brand,
      title: item?.title,
      image: item?.image,
      price: item?.price,
      oldPrice: item?.oldPrice,
      rating: item?.rating,
      reviews: item?.reviews,
    }));

    setWishlistProducts(mapped.filter((product) => product.id));
  }, []);

  useEffect(() => {
    fetchWishlist().catch((error) => {
      console.error("Failed to load wishlist:", error);
    });
  }, [fetchWishlist]);

  const removeWishlistItem = useCallback(
    async (productId) => {
      if (!productId) return;

      try {
        await API.delete(`/api/wishlist/remove/${productId}`);
        setWishlistProducts((items) =>
          items.filter((item) => item.id !== productId)
        );
      } catch (error) {
        console.error("Failed to remove wishlist item:", error);
      }
    },
    []
  );

  return (
    <section className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>Save your favorite products and buy them later.</p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="wishlist-empty">
          <h2>Your wishlist is empty</h2>
          <p>Add products you love and they will appear here.</p>
        </div>
      ) : (
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
      )}
    </section>
  );
}

export default Wishlist;
