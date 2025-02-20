import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_ID } from "../graphql/queries";
import { useCart } from "../context/CartContext";
import { slugify } from "../utils/slugify.js";
import "./ProductDetailsPage.css";

const ProductDetailsPage = ({ toggleOverlay }) => {
  // 1) The URL param is "slug" (NOT "ps-5" but "playstation-5")
  const { slug } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCT_BY_ID);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // 2) Find the product by matching slugify(p.name) to the route param
  const product = data.products.find((p) => slugify(p.name) === slug);

  if (!product) {
    return <p>Product not found.</p>;
  }

  // 3) Additional logic for images, attributes, etc.
  const handleImageNavigation = (direction) => {
    if (direction === "prev") {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? product.gallery.length - 1 : prevIndex - 1
      );
    } else {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === product.gallery.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handleAttributeSelect = (attributeId, value) => {
    setSelectedAttributes((prev) => ({ ...prev, [attributeId]: value }));
  };

  const allAttributesSelected = product.attributes.every((attr) =>
    selectedAttributes.hasOwnProperty(attr.id)
  );

  const handleAddToCart = () => {
    const productWithPrice = { ...product, price: product.prices[0] };
    addToCart(productWithPrice, selectedAttributes);
    if (toggleOverlay) {
      toggleOverlay();
    }
  };

  return (
    <div className="product-details-page" data-testid={`product-${slug}`}>
      <div className="product-image-section">
        <div className="thumbnails">
          {product.gallery.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index}`}
              className={currentImageIndex === index ? "thumbnail active" : "thumbnail"}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
        <div className="main-image-wrapper">
          <button
            className="arrow left-arrow"
            onClick={() => handleImageNavigation("prev")}
          >
            &#9664;
          </button>
          <img
            className="main-image"
            src={product.gallery[currentImageIndex]}
            alt={product.name}
          />
          <button
            className="arrow right-arrow"
            onClick={() => handleImageNavigation("next")}
          >
            &#9654;
          </button>
        </div>
      </div>

      <div className="product-details-section">
        <h1 className="product-name">{product.name}</h1>

        {product.attributes.map((attribute) => (
          <div key={attribute.id} className="attribute-set">
            <h3>{attribute.name}</h3>
            <div data-testid={`product-attribute-${attribute.id.toLowerCase()}`}>
              {attribute.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAttributeSelect(attribute.id, item.value)}
                  className={`attribute-button ${
                    selectedAttributes[attribute.id] === item.value ? "selected" : ""
                  }`}
                  style={
                    attribute.type === "swatch"
                      ? { backgroundColor: item.value }
                      : {}
                  }
                >
                  {attribute.type !== "swatch" ? item.displayValue : ""}
                </button>
              ))}
            </div>
          </div>
        ))}

        <h3>Price</h3>
        <p className="product-price">
          {product.prices[0].currency.symbol}
          {product.prices[0].amount.toFixed(2)}
        </p>

        <button
          className="add-to-cart-btn"
          data-testid="add-to-cart"
          disabled={!allAttributesSelected}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

        <div data-testid="product-description" className="product-description">
          {product.description}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
