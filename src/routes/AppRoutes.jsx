import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import Login from "../pages/Login/Login";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Wishlist from "../pages/Wishlist/Wishlist";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import OrderConfirmation from "../pages/OrderConfirmation/OrderConfirmation";
import MyOrders from "../pages/MyOrders/MyOrders";
import VerifyOTP from "../pages/VerifyOTP";

import Layout from "../components/Layout/Layout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>

        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<ProtectedRoute> <Cart /></ProtectedRoute>}/>
        <Route path="/checkout" element={<ProtectedRoute>  <Checkout /></ProtectedRoute>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
<Route
  path="/order-confirmation"
  element={
    <ProtectedRoute>
      <OrderConfirmation />
    </ProtectedRoute>
  }
/>        <Route path="/wishlist"   element={  <ProtectedRoute>      <Wishlist /> </ProtectedRoute>} />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;

