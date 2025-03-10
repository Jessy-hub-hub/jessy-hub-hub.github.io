// components/CartOverlay.js
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useCart } from "../context/CartContext";
import "./CartOverlay.css";
import { gql, useMutation } from "@apollo/client";
import { slugify } from "../utils/slugify.js";

// Helper function to create slugs
const getSlug = (product) => {
  if (product.id === "ps-5") return "playstation-5";
  return slugify(product.name);
};

const CREATE_ORDER = gql`
  mutation CreateOrder($products: [OrderProductInput!]!) {
    createOrder(products: $products) {
      id
      products {
        productId
        quantity
        totalPrice
      }
      totalPrice
    }
  }
`;

// Helper function to render attributes with a dynamic data-testid
const renderAttribute = (attrKey, value) => {
  const testId = `product-attribute-${attrKey}-${value}`;
  return (
    <p key={attrKey} className="cart-item-option" data-testid={testId}>
      {attrKey}: {value}
    </p>
  );
};

const CartOverlay = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, clearCart, removeFromCart } = useCart();
  const initialCartLengthRef = useRef(null);

  // Always call hooks unconditionally
  useEffect(() => {
    if (isOpen && initialCartLengthRef.current === null) {
      initialCartLengthRef.current = cart.length;
    }
  }, [isOpen, cart]);

  useEffect(() => {
    if (isOpen && initialCartLengthRef.current > 0 && cart.length === 0) {
      onClose();
      initialCartLengthRef.current = null;
    }
  }, [cart, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      initialCartLengthRef.current = null;
    }
  }, [isOpen]);

  // Compute totals (always run)
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price?.amount || 0) * item.quantity,
    0
  );

  // useMutation hook is always called
  const [createOrder, { loading, error }] = useMutation(CREATE_ORDER, {
    onCompleted: () => {
      clearCart();
      onClose();
      alert("Order placed successfully!");
    },
  });

  // Now conditionally return null if overlay is not open.
  if (!isOpen) return null;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const orderProducts = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      totalPrice: (item.price?.amount || 0) * item.quantity,
    }));
    createOrder({ variables: { products: orderProducts } });
  };

  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      removeFromCart(item, item.options);
    } else {
      updateQuantity(item, -1, item.options);
    }
  };

  // Render the overlay in a portal attached to #modal-root or document.body
  const modalContainer = document.getElementById("modal-root") || document.body;

  return ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div className="backdrop" onClick={onClose} />
      <div className="cart-overlay" data-testid="cart-overlay" role="dialog">
        {/* The heading now shows strictly "My Bag" (no count here) */}
        <h3>My Bag</h3>
        {/* (Removed the overlay cart count element to avoid duplicate count text) */}

        <div className="cart-items-container">
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => {
              const slug = getSlug(item);
              const attributesToRender = item.selectedAttributes || item.options;
              return (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-details">
                    <p className="cart-item-name">{item.name}</p>
                    {attributesToRender &&
                      Object.entries(attributesToRender).map(([attrKey, value]) =>
                        renderAttribute(attrKey, value)
                      )}
                    <p className="cart-item-price">
                      {item.price?.currency?.symbol || "$"}
                      {item.price?.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="cart-item-quantity">
                    <button onClick={() => handleDecrease(item)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item, 1, item.options)}>
                      +
                    </button>
                  </div>
                  <div className="cart-item-image">
                    <img src={item.gallery[0]} alt={item.name} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="cart-total-container">
          <span className="cart-total-label">Total:</span>
          <span className="cart-total-amount">
            {cart.length > 0 && (cart[0].price?.currency?.symbol || "$")}
            {totalPrice.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={cart.length === 0 || loading}
          className={`place-order-btn ${cart.length === 0 ? "disabled" : "active"}`}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
        {error && (
          <p className="error">Failed to place order. Please try again.</p>
        )}
      </div>
    </>,
    modalContainer
  );
};

export default CartOverlay;
