// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import CartOverlay from "./components/CartOverlay";
import { CartProvider, useCart } from "./context/CartContext";
import ProductListingPage from "./components/ProductListingPage";
import ProductDetailsPage from "./components/ProductDetailsPage";
import Header from "./components/Header";
import "./App.css";

const AppContent = () => {
  const { isCartOverlayOpen, closeCartOverlay } = useCart();

  return (
    <>
      <CartOverlay isOpen={isCartOverlayOpen} onClose={closeCartOverlay} />
      <div className="container">
        <Header />
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/all" element={<ProductListingPage />} />
          <Route path="/tech" element={<ProductListingPage />} />
          <Route path="/clothes" element={<ProductListingPage />} />
          <Route path="/product/:slug" element={<ProductDetailsPage />} />
          <Route path="*" element={<ProductListingPage />} />
        </Routes>
      </div>
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
