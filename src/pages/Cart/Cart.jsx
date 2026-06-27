import React from "react";
import {
  FaTrash,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeItem,
  } = useCart();

  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = cartItems.length ? 20 : 0;
  const tax = cartItems.length ? 50 : 0;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <section className="cart-page">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>Your cart is empty.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>Review your selected products before checkout.</p>
      </div>

      <div className="cart-container">

        <div className="cart-items">

          {cartItems.map((item) => (

            <div
              className="cart-item"
              key={item.productId}
            >

              <img
                src={item.image || item.imageUrl}
                alt={item.title}
              />

              <div className="item-details">

                <h3>{item.title}</h3>

                <p>{item.brand}</p>

                <span>₹{item.price}</span>

              </div>

              <div className="quantity-box">

                <button
                  onClick={() =>
                    decreaseQty(
                      item.productId,
                      item.quantity
                    )
                  }
                >
                  <FaMinus />
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    increaseQty(
                      item.productId,
                      item.quantity
                    )
                  }
                >
                  <FaPlus />
                </button>

              </div>

              <button
                className="remove-btn"
                onClick={() =>
                  removeItem(item.productId)
                }
              >
                <FaTrash />
              </button>

            </div>

          ))}

        </div>

        <div className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>₹{shipping.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Tax</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed To Checkout
          </button>

        </div>

      </div>
    </section>
  );
}

export default Cart;
