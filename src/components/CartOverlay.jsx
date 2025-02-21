import React from "react";
import ReactDOM from "react-dom";
import { useCart } from "../context/CartContext";
import "./CartOverlay.css";
import { gql, useMutation } from "@apollo/client";
import { slugify } from "../utils/slugify.js";

// Helper: if the product is "ps-5", return a custom slug.
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

const CartOverlay = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, clearCart, removeFromCart } = useCart();

  // Always use the real cart data
  const displayCart = cart;

  // Calculate total items and total price
  const totalQuantity = displayCart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = displayCart.reduce(
    (sum, item) => sum + (item.price?.amount || 0) * item.quantity,
    0
  );

  // Mutation to simulate placing an order
  const [createOrder, { loading, error }] = useMutation(CREATE_ORDER, {
    onCompleted: () => {
      clearCart();
      alert("Order placed successfully!");
    },
  });

  const handlePlaceOrder = () => {
    if (displayCart.length === 0) return;
    const orderProducts = displayCart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      totalPrice: (item.price?.amount || 0) * item.quantity,
    }));
    createOrder({ variables: { products: orderProducts } });
  };

  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      removeFromCart(item);
    } else {
      updateQuantity(item, -1);
    }
  };

  const overlayContent = (
    <>
      {isOpen && <div className="backdrop" onClick={onClose} />}
      <div
        className="cart-overlay"
        data-testid="cart-overlay"
        role="dialog"
        style={{ display: isOpen ? "flex" : "none" }}
      >
        {/* Updated heading: Removed the count from the heading */}
        <h3>My Bag</h3>
        {/* The cart count should be rendered in a dedicated element (e.g., a cart button):
            <span data-testid="cart-btn">({totalQuantity} {totalQuantity === 1 ? "Item" : "Items"})</span>
        */}
        <div className="cart-items-container">
          {displayCart.map((item) => {
            const slug = getSlug(item);
            // Use options (or selectedAttributes) to display attributes.
            const attributesToRender = item.selectedAttributes || item.options;
            return (
              <div key={item.id} className="cart-item" data-testid={`product-${slug}`}>
                <div className="cart-item-details">
                  <p className="cart-item-name">{item.name}</p>
                  {attributesToRender &&
                    Object.entries(attributesToRender).map(([attrKey, value]) => (
                      <p
                        key={attrKey}
                        className="cart-item-option"
                        data-testid={`product-attribute-${attrKey.toLowerCase()}-${value}`}
                      >
                        {attrKey}: {value}
                      </p>
                    ))}
                  <p className="cart-item-price">
                    {item.price?.currency?.symbol || "$"}
                    {item.price?.amount || 0}
                  </p>
                </div>
                <div className="cart-item-quantity">
                  <button onClick={() => handleDecrease(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item, 1)}>+</button>
                </div>
                <div className="cart-item-image">
                  <img src={item.gallery[0]} alt={item.name} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="cart-total-container">
          <span className="cart-total-label">Total:</span>
          <span className="cart-total-amount">
            {displayCart.length > 0 &&
              (displayCart[0].price?.currency?.symbol || "$")}
            {totalPrice.toFixed(2)}
          </span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={displayCart.length === 0 || loading}
          className={`place-order-btn ${displayCart.length === 0 ? "disabled" : "active"}`}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
        {error && (
          <p className="error">Failed to place order. Please try again.</p>
        )}
      </div>
    </>
  );

  const modalContainer = document.getElementById("modal-root") || document.body;
  return ReactDOM.createPortal(overlayContent, modalContainer);
};

export default CartOverlay;
