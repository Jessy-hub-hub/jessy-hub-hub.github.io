import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TO_CART } from '../graphql/mutations';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

// Helper function to generate a slug from text
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');    // Replace multiple - with single -
};

// Custom helper to override slug for specific products
const getSlug = (product) => {
  if (product.id === "ps-5") return "playstation-5";
  return slugify(product.name);
};

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [addToCart, { loading, error }] = useMutation(ADD_TO_CART);
  const navigate = useNavigate();

  // Use our custom getSlug so that product with id "ps-5" becomes "playstation-5"
  const productSlug = getSlug(product);

  const handleCardClick = () => {
    // Navigate to /product/{slug}
    navigate(`/product/${productSlug}`);
  };

  const handleAddToCart = (e) => {
    // Stop propagation so clicking "Add to Cart" doesn't trigger navigation
    e.stopPropagation();
    addToCart({
      variables: { productId: product.id, quantity, attributes: product.attributes },
      onCompleted: (data) => {
        console.log('Item added to cart:', data.addToCart);
      },
      onError: (err) => {
        console.error('Error adding to cart:', err);
      }
    });
  };

  const handleQuantityChange = (e, change) => {
    // Prevent navigation when clicking quantity buttons
    e.stopPropagation();
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
  };

  return (
    <div
      className="product-card"
      data-testid={`product-${productSlug}`}
      onClick={handleCardClick}
    >
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <div className="quantity" onClick={(e) => e.stopPropagation()}>
        <button onClick={(e) => handleQuantityChange(e, -1)}>-</button>
        <span>{quantity}</span>
        <button onClick={(e) => handleQuantityChange(e, 1)}>+</button>
      </div>
      <button onClick={handleAddToCart} disabled={loading}>
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
};

export default ProductCard;
