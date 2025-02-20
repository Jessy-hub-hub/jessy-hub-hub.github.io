import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartOverlay from "./CartOverlay";
import "./Header.css";

const Header = () => {
  const { cart } = useCart();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Determine active category from URL segments
  const segments = location.pathname.split("/").filter(Boolean);
  const activeCategory = segments[0] || "all";

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const getCategoryLinkProps = (category) =>
    category === activeCategory
      ? { "data-testid": "active-category-link", className: "active" }
      : { "data-testid": "category-link" };

  // Toggle the cart overlay on button click
  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  return (
    <header className="header">
      <nav>
        <Link to="/all" {...getCategoryLinkProps("all")}>
          all
        </Link>
        <Link to="/tech" {...getCategoryLinkProps("tech")}>
          tech
        </Link>
        <Link to="/clothes" {...getCategoryLinkProps("clothes")}>
          clothes
        </Link>
      </nav>
      <button data-testid="cart-btn" onClick={toggleCart}>
        Cart{" "}
        {itemCount > 0 && (
          <span>
            ({itemCount} {itemCount === 1 ? "Item" : "Items"})
          </span>
        )}
      </button>
      {isCartOpen && <CartOverlay onClose={() => setIsCartOpen(false)} />}
    </header>
  );
};

export default Header;
