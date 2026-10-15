import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/react";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const root = ReactDOM.createRoot(document.getElementById("root"));

if (!publishableKey) {
  root.render(
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h2>ElectroMart authentication is not configured</h2>
      <p>Add <code>REACT_APP_CLERK_PUBLISHABLE_KEY</code> to the frontend environment variables.</p>
    </div>
  );
} else {
  root.render(
    <ClerkProvider publishableKey={publishableKey}>
      <BrowserRouter>
        <CartProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </CartProvider>
      </BrowserRouter>
    </ClerkProvider>
  );
}
