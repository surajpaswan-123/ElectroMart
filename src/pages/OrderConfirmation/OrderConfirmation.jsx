import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const location = useLocation();
  const orderId = location?.state?.orderId;

  return (
    <div className="order-confirmation">
      <div className="confirmation-card">
        <div className="success-icon">✅</div>

        <h1>Order Confirmed!</h1>

        <p>
          Thank you for shopping with ElectroMart.
          Your order has been placed successfully.
        </p>

        <div className="order-id">
          Order ID: {orderId ? orderId : "EM-599067"}
        </div>

        <div className="confirmation-buttons">
          <Link
            to="/"
            className="continue-btn"
          >
            Continue Shopping
          </Link>

          <Link
            to="/my-orders"
            className="orders-btn"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
