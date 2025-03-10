import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = sessionStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [isCartOverlayOpen, setIsCartOverlayOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const optionsMatch = (optionsA, optionsB) => {
    console.log("Matching options:", optionsA, optionsB);
    return (
      Object.keys(optionsA).length === Object.keys(optionsB).length &&
      Object.entries(optionsA).every(([key, value]) => optionsB[key] === value)
    );
  };

  const addToCart = (product, options = {}) => {
    // Set default options if not provided
    const finalOptions = { ...options };
    if (product.attributes?.length) {
      product.attributes.forEach((attr) => {
        if (!(attr.id in finalOptions)) {
          finalOptions[attr.id] = attr.items[0].value;
        }
      });
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && optionsMatch(item.options, finalOptions)
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && optionsMatch(item.options, finalOptions)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, options: finalOptions, quantity: 1 }];
      }
    });

    setIsCartOverlayOpen(true);
  };

  const removeFromCart = (product, options = {}) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === product.id && optionsMatch(item.options, options)))
    );
  };

  const updateQuantity = (product, increment, options = {}) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === product.id && optionsMatch(item.options, options)) {
            const newQuantity = item.quantity + increment;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item) => item !== null)
    );
  };

  const clearCart = () => setCart([]);
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
