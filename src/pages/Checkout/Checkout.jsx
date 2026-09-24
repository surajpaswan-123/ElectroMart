import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/Api";
import { useCart } from "../../context/CartContext";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "",
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const applyCoupon = async () => {
    if (!couponCode.trim() || couponLoading) return;
    setCouponLoading(true);
    setCouponMessage("");
    try {
      const res = await API.post("/api/coupons/apply", { code: couponCode.trim() });
      setCoupon(res.data);
      setCouponMessage(res.data.message || "Coupon applied");
    } catch (err) {
      setCoupon(null);
      setCouponMessage(err?.response?.data?.message || "Invalid coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponMessage("");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  const shipping = cartItems.length ? 20 : 0;
  const discount = Number(coupon?.discountAmount || 0);
  const payableTotal = Math.max(0, subtotal + shipping - discount);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    console.log("[Checkout] Place Order clicked");


    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.paymentMethod
    ) {
      alert("Please fill all fields");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const customerName = `${formData.firstName} ${formData.lastName}`.trim();
const orderItems = cartItems.map((item) => ({
  quantity: item.quantity,
  price: item.price,
  product: {
    id: item.productId,
  },
}));

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );

      const payload = {
        customerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        totalAmount: payableTotal,
        couponCode: coupon?.code || null,
        discountAmount: discount,
        paymentMethod: formData.paymentMethod,
        orderStatus: "PLACED",
        orderItems,
      };

      console.log("[Checkout] Payload being sent to /api/orders:", payload);
      console.log(
        "[Checkout] Cart orderItems (product ids, qty, price):",
        orderItems.map((oi) => ({
          productId: oi?.product?.id,
          quantity: oi.quantity,
          price: oi.price,
        }))
      );

      const response = await API.post("/api/orders", payload);


      const savedOrderId = response?.data?.id;

      if (!savedOrderId) {
        throw new Error("Order created but no order id returned.");
      }
     await API.delete("/api/cart/clear");
      // Ensure UI matches existing format: EM-{numericId}
      navigate("/order-confirmation", {
        state: { orderId: `EM-${savedOrderId}` },
      });
    } catch (err) {
      console.error("[Checkout] Failed to place order:", err);
      const status = err?.response?.status;
      const data = err?.response?.data;
      alert(
        `Failed to place order. Status: ${status ?? "unknown"}. ${data?.message ?? "No message"}`
      );
    } finally {
      setIsPlacingOrder(false);
    }

  };

  return (
    <section className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>
          Complete your order by filling in your
          shipping and payment details.
        </p>
      </div>

      <div className="checkout-container">
        {/* Billing Form */}
        <div className="checkout-form">
          <h2>Billing Details</h2>

          <form onSubmit={handlePlaceOrder}>
            <div className="form-row">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <textarea
              rows="5"
              name="address"
              placeholder="Shipping Address"
              value={formData.address}
              onChange={handleChange}
            ></textarea>

            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="">
                Select Payment Method
              </option>

              <option value="Credit Card">
                Credit Card
              </option>

              <option value="Debit Card">
                Debit Card
              </option>

              <option value="UPI">
                UPI
              </option>

              <option value="COD">
                Cash On Delivery
              </option>
            </select>

            <button
              type="submit"
              className="place-order-btn"
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? "Placing..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
  <h2>Order Summary</h2>

  <div className="coupon-box">
    <input
      type="text"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
      placeholder="Coupon code"
      disabled={Boolean(coupon)}
    />
    {coupon ? (
      <button type="button" onClick={removeCoupon}>Remove</button>
    ) : (
      <button type="button" onClick={applyCoupon} disabled={couponLoading}>
        {couponLoading ? "Applying..." : "Apply"}
      </button>
    )}
    {couponMessage && <small>{couponMessage}</small>}
  </div>

  {cartItems.map((item) => (
    <div
      className="summary-item"
      key={item.productId}
    >
      <span>
        {item.title} × {item.quantity}
      </span>

      <span>
        ₹{(item.price * item.quantity).toFixed(2)}
      </span>
    </div>
  ))}

  <div className="summary-item">
    <span>Shipping</span>
    <span>₹{shipping.toFixed(2)}</span>
  </div>

  {discount > 0 && (
    <div className="summary-item">
      <span>Coupon Discount</span>
      <span>-₹{discount.toFixed(2)}</span>
    </div>
  )}

  <hr />

  <div className="summary-total">
    <span>Total</span>
    <span>₹{payableTotal.toFixed(2)}</span>
  </div>
</div>    
      </div>
    </section>
  );
}

export default Checkout;
