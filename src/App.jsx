// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CartOverlay from "./components/CartOverlay";
import { CartProvider, useCart } from "./context/CartContext";
import ProductListingPage from "./components/ProductListingPage";
import ProductDetailsPage from "./components/ProductDetailsPage";
import "./App.css";

const AppContent = () => {
  const { isCartOverlayOpen, closeCartOverlay } = useCart();

  return (
    <>
      <Header />
      <CartOverlay isOpen={isCartOverlayOpen} onClose={closeCartOverlay} />
      <Routes>
        <Route path="/" element={<ProductListingPage />} />
        <Route path="/all" element={<ProductListingPage />} />
        <Route path="/tech" element={<ProductListingPage />} />
        <Route path="/clothes" element={<ProductListingPage />} />
        {/* IMPORTANT: PDP route uses ":slug" */}
        <Route path="/product/:slug" element={<ProductDetailsPage />} />
        <Route path="*" element={<ProductListingPage />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
