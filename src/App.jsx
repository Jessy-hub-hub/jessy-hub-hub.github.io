import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CartOverlay from "./components/CartOverlay";
import { CartProvider } from "./context/CartContext";
import ProductListingPage from "./components/ProductListingPage";
import ProductDetailsPage from "./components/ProductDetailsPage";
import "./App.css";

function App() {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const toggleOverlay = () => setIsOverlayVisible((prev) => !prev);

  return (
    <CartProvider>
      <Router>
        <Header toggleOverlay={toggleOverlay} />
        {isOverlayVisible && <CartOverlay onClose={toggleOverlay} />}
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/all" element={<ProductListingPage />} />
          <Route path="/tech" element={<ProductListingPage />} />
          <Route path="/clothes" element={<ProductListingPage />} />
          {/* IMPORTANT: PDP route uses ":slug" */}
          <Route
            path="/product/:slug"
            element={<ProductDetailsPage toggleOverlay={toggleOverlay} />}
          />
          <Route path="*" element={<ProductListingPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
