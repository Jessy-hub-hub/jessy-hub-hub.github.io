// context/CartContext.js
import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOverlayOpen, setIsCartOverlayOpen] = useState(false);

  const addToCart = (product, options) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.id === product.id &&
          JSON.stringify(item.options) === JSON.stringify(options)
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id &&
          JSON.stringify(item.options) === JSON.stringify(options)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, options, quantity: 1 }];
      }
    });
    console.log("Added to cart:", product.name, "with options:", options);
    // Open the overlay when an item is added
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
