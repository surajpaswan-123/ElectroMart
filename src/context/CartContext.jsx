import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import API from "../api/Api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await API.get("/api/cart");
      const backendItems = res.data?.items || [];

      // Backend returns CartItemResponse with `productId`, but frontend expects `id`.
      const normalizedItems = backendItems.map((item) => ({
        ...item,
        id: item?.id ?? item?.productId,
        quantity: item?.quantity ?? 0,
      }));

      setCartItems(normalizedItems);
    } catch (err) {
      console.error("Load Cart Error:", err);
    }
  };

  const addToCart = async (product) => {
    const normalized = {
      id: product?.id,
      brand: product?.brand,
      title: product?.title,
      image: product?.image || product?.imageUrl,
      price: product?.price,
    };

    // Optimistic UI so the button updates immediately.
    setCartItems((prev) => {
      if (!normalized.id) return prev;
      const exists = prev.some((i) => i.id === normalized.id);
      if (exists) return prev;
      return [...prev, { ...normalized, quantity: 1 }];
    });

    try {
      await API.post(
        "/api/cart/add",
        null,
        {
          params: {
            productId: normalized.id,
            quantity: 1,
          },
        }
      );

      await loadCart();
    } catch (err) {
      console.error("Add Cart Error:", err);

      // Keep optimistic UI if the failure is due to auth/session.
      // This prevents the button from appearing to do nothing
      // while we wait for a subsequent authenticated load.
      const status = err?.response?.status;
      if (status === 401 || status === 403) return;

      // For other failures, re-sync from backend.
      await loadCart();
    }
  };

  const buyNow = async (product) => {
    const normalized = {
      id: product?.id,
      brand: product?.brand,
      title: product?.title,
      image: product?.image || product?.imageUrl,
      price: product?.price,
    };

    try {
      await API.post(
        "/api/cart/add",
        null,
        {
          params: {
            productId: normalized.id,
            quantity: 1,
          },
        }
      );

      await loadCart();
      return true;
    } catch (err) {
      console.error("Buy Now Error:", err);
      return false;
    }
  };

  const increaseQty = async (id, qty) => {
    try {
      await API.put("/api/cart/update", null, {
        params: {
          productId: id,
          quantity: qty + 1,
        },
      });

      await loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  const decreaseQty = async (id, qty) => {
    try {
      if (qty <= 1) {
        await API.delete(`/api/cart/remove/${id}`);
      } else {
        await API.put("/api/cart/update", null, {
          params: {
            productId: id,
            quantity: qty - 1,
          },
        });
      }

      await loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (id) => {
    try {
      await API.delete(`/api/cart/remove/${id}`);

      await loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        buyNow,
        increaseQty,
        decreaseQty,
        removeItem,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

