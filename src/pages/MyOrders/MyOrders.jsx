import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";
import { FaTruck, FaEye, FaShoppingBag } from "react-icons/fa";
import API from "../../api/Api";

const STATUS_STYLES = {
  PLACED: {
    className: "mo-badge mo-badge--confirmed",
  },

  Confirmed: {
    className: "mo-badge mo-badge--confirmed",
  },

  Processing: {
    className: "mo-badge mo-badge--processing",
  },

  Shipped: {
    className: "mo-badge mo-badge--shipped",
  },

  Delivered: {
    className: "mo-badge mo-badge--delivered",
  },
};
function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrders() {
      try {
       const res = await API.get("/api/orders/my");
        if (!isMounted) return;
        const data = Array.isArray(res.data) ? res.data : [];
        setOrders(data);
      } catch (e) {
        if (!isMounted) return;
        // Keep UI unchanged: treat failure as no orders.
        setOrders([]);
      }
    }

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const mappedOrders = useMemo(() => {
    return (orders || []).map((order) => {
      const firstOrderItem = (order.orderItems && order.orderItems[0]) || null;
      const firstProduct = firstOrderItem?.product || null;

      const orderId = `EM-${order.id}`;
      const date = order.date || order.orderDate;
      const status = order.status || order.orderStatus;
      const paymentMethod = order.paymentMethod;
      const deliveryAddress = order.deliveryAddress || order.address;

      const items = (order.orderItems || []).map((oi) => ({
        productId: oi.product?.id,
     name: oi.product?.title,
        image: oi.product?.image || oi.product?.imageUrl,
        quantity: oi.quantity,
        price: oi.price,
      }));

      const totalAmount = order.totalAmount;

      return {
        orderId,
        date,
        status,
        paymentMethod,
        deliveryAddress,
        items: items.length ? items : (firstProduct ? [
          {
            productId: firstProduct.id,
            name: firstProduct.title,
           image: firstProduct.image || firstProduct.imageUrl,
            quantity: firstOrderItem?.quantity,
            price: firstOrderItem?.price,
          }
        ] : []),
        totalAmount,
        raw: order,
      };
    });
  }, [orders]);

  return (
    <div className="my-orders-page">
      <div className="my-orders-container">
        <div className="mo-header">
          <h1>My Orders</h1>
          <p className="mo-subtitle">
            Track your purchases and view order history.
          </p>
        </div>

        {mappedOrders.length === 0 ? (
          <div className="mo-empty">
            <div className="mo-empty-title">No Orders Found</div>
            <div className="mo-empty-sub">
              You have not placed any orders yet.
            </div>
            <button
              className="mo-empty-cta"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="mo-grid">
            {mappedOrders.map((order) => {
              const firstItem = order.items[0] || {};
              const statusCfg =
                STATUS_STYLES[order.status] ||
                STATUS_STYLES["Confirmed"];


              return (
                <div
                  key={order.orderId}
                  className="mo-card"
                >
                  <div className="mo-card-top">
                    <div>
                      <div className="mo-order-id">
                        Order ID: {order.orderId}
                      </div>
                      <div className="mo-order-date">
                        {order.date ? new Date(order.date).toLocaleDateString() : ""}
                      </div>
                    </div>

                    <div>
                      <span className={statusCfg.className}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="mo-card-mid">
                    <img
                      className="mo-product-img"
                      src={firstItem.image}
                      alt={firstItem.name}
                    />

                    <div className="mo-product-meta">
                      <div className="mo-product-name">
                        {firstItem.name}
                      </div>
                      <div className="mo-meta-row">
                        <span className="mo-meta-label">
                          Quantity
                        </span>
                        <span className="mo-meta-value">
                          {firstItem.quantity}
                        </span>
                      </div>

                      <div className="mo-meta-row">
                        <span className="mo-meta-label">
                          Total Amount
                        </span>
                        <span className="mo-meta-value">
                          ₹{order.totalAmount}
                        </span>
                      </div>

                      <div className="mo-meta-row">
                        <span className="mo-meta-label">
                          Payment
                        </span>
                        <span className="mo-meta-value">
                          {order.paymentMethod}
                        </span>
                      </div>

                      <div className="mo-meta-row">
                        <span className="mo-meta-label">
                          Address
                        </span>
                        <span className="mo-meta-value">
                          {order.deliveryAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mo-card-actions">
                    <button
                      className="mo-action mo-action--track"
                      type="button"
                      onClick={() => {
                        // Hook for tracking page
                        navigate("/order-confirmation");
                      }}
                    >
                      <FaTruck />
                      Track Order
                    </button>

                    <button
                      className="mo-action mo-action--details"
                      type="button"
                      onClick={() => {
                        // Hook for details page
                        navigate("/order-confirmation");
                      }}
                    >
                      <FaEye />
                      View Details
                    </button>

                    <button
                      className="mo-action mo-action--again"
                      type="button"
                      onClick={() => {
                        // Hook for buy again
                        navigate("/products");
                      }}
                    >
                      <FaShoppingBag />
                      Buy Again
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Keep footer spacing consistent with app */}
      <div style={{ height: 20 }} />
    </div>
  );
}

export default MyOrders;

