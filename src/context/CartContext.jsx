// context/CartContext.js
import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOverlayOpen, setIsCartOverlayOpen] = useState(false);

  const addToCart = (product, options = {}) => {
    // Default any missing attributes to the first available option.
    const finalOptions = { ...options };
    if (product.attributes && product.attributes.length > 0) {
      product.attributes.forEach((attr) => {
        if (!(attr.id in finalOptions)) {
          finalOptions[attr.id] = attr.items[0].value;
        }
      });
    }

    setCart((prevCart) => {
      // Look for an existing item with the same product id and options.
      const existingItem = prevCart.find(
        (item) =>
          item.id === product.id &&
          JSON.stringify(item.options) === JSON.stringify(finalOptions)
      );

      if (existingItem) {
        // Increase its quantity.
        return prevCart.map((item) =>
          item.id === product.id &&
          JSON.stringify(item.options) === JSON.stringify(finalOptions)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, options: finalOptions, quantity: 1 }];
      }
    });
    console.log("Added to cart:", product.name, "with options:", finalOptions);
    // Open the cart overlay when a product is added.
    setIsCartOverlayOpen(true);
  };

  const removeFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== product.id));
  };

  const updateQuantity = (product, increment) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + increment }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Helper functions to control the cart overlay
  const openCartOverlay = () => setIsCartOverlayOpen(true);
  const closeCartOverlay = () => setIsCartOverlayOpen(false);
  const toggleCartOverlay = () => setIsCartOverlayOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOverlayOpen,
        openCartOverlay,
        closeCartOverlay,
        toggleCartOverlay,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
