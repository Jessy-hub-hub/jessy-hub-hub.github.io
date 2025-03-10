// components/Header.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Header.css";

const Header = () => {
  const { cart, toggleCartOverlay } = useCart();
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const activeCategory = segments[0] || "all";
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const getCategoryLinkProps = (category) =>
    category === activeCategory
      ? { "data-testid": "active-category-link", className: "active" }
      : { "data-testid": "category-link" };

  return (
    <header className="header">
      <nav>
        <Link to="/all" {...getCategoryLinkProps("all")}>all</Link>
        <Link to="/tech" {...getCategoryLinkProps("tech")}>tech</Link>
        <Link to="/clothes" {...getCategoryLinkProps("clothes")}>clothes</Link>
      </nav>
      <button data-testid="cart-btn" onClick={toggleCartOverlay}>
        Cart{" "}
        {itemCount > 0 && (
          <span data-testid="cart-btn-count">
            ({itemCount} {itemCount === 1 ? "Item" : "Items"})
          </span>
        )}
      </button>
    </header>
  );
};

export default Header;
