import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogIn,
  User,
  ShoppingBag,
  Heart,
  Truck,
  Settings,
  Bell,
  HelpCircle,
  MapPin,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import "./AccountDropdown.css";

function AccountDropdown({ className = "" }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const menu = useMemo(() => {
    if (!isAuthenticated) {
      return [
        {
          label: "Welcome Guest",
          type: "label",
        },
       {
  label: "Logout",
  icon: <LogIn size={16} />,
  action: logout,
  danger: true,
},
        {
          label: "Register",
          icon: <User size={16} />,
          action: () => navigate("/login"),
        },
        {
          label: "Wishlist",
          icon: <Heart size={16} />,
          action: () => navigate("/login"),
        },
        {
          label: "Orders",
          icon: <Truck size={16} />,
          action: () => navigate("/login"),
        },
        {
          label: "Help Center",
          icon: <HelpCircle size={16} />,
          action: () => navigate("/contact"),
        },
      ];
    }

    return [
      {
        label: `Hi, ${user?.name || "User"}`,
        type: "label",
      },
      {
        label: "My Profile",
        icon: <User size={16} />,
        action: () => navigate("/about"),
      },
      {
        label: "My Orders",
        icon: <Truck size={16} />,
        action: () => navigate("/my-orders"),
      },
      {
        label: "Wishlist",
        icon: <Heart size={16} />,
        action: () => navigate("/wishlist"),
      },
      {
        label: "Saved Addresses",
        icon: <MapPin size={16} />,
        action: () => navigate("/contact"),
      },
      {
        label: "Notifications",
        icon: <Bell size={16} />,
        action: () => navigate("/about"),
      },
      {
        label: "Settings",
        icon: <Settings size={16} />,
        action: () => navigate("/about"),
      },
    {
  label: "Logout",
  icon: <LogIn size={16} />,
  action: () => {
    logout();
    navigate("/login", { replace: true });
  },
  danger: true,
},
    ];
  }, [isAuthenticated, logout, navigate, user?.name]);

  return (
    <div
      className={`acc-wrap ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="acc-btn"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="acc-btn-icon">{isAuthenticated ? <User size={16} /> : <User size={16} />}</span>
        <span className="acc-btn-text">{isAuthenticated ? user?.name : "Account"}</span>
        <ChevronDown size={16} className={`acc-chevron ${open ? "open" : ""}`} />
      </button>

      {open && (
        <div className="acc-menu" role="menu">
          {menu.map((item, idx) => {
            if (item.type === "label") {
              return (
                <div key={idx} className="acc-label">
                  {item.label}
                </div>
              );
            }

            return (
              <button
                key={idx}
                type="button"
                className={`acc-item ${item.danger ? "danger" : ""}`}
                onClick={() => {
                  item.action();
                  setOpen(false);
                }}
                role="menuitem"
              >
                <span className="acc-item-icon">{item.icon}</span>
                <span className="acc-item-text">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AccountDropdown;

