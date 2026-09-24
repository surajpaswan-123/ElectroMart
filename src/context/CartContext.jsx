import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/Api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");

  const normalizeItems = (items = []) =>
    items.map((item) => ({
      ...item,
      id: item?.productId,
      productId: item?.productId,
      image: item?.image || item?.imageUrl,
      quantity: Number(item?.quantity || 0),
    }));

  const loadCart = async () => {
    setCartLoading(true);
    try {
      const res = await API.get("/api/cart");
      setCartItems(normalizeItems(res.data?.items));
      setCartError("");
      return res.data;
    } catch (err) {
      setCartError(err?.response?.status === 401 ? "Please login to use your cart." : "Unable to load cart.");
      setCartItems([]);
      return null;
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    const productId = product?.id;
    if (!productId || quantity < 1) return false;

    try {
      const res = await API.post("/api/cart/add", null, {
        params: { productId, quantity },
      });
      setCartItems(normalizeItems(res.data?.items));
      setCartError("");
      return true;
    } catch (err) {
      console.error("Add Cart Error:", err);
      setCartError(err?.response?.data?.message || "Could not add product to cart.");
      return false;
    }
  };

  const buyNow = async (product) => addToCart(product, 1);

  const updateQuantity = async (id, quantity) => {
    if (!id || quantity < 1) return false;
    try {
      const res = await API.put("/api/cart/update", null, {
        params: { productId: id, quantity },
      });
      setCartItems(normalizeItems(res.data?.items));
      setCartError("");
      return true;
    } catch (err) {
      console.error("Update Cart Error:", err);
      setCartError(err?.response?.data?.message || "Could not update quantity.");
      return false;
    }
  };

  const increaseQty = async (id, qty) => updateQuantity(id, qty + 1);

  const decreaseQty = async (id, qty) => {
    if (qty <= 1) return removeItem(id);
    return updateQuantity(id, qty - 1);
  };

  const removeItem = async (id) => {
    if (!id) return false;
    try {
      const res = await API.delete(`/api/cart/remove/${id}`);
      setCartItems(normalizeItems(res.data?.items));
      setCartError("");
      return true;
    } catch (err) {
      console.error("Remove Cart Error:", err);
      setCartError(err?.response?.data?.message || "Could not remove item.");
      return false;
    }
  };

  const clearCart = async () => {
    try {
      const res = await API.delete("/api/cart/clear");
      setCartItems(normalizeItems(res.data?.items));
      setCartError("");
      return true;
    } catch (err) {
      console.error("Clear Cart Error:", err);
      setCartError(err?.response?.data?.message || "Could not clear cart.");
      return false;
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        cartLoading,
        cartError,
        addToCart,
        buyNow,
        updateQuantity,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
