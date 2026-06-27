import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaTimes,
  FaHeart,
  FaUser,
  FaBolt,
} from "react-icons/fa";

import { useCart } from "../../context/CartContext";
import AccountDropdown from "../AccountDropdown/AccountDropdown";
import { AuthProvider } from "../../context/AuthContext";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [search, setSearch] =    useState("");

  const [showAccountMenu, setShowAccountMenu] = useState(false);


  const { cartItems } = useCart();

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );



  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(
        `/products?search=${encodeURIComponent(
          search
        )}`
      );
    }
  };

  const categories = [
    "Smartphones",
    "Laptops",
    "Audio",
    "Gaming",
    "Smart Home",
    "Cameras",
    "Accessories",
    "Deals",
  ];

  const handleCategoryClick = (
    category
  ) => {
    navigate(
      `/products?category=${category
        .toLowerCase()
        .replace(/\s+/g, "-")}`
    );
  };



  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <div
          className="logo-section"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <div className="logo-icon">
            <FaBolt />
          </div>

          <h2 className="logo-text">
            Electro<span>Mart</span>
          </h2>
        </div>

        {/* Search */}
        <div className="search-section">
          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search phones, laptops, headphones..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={handleSearch}
          />
        </div>

        {/* Actions */}
        <div className="action-section">

          {/* Account */}
          <AccountDropdown />

          {/* Wishlist */}
          <button
            className="icon-btn"
            onClick={() =>
              navigate("/wishlist")
            }
          >
            <FaHeart />
          </button>

          {/* Cart */}
          <button
            className="cart-btn"
            onClick={() =>
              navigate("/cart")
            }
          >
            <FaShoppingCart />

            <span>Cart</span>

            <div className="cart-count">
              {cartCount}
            </div>
          </button>

          {/* Mobile Menu */}
          <button
            className="menu-btn"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            {menuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>

        </div>
      </div>

      {/* Mobile Search */}
      <div className="mobile-search">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search electronics..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          onKeyDown={handleSearch}
        />
      </div>

      {/* Categories */}
      <nav className="category-nav">
        {categories.map(
          (item, index) => (
            <button
              key={index}
              className={
                item === "Deals"
                  ? "deal-link"
                  : ""
              }
              onClick={() =>
                handleCategoryClick(
                  item
                )
              }
            >
              {item}
            </button>
          )
        )}
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {categories.map(
            (item, index) => (
              <button
                key={index}
                onClick={() => {
                  handleCategoryClick(
                    item
                  );
                  setMenuOpen(
                    false
                  );
                }}
              >
                {item}
              </button>
            )
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;